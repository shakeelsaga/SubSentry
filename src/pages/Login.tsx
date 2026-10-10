import React, { useState } from 'react';
import { api } from '../services/api';
import { Shield, ArrowRight, Github } from 'lucide-react';
import { motion } from 'motion/react';

export default function Login({ onLogin }: { onLogin: () => void }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isRegister) {
        await api.register(fullName, email, password);
      } else {
        await api.login(email, password);
      }
      onLogin();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary-container/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-secondary-container/10 blur-[120px] rounded-full" />
        </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card w-full max-w-md p-10 rounded-3xl relative z-10 border-white/5 shadow-2xl"
      >
        <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 bg-primary-container rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(195,244,0,0.3)] mb-6">
                <Shield className="w-8 h-8 text-neutral-950" />
            </div>
            <h1 className="text-3xl font-black font-display text-white uppercase italic tracking-tighter">SubSentry</h1>
            <p className="text-on-surface-variant font-display font-bold text-xs uppercase tracking-[0.3em] mt-2">Access Secure Vault</p>
        </div>

        {error && (
          <div className="bg-error-container/10 border border-error/20 text-error p-4 rounded-xl text-sm mb-6 font-display font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {isRegister && (
            <div className="space-y-2">
              <label className="font-display font-black text-[10px] text-on-surface-variant uppercase tracking-widest ml-1">Full Name</label>
              <input 
                type="text" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-primary-container focus:bg-white/10 transition-all font-display"
                placeholder="Full Name"
              />
            </div>
          )}
          <div className="space-y-2">
            <label className="font-display font-black text-[10px] text-on-surface-variant uppercase tracking-widest ml-1">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-primary-container focus:bg-white/10 transition-all font-display"
              placeholder="Email Address"
            />
          </div>
          <div className="space-y-2">
            <label className="font-display font-black text-[10px] text-on-surface-variant uppercase tracking-widest ml-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-primary-container focus:bg-white/10 transition-all font-display"
              placeholder="Password"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary-container text-neutral-950 font-display font-black uppercase text-sm py-5 rounded-xl hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(195,244,0,0.15)] flex items-center justify-center gap-2 group"
          >
            {loading ? 'Processing...' : (isRegister ? 'Initialize Vault' : 'Enter Vault')}
            {!loading && <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />}
          </button>
        </form>

        <div className="mt-8 flex flex-col items-center gap-4">
            <button 
                type="button"
                onClick={() => setIsRegister(!isRegister)}
                className="text-on-surface-variant hover:text-white transition-colors text-xs font-display font-bold uppercase tracking-widest"
            >
                {isRegister ? 'Already have access? Back to login' : 'New operator? Request registration'}
            </button>
            <div className="w-full h-px bg-white/5 my-2" />
            <p className="text-[10px] text-on-surface-variant/40 font-mono text-center uppercase tracking-widest">
                Protected by SubSentry End-to-End Encryption
            </p>
        </div>
      </motion.div>
    </div>
  );
}
