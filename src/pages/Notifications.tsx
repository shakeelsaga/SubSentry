import { 
  Bell, 
  ShieldCheck, 
  ShieldAlert, 
  Flame, 
  AlertTriangle, 
  CreditCard,
  CheckCheck,
  Eye,
  BellOff
} from 'lucide-react';
import { api } from '../services/api';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { Notification } from '../types';

const typeConfig: Record<string, { icon: typeof Bell; color: string; bgColor: string; borderColor: string }> = {
  charge_approved: { 
    icon: ShieldCheck, 
    color: 'text-primary-container', 
    bgColor: 'bg-primary-container/10',
    borderColor: 'border-primary-container/20'
  },
  charge_blocked: { 
    icon: ShieldAlert, 
    color: 'text-error', 
    bgColor: 'bg-error-container/10',
    borderColor: 'border-error/20'
  },
  spend_alert: { 
    icon: AlertTriangle, 
    color: 'text-[#FACC15]', 
    bgColor: 'bg-[#FACC15]/10',
    borderColor: 'border-[#FACC15]/20'
  },
  burn_executed: { 
    icon: Flame, 
    color: 'text-secondary-container', 
    bgColor: 'bg-secondary-container/10',
    borderColor: 'border-secondary-container/20'
  },
  card_expired: { 
    icon: CreditCard, 
    color: 'text-error', 
    bgColor: 'bg-error-container/10',
    borderColor: 'border-error/20'
  },
};

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const fetchNotifications = async () => {
    try {
      const data = await api.getNotifications(filter === 'unread');
      setNotifications(data.notifications);
      setUnreadCount(data.unread_count);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchNotifications();
  }, [filter]);

  const handleMarkRead = async (id: number) => {
    try {
      await api.markNotificationRead(id);
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.markAllNotificationsRead();
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="text-primary-container font-display font-black text-center py-20 animate-pulse uppercase italic">Scanning Alert Channels...</div>;

  return (
    <div className="flex flex-col gap-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold font-display tracking-tight text-white uppercase italic">Alerts</h1>
          <p className="text-on-surface-variant max-w-2xl text-lg mt-2 opacity-80 font-sans">
            Real-time security notifications for all authorization events, spend alerts, and identity lifecycle changes.
          </p>
        </div>
        
        <div className="flex gap-3 items-center">
          {unreadCount > 0 && (
            <button 
              onClick={handleMarkAllRead}
              className="flex items-center gap-2 bg-surface-container border border-outline/30 px-5 py-2.5 rounded-xl font-display font-black text-[10px] uppercase tracking-widest text-on-surface hover:bg-surface-variant transition-all"
            >
              <CheckCheck className="w-4 h-4 text-primary-container" />
              Mark All Read
            </button>
          )}
          <div className="flex gap-2">
            {[
              { id: 'all', label: 'All Alerts' },
              { id: 'unread', label: `Unread${unreadCount > 0 ? ` (${unreadCount})` : ''}` },
            ].map((f) => (
              <button 
                key={f.id}
                onClick={() => setFilter(f.id as 'all' | 'unread')}
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

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-2xl flex flex-col items-center justify-center">
          <span className="text-[10px] font-display font-black uppercase tracking-[0.2em] text-on-surface-variant mb-1">Total</span>
          <span className="text-2xl font-display font-black text-white">{notifications.length}</span>
        </div>
        <div className="glass-card p-4 rounded-2xl flex flex-col items-center justify-center">
          <span className="text-[10px] font-display font-black uppercase tracking-[0.2em] text-on-surface-variant mb-1">Unread</span>
          <span className="text-2xl font-display font-black text-secondary-container">{unreadCount}</span>
        </div>
        <div className="glass-card p-4 rounded-2xl flex flex-col items-center justify-center">
          <span className="text-[10px] font-display font-black uppercase tracking-[0.2em] text-on-surface-variant mb-1">Approved</span>
          <span className="text-2xl font-display font-black text-primary-container">{notifications.filter(n => n.type === 'charge_approved').length}</span>
        </div>
        <div className="glass-card p-4 rounded-2xl flex flex-col items-center justify-center">
          <span className="text-[10px] font-display font-black uppercase tracking-[0.2em] text-on-surface-variant mb-1">Blocked</span>
          <span className="text-2xl font-display font-black text-error">{notifications.filter(n => n.type === 'charge_blocked' || n.type === 'spend_alert').length}</span>
        </div>
      </div>

      {/* Notifications List */}
      <div className="glass-card rounded-[2rem] overflow-hidden shadow-3xl relative border-white/5">
        {/* Decorative Grid */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="flex flex-col relative z-10">
          <AnimatePresence>
            {notifications.map((notification, idx) => {
              const config = typeConfig[notification.type] || typeConfig.charge_approved;
              const IconComponent = config.icon;
              const isUnread = notification.is_read === 0;

              return (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className={cn(
                    "group flex items-start gap-6 p-6 md:p-8 border-b border-white/5 hover:bg-white/[0.02] transition-all relative",
                    isUnread && "bg-white/[0.03]"
                  )}
                >
                  {/* Unread Indicator */}
                  {isUnread && (
                    <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary-container rounded-full shadow-[0_0_8px_rgba(195,244,0,0.5)]" />
                  )}

                  {/* Icon */}
                  <div className={cn(
                    "w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center border shadow-lg shrink-0 transition-all",
                    config.bgColor,
                    config.borderColor
                  )}>
                    <IconComponent className={cn("w-6 h-6 md:w-7 md:h-7", config.color)} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className={cn(
                          "font-display font-black text-sm uppercase tracking-widest",
                          isUnread ? "text-white" : "text-on-surface-variant"
                        )}>
                          {notification.title}
                        </h4>
                        <p className={cn(
                          "text-sm mt-2 leading-relaxed",
                          isUnread ? "text-on-surface/80" : "text-on-surface-variant/60"
                        )}>
                          {notification.message}
                        </p>
                      </div>

                      {isUnread && (
                        <button
                          onClick={() => handleMarkRead(notification.id)}
                          className="shrink-0 p-2 rounded-lg text-on-surface-variant hover:text-primary-container hover:bg-white/5 transition-all opacity-0 group-hover:opacity-100"
                          title="Mark as read"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-3 mt-3">
                      <span className={cn(
                        "text-[9px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm border",
                        config.bgColor,
                        config.borderColor,
                        config.color
                      )}>
                        {notification.type.replace(/_/g, ' ')}
                      </span>
                      <span className="text-[10px] text-on-surface-variant font-mono uppercase opacity-50">
                        {new Date(notification.created_at).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {notifications.length === 0 && (
            <div className="flex flex-col items-center justify-center p-20 opacity-20 text-center grayscale">
              <BellOff className="w-16 h-16 mb-4" />
              <p className="text-sm font-black font-display uppercase tracking-widest">
                {filter === 'unread' ? 'All Caught Up' : 'No Alerts Detected'}
              </p>
              <p className="text-xs text-on-surface-variant mt-2">
                {filter === 'unread' ? 'You have no unread notifications.' : 'Notifications will appear here when events occur.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
