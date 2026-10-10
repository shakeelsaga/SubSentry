export interface VirtualCard {
  id: string;
  merchantName: string;
  merchantDomain: string;
  merchantCategory: 'Streaming' | 'Cloud & VPS' | 'Developer' | 'AI & SaaS' | 'Gym & Wellness' | 'Commerce';
  last4: string;
  fullCardNumber: string;
  expiry: string;
  cvv: string;
  cardHolder: string;
  monthlyLimit: number;
  currentSpend: number;
  status: 'active' | 'locked' | 'revoked';
  isMerchantLocked: boolean;
  isBurner: boolean;
  autoBlockCount: number;
  createdAt: string;
}

export interface TransactionAttempt {
  id: string;
  timestamp: string;
  cardId: string;
  merchantName: string;
  merchantDomain: string;
  amount: number;
  status: 'APPROVED' | 'BLOCKED' | 'REVOKED';
  reason: string;
  ruleTriggered: string;
}

export interface FirewallRule {
  id: string;
  code: string;
  name: string;
  description: string;
  isEnabled: boolean;
  strictness: 'hard' | 'adaptive';
  triggerCount: number;
}
