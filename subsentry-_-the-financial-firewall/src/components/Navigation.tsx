import React, { useState } from 'react';
import { SubSentryLogo } from './SubSentryLogo.tsx';

interface NavigationProps {
  currentView: 'landing' | 'dashboard';
  onNavigate: (view: 'landing' | 'dashboard') => void;
  onOpenLogin: () => void;
  onOpenSignUp: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentView,
  onNavigate,
  onOpenLogin,
  onOpenSignUp,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    if (currentView !== 'landing') {
      onNavigate('landing');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#06080F]/80 backdrop-blur-xl border-b border-white/10 h-20 transition-all">
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        {/* Logo with pure #CCFF00 wordmark */}
        <div 
          onClick={() => onNavigate('landing')}
          className="cursor-pointer transition-transform active:scale-95"
        >
          <SubSentryLogo size="md" />
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-x-8">
          <button
            onClick={() => onNavigate('dashboard')}
            className={`font-['Space_Grotesk'] tracking-widest uppercase text-xs font-bold transition-colors cursor-pointer ${
              currentView === 'dashboard'
                ? 'text-[#CCFF00] drop-shadow-[0_0_8px_rgba(204,255,0,0.5)]'
                : 'text-neutral-400 hover:text-[#CCFF00]'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => scrollToSection('features')}
            className="font-['Space_Grotesk'] text-neutral-400 hover:text-[#CCFF00] transition-colors tracking-widest uppercase text-xs font-bold cursor-pointer"
          >
            Features
          </button>
          <button
            onClick={() => scrollToSection('interface')}
            className="font-['Space_Grotesk'] text-neutral-400 hover:text-[#CCFF00] transition-colors tracking-widest uppercase text-xs font-bold cursor-pointer"
          >
            Interface
          </button>
          <button
            onClick={() => scrollToSection('rules')}
            className="font-['Space_Grotesk'] text-neutral-400 hover:text-[#CCFF00] transition-colors tracking-widest uppercase text-xs font-bold cursor-pointer"
          >
            Rules Engine
          </button>
          <button
            onClick={onOpenSignUp}
            className="font-['Space_Grotesk'] text-neutral-400 hover:text-[#CCFF00] transition-colors tracking-widest uppercase text-xs font-bold cursor-pointer"
          >
            Pricing
          </button>
        </div>

        {/* Action Controls: Log In and Sign Up */}
        <div className="flex items-center gap-x-3 sm:gap-x-4">
          <button
            onClick={onOpenLogin}
            className="font-['Space_Grotesk'] text-white hover:text-[#CCFF00] px-3.5 sm:px-4 py-2 hover:bg-white/5 rounded-lg transition-colors tracking-widest uppercase text-xs font-bold cursor-pointer"
          >
            Log In
          </button>

          <button
            onClick={onOpenSignUp}
            className="bg-[#CCFF00] text-[#06080F] font-['Space_Grotesk'] px-5 sm:px-6 py-2.5 rounded-lg font-black neon-glow-primary active-scale transition-all tracking-widest uppercase text-xs flex items-center gap-2 cursor-pointer shadow-lg"
          >
            <span>Sign Up</span>
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-neutral-400 hover:text-white rounded-lg border border-white/10"
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined text-xl">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#06080F]/95 backdrop-blur-2xl border-b border-white/10 px-6 py-5 flex flex-col gap-4 font-['Space_Grotesk']">
          <button
            onClick={() => {
              onNavigate('dashboard');
              setMobileMenuOpen(false);
            }}
            className="text-left text-sm uppercase tracking-wider text-[#CCFF00] font-bold py-2 border-b border-white/5"
          >
            Dashboard
          </button>
          <button
            onClick={() => scrollToSection('features')}
            className="text-left text-sm uppercase tracking-wider text-neutral-300 hover:text-[#CCFF00] py-2 border-b border-white/5"
          >
            Features
          </button>
          <button
            onClick={() => scrollToSection('interface')}
            className="text-left text-sm uppercase tracking-wider text-neutral-300 hover:text-[#CCFF00] py-2 border-b border-white/5"
          >
            Obsidian Interface
          </button>
          <button
            onClick={() => scrollToSection('rules')}
            className="text-left text-sm uppercase tracking-wider text-neutral-300 hover:text-[#CCFF00] py-2 border-b border-white/5"
          >
            Deterministic Rules
          </button>
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => {
                onOpenLogin();
                setMobileMenuOpen(false);
              }}
              className="flex-1 text-center py-2.5 rounded-lg border border-white/20 text-xs uppercase font-bold tracking-wider text-white"
            >
              Log In
            </button>
            <button
              onClick={() => {
                onOpenSignUp();
                setMobileMenuOpen(false);
              }}
              className="flex-1 text-center py-2.5 rounded-lg bg-[#CCFF00] text-[#06080F] text-xs uppercase font-black tracking-wider shadow-md"
            >
              Sign Up
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
