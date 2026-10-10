import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'server', 'db', 'subsentry.db');
const SCHEMA_PATH = path.join(process.cwd(), 'server', 'db', 'schema.sql');

let db;

export function getDb() {
    if (!db) {
        // Ensure directory exists
        const dbDir = path.dirname(DB_PATH);
        if (!fs.existsSync(dbDir)) {
            fs.mkdirSync(dbDir, { recursive: true });
        }

        db = new Database(DB_PATH);
        db.pragma('journal_mode = WAL');
        db.pragma('foreign_keys = ON');

        // Initialize schema
        const schema = fs.readFileSync(SCHEMA_PATH, 'utf-8');
        db.exec(schema);

        console.log('[DB] SQLite database initialized at', DB_PATH);
    }
    return db;
}
