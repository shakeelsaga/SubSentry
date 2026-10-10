import React, { useState } from 'react';
import { VirtualCard, TransactionAttempt } from '../types.ts';

interface AttackSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  cards: VirtualCard[];
  onAddTransaction: (tx: TransactionAttempt) => void;
}

export const AttackSimulatorModal: React.FC<AttackSimulatorModalProps> = ({
  isOpen,
  onClose,
  cards,
  onAddTransaction,
}) => {
  const [selectedCardId, setSelectedCardId] = useState<string>(cards[0]?.id || '');
  const [simulationType, setSimulationType] = useState<'legit' | 'hike' | 'rogue' | 'killswitch'>('hike');
  const [customAmount, setCustomAmount] = useState<number>(1999);
  const [rogueMerchant, setRogueMerchant] = useState<string>('ShadyAds DataCorp');
  const [simulating, setSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<TransactionAttempt | null>(null);

  if (!isOpen) return null;

  const selectedCard = cards.find(c => c.id === selectedCardId) || cards[0];

  const runSimulation = () => {
    if (!selectedCard) return;
    setSimulating(true);
    setSimulationResult(null);

    setTimeout(() => {
      let result: TransactionAttempt;
      const now = new Date().toTimeString().split(' ')[0] + ' IST';

      if (simulationType === 'legit') {
        result = {
          id: `tx-${Date.now()}`,
          timestamp: now,
          cardId: selectedCard.id,
          merchantName: selectedCard.merchantName,
          merchantDomain: selectedCard.merchantDomain,
          amount: selectedCard.monthlyLimit,
          status: 'APPROVED',
          reason: `Legitimate charge matches locked domain (${selectedCard.merchantDomain}) and is within monthly cap (₹${selectedCard.monthlyLimit.toLocaleString('en-IN')})`,
          ruleTriggered: 'RULE_MERCHANT_VALIDATED',
        };
      } else if (simulationType === 'hike') {
        const attempted = customAmount > selectedCard.monthlyLimit ? customAmount : selectedCard.monthlyLimit + 750;
        result = {
          id: `tx-${Date.now()}`,
          timestamp: now,
          cardId: selectedCard.id,
          merchantName: selectedCard.merchantName,
          merchantDomain: selectedCard.merchantDomain,
          amount: attempted,
          status: 'BLOCKED',
          reason: `Spend Guard triggered: attempted ₹${attempted.toLocaleString('en-IN')} exceeds strict ceiling of ₹${selectedCard.monthlyLimit.toLocaleString('en-IN')}/mo. Overage dropped with 0 leakage.`,
          ruleTriggered: 'RULE_SPEND_CAP_ENFORCED',
        };
      } else if (simulationType === 'rogue') {
        result = {
          id: `tx-${Date.now()}`,
          timestamp: now,
          cardId: selectedCard.id,
          merchantName: rogueMerchant,
          merchantDomain: `${rogueMerchant.toLowerCase().replace(/\s+/g, '')}.com`,
          amount: customAmount,
          status: 'BLOCKED',
          reason: `Merchant Locking violation: card is hardware-bound exclusively to ${selectedCard.merchantDomain}. Foreign merchant ${rogueMerchant} instantly vaporized (403 Forbidden).`,
          ruleTriggered: 'RULE_MERCHANT_LOCK_VIOLATION',
        };
      } else {
        result = {
          id: `tx-${Date.now()}`,
          timestamp: now,
          cardId: selectedCard.id,
          merchantName: selectedCard.merchantName,
          merchantDomain: selectedCard.merchantDomain,
          amount: customAmount,
          status: 'REVOKED',
          reason: `Hardware Kill-Switch active: consumer initiated hard disconnection between merchant and funds. Token is completely dead.`,
          ruleTriggered: 'RULE_KILLSWITCH_ACTIVE',
        };
      }

      setSimulationResult(result);
      onAddTransaction(result);
      setSimulating(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
      <div 
        className="w-full max-w-xl bg-[#06080F] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl relative font-['Space_Grotesk'] text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#CCFF00]/10 border border-[#CCFF00]/30 flex items-center justify-center text-[#CCFF00]">
              <span className="material-symbols-outlined text-lg">crisis_alert</span>
            </div>
            <div>
              <h3 className="text-lg font-bold uppercase tracking-wider text-white">
                Live Transaction & Threat Simulator
              </h3>
              <p className="text-xs text-neutral-400 font-['Manrope']">
                Simulate inbound subscription billing packets against active rules
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <div className="space-y-5 my-5">
          {/* Pick Card */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-400 font-bold mb-1.5">
              Select Target Virtual Card:
            </label>
            <select
              value={selectedCardId}
              onChange={(e) => setSelectedCardId(e.target.value)}
              className="w-full bg-[#131319] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#CCFF00] font-['Space_Grotesk']"
            >
              {cards.map(c => (
                <option key={c.id} value={c.id}>
                  {c.merchantName} (**** {c.last4}) • Cap: ₹{c.monthlyLimit.toLocaleString('en-IN')}/mo • [{c.status.toUpperCase()}]
                </option>
              ))}
            </select>
          </div>

          {/* Attack / Transaction Scenario */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-400 font-bold mb-2">
              Choose Attack Scenario:
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => { setSimulationType('hike'); setCustomAmount(1999); }}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  simulationType === 'hike'
                    ? 'border-[#CCFF00] bg-[#CCFF00]/10 text-white shadow-[0_0_12px_rgba(204,255,0,0.2)]'
                    : 'border-white/10 bg-white/5 text-neutral-400 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#CCFF00] mb-1">
                  <span className="material-symbols-outlined text-sm">trending_up</span>
                  <span>Price Hike Attempt</span>
                </div>
                <p className="text-[10px] text-neutral-300 font-['Manrope']">
                  Attempts stealth over-cap spike (₹1,999)
                </p>
              </button>

              <button
                type="button"
                onClick={() => { setSimulationType('rogue'); setCustomAmount(1299); }}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  simulationType === 'rogue'
                    ? 'border-[#CCFF00] bg-[#CCFF00]/10 text-white shadow-[0_0_12px_rgba(204,255,0,0.2)]'
                    : 'border-white/10 bg-white/5 text-neutral-400 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#CCFF00] mb-1">
                  <span className="material-symbols-outlined text-sm">warning</span>
                  <span>Rogue Merchant Attack</span>
                </div>
                <p className="text-[10px] text-neutral-300 font-['Manrope']">
                  Foreign MID tries charging merchant-locked card
                </p>
              </button>

              <button
                type="button"
                onClick={() => { setSimulationType('killswitch'); setCustomAmount(selectedCard?.monthlyLimit || 649); }}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  simulationType === 'killswitch'
                    ? 'border-[#CCFF00] bg-[#CCFF00]/10 text-white shadow-[0_0_12px_rgba(204,255,0,0.2)]'
                    : 'border-white/10 bg-white/5 text-neutral-400 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#CCFF00] mb-1">
                  <span className="material-symbols-outlined text-sm">power_settings_new</span>
                  <span>Severed Card Retry</span>
                </div>
                <p className="text-[10px] text-neutral-300 font-['Manrope']">
                  Merchant retries after user engaged Kill-Switch
                </p>
              </button>

              <button
                type="button"
                onClick={() => { setSimulationType('legit'); setCustomAmount(selectedCard?.monthlyLimit || 649); }}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  simulationType === 'legit'
                    ? 'border-[#CCFF00] bg-[#CCFF00]/10 text-white shadow-[0_0_12px_rgba(204,255,0,0.2)]'
                    : 'border-white/10 bg-white/5 text-neutral-400 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#CCFF00] mb-1">
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  <span>Legitimate Renewal</span>
                </div>
                <p className="text-[10px] text-neutral-300 font-['Manrope']">
                  Standard authorized billing within ruleset
                </p>
              </button>
            </div>
          </div>

          {/* Amount input */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-neutral-400 font-bold mb-1">
                Charge Amount (₹):
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 font-mono text-sm">₹</span>
                <input
                  type="number"
                  step="1"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#131319] border border-white/10 rounded-xl pl-7 pr-3 py-2 text-sm text-white font-mono font-bold focus:outline-none focus:border-[#CCFF00]"
                />
              </div>
            </div>

            {simulationType === 'rogue' && (
              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-400 font-bold mb-1">
                  Rogue Entity Name:
                </label>
                <input
                  type="text"
                  value={rogueMerchant}
                  onChange={(e) => setRogueMerchant(e.target.value)}
                  className="w-full bg-[#131319] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#CCFF00]"
                />
              </div>
            )}
          </div>

          {/* Results display */}
          {simulationResult && (
            <div className={`p-4 rounded-2xl border transition-all ${
              simulationResult.status === 'APPROVED'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                : 'bg-red-500/10 border-red-500/30 text-red-200'
            }`}>
              <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 font-['Space_Grotesk']">
                  <span className={`w-2 h-2 rounded-full ${simulationResult.status === 'APPROVED' ? 'bg-emerald-400' : 'bg-red-400'} animate-pulse`} />
                  FIREWALL DISPOSITION: {simulationResult.status}
                </span>
                <span className="text-[10px] font-mono opacity-70">
                  {simulationResult.timestamp}
                </span>
              </div>
              <p className="text-xs font-['Manrope'] mb-2 font-medium">
                {simulationResult.reason}
              </p>
              <div className="text-[10px] font-mono opacity-80 flex justify-between">
                <span>Rule: {simulationResult.ruleTriggered}</span>
                <span className="text-[#CCFF00] font-bold">Overage Leak: ₹0</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 pt-4 border-t border-white/10">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-white/15 text-neutral-300 hover:text-white hover:bg-white/5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={runSimulation}
            disabled={simulating}
            className="flex-1 py-3 rounded-xl bg-[#CCFF00] text-[#06080F] hover:bg-[#b8e600] text-xs font-black uppercase tracking-widest transition-all neon-glow-primary active-scale cursor-pointer flex items-center justify-center gap-2"
          >
            {simulating ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-[#06080F] border-t-transparent rounded-full animate-spin" />
                <span>Simulating...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-base">bolt</span>
                <span>Fire Inbound Packet</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
