import express from 'express';
import { getDb } from '../db/database.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticate);

// GET /api/analytics/summary — dashboard stats
router.get('/summary', (req, res) => {
    try {
        const db = getDb();
        const userId = req.user.id;

        // Active cards count
        const active_cards_row = db.prepare(
            'SELECT COUNT(*) as active_cards FROM virtual_cards WHERE user_id = ? AND status = ?'
        ).get(userId, 'active');
        const active_cards = active_cards_row ? active_cards_row.active_cards : 0;

        // Total cards
        const total_cards_row = db.prepare(
            'SELECT COUNT(*) as total_cards FROM virtual_cards WHERE user_id = ?'
        ).get(userId);
        const total_cards = total_cards_row ? total_cards_row.total_cards : 0;

        // Paused cards
        const paused_cards_row = db.prepare(
            'SELECT COUNT(*) as paused_cards FROM virtual_cards WHERE user_id = ? AND status = ?'
        ).get(userId, 'paused');
        const paused_cards = paused_cards_row ? paused_cards_row.paused_cards : 0;

        // Revoked cards
        const revoked_cards_row = db.prepare(
            'SELECT COUNT(*) as revoked_cards FROM virtual_cards WHERE user_id = ? AND status = ?'
        ).get(userId, 'revoked');
        const revoked_cards = revoked_cards_row ? revoked_cards_row.revoked_cards : 0;

        // Total spent (approved transactions)
        const spentRow = db.prepare(
            'SELECT COALESCE(SUM(amount), 0) as total_spent FROM transactions WHERE user_id = ? AND status = ?'
        ).get(userId, 'approved');

        // Total blocked (blocked + limit_exceeded)
        const blockedRow = db.prepare(
            "SELECT COALESCE(SUM(amount), 0) as total_blocked, COUNT(*) as blocked_count FROM transactions WHERE user_id = ? AND status IN ('blocked', 'limit_exceeded')"
        ).get(userId);

        // Monthly active subscription cost estimate (sum of last approved charge per active card)
        const monthlyEstimate = db.prepare(`
            SELECT COALESCE(SUM(latest_charge), 0) as monthly_estimate FROM (
                SELECT MAX(t.amount) as latest_charge
                FROM virtual_cards vc
                JOIN transactions t ON t.card_id = vc.id AND t.status = 'approved'
                WHERE vc.user_id = ? AND vc.status = 'active'
                GROUP BY vc.id
            )
        `).get(userId);

        // User balance
        const user = db.prepare('SELECT main_balance FROM users WHERE id = ?').get(userId);

        // Unread notifications count
        const unread_count_row = db.prepare(
            'SELECT COUNT(*) as unread_count FROM notifications WHERE user_id = ? AND is_read = 0'
        ).get(userId);
        const unread_count = unread_count_row ? unread_count_row.unread_count : 0;

        res.json({
            active_cards,
            total_cards,
            paused_cards,
            revoked_cards,
            total_spent: spentRow.total_spent,
            total_blocked: blockedRow.total_blocked,
            blocked_count: blockedRow.blocked_count,
            monthly_estimate: monthlyEstimate.monthly_estimate,
            main_balance: user ? user.main_balance : 0,
            unread_notifications: unread_count,
        });
    } catch (err) {
        console.error('[Analytics] Summary error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/analytics/monthly — spending trend (last 6 months)
router.get('/monthly', (req, res) => {
    try {
        const db = getDb();
        const userId = req.user.id;

        const months = db.prepare(`
            SELECT 
                strftime('%Y-%m', created_at) as month,
                SUM(CASE WHEN status = 'approved' THEN amount ELSE 0 END) as spent,
                SUM(CASE WHEN status IN ('blocked', 'limit_exceeded') THEN amount ELSE 0 END) as blocked,
                COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved_count,
                COUNT(CASE WHEN status IN ('blocked', 'limit_exceeded') THEN 1 END) as blocked_count
            FROM transactions
            WHERE user_id = ? AND created_at >= date('now', '-6 months')
            GROUP BY strftime('%Y-%m', created_at)
            ORDER BY month ASC
        `).all(userId);

        res.json({ months });
    } catch (err) {
        console.error('[Analytics] Monthly error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/analytics/by-merchant — spending breakdown by merchant
router.get('/by-merchant', (req, res) => {
    try {
        const db = getDb();
        const userId = req.user.id;

        const merchants = db.prepare(`
            SELECT 
                vc.merchant_name,
                vc.merchant_category,
                vc.status as card_status,
                COALESCE(SUM(CASE WHEN t.status = 'approved' THEN t.amount ELSE 0 END), 0) as total_spent,
                COUNT(CASE WHEN t.status = 'approved' THEN 1 END) as approved_charges,
                COUNT(CASE WHEN t.status IN ('blocked', 'limit_exceeded') THEN 1 END) as blocked_charges
            FROM virtual_cards vc
            LEFT JOIN transactions t ON t.card_id = vc.id
            WHERE vc.user_id = ?
            GROUP BY vc.id
            ORDER BY total_spent DESC
        `).all(userId);

        res.json({ merchants });
    } catch (err) {
        console.error('[Analytics] By-merchant error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
