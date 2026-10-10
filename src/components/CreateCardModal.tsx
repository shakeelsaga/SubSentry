import React, { useState } from 'react';
import { X, ShieldPlus, Zap, Calendar, DollarSign, Target, Film, ShoppingCart, Cloud, Gamepad2, Plane, Coffee } from 'lucide-react';
import { motion } from 'motion/react';

const CATEGORIES = [
  { value: 'streaming', label: 'Streaming', icon: <Film className="w-6 h-6" /> },
  { value: 'retail', label: 'Retail', icon: <ShoppingCart className="w-6 h-6" /> },
  { value: 'cloud', label: 'Cloud', icon: <Cloud className="w-6 h-6" /> },
  { value: 'gaming', label: 'Gaming', icon: <Gamepad2 className="w-6 h-6" /> },
  { value: 'travel', label: 'Travel', icon: <Plane className="w-6 h-6" /> },
  { value: 'general', label: 'General', icon: <Coffee className="w-6 h-6" /> },
];

interface CreateCardModalProps {
  onClose: () => void;
  onCreate: (data: { merchant_name: string; merchant_category: string; spend_limit?: number | null; burn_date?: string | null }) => Promise<void>;
}

export default function CreateCardModal({ onClose, onCreate }: CreateCardModalProps) {
  const [form, setForm] = useState({
    merchant_name: '',
    merchant_category: 'general',
    spend_limit: '',
    burn_date: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onCreate({
        merchant_name: form.merchant_name,
        merchant_category: form.merchant_category,
        spend_limit: form.spend_limit ? parseFloat(form.spend_limit) : null,
        burn_date: form.burn_date || null,
      });
      // onClose is handled in the parent when onCreate succeeds
    } catch (err) {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-neutral-950/80 backdrop-blur-md"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto scrollbar-hide glass-card rounded-[2.5rem] border border-white/10 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header Decor */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-primary-container/10 blur-[60px] rounded-full pointer-events-none" />

        <div className="p-8 md:p-10">
          <div className="flex justify-between items-start mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary-container flex items-center justify-center shadow-[0_0_20px_rgba(195,244,0,0.2)]">
                <ShieldPlus className="w-7 h-7 text-neutral-950" />
              </div>
              <div>
                <h2 className="text-2xl font-display font-black text-white tracking-tight">Identity Generation</h2>
                <p className="text-[10px] font-display font-black text-primary-container uppercase tracking-widest opacity-80">Secure PAN Generation</p>
              </div>
            </div>
            <button type="button" onClick={onClose} className="p-2 rounded-xl bg-white/5 text-on-surface-variant hover:text-white transition-colors relative z-10">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="space-y-2">
              <label className="text-[10px] font-display font-black text-on-surface-variant uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                <Target className="w-3 h-3" />
                Merchant Destination *
              </label>
              <input
                type="text"
                placeholder="e.g. Netflix, Adobe, Spotify"
                value={form.merchant_name}
                onChange={e => setForm({...form, merchant_name: e.target.value})}
                required autoFocus
                className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:border-primary-container/30 focus:bg-white/10 transition-all text-white placeholder:opacity-20"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-display font-black text-on-surface-variant uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                <Zap className="w-3 h-3" />
                Category Sector
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {CATEGORIES.map(c => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setForm({...form, merchant_category: c.value})}
                    className={`
                      flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border transition-all
                      ${form.merchant_category === c.value
                        ? 'bg-primary-container/10 border-primary-container/40 text-white'
                        : 'bg-white/5 border-white/5 text-on-surface-variant hover:border-white/20 hover:text-white'}
                    `}
                  >
                    <span className="text-xl">{c.icon}</span>
                    <span className="text-[9px] font-display font-black uppercase tracking-widest">{c.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-display font-black text-on-surface-variant uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                  <DollarSign className="w-3 h-3" />
                  Resource Limit
                </label>
                <input
                  type="number"
                  placeholder="0.00 (Optional)"
                  min="0"
                  step="0.01"
                  value={form.spend_limit}
                  onChange={e => setForm({...form, spend_limit: e.target.value})}
                  className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:border-primary-container/30 focus:bg-white/10 transition-all text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-display font-black text-on-surface-variant uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                  <Calendar className="w-3 h-3" />
                  Burn Schedule
                </label>
                <input
                  type="datetime-local"
                  value={form.burn_date}
                  onChange={e => setForm({...form, burn_date: e.target.value})}
                  className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:border-primary-container/30 focus:bg-white/10 transition-all text-white [color-scheme:dark]"
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-[10px] leading-relaxed text-on-surface-variant font-medium opacity-60">
              <span className="text-primary-container font-black mr-2">LOG:</span>
              A unique 16-digit Luhn-valid identity will be initialized and strictly locked to the destination merchant. Any secondary handshake attempts will be intercepted.
            </div>

            <div className="flex gap-4 mt-4">
              <button
                type="button"
                className="flex-1 py-4 rounded-2xl bg-white/5 text-on-surface-variant font-display font-black uppercase tracking-widest text-xs border border-white/5 hover:bg-white/10 hover:text-white transition-all"
                onClick={onClose}
              >
                Abort
              </button>
              <button
                type="submit"
                disabled={loading || !form.merchant_name.trim()}
                className="flex-[2] py-4 rounded-2xl bg-primary-container text-neutral-950 font-display font-black uppercase tracking-widest text-xs shadow-[0_0_20px_rgba(195,244,0,0.15)] hover:brightness-110 transition-all disabled:opacity-50"
              >
                {loading ? 'INITIALIZING...' : 'GENERATE IDENTITY'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
