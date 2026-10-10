import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Cards from './pages/Cards';
import CardDetails from './pages/CardDetails';
import Transactions from './pages/Transactions';
import Simulator from './pages/Simulator';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import Login from './pages/Login';
import { useState, useEffect } from 'react';
import { api } from './services/api';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(api.isLoggedIn());

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    api.logout();
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <Layout onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/cards" element={<Cards />} />
          <Route path="/cards/:id" element={<CardDetails />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/simulator" element={<Simulator />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/settings" element={<Settings />} />
          {/* Fallback to Dashboard */}
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </Layout>
    </Router>
  );
}
