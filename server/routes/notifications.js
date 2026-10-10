import express from 'express';
import { ObjectId } from 'mongodb';
import { getDb } from '../db/database.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticate);

function sanitizeNotification(notif) {
    if (!notif) return notif;
    const { _id, user_id, ...rest } = notif;
    return { id: _id.toString(), user_id: user_id.toString(), ...rest };
}

// GET /api/notifications — list user notifications
router.get('/', async (req, res) => {
    try {
        const db = getDb();
        const { unread_only } = req.query;
        const userId = new ObjectId(req.user.id);

        const filter = { user_id: userId };

        if (unread_only === 'true') {
            filter.is_read = 0;
        }

        const notifications = await db.collection('notifications')
            .find(filter)
            .sort({ created_at: -1 })
            .limit(50)
            .toArray();

        const count = await db.collection('notifications').countDocuments({ user_id: userId, is_read: 0 });

        res.json({ notifications: notifications.map(sanitizeNotification), unread_count: count });
    } catch (err) {
        console.error('[Notifications] List error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// PATCH /api/notifications/:id/read — mark notification as read
router.patch('/:id/read', async (req, res) => {
    try {
        const db = getDb();
        await db.collection('notifications').updateOne(
            { _id: new ObjectId(req.params.id), user_id: new ObjectId(req.user.id) },
            { $set: { is_read: 1 } }
        );
        res.json({ message: 'Notification marked as read' });
    } catch (err) {
        console.error('[Notifications] Read error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// PATCH /api/notifications/read-all — mark all as read
router.patch('/read-all', async (req, res) => {
    try {
        const db = getDb();
        await db.collection('notifications').updateMany(
            { user_id: new ObjectId(req.user.id) },
            { $set: { is_read: 1 } }
        );
        res.json({ message: 'All notifications marked as read' });
    } catch (err) {
        console.error('[Notifications] Read all error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
