<div align="center">
  <h1 style="font-size: 3em; font-weight: 900; letter-spacing: -1px;">SubSentry</h1>
  <p><strong>Virtual Card Security Platform</strong></p>
</div>

<br />

SubSentry is a working prototype for subscription control through virtual cards. It lets a user create Luhn-valid card numbers, lock each card to a merchant, set spend limits, add burn dates, simulate charges, and review the transaction trail produced by those rules.

The cards in this project are simulated. They are useful for demonstrating the control flow of a card firewall, but they are not connected to Visa, Mastercard, Stripe Issuing, Marqeta, or any other payment network.

---

##  Getting Started

Follow these instructions to set up and run the SubSentry application on your local machine. This project utilizes a unified full-stack architecture running a React/Vite frontend and an Express/SQLite backend concurrently.

### Prerequisites

You must have the following installed on your machine:
- **Node.js** (v18 or higher)
- **npm** (comes with Node.js)

### 1. Clone & Install Dependencies

Open your terminal, navigate to the project directory, and install all required packages:

```bash
npm install
```

### 2. Configure Environment Variables

The application requires an environment file to securely handle JWT authentication.

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and ensure `JWT_SECRET` is set to a secure, random string.

### 3. Start the Development Server

To start both the Express backend server and the Vite frontend dev server simultaneously, run:

```bash
npm run dev
```

- **Frontend Interface:** The terminal will output a local URL (typically `http://localhost:5173`). Open this link in your browser to view the application.
- **Backend API:** The backend API and SQLite database automatically spin up on an available port (usually `3001`). 

### 4. Database Setup (Automatic)

You don't need to manually configure the database! Upon running `npm run dev` for the first time, the `better-sqlite3` driver will automatically generate the `server/db/subsentry.db` database file and seed it with the necessary schemas and test user data.

### 5. Accessing the Dashboard

When the app loads:
1. Navigate to the **Login** screen.
2. Enter any credentials to simulate logging in. (Since this is a development prototype, standard user creation will initialize your session).
3. Explore the Dashboard, Virtual Cards, Settings, and use the built-in **Transaction Simulator** to test live real-time authorizations!

---

##  Technology Stack

* **Frontend:** React 19, Vite, Tailwind CSS (v4), Motion (Framer Motion), Recharts, Lucide Icons.
* **Backend:** Node.js, Express.js.
* **Database:** SQLite (via `better-sqlite3`).
* **Authentication:** JWT (JSON Web Tokens).

##  Features

* **Instant PAN Generation:** Securely generate 16-digit Virtual Card identities.
* **Transaction Simulator:** Test real-time HTTP webhooks and transaction approval/rejection logic.
* **Capital Controls:** Impose strict maximum limits on specific merchants.
* **State Syncing:** Live balance syncing and dynamic status filtering.
