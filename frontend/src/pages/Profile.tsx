import React, { useEffect, useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Award, Shield, Edit3, CheckCircle } from 'lucide-react';

interface ProfileData {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  role: string;
  xp: number;
  level: number;
  institutionName: string;
  createdAt: string;
}

interface StatsData {
  completedQuests: number;
  totalAttempts: number;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  isEarned: boolean;
  earnedAt: string | null;
}

export const Profile: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [stats, setStats] = useState<StatsData>({ completedQuests: 0, totalAttempts: 0 });
  const [badges, setBadges] = useState<Badge[]>([]);
  const [nameInput, setNameInput] = useState('');
  const [editing, setEditing] = useState(false);
  const [msg, setMsg] = useState('');

  const user = useAppStore(state => state.user);
  const token = useAppStore(state => state.accessToken);
  const loginAction = useAppStore(state => state.login);

  useEffect(() => {
    if (!token) return;

    const fetchProfile = async () => {
      try {
        const response = await fetch('http://localhost:4002/api/profile', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (response.ok) {
          setProfile(data.profile);
          setStats(data.stats);
          setBadges(data.badges);
          setNameInput(data.profile.name);
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    };

    fetchProfile();
  }, [token]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg('');
    try {
      const response = await fetch('http://localhost:4002/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: nameInput })
      });
      const data = await response.json();
      if (response.ok) {
        setMsg('Profil berhasil diperbarui!');
        setProfile(prev => prev ? { ...prev, name: data.user.name } : null);
        // Sync Zustand store
        if (user) {
          loginAction({ ...user, name: data.user.name }, token!);
        }
        setEditing(false);
      } else {
        setMsg(data.message || 'Gagal memperbarui profil');
      }
    } catch (error) {
      setMsg('Kesalahan koneksi server');
    }
  };

  if (!profile) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Memuat Profil...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Profile Card & Info */}
      <div className="glass-card" style={{ display: 'flex', gap: '32px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--cyan) 0%, #00bcac 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '40px',
          fontWeight: 'bold',
          color: 'white',
          boxShadow: '0 0 25px rgba(0, 162, 154, 0.4)'
        }}>
          {profile.name.charAt(0).toUpperCase()}
        </div>

        <div style={{ flex: 1, minWidth: '260px' }}>
          {editing ? (
            <form onSubmit={handleUpdate} style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
              <input 
                type="text" 
                value={nameInput} 
                onChange={(e) => setNameInput(e.target.value)} 
                required
                style={{ width: '220px', padding: '8px 12px' }}
              />
              <button type="submit" className="btn-primary" style={{ padding: '8px 16px', fontSize: '13px' }}>Simpan</button>
              <button type="button" onClick={() => setEditing(false)} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '13px' }}>Batal</button>
            </form>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '28px' }}>{profile.name}</h1>
              <button onClick={() => setEditing(true)} style={{ background: 'none', border: 'none', color: 'var(--cyan-neon)' }}>
                <Edit3 size={16} />
              </button>
            </div>
          )}

          <p style={{ color: 'var(--text-secondary)', fontSize: '15px', marginTop: '6px' }}>{profile.email} • {profile.institutionName}</p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', background: 'rgba(0,162,154,0.1)', border: '1px solid rgba(0,162,154,0.2)', padding: '4px 10px', borderRadius: '12px', color: 'var(--cyan-neon)', marginTop: '12px', fontWeight: 'bold' }}>
            <Shield size={12} /> {profile.role}
          </div>

          {msg && <p style={{ color: 'var(--cyan-neon)', fontSize: '13px', marginTop: '10px' }}>{msg}</p>}
        </div>

        {/* Level Indicator Badge */}
        <div style={{ textAlign: 'center', minWidth: '120px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>TINGKAT</span>
          <div style={{ fontSize: '48px', fontWeight: '800', color: 'white', lineHeight: '1' }}>{profile.level}</div>
          <span style={{ fontSize: '13px', color: 'var(--cyan-neon)', fontWeight: 'bold' }}>Lv. Pioneer</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px', alignItems: 'start', flexWrap: 'wrap' }}>
        
        {/* Statistics side */}
        <div className="glass-card">
          <h2 style={{ fontSize: '18px', marginBottom: '20px' }}>Statistik Praktikum</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>QUEST DISELESAIKAN</span>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--cyan-neon)' }}>{stats.completedQuests}</div>
            </div>
            <div>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>TOTAL PERCOBAAN SIRKUIT</span>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'white' }}>{stats.totalAttempts} kali</div>
            </div>
            <div>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>AKUMULASI PENGALAMAN (XP)</span>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'white' }}>{profile.xp} XP</div>
            </div>
          </div>
        </div>

        {/* Badges Collection Grid */}
        <div className="glass-card">
          <h2 style={{ fontSize: '20px', marginBottom: '20px' }}>Koleksi Lencana Penghargaan</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
            {badges.map(b => (
              <div 
                key={b.id} 
                className="glass-card" 
                style={{ 
                  textAlign: 'center', 
                  padding: '20px',
                  background: b.isEarned ? 'rgba(0, 162, 154, 0.05)' : 'rgba(255,255,255,0.02)',
                  borderColor: b.isEarned ? 'var(--cyan)' : 'var(--border-glass)',
                  opacity: b.isEarned ? 1 : 0.4
                }}
              >
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: b.isEarned ? 'var(--cyan)' : 'rgba(255,255,255,0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  margin: '0 auto 12px',
                  boxShadow: b.isEarned ? '0 0 15px rgba(0, 162, 154, 0.4)' : 'none'
                }}>
                  <Award size={28} />
                </div>
                <h3 style={{ fontSize: '16px', color: 'white', marginBottom: '4px' }}>{b.name}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '12px', lineHeight: '1.4' }}>{b.description}</p>
                {b.isEarned && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--cyan-neon)', marginTop: '8px', fontWeight: 'bold' }}>
                    <CheckCircle size={10} /> Didapatkan
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
