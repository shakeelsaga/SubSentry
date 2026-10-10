import express from 'express';
import { ObjectId } from 'mongodb';
import { getDb } from '../db/database.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

function sanitizeTransaction(tx) {
    if (!tx) return tx;
    const { _id, user_id, card_id, ...rest } = tx;
    return { id: _id.toString(), user_id: user_id.toString(), card_id: card_id.toString(), ...rest };
}

// GET /api/transactions — list all user transactions (paginated)
router.get('/', authenticate, async (req, res) => {
    try {
        const db = getDb();
        const { status, card_id, limit = 50, offset = 0 } = req.query;

        const matchStage = { user_id: new ObjectId(req.user.id) };

        if (card_id) {
            matchStage.card_id = new ObjectId(card_id);
        }

        if (status && ['approved', 'blocked', 'limit_exceeded'].includes(status)) {
            matchStage.status = status;
        }

        const limitNum = parseInt(limit, 10);
        const offsetNum = parseInt(offset, 10);

        const pipeline = [
            { $match: matchStage },
            { $sort: { created_at: -1 } },
            { $skip: offsetNum },
            { $limit: limitNum },
            {
                $lookup: {
                    from: 'virtual_cards',
                    localField: 'card_id',
                    foreignField: '_id',
                    as: 'card'
                }
            },
            { $unwind: '$card' },
            {
                $addFields: {
                    card_number: '$card.card_number',
                    merchant_category: '$card.merchant_category'
                }
            },
            { $project: { card: 0 } }
        ];

        const transactions = await db.collection('transactions').aggregate(pipeline).toArray();
        const total = await db.collection('transactions').countDocuments(matchStage);

        res.json({
            transactions: transactions.map(sanitizeTransaction),
            total,
            limit: limitNum,
            offset: offsetNum
        });
    } catch (err) {
        console.error('[Transactions] List error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /api/transactions/simulate — Mock Checkout (merchant charge simulation)
router.post('/simulate', async (req, res) => {
    try {
        const { card_number, amount, merchant_name } = req.body;

        if (!card_number || !amount) {
            return res.status(400).json({ error: 'Card number and amount are required' });
        }

        const chargeAmount = parseFloat(amount);
        if (isNaN(chargeAmount) || chargeAmount <= 0) {
            return res.status(400).json({ error: 'Amount must be a positive number' });
        }

        const db = getDb();

        // Look up the card. This route is public to mimic an external merchant authorization request.
        const card = await db.collection('virtual_cards').findOne({ card_number: card_number.replace(/\s/g, '') });

        if (!card) {
            return res.status(404).json({
                result: 'DECLINED',
                reason: 'Card not found',
                message: 'The card number provided does not exist in the system.',
            });
        }

        const user = await db.collection('users').findOne({ _id: card.user_id });

        if (!user) {
             return res.status(404).json({
                result: 'DECLINED',
                reason: 'User not found',
                message: 'The card owner does not exist.',
            });
        }

        // Evaluate transaction
        let txStatus, reason, notificationType, notificationTitle, notificationMessage;

        const requestedMerchant = typeof merchant_name === 'string' ? merchant_name.trim() : '';
        const normalizedRequestedMerchant = requestedMerchant.toLowerCase();
        const normalizedLockedMerchant = card.merchant_name.toLowerCase();

        const transactionMerchant = requestedMerchant || card.merchant_name;

        if (requestedMerchant && normalizedRequestedMerchant !== normalizedLockedMerchant) {
            txStatus = 'blocked';
            reason = `Unauthorized merchant origin: ${requestedMerchant}. Card is locked to ${card.merchant_name}`;
            notificationType = 'charge_blocked';
            notificationTitle = 'Merchant Lock Blocked Charge';
            notificationMessage = `A charge of ₹${chargeAmount.toFixed(2)} from ${requestedMerchant} was blocked because this card is locked to ${card.merchant_name}.`;
        } else if (card.status === 'paused') {
            txStatus = 'blocked';
            reason = 'Card is frozen/paused by cardholder';
            notificationType = 'charge_blocked';
            notificationTitle = 'Charge Blocked';
            notificationMessage = `A charge of ₹${chargeAmount.toFixed(2)} from ${transactionMerchant} was blocked. Your card is paused.`;
        } else if (card.status === 'revoked') {
            txStatus = 'blocked';
            reason = 'Card has been permanently revoked by cardholder';
            notificationType = 'charge_blocked';
            notificationTitle = 'Charge Blocked';
            notificationMessage = `A charge of ₹${chargeAmount.toFixed(2)} from ${transactionMerchant} was blocked. This card has been revoked.`;
        } else if (card.spend_limit && (card.spent_total + chargeAmount) > card.spend_limit) {
            txStatus = 'limit_exceeded';
            reason = `Spend limit exceeded (₹${card.spent_total.toFixed(2)} spent of ₹${card.spend_limit.toFixed(2)} limit)`;
            notificationType = 'spend_alert';
            notificationTitle = 'Spend Limit Reached';
            notificationMessage = `A charge of ₹${chargeAmount.toFixed(2)} from ${transactionMerchant} was blocked because it exceeds your spend limit of ₹${card.spend_limit.toFixed(2)}.`;
        } else if (user.main_balance < chargeAmount) {
            txStatus = 'blocked';
            reason = 'Insufficient funds in main balance';
            notificationType = 'charge_blocked';
            notificationTitle = 'Charge Blocked';
            notificationMessage = `A charge of ₹${chargeAmount.toFixed(2)} from ${transactionMerchant} was blocked due to insufficient funds.`;
        } else {
            // APPROVED
            txStatus = 'approved';
            reason = null;
            notificationType = 'charge_approved';
            notificationTitle = 'Charge Approved';
            notificationMessage = `A charge of ₹${chargeAmount.toFixed(2)} from ${card.merchant_name} was approved.`;

            // Deduct from main balance and increment spent_total
            await db.collection('users').updateOne(
                { _id: user._id },
                { $inc: { main_balance: -chargeAmount } }
            );
            await db.collection('virtual_cards').updateOne(
                { _id: card._id },
                {
                    $inc: { spent_total: chargeAmount },
                    $set: { updated_at: new Date().toISOString() }
                }
            );
        }

        // Log transaction
        const newTx = {
            card_id: card._id,
            user_id: user._id,
            merchant_name: transactionMerchant,
            amount: chargeAmount,
            status: txStatus,
            reason: reason,
            created_at: new Date().toISOString()
        };
        const txResult = await db.collection('transactions').insertOne(newTx);

        // Create notification
        await db.collection('notifications').insertOne({
            user_id: user._id,
            type: notificationType,
            title: notificationTitle,
            message: notificationMessage,
            related_card_id: card._id.toString(),
            is_read: 0,
            created_at: new Date().toISOString()
        });

        const transaction = await db.collection('transactions').findOne({ _id: txResult.insertedId });

        const resultLabel = txStatus === 'approved' ? 'APPROVED' : 'DECLINED';

        res.json({
            result: resultLabel,
            status: txStatus,
            reason: reason || 'Transaction approved',
            transaction: sanitizeTransaction(transaction),
            merchant_name: card.merchant_name,
            requested_merchant_name: requestedMerchant || card.merchant_name,
            amount: chargeAmount,
            card_status: card.status,
            message: txStatus === 'approved'
                ? `Charge of ₹${chargeAmount.toFixed(2)} approved for ${card.merchant_name}`
                : `Charge of ₹${chargeAmount.toFixed(2)} blocked for ${transactionMerchant}: ${reason}`,
        });
    } catch (err) {
        console.error('[Transactions] Simulate error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
