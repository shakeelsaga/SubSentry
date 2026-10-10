import React, { useState } from 'react';

interface ObsidianInterfaceDemoProps {
  onGetEarlyAccess: () => void;
  onLaunchDashboard: () => void;
}

export const ObsidianInterfaceDemo: React.FC<ObsidianInterfaceDemoProps> = ({
  onGetEarlyAccess,
  onLaunchDashboard,
}) => {
  const [killSwitchEngaged, setKillSwitchEngaged] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    '$ sentry-core --listen ::8080',
    '[RULE] Drop unauthorized merchant retry: 403 Forbidden',
    '[AUDIT] 0 leakages detected • hardware tokens synchronized',
  ]);
  const [testingPacket, setTestingPacket] = useState(false);

  const handleTestPacket = () => {
    if (testingPacket) return;
    setTestingPacket(true);

    const testScenarios = [
      '[INSPECT] Incoming packet from api.netflix.com/v1/charge - amount: ₹649 -> APPROVED (token match)',
      '[ALERT] Detected stealth recurring price creep: +₹350 attempt -> REJECTED (Rule #2 enforced)',
      '[DROP] Unauthorized merchant origin (ip: 198.51.100.4) -> 403 Forbidden',
    ];

    const randomLog = testScenarios[Math.floor(Math.random() * testScenarios.length)];
    setTimeout(() => {
      setTerminalLogs(prev => [...prev.slice(-3), randomLog]);
      setTestingPacket(false);
    }, 400);
  };

  return (
    <section id="interface" className="py-28 bg-[#06080F] relative overflow-hidden">
      {/* Background glow mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(204,255,0,0.05)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="glass-card rounded-[3rem] overflow-hidden border-white/10 relative shadow-2xl backdrop-blur-3xl">
          <div className="grid lg:grid-cols-2">
            {/* Left Content */}
            <div className="p-8 sm:p-12 lg:p-20 flex flex-col justify-center">
              <h2 className="font-['Space_Grotesk'] text-white mb-6 uppercase tracking-tight text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight">
                Experience the Obsidian Interface
              </h2>

              <p className="text-neutral-400 mb-10 font-['Manrope'] text-base sm:text-lg leading-relaxed">
                Designed for speed. Engineered for precision. Our dashboard gives you a panoramic view of your financial frontier with real-time kill-switches.
              </p>

              {/* Feature Points */}
              <ul className="space-y-6 mb-12">
                <li className="flex items-center gap-4 text-white font-['Space_Grotesk'] tracking-wider uppercase text-xs sm:text-sm font-semibold">
                  <div className="w-8 h-8 rounded-full bg-[#CCFF00]/10 flex items-center justify-center border border-[#CCFF00]/20 shrink-0">
                    <span className="material-symbols-outlined text-[#CCFF00] text-sm font-bold">check</span>
                  </div>
                  <span>Real-time transaction telemetry</span>
                </li>

                <li className="flex items-center gap-4 text-white font-['Space_Grotesk'] tracking-wider uppercase text-xs sm:text-sm font-semibold">
                  <div className="w-8 h-8 rounded-full bg-[#CCFF00]/10 flex items-center justify-center border border-[#CCFF00]/20 shrink-0">
                    <span className="material-symbols-outlined text-[#CCFF00] text-sm font-bold">check</span>
                  </div>
                  <span>Automated subscription discovery</span>
                </li>

                <li className="flex items-center gap-4 text-white font-['Space_Grotesk'] tracking-wider uppercase text-xs sm:text-sm font-semibold">
                  <div className="w-8 h-8 rounded-full bg-[#CCFF00]/10 flex items-center justify-center border border-[#CCFF00]/20 shrink-0">
                    <span className="material-symbols-outlined text-[#CCFF00] text-sm font-bold">check</span>
                  </div>
                  <span>Biometric-locked card management</span>
                </li>
              </ul>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={onGetEarlyAccess}
                  className="bg-white text-[#06080F] font-['Space_Grotesk'] text-sm px-8 py-4 rounded-xl active-scale transition-all uppercase tracking-widest font-bold hover:bg-neutral-200 cursor-pointer shadow-lg"
                >
                  Get Early Access
                </button>
                <button
                  onClick={onLaunchDashboard}
                  className="border border-[#CCFF00]/40 text-[#CCFF00] hover:bg-[#CCFF00]/10 font-['Space_Grotesk'] text-sm px-6 py-4 rounded-xl active-scale transition-all uppercase tracking-widest font-bold cursor-pointer"
                >
                  Open Live Dashboard →
                </button>
              </div>
            </div>

            {/* Right Live Firewall Node Interactive UI */}
            <div className="relative min-h-[500px] bg-[#06080F]/90 overflow-hidden border-t lg:border-t-0 lg:border-l border-white/10 flex items-center justify-center p-6 sm:p-10">
              <div className="w-full max-w-md flex flex-col gap-4 font-['Space_Grotesk']">
                <div className="bg-[#06080F]/95 border border-white/10 rounded-2xl p-5 shadow-2xl backdrop-blur-xl">
                  {/* Top Bar */}
                  <div className="flex items-center justify-between pb-4 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#CCFF00] animate-pulse shadow-[0_0_8px_#CCFF00]" />
                      <span className="text-xs font-bold uppercase tracking-wider text-white">
                        Firewall Node: #01-Local
                      </span>
                    </div>
                    <span className="text-[10px] text-[#CCFF00] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded border border-[#CCFF00]/30 bg-[#CCFF00]/10">
                      ARMED
                    </span>
                  </div>

                  {/* Node Status Items with INR */}
                  <div className="py-4 space-y-3">
                    {/* Item 1: Netflix Lock */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 transition-colors hover:border-white/15">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-[#CCFF00] text-base">lock</span>
                        <div>
                          <p className="text-xs font-bold text-white uppercase tracking-wider">
                            Netflix Lock
                          </p>
                          <p className="text-[10px] text-neutral-400 font-mono">
                            Bound to: merchant_id_8824
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-[#CCFF00] font-mono">
                        ₹649/mo
                      </span>
                    </div>

                    {/* Item 2: Spotify Limit */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 transition-colors hover:border-white/15">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-[#CCFF00] text-base">tune</span>
                        <div>
                          <p className="text-xs font-bold text-white uppercase tracking-wider">
                            Spotify Limit
                          </p>
                          <p className="text-[10px] text-neutral-400 font-mono">
                            Strict Cap: ₹119 max
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] uppercase font-bold text-white bg-white/10 px-2.5 py-1 rounded">
                        Enforced
                      </span>
                    </div>

                    {/* Item 3: Instant Kill-Switch */}
                    <div
                      onClick={() => setKillSwitchEngaged(!killSwitchEngaged)}
                      className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                        killSwitchEngaged
                          ? 'bg-red-500/15 border border-red-500/40'
                          : 'bg-[#CCFF00]/10 border border-[#CCFF00]/30 hover:bg-[#CCFF00]/15'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`material-symbols-outlined text-base ${killSwitchEngaged ? 'text-red-400' : 'text-[#CCFF00]'}`}>
                          power_settings_new
                        </span>
                        <div>
                          <p className={`text-xs font-bold uppercase tracking-wider ${killSwitchEngaged ? 'text-red-400' : 'text-[#CCFF00]'}`}>
                            Instant Kill-Switch
                          </p>
                          <p className="text-[10px] text-neutral-300 font-mono">
                            {killSwitchEngaged ? 'Funds disconnected • Card severed' : '1-tap cut off active (click to test)'}
                          </p>
                        </div>
                      </div>
                      <span className={`w-2.5 h-2.5 rounded-full ${killSwitchEngaged ? 'bg-red-500' : 'bg-[#CCFF00]'} animate-pulse`} />
                    </div>
                  </div>

                  {/* Terminal Box */}
                  <div className="pt-3 border-t border-white/10 bg-black/60 rounded-lg p-3 font-mono text-[11px] text-neutral-400 space-y-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-mono">
                        Hardware Enclave Stream
                      </span>
                      <button
                        onClick={handleTestPacket}
                        disabled={testingPacket}
                        className="text-[10px] text-[#CCFF00] hover:underline cursor-pointer"
                      >
                        {testingPacket ? 'Inspecting...' : '+ Inspect Packet'}
                      </button>
                    </div>

                    {terminalLogs.map((log, i) => (
                      <p
                        key={i}
                        className={
                          log.startsWith('$')
                            ? 'text-[#CCFF00]'
                            : log.includes('ALERT') || log.includes('DROP')
                            ? 'text-red-400'
                            : log.includes('APPROVED')
                            ? 'text-emerald-400'
                            : 'text-neutral-300'
                        }
                      >
                        {log}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
