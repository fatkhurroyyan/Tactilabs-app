import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { Users, AlertCircle, Calendar, FileSpreadsheet, ChevronRight } from 'lucide-react';

interface AttentionStudent {
  id: string;
  name: string;
  email: string;
  className: string;
  completedQuests: number;
  completionRate: number;
}

export const EducatorDashboard: React.FC = () => {
  const [dashboardSummary, setDashboardSummary] = useState<any>(null);
  const [needingAttention, setNeedingAttention] = useState<AttentionStudent[]>([]);
  const token = useAppStore(state => state.accessToken);
  const navigate = useNavigate();

  const fetchDashboard = async () => {
    try {
      const res = await fetch('http://localhost:4002/api/educator/dashboard', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setDashboardSummary(data.summary);
        setNeedingAttention(data.needingAttention || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchDashboard();
    }
  }, [token]);

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Dashboard Analitik Dosen</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Selamat datang kembali! Berikut ringkasan performa dan menu kontrol kelas Anda.</p>
      </div>

      {/* Aggregate Cards */}
      {dashboardSummary && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
          <div className="glass-card" style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>TOTAL KELAS ASUPAN</span>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'white', marginTop: '6px' }}>{dashboardSummary.classCount}</div>
          </div>
          <div className="glass-card" style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>TOTAL MAHASISWA</span>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'white', marginTop: '6px' }}>{dashboardSummary.studentCount}</div>
          </div>
          <div className="glass-card" style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>MODUL QUEST AKTIF</span>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--cyan-neon)', marginTop: '6px' }}>{dashboardSummary.totalQuests}</div>
          </div>
        </div>
      )}

      {/* Navigation Hub */}
      <div>
        <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>Peralatan Mengajar</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
          
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '16px' }}>
            <div>
              <Users size={24} color="var(--cyan)" />
              <h3 style={{ fontSize: '18px', marginTop: '12px', marginBottom: '6px' }}>Manajemen Kelas</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>Buat kelas praktikum baru, lihat daftar mahasiswa, dan periksa kode undangan kelas.</p>
            </div>
            <Link to="/educator/classes" className="btn-secondary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', padding: '10px' }}>
              Buka Kelas <ChevronRight size={16} />
            </Link>
          </div>

          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '16px' }}>
            <div>
              <Calendar size={24} color="var(--cyan)" />
              <h3 style={{ fontSize: '18px', marginTop: '12px', marginBottom: '6px' }}>Tugaskan Modul</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>Pilih dan tugaskan tantangan sirkuit ke kelompok kelas dengan tenggat waktu pengumpulan.</p>
            </div>
            <Link to="/educator/assignments" className="btn-secondary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', padding: '10px' }}>
              Buka Penugasan <ChevronRight size={16} />
            </Link>
          </div>

          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '16px' }}>
            <div>
              <FileSpreadsheet size={24} color="var(--cyan)" />
              <h3 style={{ fontSize: '18px', marginTop: '12px', marginBottom: '6px' }}>Ekspor Laporan</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>Unduh lembar nilai ketuntasan praktikum sirkuit mahasiswa dalam format file spreadsheet CSV.</p>
            </div>
            <Link to="/educator/reports" className="btn-secondary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', padding: '10px' }}>
              Buka Laporan <ChevronRight size={16} />
            </Link>
          </div>

        </div>
      </div>

      {/* Attention Required Students list */}
      <div className="glass-card">
        <h2 style={{ fontSize: '18px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertCircle size={18} color="var(--red-neon)" /> Siswa Perlu Perhatian (Progress &lt; 30%)
        </h2>
        {needingAttention.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Semua siswa berada dalam progress belajar yang aman.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {needingAttention.map(s => (
              <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255, 59, 48, 0.05)', border: '1px solid rgba(255, 59, 48, 0.2)', padding: '12px', borderRadius: '12px' }}>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{s.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{s.className} • {s.email}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: 'var(--red-neon)', fontWeight: 'bold', fontSize: '14px' }}>{s.completionRate}%</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{s.completedQuests} Quests</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
