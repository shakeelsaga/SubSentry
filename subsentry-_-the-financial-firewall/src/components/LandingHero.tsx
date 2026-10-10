import React, { useState } from 'react';

interface LandingHeroProps {
  onStartGuarding: () => void;
  onViewDemo: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onStartGuarding,
  onViewDemo,
}) => {
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [showFullNumber, setShowFullNumber] = useState(false);
  const [blockedNotificationVisible, setBlockedNotificationVisible] = useState(true);

  const sampleCards = [
    {
      merchant: 'Netflix',
      domain: 'netflix.com',
      last4: '8824',
      full: '4242 8492 1049 8824',
      limit: '₹649 / MO',
      holder: 'OBSIDIAN ELITE',
      autoBlocked: '₹1,999 Attempt Blocked',
      reason: 'Rule: Spending cap overflow',
      accentColor: '#CCFF00',
    },
    {
      merchant: 'Spotify',
      domain: 'spotify.com',
      last4: '4190',
      full: '4091 7731 9283 4190',
      limit: '₹119 / MO',
      holder: 'OBSIDIAN ELITE',
      autoBlocked: '₹499 Price Hike Dropped',
      reason: 'Rule: Stealth price increase rejected',
      accentColor: '#1DB954',
    },
    {
      merchant: 'AWS Cloud',
      domain: 'aws.amazon.com',
      last4: '9920',
      full: '4928 1109 4829 9920',
      limit: '₹4,500 / MO',
      holder: 'OBSIDIAN ELITE',
      autoBlocked: '₹18,500 VPS Spike Defended',
      reason: 'Rule: Deterministic hardware ceiling',
      accentColor: '#FF9900',
    },
  ];

  const currentCard = sampleCards[activeCardIndex];

  return (
    <section className="relative pt-44 pb-20 px-6 overflow-hidden">
      {/* Background radial aura */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[radial-gradient(ellipse_at_center,rgba(204,255,0,0.08)_0%,rgba(79,81,221,0.03)_50%,transparent_70%)] pointer-events-none blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        {/* Left Copy & Actions */}
        <div className="z-10">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-[#CCFF00]/30 bg-[#CCFF00]/5 mb-8 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#CCFF00] animate-pulse shadow-[0_0_8px_#CCFF00]" />
            <span className="text-xs font-black uppercase tracking-[0.2em] text-[#CCFF00] font-['Space_Grotesk']">
              System Status: Shield Active
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="font-['Space_Grotesk'] text-4xl sm:text-6xl lg:text-[56px] text-white mb-6 leading-[1.1] tracking-tighter font-extrabold uppercase">
            THE <span className="text-[#CCFF00] italic">FINANCIAL FIREWALL</span> FOR YOUR SUBSCRIPTIONS.
          </h1>

          <p className="font-['Manrope'] text-lg sm:text-xl text-neutral-400 mb-10 max-w-xl leading-relaxed">
            Stop subscription creep dead in its tracks. Generate merchant-locked virtual cards that obey your rules, not their billing cycles.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={onStartGuarding}
              className="bg-[#CCFF00] text-[#06080F] font-['Space_Grotesk'] text-base sm:text-lg px-8 py-4 rounded-xl flex items-center justify-center gap-3 neon-glow-primary transition-all active-scale font-bold uppercase tracking-wider cursor-pointer shadow-lg"
            >
              <span>Start Guarding</span>
              <span className="material-symbols-outlined font-bold text-xl">shield_with_heart</span>
            </button>
            <button
              onClick={onViewDemo}
              className="glass-card text-white font-['Space_Grotesk'] text-base sm:text-lg px-8 py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-white/10 transition-all active-scale uppercase tracking-wider cursor-pointer"
            >
              <span>View Demo</span>
              <span className="material-symbols-outlined text-xl">play_circle</span>
            </button>
          </div>

          {/* Running Marquee Ticker */}
          <div className="mt-14 w-full border-t border-white/10 pt-6">
            <div className="ticker-wrap w-full opacity-70">
              <div className="ticker flex gap-8 items-center font-['Space_Grotesk'] text-xs tracking-[0.3em] uppercase text-neutral-400">
                <span>PROTOCOL: LOCAL-FIRST FIREWALL</span>
                <span className="text-[#CCFF00]">•</span>
                <span>VIRTUAL CARDS: MERCH-ISOLATED</span>
                <span className="text-[#CCFF00]">•</span>
                <span>ZERO CLOUD TELEMETRY</span>
                <span className="text-[#CCFF00]">•</span>
                <span>ENCRYPTION: HARDWARE ENCLAVE</span>
                <span className="text-[#CCFF00]">•</span>
                <span>KILL-SWITCH: CLIENT DETERMINISTIC</span>
                <span className="text-[#CCFF00]">•</span>
                <span>PROTOCOL: LOCAL-FIRST FIREWALL</span>
                <span className="text-[#CCFF00]">•</span>
                <span>VIRTUAL CARDS: MERCH-ISOLATED</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Virtual Card Graphic & Simulator */}
        <div className="relative group">
          <div className="absolute -inset-10 bg-[#CCFF00]/10 blur-[120px] opacity-30 group-hover:opacity-50 transition-opacity rounded-full pointer-events-none" />

          {/* Switcher tabs above card */}
          <div className="flex items-center justify-between mb-4 px-2">
            <div className="flex gap-2">
              {sampleCards.map((card, idx) => (
                <button
                  key={card.merchant}
                  onClick={() => {
                    setActiveCardIndex(idx);
                    setShowFullNumber(false);
                    setBlockedNotificationVisible(true);
                  }}
                  className={`px-3 py-1 text-[11px] font-['Space_Grotesk'] font-bold rounded-lg uppercase tracking-wider transition-all border ${
                    activeCardIndex === idx
                      ? 'bg-[#CCFF00]/15 text-[#CCFF00] border-[#CCFF00]/40'
                      : 'bg-white/5 text-neutral-400 border-white/10 hover:border-white/20'
                  }`}
                >
                  {card.merchant}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowFullNumber(!showFullNumber)}
              className="text-[11px] font-mono text-neutral-400 hover:text-[#CCFF00] flex items-center gap-1 transition-colors"
              title="Click to reveal card details"
            >
              <span className="material-symbols-outlined text-xs">
                {showFullNumber ? 'visibility_off' : 'visibility'}
              </span>
              <span>{showFullNumber ? 'Mask' : 'Reveal'}</span>
            </button>
          </div>

          <div className="relative float-animation z-20">
            {/* Glass Virtual Card Container */}
            <div className="glass-card rounded-[2rem] p-7 sm:p-8 aspect-[1.58/1] w-full max-w-lg mx-auto relative overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.6)] border-white/20 transition-all hover:border-[#CCFF00]/40">
              {/* Card glossy mesh gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-black/40 opacity-60 pointer-events-none" />

              {/* Decorative Brand Logo from /public/assets/fevicon.png */}
              <div className="absolute top-0 right-0 p-8 select-none pointer-events-none opacity-85">
                <img
                  src="/assets/fevicon.png"
                  alt="SubSentry Mark"
                  className="w-12 h-12 object-contain drop-shadow-[0_0_12px_rgba(204,255,0,0.4)]"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>

              {/* Card Contents */}
              <div className="flex flex-col h-full justify-between relative z-10">
                <div>
                  {/* Merchant Lock Badge */}
                  <div className="flex items-center gap-2 bg-[#06080F]/60 w-fit px-3 py-1.5 rounded-lg border border-white/10 backdrop-blur-md">
                    <span className="material-symbols-outlined text-[#CCFF00] text-sm">lock</span>
                    <p className="text-[10px] text-[#CCFF00] uppercase tracking-[0.2em] font-bold font-['Space_Grotesk']">
                      Locked to {currentCard.merchant}
                    </p>
                  </div>

                  {/* Masked / Revealed Card Number */}
                  <div className="mt-7">
                    <h3 className="font-['Space_Grotesk'] text-white tracking-[0.2em] text-2xl sm:text-3xl font-bold opacity-95 select-all">
                      {showFullNumber ? currentCard.full : `**** **** **** ${currentCard.last4}`}
                    </h3>
                    <p className="text-[10px] text-neutral-400 font-mono tracking-widest mt-1">
                      MERCHANT-BOUND TOKEN • {currentCard.domain}
                    </p>
                  </div>
                </div>

                {/* Bottom Details with INR Currency */}
                <div className="flex justify-between items-end border-t border-white/10 pt-4">
                  <div>
                    <p className="text-[10px] text-neutral-400 uppercase tracking-[0.2em] mb-1 font-bold font-['Space_Grotesk']">
                      Card Holder
                    </p>
                    <p className="font-['Space_Grotesk'] text-white tracking-widest text-sm font-semibold">
                      {currentCard.holder}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-[10px] text-neutral-400 uppercase tracking-[0.2em] mb-1 font-bold font-['Space_Grotesk']">
                      Spending Limit
                    </p>
                    <p className="font-['Space_Grotesk'] text-[#CCFF00] tracking-widest text-glow text-base sm:text-lg font-bold">
                      {currentCard.limit}
                    </p>
                  </div>
                </div>
              </div>

              {/* Decorative scan line animation */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#CCFF00]/15 to-transparent h-[200%] -translate-y-full animate-scan pointer-events-none" />
            </div>

            {/* Secondary Floating Notification: Auto-Block badge in INR */}
            {blockedNotificationVisible && (
              <div className="absolute -bottom-7 -left-4 sm:-left-7 glass-card p-4 rounded-2xl shadow-2xl border-white/15 backdrop-blur-2xl z-30 transition-all hover:scale-105">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-[#06080F]/90 border border-white/10 flex items-center justify-center text-[#CCFF00] shadow-[0_0_15px_rgba(204,255,0,0.25)] shrink-0">
                    <span className="material-symbols-outlined text-xl">security_update_good</span>
                  </div>
                  <div>
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest font-['Space_Grotesk']">
                        Auto-Block
                      </p>
                      <button 
                        onClick={() => setBlockedNotificationVisible(false)}
                        className="text-neutral-500 hover:text-white text-xs leading-none"
                        aria-label="Dismiss notification"
                      >
                        ×
                      </button>
                    </div>
                    <p className="text-white font-bold text-xs sm:text-sm tracking-wide font-['Space_Grotesk']">
                      {currentCard.autoBlocked}
                    </p>
                    <p className="text-[10px] text-neutral-400 font-mono">
                      {currentCard.reason}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
