import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/subsentry';

let db;
let client;

export async function connectDb() {
    if (!db) {
        client = new MongoClient(MONGODB_URI);
        await client.connect();
        db = client.db(); // uses db name from URI

        // Create indexes for performance
        await db.collection('users').createIndex({ email: 1 }, { unique: true });
        await db.collection('virtual_cards').createIndex({ user_id: 1 });
        await db.collection('virtual_cards').createIndex({ card_number: 1 }, { unique: true });
        await db.collection('transactions').createIndex({ user_id: 1 });
        await db.collection('transactions').createIndex({ card_id: 1 });
        await db.collection('notifications').createIndex({ user_id: 1 });

        console.log('[DB] Connected to MongoDB');
    }
    return db;
}

export function getDb() {
    if (!db) throw new Error('Database not initialized. Call connectDb() first.');
    return db;
}
