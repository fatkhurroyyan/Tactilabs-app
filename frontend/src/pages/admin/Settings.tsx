import React, { useState } from 'react';
import { Settings as SettingsIcon, ShieldCheck, ToggleLeft, ToggleRight } from 'lucide-react';

export const Settings: React.FC = () => {
  const [maintenance, setMaintenance] = useState(false);
  const [rateLimit, setRateLimit] = useState(100);
  const [hardwareKey, setHardwareKey] = useState('esp32_secret_telemetry_key_2026');
  const [msg, setMsg] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setMsg('Pengaturan sistem global berhasil diperbarui!');
    setTimeout(() => setMsg(''), 3000);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      <div>
        <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Pengaturan Sistem Global</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Konfigurasikan pembatasan API rate, mode pemeliharaan, dan kunci enkripsi telemetri ESP32.</p>
      </div>

      {msg && (
        <div style={{ background: 'rgba(0,162,154,0.1)', border: '1px solid var(--cyan)', color: 'var(--cyan-neon)', padding: '12px', borderRadius: '8px' }}>
          {msg}
        </div>
      )}

      <div className="glass-card">
        <h2 style={{ fontSize: '18px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <SettingsIcon size={18} color="var(--cyan)" /> Parameter Global
        </h2>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Toggle Maintenance */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 'bold' }}>Mode Pemeliharaan (Maintenance Mode)</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Mengunci akses pembelajaran dan menampilkan halaman pemberitahuan pemeliharaan.</div>
            </div>
            <button 
              type="button"
              onClick={() => setMaintenance(!maintenance)} 
              style={{ background: 'none', padding: 0 }}
            >
              {maintenance ? (
                <ToggleRight size={40} color="var(--cyan)" />
              ) : (
                <ToggleLeft size={40} color="var(--text-secondary)" />
              )}
            </button>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>Pembatasan API Rate Limit (Requests per Minute)</label>
            <input 
              type="number" 
              value={rateLimit} 
              onChange={(e) => setRateLimit(parseInt(e.target.value))} 
              required 
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>Enkripsi Key Hardware ESP32</label>
            <input 
              type="text" 
              value={hardwareKey} 
              onChange={(e) => setHardwareKey(e.target.value)} 
              required 
            />
          </div>

          <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <ShieldCheck size={18} /> Simpan Konfigurasi Sistem
          </button>

        </form>
      </div>

    </div>
  );
};
