import express from 'express';
import bcrypt from 'bcryptjs';
import { getDb } from '../db/database.js';
import { authenticate, generateToken } from '../middleware/auth.js';

const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { full_name, email, password } = req.body;

        if (!full_name || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        const db = getDb();

        // Check if email already exists
        const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase());
        if (existing) {
            return res.status(409).json({ error: 'An account with this email already exists' });
        }

        const password_hash = await bcrypt.hash(password, 12);

        const result = db.prepare(
            'INSERT INTO users (full_name, email, password_hash) VALUES (?, ?, ?)'
        ).run(full_name.trim(), email.toLowerCase().trim(), password_hash);

        const user = db.prepare('SELECT id, full_name, email, main_balance, created_at FROM users WHERE id = ?').get(result.lastInsertRowid);

        const token = generateToken(user);

        res.status(201).json({
            message: 'Account created successfully',
            token,
            user,
        });
    } catch (err) {
        console.error('[Auth] Register error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const db = getDb();
        const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase().trim());

        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const token = generateToken(user);

        // Don't send password hash to client
        const { password_hash, ...safeUser } = user;

        res.json({
            message: 'Login successful',
            token,
            user: safeUser,
        });
    } catch (err) {
        console.error('[Auth] Login error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/auth/me
router.get('/me', authenticate, (req, res) => {
    try {
        const db = getDb();
        const user = db.prepare('SELECT id, full_name, email, main_balance, created_at FROM users WHERE id = ?').get(req.user.id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ user });
    } catch (err) {
        console.error('[Auth] Me error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
