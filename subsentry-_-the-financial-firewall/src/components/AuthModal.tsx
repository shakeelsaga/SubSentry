import React, { useState } from 'react';

interface AuthModalProps {
  isOpen: boolean;
  initialTab?: 'login' | 'early_access';
  onClose: () => void;
  onSuccess: (userName: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialTab = 'login',
  onClose,
  onSuccess,
}) => {
  const [tab, setTab] = useState<'login' | 'early_access'>(initialTab);
  const [email, setEmail] = useState('');
  const [accessKey, setAccessKey] = useState('SENTINEL-DEMO-NODE-8824');
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setConfirmed(true);
      setTimeout(() => {
        onSuccess(email.split('@')[0] || 'Obsidian Operator');
        onClose();
      }, 1000);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
      <div 
        className="w-full max-w-md bg-[#06080F] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl relative font-['Space_Grotesk'] text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#CCFF00] animate-pulse shadow-[0_0_8px_#CCFF00]" />
            <h3 className="text-base font-bold uppercase tracking-wider text-white">
              {tab === 'login' ? 'Hardware Enclave Authentication' : 'Request Obsidian Sentinel Tier'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex rounded-xl bg-white/5 p-1 my-5 border border-white/10">
          <button
            onClick={() => setTab('login')}
            className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
              tab === 'login'
                ? 'bg-[#CCFF00] text-[#06080F] shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Enclave Login
          </button>
          <button
            onClick={() => setTab('early_access')}
            className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
              tab === 'early_access'
                ? 'bg-[#CCFF00] text-[#06080F] shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            VIP Waitlist
          </button>
        </div>

        {confirmed ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-full bg-[#CCFF00]/15 border border-[#CCFF00]/40 flex items-center justify-center text-[#CCFF00]">
              <span className="material-symbols-outlined text-3xl">verified</span>
            </div>
            <h4 className="text-lg font-bold text-white uppercase tracking-wider">
              Enclave Token Synchronized
            </h4>
            <p className="text-xs text-neutral-400 font-['Manrope']">
              Launching your merchant firewall environment...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-neutral-400 font-bold mb-1.5">
                Work or Private Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="operator@domain.com"
                className="w-full bg-[#131319] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#CCFF00] font-['Manrope']"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-neutral-400 font-bold mb-1.5 flex justify-between">
                <span>Hardware Token Key</span>
                <span className="text-[#CCFF00] text-[10px] lowercase font-mono">enclave verified</span>
              </label>
              <input
                type="text"
                value={accessKey}
                onChange={(e) => setAccessKey(e.target.value)}
                required
                className="w-full bg-[#131319] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-[#CCFF00] font-mono focus:outline-none focus:border-[#CCFF00]"
              />
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-[11px] text-neutral-400 font-mono flex items-center gap-2">
              <span className="material-symbols-outlined text-base text-[#CCFF00]">fingerprint</span>
              <span>Local-First Cryptographic Handshake • 0 Cloud Storage</span>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-[#CCFF00] text-[#06080F] hover:bg-[#b8e600] text-xs font-black uppercase tracking-widest transition-all neon-glow-primary active-scale flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-[#06080F] border-t-transparent rounded-full animate-spin" />
                    <span>Verifying Enclave...</span>
                  </>
                ) : (
                  <span>{tab === 'login' ? 'Authenticate Node' : 'Join Sentinel Priority'}</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
