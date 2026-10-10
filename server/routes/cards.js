import express from 'express';
import { ObjectId } from 'mongodb';
import { getDb } from '../db/database.js';
import { authenticate } from '../middleware/auth.js';
import { generateVirtualCard, getCategoryColor } from '../utils/cardGenerator.js';

const router = express.Router();

function sanitizeCard(card) {
    if (!card) return card;
    const { _id, user_id, ...rest } = card;
    return { id: _id.toString(), user_id: user_id.toString(), ...rest };
}

function sanitizeTransaction(tx) {
    if (!tx) return tx;
    const { _id, user_id, card_id, ...rest } = tx;
    return { id: _id.toString(), user_id: user_id.toString(), card_id: card_id.toString(), ...rest };
}

// All card routes require authentication
router.use(authenticate);

// GET /api/cards — list all user's virtual cards
router.get('/', async (req, res) => {
    try {
        const db = getDb();
        const { status, search } = req.query;

        const filter = { user_id: new ObjectId(req.user.id) };

        if (status && ['active', 'paused', 'revoked'].includes(status)) {
            filter.status = status;
        }

        if (search) {
            filter.merchant_name = { $regex: search, $options: 'i' };
        }

        const cards = await db.collection('virtual_cards')
            .find(filter)
            .sort({ created_at: -1 })
            .toArray();

        const cardsWithMeta = await Promise.all(cards.map(async card => {
            const count = await db.collection('transactions').countDocuments({ card_id: card._id });
            const sCard = sanitizeCard(card);
            return {
                ...sCard,
                transaction_count: count,
                is_burn_imminent: card.burn_date ? (new Date(card.burn_date) - new Date()) < 86400000 * 3 : false,
            };
        }));

        res.json({ cards: cardsWithMeta });
    } catch (err) {
        console.error('[Cards] List error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /api/cards — generate a new virtual card
router.post('/', async (req, res) => {
    try {
        const { merchant_name, merchant_category, spend_limit, burn_date } = req.body;

        if (!merchant_name || !merchant_name.trim()) {
            return res.status(400).json({ error: 'Merchant name is required' });
        }

        const db = getDb();
        const card = generateVirtualCard();
        const category = merchant_category || 'general';
        const color = getCategoryColor(category);

        const newCard = {
            user_id: new ObjectId(req.user.id),
            card_number: card.card_number,
            cvv: card.cvv,
            expiry_month: card.expiry_month,
            expiry_year: card.expiry_year,
            merchant_name: merchant_name.trim(),
            merchant_category: category,
            spend_limit: spend_limit || null,
            burn_date: burn_date || null,
            color,
            status: 'active',
            spent_total: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        const result = await db.collection('virtual_cards').insertOne(newCard);
        const insertedCard = await db.collection('virtual_cards').findOne({ _id: result.insertedId });

        res.status(201).json({
            message: `Virtual card created for ${merchant_name}`,
            card: sanitizeCard(insertedCard),
        });
    } catch (err) {
        console.error('[Cards] Create error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/cards/:id — get single card with transaction history
router.get('/:id', async (req, res) => {
    try {
        const db = getDb();
        const card = await db.collection('virtual_cards').findOne({
            _id: new ObjectId(req.params.id),
            user_id: new ObjectId(req.user.id)
        });

        if (!card) {
            return res.status(404).json({ error: 'Card not found' });
        }

        const transactions = await db.collection('transactions')
            .find({ card_id: card._id })
            .sort({ created_at: -1 })
            .limit(50)
            .toArray();

        res.json({
            card: sanitizeCard(card),
            transactions: transactions.map(sanitizeTransaction)
        });
    } catch (err) {
        console.error('[Cards] Get error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// PATCH /api/cards/:id/toggle — toggle active <-> paused
router.patch('/:id/toggle', async (req, res) => {
    try {
        const db = getDb();
        const card = await db.collection('virtual_cards').findOne({
            _id: new ObjectId(req.params.id),
            user_id: new ObjectId(req.user.id)
        });

        if (!card) {
            return res.status(404).json({ error: 'Card not found' });
        }

        if (card.status === 'revoked') {
            return res.status(400).json({ error: 'Cannot toggle a revoked card' });
        }

        const newStatus = card.status === 'active' ? 'paused' : 'active';

        await db.collection('virtual_cards').updateOne(
            { _id: card._id },
            { $set: { status: newStatus, updated_at: new Date().toISOString() } }
        );

        const updatedCard = await db.collection('virtual_cards').findOne({ _id: card._id });

        res.json({
            message: `Card ${newStatus === 'active' ? 'activated' : 'paused'}`,
            card: sanitizeCard(updatedCard),
        });
    } catch (err) {
        console.error('[Cards] Toggle error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// PATCH /api/cards/:id/revoke — permanently revoke
router.patch('/:id/revoke', async (req, res) => {
    try {
        const db = getDb();
        const card = await db.collection('virtual_cards').findOne({
            _id: new ObjectId(req.params.id),
            user_id: new ObjectId(req.user.id)
        });

        if (!card) {
            return res.status(404).json({ error: 'Card not found' });
        }

        if (card.status === 'revoked') {
            return res.status(400).json({ error: 'Card is already revoked' });
        }

        await db.collection('virtual_cards').updateOne(
            { _id: card._id },
            { $set: { status: 'revoked', updated_at: new Date().toISOString() } }
        );

        // Create notification
        await db.collection('notifications').insertOne({
            user_id: new ObjectId(req.user.id),
            type: 'card_expired',
            title: 'Card Revoked',
            message: `Your virtual card for ${card.merchant_name} has been permanently revoked. Future charges will be blocked.`,
            related_card_id: card._id.toString(),
            is_read: 0,
            created_at: new Date().toISOString()
        });

        const updatedCard = await db.collection('virtual_cards').findOne({ _id: card._id });

        res.json({
            message: `Card for ${card.merchant_name} permanently revoked`,
            card: sanitizeCard(updatedCard),
        });
    } catch (err) {
        console.error('[Cards] Revoke error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// PATCH /api/cards/:id — update spend limit or burn date
router.patch('/:id', async (req, res) => {
    try {
        const { spend_limit, burn_date } = req.body;
        const db = getDb();
        const card = await db.collection('virtual_cards').findOne({
            _id: new ObjectId(req.params.id),
            user_id: new ObjectId(req.user.id)
        });

        if (!card) {
            return res.status(404).json({ error: 'Card not found' });
        }

        if (card.status === 'revoked') {
            return res.status(400).json({ error: 'Cannot update a revoked card' });
        }

        const updates = { updated_at: new Date().toISOString() };

        if (spend_limit !== undefined) {
            updates.spend_limit = spend_limit === null ? null : parseFloat(spend_limit);
        }

        if (burn_date !== undefined) {
            updates.burn_date = burn_date;
        }

        if (Object.keys(updates).length === 1) { // Only updated_at
            return res.status(400).json({ error: 'No valid fields to update' });
        }

        await db.collection('virtual_cards').updateOne(
            { _id: card._id },
            { $set: updates }
        );

        const updatedCard = await db.collection('virtual_cards').findOne({ _id: card._id });

        res.json({
            message: 'Card updated',
            card: sanitizeCard(updatedCard),
        });
    } catch (err) {
        console.error('[Cards] Update error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
