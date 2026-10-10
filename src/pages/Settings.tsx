import {
  User as UserIcon,
  Shield,
  Bell,
  Lock,
  Palette,
  Mail,
  Calendar,
  Wallet,
  Eye,
  EyeOff,
  ChevronRight
} from 'lucide-react';
import { api } from '../services/api';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { User } from '../types';

export default function Settings() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showBalance, setShowBalance] = useState(() => localStorage.getItem('subsentry_show_balance') !== 'false');

  useEffect(() => {
    const handleBalanceChange = () => {
      setShowBalance(localStorage.getItem('subsentry_show_balance') !== 'false');
    };
    window.addEventListener('balanceVisibilityChanged', handleBalanceChange);
    return () => window.removeEventListener('balanceVisibilityChanged', handleBalanceChange);
  }, []);

  const toggleBalance = () => {
    const newState = !showBalance;
    setShowBalance(newState);
    localStorage.setItem('subsentry_show_balance', String(newState));
    window.dispatchEvent(new Event('balanceVisibilityChanged'));
  };

  const [notifPrefs, setNotifPrefs] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('subsentry_notif_prefs');
    if (saved) return JSON.parse(saved);
    return {
      'Charge Approved': true,
      'Charge Blocked': true,
      'Spend Alerts': true,
      'Card Lifecycle': true,
    };
  });

  const toggleNotifPref = (label: string) => {
    const updated = { ...notifPrefs, [label]: !notifPrefs[label] };
    setNotifPrefs(updated);
    localStorage.setItem('subsentry_notif_prefs', JSON.stringify(updated));
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await api.getMe();
        setUser(data.user);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) return <div className="text-primary-container font-display font-black text-center py-20 animate-pulse uppercase italic">Loading Configuration...</div>;

  return (
    <div className="flex flex-col gap-10 max-w-4xl mx-auto">
      {/* Page Header */}
      <div>
        <h1 className="text-4xl md:text-5xl font-bold font-display tracking-tight text-white uppercase italic">Settings</h1>
        <p className="text-on-surface-variant max-w-2xl text-lg mt-2 opacity-80 font-sans">
          Manage your profile, security preferences, and notification configurations.
        </p>
      </div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-[2.5rem] p-10 relative overflow-hidden"
      >
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary-container/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="flex items-start gap-8 relative z-10">
          <div className="w-20 h-20 rounded-2xl border border-white/10 overflow-hidden shrink-0 bg-surface-container shadow-2xl">
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.full_name || 'User')}&background=c3f400&color=000&size=128`}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-black font-display text-white uppercase italic tracking-tighter">{user?.full_name || 'Operator'}</h2>
            <p className="text-[10px] font-black text-primary-container uppercase tracking-[0.3em] mt-1">Elite Member</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-on-surface-variant" />
                <div>
                  <p className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest">Email</p>
                  <p className="text-sm font-bold text-white">{user?.email || '-'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-on-surface-variant" />
                <div>
                  <p className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest">Member Since</p>
                  <p className="text-sm font-bold text-white">{user?.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Wallet className="w-4 h-4 text-on-surface-variant" />
                <div>
                  <p className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest">Balance</p>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-primary-container">
                      {showBalance ? `₹${user?.main_balance?.toFixed(2) || '0.00'}` : '••••••'}
                    </p>
                    <button onClick={toggleBalance} className="text-on-surface-variant hover:text-white transition-colors">
                      {showBalance ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Security Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-[2rem] p-8 flex flex-col gap-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary-container/10 flex items-center justify-center border border-primary-container/20">
              <Lock className="w-6 h-6 text-primary-container" />
            </div>
            <div>
              <h3 className="font-display font-black text-sm text-white uppercase tracking-widest">Security</h3>
              <p className="text-[9px] font-black text-on-surface-variant uppercase tracking-[0.2em] mt-0.5">Authentication & Access</p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-surface-container/50 border border-white/5 hover:border-white/10 transition-all cursor-pointer group">
              <div>
                <p className="font-display font-black text-xs text-white uppercase tracking-widest">Password</p>
                <p className="text-[10px] text-on-surface-variant mt-0.5">Last changed: Never</p>
              </div>
              <ChevronRight className="w-4 h-4 text-on-surface-variant group-hover:text-primary-container transition-colors" />
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-surface-container/50 border border-white/5 hover:border-white/10 transition-all cursor-pointer group">
              <div>
                <p className="font-display font-black text-xs text-white uppercase tracking-widest">Two-Factor Auth</p>
                <p className="text-[10px] text-on-surface-variant mt-0.5">Status: Not Configured</p>
              </div>
              <div className="px-3 py-1 bg-error-container/10 border border-error/20 rounded-full">
                <span className="text-[9px] font-display font-black text-error uppercase tracking-widest">Off</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-surface-container/50 border border-white/5 hover:border-white/10 transition-all cursor-pointer group">
              <div>
                <p className="font-display font-black text-xs text-white uppercase tracking-widest">Active Sessions</p>
                <p className="text-[10px] text-on-surface-variant mt-0.5">1 device connected</p>
              </div>
              <ChevronRight className="w-4 h-4 text-on-surface-variant group-hover:text-primary-container transition-colors" />
            </div>
          </div>
        </motion.div>

        {/* Notifications Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-[2rem] p-8 flex flex-col gap-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-secondary-container/10 flex items-center justify-center border border-secondary-container/20">
              <Bell className="w-6 h-6 text-secondary-container" />
            </div>
            <div>
              <h3 className="font-display font-black text-sm text-white uppercase tracking-widest">Notifications</h3>
              <p className="text-[9px] font-black text-on-surface-variant uppercase tracking-[0.2em] mt-0.5">Alert Preferences</p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {[
              { label: 'Charge Approved', desc: 'Alert on successful transactions' },
              { label: 'Charge Blocked', desc: 'Alert when transactions are declined' },
              { label: 'Spend Alerts', desc: 'Notify when approaching limits' },
              { label: 'Card Lifecycle', desc: 'Burn date and revocation alerts' },
            ].map((pref) => (
              <div key={pref.label} className="flex items-center justify-between p-4 rounded-xl bg-surface-container/50 border border-white/5">
                <div>
                  <p className="font-display font-black text-xs text-white uppercase tracking-widest">{pref.label}</p>
                  <p className="text-[10px] text-on-surface-variant mt-0.5">{pref.desc}</p>
                </div>
                <div
                  onClick={() => toggleNotifPref(pref.label)}
                  className={cn(
                  "w-12 h-7 rounded-full relative transition-all cursor-pointer",
                  notifPrefs[pref.label] ? "bg-primary-container shadow-[0_0_15px_rgba(195,244,0,0.5)]" : "bg-white/5 border border-white/10"
                )}>
                  <div className={cn(
                    "absolute top-1 w-5 h-5 rounded-full transition-all",
                    notifPrefs[pref.label] ? "right-1 bg-neutral-950" : "left-1 bg-on-surface-variant opacity-40"
                  )} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Appearance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-[2rem] p-8 flex flex-col gap-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-tertiary-container/10 flex items-center justify-center border border-tertiary-container/20">
              <Palette className="w-6 h-6 text-tertiary-fixed-dim" />
            </div>
            <div>
              <h3 className="font-display font-black text-sm text-white uppercase tracking-widest">Appearance</h3>
              <p className="text-[9px] font-black text-on-surface-variant uppercase tracking-[0.2em] mt-0.5">Visual Configuration</p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-surface-container/50 border border-white/5">
              <div>
                <p className="font-display font-black text-xs text-white uppercase tracking-widest">Theme</p>
                <p className="text-[10px] text-on-surface-variant mt-0.5">Obsidian Neon (Dark)</p>
              </div>
              <div className="px-3 py-1 bg-primary-container/10 border border-primary-container/20 rounded-full">
                <span className="text-[9px] font-display font-black text-primary-container uppercase tracking-widest">Active</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-surface-container/50 border border-white/5">
              <div>
                <p className="font-display font-black text-xs text-white uppercase tracking-widest">Accent Color</p>
                <p className="text-[10px] text-on-surface-variant mt-0.5">Electric Lime (#CCFF00)</p>
              </div>
              <div className="w-6 h-6 rounded-full bg-primary-container shadow-[0_0_10px_rgba(195,244,0,0.4)]" />
            </div>
          </div>
        </motion.div>

        {/* About */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card rounded-[2rem] p-8 flex flex-col gap-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-surface-variant flex items-center justify-center border border-white/5">
              <Shield className="w-6 h-6 text-on-surface-variant" />
            </div>
            <div>
              <h3 className="font-display font-black text-sm text-white uppercase tracking-widest">About</h3>
              <p className="text-[9px] font-black text-on-surface-variant uppercase tracking-[0.2em] mt-0.5">System Information</p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-surface-container/50 border border-white/5">
              <p className="font-display font-black text-xs text-on-surface-variant uppercase tracking-widest">Version</p>
              <p className="font-mono text-xs text-white">v1.0.0</p>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-surface-container/50 border border-white/5">
              <p className="font-display font-black text-xs text-on-surface-variant uppercase tracking-widest">Platform</p>
              <p className="font-mono text-xs text-white">SubSentry Cloud</p>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-surface-container/50 border border-white/5">
              <p className="font-display font-black text-xs text-on-surface-variant uppercase tracking-widest">Environment</p>
              <p className="font-mono text-xs text-primary-container">Production</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
