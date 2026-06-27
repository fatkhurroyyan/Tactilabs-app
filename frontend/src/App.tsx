import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAppStore } from './store/useAppStore';
import { LandingPage } from './pages/LandingPage';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Lab } from './pages/Lab';
import { Quests } from './pages/Quests';
import { Leaderboard } from './pages/Leaderboard';
import { Profile } from './pages/Profile';
import { EducatorDashboard } from './pages/EducatorDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { Zap, LogOut, User } from 'lucide-react';

const Navbar: React.FC = () => {
  const user = useAppStore(state => state.user);
  const isAuthenticated = useAppStore(state => state.isAuthenticated);
  const logoutAction = useAppStore(state => state.logout);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:4002/api/auth/logout', { method: 'POST' });
    } catch (e) {
      // Ignore network fail
    }
    logoutAction();
    navigate('/login');
  };

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      background: 'rgba(247, 247, 245, 0.8)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-glass)',
      zIndex: 1000,
      padding: '16px 24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <Link to={isAuthenticated ? "/dashboard" : "/"} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Zap size={22} color="var(--primary)" fill="var(--primary)" />
        <span style={{ fontFamily: 'var(--font-heading)', fontWeight: '800', fontSize: '18px', letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>
          TACTILABS
        </span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        {isAuthenticated ? (
          <>
            {/* Student Navigation */}
            {user?.role === 'STUDENT' && (
              <>
                <Link to="/dashboard" style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-secondary)' }} className="hover:text-black transition-colors">Dashboard</Link>
                <Link to="/quests" style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-secondary)' }} className="hover:text-black transition-colors">Quests</Link>
                <Link to="/lab" style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-secondary)' }} className="hover:text-black transition-colors">Lab virtual</Link>
                <Link to="/leaderboard" style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-secondary)' }} className="hover:text-black transition-colors">Leaderboard</Link>
              </>
            )}

            {/* Educator Navigation */}
            {user?.role === 'EDUCATOR' && (
              <Link to="/educator/dashboard" style={{ fontSize: '14px', fontWeight: '500', color: 'var(--cyan)' }}>Educator Panel</Link>
            )}

            {/* Admin Navigation */}
            {user?.role === 'ADMIN' && (
              <Link to="/admin/dashboard" style={{ fontSize: '14px', fontWeight: '500', color: 'var(--cyan)' }}>Admin Panel</Link>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderLeft: '1px solid var(--border-glass)', paddingLeft: '20px' }}>
              <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-primary)', fontSize: '14px' }}>
                <User size={16} /> {user?.name}
              </Link>
              <button 
                onClick={handleLogout} 
                style={{ background: 'none', color: 'var(--text-secondary)', padding: '6px', display: 'flex', alignItems: 'center' }}
                title="Keluar"
              >
                <LogOut size={16} />
              </button>
            </div>
          </>
        ) : (
          <>
            <a href="/#features" style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Fitur</a>
            <a href="/#pricing" style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Harga</a>
            <Link to="/login" className="btn-secondary" style={{ padding: '8px 16px', fontSize: '14px' }}>Masuk</Link>
            <Link to="/register" className="btn-primary" style={{ padding: '8px 16px', fontSize: '14px' }}>Mulai Belajar</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/lab" element={<Lab />} />
        <Route path="/lab/:questId" element={<Lab />} />
        <Route path="/quests" element={<Quests />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/educator/dashboard" element={<EducatorDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
};
