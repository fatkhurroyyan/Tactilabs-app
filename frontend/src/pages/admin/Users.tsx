import React, { useEffect, useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Users as UsersIcon, ShieldAlert } from 'lucide-react';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  institution: { name: string } | null;
}

export const Users: React.FC = () => {
  const token = useAppStore(state => state.accessToken);
  const [users, setUsers] = useState<UserData[]>([]);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await fetch('http://localhost:4002/api/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setUsers(data.users || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
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

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      <div>
        <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Pengelolaan Pengguna & Role</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Ubah role akses pengguna dan nonaktifkan atau aktifkan kembali akun pengguna platform.</p>
      </div>

      {msg && (
        <div style={{ background: 'rgba(0,162,154,0.1)', border: '1px solid var(--cyan)', color: 'var(--cyan-neon)', padding: '12px', borderRadius: '8px' }}>
          {msg}
        </div>
      )}

      <div className="glass-card">
        <h2 style={{ fontSize: '18px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <UsersIcon size={18} color="var(--cyan)" /> Daftar Pengguna
        </h2>

        {loading ? (
          <p style={{ color: 'var(--text-secondary)' }}>Memuat data pengguna...</p>
        ) : (
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
        )}
      </div>

    </div>
  );
};
