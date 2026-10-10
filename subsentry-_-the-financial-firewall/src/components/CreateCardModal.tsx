import React, { useState } from 'react';
import { VirtualCard } from '../types.ts';

interface CreateCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateCard: (card: VirtualCard) => void;
}

const PRESET_MERCHANTS = [
  { name: 'Netflix', domain: 'netflix.com', category: 'Streaming' as const, suggestedLimit: 649 },
  { name: 'Spotify', domain: 'spotify.com', category: 'Streaming' as const, suggestedLimit: 119 },
  { name: 'AWS Cloud', domain: 'aws.amazon.com', category: 'Cloud & VPS' as const, suggestedLimit: 4500 },
  { name: 'GitHub Copilot', domain: 'github.com', category: 'Developer' as const, suggestedLimit: 899 },
  { name: 'OpenAI ChatGPT', domain: 'openai.com', category: 'AI & SaaS' as const, suggestedLimit: 1999 },
  { name: 'Adobe Creative', domain: 'adobe.com', category: 'Developer' as const, suggestedLimit: 4230 },
  { name: 'Cult.fit Gym', domain: 'cult.fit', category: 'Gym & Wellness' as const, suggestedLimit: 1750 },
];

export const CreateCardModal: React.FC<CreateCardModalProps> = ({
  isOpen,
  onClose,
  onCreateCard,
}) => {
  const [merchantName, setMerchantName] = useState('Netflix');
  const [merchantDomain, setMerchantDomain] = useState('netflix.com');
  const [merchantCategory, setMerchantCategory] = useState<VirtualCard['merchantCategory']>('Streaming');
  const [cardHolder, setCardHolder] = useState('OBSIDIAN ELITE');
  const [monthlyLimit, setMonthlyLimit] = useState(649);
  const [isMerchantLocked, setIsMerchantLocked] = useState(true);
  const [isBurner, setIsBurner] = useState(false);

  if (!isOpen) return null;

  const handleSelectPreset = (preset: typeof PRESET_MERCHANTS[0]) => {
    setMerchantName(preset.name);
    setMerchantDomain(preset.domain);
    setMerchantCategory(preset.category);
    setMonthlyLimit(preset.suggestedLimit);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const randomLast4 = Math.floor(1000 + Math.random() * 9000).toString();
    const newCard: VirtualCard = {
      id: `card-${Date.now()}`,
      merchantName: merchantName.trim() || 'Custom Merchant',
      merchantDomain: merchantDomain.trim() || `${merchantName.toLowerCase().replace(/\s+/g, '')}.com`,
      merchantCategory,
      last4: randomLast4,
      fullCardNumber: `4${Math.floor(100 + Math.random() * 900)} ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)} ${randomLast4}`,
      expiry: '12/29',
      cvv: Math.floor(100 + Math.random() * 900).toString(),
      cardHolder: cardHolder.toUpperCase() || 'OBSIDIAN ELITE',
      monthlyLimit: Number(monthlyLimit) || 500,
      currentSpend: 0,
      status: 'active',
      isMerchantLocked,
      isBurner,
      autoBlockCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };

    onCreateCard(newCard);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
      <div 
        className="w-full max-w-lg bg-[#06080F] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl relative font-['Space_Grotesk'] text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#CCFF00]/10 border border-[#CCFF00]/30 flex items-center justify-center text-[#CCFF00]">
              <span className="material-symbols-outlined text-lg">add_card</span>
            </div>
            <div>
              <h3 className="text-lg font-bold uppercase tracking-wider text-white">
                Deploy Merchant Shield Card
              </h3>
              <p className="text-xs text-neutral-400 font-['Manrope']">
                Isolated virtual token with hardware spend limits
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

        {/* Preset quick buttons */}
        <div className="my-5">
          <p className="text-[11px] text-neutral-400 uppercase tracking-widest font-bold mb-2">
            Quick Merchant Presets:
          </p>
          <div className="flex flex-wrap gap-2">
            {PRESET_MERCHANTS.map(preset => (
              <button
                key={preset.name}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                  merchantName === preset.name
                    ? 'bg-[#CCFF00] text-[#06080F] font-bold shadow-[0_0_10px_rgba(204,255,0,0.3)]'
                    : 'bg-white/5 text-neutral-300 border border-white/10 hover:border-white/20'
                }`}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-neutral-400 font-bold mb-1.5">
                Merchant Name
              </label>
              <input
                type="text"
                value={merchantName}
                onChange={(e) => setMerchantName(e.target.value)}
                required
                className="w-full bg-[#131319] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#CCFF00] font-['Manrope']"
                placeholder="e.g. Netflix"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-neutral-400 font-bold mb-1.5">
                Lock Domain
              </label>
              <input
                type="text"
                value={merchantDomain}
                onChange={(e) => setMerchantDomain(e.target.value)}
                required
                className="w-full bg-[#131319] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#CCFF00] font-mono text-xs"
                placeholder="netflix.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-neutral-400 font-bold mb-1.5">
                Monthly Spend Cap (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 font-mono text-sm">
                  ₹
                </span>
                <input
                  type="number"
                  step="1"
                  min="1"
                  max="50000"
                  value={monthlyLimit}
                  onChange={(e) => setMonthlyLimit(parseFloat(e.target.value) || 0)}
                  required
                  className="w-full bg-[#131319] border border-white/10 rounded-xl pl-7 pr-3 py-2.5 text-sm text-[#CCFF00] font-bold focus:outline-none focus:border-[#CCFF00] font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-neutral-400 font-bold mb-1.5">
                Card Holder Alias
              </label>
              <input
                type="text"
                value={cardHolder}
                onChange={(e) => setCardHolder(e.target.value)}
                className="w-full bg-[#131319] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#CCFF00] font-['Space_Grotesk'] tracking-wider"
              />
            </div>
          </div>

          {/* Security toggles */}
          <div className="space-y-2.5 pt-2">
            <label className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:border-white/20 transition-all">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[#CCFF00] text-lg">lock</span>
                <div>
                  <p className="text-xs font-bold text-white uppercase tracking-wider">
                    Strict Merchant Domain Locking
                  </p>
                  <p className="text-[10px] text-neutral-400 font-['Manrope']">
                    Physically drops any transaction from foreign merchant IDs
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={isMerchantLocked}
                onChange={(e) => setIsMerchantLocked(e.target.checked)}
                className="w-4 h-4 accent-[#CCFF00] rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:border-white/20 transition-all">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-neutral-300 text-lg">local_fire_department</span>
                <div>
                  <p className="text-xs font-bold text-white uppercase tracking-wider">
                    Single-Use Burner Mode
                  </p>
                  <p className="text-[10px] text-neutral-400 font-['Manrope']">
                    Auto-destructs the token immediately after the first successful charge
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={isBurner}
                onChange={(e) => setIsBurner(e.target.checked)}
                className="w-4 h-4 accent-[#CCFF00] rounded cursor-pointer"
              />
            </label>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-white/15 text-neutral-300 hover:text-white hover:bg-white/5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-[#CCFF00] text-[#06080F] hover:bg-[#b8e600] text-xs font-black uppercase tracking-widest transition-all neon-glow-primary active-scale cursor-pointer"
            >
              Deploy Card Now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
