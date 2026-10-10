import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Cards from './pages/Cards';
import CardDetails from './pages/CardDetails';
import Transactions from './pages/Transactions';
import Simulator from './pages/Simulator';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import Login from './pages/Login';
import { useState } from 'react';
import { api } from './services/api';

function ProtectedRoutes({ isLoggedIn, handleLogout }: { isLoggedIn: boolean, handleLogout: () => void }) {
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return (
    <Layout onLogout={handleLogout}>
      <Outlet />
    </Layout>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(api.isLoggedIn());

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    api.logout();
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <Login onLogin={handleLogin} />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoutes isLoggedIn={isLoggedIn} handleLogout={handleLogout} />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/cards" element={<Cards />} />
          <Route path="/cards/:id" element={<CardDetails />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/simulator" element={<Simulator />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to={isLoggedIn ? "/dashboard" : "/"} replace />} />
      </Routes>
    </Router>
  );
}
