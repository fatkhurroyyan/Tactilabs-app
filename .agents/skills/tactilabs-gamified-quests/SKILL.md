---
name: tactilabs-gamified-quests
description: >-
  Provides visual guidelines for gamified learning, including interactive sitemaps, quest cards, flip rewards, and success celebration animations.
---

# Tactilabs Gamified Quests Skill

## Overview
Skill ini menetapkan panduan implementasi visual untuk sistem **Quest & Gamifikasi Pembelajaran (F-04)** dan **Profil & Koleksi Achievement (F-06)**. Tujuannya adalah menghadirkan nuansa game petualangan (RPG/Adventure) kelas premium, menghindari daftar tugas satu dimensi yang kaku, dan memaksimalkan keterlibatan emosional pengguna.

---

## 🗺️ Peta Jalur Belajar Interaktif (SVG Learning Path Map)

Sebagai pengganti grid kartu standar, halaman utama `/quests` wajib menggunakan visualisasi peta jalur meliuk (winding pathway) interaktif berbasis SVG:

1. **Jalur Penghubung (Path)**: Gambar garis penghubung putus-putus dengan efek dash-array bergerak (`stroke-dasharray` & animation keyframes) yang menyimulasikan aliran energi dari quest ke quest.
2. **Titik Quest (Nodes)**:
   - **Selesai (Completed)**: Titik lingkaran bercahaya teal `#00a29a` dengan ikon centang tipis di dalamnya.
   - **Aktif (Current)**: Titik berukuran lebih besar yang berpulsasi membesar dan mengecil secara halus (`transform: scale()`, animatived pulse glow).
   - **Terkunci (Locked)**: Titik berwarna abu-abu mati `#334155` dengan ikon gembok kecil.

---

## 🃏 Desain Quest Card High-Fidelity

Setiap kartu detail misi harus memiliki identitas visual yang kuat berdasarkan tingkat kesulitan:

```css
/* Card Quest dengan Efek Kedalaman 3D */
.quest-card {
  position: relative;
  background: var(--gradient-dark-card);
  border: 1px solid var(--color-border);
  padding: 24px;
  border-radius: 16px;
  overflow: hidden;
  transition: transform 0.4s var(--ease-fluid), border-color 0.4s var(--ease-fluid);
  transform-style: preserve-3d; /* Untuk efek kemiringan 3D */
  perspective: 1000px;
}

/* Badge Kesulitan */
.difficulty-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  backdrop-filter: blur(8px);
}

.difficulty-badge.beginner {
  background: rgba(0, 162, 154, 0.15);
  color: #00ffcc;
  border: 1px solid rgba(0, 255, 204, 0.3);
}

.difficulty-badge.advanced {
  background: rgba(239, 68, 68, 0.15);
  color: #ff6b6b;
  border: 1px solid rgba(255, 107, 107, 0.3);
}
```

---

## 🎉 Animasi Selebrasi Kelulusan Quest

Ketika pengguna berhasil menyelesaikan misi secara fisik atau virtual, layar harus merayakan pencapaian tersebut secara dramatis:

1. **Confetti Burst**: Gunakan pustaka ringan seperti `canvas-confetti` untuk memancarkan partikel warna teal, biru, dan emas dari sisi kanan dan kiri layar secara asimetris.
2. **XP Float Up**: Animasikan teks peningkatan XP (misalnya `+150 XP`) yang muncul di atas kepala avatar pengguna, melayang ke atas sambil memudar perlahan menggunakan Framer Motion:
   ```javascript
   // Contoh Framer Motion untuk efek melayang teks
   <motion.div
     initial={{ opacity: 0, y: 20, scale: 0.8 }}
     animate={{ opacity: 1, y: -40, scale: 1.1 }}
     exit={{ opacity: 0, y: -80 }}
     transition={{ duration: 0.8, ease: "easeOut" }}
     className="xp-float-text"
   >
     +150 XP
   </motion.div>
   ```
3. **Card Level-Up Reveal**: Tampilkan modal transparan dengan cahaya berpendar di belakang kartu level baru pengguna yang berputar lambat pada sumbu Y.

---

## 🎖️ Animasi Flip Card 3D Koleksi Badge

Halaman profil harus menampilkan koleksi lencana prestasi (badges) dengan efek interaksi flip card 3D yang premium:

```css
/* Container Flip Card */
.badge-card-container {
  width: 120px;
  height: 120px;
  perspective: 1000px;
  cursor: pointer;
}

.badge-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.6s var(--ease-fluid);
  transform-style: preserve-3d;
}

.badge-card-container:hover .badge-card-inner {
  transform: rotateY(180deg);
}

/* Sisi Depan dan Belakang */
.badge-front, .badge-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 50%; /* Lencana berbentuk lingkaran */
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--color-border);
}

.badge-front {
  background: var(--gradient-dark-card);
}

.badge-back {
  background: var(--color-primary);
  transform: rotateY(180deg);
  font-size: 0.8rem;
  color: var(--color-text-primary);
  padding: 8px;
}
```
