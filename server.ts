import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { getDb } from "./server/db/database.js";

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
  const PORT = 3000;

  // Initialize DB
  getDb();

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
  function enforceBurnDates() {
    try {
      const db = getDb();
      const expired = db.prepare(`
        SELECT * FROM virtual_cards 
        WHERE burn_date IS NOT NULL 
        AND burn_date <= datetime('now') 
        AND status != 'revoked'
      `).all();

      for (const card of expired) {
        db.prepare('UPDATE virtual_cards SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run('revoked', card.id);
        db.prepare(`
          INSERT INTO notifications (user_id, type, title, message, related_card_id)
          VALUES (?, 'burn_executed', 'Card Auto-Revoked', ?, ?)
        `).run(
          card.user_id,
          `Your virtual card for ${card.merchant_name} was automatically revoked — burn date reached.`,
          card.id
        );
        console.log(`[Burn] Auto-revoked card ${card.id} for ${card.merchant_name}`);
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
