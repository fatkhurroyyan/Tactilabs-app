import React from 'react';
import { Cpu, Eye, BarChart3, HelpCircle } from 'lucide-react';

export const Features: React.FC = () => {
  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '80px 24px', display: 'flex', flexDirection: 'column', gap: '56px' }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: '800', letterSpacing: '-0.03em' }}>
          Ekosistem Pembelajaran Terintegrasi
        </h1>
        <p style={{ fontSize: '18px', color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto', lineHeight: '1.6' }}>
          Tiga komponen utama yang dirancang khusus untuk mempercepat pemahaman sirkuit dan hukum fisika dasar.
        </p>
      </div>

      {/* Feature Blocks */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
        
        {/* Feature 1 */}
        <div className="glass-card" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <Cpu size={24} color="var(--cyan)" />
              <h2 style={{ fontSize: '20px' }}>1. TactiBlocks (Fisik)</h2>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6' }}>
              Modul magnetik kokoh yang berisi komponen elektronika seperti Resistor, Kapasitor, LED, Transistor, dan Gerbang Logika. Modul ini terhubung secara instan dan aman tanpa solder atau breadboard yang rumit.
            </p>
          </div>
          <div style={{ background: 'var(--bg-secondary)', borderRadius: '12px', padding: '24px', textAlign: 'center' }}>
            <span style={{ fontSize: '48px' }}>🔌</span>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '8px' }}>Magnetic Snap-on Modules</div>
          </div>
        </div>

        {/* Feature 2 */}
        <div className="glass-card" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px', alignItems: 'center' }}>
          <div style={{ background: 'var(--bg-secondary)', borderRadius: '12px', padding: '24px', textAlign: 'center' }}>
            <span style={{ fontSize: '48px' }}>💻</span>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '8px' }}>Volumetric Neon Flow</div>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <Eye size={24} color="var(--cyan)" />
              <h2 style={{ fontSize: '20px' }}>2. TactiApp (Digital)</h2>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6' }}>
              Simulator sirkuit digital interaktif dengan visualisasi aliran elektron 3D berbasis Three.js. Aliran elektron menyesuaikan kecepatan secara real-time berdasarkan pembacaan arus sirkuit fisik Anda yang sebenarnya.
            </p>
          </div>
        </div>

        {/* Feature 3 */}
        <div className="glass-card" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <BarChart3 size={24} color="var(--cyan)" />
              <h2 style={{ fontSize: '20px' }}>3. Dashboard Analitik (LMS)</h2>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6' }}>
              Dashboard evaluasi lengkap bagi pendidik untuk melacak progres pengerjaan praktikum siswa, membagikan tugas sirkuit secara terprogram, dan mengunduh performa agregat secara visual.
            </p>
          </div>
          <div style={{ background: 'var(--bg-secondary)', borderRadius: '12px', padding: '24px', textAlign: 'center' }}>
            <span style={{ fontSize: '48px' }}>📊</span>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '8px' }}>Near-Realtime Telemetry Charts</div>
          </div>
        </div>

      </div>

    </div>
  );
};
