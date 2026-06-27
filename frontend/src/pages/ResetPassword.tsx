import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export const ResetPassword: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Konfirmasi kata sandi tidak cocok.');
      return;
    }
    setLoading(true);
    setSuccess('');
    setError('');
    try {
      const res = await fetch('http://localhost:4002/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password })
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(data.message);
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError(data.message || 'Gagal mengubah kata sandi.');
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
          <h1 style={{ fontSize: '24px', marginBottom: '8px' }}>Reset Password Baru</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
            Masukkan kata sandi baru untuk akun Anda.
          </p>
        </div>

        {success ? (
          <div style={{ background: 'rgba(0,162,154,0.1)', border: '1px solid var(--cyan)', color: 'var(--cyan-neon)', padding: '16px', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', alignItems: 'center', textAlign: 'center' }}>
            <CheckCircle2 size={24} />
            <span>{success}</span>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Mengalihkan ke halaman login dalam beberapa detik...</span>
          </div>
        ) : (
          <>
            {error && (
              <div style={{ background: 'rgba(186,26,26,0.1)', border: '1px solid var(--red-neon)', color: 'var(--red-neon)', padding: '12px', borderRadius: '8px', fontSize: '13px' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Kata Sandi Baru</label>
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="Minimal 8 karakter" 
                  required 
                  minLength={8}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Konfirmasi Kata Sandi</label>
                <input 
                  type="password" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  placeholder="Ulangi kata sandi baru" 
                  required 
                />
              </div>

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Menyimpan...' : 'Perbarui Password'}
              </button>
            </form>
          </>
        )}

      </div>
    </div>
  );
};
