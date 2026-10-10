import { User, VirtualCard, Transaction, Notification } from '../types';

const API_BASE_URL = '/api';

class ApiService {
  private getToken(): string | null {
    return localStorage.getItem('subsentry_token');
  }

  private setToken(token: string) {
    localStorage.setItem('subsentry_token', token);
  }

  private getHeaders() {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    this.setToken(data.token);
    return data;
  }

  async register(full_name: string, email: string, password: string): Promise<{ token: string; user: User }> {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ full_name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Registration failed');
    this.setToken(data.token);
    return data;
  }

  async getMe(): Promise<{ user: User }> {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: this.getHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch user');
    return data;
  }

  async getCards(status?: string, search?: string): Promise<{ cards: VirtualCard[] }> {
    let url = `${API_BASE_URL}/cards`;
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (search) params.append('search', search);
    if (params.toString()) url += `?${params.toString()}`;

    const res = await fetch(url, {
      headers: this.getHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch cards');
    return data;
  }

  async createCard(cardData: { merchant_name: string; merchant_category: string; spend_limit?: number; burn_date?: string }): Promise<{ card: VirtualCard }> {
    const res = await fetch(`${API_BASE_URL}/cards`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(cardData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create card');
    return data;
  }

  async getCard(id: string | number): Promise<{ card: VirtualCard }> {
    const res = await fetch(`${API_BASE_URL}/cards/${id}`, {
      headers: this.getHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch card');
    return data;
  }

  async toggleCardStatus(id: string | number): Promise<{ card: VirtualCard }> {
    const res = await fetch(`${API_BASE_URL}/cards/${id}/toggle`, {
      method: 'PATCH',
      headers: this.getHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to toggle card');
    return data;
  }

  async revokeCard(id: string | number): Promise<{ card: VirtualCard }> {
    const res = await fetch(`${API_BASE_URL}/cards/${id}/revoke`, {
      method: 'PATCH',
      headers: this.getHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to revoke card');
    return data;
  }

  async getTransactions(params?: { status?: string; card_id?: string }): Promise<{ transactions: Transaction[]; total: number }> {
    let url = `${API_BASE_URL}/transactions`;
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.append('status', params.status);
    if (params?.card_id) searchParams.append('card_id', params.card_id);
    
    const queryString = searchParams.toString();
    if (queryString) url += `?${queryString}`;

    const res = await fetch(url, {
      headers: this.getHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch transactions');
    return data;
  }

  async simulateCharge(payload: { card_number: string; amount: number; merchant_name: string }): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/transactions/simulate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    return data;
  }

  async getSummary(): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/analytics/summary`, {
      headers: this.getHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch summary');
    return data;
  }

  async getMonthlyAnalytics(): Promise<{ months: Array<{ month: string; spent: number; blocked: number; approved_count: number; blocked_count: number }> }> {
    const res = await fetch(`${API_BASE_URL}/analytics/monthly`, {
      headers: this.getHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch monthly analytics');
    return data;
  }

  async getNotifications(unreadOnly?: boolean): Promise<{ notifications: Notification[]; unread_count: number }> {
    let url = `${API_BASE_URL}/notifications`;
    if (unreadOnly) url += '?unread_only=true';

    const res = await fetch(url, {
      headers: this.getHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch notifications');
    return data;
  }

  async markNotificationRead(id: number): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
      method: 'PATCH',
      headers: this.getHeaders(),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Failed to mark notification as read');
    }
  }

  async markAllNotificationsRead(): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/notifications/read-all`, {
      method: 'PATCH',
      headers: this.getHeaders(),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Failed to mark all notifications as read');
    }
  }

  logout() {
    localStorage.removeItem('subsentry_token');
  }

  isLoggedIn() {
    return !!this.getToken();
  }
}

export const api = new ApiService();
