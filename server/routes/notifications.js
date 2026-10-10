import express from 'express';
import { getDb } from '../db/database.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticate);

// GET /api/notifications — list user notifications
router.get('/', (req, res) => {
    try {
        const db = getDb();
        const { unread_only } = req.query;

        let query = 'SELECT * FROM notifications WHERE user_id = ?';
        const params = [req.user.id];

        if (unread_only === 'true') {
            query += ' AND is_read = 0';
        }

        query += ' ORDER BY created_at DESC LIMIT 50';

        const notifications = db.prepare(query).all(...params);

        const count_row = db.prepare('SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = 0').get(req.user.id);
        const count = count_row ? count_row.count : 0;

        res.json({ notifications, unread_count: count });
    } catch (err) {
        console.error('[Notifications] List error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// PATCH /api/notifications/:id/read — mark notification as read
router.patch('/:id/read', (req, res) => {
    try {
        const db = getDb();
        db.prepare('UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?').run(req.params.id, req.user.id);
        res.json({ message: 'Notification marked as read' });
    } catch (err) {
        console.error('[Notifications] Read error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// PATCH /api/notifications/read-all — mark all as read
router.patch('/read-all', (req, res) => {
    try {
        const db = getDb();
        db.prepare('UPDATE notifications SET is_read = 1 WHERE user_id = ?').run(req.user.id);
        res.json({ message: 'All notifications marked as read' });
    } catch (err) {
        console.error('[Notifications] Read all error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
