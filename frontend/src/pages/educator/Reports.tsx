import React, { useEffect, useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { FileSpreadsheet, Download, FileText } from 'lucide-react';

interface ClassData {
  id: string;
  name: string;
}

export const Reports: React.FC = () => {
  const token = useAppStore(state => state.accessToken);

  const [classes, setClasses] = useState<ClassData[]>([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await fetch('http://localhost:4002/api/educator/classes', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) {
          setClasses(data.classes || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (token) {
      fetchClasses();
    }
  }, [token]);

  const handleExportCSV = async () => {
    setMsg('');
    if (!selectedClassId) {
      alert('Harap pilih kelas terlebih dahulu.');
      return;
    }
    try {
      const res = await fetch(`http://localhost:4002/api/educator/classes/${selectedClassId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) {
        alert('Gagal mengambil data mahasiswa.');
        return;
      }
      
      const className = data.class.name;
      const students = data.students || [];

      // Generate CSV
      let csvContent = 'ID,Nama,Email,Level,XP,Quest Selesai\n';
      students.forEach((s: any) => {
        csvContent += `"${s.id}","${s.name}","${s.email}",${s.level},${s.xp},${s.completedQuests}\n`;
      });

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `laporan_praktikum_${className.toLowerCase().replace(/\s+/g, '_')}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setMsg('Ekspor CSV berhasil diunduh!');
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat mengunduh CSV.');
    }
  };

  const handleExportPDF = async () => {
    setMsg('');
    if (!selectedClassId) {
      alert('Harap pilih kelas terlebih dahulu.');
      return;
    }
    try {
      const res = await fetch(`http://localhost:4002/api/educator/classes/${selectedClassId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) {
        alert('Gagal mengambil data mahasiswa.');
        return;
      }
      
      const className = data.class.name;
      const students = data.students || [];

      // Open new print window
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        alert('Gagal membuka jendela cetak. Pastikan pop-up tidak diblokir.');
        return;
      }

      const rows = students.map((s: any, idx: number) => `
        <tr>
          <td style="border: 1px solid #ddd; padding: 10px; text-align: center;">${idx + 1}</td>
          <td style="border: 1px solid #ddd; padding: 10px; font-weight: bold;">${s.name}</td>
          <td style="border: 1px solid #ddd; padding: 10px;">${s.email}</td>
          <td style="border: 1px solid #ddd; padding: 10px; text-align: center;">Lv. ${s.level}</td>
          <td style="border: 1px solid #ddd; padding: 10px; text-align: right;">${s.xp} XP</td>
          <td style="border: 1px solid #ddd; padding: 10px; text-align: center; font-weight: bold; color: #00A29A;">${s.completedQuests}</td>
        </tr>
      `).join('');

      const htmlContent = `
        <html>
          <head>
            <title>Laporan Praktikum Sirkuit - ${className}</title>
            <style>
              body {
                font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;
                color: #333;
                padding: 40px;
                background-color: #fff;
              }
              .header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 2px solid #10375C;
                padding-bottom: 20px;
                margin-bottom: 30px;
              }
              .logo {
                font-size: 24px;
                font-weight: 800;
                color: #10375C;
                letter-spacing: -0.03em;
              }
              .title {
                text-align: right;
              }
              .title h1 {
                font-size: 20px;
                margin: 0;
                color: #10375C;
              }
              .title p {
                font-size: 13px;
                color: #666;
                margin: 5px 0 0 0;
              }
              .meta-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 20px;
                margin-bottom: 40px;
                font-size: 14px;
              }
              .meta-item {
                background: #f8f9fa;
                padding: 15px;
                border-radius: 8px;
                border-left: 4px solid #00A29A;
              }
              .meta-label {
                font-weight: bold;
                color: #666;
                margin-bottom: 4px;
                display: block;
              }
              .meta-value {
                font-size: 16px;
                color: #111;
                font-weight: 600;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 40px;
                font-size: 13px;
              }
              th {
                background-color: #10375C;
                color: white;
                font-weight: bold;
                border: 1px solid #10375C;
                padding: 12px 10px;
                text-align: left;
              }
              tr:nth-child(even) {
                background-color: #fcfcfc;
              }
              .footer {
                display: flex;
                justify-content: space-between;
                margin-top: 60px;
                font-size: 13px;
              }
              .signature-box {
                width: 200px;
                text-align: center;
              }
              .signature-line {
                border-bottom: 1px solid #333;
                height: 60px;
                margin-bottom: 8px;
              }
              @media print {
                body { padding: 0; }
                .no-print { display: none; }
              }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="logo">TACTILABS ACADEMY</div>
              <div class="title">
                <h1>LAPORAN KETUNTASAN BELAJAR</h1>
                <p>Generated: ${new Date().toLocaleDateString('id-ID')}</p>
              </div>
            </div>

            <div class="meta-grid">
              <div class="meta-item">
                <span class="meta-label">Kategori / Kelas</span>
                <span class="meta-value">${className}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">Pengajar / Educator</span>
                <span class="meta-value">Educator Panel (TactiLabs)</span>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th style="width: 50px; text-align: center;">No</th>
                  <th>Nama Lengkap</th>
                  <th>Email</th>
                  <th style="width: 100px; text-align: center;">Level</th>
                  <th style="width: 120px; text-align: right;">Total XP</th>
                  <th style="width: 120px; text-align: center;">Quest Selesai</th>
                </tr>
              </thead>
              <tbody>
                ${rows}
              </tbody>
            </table>

            <div class="footer">
              <div class="signature-box">
                <p>Mengetahui,</p>
                <div class="signature-line"></div>
                <p>Kepala Laboratorium</p>
              </div>
              <div class="signature-box">
                <p>Bandung, ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                <div class="signature-line"></div>
                <p>Dosen Pengampu</p>
              </div>
            </div>

            <script>
              window.onload = function() {
                window.print();
              };
            </script>
          </body>
        </html>
      `;

      printWindow.document.write(htmlContent);
      printWindow.document.close();

      setMsg('Ekspor cetak PDF laporan berhasil diproses!');
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat memproses laporan PDF.');
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      <div>
        <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Ekspor Laporan & Nilai</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Unduh ringkasan performa dan nilai ketuntasan modul praktikum sirkuit mahasiswa dalam bentuk CSV atau PDF.</p>
      </div>

      {msg && (
        <div style={{ background: 'rgba(0,162,154,0.1)', border: '1px solid var(--cyan)', color: 'var(--cyan-neon)', padding: '12px', borderRadius: '8px' }}>
          {msg}
        </div>
      )}

      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <h2 style={{ fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileSpreadsheet size={18} color="var(--cyan)" /> Buat Ekspor Laporan
        </h2>

        {loading ? (
          <p style={{ color: 'var(--text-secondary)' }}>Memuat data kelas...</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>Pilih Kelas</label>
              <select value={selectedClassId} onChange={(e) => setSelectedClassId(e.target.value)} required style={{ maxWidth: '400px' }}>
                <option value="">-- Pilih Kelas --</option>
                {classes.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '12px' }}>
              <button onClick={handleExportCSV} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Download size={16} /> Unduh CSV Laporan
              </button>
              <button onClick={handleExportPDF} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={16} /> Unduh PDF Ringkasan
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
