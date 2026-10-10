import { NavLink, Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CreditCard, 
  Terminal, 
  ReceiptText, 
  Settings,
  Search,
  Bell,
  Menu,
  X,
  Film,
  LogOut,
  Eye,
  EyeOff
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { api } from '../services/api';
import { User } from '../types';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: CreditCard, label: 'Virtual Cards', path: '/cards' },
  { icon: Terminal, label: 'Merchant Simulator', path: '/simulator' },
  { icon: ReceiptText, label: 'Transactions', path: '/transactions' },
  { icon: Bell, label: 'Notifications', path: '/notifications' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export default function Layout({ children, onLogout }: { children: React.ReactNode; onLogout: () => void }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showBalance, setShowBalance] = useState(() => localStorage.getItem('subsentry_show_balance') !== 'false');
  const navigate = useNavigate();

  const toggleBalance = () => {
    const newState = !showBalance;
    setShowBalance(newState);
    localStorage.setItem('subsentry_show_balance', String(newState));
    window.dispatchEvent(new Event('balanceVisibilityChanged'));
  };

  useEffect(() => {
    const fetchUserData = () => {
      api.getMe().then(data => setUser(data.user)).catch(console.error);
      api.getNotifications().then(data => setUnreadCount(data.unread_count)).catch(console.error);
    };

    fetchUserData();

    // Poll for updates every 30 seconds
    const interval = setInterval(fetchUserData, 30000);

    const handleBalanceChange = () => {
      setShowBalance(localStorage.getItem('subsentry_show_balance') !== 'false');
    };
    
    window.addEventListener('balanceVisibilityChanged', handleBalanceChange);
    window.addEventListener('transaction_completed', fetchUserData);

    return () => {
      clearInterval(interval);
      window.removeEventListener('balanceVisibilityChanged', handleBalanceChange);
      window.removeEventListener('transaction_completed', fetchUserData);
    };
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-neutral-950/60 backdrop-blur-3xl border-r border-white/10 shadow-[10px_0_30px_rgba(0,0,0,0.5)] z-50">
        <div className="p-8">
          <Link to="/" className="block">
            <h1 className="text-2xl font-black text-primary-container italic font-display tracking-tight uppercase">SubSentry</h1>
          </Link>
        </div>

        <nav className="flex flex-col gap-2 p-6 flex-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center gap-4 px-4 py-3 rounded-lg font-display font-medium transition-all duration-200 group relative",
                isActive 
                  ? "bg-primary-container text-neutral-950 shadow-[0_0_15px_rgba(204,255,0,0.4)] translate-x-1" 
                  : "text-neutral-500 hover:text-primary-container hover:bg-white/5"
              )}
            >
              <item.icon className={cn("w-5 h-5 transition-transform group-hover:scale-110")} />
              <span>{item.label}</span>
              {item.path === '/notifications' && unreadCount > 0 && (
                <span className="absolute right-3 bg-secondary-container text-white text-[9px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center shadow-[0_0_8px_rgba(255,75,137,0.6)]">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </NavLink>
          ))}
          
          <button 
            onClick={onLogout}
            className="flex items-center gap-4 px-4 py-3 rounded-lg font-display font-medium text-neutral-500 hover:text-error hover:bg-error-container/10 transition-all mt-auto group"
          >
            <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            <span>Termination</span>
          </button>
        </nav>
      </aside>

      {/* Sidebar Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Mobile */}
      <aside className={cn(
        "fixed inset-y-0 left-0 w-64 bg-neutral-950 z-[70] md:hidden transition-transform duration-300",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 flex justify-between items-center">
          <h1 className="text-xl font-black text-primary-container italic font-display">SubSentry</h1>
          <button onClick={() => setIsSidebarOpen(false)}>
            <X className="w-6 h-6 text-neutral-400" />
          </button>
        </div>
        <nav className="flex flex-col gap-2 p-4 h-[calc(100%-80px)]">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsSidebarOpen(false)}
              className={({ isActive }) => cn(
                "flex items-center gap-4 px-4 py-3 rounded-lg font-display font-medium transition-all relative",
                isActive 
                  ? "bg-primary-container text-neutral-950 shadow-[0_0_15px_rgba(204,255,0,0.4)]" 
                  : "text-neutral-500"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
              {item.path === '/notifications' && unreadCount > 0 && (
                <span className="absolute right-3 bg-secondary-container text-white text-[9px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </NavLink>
          ))}
          <button 
            onClick={onLogout}
            className="flex items-center gap-4 px-4 py-3 rounded-lg font-display font-medium text-neutral-500 mt-auto"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-6 md:px-8 bg-neutral-950/40 backdrop-blur-md border-b border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.4)] z-40 sticky top-0">
          <button className="md:hidden" onClick={() => setIsSidebarOpen(true)}>
            <Menu className="w-6 h-6 text-primary-container" />
          </button>

          <div className="hidden md:flex flex-1 items-center max-w-md ml-4">
            <div className="relative w-full group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 group-focus-within:text-primary-container transition-colors" />
              <input 
                type="text" 
                placeholder="Search everything..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                    navigate(`/cards?search=${encodeURIComponent(e.currentTarget.value.trim())}`);
                    e.currentTarget.value = '';
                  }
                }}
                className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-primary-container/50 focus:bg-white/10 transition-all font-display"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            <div className="hidden sm:flex flex-col items-end mr-2">
                <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Main Balance</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-primary-container font-display">
                    {showBalance ? `₹${user?.main_balance?.toFixed(2) || '0.00'}` : '••••••'}
                  </span>
                  <button onClick={toggleBalance} className="text-on-surface-variant hover:text-white transition-colors">
                    {showBalance ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
            </div>
            
            <Link to="/notifications" className="text-neutral-400 hover:text-primary-container hover:bg-white/5 p-2 rounded-full relative transition-colors">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-secondary-container rounded-full shadow-[0_0_8px_rgba(255,75,137,0.8)] flex items-center justify-center text-[8px] font-black text-white px-1">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>
            <Link to="/settings" className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-bold text-white font-display">{user?.full_name}</p>
                <p className="text-[10px] font-black text-primary-container uppercase tracking-widest">Elite Member</p>
              </div>
              <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/10 shrink-0 hover:border-primary-container transition-colors">
                <img 
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.full_name || 'User')}&background=c3f400&color=000`} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
            </Link>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 md:p-10">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
