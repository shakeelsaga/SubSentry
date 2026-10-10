import { Search, Bell, Filter, CreditCard, Play, ShieldCheck, Ban, Cloud, Download, ShieldAlert, Receipt } from 'lucide-react';
import { api } from '../services/api';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { Transaction } from '../types';

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchTx = async () => {
      try {
        const data = await api.getTransactions();
        setTransactions(data.transactions);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTx();
  }, []);

  const filteredTransactions = transactions.filter(tx => {
    if (filter === 'all') return true;
    if (filter === 'blocked') return tx.status === 'blocked' || tx.status === 'limit_exceeded';
    return tx.status === filter;
  });

  if (loading) return <div className="text-primary-container font-display font-black text-center py-20 animate-pulse uppercase italic">Querying Global Ledger...</div>;

  return (
    <div className="flex flex-col gap-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold font-display tracking-tight text-white mb-2 uppercase italic tracking-tighter">Central Ledger</h1>
          <p className="text-on-surface-variant max-w-2xl text-lg opacity-80 font-sans">
            A real-time record of all authorization attempts, settlement requests, and automated blocks.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          <button className="flex items-center gap-2 bg-surface-container border border-outline/30 px-5 py-2.5 rounded-xl font-display font-black text-[10px] uppercase tracking-widest text-on-surface hover:bg-surface-variant transition-all">
            <Download className="w-4 h-4" />
            Export Archive
          </button>
          <div className="flex gap-2">
            {[
                { id: 'all', label: 'All Protocols' },
                { id: 'approved', label: 'Approved' },
                { id: 'blocked', label: 'Blocked' }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={cn(
                  "px-5 py-2.5 rounded-xl font-display text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border",
                  filter === f.id
                    ? "bg-primary-container text-neutral-950 border-primary-container shadow-[0_0_15px_rgba(195,244,0,0.15)]"
                    : "bg-surface-container border-outline/30 text-on-surface-variant hover:border-primary-container/30"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Ledger Table Container */}
      <div className="glass-card rounded-[2rem] overflow-hidden shadow-3xl relative border-white/5">
        {/* Decorative Grid Lines */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        {/* Table Header (Desktop) */}
        <div className="hidden md:grid grid-cols-[1.2fr_2fr_1.5fr_1fr_1fr] gap-4 p-8 border-b border-white/5 bg-white/[0.03] font-display font-black text-[10px] text-on-surface-variant uppercase tracking-[0.25em] relative z-10">
          <div>Deployment Date</div>
          <div>Merchant Origin</div>
          <div>Identity Node</div>
          <div className="text-right">Drain Value</div>
          <div className="text-center">System Response</div>
        </div>

        {/* Table Body */}
        <div className="flex flex-col relative z-10">
          {filteredTransactions.map((tx, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              key={tx.id}
              className={cn(
                  "group flex flex-col md:grid md:grid-cols-[1.2fr_2fr_1.5fr_1fr_1fr] gap-4 p-6 md:p-8 border-b border-white/5 hover:bg-white/[0.02] transition-colors items-center relative",
                  tx.status !== 'approved' && "bg-error-container/[0.02]"
              )}
            >
              {/* Mobile Labels are handled implicitly by design aesthetics or can be added */}
              <div className="w-full flex justify-between md:block font-mono text-xs text-on-surface-variant font-bold">
                <span className="md:hidden font-display font-black text-[10px] uppercase text-on-surface">Date</span>
                {new Date(tx.created_at).toLocaleString()}
              </div>

              <div className="w-full flex justify-between md:block items-center">
                <span className="md:hidden font-display font-black text-[10px] uppercase text-on-surface">Source</span>
                <div className="flex items-center gap-4">
                  <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center border transition-all",
                      tx.status === 'approved' ? "bg-surface-variant border-white/10" : "bg-error-container/10 border-error/20"
                  )}>
                    {tx.status === 'approved' ? <ShieldCheck className="w-5 h-5 text-on-surface-variant" /> : <ShieldAlert className="w-5 h-5 text-error" />}
                  </div>
                  <span className={cn(
                      "font-display font-black text-white text-base tracking-tighter uppercase italic",
                      tx.status !== 'approved' && "line-through opacity-40"
                  )}>{tx.merchant_name}</span>
                </div>
              </div>

              <div className="w-full flex justify-between md:block font-mono text-xs text-neutral-500 font-bold">
                <span className="md:hidden font-display font-black text-[10px] uppercase text-on-surface">Identity</span>
                <div className="flex items-center gap-2">
                  <CreditCard className="w-3.5 h-3.5 opacity-50" />
                  ID-••••-{tx.card_number?.slice(-4) || 'NULL'}
                </div>
              </div>

              <div className={cn(
                  "w-full flex justify-between md:block font-display font-black text-xl md:text-right tracking-tighter italic",
                  tx.status === 'approved' ? "text-white" : "text-on-surface-variant line-through opacity-20"
              )}>
                <span className="md:hidden font-display font-black text-[10px] uppercase text-on-surface font-normal">Value</span>
                -₹{tx.amount?.toFixed(2) || '0.00'}
              </div>

              <div className="w-full flex justify-between md:justify-center items-center">
                <span className="md:hidden font-display font-black text-[10px] uppercase text-on-surface">Status</span>
                <div className={cn(
                  "inline-flex items-center gap-2 px-4 py-2 rounded-xl font-display font-black text-[9px] tracking-[0.2em] border shadow-2xl backdrop-blur-md transition-all uppercase",
                  tx.status === 'approved'
                    ? "bg-primary-container/10 border-primary-container/20 text-primary-container"
                    : "bg-error-container/10 border-error/20 text-error"
                )}>
                  <div className={cn(
                    "w-1.5 h-1.5 rounded-full animate-pulse",
                    tx.status === 'approved' ? "bg-primary-container shadow-[0_0_8px_rgba(195,244,0,0.8)]" : "bg-error shadow-[0_0_8px_rgba(255,180,171,0.8)]"
                  )} />
                  {tx.status}
                </div>
              </div>
            </motion.div>
          ))}

          {filteredTransactions.length === 0 && (
              <div className="flex flex-col items-center justify-center p-20 opacity-20 text-center grayscale">
                  <Receipt className="w-16 h-16 mb-4" />
                  <p className="text-sm font-black font-display uppercase tracking-widest">Archive Empty</p>
              </div>
          )}
        </div>
      </div>

      {/* Pagination Footer */}
      <div className="mt-4 flex justify-center">
        <button className="px-10 py-5 rounded-[1.5rem] bg-surface-container-high border border-white/10 text-white hover:bg-surface-bright transition-all font-display font-black text-[10px] uppercase tracking-[0.3em] shadow-3xl hover:shadow-primary-container/10">
          Synchronize Remote Archives
        </button>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
