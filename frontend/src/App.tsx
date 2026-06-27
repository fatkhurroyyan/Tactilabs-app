import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
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

// Public pages
import { About } from './pages/About';
import { Features } from './pages/Features';
import { Pricing } from './pages/Pricing';
import { Contact } from './pages/Contact';

// Auth pages
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';

// Student pages
import { Settings } from './pages/Settings';
import { QuestDetail } from './pages/QuestDetail';

// Educator pages
import { Classes as EducatorClasses } from './pages/educator/Classes';
import { ClassDetail as EducatorClassDetail } from './pages/educator/ClassDetail';
import { Assignments as EducatorAssignments } from './pages/educator/Assignments';
import { Reports as EducatorReports } from './pages/educator/Reports';

// Admin pages
import { Users as AdminUsers } from './pages/admin/Users';
import { Institutions as AdminInstitutions } from './pages/admin/Institutions';
import { Settings as AdminSettings } from './pages/admin/Settings';
import { Content as AdminContent } from './pages/admin/Content';
import { Badges as AdminBadges } from './pages/admin/Badges';

import { Zap, LogOut, User, Settings as SettingsIcon } from 'lucide-react';

const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) => {
  const isAuthenticated = useAppStore(state => state.isAuthenticated);
  const user = useAppStore(state => state.user);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
};

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
      <Link to={isAuthenticated ? "/dashboard" : "/"} style={{ display: 'flex', alignItems: 'center' }}>
        <img src="/logo_tactilabs_cropped.png" alt="TactiLabs Logo" style={{ height: '32px', objectFit: 'contain' }} />
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        {isAuthenticated ? (
          <>
            {/* Student Navigation */}
            {user?.role === 'STUDENT' && (
              <>
                <Link to="/dashboard" style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-secondary)' }}>Dashboard</Link>
                <Link to="/quests" style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-secondary)' }}>Quests</Link>
                <Link to="/lab" style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-secondary)' }}>Lab virtual</Link>
                <Link to="/leaderboard" style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-secondary)' }}>Leaderboard</Link>
              </>
            )}

            {/* Educator Navigation */}
            {user?.role === 'EDUCATOR' && (
              <>
                <Link to="/educator/dashboard" style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-secondary)' }}>Overview</Link>
                <Link to="/educator/classes" style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-secondary)' }}>Kelas</Link>
                <Link to="/educator/assignments" style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-secondary)' }}>Penugasan</Link>
                <Link to="/educator/reports" style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-secondary)' }}>Laporan</Link>
              </>
            )}

            {/* Admin Navigation */}
            {user?.role === 'ADMIN' && (
              <>
                <Link to="/admin/dashboard" style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-secondary)' }}>Overview</Link>
                <Link to="/admin/users" style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-secondary)' }}>Users</Link>
                <Link to="/admin/institutions" style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-secondary)' }}>Mitra B2B</Link>
                <Link to="/admin/content" style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-secondary)' }}>Quest Editor</Link>
                <Link to="/admin/settings" style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-secondary)' }}>System Settings</Link>
              </>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderLeft: '1px solid var(--border-glass)', paddingLeft: '20px' }}>
              <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-primary)', fontSize: '14px' }} title="Profil">
                <User size={16} /> {user?.name}
              </Link>
              <Link to="/settings" style={{ color: 'var(--text-secondary)', padding: '6px', display: 'flex', alignItems: 'center' }} title="Pengaturan">
                <SettingsIcon size={16} />
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
            <Link to="/features" style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Fitur</Link>
            <Link to="/pricing" style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Harga</Link>
            <Link to="/about" style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Tentang</Link>
            <Link to="/contact" style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Kemitraan</Link>
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
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/features" element={<Features />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/contact" element={<Contact />} />

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Protected Student Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/lab" element={<ProtectedRoute allowedRoles={['STUDENT']}><Lab /></ProtectedRoute>} />
        <Route path="/lab/:questId" element={<ProtectedRoute allowedRoles={['STUDENT']}><Lab /></ProtectedRoute>} />
        <Route path="/quests" element={<ProtectedRoute allowedRoles={['STUDENT']}><Quests /></ProtectedRoute>} />
        <Route path="/quests/:questId" element={<ProtectedRoute allowedRoles={['STUDENT']}><QuestDetail /></ProtectedRoute>} />
        <Route path="/leaderboard" element={<ProtectedRoute allowedRoles={['STUDENT']}><Leaderboard /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

        {/* Protected Educator Routes */}
        <Route path="/educator/dashboard" element={<ProtectedRoute allowedRoles={['EDUCATOR']}><EducatorDashboard /></ProtectedRoute>} />
        <Route path="/educator/classes" element={<ProtectedRoute allowedRoles={['EDUCATOR']}><EducatorClasses /></ProtectedRoute>} />
        <Route path="/educator/classes/:classId" element={<ProtectedRoute allowedRoles={['EDUCATOR']}><EducatorClassDetail /></ProtectedRoute>} />
        <Route path="/educator/assignments" element={<ProtectedRoute allowedRoles={['EDUCATOR']}><EducatorAssignments /></ProtectedRoute>} />
        <Route path="/educator/reports" element={<ProtectedRoute allowedRoles={['EDUCATOR']}><EducatorReports /></ProtectedRoute>} />

        {/* Protected Admin Routes */}
        <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminUsers /></ProtectedRoute>} />
        <Route path="/admin/institutions" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminInstitutions /></ProtectedRoute>} />
        <Route path="/admin/content" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminContent /></ProtectedRoute>} />
        <Route path="/admin/badges" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminBadges /></ProtectedRoute>} />
        <Route path="/admin/settings" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminSettings /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
};
