import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { Users, Landmark, BookOpen, Settings, ChevronRight, Award } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [overview, setOverview] = useState<any>(null);
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

  useEffect(() => {
    if (token) {
      fetchOverview();
    }
  }, [token]);

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Dashboard Admin Utama</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Selamat datang kembali! Kelola seluruh operasional platform pembelajaran virtual Tactilabs.</p>
      </div>

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

      {/* Navigation Hub */}
      <div>
        <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>Peralatan Administrator</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
          
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '16px' }}>
            <div>
              <Users size={24} color="var(--cyan)" />
              <h3 style={{ fontSize: '18px', marginTop: '12px', marginBottom: '6px' }}>Manajemen Pengguna</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>Ubah role akses (Student/Educator/Admin) dan aktifkan atau tangguhkan akun pengguna.</p>
            </div>
            <Link to="/admin/users" className="btn-secondary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', padding: '10px' }}>
              Buka Pengguna <ChevronRight size={16} />
            </Link>
          </div>

          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '16px' }}>
            <div>
              <Landmark size={24} color="var(--cyan)" />
              <h3 style={{ fontSize: '18px', marginTop: '12px', marginBottom: '6px' }}>Manajemen Institusi</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>Daftarkan universitas/mitra baru, kelola kuota lisensi mahasiswa B2B, dan durasi lisensi.</p>
            </div>
            <Link to="/admin/institutions" className="btn-secondary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', padding: '10px' }}>
              Buka Institusi <ChevronRight size={16} />
            </Link>
          </div>

          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '16px' }}>
            <div>
              <BookOpen size={24} color="var(--cyan)" />
              <h3 style={{ fontSize: '18px', marginTop: '12px', marginBottom: '6px' }}>Manajemen Konten</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>Buat quest sirkuit baru, perbarui tingkat kesulitan, dan kustomisasi instruksi praktikum.</p>
            </div>
            <Link to="/admin/content" className="btn-secondary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', padding: '10px' }}>
              Buka Konten <ChevronRight size={16} />
            </Link>
          </div>

          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '16px' }}>
            <div>
              <Award size={24} color="var(--cyan)" />
              <h3 style={{ fontSize: '18px', marginTop: '12px', marginBottom: '6px' }}>Manajemen Badge</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>Kelola pencapaian penghargaan, kustomisasi ikon lencana, dan kriteria kualifikasi gamifikasi.</p>
            </div>
            <Link to="/admin/badges" className="btn-secondary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', padding: '10px' }}>
              Buka Badge <ChevronRight size={16} />
            </Link>
          </div>

          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '16px' }}>
            <div>
              <Settings size={24} color="var(--cyan)" />
              <h3 style={{ fontSize: '18px', marginTop: '12px', marginBottom: '6px' }}>Konfigurasi Sistem</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>Aktifkan mode pemeliharaan global, atur rate limiting API, dan ganti kunci hardware ESP32.</p>
            </div>
            <Link to="/admin/settings" className="btn-secondary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', padding: '10px' }}>
              Buka Sistem <ChevronRight size={16} />
            </Link>
          </div>

        </div>
      </div>

    </div>
  );
};
