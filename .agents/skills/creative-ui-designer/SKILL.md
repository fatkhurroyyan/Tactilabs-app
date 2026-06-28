---
name: creative-ui-designer
description: >-
  Instructs the agent to build modern, premium, non-stiff, and non-templated web interfaces.
  Enforces asymmetric layouts, layered Z-index depth, fluid micro-interactions, HSL tailored glows,
  and avoids generic blocky grids.
---

# Creative UI Designer Skill

## Overview
Skill ini menetapkan pedoman arsitektur antarmuka pengguna (UI/UX) premium kelas atas (*high-fidelity*) untuk platform Tactilabs. Panduan ini dirancang untuk meniadakan bentuk visual kaku khas kecerdasan buatan (templat standar/AI style) dan menggantinya dengan antarmuka dinamis, premium, dan ergonomis.

---

## 🎨 Token Desain & Palet Warna (Brand Tokens)

Gunakan variabel CSS berikut sebagai dasar utama styling untuk menjaga konsistensi visual di seluruh komponen:

```css
:root {
  /* Brand Colors */
  --color-dark-bg: hsl(210, 30%, 8%);         /* Biru malam super pekat */
  --color-panel-bg: rgba(16, 55, 92, 0.45);    /* Semi-transparent Navy */
  --color-primary: hsl(209, 70%, 21%);         /* Tacti Dark Blue (#10375C) */
  --color-secondary: hsl(177, 100%, 32%);      /* Tacti Teal/Cyan (#00A29A) */
  --color-secondary-glow: hsl(177, 100%, 45%); /* Neon Teal untuk pendaran */
  
  /* Neutral Colors */
  --color-text-primary: hsl(210, 20%, 98%);    /* Bright White/Off-White */
  --color-text-secondary: hsl(210, 14%, 72%);  /* Muted Greyish Blue */
  --color-border: rgba(0, 162, 154, 0.25);     /* Border Teal transparan */
  
  /* Gradients */
  --gradient-neon: linear-gradient(135deg, var(--color-secondary), hsl(190, 100%, 40%));
  --gradient-dark-card: linear-gradient(180deg, rgba(16, 55, 92, 0.6) 0%, rgba(10, 25, 41, 0.8) 100%);
  
  /* Shadows & Easing */
  --glow-subtle: 0 0 20px rgba(0, 162, 154, 0.15);
  --glow-intense: 0 0 30px rgba(0, 162, 154, 0.4);
  --ease-fluid: cubic-bezier(0.16, 1, 0.3, 1); /* Custom ease-out expo */
}
```

---

## 📐 Tata Letak Asimetris & Struktur Dinamis

Hindari grid 2x2 atau 3x3 yang monoton. Terapkan prinsip visual berikut:
1. **Asymmetric Columns**: Gunakan rasio kolom dinamis. 
   - Contoh CSS: `grid-template-columns: 1.6fr 1fr;` atau `grid-template-columns: 2.2fr 0.8fr;`
2. **Offset Overlaps**: Geser posisi elemen visual menggunakan kombinasi margin negatif atau `transform` terkontrol agar menumpuk di atas elemen lain secara dinamis.
3. **Breathing Spaces**: Gunakan padding yang tidak merata untuk mengalihkan pandangan. Pastikan rasio ruang kosong (*whitespace*) berkisar antara 30-40% dari total area halaman.

---

## 🪟 Teknik Layering & Glassmorphism Premium

Gunakan panel transparan berlapis untuk memberikan ilusi kedalaman 3 dimensi:

```css
.premium-card {
  background: var(--gradient-dark-card);
  backdrop-filter: blur(16px) saturate(120%);
  -webkit-backdrop-filter: blur(16px) saturate(120%);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  box-shadow: 
    0 10px 30px -10px rgba(0, 0, 0, 0.7),
    inset 0 1px 1px rgba(255, 255, 255, 0.05),
    var(--glow-subtle);
  position: relative;
  overflow: hidden;
  transition: all 0.4s var(--ease-fluid);
}

/* Garis cahaya tipis di bagian atas card saat hover */
.premium-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 200%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(0, 162, 154, 0.1),
    transparent
  );
  transition: transform 0.6s var(--ease-fluid);
}

.premium-card:hover::before {
  transform: translateX(50%);
}
```

---

## ✨ Mikro-interaksi & Easing Fluid

Semua interaksi tombol dan hover harus terasa responsif, "magnetis", dan memiliki inersia:

```css
.magnetic-button {
  background: var(--gradient-neon);
  color: var(--color-dark-bg);
  font-weight: 600;
  border: none;
  border-radius: 8px;
  padding: 12px 28px;
  box-shadow: var(--glow-subtle);
  transition: transform 0.3s var(--ease-fluid), box-shadow 0.3s var(--ease-fluid);
  cursor: pointer;
}

.magnetic-button:hover {
  transform: scale(1.03) translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 162, 154, 0.5), var(--glow-intense);
}

.magnetic-button:active {
  transform: scale(0.98) translateY(0);
}
```

---

## 🚫 Pola Anti-Template (Hal-hal yang Dilarang)

- ❌ **Solid Gray Borders**: Menggunakan border abu-abu (`#ccc` atau `#e2e8f0`) yang kaku pada card. Sebagai gantinya, gunakan border semi-transparan berwarna teal/cyan dengan gradasi lembut.
- ❌ **Symmetric Columns Without Hierarchy**: Grid simetris membosankan yang tidak memandu fokus utama mata pengguna.
- ❌ **Flat Solid Backgrounds**: Latar belakang satu warna flat tanpa bias gradasi sferis halus (*radial gradient glows*) di sudut-sudut layar.
- ❌ **Instant State Changes**: Transisi visual tanpa durasi (`transition: none` atau instan). Setiap perubahan harus dimediasi oleh transisi CSS atau Framer Motion dengan durasi antara `200ms` hingga `550ms` menggunakan kurva `cubic-bezier(0.16, 1, 0.3, 1)`.

