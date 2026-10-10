/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navigation } from './components/Navigation.tsx';
import { LandingHero } from './components/LandingHero.tsx';
import { TacticalDefenseBento } from './components/TacticalDefenseBento.tsx';
import { ObsidianInterfaceDemo } from './components/ObsidianInterfaceDemo.tsx';
import { SpendingBreakdownSection } from './components/SpendingBreakdownSection.tsx';
import { Footer } from './components/Footer.tsx';
import { DashboardView } from './components/DashboardView.tsx';
import { CreateCardModal } from './components/CreateCardModal.tsx';
import { AttackSimulatorModal } from './components/AttackSimulatorModal.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { INITIAL_CARDS, INITIAL_TRANSACTIONS, INITIAL_RULES } from './data/mockData.ts';
import { VirtualCard, TransactionAttempt, FirewallRule } from './types.ts';

export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard'>('landing');
  const [cards, setCards] = useState<VirtualCard[]>(INITIAL_CARDS);
  const [transactions, setTransactions] = useState<TransactionAttempt[]>(INITIAL_TRANSACTIONS);
  const [rules, setRules] = useState<FirewallRule[]>(INITIAL_RULES);

  // Modals
  const [createCardModalOpen, setCreateCardModalOpen] = useState(false);
  const [simulatorModalOpen, setSimulatorModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'early_access'>('login');
  
  // Toast notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleCreateCard = (newCard: VirtualCard) => {
    setCards(prev => [newCard, ...prev]);
    showToast(`Shield Card for ${newCard.merchantName} deployed (₹${newCard.monthlyLimit.toLocaleString('en-IN')}/mo cap)`);
  };

  const handleToggleKillSwitch = (cardId: string) => {
    setCards(prev => prev.map(c => {
      if (c.id === cardId) {
        const nextStatus = c.status === 'revoked' ? 'active' : 'revoked';
        const msg = nextStatus === 'revoked'
          ? `Kill-Switch Engaged: Token for ${c.merchantName} permanently severed.`
          : `Token restored for ${c.merchantName}. Re-arming firewall.`;
        showToast(msg);
        return { ...c, status: nextStatus };
      }
      return c;
    }));
  };

  const handleToggleMerchantLock = (cardId: string) => {
    setCards(prev => prev.map(c => {
      if (c.id === cardId) {
        const nextState = !c.isMerchantLocked;
        showToast(nextState ? `Card bound to ${c.merchantDomain} only` : `Merchant lock disabled for ${c.merchantName}`);
        return { ...c, isMerchantLocked: nextState };
      }
      return c;
    }));
  };

  const handleUpdateCardLimit = (cardId: string, newLimit: number) => {
    setCards(prev => prev.map(c => {
      if (c.id === cardId) {
        return { ...c, monthlyLimit: newLimit };
      }
      return c;
    }));
  };

  const handleToggleRule = (ruleId: string) => {
    setRules(prev => prev.map(r => {
      if (r.id === ruleId) {
        const nextState = !r.isEnabled;
        showToast(`Rule [${r.code}] is now ${nextState ? 'ARMED' : 'DISABLED'}`);
        return { ...r, isEnabled: nextState };
      }
      return r;
    }));
  };

  const handleAddTransaction = (tx: TransactionAttempt) => {
    setTransactions(prev => [tx, ...prev]);
    if (tx.status === 'BLOCKED' || tx.status === 'REVOKED') {
      setCards(prev => prev.map(c => {
        if (c.id === tx.cardId) {
          return { ...c, autoBlockCount: c.autoBlockCount + 1 };
        }
        return c;
      }));
    }
    showToast(`Packet Inspected: [${tx.status}] ${tx.merchantName} ₹${tx.amount.toLocaleString('en-IN')}`);
  };

  return (
    <div className="min-h-screen bg-[#06080F] text-[#e4e1ea] selection:bg-[#CCFF00] selection:text-[#06080F] mesh-gradient font-['Manrope']">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 glass-card px-4 py-3 rounded-2xl border-white/20 shadow-2xl flex items-center gap-3 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-[#CCFF00] animate-pulse" />
          <span className="text-xs font-['Space_Grotesk'] text-white font-bold">
            {toastMessage}
          </span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-neutral-400 hover:text-white text-xs pl-2 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Global Navigation with Log In and Sign Up buttons */}
      <Navigation
        currentView={currentView}
        onNavigate={setCurrentView}
        onOpenLogin={() => {
          setAuthModalTab('login');
          setAuthModalOpen(true);
        }}
        onOpenSignUp={() => {
          setAuthModalTab('early_access');
          setAuthModalOpen(true);
        }}
      />

      {/* Screen Routing */}
      {currentView === 'landing' ? (
        <main>
          {/* Hero Section */}
          <LandingHero
            onStartGuarding={() => {
              setAuthModalTab('early_access');
              setAuthModalOpen(true);
            }}
            onViewDemo={() => setSimulatorModalOpen(true)}
          />

          {/* Tactical Defense Bento Grid */}
          <TacticalDefenseBento />

          {/* Obsidian Interface Interactive Showcase */}
          <ObsidianInterfaceDemo
            onGetEarlyAccess={() => {
              setAuthModalTab('early_access');
              setAuthModalOpen(true);
            }}
            onLaunchDashboard={() => setCurrentView('dashboard')}
          />

          {/* Spending Breakdown & Cap Triggers */}
          <SpendingBreakdownSection />

          {/* Footer */}
          <Footer
            onOpenAudit={() => {
              setCurrentView('dashboard');
            }}
          />
        </main>
      ) : (
        <main>
          {/* Dashboard Console */}
          <DashboardView
            cards={cards}
            transactions={transactions}
            rules={rules}
            onOpenCreateCard={() => setCreateCardModalOpen(true)}
            onOpenSimulator={() => setSimulatorModalOpen(true)}
            onToggleKillSwitch={handleToggleKillSwitch}
            onToggleMerchantLock={handleToggleMerchantLock}
            onUpdateCardLimit={handleUpdateCardLimit}
            onToggleRule={handleToggleRule}
            onBackToLanding={() => setCurrentView('landing')}
          />

          {/* Footer */}
          <Footer
            onOpenAudit={() => {
              showToast("Hardware Enclave Synced: 0 Leakages detected across all merchant nodes.");
            }}
          />
        </main>
      )}

      {/* Modals */}
      <CreateCardModal
        isOpen={createCardModalOpen}
        onClose={() => setCreateCardModalOpen(false)}
        onCreateCard={handleCreateCard}
      />

      <AttackSimulatorModal
        isOpen={simulatorModalOpen}
        onClose={() => setSimulatorModalOpen(false)}
        cards={cards}
        onAddTransaction={handleAddTransaction}
      />

      <AuthModal
        isOpen={authModalOpen}
        initialTab={authModalTab}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={(userName) => {
          showToast(`Welcome back, ${userName}. Switching to Sentinel Dashboard.`);
          setCurrentView('dashboard');
        }}
      />
    </div>
  );
}
