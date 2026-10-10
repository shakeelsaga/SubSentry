import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Shield,
  Lock,
  Power,
  ShieldCheck,
  Eye,
  EyeOff,
  Bell,
  Menu,
  X,
  ArrowRight,
  CreditCard,
  Flame,
  Terminal,
  ChevronRight,
  Github,
} from 'lucide-react';
import { api } from '../services/api';
import { User } from '../types';

// ─── NAVIGATION ─────────────────────────────────────────────
function LandingNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const isLoggedIn = api.isLoggedIn();

  useEffect(() => {
    if (!isLoggedIn) {
      setUser(null);
      setUnreadCount(0);
      return;
    }

    let isMounted = true;

    const fetchUserData = async () => {
      try {
        const [userData, notificationData] = await Promise.all([
          api.getMe(),
          api.getNotifications(),
        ]);

        if (!isMounted) return;
        setUser(userData.user);
        setUnreadCount(notificationData.unread_count);
      } catch (err) {
        if (!isMounted) return;
        setUser(null);
        setUnreadCount(0);
      }
    };

    fetchUserData();
    const interval = setInterval(fetchUserData, 30000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [isLoggedIn]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setMobileOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-white/10 h-20">
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="inline-flex items-center gap-2.5 select-none">
          <img src="/assets/favicon.png" alt="" className="w-8 h-8 object-contain" />
          <span className="font-display font-black tracking-[-0.03em] text-primary-container text-xl uppercase">
            SubSentry
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-x-8">
          <button onClick={() => scrollTo('features')} className="font-display text-on-surface-variant hover:text-primary-container transition-colors tracking-widest uppercase text-xs font-bold cursor-pointer">
            Features
          </button>
          <button onClick={() => scrollTo('interface')} className="font-display text-on-surface-variant hover:text-primary-container transition-colors tracking-widest uppercase text-xs font-bold cursor-pointer">
            How It Works
          </button>
          <button onClick={() => scrollTo('rules')} className="font-display text-on-surface-variant hover:text-primary-container transition-colors tracking-widest uppercase text-xs font-bold cursor-pointer">
            Rules Engine
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-x-3">
          {isLoggedIn ? (
            <>
              <Link to="/notifications" className="text-neutral-400 hover:text-primary-container hover:bg-white/5 p-2 rounded-full relative transition-colors">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-secondary-container rounded-full shadow-[0_0_8px_rgba(255,75,137,0.8)] flex items-center justify-center text-[8px] font-black text-white px-1">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>
              <Link to="/settings" className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-bold text-white font-display">{user?.full_name || 'User'}</p>
                  <p className="text-[10px] font-black text-primary-container uppercase tracking-widest">Elite Member</p>
                </div>
                <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/10 shrink-0 hover:border-primary-container transition-colors">
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.full_name || 'User')}&background=c3f400&color=000`}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="font-display text-white hover:text-primary-container px-4 py-2 hover:bg-white/5 rounded-lg transition-colors tracking-widest uppercase text-xs font-bold"
              >
                Log In
              </Link>
              <Link
                to="/login"
                className="bg-primary-container text-neutral-950 font-display px-5 py-2.5 rounded-lg font-black neon-glow-primary transition-all tracking-widest uppercase text-xs flex items-center gap-2 shadow-lg active:scale-95"
              >
                Sign Up
              </Link>
            </>
          )}

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-on-surface-variant hover:text-white rounded-lg border border-white/10"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-2xl border-b border-white/10 px-6 py-5 flex flex-col gap-4 font-display">
          <button onClick={() => scrollTo('features')} className="text-left text-sm uppercase tracking-wider text-on-surface hover:text-primary-container py-2 border-b border-white/5">Features</button>
          <button onClick={() => scrollTo('interface')} className="text-left text-sm uppercase tracking-wider text-on-surface hover:text-primary-container py-2 border-b border-white/5">How It Works</button>
          <button onClick={() => scrollTo('rules')} className="text-left text-sm uppercase tracking-wider text-on-surface hover:text-primary-container py-2 border-b border-white/5">Rules Engine</button>
          {isLoggedIn ? (
            <div className="flex gap-3 pt-2">
              <Link to="/notifications" className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border border-white/20 text-xs uppercase font-bold tracking-wider text-white">
                <Bell className="w-4 h-4" />
                Alerts{unreadCount > 0 ? ` (${unreadCount > 9 ? '9+' : unreadCount})` : ''}
              </Link>
              <Link to="/settings" className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-primary-container text-neutral-950 text-xs uppercase font-black tracking-wider shadow-md">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.full_name || 'User')}&background=131319&color=c3f400`}
                  alt=""
                  className="w-5 h-5 rounded-md"
                />
                Profile
              </Link>
            </div>
          ) : (
            <div className="flex gap-3 pt-2">
              <Link to="/login" className="flex-1 text-center py-2.5 rounded-lg border border-white/20 text-xs uppercase font-bold tracking-wider text-white">Log In</Link>
              <Link to="/login" className="flex-1 text-center py-2.5 rounded-lg bg-primary-container text-neutral-950 text-xs uppercase font-black tracking-wider shadow-md">Sign Up</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

// ─── HERO SECTION ───────────────────────────────────────────
function HeroSection() {
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [showFullNumber, setShowFullNumber] = useState(false);
  const [blockNotifVisible, setBlockNotifVisible] = useState(true);

  const sampleCards = [
    {
      merchant: 'Netflix',
      domain: 'netflix.com',
      last4: '8824',
      full: '4242 8492 1049 8824',
      limit: '₹649 / MO',
      autoBlocked: '₹1,999 Attempt Blocked',
      reason: 'Rule: Spending cap overflow',
      accentColor: '#e11d48',
    },
    {
      merchant: 'Spotify',
      domain: 'spotify.com',
      last4: '4190',
      full: '4091 7731 9283 4190',
      limit: '₹119 / MO',
      autoBlocked: '₹499 Price Hike Dropped',
      reason: 'Rule: Stealth price increase rejected',
      accentColor: '#10b981',
    },
    {
      merchant: 'AWS Cloud',
      domain: 'aws.amazon.com',
      last4: '9920',
      full: '4928 1109 4829 9920',
      limit: '₹4,500 / MO',
      autoBlocked: '₹18,500 VPS Spike Defended',
      reason: 'Rule: Deterministic hardware ceiling',
      accentColor: '#f97316',
    },
  ];

  const card = sampleCards[activeCardIndex];

  return (
    <section className="relative pt-44 pb-20 px-6 overflow-hidden">
      {/* Background aura */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[radial-gradient(ellipse_at_center,rgba(195,244,0,0.08)_0%,rgba(99,102,241,0.03)_50%,transparent_70%)] pointer-events-none blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        {/* Left copy */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="z-10"
        >
          {/* Status badge */}
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-primary-container/30 bg-primary-container/5 mb-8 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse shadow-[0_0_8px_rgba(195,244,0,0.6)]" />
            <span className="text-xs font-black uppercase tracking-[0.2em] text-primary-container font-display">
              System Status: Shield Active
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-4xl sm:text-6xl lg:text-[56px] text-white mb-6 leading-[1.1] tracking-tighter font-extrabold uppercase">
            THE <span className="text-primary-container italic">FINANCIAL FIREWALL</span> FOR YOUR SUBSCRIPTIONS.
          </h1>

          <p className="text-lg sm:text-xl text-on-surface-variant mb-10 max-w-xl leading-relaxed">
            Generate merchant-locked virtual cards with hard spend limits and auto-revocation burn dates. Every charge runs through your rules before a single rupee moves.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/login"
              className="bg-primary-container text-neutral-950 font-display text-base sm:text-lg px-8 py-4 rounded-xl flex items-center justify-center gap-3 neon-glow-primary transition-all active:scale-95 font-bold uppercase tracking-wider shadow-lg"
            >
              Start Guarding
              <Shield className="w-5 h-5" />
            </Link>
            <button
              onClick={() => {
                const el = document.getElementById('interface');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="glass-card text-white font-display text-base sm:text-lg px-8 py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-white/10 transition-all active:scale-95 uppercase tracking-wider cursor-pointer"
            >
              See How It Works
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Marquee ticker */}
          <div className="mt-14 w-full border-t border-white/10 pt-6">
            <div className="ticker-wrap w-full opacity-70">
              <div className="ticker flex gap-8 items-center font-display text-xs tracking-[0.3em] uppercase text-on-surface-variant">
                <span>MERCHANT-LOCKED CARDS</span>
                <span className="text-primary-container">•</span>
                <span>LUHN-VALID PAN GENERATION</span>
                <span className="text-primary-container">•</span>
                <span>BURN-DATE AUTO-REVOCATION</span>
                <span className="text-primary-container">•</span>
                <span>SPEND CAP ENFORCEMENT</span>
                <span className="text-primary-container">•</span>
                <span>REAL-TIME TRANSACTION AUDIT</span>
                <span className="text-primary-container">•</span>
                <span>MERCHANT-LOCKED CARDS</span>
                <span className="text-primary-container">•</span>
                <span>LUHN-VALID PAN GENERATION</span>
                <span className="text-primary-container">•</span>
                <span>BURN-DATE AUTO-REVOCATION</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right: Floating virtual card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative group"
        >
          <div className="absolute -inset-10 bg-primary-container/10 blur-[120px] opacity-30 group-hover:opacity-50 transition-opacity rounded-full pointer-events-none" />

          {/* Card switcher tabs */}
          <div className="flex items-center justify-between mb-4 px-2">
            <div className="flex gap-2">
              {sampleCards.map((c, idx) => (
                <button
                  key={c.merchant}
                  onClick={() => { setActiveCardIndex(idx); setShowFullNumber(false); setBlockNotifVisible(true); }}
                  className={`px-3 py-1 text-[11px] font-display font-bold rounded-lg uppercase tracking-wider transition-all border ${
                    activeCardIndex === idx
                      ? 'bg-primary-container/15 text-primary-container border-primary-container/40'
                      : 'bg-white/5 text-on-surface-variant border-white/10 hover:border-white/20'
                  }`}
                >
                  {c.merchant}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowFullNumber(!showFullNumber)}
              className="text-[11px] font-mono text-on-surface-variant hover:text-primary-container flex items-center gap-1 transition-colors"
            >
              {showFullNumber ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{showFullNumber ? 'Mask' : 'Reveal'}</span>
            </button>
          </div>

          {/* The floating card */}
          <div className="relative float-animation z-20">
            <div className="glass-card rounded-[2rem] p-7 sm:p-8 aspect-[1.58/1] w-full max-w-lg mx-auto relative overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.6)] border-white/20 transition-all hover:border-primary-container/40">
              {/* Glossy overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-black/40 opacity-60 pointer-events-none" />

              {/* Favicon logo */}
              <div className="absolute top-0 right-0 p-8 select-none pointer-events-none opacity-85">
                <img
                  src="/assets/favicon.png"
                  alt="SubSentry"
                  className="w-12 h-12 object-contain drop-shadow-[0_0_12px_rgba(195,244,0,0.4)]"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                />
              </div>

              {/* Card content */}
              <div className="flex flex-col h-full justify-between relative z-10">
                <div>
                  {/* Merchant lock badge */}
                  <div className="flex items-center gap-2 bg-background/60 w-fit px-3 py-1.5 rounded-lg border border-white/10 backdrop-blur-md">
                    <Lock className="w-3.5 h-3.5 text-primary-container" />
                    <p className="text-[10px] text-primary-container uppercase tracking-[0.2em] font-bold font-display">
                      Locked to {card.merchant}
                    </p>
                  </div>

                  {/* Card number */}
                  <div className="mt-7">
                    <h3 className="font-display text-white tracking-[0.2em] text-2xl sm:text-3xl font-bold opacity-95 select-all">
                      {showFullNumber ? card.full : `**** **** **** ${card.last4}`}
                    </h3>
                    <p className="text-[10px] text-on-surface-variant font-mono tracking-widest mt-1">
                      MERCHANT-BOUND TOKEN &bull; {card.domain}
                    </p>
                  </div>
                </div>

                {/* Bottom details */}
                <div className="flex justify-between items-end border-t border-white/10 pt-4">
                  <div>
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-[0.2em] mb-1 font-bold font-display">Card Holder</p>
                    <p className="font-display text-white tracking-widest text-sm font-semibold">SUBSENTRY USER</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-[0.2em] mb-1 font-bold font-display">Spending Limit</p>
                    <p className="font-display text-primary-container tracking-widest text-glow text-base sm:text-lg font-bold">{card.limit}</p>
                  </div>
                </div>
              </div>

              {/* Scan line */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-container/15 to-transparent h-[200%] -translate-y-full animate-scan pointer-events-none" />
            </div>

            {/* Floating auto-block badge */}
            {blockNotifVisible && (
              <div className="absolute -bottom-7 -left-4 sm:-left-7 glass-card p-4 rounded-2xl shadow-2xl border-white/15 backdrop-blur-2xl z-30 transition-all hover:scale-105">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-background/90 border border-white/10 flex items-center justify-center text-primary-container shadow-[0_0_15px_rgba(195,244,0,0.25)] shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest font-display">Auto-Block</p>
                      <button onClick={() => setBlockNotifVisible(false)} className="text-on-surface-variant/50 hover:text-white text-xs leading-none">&times;</button>
                    </div>
                    <p className="text-white font-bold text-xs sm:text-sm tracking-wide font-display">{card.autoBlocked}</p>
                    <p className="text-[10px] text-on-surface-variant font-mono">{card.reason}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── FEATURES BENTO GRID ────────────────────────────────────
function FeaturesBento() {
  const [card1Locked, setCard1Locked] = useState(true);
  const [killSwitchActive, setKillSwitchActive] = useState(false);
  const [spendCap, setSpendCap] = useState(649);

  const features = [
    {
      num: '01',
      icon: <Lock className="w-6 h-6" />,
      title: 'Merchant Locking',
      desc: 'Each virtual card is bound to a single merchant. Charges from any other source are instantly rejected by the system.',
      demo: (
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-white/5">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${card1Locked ? 'bg-primary-container' : 'bg-error'} animate-pulse`} />
            <span className="text-[11px] font-mono text-on-surface">netflix.com only</span>
          </div>
          <button
            onClick={() => setCard1Locked(!card1Locked)}
            className={`text-[10px] font-display font-bold px-2.5 py-1 rounded transition-colors ${
              card1Locked
                ? 'bg-primary-container/15 text-primary-container border border-primary-container/30'
                : 'bg-white/10 text-on-surface-variant'
            }`}
          >
            {card1Locked ? 'ENFORCED' : 'UNLOCKED'}
          </button>
        </div>
      ),
    },
    {
      num: '02',
      icon: <Power className="w-6 h-6" />,
      title: 'Instant Kill-Switch',
      desc: 'Freeze or permanently revoke any card in one click. No support queues, no cancellation flows. Just a hard disconnect.',
      demo: (
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-white/5">
          <div className="flex items-center gap-2">
            {killSwitchActive
              ? <X className="w-3.5 h-3.5 text-error" />
              : <Shield className="w-3.5 h-3.5 text-primary-container" />
            }
            <span className="text-[11px] font-mono text-on-surface">
              {killSwitchActive ? 'Token Severed' : 'Channel Armed'}
            </span>
          </div>
          <button
            onClick={() => setKillSwitchActive(!killSwitchActive)}
            className={`text-[10px] font-display font-bold px-2.5 py-1 rounded transition-all active:scale-95 ${
              killSwitchActive
                ? 'bg-error/20 text-error border border-error/30'
                : 'bg-white/10 text-on-surface-variant hover:bg-white/20'
            }`}
          >
            {killSwitchActive ? 'RESET' : 'KILL NOW'}
          </button>
        </div>
      ),
    },
    {
      num: '03',
      icon: <ShieldCheck className="w-6 h-6" />,
      title: 'Spend Guard',
      desc: 'Set hard spending caps on every card. If a merchant attempts a charge beyond the limit, the transaction is blocked automatically.',
      demo: (
        <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-2">
          <div className="flex justify-between items-center text-[11px] font-mono">
            <span className="text-on-surface-variant">Hard Cap:</span>
            <span className="text-primary-container font-bold">₹{spendCap.toLocaleString('en-IN')}/mo</span>
          </div>
          <input
            type="range"
            min="99"
            max="4999"
            step="50"
            value={spendCap}
            onChange={(e) => setSpendCap(parseInt(e.target.value, 10))}
            className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#c3f400]"
          />
        </div>
      ),
    },
  ];

  return (
    <section id="features" className="py-24 px-6 relative bg-background/50 border-y border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl sm:text-5xl text-white mb-4 tracking-tight uppercase font-extrabold">
            Tactical Financial Defense
          </h2>
          <p className="text-on-surface-variant max-w-2xl mx-auto text-base sm:text-lg">
            Take absolute control of your subscriptions with merchant-specific virtual cards that obey your rules.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f) => (
            <motion.div
              key={f.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5 }}
              className="glass-card glass-card-hover p-8 sm:p-10 rounded-[2rem] group relative overflow-hidden flex flex-col justify-between"
            >
              {/* Number watermark */}
              <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none select-none">
                <span className="font-display text-6xl text-white font-black">{f.num}</span>
              </div>

              <div>
                <div className="w-14 h-14 rounded-2xl bg-background border border-white/10 flex items-center justify-center text-white mb-8 group-hover:border-primary-container/50 group-hover:text-primary-container transition-all shadow-lg relative z-10">
                  {f.icon}
                </div>
                <h3 className="font-display text-white mb-4 tracking-wide uppercase text-xl font-bold relative z-10">{f.title}</h3>
                <p className="text-on-surface-variant text-sm sm:text-base leading-relaxed relative z-10 mb-6">{f.desc}</p>
              </div>

              <div className="relative z-10 pt-4 border-t border-white/10 mt-auto">
                {f.demo}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── INTERFACE SHOWCASE ─────────────────────────────────────
function InterfaceShowcase() {
  const [killSwitchEngaged, setKillSwitchEngaged] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState([
    '$ sentry-core --listen ::3000',
    '[RULE] Drop unauthorized merchant retry: 403 Forbidden',
    '[AUDIT] 0 leakages detected across all cards',
  ]);
  const [testingPacket, setTestingPacket] = useState(false);

  const handleTestPacket = () => {
    if (testingPacket) return;
    setTestingPacket(true);
    const scenarios = [
      '[INSPECT] Incoming packet from api.netflix.com/v1/charge - amount: ₹649 -> APPROVED (token match)',
      '[ALERT] Detected stealth recurring price creep: +₹350 attempt -> REJECTED (Rule: spend cap)',
      '[DROP] Unauthorized merchant origin (ip: 198.51.100.4) -> 403 Forbidden',
    ];
    const randomLog = scenarios[Math.floor(Math.random() * scenarios.length)];
    setTimeout(() => {
      setTerminalLogs(prev => [...prev.slice(-3), randomLog]);
      setTestingPacket(false);
    }, 400);
  };

  return (
    <section id="interface" className="py-28 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(195,244,0,0.05)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="glass-card rounded-[3rem] overflow-hidden border-white/10 relative shadow-2xl backdrop-blur-3xl"
        >
          <div className="grid lg:grid-cols-2">
            {/* Left content */}
            <div className="p-8 sm:p-12 lg:p-20 flex flex-col justify-center">
              <h2 className="font-display text-white mb-6 uppercase tracking-tight text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight">
                Built for Control
              </h2>
              <p className="text-on-surface-variant mb-10 text-base sm:text-lg leading-relaxed">
                The dashboard gives you a real-time view of every virtual card, every transaction, and every blocked charge. Freeze cards, adjust limits, and simulate attacks from one screen.
              </p>

              <ul className="space-y-6 mb-12">
                {[
                  'Real-time transaction feed with approval/rejection status',
                  'Card lifecycle management: create, pause, revoke',
                  'Spending analytics with per-merchant breakdowns',
                  'Built-in transaction simulator for testing your rules',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-4 text-white font-display tracking-wider uppercase text-xs sm:text-sm font-semibold">
                    <div className="w-8 h-8 rounded-full bg-primary-container/10 flex items-center justify-center border border-primary-container/20 shrink-0">
                      <ChevronRight className="w-4 h-4 text-primary-container" />
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-4">
                <Link
                  to="/login"
                  className="bg-white text-background font-display text-sm px-8 py-4 rounded-xl active:scale-95 transition-all uppercase tracking-widest font-bold hover:bg-neutral-200 shadow-lg"
                >
                  Try the Dashboard
                </Link>
              </div>
            </div>

            {/* Right: interactive firewall node */}
            <div className="relative min-h-[500px] bg-background/90 overflow-hidden border-t lg:border-t-0 lg:border-l border-white/10 flex items-center justify-center p-6 sm:p-10">
              <div className="w-full max-w-md flex flex-col gap-4 font-display">
                <div className="bg-background/95 border border-white/10 rounded-2xl p-5 shadow-2xl backdrop-blur-xl">
                  {/* Top bar */}
                  <div className="flex items-center justify-between pb-4 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-primary-container animate-pulse shadow-[0_0_8px_rgba(195,244,0,0.6)]" />
                      <span className="text-xs font-bold uppercase tracking-wider text-white">Firewall Node: #01-Local</span>
                    </div>
                    <span className="text-[10px] text-primary-container uppercase font-bold tracking-widest px-2.5 py-0.5 rounded border border-primary-container/30 bg-primary-container/10">
                      ARMED
                    </span>
                  </div>

                  {/* Status items */}
                  <div className="py-4 space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 transition-colors hover:border-white/15">
                      <div className="flex items-center gap-3">
                        <Lock className="w-4 h-4 text-primary-container" />
                        <div>
                          <p className="text-xs font-bold text-white uppercase tracking-wider">Netflix Lock</p>
                          <p className="text-[10px] text-on-surface-variant font-mono">Bound to: merchant_id_8824</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-primary-container font-mono">₹649/mo</span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 transition-colors hover:border-white/15">
                      <div className="flex items-center gap-3">
                        <Flame className="w-4 h-4 text-primary-container" />
                        <div>
                          <p className="text-xs font-bold text-white uppercase tracking-wider">Spotify Limit</p>
                          <p className="text-[10px] text-on-surface-variant font-mono">Strict Cap: ₹119 max</p>
                        </div>
                      </div>
                      <span className="text-[10px] uppercase font-bold text-white bg-white/10 px-2.5 py-1 rounded">Enforced</span>
                    </div>

                    <div
                      onClick={() => setKillSwitchEngaged(!killSwitchEngaged)}
                      className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                        killSwitchEngaged
                          ? 'bg-error/15 border border-error/40'
                          : 'bg-primary-container/10 border border-primary-container/30 hover:bg-primary-container/15'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Power className={`w-4 h-4 ${killSwitchEngaged ? 'text-error' : 'text-primary-container'}`} />
                        <div>
                          <p className={`text-xs font-bold uppercase tracking-wider ${killSwitchEngaged ? 'text-error' : 'text-primary-container'}`}>
                            Instant Kill-Switch
                          </p>
                          <p className="text-[10px] text-on-surface font-mono">
                            {killSwitchEngaged ? 'Funds disconnected. Card severed.' : '1-tap cut off active (click to test)'}
                          </p>
                        </div>
                      </div>
                      <span className={`w-2.5 h-2.5 rounded-full ${killSwitchEngaged ? 'bg-error' : 'bg-primary-container'} animate-pulse`} />
                    </div>
                  </div>

                  {/* Terminal box */}
                  <div className="pt-3 border-t border-white/10 bg-black/60 rounded-lg p-3 font-mono text-[11px] text-on-surface-variant space-y-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] text-on-surface-variant/50 uppercase tracking-widest font-mono">Enclave Stream</span>
                      <button
                        onClick={handleTestPacket}
                        disabled={testingPacket}
                        className="text-[10px] text-primary-container hover:underline cursor-pointer"
                      >
                        {testingPacket ? 'Inspecting...' : '+ Inspect Packet'}
                      </button>
                    </div>
                    {terminalLogs.map((log, i) => (
                      <p
                        key={i}
                        className={
                          log.startsWith('$') ? 'text-primary-container'
                            : log.includes('ALERT') || log.includes('DROP') ? 'text-error'
                            : log.includes('APPROVED') ? 'text-green-400'
                            : 'text-on-surface'
                        }
                      >
                        {log}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── SPENDING BREAKDOWN / RULES ENGINE ──────────────────────
function SpendingBreakdown() {
  const [selectedTag, setSelectedTag] = useState('Deterministic Caps');
  const [selectedCap, setSelectedCap] = useState<string | null>(null);

  const caps = [
    { name: 'Cloud & VPS', current: 3499, cap: 4500, pct: 78, color: 'bg-primary-container', textColor: 'text-primary-container', status: 'active' },
    { name: 'Media Streaming', current: 649, cap: 650, pct: 99, color: 'bg-white/70', textColor: 'text-white', status: 'locked' },
    { name: 'Developer Tools', current: 2399, cap: 2500, pct: 96, color: 'bg-primary-container', textColor: 'text-primary-container', status: 'active' },
    { name: 'Gym & Wellness', current: 0, cap: 1750, pct: 0, color: 'bg-white/20', textColor: 'text-on-surface-variant/50', status: 'revoked' },
  ];

  const tagExplanations: Record<string, string> = {
    'No AI': 'Zero probabilistic models in the critical path. Hard boolean logic guarantees predictable protection.',
    'Deterministic Caps': 'Explicit price ceilings bound per merchant card. Attempted overages are blocked at the transaction layer.',
    'Local Rules': 'Rules are evaluated server-side on every transaction. The spend limit is checked before any balance is deducted.',
  };

  return (
    <section id="rules" className="py-20 px-6 border-t border-white/5 bg-background">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="glass-card rounded-[3rem] p-8 sm:p-12 lg:p-14 border-white/10 relative overflow-hidden"
        >
          <div className="absolute right-0 top-0 w-1/2 h-full bg-[radial-gradient(circle_at_center,rgba(195,244,0,0.06)_0%,transparent_100%)] pointer-events-none" />

          <div className="flex flex-col md:flex-row justify-between items-center gap-12 relative z-10">
            {/* Left */}
            <div className="max-w-md w-full">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary-container/30 bg-primary-container/5 mb-4 text-[10px] font-bold text-primary-container uppercase tracking-widest font-display">
                Rules Engine
              </div>
              <h3 className="font-display text-white mb-4 uppercase tracking-tight text-3xl sm:text-4xl font-extrabold leading-tight">
                Spending Breakdown & Cap Triggers
              </h3>
              <p className="text-on-surface-variant text-sm sm:text-base leading-relaxed mb-6">
                Every transaction is evaluated against your per-card spend limits. Any charge that would push the total beyond the cap is automatically blocked and logged.
              </p>

              <div className="flex flex-wrap gap-2 text-[11px] font-mono">
                {Object.keys(tagExplanations).map(tag => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                      selectedTag === tag
                        ? 'border-primary-container/40 bg-primary-container/10 text-primary-container shadow-[0_0_10px_rgba(195,244,0,0.15)]'
                        : 'border-white/10 bg-white/5 text-on-surface-variant hover:border-white/20'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              <div className="mt-4 p-3 rounded-xl bg-black/40 border border-white/5 text-xs text-on-surface-variant font-mono">
                {tagExplanations[selectedTag]}
              </div>
            </div>

            {/* Right: budget caps card */}
            <div className="w-full md:w-1/2 bg-background/95 rounded-2xl p-6 sm:p-7 border border-white/10 shadow-2xl relative font-display">
              <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-3">
                <div>
                  <p className="text-xs font-bold text-white uppercase tracking-wider">Active Budget Caps</p>
                  <p className="text-[10px] text-on-surface-variant font-mono">Auto-block triggers configured</p>
                </div>
                <span className="text-[10px] text-primary-container font-mono uppercase bg-primary-container/10 border border-primary-container/30 px-2.5 py-1 rounded font-bold">
                  Auto-Lock Ready
                </span>
              </div>

              <div className="space-y-5">
                {caps.map(c => (
                  <div
                    key={c.name}
                    onClick={() => setSelectedCap(selectedCap === c.name ? null : c.name)}
                    className="space-y-1.5 p-2 rounded-xl transition-colors hover:bg-white/5 cursor-pointer"
                  >
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="text-white font-bold">
                        {c.name} (₹{c.current.toLocaleString('en-IN')} / ₹{c.cap.toLocaleString('en-IN')} cap)
                      </span>
                      <span className={`font-bold ${c.textColor}`}>
                        {c.status === 'revoked' ? 'REVOKED' : `${c.pct}%${c.status === 'locked' ? ' (Locked)' : ''}`}
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden p-[1px]">
                      <div
                        className={`h-full ${c.color} rounded-full transition-all duration-700 ease-out`}
                        style={{ width: `${c.pct}%` }}
                      />
                    </div>
                    {selectedCap === c.name && (
                      <p className="text-[10px] text-on-surface-variant font-mono pt-1">
                        Trigger policy: Auto-block when within 5% of ceiling. 0 overage tolerance.
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-on-surface-variant font-mono">
                <span>Protocol: Hard caps strictly enforced</span>
                <span className="text-primary-container font-bold">₹0 Overage Leak</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── FOOTER (STRIPPED DOWN) ─────────────────────────────────
function LandingFooter() {
  return (
    <footer className="py-16 px-6 border-t border-white/10 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Logo + description */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <div className="inline-flex items-center gap-2.5 select-none">
              <img src="/assets/favicon.png" alt="" className="w-7 h-7 object-contain" />
              <span className="font-display font-black tracking-[-0.03em] text-primary-container text-lg uppercase">SubSentry</span>
            </div>
            <p className="text-on-surface-variant/60 text-sm max-w-xs text-center md:text-left">
              Virtual card security platform for subscription control.
            </p>
          </div>

          {/* GitHub status */}
          <div className="flex items-center gap-2 text-on-surface-variant font-display text-xs uppercase tracking-widest font-bold">
            <Github className="w-5 h-5" />
            GitHub Repo Pending
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center pt-8 mt-8 border-t border-white/5 gap-4">
          <p className="text-on-surface-variant/40 text-xs tracking-widest font-display uppercase">
            &copy; 2026 SubSentry. All rights reserved.
          </p>
          <div className="flex items-center gap-2 border border-primary-container/20 bg-primary-container/5 px-3 py-1.5 rounded-full">
            <span className="text-[10px] text-primary-container tracking-widest font-bold uppercase font-display">
              Prototype Build
            </span>
            <CreditCard className="w-3.5 h-3.5 text-primary-container" />
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── MAIN LANDING PAGE ──────────────────────────────────────
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-on-surface selection:bg-primary-container selection:text-on-primary-container mesh-gradient-landing">
      <LandingNav />
      <main>
        <HeroSection />
        <FeaturesBento />
        <InterfaceShowcase />
        <SpendingBreakdown />
      </main>
      <LandingFooter />
    </div>
  );
}
