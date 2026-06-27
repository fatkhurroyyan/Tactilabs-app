import React, { useEffect, useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Award, Plus, Trash2, Edit3, X, Save } from 'lucide-react';

interface BadgeData {
  id: string;
  name: string;
  description: string;
  icon: string;
  criteria: any;
}

export const Badges: React.FC = () => {
  const token = useAppStore(state => state.accessToken);

  const [badges, setBadges] = useState<BadgeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('🏆');
  const [criteriaStr, setCriteriaStr] = useState('{"type":"QUEST_COUNT","count":5}');

  const fetchBadges = async () => {
    try {
      const res = await fetch('http://localhost:4002/api/admin/badges', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setBadges(data.badges || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchBadges();
    }
  }, [token]);

  const openCreateModal = () => {
    setEditingId(null);
    setName('');
    setDescription('');
    setIcon('🏆');
    setCriteriaStr('{"type":"QUEST_COUNT","count":5}');
    setMsg('');
    setError('');
    setIsModalOpen(true);
  };

  const openEditModal = (b: BadgeData) => {
    setEditingId(b.id);
    setName(b.name);
    setDescription(b.description);
    setIcon(b.icon);
    setCriteriaStr(typeof b.criteria === 'string' ? b.criteria : JSON.stringify(b.criteria));
    setMsg('');
    setError('');
    setIsModalOpen(true);
  };

  const handleSaveBadge = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg('');
    setError('');

    // Validate Criteria JSON
    try {
      JSON.parse(criteriaStr);
    } catch (e) {
      setError('JSON Kriteria tidak valid.');
      return;
    }

    const payload = {
      name,
      description,
      icon,
      criteria: criteriaStr
    };

    try {
      const url = editingId 
        ? `http://localhost:4002/api/admin/badges/${editingId}`
        : 'http://localhost:4002/api/admin/badges';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok) {
        setMsg(editingId ? 'Badge berhasil diperbarui!' : 'Badge berhasil dibuat!');
        setIsModalOpen(false);
        fetchBadges();
      } else {
        setError(data.message || 'Gagal menyimpan badge.');
      }
    } catch (err) {
      setError('Kesalahan koneksi ke server.');
    }
  };

  const handleDeleteBadge = async (id: string) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus badge penghargaan ini?')) return;
    setMsg('');
    try {
      const res = await fetch(`http://localhost:4002/api/admin/badges/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setMsg('Badge berhasil dihapus.');
        fetchBadges();
      } else {
        const data = await res.json();
        alert(data.message || 'Gagal menghapus badge.');
      }
    } catch (err) {
      alert('Kesalahan koneksi ke server.');
    }
  };

  const loadCriteriaTemplate = (type: 'COUNT' | 'TOPIC') => {
    if (type === 'COUNT') {
      setCriteriaStr('{"type":"QUEST_COUNT","count":10}');
    } else {
      setCriteriaStr('{"type":"TOPIC_COMPLETE","topic":"OHM_LAW"}');
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      <div>
        <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Manajemen Badge & Penghargaan</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Kelola pencapaian gamifikasi, ikon penghargaan, dan parameter pemicu kriteria kelulusan praktikum mahasiswa.</p>
      </div>

      {msg && (
        <div style={{ background: 'rgba(0,162,154,0.1)', border: '1px solid var(--cyan)', color: 'var(--cyan-neon)', padding: '12px', borderRadius: '8px' }}>
          {msg}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={openCreateModal} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={16} /> Buat Badge Baru
        </button>
      </div>

      <div className="glass-card">
        <h2 style={{ fontSize: '18px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Award size={18} color="var(--cyan)" /> Daftar Badge Tersedia
        </h2>

        {loading ? (
          <p style={{ color: 'var(--text-secondary)' }}>Memuat penghargaan...</p>
        ) : badges.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>Belum ada badge terdaftar.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {badges.map(b => (
              <div key={b.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px', position: 'relative', background: 'rgba(255,255,255,0.02)' }}>
                
                <div style={{ position: 'absolute', top: '15px', right: '15px', display: 'flex', gap: '4px' }}>
                  <button onClick={() => openEditModal(b)} style={{ background: 'none', color: 'var(--text-secondary)', padding: '4px' }} title="Edit">
                    <Edit3 size={14} />
                  </button>
                  <button onClick={() => handleDeleteBadge(b.id)} style={{ background: 'none', color: 'var(--red-neon)', padding: '4px' }} title="Hapus">
                    <Trash2 size={14} />
                  </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ fontSize: '36px' }}>{b.icon}</div>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0 }}>{b.name}</h3>
                    <p style={{ fontSize: '12px', color: 'var(--cyan-neon)', margin: '2px 0 0 0' }}>Kriteria: {typeof b.criteria === 'string' ? b.criteria : JSON.stringify(b.criteria)}</p>
                  </div>
                </div>

                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '8px 0 0 0', lineHeight: '1.4' }}>{b.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CRUD Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(10, 25, 41, 0.85)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '24px'
        }}>
          <div className="glass-card" style={{
            maxWidth: '500px',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            position: 'relative',
            border: '1px solid var(--border-glass)'
          }}>
            <button 
              onClick={() => setIsModalOpen(false)} 
              style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', color: 'var(--text-secondary)', padding: 0 }}
            >
              <X size={20} />
            </button>

            <h2 style={{ fontSize: '22px' }}>{editingId ? 'Edit Badge' : 'Tambah Badge Baru'}</h2>

            {error && (
              <div style={{ background: 'rgba(186,26,26,0.1)', border: '1px solid var(--red-neon)', color: 'var(--red-neon)', padding: '12px', borderRadius: '8px', fontSize: '13px' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSaveBadge} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Ikon (Emoji)</label>
                  <input type="text" value={icon} onChange={(e) => setIcon(e.target.value)} required style={{ textAlign: 'center', fontSize: '20px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Nama Badge</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Master Resistor" />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Deskripsi Pencapaian</label>
                <textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} required placeholder="Diberikan kepada mahasiswa yang berhasil..." />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Kriteria Pemicu (JSON)</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button type="button" onClick={() => loadCriteriaTemplate('COUNT')} style={{ padding: '2px 8px', fontSize: '10px', background: 'var(--bg-secondary)', color: 'white' }}>Template Count</button>
                    <button type="button" onClick={() => loadCriteriaTemplate('TOPIC')} style={{ padding: '2px 8px', fontSize: '10px', background: 'var(--bg-secondary)', color: 'white' }}>Template Topik</button>
                  </div>
                </div>
                <textarea rows={3} value={criteriaStr} onChange={(e) => setCriteriaStr(e.target.value)} required style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }} />
              </div>

              <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <Save size={16} /> Simpan Badge
                </button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary" style={{ flex: 1 }}>
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
