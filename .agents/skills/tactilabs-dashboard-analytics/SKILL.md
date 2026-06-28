---
name: tactilabs-dashboard-analytics
description: >-
  Provides premium dashboard design guidelines, styling custom charts, glowing line paths, glassmorphic widgets, and interactive analytical tables.
---

# Tactilabs Dashboard Analytics Skill

## Overview
Skill ini memandu pengembangan **Dashboard Analitik Educator & Admin (F-05, F-08)**. Tujuannya adalah menyajikan data kompleks secara estetis, terstruktur, intuitif, dan interaktif dengan menerapkan konsep visual premium yang melampaui templat grafik siap pakai yang standar.

---

## 📈 Grafik Neon Berpendar (Glowing Line Paths)

Saat menggunakan perpustakaan grafik (seperti Recharts atau Chart.js), terapkan gaya berikut untuk membuat garis tren visual yang modern dan premium:

1. **Glow Effect (Line Shadows)**: Gunakan bayangan neon tipis di bawah garis grafik. Pada Chart.js, efek ini dapat ditambahkan langsung ke Canvas Context 2D:
   ```javascript
   const ctx = canvas.getContext('2d');
   const gradient = ctx.createLinearGradient(0, 0, 0, 400);
   gradient.addColorStop(0, 'rgba(0, 162, 154, 0.4)'); /* Teal glow */
   gradient.addColorStop(1, 'rgba(0, 162, 154, 0)');   /* Fade out */
   
   // Tambahkan shadow ke stroke lines
   ctx.shadowColor = 'rgba(0, 162, 154, 0.5)';
   ctx.shadowBlur = 10;
   ctx.shadowOffsetX = 0;
   ctx.shadowOffsetY = 4;
   ```
2. **Gradient Area Fill**: Jika menggunakan Area Chart, isi area di bawah kurva dengan gradasi linear vertikal dari warna aksen (`rgba(0, 162, 154, 0.25)`) menuju transparan total.

---

## 🎛️ Desain Widget KPI & HUD Kartu Data

Kartu ringkasan metrik (Widget KPI) harus didesain menyerupai Heads-Up Display (HUD) kapal luar angkasa yang bersih dan fungsional:

```css
.kpi-card {
  background: linear-gradient(135deg, rgba(16, 55, 92, 0.3) 0%, rgba(10, 25, 41, 0.5) 100%);
  border-left: 4px solid var(--color-secondary); /* Aksen garis tebal teal */
  border-top: 1px solid var(--color-border);
  border-right: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
  padding: 20px;
  border-radius: 12px;
  position: relative;
}

.kpi-trend-indicator {
  font-size: 0.8rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 4px;
}

.kpi-trend-indicator.up {
  color: #00ffcc;
  background: rgba(0, 255, 204, 0.1);
}
```

---

## 💬 HUD Custom Tooltip

Hindari tooltip bawaan perpustakaan chart yang kaku (latar belakang putih/abu polos). Buat komponen tooltip custom yang mengadopsi prinsip *glassmorphism*:

```javascript
// Contoh kustomisasi tooltip pada Recharts
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-chart-tooltip" style={{
        background: 'rgba(8, 17, 30, 0.85)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(0, 162, 154, 0.4)',
        padding: '12px 16px',
        borderRadius: '8px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
      }}>
        <p className="label" style={{ color: '#8f9cae', margin: 0, fontSize: '0.75rem' }}>{label}</p>
        <p className="value" style={{ color: '#00ffcc', margin: '4px 0 0 0', fontWeight: 'bold' }}>
          {`${payload[0].name} : ${payload[0].value}%`}
        </p>
      </div>
    );
  }
  return null;
};
```

---

## 📑 Tabel Data Interaktif & Transisi Baris Smooth

Untuk mencegah tabel berkedip kasar saat memfilter atau memilah data (sorting/filtering):

1. **Framer Motion AnimatePresence**: Bungkus baris tabel (`<tr>`) dengan animasi Framer Motion sehingga saat baris dihapus atau ditambahkan, baris tersebut memudar (*fade-in/fade-out*) dengan halus.
2. **Muted Contrast Alternating Rows**: Gunakan warna latar belakang baris genap-ganjil yang sangat tipis perbedaannya (misal: `rgba(16, 55, 92, 0.1)` dan `rgba(16, 55, 92, 0.2)`).
3. **Highlighted Hover**: Baris tabel harus berubah warna menjadi lebih terang dengan transisi warna border kiri saat kursor pengguna berada di atas baris tersebut.
