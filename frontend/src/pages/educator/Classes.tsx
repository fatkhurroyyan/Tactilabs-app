import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { Users, Plus, Clipboard } from 'lucide-react';

interface ClassData {
  id: string;
  name: string;
  studentCount: number;
  avgQuestsCompleted: number;
  inviteCode: string;
}

export const Classes: React.FC = () => {
  const navigate = useNavigate();
  const token = useAppStore(state => state.accessToken);

  const [classes, setClasses] = useState<ClassData[]>([]);
  const [newClassName, setNewClassName] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchClasses = async () => {
    try {
      const res = await fetch('http://localhost:4002/api/educator/classes', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setClasses(data.classes || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchClasses();
    }
  }, [token]);

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg('');
    try {
      const res = await fetch('http://localhost:4002/api/educator/classes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: newClassName })
      });
      const data = await res.json();
      if (res.ok) {
        setMsg('Kelas baru berhasil dibuat!');
        setNewClassName('');
        fetchClasses();
      } else {
        setMsg(data.message || 'Gagal membuat kelas');
      }
    } catch (err) {
      setMsg('Kesalahan koneksi');
    }
  };

  const copyInviteCode = (code: string) => {
    navigator.clipboard.writeText(code);
    alert(`Kode undangan ${code} disalin ke clipboard!`);
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      <div>
        <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Kelola Kelas Praktikum</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Buat dan kelola kelompok kelas sirkuit serta salin kode undangan untuk mahasiswa.</p>
      </div>

      {msg && (
        <div style={{ background: 'rgba(0,162,154,0.1)', border: '1px solid var(--cyan)', color: 'var(--cyan-neon)', padding: '12px', borderRadius: '8px' }}>
          {msg}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px', alignItems: 'start' }}>
        
        {/* Left: Create Class */}
        <div className="glass-card">
          <h2 style={{ fontSize: '18px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={18} color="var(--cyan)" /> Buat Kelas Baru
          </h2>
          <form onSubmit={handleCreateClass} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <input
              type="text"
              value={newClassName}
              onChange={(e) => setNewClassName(e.target.value)}
              placeholder="Nama Kelas (Fisika Dasar A)"
              required
            />
            <button type="submit" className="btn-primary">Buat Kelas</button>
          </form>
        </div>

        {/* Right: Classes Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={20} color="var(--cyan)" /> Daftar Kelas
          </h2>

          {loading ? (
            <p style={{ color: 'var(--text-secondary)' }}>Memuat data kelas...</p>
          ) : classes.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>Belum ada kelas kelolaan.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              {classes.map(c => (
                <div key={c.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '16px' }}>
                  <div>
                    <h3 style={{ fontSize: '18px', marginBottom: '4px' }}>{c.name}</h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{c.studentCount} Mahasiswa terdaftar</p>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '12px', background: 'var(--bg-secondary)', padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--border-glass)', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Kode Undangan</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 'bold', fontSize: '13px', color: 'var(--cyan)' }}>{c.inviteCode}</span>
                        <button onClick={() => copyInviteCode(c.inviteCode)} style={{ padding: '2px', background: 'none', color: 'var(--text-secondary)' }} title="Salin Kode">
                          <Clipboard size={14} />
                        </button>
                      </div>
                    </div>
                  </div>

                  <button onClick={() => navigate(`/educator/classes/${c.id}`)} className="btn-secondary" style={{ width: '100%', padding: '10px' }}>
                    Lihat Progres Kelas
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
