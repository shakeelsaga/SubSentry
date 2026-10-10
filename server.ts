import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { connectDb, getDb } from "./server/db/database.js";

// Routes
import authRoutes from "./server/routes/auth.js";
import cardRoutes from "./server/routes/cards.js";
import transactionRoutes from "./server/routes/transactions.js";
import analyticsRoutes from "./server/routes/analytics.js";
import notificationRoutes from "./server/routes/notifications.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT || 3001);

  // Initialize DB
  await connectDb();

  app.use(cors());
  app.use(express.json());

  // API routes
  app.use("/api/auth", authRoutes);
  app.use("/api/cards", cardRoutes);
  app.use("/api/transactions", transactionRoutes);
  app.use("/api/analytics", analyticsRoutes);
  app.use("/api/notifications", notificationRoutes);

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", service: "SubSentry API", timestamp: new Date().toISOString() });
  });

  // Burn-date enforcement
  async function enforceBurnDates() {
    try {
      const db = getDb();
      const now = new Date();
      const expired = await db.collection('virtual_cards').find({
        burn_date: { $ne: null, $lte: now.toISOString() }, // Depending on how it's stored, maybe just now
        status: { $ne: 'revoked' }
      }).toArray();

      for (const card of expired) {
        await db.collection('virtual_cards').updateOne(
          { _id: card._id },
          { $set: { status: 'revoked', updated_at: new Date().toISOString() } }
        );
        await db.collection('notifications').insertOne({
          user_id: card.user_id,
          type: 'burn_executed',
          title: 'Card Auto-Revoked',
          message: `Your virtual card for ${card.merchant_name} was automatically revoked because the burn date was reached.`,
          related_card_id: card._id.toString(),
          is_read: 0,
          created_at: new Date().toISOString()
        });
        console.log(`[Burn] Auto-revoked card ${card._id} for ${card.merchant_name}`);
      }
    } catch (err) {
      console.error('[Burn] Error enforcing burn dates:', err);
    }
  }

  enforceBurnDates();
  setInterval(enforceBurnDates, 60000);

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
