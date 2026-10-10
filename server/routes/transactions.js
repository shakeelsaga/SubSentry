import express from 'express';
import { getDb } from '../db/database.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// GET /api/transactions — list all user transactions (paginated)
router.get('/', authenticate, (req, res) => {
    try {
        const db = getDb();
        const { status, card_id, limit = 50, offset = 0 } = req.query;

        let query = 'SELECT t.*, vc.card_number, vc.merchant_category FROM transactions t JOIN virtual_cards vc ON t.card_id = vc.id WHERE t.user_id = ?';
        const params = [req.user.id];

        if (card_id) {
            query += ' AND t.card_id = ?';
            params.push(parseInt(card_id));
        }

        if (status && ['approved', 'blocked', 'limit_exceeded'].includes(status)) {
            query += ' AND t.status = ?';
            params.push(status);
        }

        query += ' ORDER BY t.created_at DESC LIMIT ? OFFSET ?';
        params.push(parseInt(limit), parseInt(offset));

        const transactions = db.prepare(query).all(...params);

        // Get total count for pagination
        let countQuery = 'SELECT COUNT(*) as total FROM transactions WHERE user_id = ?';
        const countParams = [req.user.id];
        if (status && ['approved', 'blocked', 'limit_exceeded'].includes(status)) {
            countQuery += ' AND status = ?';
            countParams.push(status);
        }
        const { total } = db.prepare(countQuery).get(...countParams);

        res.json({ transactions, total, limit: parseInt(limit), offset: parseInt(offset) });
    } catch (err) {
        console.error('[Transactions] List error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /api/transactions/simulate — Mock Checkout (merchant charge simulation)
router.post('/simulate', (req, res) => {
    try {
        const { card_number, amount } = req.body;

        if (!card_number || !amount) {
            return res.status(400).json({ error: 'Card number and amount are required' });
        }

        const chargeAmount = parseFloat(amount);
        if (isNaN(chargeAmount) || chargeAmount <= 0) {
            return res.status(400).json({ error: 'Amount must be a positive number' });
        }

        const db = getDb();

        // Look up the card (no auth needed — this simulates an external merchant)
        const card = db.prepare('SELECT * FROM virtual_cards WHERE card_number = ?').get(card_number.replace(/\s/g, ''));

        if (!card) {
            return res.status(404).json({
                result: 'DECLINED',
                reason: 'Card not found',
                message: 'The card number provided does not exist in the system.',
            });
        }

        const user = db.prepare('SELECT * FROM users WHERE id = ?').get(card.user_id);

        if (!user) {
             return res.status(404).json({
                result: 'DECLINED',
                reason: 'User not found',
                message: 'The card owner does not exist.',
            });
        }

        // Evaluate transaction
        let txStatus, reason, notificationType, notificationTitle, notificationMessage;

        if (card.status === 'paused') {
            txStatus = 'blocked';
            reason = 'Card is frozen/paused by cardholder';
            notificationType = 'charge_blocked';
            notificationTitle = 'Charge Blocked';
            notificationMessage = `A charge of $${chargeAmount.toFixed(2)} from ${card.merchant_name} was blocked. Your card is paused.`;
        } else if (card.status === 'revoked') {
            txStatus = 'blocked';
            reason = 'Card has been permanently revoked by cardholder';
            notificationType = 'charge_blocked';
            notificationTitle = 'Charge Blocked';
            notificationMessage = `A charge of $${chargeAmount.toFixed(2)} from ${card.merchant_name} was blocked. This card has been revoked.`;
        } else if (card.spend_limit && (card.spent_total + chargeAmount) > card.spend_limit) {
            txStatus = 'limit_exceeded';
            reason = `Spend limit exceeded ($${card.spent_total.toFixed(2)} spent of $${card.spend_limit.toFixed(2)} limit)`;
            notificationType = 'spend_alert';
            notificationTitle = 'Spend Limit Reached';
            notificationMessage = `A charge of $${chargeAmount.toFixed(2)} from ${card.merchant_name} was blocked because it exceeds your spend limit of $${card.spend_limit.toFixed(2)}.`;
        } else if (user.main_balance < chargeAmount) {
            txStatus = 'blocked';
            reason = 'Insufficient funds in main balance';
            notificationType = 'charge_blocked';
            notificationTitle = 'Charge Blocked';
            notificationMessage = `A charge of $${chargeAmount.toFixed(2)} from ${card.merchant_name} was blocked due to insufficient funds.`;
        } else {
            // APPROVED
            txStatus = 'approved';
            reason = null;
            notificationType = 'charge_approved';
            notificationTitle = 'Charge Approved';
            notificationMessage = `A charge of $${chargeAmount.toFixed(2)} from ${card.merchant_name} was approved.`;

            // Deduct from main balance and increment spent_total
            db.prepare('UPDATE users SET main_balance = main_balance - ? WHERE id = ?').run(chargeAmount, user.id);
            db.prepare('UPDATE virtual_cards SET spent_total = spent_total + ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(chargeAmount, card.id);
        }

        // Log transaction
        const txResult = db.prepare(`
            INSERT INTO transactions (card_id, user_id, merchant_name, amount, status, reason)
            VALUES (?, ?, ?, ?, ?, ?)
        `).run(card.id, user.id, card.merchant_name, chargeAmount, txStatus, reason);

        // Create notification
        db.prepare(`
            INSERT INTO notifications (user_id, type, title, message, related_card_id)
            VALUES (?, ?, ?, ?, ?)
        `).run(user.id, notificationType, notificationTitle, notificationMessage, card.id);

        const transaction = db.prepare('SELECT * FROM transactions WHERE id = ?').get(txResult.lastInsertRowid);

        const resultLabel = txStatus === 'approved' ? 'APPROVED' : 'DECLINED';

        res.json({
            result: resultLabel,
            status: txStatus,
            reason: reason || 'Transaction approved',
            transaction,
            merchant_name: card.merchant_name,
            amount: chargeAmount,
            card_status: card.status,
            message: txStatus === 'approved'
                ? `✅ Charge of $${chargeAmount.toFixed(2)} approved for ${card.merchant_name}`
                : `🛡️ Charge of $${chargeAmount.toFixed(2)} blocked for ${card.merchant_name}: ${reason}`,
        });
    } catch (err) {
        console.error('[Transactions] Simulate error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
