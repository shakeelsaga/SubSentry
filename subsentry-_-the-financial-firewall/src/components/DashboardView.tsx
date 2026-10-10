import React, { useState } from 'react';
import { VirtualCard, TransactionAttempt, FirewallRule } from '../types.ts';

interface DashboardViewProps {
  cards: VirtualCard[];
  transactions: TransactionAttempt[];
  rules: FirewallRule[];
  onOpenCreateCard: () => void;
  onOpenSimulator: () => void;
  onToggleKillSwitch: (cardId: string) => void;
  onToggleMerchantLock: (cardId: string) => void;
  onUpdateCardLimit: (cardId: string, newLimit: number) => void;
  onToggleRule: (ruleId: string) => void;
  onBackToLanding: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  cards,
  transactions,
  rules,
  onOpenCreateCard,
  onOpenSimulator,
  onToggleKillSwitch,
  onToggleMerchantLock,
  onUpdateCardLimit,
  onToggleRule,
  onBackToLanding,
}) => {
  const [activeTab, setActiveTab] = useState<'cards' | 'rules' | 'telemetry'>('cards');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [revealedCardIds, setRevealedCardIds] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [emergencyKillEngaged, setEmergencyKillEngaged] = useState(false);
  const [telemetrySearch, setTelemetrySearch] = useState('');

  // Total statistics in INR
  const totalMonthlyCap = cards.reduce((acc, c) => acc + (c.status !== 'revoked' ? c.monthlyLimit : 0), 0);
  const totalCurrentSpend = cards.reduce((acc, c) => acc + (c.status !== 'revoked' ? c.currentSpend : 0), 0);
  const totalBlockedCount = transactions.filter(t => t.status === 'BLOCKED' || t.status === 'REVOKED').length;
  const totalBlockedAmount = transactions
    .filter(t => t.status === 'BLOCKED' || t.status === 'REVOKED')
    .reduce((acc, t) => acc + t.amount, 0);

  const categories = ['All', 'Streaming', 'Cloud & VPS', 'Developer', 'AI & SaaS', 'Gym & Wellness'];

  const filteredCards = cards.filter(c => {
    if (categoryFilter === 'All') return true;
    return c.merchantCategory === categoryFilter;
  });

  const toggleReveal = (id: string) => {
    setRevealedCardIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleEmergencyKillAll = () => {
    const nextState = !emergencyKillEngaged;
    setEmergencyKillEngaged(nextState);
    cards.forEach(c => {
      if (nextState && c.status === 'active') {
        onToggleKillSwitch(c.id);
      } else if (!nextState && c.status === 'revoked') {
        onToggleKillSwitch(c.id);
      }
    });
  };

  const filteredTelemetry = transactions.filter(t => {
    if (!telemetrySearch) return true;
    const q = telemetrySearch.toLowerCase();
    return (
      t.merchantName.toLowerCase().includes(q) ||
      t.reason.toLowerCase().includes(q) ||
      t.status.toLowerCase().includes(q) ||
      t.ruleTriggered.toLowerCase().includes(q)
    );
  });

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 max-w-7xl mx-auto font-['Space_Grotesk']">
      {/* Top Console Action Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 mb-8 border-b border-white/10">
        <div>
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#CCFF00] animate-pulse shadow-[0_0_8px_#CCFF00]" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#CCFF00]">
              Firewall Node #01-Local • Hardware Enclave
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl text-white font-extrabold uppercase tracking-tight mt-1">
            Sentinel Subscription Command
          </h1>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onOpenSimulator}
            className="glass-card hover:bg-white/10 text-white px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all active-scale cursor-pointer"
          >
            <span className="material-symbols-outlined text-[#CCFF00] text-base">crisis_alert</span>
            <span>Simulate Charge</span>
          </button>

          <button
            onClick={onOpenCreateCard}
            className="bg-[#CCFF00] text-[#06080F] px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider neon-glow-primary flex items-center gap-2 transition-all active-scale cursor-pointer shadow-lg"
          >
            <span className="material-symbols-outlined text-base">add</span>
            <span>New Merchant Card</span>
          </button>

          <button
            onClick={handleEmergencyKillAll}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all active-scale cursor-pointer border ${
              emergencyKillEngaged
                ? 'bg-red-500 text-white border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.5)]'
                : 'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20'
            }`}
          >
            <span className="material-symbols-outlined text-base">power_settings_new</span>
            <span>{emergencyKillEngaged ? 'EMERGENCY ARMED (ALL SEVERED)' : 'KILL-ALL SWITCH'}</span>
          </button>

          <button
            onClick={onBackToLanding}
            className="p-2.5 text-neutral-400 hover:text-white rounded-xl border border-white/10 hover:border-white/20 transition-colors cursor-pointer"
            title="Return to Landing Page"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Strip in INR */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* KPI 1 */}
        <div className="glass-card p-5 rounded-2xl border-white/10 relative overflow-hidden">
          <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold mb-1">
            Active Guarded Cards
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">
              {cards.filter(c => c.status === 'active').length}
            </span>
            <span className="text-xs text-neutral-400 font-mono">
              / {cards.length} deployed
            </span>
          </div>
          <p className="text-[10px] text-[#CCFF00] font-mono mt-1">
            100% Hardware Isolated
          </p>
        </div>

        {/* KPI 2 */}
        <div className="glass-card p-5 rounded-2xl border-white/10 relative overflow-hidden">
          <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold mb-1">
            Monthly Spend Cap
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#CCFF00] font-mono">
              ₹{totalCurrentSpend.toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-neutral-400 font-mono">
              / ₹{totalMonthlyCap.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="w-full h-1.5 bg-white/10 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-[#CCFF00] rounded-full"
              style={{ width: `${Math.min(100, (totalCurrentSpend / (totalMonthlyCap || 1)) * 100)}%` }}
            />
          </div>
        </div>

        {/* KPI 3 */}
        <div className="glass-card p-5 rounded-2xl border-white/10 relative overflow-hidden">
          <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold mb-1">
            Capital Defended
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
              ₹{totalBlockedAmount.toLocaleString('en-IN')}
            </span>
          </div>
          <p className="text-[10px] text-neutral-400 font-mono mt-1">
            0 Overage Leakage Detected
          </p>
        </div>

        {/* KPI 4 */}
        <div className="glass-card p-5 rounded-2xl border-white/10 relative overflow-hidden">
          <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold mb-1">
            Threats Thwarted
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#CCFF00] font-mono">
              {totalBlockedCount}
            </span>
            <span className="text-xs text-neutral-400 font-mono">drops</span>
          </div>
          <p className="text-[10px] text-[#CCFF00] font-mono mt-1">
            403 Forbidden Auto-Drop Active
          </p>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4 mb-8">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('cards')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'cards'
                ? 'bg-[#CCFF00] text-[#06080F] shadow-lg'
                : 'text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10'
            }`}
          >
            Virtual Card Vault ({cards.length})
          </button>

          <button
            onClick={() => setActiveTab('rules')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'rules'
                ? 'bg-[#CCFF00] text-[#06080F] shadow-lg'
                : 'text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10'
            }`}
          >
            Rules Engine ({rules.filter(r => r.isEnabled).length} Armed)
          </button>

          <button
            onClick={() => setActiveTab('telemetry')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'telemetry'
                ? 'bg-[#CCFF00] text-[#06080F] shadow-lg'
                : 'text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10'
            }`}
          >
            Audit Telemetry ({transactions.length})
          </button>
        </div>

        {activeTab === 'cards' && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors whitespace-nowrap cursor-pointer ${
                  categoryFilter === cat
                    ? 'bg-white/20 text-[#CCFF00] border border-[#CCFF00]/40'
                    : 'text-neutral-400 hover:text-white bg-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* TAB 1: Virtual Cards Grid in INR */}
      {activeTab === 'cards' && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCards.map(card => {
            const isRevealed = !!revealedCardIds[card.id];
            const isRevoked = card.status === 'revoked';
            const percentUsed = card.monthlyLimit > 0 ? (card.currentSpend / card.monthlyLimit) * 100 : 0;

            return (
              <div
                key={card.id}
                className={`glass-card p-6 rounded-[1.75rem] border transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
                  isRevoked
                    ? 'border-red-500/20 opacity-70 bg-red-950/5'
                    : 'border-white/15 hover:border-[#CCFF00]/40 shadow-xl'
                }`}
              >
                {/* Background card glare */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/30 pointer-events-none" />

                {/* Top Card Bar */}
                <div className="relative z-10 mb-5">
                  <div className="flex items-center justify-between mb-4">
                    {/* Merchant Lock Badge */}
                    <button
                      onClick={() => onToggleMerchantLock(card.id)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer border ${
                        card.isMerchantLocked
                          ? 'bg-[#CCFF00]/10 text-[#CCFF00] border-[#CCFF00]/30'
                          : 'bg-white/10 text-neutral-400 border-white/10'
                      }`}
                      title="Click to toggle merchant binding"
                    >
                      <span className="material-symbols-outlined text-xs">
                        {card.isMerchantLocked ? 'lock' : 'lock_open'}
                      </span>
                      <span>{card.isMerchantLocked ? `Locked: ${card.merchantDomain}` : 'Unlocked'}</span>
                    </button>

                    {/* Kill-switch state pill */}
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                      isRevoked ? 'bg-red-500/20 text-red-400' : 'bg-white/10 text-neutral-300'
                    }`}>
                      {card.status}
                    </span>
                  </div>

                  {/* Merchant Name & Card Number */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-bold text-white tracking-wide uppercase">
                        {card.merchantName}
                      </h4>
                      <p className="text-[10px] text-neutral-400 font-mono">
                        {card.merchantCategory} • Alias: {card.cardHolder}
                      </p>
                    </div>

                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-[#CCFF00] text-sm">
                      {card.merchantName.slice(0, 2).toUpperCase()}
                    </div>
                  </div>

                  {/* Card Number & Reveal / Copy */}
                  <div className="mt-5 p-3 rounded-xl bg-black/50 border border-white/5 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-mono font-bold tracking-widest text-white select-all">
                        {isRevealed ? card.fullCardNumber : `•••• •••• •••• ${card.last4}`}
                      </p>
                      {isRevealed && (
                        <p className="text-[10px] font-mono text-neutral-400 mt-0.5">
                          EXP: {card.expiry} • CVV: {card.cvv}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => toggleReveal(card.id)}
                        className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                        title={isRevealed ? 'Mask card' : 'Reveal card number & CVV'}
                      >
                        <span className="material-symbols-outlined text-sm">
                          {isRevealed ? 'visibility_off' : 'visibility'}
                        </span>
                      </button>
                      <button
                        onClick={() => copyToClipboard(card.fullCardNumber, card.id)}
                        className="p-1.5 text-neutral-400 hover:text-[#CCFF00] rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                        title="Copy card number"
                      >
                        <span className="material-symbols-outlined text-sm">
                          {copiedId === card.id ? 'check' : 'content_copy'}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Middle Spending & Cap Controls with INR */}
                <div className="relative z-10 space-y-3 pt-3 border-t border-white/10 my-3">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-neutral-400">Monthly Usage:</span>
                    <span className="text-white font-bold">
                      ₹{card.currentSpend.toLocaleString('en-IN')} / <span className="text-[#CCFF00]">₹{card.monthlyLimit.toLocaleString('en-IN')}</span>
                    </span>
                  </div>

                  {/* Visual limit track */}
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isRevoked ? 'bg-red-500/50' : percentUsed >= 95 ? 'bg-white' : 'bg-[#CCFF00]'
                      }`}
                      style={{ width: `${Math.min(100, percentUsed)}%` }}
                    />
                  </div>

                  {/* Spend Cap Slider Adjustment */}
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[10px] text-neutral-400 font-mono">Cap:</span>
                    <input
                      type="range"
                      min="99"
                      max="10000"
                      step="50"
                      value={card.monthlyLimit}
                      onChange={(e) => onUpdateCardLimit(card.id, parseFloat(e.target.value))}
                      disabled={isRevoked}
                      className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#CCFF00] disabled:opacity-40"
                    />
                    <span className="text-[11px] font-mono font-bold text-[#CCFF00] shrink-0">
                      ₹{card.monthlyLimit.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Bottom Actions: Kill-Switch & Diagnostics */}
                <div className="relative z-10 pt-3 border-t border-white/10 flex items-center justify-between gap-3">
                  <div className="text-[10px] font-mono text-neutral-400">
                    Auto-blocks: <span className="text-[#CCFF00] font-bold">{card.autoBlockCount}</span>
                  </div>

                  <button
                    onClick={() => onToggleKillSwitch(card.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all active-scale cursor-pointer ${
                      isRevoked
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25'
                        : 'bg-red-500/15 text-red-400 border border-red-500/30 hover:bg-red-500/25'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">
                      {isRevoked ? 'refresh' : 'power_settings_new'}
                    </span>
                    <span>{isRevoked ? 'Restore Token' : 'Kill-Switch'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: Rules Engine */}
      {activeTab === 'rules' && (
        <div className="space-y-4 max-w-4xl mx-auto">
          <div className="glass-card p-6 rounded-2xl border-white/10 mb-6">
            <h3 className="text-lg font-bold uppercase tracking-wider text-white mb-2">
              Deterministic Hardware Rules Matrix
            </h3>
            <p className="text-xs text-neutral-400 font-['Manrope']">
              These client-side rule filters run before clearing network auth packets. Each rule executes deterministically without AI hallucination or statistical latency.
            </p>
          </div>

          <div className="space-y-4">
            {rules.map(rule => (
              <div
                key={rule.id}
                className="glass-card p-6 rounded-2xl border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors hover:border-white/20"
              >
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-[#CCFF00] font-bold">
                      [{rule.code}]
                    </span>
                    <h4 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider">
                      {rule.name}
                    </h4>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold ${
                      rule.strictness === 'hard' ? 'bg-[#CCFF00]/15 text-[#CCFF00]' : 'bg-white/10 text-neutral-300'
                    }`}>
                      {rule.strictness} ceiling
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 font-['Manrope']">
                    {rule.description}
                  </p>
                  <p className="text-[10px] text-neutral-500 font-mono">
                    Triggered: {rule.triggerCount} unauthorized attempts dropped
                  </p>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <button
                    onClick={() => onToggleRule(rule.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      rule.isEnabled
                        ? 'bg-[#CCFF00] text-[#06080F] font-black'
                        : 'bg-white/10 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {rule.isEnabled ? 'ARMED' : 'DISABLED'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Telemetry Log Console */}
      {activeTab === 'telemetry' && (
        <div className="glass-card rounded-2xl border-white/10 p-6 max-w-5xl mx-auto font-mono">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#CCFF00] animate-pulse" />
              <span className="text-xs text-white font-bold uppercase tracking-wider">
                Live Transport Packet Inspector
              </span>
            </div>

            <div className="w-full sm:w-64">
              <input
                type="text"
                value={telemetrySearch}
                onChange={(e) => setTelemetrySearch(e.target.value)}
                placeholder="Search audit log..."
                className="w-full bg-[#131319] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#CCFF00]"
              />
            </div>
          </div>

          {/* Terminal log entries with INR */}
          <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-2">
            {filteredTelemetry.length === 0 ? (
              <p className="text-xs text-neutral-500 py-8 text-center font-mono">
                No matching telemetry packets found.
              </p>
            ) : (
              filteredTelemetry.map(tx => (
                <div
                  key={tx.id}
                  className="p-3.5 rounded-xl bg-black/60 border border-white/5 hover:border-white/15 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-neutral-500 text-[10px]">{tx.timestamp}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        tx.status === 'APPROVED'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : tx.status === 'REVOKED'
                          ? 'bg-purple-500/20 text-purple-300'
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        [{tx.status}]
                      </span>
                      <span className="text-white font-bold">{tx.merchantName}</span>
                      <span className="text-neutral-400 font-mono text-[11px]">
                        (₹{tx.amount.toLocaleString('en-IN')})
                      </span>
                    </div>
                    <p className="text-neutral-400 text-[11px] font-['Manrope']">
                      {tx.reason}
                    </p>
                  </div>

                  <div className="shrink-0 text-right md:text-right">
                    <span className="text-[10px] text-[#CCFF00] font-mono">
                      {tx.ruleTriggered}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
