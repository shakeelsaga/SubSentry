import React, { useState } from 'react';

export const SpendingBreakdownSection: React.FC = () => {
  const [selectedTag, setSelectedTag] = useState<string>('Local Ruleset');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const caps = [
    {
      name: 'Cloud & VPS',
      current: 3499,
      cap: 4500,
      percentage: 78,
      statusLabel: '78%',
      barColor: 'bg-[#CCFF00]',
      textColor: 'text-[#CCFF00]',
      status: 'active',
    },
    {
      name: 'Media Streaming',
      current: 649,
      cap: 650,
      percentage: 99,
      statusLabel: '99% (Locked)',
      barColor: 'bg-white/70',
      textColor: 'text-white',
      status: 'locked',
    },
    {
      name: 'Developer Tools',
      current: 2399,
      cap: 2500,
      percentage: 96,
      statusLabel: '96%',
      barColor: 'bg-[#CCFF00]',
      textColor: 'text-[#CCFF00]',
      status: 'active',
    },
    {
      name: 'Gym & Wellness',
      current: 0,
      cap: 1750,
      percentage: 0,
      statusLabel: 'REVOKED',
      barColor: 'bg-white/20',
      textColor: 'text-neutral-500',
      status: 'revoked',
    },
  ];

  return (
    <section id="rules" className="py-20 px-6 border-t border-white/5 bg-[#06080F]">
      <div className="max-w-7xl mx-auto">
        <div className="glass-card rounded-[3rem] p-8 sm:p-12 lg:p-14 border-white/10 relative overflow-hidden">
          {/* Subtle radial corner glow */}
          <div className="absolute right-0 top-0 w-1/2 h-full bg-[radial-gradient(circle_at_center,rgba(204,255,0,0.06)_0%,transparent_100%)] pointer-events-none" />

          <div className="flex flex-col md:flex-row justify-between items-center gap-12 relative z-10">
            {/* Left Column */}
            <div className="max-w-md w-full">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#CCFF00]/30 bg-[#CCFF00]/5 mb-4 text-[10px] font-bold text-[#CCFF00] uppercase tracking-widest font-['Space_Grotesk']">
                Deterministic Rules Engine
              </div>

              <h3 className="font-['Space_Grotesk'] text-white mb-4 uppercase tracking-tight text-3xl sm:text-4xl font-extrabold leading-tight">
                Spending Breakdown & Cap Triggers
              </h3>

              <p className="text-neutral-400 font-['Manrope'] text-sm sm:text-base leading-relaxed mb-6">
                Client-side rules inspect recurrent billing intervals. Any silently altered charge or stealth subscription spike triggers an immediate token revocation.
              </p>

              {/* Tag Controls */}
              <div className="flex flex-wrap gap-2 text-[11px] font-mono">
                {['No AI Hallucinations', 'Deterministic Caps', 'Local Ruleset'].map(tag => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                      selectedTag === tag
                        ? 'border-[#CCFF00]/40 bg-[#CCFF00]/10 text-[#CCFF00] shadow-[0_0_10px_rgba(204,255,0,0.15)]'
                        : 'border-white/10 bg-white/5 text-neutral-300 hover:border-white/20'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              {/* Tag explanation */}
              <div className="mt-4 p-3 rounded-xl bg-black/40 border border-white/5 text-xs text-neutral-400 font-mono">
                {selectedTag === 'No AI Hallucinations' && (
                  <span>Zero probabilistic LLMs in the critical path. Hard boolean logic guarantees predictable zero-leakage protection.</span>
                )}
                {selectedTag === 'Deterministic Caps' && (
                  <span>Explicit price ceilings bound per merchant token. Attempted overages are discarded at the transport layer.</span>
                )}
                {selectedTag === 'Local Ruleset' && (
                  <span>Rules are compiled into client-side hardware enclaves. No external cloud dependency required for active defense.</span>
                )}
              </div>
            </div>

            {/* Right Column: Active Budget Caps Card in INR */}
            <div className="w-full md:w-1/2 bg-[#06080F]/95 rounded-2xl p-6 sm:p-7 border border-white/10 shadow-2xl relative font-['Space_Grotesk']">
              <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-3">
                <div>
                  <p className="text-xs font-bold text-white uppercase tracking-wider">
                    Active Budget Caps
                  </p>
                  <p className="text-[10px] text-neutral-500 font-mono">
                    Auto-pause triggers configured
                  </p>
                </div>
                <span className="text-[10px] text-[#CCFF00] font-mono uppercase bg-[#CCFF00]/10 border border-[#CCFF00]/30 px-2.5 py-1 rounded font-bold">
                  Auto-Lock Ready
                </span>
              </div>

              {/* Progress Bars */}
              <div className="space-y-5">
                {caps.map(cap => (
                  <div
                    key={cap.name}
                    onClick={() => setSelectedCategory(selectedCategory === cap.name ? null : cap.name)}
                    className="space-y-1.5 p-2 rounded-xl transition-colors hover:bg-white/5 cursor-pointer"
                  >
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="text-white font-bold">
                        {cap.name} (₹{cap.current.toLocaleString('en-IN')} / ₹{cap.cap.toLocaleString('en-IN')} cap)
                      </span>
                      <span className={`font-bold ${cap.textColor}`}>
                        {cap.statusLabel}
                      </span>
                    </div>

                    {/* Progress track */}
                    <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden p-[1px]">
                      <div
                        className={`h-full ${cap.barColor} rounded-full transition-all duration-700 ease-out`}
                        style={{ width: `${cap.percentage}%` }}
                      />
                    </div>

                    {selectedCategory === cap.name && (
                      <p className="text-[10px] text-neutral-400 font-mono pt-1">
                        Trigger policy: Auto-lock when within 5% of ceiling • 0 overage tolerance
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Card Footer */}
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-neutral-400 font-mono">
                <span>Protocol: Hard caps strictly enforced</span>
                <span className="text-[#CCFF00] font-bold">
                  ₹0 Overage Leak
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
