import express from 'express';
import { getDb } from '../db/database.js';
import { authenticate } from '../middleware/auth.js';
import { generateVirtualCard, getCategoryColor } from '../utils/cardGenerator.js';

const router = express.Router();

// All card routes require authentication
router.use(authenticate);

// GET /api/cards — list all user's virtual cards
router.get('/', (req, res) => {
    try {
        const db = getDb();
        const { status, search } = req.query;

        let query = 'SELECT * FROM virtual_cards WHERE user_id = ?';
        const params = [req.user.id];

        if (status && ['active', 'paused', 'revoked'].includes(status)) {
            query += ' AND status = ?';
            params.push(status);
        }

        if (search) {
            query += ' AND merchant_name LIKE ?';
            params.push(`%${search}%`);
        }

        query += ' ORDER BY created_at DESC';

        const cards = db.prepare(query).all(...params);

        // Attach transaction count to each card
        const txCountStmt = db.prepare('SELECT COUNT(*) as count FROM transactions WHERE card_id = ?');
        const cardsWithMeta = cards.map(card => {
            const { count } = txCountStmt.get(card.id);
            return {
                ...card,
                transaction_count: count,
                is_burn_imminent: card.burn_date ? (new Date(card.burn_date) - new Date()) < 86400000 * 3 : false,
            };
        });

        res.json({ cards: cardsWithMeta });
    } catch (err) {
        console.error('[Cards] List error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /api/cards — generate a new virtual card
router.post('/', (req, res) => {
    try {
        const { merchant_name, merchant_category, spend_limit, burn_date } = req.body;

        if (!merchant_name || !merchant_name.trim()) {
            return res.status(400).json({ error: 'Merchant name is required' });
        }

        const db = getDb();
        const card = generateVirtualCard();
        const category = merchant_category || 'general';
        const color = getCategoryColor(category);

        const result = db.prepare(`
            INSERT INTO virtual_cards (user_id, card_number, cvv, expiry_month, expiry_year, merchant_name, merchant_category, spend_limit, burn_date, color)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
            req.user.id,
            card.card_number,
            card.cvv,
            card.expiry_month,
            card.expiry_year,
            merchant_name.trim(),
            category,
            spend_limit || null,
            burn_date || null,
            color
        );

        const newCard = db.prepare('SELECT * FROM virtual_cards WHERE id = ?').get(result.lastInsertRowid);

        res.status(201).json({
            message: `Virtual card created for ${merchant_name}`,
            card: newCard,
        });
    } catch (err) {
        console.error('[Cards] Create error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/cards/:id — get single card with transaction history
router.get('/:id', (req, res) => {
    try {
        const db = getDb();
        const card = db.prepare('SELECT * FROM virtual_cards WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);

        if (!card) {
            return res.status(404).json({ error: 'Card not found' });
        }

        const transactions = db.prepare(
            'SELECT * FROM transactions WHERE card_id = ? ORDER BY created_at DESC LIMIT 50'
        ).all(card.id);

        res.json({ card, transactions });
    } catch (err) {
        console.error('[Cards] Get error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// PATCH /api/cards/:id/toggle — toggle active <-> paused
router.patch('/:id/toggle', (req, res) => {
    try {
        const db = getDb();
        const card = db.prepare('SELECT * FROM virtual_cards WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);

        if (!card) {
            return res.status(404).json({ error: 'Card not found' });
        }

        if (card.status === 'revoked') {
            return res.status(400).json({ error: 'Cannot toggle a revoked card' });
        }

        const newStatus = card.status === 'active' ? 'paused' : 'active';

        db.prepare('UPDATE virtual_cards SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(newStatus, card.id);

        const updatedCard = db.prepare('SELECT * FROM virtual_cards WHERE id = ?').get(card.id);

        res.json({
            message: `Card ${newStatus === 'active' ? 'activated' : 'paused'}`,
            card: updatedCard,
        });
    } catch (err) {
        console.error('[Cards] Toggle error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// PATCH /api/cards/:id/revoke — permanently revoke
router.patch('/:id/revoke', (req, res) => {
    try {
        const db = getDb();
        const card = db.prepare('SELECT * FROM virtual_cards WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);

        if (!card) {
            return res.status(404).json({ error: 'Card not found' });
        }

        if (card.status === 'revoked') {
            return res.status(400).json({ error: 'Card is already revoked' });
        }

        db.prepare('UPDATE virtual_cards SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run('revoked', card.id);

        // Create notification
        db.prepare(`
            INSERT INTO notifications (user_id, type, title, message, related_card_id)
            VALUES (?, 'card_expired', 'Card Revoked', ?, ?)
        `).run(req.user.id, `Your virtual card for ${card.merchant_name} has been permanently revoked. Future charges will be blocked.`, card.id);

        const updatedCard = db.prepare('SELECT * FROM virtual_cards WHERE id = ?').get(card.id);

        res.json({
            message: `Card for ${card.merchant_name} permanently revoked`,
            card: updatedCard,
        });
    } catch (err) {
        console.error('[Cards] Revoke error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// PATCH /api/cards/:id — update spend limit or burn date
router.patch('/:id', (req, res) => {
    try {
        const { spend_limit, burn_date } = req.body;
        const db = getDb();
        const card = db.prepare('SELECT * FROM virtual_cards WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);

        if (!card) {
            return res.status(404).json({ error: 'Card not found' });
        }

        if (card.status === 'revoked') {
            return res.status(400).json({ error: 'Cannot update a revoked card' });
        }

        const updates = [];
        const params = [];

        if (spend_limit !== undefined) {
            updates.push('spend_limit = ?');
            params.push(spend_limit === null ? null : parseFloat(spend_limit));
        }

        if (burn_date !== undefined) {
            updates.push('burn_date = ?');
            params.push(burn_date);
        }

        if (updates.length === 0) {
            return res.status(400).json({ error: 'No valid fields to update' });
        }

        updates.push('updated_at = CURRENT_TIMESTAMP');
        params.push(card.id);

        db.prepare(`UPDATE virtual_cards SET ${updates.join(', ')} WHERE id = ?`).run(...params);

        const updatedCard = db.prepare('SELECT * FROM virtual_cards WHERE id = ?').get(card.id);

        res.json({
            message: 'Card updated',
            card: updatedCard,
        });
    } catch (err) {
        console.error('[Cards] Update error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
