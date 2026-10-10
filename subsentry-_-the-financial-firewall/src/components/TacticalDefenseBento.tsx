import React, { useState } from 'react';

export const TacticalDefenseBento: React.FC = () => {
  const [card1Locked, setCard1Locked] = useState(true);
  const [killSwitchActive, setKillSwitchActive] = useState(false);
  const [spendCap, setSpendCap] = useState(649);

  return (
    <section id="features" className="py-24 px-6 relative bg-[#06080F]/50 border-y border-white/5">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-['Space_Grotesk'] text-3xl sm:text-5xl text-white mb-4 tracking-tight uppercase font-extrabold">
            Tactical Financial Defense
          </h2>
          <p className="text-neutral-400 max-w-2xl mx-auto font-['Manrope'] text-base sm:text-lg">
            Take absolute control of your digital footprint with merchant-specific hardware isolation for your money.
          </p>
        </div>

        {/* 3-Column Bento Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 01: Merchant Locking */}
          <div className="glass-card p-8 sm:p-10 rounded-[2rem] hover:border-[#CCFF00]/40 transition-all group relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none select-none">
              <span className="font-['Space_Grotesk'] text-6xl text-white font-black">01</span>
            </div>

            <div>
              <div className="w-14 h-14 rounded-2xl bg-[#06080F] border border-white/10 flex items-center justify-center text-white mb-8 group-hover:border-[#CCFF00]/50 group-hover:text-[#CCFF00] transition-all shadow-lg relative z-10">
                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  lock
                </span>
              </div>

              <h3 className="font-['Space_Grotesk'] text-white mb-4 tracking-wide uppercase text-xl font-bold relative z-10">
                Merchant Locking
              </h3>
              <p className="text-neutral-400 font-['Manrope'] text-sm sm:text-base leading-relaxed relative z-10 mb-6">
                Cards that physically cannot be used anywhere else. Once a card is locked to a service, any other charge attempt is instantly vaporized.
              </p>
            </div>

            {/* Interactive micro-demonstration */}
            <div className="relative z-10 pt-4 border-t border-white/10 mt-auto">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-white/5">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${card1Locked ? 'bg-[#CCFF00]' : 'bg-red-400'} animate-pulse`} />
                  <span className="text-[11px] font-mono text-neutral-300">
                    netflix.com only
                  </span>
                </div>
                <button
                  onClick={() => setCard1Locked(!card1Locked)}
                  className={`text-[10px] font-['Space_Grotesk'] font-bold px-2.5 py-1 rounded transition-colors ${
                    card1Locked
                      ? 'bg-[#CCFF00]/15 text-[#CCFF00] border border-[#CCFF00]/30'
                      : 'bg-white/10 text-neutral-300'
                  }`}
                >
                  {card1Locked ? 'ENFORCED' : 'UNLOCKED'}
                </button>
              </div>
            </div>
          </div>

          {/* Feature 02: Instant Kill-Switch */}
          <div className="glass-card p-8 sm:p-10 rounded-[2rem] hover:border-[#CCFF00]/40 transition-all group relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none select-none">
              <span className="font-['Space_Grotesk'] text-6xl text-white font-black">02</span>
            </div>

            <div>
              <div className="w-14 h-14 rounded-2xl bg-[#06080F] border border-white/10 flex items-center justify-center text-white mb-8 group-hover:border-[#CCFF00]/50 group-hover:text-[#CCFF00] transition-all shadow-lg relative z-10">
                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  power_settings_new
                </span>
              </div>

              <h3 className="font-['Space_Grotesk'] text-white mb-4 tracking-wide uppercase text-xl font-bold relative z-10">
                Instant Kill-Switch
              </h3>
              <p className="text-neutral-400 font-['Manrope'] text-sm sm:text-base leading-relaxed relative z-10 mb-6">
                One click to terminate. No "talk to support," no "cancellation queues." Just a hard disconnection between the merchant and your funds.
              </p>
            </div>

            {/* Interactive micro-demonstration */}
            <div className="relative z-10 pt-4 border-t border-white/10 mt-auto">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-white/5">
                <div className="flex items-center gap-2">
                  <span className={`material-symbols-outlined text-sm ${killSwitchActive ? 'text-red-400' : 'text-[#CCFF00]'}`}>
                    {killSwitchActive ? 'block' : 'shield'}
                  </span>
                  <span className="text-[11px] font-mono text-neutral-300">
                    {killSwitchActive ? 'Token Severed' : 'Channel Armed'}
                  </span>
                </div>
                <button
                  onClick={() => setKillSwitchActive(!killSwitchActive)}
                  className={`text-[10px] font-['Space_Grotesk'] font-bold px-2.5 py-1 rounded transition-all active-scale ${
                    killSwitchActive
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : 'bg-white/10 text-neutral-300 hover:bg-white/20'
                  }`}
                >
                  {killSwitchActive ? 'RESET' : 'KILL NOW'}
                </button>
              </div>
            </div>
          </div>

          {/* Feature 03: Spend Guard (with INR ₹ values) */}
          <div className="glass-card p-8 sm:p-10 rounded-[2rem] hover:border-[#CCFF00]/40 transition-all group relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none select-none">
              <span className="font-['Space_Grotesk'] text-6xl text-white font-black">03</span>
            </div>

            <div>
              <div className="w-14 h-14 rounded-2xl bg-[#06080F] border border-white/10 flex items-center justify-center text-white mb-8 group-hover:border-[#CCFF00]/50 group-hover:text-[#CCFF00] transition-all shadow-lg relative z-10">
                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  verified_user
                </span>
              </div>

              <h3 className="font-['Space_Grotesk'] text-white mb-4 tracking-wide uppercase text-xl font-bold relative z-10">
                Spend Guard
              </h3>
              <p className="text-neutral-400 font-['Manrope'] text-sm sm:text-base leading-relaxed relative z-10 mb-6">
                Set hard caps on every card. If a service attempts an unexpected price hike, our deterministic rules engine blocks the overage automatically.
              </p>
            </div>

            {/* Interactive micro-demonstration with INR */}
            <div className="relative z-10 pt-4 border-t border-white/10 mt-auto">
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-2">
                <div className="flex justify-between items-center text-[11px] font-mono">
                  <span className="text-neutral-400">Hard Cap:</span>
                  <span className="text-[#CCFF00] font-bold">₹{spendCap.toLocaleString('en-IN')}/mo</span>
                </div>
                <input
                  type="range"
                  min="99"
                  max="4999"
                  step="50"
                  value={spendCap}
                  onChange={(e) => setSpendCap(parseInt(e.target.value, 10))}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#CCFF00]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
