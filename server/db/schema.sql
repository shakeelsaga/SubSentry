-- SubSentry Database Schema

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    main_balance REAL DEFAULT 10000.00,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS virtual_cards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    card_number TEXT UNIQUE NOT NULL,
    cvv TEXT NOT NULL,
    expiry_month INTEGER NOT NULL,
    expiry_year INTEGER NOT NULL,
    merchant_name TEXT NOT NULL,
    merchant_category TEXT DEFAULT 'general',
    spend_limit REAL,
    spent_total REAL DEFAULT 0.0,
    burn_date DATETIME,
    status TEXT DEFAULT 'active', -- active, paused, revoked
    color TEXT DEFAULT '#6366f1',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    card_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    merchant_name TEXT NOT NULL,
    amount REAL NOT NULL,
    status TEXT NOT NULL, -- approved, blocked, limit_exceeded
    reason TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (card_id) REFERENCES virtual_cards (id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    related_card_id INTEGER,
    is_read INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (related_card_id) REFERENCES virtual_cards (id) ON DELETE SET NULL
);
