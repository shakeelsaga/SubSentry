import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  PauseCircle, 
  Ban, 
  RefreshCw, 
  Receipt, 
  Lock, 
  MoreHorizontal,
  Film,
  Filter,
  ShoppingCart,
  Flame,
  PlayCircle,
  ShieldCheck,
  ShieldAlert
} from 'lucide-react';
import { api } from '../services/api';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { VirtualCard, Transaction } from '../types';

export default function CardDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [card, setCard] = useState<VirtualCard | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  // Non-native toggle states (workaround using localStorage per card)
  const [neuralLink, setNeuralLink] = useState(() => localStorage.getItem(`subsentry_neural_${id}`) !== 'false');
  const [shadowLogs, setShadowLogs] = useState(() => localStorage.getItem(`subsentry_shadow_${id}`) === 'true');
  const [merchantLockdown, setMerchantLockdown] = useState(() => localStorage.getItem(`subsentry_lockdown_${id}`) !== 'false');

  const toggleNeural = () => {
    setNeuralLink(!neuralLink);
    localStorage.setItem(`subsentry_neural_${id}`, String(!neuralLink));
  };
  const toggleShadow = () => {
    setShadowLogs(!shadowLogs);
    localStorage.setItem(`subsentry_shadow_${id}`, String(!shadowLogs));
  };
  const toggleLockdown = () => {
    setMerchantLockdown(!merchantLockdown);
    localStorage.setItem(`subsentry_lockdown_${id}`, String(!merchantLockdown));
  };

  const fetchData = async () => {
    if (!id) return;
    try {
      const cardData = await api.getCard(id);
      const txData = await api.getTransactions({ card_id: id });
      setCard(cardData.card);
      setTransactions(txData.transactions);
    } catch (err) {
      console.error(err);
      navigate('/cards');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleToggleStatus = async () => {
    if (!card) return;
    try {
      await api.toggleCardStatus(card.id);
      fetchData();
    } catch (err) {
      alert('Action failed');
    }
  };

  const handleRevoke = async () => {
    if (!card || !window.confirm('IRREVERSIBLE: This will permanently terminate the identity node. Proceed?')) return;
    try {
      await api.revokeCard(card.id);
      navigate('/cards');
    } catch (err) {
      alert('Action failed');
    }
  };

  if (loading || !card) return <div className="text-primary-container font-display font-black text-center py-20 animate-pulse uppercase italic">Accessing Decryption Protocols...</div>;

  const hasSpendLimit = card.spend_limit !== null && card.spend_limit !== undefined && card.spend_limit > 0;
  const progress = hasSpendLimit ? ((card.spent_total || 0) / card.spend_limit!) * 100 : 0;

  const formatBurnDate = (date: string | null) => {
    if (!date) return 'No Expiry Set';
    const d = new Date(date);
    return isNaN(d.getTime()) ? 'No Expiry Set' : d.toLocaleDateString();
  };

  return (
    <div className="flex flex-col gap-10">
      {/* Breadcrumb / Back */}
      <Link 
        to="/cards" 
        className="flex items-center gap-2 text-on-surface-variant hover:text-white transition-colors w-fit group"
      >
        <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
        <span className="font-display font-bold text-[10px] uppercase tracking-[0.2em]">Return to Hive</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Col: The Card and Controls */}
        <div className="lg:col-span-5 flex flex-col gap-8">
          {/* Card Vis */}
          <div className="relative w-full aspect-[1.586/1] rounded-[2.5rem] overflow-hidden shadow-3xl border border-white/10 group">
            <div className="absolute inset-0 bg-neutral-900 z-0" />
            
            {/* Background Texture Placeholder */}
            <div 
              className="absolute inset-0 opacity-80 mix-blend-overlay z-10" 
              style={{ 
                background: `linear-gradient(135deg, ${card.color || '#6366f1'} 0%, #000 120%)`,
                backgroundSize: 'cover'
              }} 
            />
            
            <div className="relative z-30 h-full p-10 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-xl flex items-center justify-center border border-white/20 shadow-2xl">
                    <Film className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black font-display text-white tracking-tighter uppercase italic">{card.merchant_name}</h2>
                    <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.3em]">{card.merchant_category}</p>
                  </div>
                </div>
                <div className={cn(
                  "px-6 py-2 rounded-xl font-display font-black text-[10px] uppercase tracking-widest border backdrop-blur-md shadow-xl",
                  card.status === 'active' ? "bg-white/10 border-white/20 text-white" : "bg-black/60 border-white/5 text-white/40"
                )}>
                  {card.status}
                </div>
              </div>

              <div>
                <div className="group/number w-fit cursor-pointer text-3xl md:text-4xl font-bold text-white tracking-[0.25em] mb-4 font-mono [text-shadow:0_4px_15px_rgba(0,0,0,0.8)]">
                  <span className="block group-hover/number:hidden">
                    •••• •••• •••• {card.card_number.slice(-4)}
                  </span>
                  <span className="hidden group-hover/number:block">
                    {card.card_number.match(/.{1,4}/g)?.join(' ') || card.card_number}
                  </span>
                </div>
                <div className="flex justify-between items-end">
                  <div className="flex gap-10">
                    <div>
                      <p className="text-[10px] text-white/50 uppercase font-black tracking-widest mb-1">Termination</p>
                      <p className="text-sm font-bold text-white font-mono">{formatBurnDate(card.burn_date)}</p>
                    </div>
                    <div className="group/cvv w-fit cursor-pointer">
                      <p className="text-[10px] text-white/50 uppercase font-black tracking-widest mb-1">CVV</p>
                      <p className="text-sm font-bold text-white font-mono">
                        <span className="block group-hover/cvv:hidden">•••</span>
                        <span className="hidden group-hover/cvv:block">{card.cvv}</span>
                      </p>
                    </div>
                  </div>
                  <div className="w-16 h-10 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 flex items-center justify-center shadow-inner">
                    <div className="w-6 h-6 rounded-full bg-secondary-container/80 -mr-2 mix-blend-screen" />
                    <div className="w-6 h-6 rounded-full bg-primary-container/80 mix-blend-screen" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Rapid Controls */}
          {card.status !== 'revoked' && (
            <div className="glass-card rounded-[2.5rem] p-10 flex flex-col gap-6">
              <h3 className="text-sm font-black font-display text-on-surface-variant uppercase tracking-[0.3em]">Lifecycle Management</h3>
              <div className="grid grid-cols-2 gap-6">
                <button 
                  onClick={handleToggleStatus}
                  className="flex flex-col items-center justify-center gap-4 p-8 rounded-[2rem] bg-surface-container border border-white/5 hover:border-primary-container/40 hover:bg-surface-variant transition-all group"
                >
                  {card.status === 'active' ? (
                    <>
                        <PauseCircle className="w-10 h-10 text-on-surface-variant group-hover:text-primary-container transition-colors" />
                        <span className="font-display font-black text-[10px] uppercase tracking-widest text-white">Pause Token</span>
                    </>
                  ) : (
                    <>
                        <PlayCircle className="w-10 h-10 text-primary-container group-hover:scale-110 transition-transform" />
                        <span className="font-display font-black text-[10px] uppercase tracking-widest text-primary-container">Resume Token</span>
                    </>
                  )}
                </button>
                <button 
                  onClick={handleRevoke}
                  className="flex flex-col items-center justify-center gap-4 p-8 rounded-[2rem] bg-error-container/10 border border-error-container/20 hover:bg-error-container/20 hover:border-error transition-all group"
                >
                  <Ban className="w-10 h-10 text-error group-hover:rotate-12 transition-transform" />
                  <span className="font-display font-black text-[10px] uppercase tracking-widest text-error">Revoke ID</span>
                </button>
              </div>
            </div>
          )}

          {/* Spend Progress */}
          <div className="glass-card rounded-[2.5rem] p-10 flex flex-col gap-8">
            <div className="flex justify-between items-end">
              <div>
                <h3 className="text-sm font-black font-display text-on-surface-variant uppercase tracking-[0.3em]">Capital Drain</h3>
                <p className="text-[10px] text-on-surface-variant font-bold mt-1 uppercase tracking-widest">Rolling Utilization</p>
              </div>
              <div className="text-right">
                <span className="text-4xl font-bold font-display text-primary-container glow-lime">₹{(card.spent_total || 0).toFixed(2)}</span>
                <span className="text-sm font-black text-on-surface-variant uppercase tracking-widest"> / {hasSpendLimit ? `₹${card.spend_limit!.toFixed(2)}` : '∞'}</span>
              </div>
            </div>
            <div className="h-4 w-full bg-surface-container-highest rounded-full overflow-hidden border border-white/5 relative shadow-inner">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: hasSpendLimit ? `${Math.min(progress, 100)}%` : '0%' }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className={cn(
                    "absolute top-0 left-0 h-full rounded-full shadow-2xl transition-all",
                    progress > 90 ? "bg-error" : "bg-gradient-to-r from-secondary-container to-secondary shadow-[0_0_20px_rgba(255,75,137,0.5)]"
                )} 
              />
            </div>
            <div className="flex justify-between font-display text-[11px] font-black text-on-surface-variant uppercase tracking-widest">
              <span>Security Minimum ₹0.00</span>
              <span className={cn(progress > 90 && "text-error animate-pulse")}>{hasSpendLimit ? (progress > 90 ? 'Capacity Limit Reached' : `${progress.toFixed(0)}% Used`) : 'No Limit Set'}</span>
            </div>
          </div>
        </div>

        {/* Right Col: Settings & History */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          {/* Settings Bento */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div onClick={toggleNeural} className="glass-card rounded-2xl p-6 flex items-center justify-between group cursor-pointer hover:bg-surface-container transition-colors">
              <div className="flex items-center gap-5">
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center transition-all shadow-inner border border-white/5",
                  neuralLink ? "bg-surface-variant text-primary-container group-hover:bg-primary-container group-hover:text-neutral-950" : "bg-surface-variant text-on-surface-variant group-hover:text-white"
                )}>
                  <RefreshCw className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-display font-black text-xs text-white uppercase tracking-widest">Neural Link</h4>
                  <p className="text-[9px] font-black text-on-surface-variant uppercase tracking-[0.2em] mt-0.5">Primary Fund Sync</p>
                </div>
              </div>
              <div className={cn(
                "w-12 h-7 rounded-full relative transition-all",
                neuralLink ? "bg-primary-container shadow-[0_0_15px_rgba(195,244,0,0.5)]" : "bg-white/5 border border-white/10"
              )}>
                <div className={cn(
                  "absolute top-1 w-5 h-5 rounded-full transition-all",
                  neuralLink ? "right-1 bg-neutral-950" : "left-1 bg-on-surface-variant opacity-40"
                )} />
              </div>
            </div>

            <div onClick={toggleShadow} className="glass-card rounded-2xl p-6 flex items-center justify-between group cursor-pointer hover:bg-surface-container transition-colors">
              <div className="flex items-center gap-5">
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center transition-all border border-white/5",
                  shadowLogs ? "bg-surface-variant text-primary-container group-hover:bg-primary-container group-hover:text-neutral-950" : "bg-surface-variant text-on-surface-variant group-hover:text-primary-container"
                )}>
                  <Receipt className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-display font-black text-xs text-white uppercase tracking-widest">Shadow Logs</h4>
                  <p className="text-[9px] font-black text-on-surface-variant uppercase tracking-[0.2em] mt-0.5">Quantum Archive</p>
                </div>
              </div>
              <div className={cn(
                "w-12 h-7 rounded-full relative transition-all",
                shadowLogs ? "bg-primary-container shadow-[0_0_15px_rgba(195,244,0,0.5)]" : "bg-white/5 border border-white/10"
              )}>
                <div className={cn(
                  "absolute top-1 w-5 h-5 rounded-full transition-all",
                  shadowLogs ? "right-1 bg-neutral-950" : "left-1 bg-on-surface-variant opacity-40"
                )} />
              </div>
            </div>

            <div onClick={toggleLockdown} className="sm:col-span-2 glass-card rounded-2xl p-6 flex items-center justify-between group cursor-pointer hover:bg-surface-container transition-colors">
              <div className="flex items-center gap-5">
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center transition-all border border-white/5",
                  merchantLockdown ? "bg-surface-variant text-primary-container group-hover:bg-primary-container group-hover:text-neutral-950" : "bg-surface-variant text-on-surface-variant group-hover:text-white"
                )}>
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-display font-black text-xs text-white uppercase tracking-widest">Merchant Lockdown</h4>
                  <p className="text-[9px] font-black text-on-surface-variant uppercase tracking-[0.2em] mt-0.5">Strict single-source identity binding</p>
                </div>
              </div>
              <div className={cn(
                "w-12 h-7 rounded-full relative transition-all",
                merchantLockdown ? "bg-primary-container shadow-[0_0_15px_rgba(195,244,0,0.5)]" : "bg-white/5 border border-white/10"
              )}>
                <div className={cn(
                  "absolute top-1 w-5 h-5 rounded-full transition-all",
                  merchantLockdown ? "right-1 bg-neutral-950" : "left-1 bg-on-surface-variant opacity-40"
                )} />
              </div>
            </div>
          </div>

          {/* History Ledger */}
          <div className="glass-card rounded-[2.5rem] flex flex-col flex-grow min-h-[450px] shadow-2xl overflow-hidden border-white/5">
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.03] backdrop-blur-md">
              <h3 className="text-2xl font-black font-display text-white uppercase italic tracking-tighter">Transaction Ledger</h3>
              <button className="text-on-surface-variant hover:text-white transition-colors">
                <MoreHorizontal className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex flex-col flex-grow overflow-y-auto">
              {transactions.map((tx, idx) => (
                <div 
                  key={tx.id} 
                  className={cn(
                    "p-6 flex items-center justify-between hover:bg-white/[0.03] transition-all group cursor-pointer border-b border-white/5 last:border-0",
                    tx.status !== 'approved' && "bg-error-container/[0.03]"
                  )}
                >
                  <div className="flex items-center gap-6">
                    <div className={cn(
                      "w-14 h-14 rounded-2xl flex items-center justify-center transition-all border shadow-lg",
                      tx.status === 'approved' ? "bg-surface-variant border-white/5 text-white" : "bg-error-container/10 border-error/20 text-error"
                    )}>
                      {tx.status === 'approved' ? <ShieldCheck className="w-7 h-7" /> : <ShieldAlert className="w-7 h-7" />}
                    </div>
                    <div>
                      <p className={cn("font-display font-black text-sm uppercase tracking-widest", tx.status !== 'approved' && "line-through opacity-60")}>{tx.merchant_name}</p>
                      <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] mt-1 opacity-70">
                        {new Date(tx.created_at).toLocaleString()} • {tx.status === 'approved' ? 'Settled' : 'Aborted'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={cn("font-display font-black text-xl tracking-tighter", tx.status !== 'approved' && "line-through opacity-20")}>-₹{tx.amount?.toFixed(2) || '0.00'}</p>
                    <span className={cn(
                      "text-[9px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm mt-1 inline-block border",
                      tx.status === 'approved' ? "bg-primary-container/10 text-primary-container border-primary-container/20" : "bg-error-container/10 text-error border-error/20"
                    )}>
                      {tx.status}
                    </span>
                  </div>
                </div>
              ))}
              
              {transactions.length === 0 && (
                <div className="flex-1 flex flex-col items-center justify-center p-20 opacity-30 text-center grayscale">
                    <Receipt className="w-16 h-16 mb-4" />
                    <p className="text-sm font-black font-display uppercase tracking-widest">No Telemetry Recorded</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
