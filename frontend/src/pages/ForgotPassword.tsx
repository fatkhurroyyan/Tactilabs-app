import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, CheckCircle2, ArrowLeft } from 'lucide-react';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mockLink, setMockLink] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');
    setMockLink('');
    try {
      const res = await fetch('http://localhost:4002/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(data.message);
        if (data.resetLink) {
          setMockLink(data.resetLink);
        }
      } else {
        setError(data.message || 'Gagal memproses permintaan.');
      }
    } catch (err) {
      setError('Kesalahan koneksi ke server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: '24px' }}>
      <div className="glass-card" style={{ maxWidth: '400px', width: '100%', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '24px', marginBottom: '8px' }}>Lupa Password</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
            Masukkan email Anda untuk menerima tautan pemulihan kata sandi.
          </p>
        </div>

        {success && (
          <div style={{ background: 'rgba(0,162,154,0.1)', border: '1px solid var(--cyan)', color: 'var(--cyan-neon)', padding: '16px', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={16} />
              <span>{success}</span>
            </div>
            {mockLink && (
              <div style={{ borderTop: '1px solid rgba(0,162,154,0.2)', paddingTop: '8px', marginTop: '4px' }}>
                <p style={{ fontWeight: 'bold', marginBottom: '4px' }}>[Mode Pengujian MVP]:</p>
                <a href={mockLink} style={{ textDecoration: 'underline', color: 'white', wordBreak: 'break-all' }}>{mockLink}</a>
              </div>
            )}
          </div>
        )}

        {error && (
          <div style={{ background: 'rgba(186,26,26,0.1)', border: '1px solid var(--red-neon)', color: 'var(--red-neon)', padding: '12px', borderRadius: '8px', fontSize: '13px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ position: 'relative' }}>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Alamat Email</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="email@domain.com" 
                required 
              />
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Memproses...' : 'Kirim Tautan Reset'}
          </button>
        </form>

        <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '16px', textAlign: 'center' }}>
          <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-secondary)' }}>
            <ArrowLeft size={14} /> Kembali ke Login
          </Link>
        </div>

      </div>
    </div>
  );
};
