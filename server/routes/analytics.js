import express from 'express';
import { ObjectId } from 'mongodb';
import { getDb } from '../db/database.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticate);

// GET /api/analytics/summary — dashboard stats
router.get('/summary', async (req, res) => {
    try {
        const db = getDb();
        const userId = new ObjectId(req.user.id);

        const [
            active_cards,
            total_cards,
            paused_cards,
            revoked_cards,
            unread_count
        ] = await Promise.all([
            db.collection('virtual_cards').countDocuments({ user_id: userId, status: 'active' }),
            db.collection('virtual_cards').countDocuments({ user_id: userId }),
            db.collection('virtual_cards').countDocuments({ user_id: userId, status: 'paused' }),
            db.collection('virtual_cards').countDocuments({ user_id: userId, status: 'revoked' }),
            db.collection('notifications').countDocuments({ user_id: userId, is_read: 0 })
        ]);

        const spendAgg = await db.collection('transactions').aggregate([
            { $match: { user_id: userId } },
            { $group: {
                _id: null,
                total_spent: { $sum: { $cond: [{ $eq: ['$status', 'approved'] }, '$amount', 0] } },
                total_blocked: { $sum: { $cond: [{ $in: ['$status', ['blocked', 'limit_exceeded']] }, '$amount', 0] } },
                blocked_count: { $sum: { $cond: [{ $in: ['$status', ['blocked', 'limit_exceeded']] }, 1, 0] } }
            }}
        ]).toArray();

        const spendStats = spendAgg[0] || { total_spent: 0, total_blocked: 0, blocked_count: 0 };

        // Monthly estimate
        const estimateAgg = await db.collection('virtual_cards').aggregate([
            { $match: { user_id: userId, status: 'active' } },
            {
                $lookup: {
                    from: 'transactions',
                    localField: '_id',
                    foreignField: 'card_id',
                    pipeline: [
                        { $match: { status: 'approved' } },
                        { $sort: { created_at: -1 } },
                        { $limit: 1 }
                    ],
                    as: 'last_tx'
                }
            },
            {
                $group: {
                    _id: null,
                    monthly_estimate: { $sum: { $ifNull: [{ $arrayElemAt: ['$last_tx.amount', 0] }, 0] } }
                }
            }
        ]).toArray();

        const monthlyEstimate = estimateAgg[0]?.monthly_estimate || 0;

        const user = await db.collection('users').findOne({ _id: userId });

        res.json({
            active_cards,
            total_cards,
            paused_cards,
            revoked_cards,
            total_spent: spendStats.total_spent,
            total_blocked: spendStats.total_blocked,
            blocked_count: spendStats.blocked_count,
            monthly_estimate: monthlyEstimate,
            main_balance: user ? user.main_balance : 0,
            unread_notifications: unread_count,
        });
    } catch (err) {
        console.error('[Analytics] Summary error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/analytics/monthly — spending trend (last 6 months)
router.get('/monthly', async (req, res) => {
    try {
        const db = getDb();
        const userId = new ObjectId(req.user.id);

        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const monthsAgg = await db.collection('transactions').aggregate([
            {
                $match: {
                    user_id: userId,
                    created_at: { $gte: sixMonthsAgo.toISOString() }
                }
            },
            {
                $group: {
                    _id: { $substr: ['$created_at', 0, 7] },
                    spent: { $sum: { $cond: [{ $eq: ['$status', 'approved'] }, '$amount', 0] } },
                    blocked: { $sum: { $cond: [{ $in: ['$status', ['blocked', 'limit_exceeded']] }, '$amount', 0] } },
                    approved_count: { $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] } },
                    blocked_count: { $sum: { $cond: [{ $in: ['$status', ['blocked', 'limit_exceeded']] }, 1, 0] } }
                }
            },
            {
                $project: {
                    _id: 0,
                    month: '$_id',
                    spent: 1,
                    blocked: 1,
                    approved_count: 1,
                    blocked_count: 1
                }
            },
            { $sort: { month: 1 } }
        ]).toArray();

        res.json({ months: monthsAgg });
    } catch (err) {
        console.error('[Analytics] Monthly error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/analytics/by-merchant — spending breakdown by merchant
router.get('/by-merchant', async (req, res) => {
    try {
        const db = getDb();
        const userId = new ObjectId(req.user.id);

        const merchantsAgg = await db.collection('virtual_cards').aggregate([
            { $match: { user_id: userId } },
            {
                $lookup: {
                    from: 'transactions',
                    localField: '_id',
                    foreignField: 'card_id',
                    as: 'txs'
                }
            },
            {
                $project: {
                    merchant_name: 1,
                    merchant_category: 1,
                    card_status: '$status',
                    total_spent: {
                        $sum: {
                            $map: {
                                input: {
                                    $filter: {
                                        input: '$txs',
                                        as: 'tx',
                                        cond: { $eq: ['$$tx.status', 'approved'] }
                                    }
                                },
                                as: 'tx',
                                in: '$$tx.amount'
                            }
                        }
                    },
                    approved_charges: {
                        $size: {
                            $filter: {
                                input: '$txs',
                                as: 'tx',
                                cond: { $eq: ['$$tx.status', 'approved'] }
                            }
                        }
                    },
                    blocked_charges: {
                        $size: {
                            $filter: {
                                input: '$txs',
                                as: 'tx',
                                cond: { $in: ['$$tx.status', ['blocked', 'limit_exceeded']] }
                            }
                        }
                    }
                }
            },
            { $sort: { total_spent: -1 } }
        ]).toArray();

        res.json({ merchants: merchantsAgg });
    } catch (err) {
        console.error('[Analytics] By-merchant error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
