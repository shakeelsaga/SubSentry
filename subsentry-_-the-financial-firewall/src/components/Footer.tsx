import React from 'react';
import { SubSentryLogo } from './SubSentryLogo.tsx';

interface FooterProps {
  onOpenPrivacy?: () => void;
  onOpenAudit?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAudit }) => {
  return (
    <footer className="py-20 px-6 border-t border-white/10 bg-[#06080F]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-20">
          {/* Col 1: Brand & Bio */}
          <div className="col-span-2 md:col-span-1">
            <div className="mb-6">
              <SubSentryLogo size="sm" />
            </div>
            <p className="text-neutral-500 font-['Manrope'] text-sm leading-relaxed max-w-xs">
              Advanced capital protection for the modern digital era.
            </p>
            <div className="flex gap-3 mt-8">
              <a
                href="#terminal"
                onClick={(e) => { e.preventDefault(); if (onOpenAudit) onOpenAudit(); }}
                className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-[#CCFF00] hover:text-[#06080F] hover:border-[#CCFF00] transition-all cursor-pointer"
                title="Telemetry Terminal"
              >
                <span className="material-symbols-outlined text-sm">terminal</span>
              </a>
              <a
                href="#code"
                onClick={(e) => { e.preventDefault(); if (onOpenAudit) onOpenAudit(); }}
                className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-[#CCFF00] hover:text-[#06080F] hover:border-[#CCFF00] transition-all cursor-pointer"
                title="SDK & API Spec"
              >
                <span className="material-symbols-outlined text-sm">code</span>
              </a>
              <a
                href="#hub"
                onClick={(e) => { e.preventDefault(); if (onOpenAudit) onOpenAudit(); }}
                className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-[#CCFF00] hover:text-[#06080F] hover:border-[#CCFF00] transition-all cursor-pointer"
                title="Enclave Node Mesh"
              >
                <span className="material-symbols-outlined text-sm">hub</span>
              </a>
            </div>
          </div>

          {/* Col 2: System */}
          <div>
            <h4 className="font-['Space_Grotesk'] text-white uppercase tracking-widest mb-6 text-xs font-bold">
              System
            </h4>
            <ul className="space-y-4 text-neutral-500 font-['Manrope'] text-sm">
              <li>
                <a href="#features" className="hover:text-[#CCFF00] transition-colors">
                  Infrastructure
                </a>
              </li>
              <li>
                <a href="#interface" className="hover:text-[#CCFF00] transition-colors">
                  Merchant Library
                </a>
              </li>
              <li>
                <a href="#rules" className="hover:text-[#CCFF00] transition-colors">
                  API Docs
                </a>
              </li>
              <li>
                <span className="inline-flex items-center gap-1.5 text-neutral-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#CCFF00] animate-pulse"></span>
                  Status: All Nodes Nominal
                </span>
              </li>
            </ul>
          </div>

          {/* Col 3: Protocol */}
          <div>
            <h4 className="font-['Space_Grotesk'] text-white uppercase tracking-widest mb-6 text-xs font-bold">
              Protocol
            </h4>
            <ul className="space-y-4 text-neutral-500 font-['Manrope'] text-sm">
              <li>
                <a href="#privacy" onClick={(e) => { e.preventDefault(); alert("Local-First Architecture: Zero card credentials or customer telemetry ever leave your secure hardware enclave."); }} className="hover:text-[#CCFF00] transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#audit" onClick={(e) => { e.preventDefault(); if (onOpenAudit) onOpenAudit(); }} className="hover:text-[#CCFF00] transition-colors">
                  Security Audit (0 Leakages)
                </a>
              </li>
              <li>
                <a href="#terms" onClick={(e) => { e.preventDefault(); alert("SubSentry Terms of Service: Deterministic client-side enforcement for consumer and corporate funds."); }} className="hover:text-[#CCFF00] transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#gov" onClick={(e) => { e.preventDefault(); alert("Zero Telemetry Governance: Deterministic consensus protocol."); }} className="hover:text-[#CCFF00] transition-colors">
                  Governance
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Support */}
          <div>
            <h4 className="font-['Space_Grotesk'] text-white uppercase tracking-widest mb-6 text-xs font-bold">
              Support
            </h4>
            <ul className="space-y-4 text-neutral-500 font-['Manrope'] text-sm">
              <li>
                <a href="mailto:security@subsentry.internal" className="hover:text-[#CCFF00] transition-colors">
                  Priority Desk
                </a>
              </li>
              <li>
                <a href="#faq" onClick={(e) => { e.preventDefault(); alert("Knowledge Base: Learn how hardware token isolation blocks unauthorized subscription creep."); }} className="hover:text-[#CCFF00] transition-colors">
                  Knowledge Base
                </a>
              </li>
              <li>
                <a href="#connect" onClick={(e) => { e.preventDefault(); alert("Direct Connect: Secure P2P socket established with local sentry daemon."); }} className="hover:text-[#CCFF00] transition-colors">
                  Direct Connect
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5 gap-6">
          <p className="text-neutral-600 text-xs tracking-widest font-['Space_Grotesk'] uppercase">
            © 2026 SUBSENTRY SECURE SYSTEMS. ALL RIGHTS RESERVED.
          </p>

          <div className="flex items-center gap-2 border border-[#CCFF00]/20 bg-[#CCFF00]/5 px-3 py-1.5 rounded-full">
            <span className="text-[10px] text-[#CCFF00] tracking-widest font-bold uppercase font-['Space_Grotesk']">
              ENCRYPTED CONNECTION
            </span>
            <span className="material-symbols-outlined text-[13px] text-[#CCFF00]">
              verified
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
