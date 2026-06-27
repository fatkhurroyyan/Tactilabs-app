import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ShieldAlert } from 'lucide-react';

export const Pricing: React.FC = () => {
  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '80px 24px', display: 'flex', flexDirection: 'column', gap: '56px' }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: '800', letterSpacing: '-0.03em' }}>
          Pilih Paket yang Sesuai untuk Anda
        </h1>
        <p style={{ fontSize: '18px', color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto', lineHeight: '1.6' }}>
          Tersedia paket B2C untuk mahasiswa mandiri dan B2B untuk institusi/sekolah yang terintegrasi dengan kit fisik TactiBlocks.
        </p>
      </div>

      {/* Pricing Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
        
        {/* Plan 1 */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '24px', position: 'relative' }}>
          <div>
            <h2 style={{ fontSize: '20px', marginBottom: '8px' }}>Individu (B2C)</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '16px' }}>Cocok untuk mahasiswa/pemula yang ingin belajar elektronika secara mandiri.</p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '24px' }}>
              <span style={{ fontSize: '32px', fontWeight: 'bold' }}>Rp 150K</span>
              <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>/bulan</span>
            </div>
            
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} color="var(--cyan)" /> Akses semua Quest sirkuit</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} color="var(--cyan)" /> Visualisasi 3D real-time</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} color="var(--cyan)" /> Mode simulasi offline</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} color="var(--cyan)" /> 50+ preset modul digital</li>
            </ul>
          </div>
          
          <Link to="/register" className="btn-primary" style={{ textAlign: 'center', padding: '12px' }}>
            Mulai Belajar
          </Link>
        </div>

        {/* Plan 2 */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '24px', border: '2px solid var(--cyan)', boxShadow: '0 8px 24px rgba(0,162,154,0.1)' }}>
          <div>
            <div style={{ position: 'absolute', top: '-14px', right: '24px', background: 'var(--cyan)', color: 'white', padding: '4px 12px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' }}>POPULER</div>
            <h2 style={{ fontSize: '20px', marginBottom: '8px' }}>Institusi (B2B)</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '16px' }}>Ditujukan untuk Universitas, Politeknik, Sekolah Vokasi, dan Kursus STEM.</p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '24px' }}>
              <span style={{ fontSize: '32px', fontWeight: 'bold' }}>Hubungi Kami</span>
            </div>
            
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} color="var(--cyan)" /> Semua fitur individu</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} color="var(--cyan)" /> Peminjaman Kit Fisik TactiBlocks</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} color="var(--cyan)" /> Dashboard Analitik Educator</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} color="var(--cyan)" /> Manajemen Kelas & Nilai Otomatis</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} color="var(--cyan)" /> Integrasi Ekspor Data ke LMS</li>
            </ul>
          </div>
          
          <Link to="/contact" className="btn-primary" style={{ textAlign: 'center', padding: '12px', background: 'var(--cyan)' }}>
            Hubungi Kemitraan
          </Link>
        </div>

      </div>

    </div>
  );
};
