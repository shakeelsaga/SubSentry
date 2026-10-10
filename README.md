# SubSentry

SubSentry is a working prototype for subscription control through virtual cards. It lets a user create Luhn-valid card numbers, lock each card to a merchant, set spend limits, add burn dates, simulate charges, and review the transaction trail produced by those rules.

The cards in this project are simulated. They are useful for demonstrating the control flow of a card firewall, but they are not connected to Visa, Mastercard, Stripe Issuing, Marqeta, or any other payment network.

## What This Is

This repo contains a full-stack prototype with a React frontend, an Express API, JWT authentication, and MongoDB persistence.

The app demonstrates the core product loop: create a card for one subscription, set limits around that card, test charges in the simulator, and inspect the resulting approvals, blocks, analytics, and notifications.

Some parts are intentionally simplified. Authentication is real enough for a prototype with bcrypt and JWTs, but there is no email verification, password reset, or two-factor authentication. Card numbers pass a Luhn check, but they are stored in plain text and must not be treated as real payment credentials.

## How It Works

1. Register or log in from the vault screen.
2. Use the dashboard to see the simulated main balance, active cards, recent transactions, and spending trend.
3. Create a virtual card from the cards page. Each card has a merchant name, category, optional spend limit, and optional burn date.
4. Run a charge from the simulator by entering the card number, amount, and merchant origin.
5. The API evaluates the charge against deterministic rules: card exists, merchant matches the locked merchant, card is active, spend limit is not exceeded, and the user has enough simulated balance.
6. Approved charges reduce the user's main balance and increase the card's spent total.
7. Blocked charges are still recorded with a reason so the user can audit what happened.
8. Notifications are generated for charge approvals, blocked charges, spend alerts, card revocations, and burn-date revocations.
9. A server-side interval checks burn dates every 60 seconds and revokes expired cards.

## Running Locally

You need Node.js 18 or newer and MongoDB. A local MongoDB instance works, and MongoDB Atlas free tier works too.

Install dependencies:

```bash
npm install
```

Create a local environment file from the example:

```bash
cp .env.example .env
```

Set `JWT_SECRET` and `MONGODB_URI` in `.env`.

For local MongoDB, this is enough:

```env
PORT=3000
JWT_SECRET=replace_this_with_a_long_random_string
MONGODB_URI=mongodb://localhost:27017/subsentry
```

Start the app:

```bash
npm run dev
```

Open `http://localhost:3000`. On first run, register a new account. New users start with a simulated balance of `10000`.

## Code Map

`server.ts` starts Express, connects to MongoDB, mounts the API routes, runs the burn-date interval, and serves the Vite app in development or the built frontend in production.

`server/routes/` contains the API surface for auth, cards, transactions, analytics, and notifications.

`server/db/database.js` owns the MongoDB client and creates indexes for users, cards, transactions, and notifications.

`server/middleware/auth.js` verifies JWTs and attaches the authenticated user id to each protected request.

`server/utils/cardGenerator.js` generates card numbers that satisfy the Luhn algorithm, plus CVV and expiry values for the prototype.

`src/pages/` contains the frontend screens: landing page, login, dashboard, cards, card details, transactions, simulator, notifications, and settings.

`src/components/` contains shared UI such as the authenticated layout and card creation modal.

`src/services/api.ts` wraps browser `fetch` calls and attaches the JWT token for protected routes.

## API

All routes except registration, login, and transaction simulation expect an `Authorization: Bearer <token>` header.

### Auth

`POST /api/auth/register`

```json
{ "full_name": "Test User", "email": "test@example.com", "password": "password123" }
```

Returns `{ token, user }`.

`POST /api/auth/login`

```json
{ "email": "test@example.com", "password": "password123" }
```

Returns `{ token, user }`.

`GET /api/auth/me` returns the current user.

### Cards

`GET /api/cards` lists the user's cards. It accepts optional `status` and `search` query parameters.

`POST /api/cards` creates a virtual card.

```json
{
  "merchant_name": "Netflix",
  "merchant_category": "streaming",
  "spend_limit": 649,
  "burn_date": "2026-12-31"
}
```

`GET /api/cards/:id` returns one card and its recent transactions.

`PATCH /api/cards/:id/toggle` toggles a card between `active` and `paused`.

`PATCH /api/cards/:id/revoke` permanently revokes a card.

`PATCH /api/cards/:id` updates `spend_limit` or `burn_date`.

### Transactions

`GET /api/transactions` lists transactions. It accepts optional `status`, `card_id`, `limit`, and `offset` query parameters.

`POST /api/transactions/simulate` simulates an external merchant charge.

```json
{
  "card_number": "4242849210498824",
  "amount": 649,
  "merchant_name": "Netflix"
}
```

The response reports `APPROVED` or `DECLINED`, includes the transaction record, and includes the rule reason for blocked charges.

### Analytics

`GET /api/analytics/summary` returns dashboard totals including active cards, blocked count, total spent, blocked amount, monthly estimate, main balance, and unread notifications.

`GET /api/analytics/monthly` returns spending and blocked totals grouped by month.

`GET /api/analytics/by-merchant` returns merchant-level spending and block counts.

### Notifications

`GET /api/notifications` lists notifications. Add `?unread_only=true` to fetch unread items only.

`PATCH /api/notifications/:id/read` marks one notification as read.

`PATCH /api/notifications/read-all` marks all notifications as read.

## Data Model

MongoDB uses four collections.

`users`

```json
{
  "_id": "ObjectId",
  "full_name": "Test User",
  "email": "test@example.com",
  "password_hash": "bcrypt hash",
  "main_balance": 10000,
  "created_at": "ISO date string"
}
```

`virtual_cards`

```json
{
  "_id": "ObjectId",
  "user_id": "ObjectId",
  "card_number": "4242849210498824",
  "cvv": "123",
  "expiry_month": 12,
  "expiry_year": 2029,
  "merchant_name": "Netflix",
  "merchant_category": "streaming",
  "spend_limit": 649,
  "burn_date": "2026-12-31",
  "color": "#e11d48",
  "status": "active",
  "spent_total": 0,
  "created_at": "ISO date string",
  "updated_at": "ISO date string"
}
```

`transactions`

```json
{
  "_id": "ObjectId",
  "card_id": "ObjectId",
  "user_id": "ObjectId",
  "merchant_name": "Netflix",
  "amount": 649,
  "status": "approved",
  "reason": null,
  "created_at": "ISO date string"
}
```

`notifications`

```json
{
  "_id": "ObjectId",
  "user_id": "ObjectId",
  "type": "charge_approved",
  "title": "Charge Approved",
  "message": "A charge of Rs. 649.00 from Netflix was approved.",
  "related_card_id": "ObjectId as string",
  "is_read": 0,
  "created_at": "ISO date string"
}
```

## Prototype Boundaries

SubSentry does not issue real cards, move real money, or enforce rules on a payment network.

The merchant lock is simulated by the API. A real product would need issuer-level authorization controls.

The transaction simulator accepts a card number and amount directly. It is a test harness, not a secure payment form.

The project is not PCI-DSS compliant. Card data is stored for demonstration only.

Vercel deployment is not wired yet. MongoDB makes hosted deployment possible, but the Express server still needs to be adapted to the target platform's runtime.
