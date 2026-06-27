import React, { useEffect, useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Users, Plus, Settings } from 'lucide-react';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  institution: { name: string } | null;
}

export const AdminDashboard: React.FC = () => {
  const [overview, setOverview] = useState<any>(null);
  const [users, setUsers] = useState<UserData[]>([]);
  
  const [instName, setInstName] = useState('');
  const [instType, setInstType] = useState('UNIVERSITY');
  const [licenseType, setLicenseType] = useState('FREE');
  const [maxStudents, setMaxStudents] = useState(50);
  
  const [msg, setMsg] = useState('');
  const token = useAppStore(state => state.accessToken);

  const fetchOverview = async () => {
    try {
      const res = await fetch('http://localhost:4002/api/admin/overview', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setOverview(data.summary);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch('http://localhost:4002/api/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setUsers(data.users);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOverview();
      fetchUsers();
    }
  }, [token]);

  const handleUpdateUser = async (id: string, role: string, status: string) => {
    setMsg('');
    try {
      const res = await fetch(`http://localhost:4002/api/admin/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ role, status })
      });
      const data = await res.json();
      if (res.ok) {
        setMsg('Pengguna berhasil diperbarui!');
        fetchUsers();
      } else {
        setMsg(data.message || 'Gagal memperbarui pengguna');
      }
    } catch (err) {
      setMsg('Kesalahan koneksi');
    }
  };

  const handleCreateInst = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg('');
    try {
      const res = await fetch('http://localhost:4002/api/admin/institutions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: instName,
          type: instType,
          licenseType,
          maxStudents
        })
      });
      const data = await res.json();
      if (res.ok) {
        setMsg('Institusi baru berhasil terdaftar!');
        setInstName('');
        fetchOverview();
      } else {
        setMsg(data.message || 'Gagal mendaftarkan institusi');
      }
    } catch (err) {
      setMsg('Kesalahan koneksi');
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '32px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Settings color="var(--cyan)" /> Dashboard Admin Utama
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>Operasikan lisensi B2B institusi dan kelola kredensial pengguna platform.</p>
      </div>

      {msg && (
        <div style={{ background: 'rgba(0,162,154,0.1)', border: '1px solid var(--cyan)', color: 'var(--cyan-neon)', padding: '12px', borderRadius: '8px' }}>
          {msg}
        </div>
      )}

      {/* Aggregate Cards */}
      {overview && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
          <div className="glass-card" style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>TOTAL PENGGUNA TERDAFTAR</span>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'white', marginTop: '6px' }}>{overview.totalUsers}</div>
          </div>
          <div className="glass-card" style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>INSTITUSI MITRA</span>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'white', marginTop: '6px' }}>{overview.totalInstitutions}</div>
          </div>
          <div className="glass-card" style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>TOTAL MODUL SIRKUIT</span>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--cyan-neon)', marginTop: '6px' }}>{overview.totalQuests}</div>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr', gap: '32px', alignItems: 'start' }}>
        
        {/* Left: Create Institution */}
        <div className="glass-card">
          <h2 style={{ fontSize: '18px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={18} color="var(--cyan)" /> Daftarkan Institusi Baru
          </h2>
          <form onSubmit={handleCreateInst} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Nama Institusi</label>
              <input type="text" value={instName} onChange={(e) => setInstName(e.target.value)} placeholder="Telkom University" required />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Tipe Institusi</label>
                <select value={instType} onChange={(e) => setInstType(e.target.value)}>
                  <option value="UNIVERSITY">University</option>
                  <option value="HIGH_SCHOOL">High School</option>
                  <option value="VOCATIONAL">Vocational</option>
                  <option value="CORPORATE">Corporate</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Lisensi B2B</label>
                <select value={licenseType} onChange={(e) => setLicenseType(e.target.value)}>
                  <option value="FREE">Free</option>
                  <option value="BASIC">Basic</option>
                  <option value="PREMIUM">Premium</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Batas Maks Mahasiswa</label>
              <input type="number" value={maxStudents} onChange={(e) => setMaxStudents(parseInt(e.target.value))} required />
            </div>

            <button type="submit" className="btn-primary">Simpan Institusi</button>
          </form>
        </div>

        {/* Right: Users List Table */}
        <div className="glass-card">
          <h2 style={{ fontSize: '18px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={18} color="var(--cyan)" /> Pengelolaan Pengguna & Role
          </h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-glass)' }}>
                <th style={{ padding: '12px 8px' }}>Pengguna</th>
                <th style={{ padding: '12px 8px' }}>Institusi</th>
                <th style={{ padding: '12px 8px' }}>Role</th>
                <th style={{ padding: '12px 8px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                  <td style={{ padding: '12px 8px' }}>
                    <div style={{ fontWeight: 'bold' }}>{u.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{u.email}</div>
                  </td>
                  <td style={{ padding: '12px 8px', color: 'var(--text-secondary)' }}>{u.institution?.name || 'Independen'}</td>
                  <td style={{ padding: '12px 8px' }}>
                    <select 
                      value={u.role}
                      onChange={(e) => handleUpdateUser(u.id, e.target.value, u.status)}
                      style={{ padding: '4px 8px', fontSize: '12px', width: '120px' }}
                    >
                      <option value="STUDENT">Student</option>
                      <option value="EDUCATOR">Educator</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </td>
                  <td style={{ padding: '12px 8px' }}>
                    <select 
                      value={u.status}
                      onChange={(e) => handleUpdateUser(u.id, u.role, e.target.value)}
                      style={{ padding: '4px 8px', fontSize: '12px', width: '120px' }}
                    >
                      <option value="ACTIVE">Active</option>
                      <option value="SUSPENDED">Suspended</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};
