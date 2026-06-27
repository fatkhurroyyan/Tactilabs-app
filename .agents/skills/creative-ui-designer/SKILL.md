---
name: creative-ui-designer
description: >-
  Instructs the agent to build modern, premium, non-stiff, and non-templated web interfaces.
  Enforces asymmetric layouts, layered Z-index depth, fluid micro-interactions, HSL tailored glows,
  and avoids generic blocky grids.
---

# Creative UI Designer Skill

## Overview
Skill ini bertindak sebagai pedoman bagi agen Antigravity untuk merancang antarmuka pengguna (UI/UX) dengan nilai estetika kelas atas (*high-fidelity*), dinamis, asimetris, dan menghindari gaya templat AI yang kaku atau membosankan.

## Prinsip Desain Utama

### 1. Tata Letak Asimetris (Asymmetric Layouts)
- **Grid Tidak Seimbang:** Hindari membagi kolom grid secara merata (seperti `1fr 1fr 1fr`). Gunakan proporsi asimetris yang dinamis (seperti `1.4fr 0.8fr 1.8fr` atau `3fr 2fr`).
- **Penyimpangan Alinyemen:** Letakkan beberapa elemen dekoratif (seperti teks label atau garis neon) sedikit bergeser keluar dari batas container utama (*overflow overlay*).
- **Whitespace sebagai Fitur:** Biarkan area kosong yang cukup luas (*generous breathing room*) di sekitar elemen utama untuk menciptakan fokus visual.

### 2. Kedalaman & Lapisan (Layering & Depth)
- **Overlapping Elements:** Tumpuk elemen visual secara berlapis menggunakan kombinasi `position: absolute` dan `z-index`. Contoh: sebuah card deskripsi menimpa sebagian kecil dari canvas 3D di belakangnya.
- **Glassmorphism:** Gunakan panel semi-transparan dengan efek blur latar belakang (`backdrop-filter: blur(16px)`) dan border gradasi tipis untuk menciptakan ilusi kaca melayang.
- **Dynamic Shadows:** Padukan bayangan warna gelap tipis dengan bayangan berpendar tipis (*glow shadows*) sewarna dengan aksen komponen.

### 3. Palet Warna & Kontras HSL
- **Curated HSL Colors:** Hindari warna dasar murni (seperti hitam `#000000` atau biru pekat). Gunakan warna gelap berbasis biru-abu slate (`hsl(215, 25%, 10%)`) dengan aksen cyan berpendar (`hsl(174, 100%, 40%)`).
- **Glow & Lights:** Elemen interaktif atau indikator status aktif wajib memiliki efek bayangan berpendar lembut (`box-shadow: 0 0 15px var(--glow-color)`).

### 4. Mikro-interaksi & Animasi Fluid
- **Magnetic Hover:** Tombol utama harus bereaksi aktif saat hover dengan pembesaran skala halus (`transform: scale(1.03) translateY(-2px)`) dan penambahan intensitas pendaran border.
- **Page Transitions:** Gunakan transisi masuk-keluar yang smooth (menggunakan Framer Motion fade-in-up dengan easing `cubic-bezier(0.4, 0, 0.2, 1)`).
- **Background Motion:** Tambahkan animasi partikel bergerak lambat atau gradasi latar belakang yang berubah warna tipis secara konstan agar halaman terasa "hidup".

## Elemen yang Dilarang (Anti-Patterns)
- ❌ **Bootstrap/Material Default:** Tombol dengan sudut melengkung kaku polos tanpa efek kedalaman.
- ❌ **Generic Cards:** Kotak berlatar belakang abu-abu solid dengan border abu-abu tanpa gradasi atau blur.
- ❌ **Symmetric Columns:** Pembagian halaman menjadi blok-blok persegi yang berukuran sama secara monoton.
- ❌ **Plain White Backgrounds:** Latar belakang putih polos yang menyilaukan mata tanpa tekstur grid atau bias cahaya neon lembut.
