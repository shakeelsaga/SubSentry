export interface Transaction {
  id: string | number;
  created_at: string;
  merchant_name: string;
  merchant_category?: string;
  amount: number;
  status: 'approved' | 'blocked' | 'limit_exceeded';
  card_number?: string;
  card_id?: string | number;
  reason?: string;
}

export interface VirtualCard {
  id: string | number;
  merchant_name: string;
  merchant_category: string;
  card_number: string;
  status: 'active' | 'paused' | 'revoked';
  spend_limit: number | null;
  spent_total: number;
  expiry_month: number;
  expiry_year: number;
  cvv: string;
  color: string;
  burn_date: string | null;
  created_at: string;
  updated_at: string;
  transaction_count?: number;
  is_burn_imminent?: boolean;
}

export interface User {
  id: string | number;
  full_name: string;
  email: string;
  main_balance: number;
  created_at: string;
}

export interface Notification {
  id: string | number;
  user_id: string | number;
  type: 'charge_approved' | 'charge_blocked' | 'spend_alert' | 'burn_executed' | 'card_expired';
  title: string;
  message: string;
  related_card_id: string | number | null;
  is_read: number;
  created_at: string;
}
