import React, { useState } from 'react';
import { Mail, Phone, MapPin, CheckCircle } from 'lucide-react';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', institution: '', msg: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', institution: '', msg: '' });
    }, 3000);
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '80px 24px', display: 'flex', flexDirection: 'column', gap: '56px' }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: '800', letterSpacing: '-0.03em' }}>
          Hubungi Tim Kemitraan CSR & B2B
        </h1>
        <p style={{ fontSize: '18px', color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto', lineHeight: '1.6' }}>
          Daftarkan sekolah/universitas Anda untuk mengadopsi kit pembelajaran phygital Tactilabs.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '48px', alignItems: 'start' }}>
        
        {/* Info Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div className="glass-card">
            <h2 style={{ fontSize: '20px', marginBottom: '20px' }}>Informasi Kantor</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontSize: '14px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <MapPin size={18} color="var(--cyan)" />
                <span>Jl. Telekomunikasi No. 1, Bandung, Indonesia</span>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <Mail size={18} color="var(--cyan)" />
                <span>partnership@tactilabs.id</span>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <Phone size={18} color="var(--cyan)" />
                <span>+62 812-3456-7890</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form Column */}
        <div className="glass-card">
          <h2 style={{ fontSize: '20px', marginBottom: '20px' }}>Kirim Pesan Kemitraan</h2>
          {submitted ? (
            <div style={{ background: 'rgba(0,162,154,0.1)', border: '1px solid var(--cyan)', color: 'var(--cyan-neon)', padding: '16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle size={20} />
              <span>Pesan berhasil dikirim! Tim kami akan menghubungi Anda segera.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Nama Lengkap</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Thoriq" required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Email Resmi</label>
                <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="thoriq@univ.ac.id" required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Nama Institusi</label>
                <input type="text" value={formData.institution} onChange={(e) => setFormData({...formData, institution: e.target.value})} placeholder="Universitas Indonesia" required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Rincian Kebutuhan / Pesan</label>
                <textarea rows={4} value={formData.msg} onChange={(e) => setFormData({...formData, msg: e.target.value})} placeholder="Ingin berdiskusi mengenai penyediaan 20 unit TactiBlocks..." required />
              </div>
              <button type="submit" className="btn-primary">Kirim Permohonan</button>
            </form>
          )}
        </div>

      </div>

    </div>
  );
};
