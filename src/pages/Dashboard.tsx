import { TrendingUp, Shield, MoreHorizontal, Film, Cloud, Ban, Plus } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { api } from '../services/api';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { VirtualCard, Transaction } from '../types';

export default function Dashboard() {
  const [summary, setSummary] = useState<any>(null);
  const [cards, setCards] = useState<VirtualCard[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sumData, cardsData, txData, monthlyData] = await Promise.all([
          api.getSummary(),
          api.getCards(),
          api.getTransactions(),
          api.getMonthlyAnalytics(),
        ]);
        setSummary(sumData);
        setCards(cardsData.cards);
        setTransactions(txData.transactions.slice(0, 5));

        // Transform monthly analytics into chart data
        if (monthlyData.months && monthlyData.months.length > 0) {
          setChartData(monthlyData.months.map((m: any) => ({
            name: m.month,
            value: m.spent,
            blocked: m.blocked,
          })));
        } else {
          // Fallback: show last 4 weeks placeholder
          setChartData([
            { name: 'Week 1', value: 0 },
            { name: 'Week 2', value: 0 },
            { name: 'Week 3', value: 0 },
            { name: 'Week 4', value: 0 },
          ]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64 text-primary-container font-display font-bold animate-pulse">SYNCHRONIZING WITH VAULT...</div>;

  return (
    <div className="flex flex-col gap-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-4xl md:text-5xl font-bold font-display tracking-tight text-white uppercase italic">Overview</h2>
          <p className="text-lg text-on-surface-variant mt-2 font-sans font-normal opacity-80">
            Systems online. Tracking {summary?.active_cards || 0} active digital identities.
          </p>
        </div>
        <div className="flex gap-4">
          <Link 
            to="/cards"
            className="flex items-center gap-2 bg-primary-container text-neutral-950 hover:brightness-110 transition-all px-6 py-3 rounded-xl font-display font-bold text-sm shadow-[0_0_20px_rgba(195,244,0,0.15)] group uppercase tracking-widest"
          >
            <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
            New Identity
          </Link>
        </div>
      </div>

      {/* Main Stats Bento */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Chart Card */}
        <div className="glass-card rounded-3xl p-8 lg:col-span-8 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-secondary-container/10 blur-[80px] rounded-full pointer-events-none transition-opacity group-hover:opacity-100 opacity-50" />
          
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-[10px] font-display font-black text-on-surface-variant uppercase tracking-[0.25em]">Total Capital Drainage</p>
              <h3 className="text-5xl md:text-6xl font-bold font-display text-white mt-3 tracking-tighter">
                ₹{summary?.total_spent?.toFixed(2) || '0.00'}
              </h3>
            </div>
            <div className="bg-secondary-container/10 text-secondary-container px-3 py-1 rounded-full flex items-center gap-1.5 font-display text-[10px] border border-secondary-container/20 backdrop-blur-md font-black uppercase tracking-wider">
              <TrendingUp className="w-3.5 h-3.5" />
              Live Pulse
            </div>
          </div>

          <div className="mt-10 h-32 md:h-40 w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff4b89" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ff4b89" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" hide />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ 
                    background: '#131319', 
                    border: '1px solid rgba(255,255,255,0.1)', 
                    borderRadius: '12px',
                    fontFamily: 'Space Grotesk',
                    fontSize: '12px',
                    color: '#fff'
                  }}
                  formatter={(value: number) => [`₹${value.toFixed(2)}`, 'Spent']}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#ff4b89" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Side Stat Card */}
        <div className="glass-card rounded-3xl p-8 lg:col-span-4 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary-container/20 blur-[60px] rounded-full pointer-events-none" />
          
          <div>
            <div className="w-12 h-12 rounded-2xl bg-primary-container/10 border border-primary-container/30 flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(195,244,0,0.1)]">
              <Shield className="w-6 h-6 text-primary-container" fill="currentColor" fillOpacity={0.2} />
            </div>
            <p className="text-[10px] font-display font-black text-on-surface-variant uppercase tracking-[0.25em]">Capital Secured</p>
            <h3 className="text-4xl font-bold font-display text-primary-container glow-lime mt-2">₹{summary?.total_blocked?.toFixed(2) || '0.00'}</h3>
          </div>
          
          <p className="text-sm text-on-surface-variant leading-relaxed font-medium">
            Intercepted {summary?.blocked_count || 0} unauthorized merchant attempts in this deployment.
          </p>
        </div>
      </div>

      {/* Secondary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Cards Preview */}
        <div className="glass-card rounded-3xl p-6 flex flex-col gap-6">
          <div className="flex justify-between items-center px-2">
            <h3 className="text-xl font-black font-display text-white uppercase italic tracking-tight">Active Cards</h3>
            <button className="text-on-surface-variant hover:text-white transition-colors">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {cards.filter(c => c.status === 'active').slice(0, 4).map((card) => (
              <Link
                to={`/cards/${card.id}`}
                key={card.id}
              >
                <motion.div 
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-4 bg-surface-container-highest/20 p-4 rounded-2xl border border-white/5 hover:border-white/10 transition-colors cursor-pointer group"
                >
                  <div 
                    className="w-12 h-8 rounded shrink-0 flex flex-col justify-between p-1.5 shadow-inner relative overflow-hidden"
                    style={{ background: `linear-gradient(135deg, ${card.color || '#6366f1'} 0%, #000 150%)` }}
                  >
                    <div className="w-2 h-1 bg-white/40 rounded-full" />
                    <div className="text-[6px] text-white/90 font-bold self-end font-mono">•• {card.card_number.slice(-4)}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate">{card.merchant_name}</p>
                    <p className="text-[10px] text-on-surface-variant uppercase font-black tracking-widest">{card.merchant_category}</p>
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-primary-container shadow-[0_0_8px_rgba(195,244,0,0.6)] animate-pulse" />
                </motion.div>
              </Link>
            ))}
            {cards.length === 0 && (
                <div className="text-center py-6 text-on-surface-variant text-xs font-display font-bold uppercase tracking-widest opacity-40">No active cards detected</div>
            )}
          </div>
        </div>

        {/* Recent Feed */}
        <div className="glass-card rounded-3xl p-6 lg:col-span-2 flex flex-col gap-6">
          <div className="flex justify-between items-center border-b border-white/5 pb-4 px-2">
            <h3 className="text-xl font-black font-display text-white uppercase italic tracking-tight">Recent Pulse</h3>
            <Link to="/transactions" className="text-[10px] font-black font-display text-primary-container hover:text-white uppercase tracking-[0.2em] transition-colors">
              Full Archive
            </Link>
          </div>

          <div className="flex flex-col gap-6 px-2">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-11 h-11 rounded-2xl flex items-center justify-center border transition-all",
                    tx.status === 'approved' 
                      ? "bg-surface-container-high border-white/10 group-hover:border-primary-container/40" 
                      : "bg-error-container/10 border-error/20"
                  )}>
                    {tx.merchant_category === 'streaming' && <Film className="w-5 h-5 text-on-surface-variant" />}
                    {tx.merchant_category === 'cloud' && <Cloud className="w-5 h-5 text-on-surface-variant" />}
                    {tx.status !== 'approved' && <Ban className="w-5 h-5 text-error" />}
                    {(!['streaming', 'cloud'].includes(tx.merchant_category || '')) && tx.status === 'approved' && <Shield className="w-5 h-5 text-on-surface-variant" />}
                  </div>
                  <div>
                    <p className={cn(
                      "text-base font-bold",
                      tx.status === 'approved' ? "text-white" : "text-on-surface-variant line-through opacity-60"
                    )}>{tx.merchant_name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={cn(
                        "text-[9px] uppercase font-black px-1.5 py-0.5 rounded-sm tracking-widest",
                        tx.status === 'approved' ? "bg-primary-container/10 text-primary-container" : "bg-error-container/10 text-error"
                      )}>
                        {tx.status}
                      </span>
                      <span className="text-[10px] text-on-surface-variant font-mono uppercase opacity-50">{new Date(tx.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <span className={cn(
                  "text-lg font-bold font-mono tracking-tighter",
                  tx.status === 'approved' ? "text-white" : "text-on-surface-variant line-through opacity-40"
                )}>
                  -₹{tx.amount?.toFixed(2) || '0.00'}
                </span>
              </div>
            ))}
            {transactions.length === 0 && (
                <div className="text-center py-12 text-on-surface-variant text-xs font-display font-bold uppercase tracking-widest opacity-40">No telemetry data available</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
