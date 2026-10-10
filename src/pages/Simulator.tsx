import { Terminal as TerminalIcon, Landmark, ArrowRight, Ban, Info, ShieldAlert, ShieldCheck } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { api } from '../services/api';

export default function Simulator() {
  const [cardNumber, setCardNumber] = useState('');
  const [amount, setAmount] = useState('10.00');
  const [merchantName, setMerchantName] = useState('Netflix');
  const [isProcessing, setIsProcessing] = useState(false);
  const [logs, setLogs] = useState<string[]>([
    '> INIT ISO8583 REQ',
    '> STANDBY FOR NETWORK HANDSHAKE...'
  ]);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [responseDetails, setResponseDetails] = useState<any>(null);
  
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, msg]);
  };

  const processTransaction = async () => {
    if (!cardNumber) {
        alert('Enter a card number to simulate');
        return;
    }

    setIsProcessing(true);
    setStatus('idle');
    setResponseDetails(null);
    setLogs([`> INIT REQ: M-ID ${merchantName.toUpperCase()}-TX-SANDBOX`]);
    
    await delay(600);
    addLog(`> MTI: 0100 (Authorization Request)`);
    await delay(400);
    addLog(`> PAN: **** **** **** ${cardNumber.slice(-4)}`);
    await delay(300);
    addLog(`> AMT: ${amount} USD`);
    await delay(800);
    addLog(`> AWAITING NETWORK RESPONSE...`);
    
    try {
        const response = await api.simulateCharge({
            card_number: cardNumber,
            amount: parseFloat(amount),
            merchant_name: merchantName
        });

        await delay(1200);
        
        window.dispatchEvent(new Event('transaction_completed'));

        if (response.status === 'approved') {
            addLog(`> HTTP/2 200 OK`);
            addLog(`> AUTH CODE: ${Math.floor(Math.random() * 900000) + 100000}`);
            addLog(`> TRANSACTION APPROVED`);
            setStatus('success');
        } else {
            addLog(`> HTTP/2 403 FORBIDDEN`);
            addLog(`> RC: 62 (Restricted Card)`);
            addLog(`> REASON: ${response.decline_reason || 'UNKNOWN_REJECTION'}`);
            setStatus('error');
        }
        setResponseDetails(response);
    } catch (err: any) {
        addLog(`> NETWORK_FAILURE: CONNECTION REFUSED`);
        setStatus('error');
    } finally {
        setIsProcessing(false);
    }
  };

  const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

  return (
    <div className="flex flex-col gap-10 h-full max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-white/[0.02] p-8 rounded-2xl border border-white/5">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold font-display tracking-tight text-white mb-2 italic uppercase">Sandbox</h1>
          <p className="text-on-surface-variant max-w-md text-base opacity-80">
            Fire mock transactions against your active identities to audit authorization logic and strict limit controls.
          </p>
        </div>
        <div className="flex items-center gap-3 px-5 py-2.5 bg-surface-container rounded-full border border-surface-variant shadow-inner">
          <div className="w-2 h-2 rounded-full bg-primary-container shadow-[0_0_8px_#c3f400] animate-pulse" />
          <span className="font-display font-bold text-[10px] text-on-surface-variant uppercase tracking-[0.2em]">Remote Node Connection Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 flex-1">
        {/* Input Form Card */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="glass-card rounded-[2.5rem] p-8 md:p-10 flex flex-col gap-10 h-full shadow-3xl relative group overflow-hidden border-t border-l border-white/10">
            {/* Ambient Bloom */}
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary-container/10 blur-[100px] rounded-full pointer-events-none group-hover:bg-primary-container/20 transition-all duration-1000" />
            
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary-container/10 flex items-center justify-center border border-primary-container/20 shadow-inner">
                  <Landmark className="w-6 h-6 text-primary-container" strokeWidth={2.5} />
                </div>
                <h3 className="text-2xl font-black font-display text-white tracking-tighter uppercase italic">Inject Charge</h3>
              </div>
              <span className="font-mono text-[10px] text-on-surface-variant/40 tracking-[0.2em] font-bold">MODE: SIM_PROD</span>
            </div>

            <div className="flex flex-col gap-8 relative z-10">
              {/* Card Number Input */}
              <div className="flex flex-col gap-3">
                <label className="font-display font-black text-[10px] text-on-surface-variant uppercase tracking-[0.25em] pl-1">Card Payload (PAN)</label>
                <div className="relative group/input">
                  <input 
                    type="text" 
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full bg-surface-dim/50 border-0 border-b border-surface-variant py-5 px-4 font-mono text-xl text-white focus:ring-0 focus:border-primary-container focus:bg-surface-container transition-all tracking-[0.2em]"
                    placeholder="Enter virtual card number"
                  />
                  <div className="absolute top-1/2 -translate-y-1/2 right-4 opacity-50">
                    <Info className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Rows */}
              <div className="grid grid-cols-2 gap-8">
                <div className="flex flex-col gap-3">
                  <label className="font-display font-black text-[10px] text-on-surface-variant uppercase tracking-[0.25em] pl-1">Charge Value</label>
                  <div className="relative focus-within:text-primary-container transition-colors">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-display font-bold text-lg opacity-50">₹</span>
                    <input 
                      type="number" 
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full bg-surface-dim/50 border-0 border-b border-surface-variant py-5 pl-10 pr-4 font-mono text-xl text-white focus:ring-0 focus:border-primary-container focus:bg-surface-container transition-all"
                    />
                  </div>
                </div>
                
                <div className="flex flex-col gap-3">
                  <label className="font-display font-black text-[10px] text-on-surface-variant uppercase tracking-[0.25em] pl-1">Merchant Origin</label>
                  <input 
                    type="text" 
                    value={merchantName}
                    onChange={(e) => setMerchantName(e.target.value)}
                    className="w-full bg-surface-dim/50 border-0 border-b border-surface-variant py-5 px-4 font-display font-bold text-sm text-white focus:ring-0 focus:border-primary-container focus:bg-surface-container transition-all"
                    placeholder="e.g., Netflix"
                  />
                </div>
              </div>

              <button 
                onClick={processTransaction}
                disabled={isProcessing}
                className="mt-6 w-full relative group/btn overflow-hidden rounded-2xl bg-primary-container text-neutral-950 font-display font-black text-lg py-6 transition-all shadow-[0_0_25px_rgba(195,244,0,0.1)] hover:shadow-[0_0_40px_rgba(195,244,0,0.3)] hover:-translate-y-1 disabled:opacity-50 disabled:translate-y-0 uppercase italic"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite]" />
                <span className="relative z-10 flex items-center justify-center gap-3">
                  {isProcessing ? 'TRANSITTING PROTOCOL...' : 'Process Transaction'}
                  <ArrowRight className={cn("w-5 h-5 transition-transform", isProcessing ? "animate-pulse" : "group-hover:translate-x-1")} />
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Terminal Card */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="flex items-center gap-3 pl-4">
            <TerminalIcon className="w-4 h-4 text-primary-container" />
            <h4 className="font-display font-black text-[10px] text-on-surface-variant uppercase tracking-[0.25em]">Response Telemetry</h4>
          </div>
          
          <div className="bg-[#0a0a0e] rounded-[2rem] border border-white/5 p-8 shadow-3xl relative overflow-hidden flex flex-col h-full min-h-[500px]">
             {/* Header Dots */}
             <div className="flex gap-2 mb-8">
              <div className="w-2.5 h-2.5 rounded-full bg-neutral-800 shadow-[inset_0_1px_2px_rgba(255,255,255,0.05)]" />
              <div className="w-2.5 h-2.5 rounded-full bg-neutral-800 shadow-[inset_0_1px_2px_rgba(255,255,255,0.05)]" />
              <div className="w-2.5 h-2.5 rounded-full bg-neutral-800 shadow-[inset_0_1px_2px_rgba(255,255,255,0.05)]" />
            </div>

            <div ref={terminalRef} className="flex-1 overflow-y-auto font-mono text-[13px] leading-relaxed space-y-4 scrollbar-hide">
              <div className="text-neutral-500 space-y-1">
                {logs.map((log, i) => (
                  <div key={i} className="animate-in fade-in slide-in-from-left-2 duration-300">
                    {log}
                  </div>
                ))}
              </div>

              <AnimatePresence>
                {status === 'error' && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mt-6 border-l-2 border-error-container pl-5 py-4 bg-error-container/5 rounded-r-lg"
                  >
                    <div className="text-error font-black font-display flex items-center gap-2 text-base tracking-tight mb-2 uppercase">
                      <ShieldAlert className="w-5 h-5" />
                      DECLINED BY SENTINEL
                    </div>
                    <div className="grid grid-cols-1 gap-1 text-[12px] font-mono text-on-error-container opacity-80">
                      <div><span className="opacity-40">RC:</span> 62 (Restricted Identity)</div>
                      <div><span className="opacity-40">RSN:</span> {responseDetails?.decline_reason || 'SECURITY_REJECTION'}</div>
                      <div><span className="opacity-40">ACT:</span> Dropped. Zero drainage.</div>
                    </div>
                  </motion.div>
                )}
                
                {status === 'success' && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mt-6 border-l-2 border-primary-container pl-5 py-4 bg-primary-container/5 rounded-r-lg"
                  >
                    <div className="text-primary-container font-black font-display flex items-center gap-2 text-base tracking-tight mb-2 uppercase">
                      <ShieldCheck className="w-5 h-5" />
                      AUTHORIZATION GRANTED
                    </div>
                    <div className="grid grid-cols-1 gap-1 text-[12px] font-mono text-on-primary-container opacity-80">
                      <div><span className="opacity-40">RC:</span> 00 (Settlement Ready)</div>
                      <div><span className="opacity-40">AUTH:</span> {Math.floor(Math.random() * 900000) + 100000}</div>
                      <div><span className="opacity-40">CAPT:</span> {amount} USD committed.</div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {isProcessing && (
                <div className="text-primary-container animate-pulse mt-4 font-black">_</div>
              )}
            </div>

            <div className="mt-auto pt-6 border-t border-white/5 opacity-20 text-[9px] uppercase font-black tracking-[0.3em] font-display text-center">
              SubSentry Sandbox Environment • Node ID: AI-SIM-01
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
