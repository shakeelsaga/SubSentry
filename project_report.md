# SubSentry Project Report

## 1. Project Overview
**Project Name:** SubSentry
**Type:** Virtual Card Security Platform / Fintech Web Application
**Status:** Production-ready prototype

SubSentry is a cutting-edge fintech application designed for managing single-use digital payment identities. Built as a full-stack web application, it provides a comprehensive platform for users to secure their primary capital against online fraud and data breaches.

## 2. Purpose and Vision
The primary purpose of SubSentry is to offer an isolated, secure layer between a user's primary bank account and online merchants. As digital transactions and subscriptions become increasingly ubiquitous, users are exposed to auto-renewal traps, data breaches, and unauthorized charges. 

SubSentry mitigates these risks by allowing users to generate unique, single-use, or merchant-locked virtual cards. Users can apply granular spend controls, monitor real-time transactions, and instantly revoke these identities to protect their capital. The vision is to provide enterprise-grade financial security with a premium, accessible consumer interface.

## 3. Theme and Design
SubSentry leverages a highly premium **"Deep Obsidian"** design aesthetic. The UI is crafted to look and feel like a state-of-the-art fintech product.
* **Color Palette:** Dark, sophisticated tones with high-contrast, vibrant accents to denote status (active, frozen, alert) and data visualizations.
* **Typography & Layout:** Clean, modern typography designed for maximum readability of financial data (transaction history, balances).
* **Interactivity:** Fluid micro-animations, dynamic card visualizers, and responsive hover states powered by Framer Motion, creating a tactile and responsive user experience.

## 4. Key Features

### 4.1. Core Functionality
* **Instant PAN Generation:** Secure, on-demand generation of 16-digit Virtual Card identities that are Luhn-valid.
* **Capital Controls:** Users can impose strict maximum spend limits on specific cards to prevent unauthorized overcharges or runaway subscription costs.
* **Identity Revocation:** Instant freezing or deletion of virtual cards to immediately block further transactions.
* **Real-Time State Syncing:** Live balance syncing and dynamic status filtering for immediate feedback on account standing.

### 4.2. Developer & Testing Tools
* **Transaction Simulator:** A built-in simulator allowing users and developers to test real-time HTTP webhooks and observe transaction approval or rejection logic without needing a live banking gateway.

### 4.3. Technical Architecture
* **Full-Stack Integration:** A unified repository running a React frontend and an Express backend concurrently.
* **Secure Authentication:** Implementation of robust JSON Web Tokens (JWT) for secure session management and API authorization.
* **Persistent Storage:** An automated SQLite database setup that seeds necessary schemas and test data upon initialization, providing immediate persistence without manual configuration.

## 5. Technology Stack
* **Frontend UI:** React 19, Vite, Tailwind CSS (v4)
* **Animations & Visualization:** Motion (Framer Motion), Recharts, Lucide-React
* **Backend Framework:** Node.js, Express.js
* **Database:** SQLite (via `better-sqlite3`)
* **Security & Auth:** JWT (JSON Web Tokens), `bcryptjs`
* **Language:** TypeScript across the entire stack

## 6. Current Limitations
While SubSentry is a robust and highly polished prototype, there are limitations inherent to its current scope:

* **Simulated Network:** The application currently uses a built-in webhook simulator for transactions. It is not yet connected to a live banking network or card issuing API (such as Stripe Issuing or Marqeta).
* **Database Scalability:** The project utilizes SQLite. While excellent for prototyping and lightweight local deployments, an enterprise-scale launch would require migrating to a horizontally scalable database like PostgreSQL or MySQL.
* **Regulatory Compliance:** As a prototype, it currently lacks the extensive security hardening and auditing required for strict PCI-DSS compliance, which is mandatory before handling actual credit card data.
* **KYC/AML:** The current authentication system is streamlined for demonstration and development. A production launch would require integration with Identity Verification services to comply with Know Your Customer (KYC) and Anti-Money Laundering (AML) regulations.

## 7. Conclusion
SubSentry represents a highly functional, beautifully designed blueprint for a modern financial security platform. It successfully demonstrates the core workflows of virtual card management, transactional control, and real-time state management, providing a strong foundation for future integration with live financial APIs.
