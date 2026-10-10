import { Plus, Search, Filter, ShieldCheck, ShieldAlert, CreditCard, ExternalLink, Flame, Info, MoreHorizontal } from 'lucide-react';
import { api } from '../services/api';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useSearchParams } from 'react-router-dom';
import React, { useState, useEffect, useMemo } from 'react';
import { VirtualCard } from '../types';
import CreateCardModal from '../components/CreateCardModal';

export default function Cards() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [cards, setCards] = useState<VirtualCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchCards = async () => {
    try {
      const data = await api.getCards();
      setCards(data.cards);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  // Update URL when search changes
  useEffect(() => {
    if (searchQuery) {
      setSearchParams({ search: searchQuery });
    } else {
      setSearchParams({});
    }
  }, [searchQuery, setSearchParams]);

  const handleCreateCard = async (data: any) => {
    try {
      await api.createCard(data);
      setShowCreateModal(false);
      fetchCards();
    } catch (err) {
      alert('Failed to create card');
      throw err; // throw so the modal can stop loading state
    }
  };

  const filteredCards = useMemo(() => {
    if (!searchQuery) return cards;
    const lowerQuery = searchQuery.toLowerCase();
    return cards.filter(c =>
      c.merchant_name.toLowerCase().includes(lowerQuery) ||
      c.merchant_category.toLowerCase().includes(lowerQuery) ||
      c.card_number.includes(lowerQuery) ||
      c.status.toLowerCase() === lowerQuery ||
      (lowerQuery === 'burn limit' && c.spend_limit !== null)
    );
  }, [cards, searchQuery]);

  if (loading) return <div className="text-primary-container font-display font-black text-center py-20 animate-pulse">DECRYPTING IDENTITY VAULT...</div>;

  return (
    <div className="flex flex-col gap-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold font-display tracking-tight text-white uppercase italic">Card Identities</h1>
          <p className="text-on-surface-variant max-w-2xl text-lg mt-2 opacity-80">
            Provision and manage single-purpose digital payment tokens with granular limit control.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-3 bg-primary-container text-neutral-950 px-8 py-4 rounded-xl font-display font-black uppercase text-sm tracking-widest shadow-[0_0_30px_rgba(195,244,0,0.2)] hover:scale-105 active:scale-95 transition-all group"
        >
          <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
          Initialize New Token
        </button>
      </div>

      {/* Stats Quickbar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Active', count: cards.filter(c => c.status === 'active').length, color: 'text-primary-container' },
          { label: 'Paused', count: cards.filter(c => c.status === 'paused').length, color: 'text-on-surface-variant' },
          { label: 'Revoked', count: cards.filter(c => c.status === 'revoked').length, color: 'text-error' },
          { label: 'Burn Limit', count: cards.filter(c => c.spend_limit).length, color: 'text-secondary-container' },
        ].map((stat) => (
          <button
            key={stat.label}
            onClick={() => setSearchQuery(searchQuery === stat.label.toLowerCase() ? '' : stat.label.toLowerCase())}
            className={cn(
              "glass-card p-4 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer",
              searchQuery === stat.label.toLowerCase()
                ? "bg-white/10 border-white/20 scale-105 shadow-lg"
                : "border-white/5 bg-white/[0.02] hover:bg-white/[0.05]"
            )}
          >
            <span className="text-[10px] font-display font-black uppercase tracking-[0.2em] text-on-surface-variant mb-1">{stat.label}</span>
            <span className={cn("text-2xl font-display font-black", stat.color)}>{stat.count}</span>
          </button>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 group w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 group-focus-within:text-primary-container transition-colors" />
          <input
            type="text"
            placeholder="Search by merchant, category, or card number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-primary-container focus:bg-white/10 transition-all font-display font-medium"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white/5 border border-white/10 px-6 py-4 rounded-2xl font-display font-black text-[10px] uppercase tracking-widest text-on-surface hover:bg-white/10 transition-all">
            <Filter className="w-4 h-4 text-primary-container" />
            Filter
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCards.map((card) => (
          <Link to={`/cards/${card.id}`} key={card.id}>
            <motion.div
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative h-64 overflow-hidden rounded-[2.5rem] p-8 flex flex-col justify-between shadow-2xl cursor-pointer"
              style={{ background: `linear-gradient(135deg, ${card.color || '#6366f1'} 0%, #000 120%)` }}
            >
              {/* Card Texture Overlay */}
              <div className="absolute inset-0 opacity-20 mix-blend-overlay" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />

              <div className="flex justify-between items-start relative z-10">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                {card.spend_limit && (
                   <div className="bg-black/40 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-2 border border-white/10">
                    <Flame className="w-3.5 h-3.5 text-secondary-container" />
                    <span className="text-[10px] font-display font-black text-white uppercase tracking-widest">₹{card.spend_limit} Max</span>
                   </div>
                )}
              </div>

              <div className="relative z-10 transition-transform group-hover:scale-105 duration-500 origin-left">
                <h3 className="text-3xl font-black font-display text-white tracking-tighter mb-1 uppercase italic">{card.merchant_name}</h3>
                <p className="text-[10px] text-white/60 font-display font-bold uppercase tracking-[0.3em]">{card.merchant_category}</p>
              </div>

              <div className="flex justify-between items-end relative z-10">
                <div className="font-mono text-xl text-white/90 tracking-[0.25em] font-medium">
                  •••• {card.card_number.slice(-4)}
                </div>
                <div className={cn(
                  "px-4 py-2 rounded-xl font-display font-black text-[10px] uppercase tracking-widest border shadow-lg transition-colors",
                  card.status === 'active' ? "bg-white/10 border-white/20 text-white" : "bg-black/60 border-white/5 text-white/40"
                )}>
                  {card.status}
                </div>
              </div>
            </motion.div>
          </Link>
        ))}

        {filteredCards.length === 0 && !loading && (
          <div className="col-span-full border-2 border-dashed border-white/5 rounded-[2.5rem] py-20 flex flex-col items-center justify-center opacity-30 text-center">
            <CreditCard className="w-12 h-12 text-white mb-4" />
            <p className="text-lg font-display font-bold text-white uppercase tracking-widest">No matching identities</p>
            <p className="text-xs text-on-surface-variant font-medium mt-2">No active identities matched your criteria.</p>
          </div>
        )}
      </div>

      {/* Create Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <CreateCardModal
            onClose={() => setShowCreateModal(false)}
            onCreate={handleCreateCard}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
