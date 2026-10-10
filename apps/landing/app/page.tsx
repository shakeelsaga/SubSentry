'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Bell, CreditCard, Flame, Lock, ShieldCheck, UserCircle } from 'lucide-react';

type SessionUser = {
  full_name?: string;
};

const APP_ORIGIN = process.env.NEXT_PUBLIC_SUBSENTRY_APP_ORIGIN || 'http://localhost:3001';

function appHref(path: string) {
  return `${APP_ORIGIN}${path}`;
}

export default function NextLandingPage() {
  const [hasSession, setHasSession] = useState(false);
  const [user, setUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    const token = window.localStorage.getItem('subsentry_token');
    setHasSession(Boolean(token));

    if (!token) return;

    fetch(`${APP_ORIGIN}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setUser(data?.user || null))
      .catch(() => setUser(null));
  }, []);

  return (
    <main className="page-shell">
      <nav className="nav">
        <Link href="/" className="brand" aria-label="SubSentry home">
          <span className="brand-mark"><img src="/assets/favicon.png" alt="" /></span>
          <span>SubSentry</span>
        </Link>

        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#flow">How It Works</a>
          <a href="#rules">Rules</a>
        </div>

        <div className="nav-actions">
          {hasSession ? (
            <>
              <Link href={appHref('/notifications')} className="icon-button" aria-label="Notifications">
                <Bell size={20} />
              </Link>
              <Link href={appHref('/settings')} className="profile-link" aria-label="Profile">
                <span className="profile-copy">{user?.full_name || 'User'}</span>
                <UserCircle size={28} />
              </Link>
            </>
          ) : (
            <>
              <Link href={appHref('/login')} className="login-link">Log In</Link>
              <Link href={appHref('/login')} className="primary-link">Sign Up</Link>
            </>
          )}
        </div>
      </nav>

      <section className="hero">
        <div className="hero-copy">
          <div className="status-pill">
            <span />
            System Status: Shield Active
          </div>
          <h1>The financial firewall for your subscriptions.</h1>
          <p>
            Create merchant-locked virtual cards with hard spend limits and burn dates. Every simulated charge is checked against your rules before balance moves.
          </p>
          <div className="hero-actions">
            <Link href={hasSession ? appHref('/dashboard') : appHref('/login')} className="primary-cta">
              {hasSession ? 'Open Dashboard' : 'Start Guarding'}
            </Link>
            <a href="#flow" className="secondary-cta">See the Flow</a>
          </div>
        </div>

        <div className="card-stage" aria-label="Virtual card preview">
          <div className="virtual-card">
            <div className="scan-line" />
            <div className="card-top">
              <div className="lock-pill"><Lock size={14} /> Locked to Netflix</div>
              <ShieldCheck size={32} />
            </div>
            <div>
              <div className="card-number">4242 8492 1049 8824</div>
              <div className="card-meta">Merchant-bound token</div>
            </div>
            <div className="card-bottom">
              <div>
                <span>Card Holder</span>
                <strong>SUBSENTRY USER</strong>
              </div>
              <div>
                <span>Spending Limit</span>
                <strong>₹649 / MO</strong>
              </div>
            </div>
          </div>
          <div className="block-badge">
            <ShieldCheck size={20} />
            <div>
              <span>Auto-Block</span>
              <strong>₹1,999 attempt blocked</strong>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="feature-grid">
        {[
          ['01', Lock, 'Merchant Locking', 'Cards are bound to one merchant. A mismatched origin is rejected and logged.'],
          ['02', Flame, 'Burn Dates', 'Cards can auto-revoke on a date so stale subscriptions cannot keep charging.'],
          ['03', CreditCard, 'Spend Guard', 'Per-card caps block overages before the simulated balance is deducted.'],
        ].map(([num, Icon, title, body]) => (
          <article className="feature-card" key={String(title)}>
            <span>{String(num)}</span>
            <Icon size={28} />
            <h2>{String(title)}</h2>
            <p>{String(body)}</p>
          </article>
        ))}
      </section>

      <section id="flow" className="flow-panel">
        <div>
          <h2>Built around the existing prototype.</h2>
          <p>
            This Next.js page is intentionally thin. The authenticated dashboard, simulator, cards, analytics, API routes, and MongoDB persistence still live in the current Vite and Express app.
          </p>
        </div>
        <ol>
          <li>Create a merchant-locked card.</li>
          <li>Simulate a charge with merchant and amount.</li>
          <li>Approve or block through deterministic rules.</li>
          <li>Record the transaction and notification trail.</li>
        </ol>
      </section>

      <section id="rules" className="rules-strip">
        <span>No AI in the critical path</span>
        <span>Hard caps</span>
        <span>Merchant checks</span>
        <span>Burn-date revocation</span>
      </section>
    </main>
  );
}
