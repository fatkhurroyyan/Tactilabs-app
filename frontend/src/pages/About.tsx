import React from 'react';
import { Sparkles, Shield, Compass, Heart } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '80px 24px', display: 'flex', flexDirection: 'column', gap: '56px' }}>
      
      {/* Hero Header */}
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'inline-flex', alignSelf: 'center', alignItems: 'center', gap: '8px', background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', padding: '6px 16px', borderRadius: '30px', fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '700', letterSpacing: '0.1em' }}>
          <Sparkles size={12} fill="var(--text-secondary)" /> TENTANG TACTILABS
        </div>
        <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', lineHeight: '1.15', fontWeight: '800', letterSpacing: '-0.03em' }}>
          Membentuk Pionir Hardware Masa Depan
        </h1>
        <p style={{ fontSize: '18px', color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto', lineHeight: '1.6' }}>
          Kami percaya pembelajaran teknik tidak boleh hanya berupa coretan rumus di atas kertas atau kode simulasi 2D yang membosankan.
        </p>
      </div>

      {/* Grid Content */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Compass size={32} color="var(--cyan)" />
          <h2 style={{ fontSize: '20px' }}>Filosofi Phygital</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.5' }}>
            Menggabungkan stimulasi taktil-motorik dari TactiBlocks fisik dengan visualisasi digital real-time untuk membangun intuisi kelistrikan yang kuat.
          </p>
        </div>
        
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Shield size={32} color="var(--cyan)" />
          <h2 style={{ fontSize: '20px' }}>Aman & Intuitif</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.5' }}>
            Desain modul magnetik tanpa kabel jumper yang rumit menghindarkan risiko korsleting fisik sekaligus menghilangkan intimidasi bagi pemula.
          </p>
        </div>

        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Heart size={32} color="var(--cyan)" />
          <h2 style={{ fontSize: '20px' }}>Misi Edukasi</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.5' }}>
            Membantu dosen, guru, dan institusi pendidikan memantau ketuntasan belajar secara visual dan otomatis melalui dashboard analitik B2B terintegrasi.
          </p>
        </div>
      </div>

      {/* Team Section */}
      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <h2 style={{ fontSize: '24px', textAlign: 'center' }}>Visi & Dedikasi Tim</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: '1.6', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
          Tactilabs lahir dari kolaborasi akademisi, desainer interaksi, dan ahli mikrokontroler yang ingin merevolusi laboratorium praktikum sirkuit. Melalui perpaduan teknologi nirkabel ESP32, sensor telemetri presisi tinggi, dan WebGL interaktif, kami menghadirkan media pembelajaran interaktif tercanggih untuk laboratorium masa depan.
        </p>
      </div>

    </div>
  );
};
