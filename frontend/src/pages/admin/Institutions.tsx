import React, { useEffect, useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Landmark, Plus, Save } from 'lucide-react';

interface InstitutionData {
  id: string;
  name: string;
  type: string;
  licenseType: string;
  maxStudents: number;
}

export const Institutions: React.FC = () => {
  const token = useAppStore(state => state.accessToken);

  const [institutions, setInstitutions] = useState<InstitutionData[]>([]);
  const [instName, setInstName] = useState('');
  const [instType, setInstType] = useState('UNIVERSITY');
  const [licenseType, setLicenseType] = useState('FREE');
  const [maxStudents, setMaxStudents] = useState(50);
  
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchInstitutions = async () => {
    try {
      const res = await fetch('http://localhost:4002/api/admin/institutions', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setInstitutions(data.institutions || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchInstitutions();
    }
  }, [token]);

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
        fetchInstitutions();
      } else {
        setMsg(data.message || 'Gagal mendaftarkan institusi');
      }
    } catch (err) {
      setMsg('Kesalahan koneksi');
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      <div>
        <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Pengelolaan Institusi & Lisensi B2B</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Daftarkan universitas, sekolah vokasi, atau mitra korporat baru dan kelola kuota lisensi mahasiswa.</p>
      </div>

      {msg && (
        <div style={{ background: 'rgba(0,162,154,0.1)', border: '1px solid var(--cyan)', color: 'var(--cyan-neon)', padding: '12px', borderRadius: '8px' }}>
          {msg}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px', alignItems: 'start' }}>
        
        {/* Left: Form Create */}
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

            <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <Save size={16} /> Simpan Institusi
            </button>
          </form>
        </div>

        {/* Right: Table */}
        <div className="glass-card">
          <h2 style={{ fontSize: '18px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Landmark size={18} color="var(--cyan)" /> Institusi Terdaftar
          </h2>

          {loading ? (
            <p style={{ color: 'var(--text-secondary)' }}>Memuat data institusi...</p>
          ) : institutions.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>Belum ada institusi terdaftar.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-glass)' }}>
                  <th style={{ padding: '12px 8px' }}>Nama Institusi</th>
                  <th style={{ padding: '12px 8px' }}>Tipe</th>
                  <th style={{ padding: '12px 8px' }}>Lisensi B2B</th>
                  <th style={{ padding: '12px 8px', textAlign: 'right' }}>Kuota Siswa</th>
                </tr>
              </thead>
              <tbody>
                {institutions.map(i => (
                  <tr key={i.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <td style={{ padding: '12px 8px', fontWeight: 'bold' }}>{i.name}</td>
                    <td style={{ padding: '12px 8px' }}>{i.type}</td>
                    <td style={{ padding: '12px 8px' }}>
                      <span style={{ 
                        fontSize: '11px', 
                        fontWeight: 'bold', 
                        background: 'rgba(0,162,154,0.1)',
                        color: 'var(--cyan)',
                        padding: '2px 8px',
                        borderRadius: '4px'
                      }}>
                        {i.licenseType}
                      </span>
                    </td>
                    <td style={{ padding: '12px 8px', textAlign: 'right' }}>{i.maxStudents} Users</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>

    </div>
  );
};
