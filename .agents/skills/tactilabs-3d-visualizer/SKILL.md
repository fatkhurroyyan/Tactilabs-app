---
name: tactilabs-3d-visualizer
description: >-
  Provides guidelines on how to build and render the 3D real-time electron flow circuit visualizer using Three.js/React Three Fiber.
---

# Tactilabs 3D Circuit Visualizer Skill

## Overview
Skill ini memandu pengembangan modul **Lab Sirkuit Virtual (F-03)** menggunakan Three.js atau React Three Fiber (R3F). Fokus utamanya adalah merender visualisasi sirkuit 3D yang dinamis, performan, dan berestetika premium dengan efek neon mengalir yang diatur oleh data sensor real-time.

---

## 🎨 Tema Visual & Canvas Setup

Gunakan palet warna gelap berikut untuk latar belakang dan komponen canvas 3D:

- **Canvas Background**: `#08111e` (Dark navy pekat untuk kontras maksimum).
- **Wire/Kabel (Edge)**: Garis tipis semi-transparan `#10375c` saat mati, dan cyan berpendar `#00a29a` saat dialiri arus.
- **Komponen (Node)**: Box 3D ramping berwarna Navy gelap matte dengan sudut tumpul (`border-radius` virtual), dilapisi border glowing tipis di sekeliling permukaannya.
- **Elektron (Partikel)**: Bola-bola kecil (Mesh/InstancedMesh) berpendar cyan cerah `#00f0ff`.

---

## ⚡ Shader Aliran Elektron (Custom Shader Material)

Untuk kinerja optimal saat merender ratusan partikel elektron yang bergerak sepanjang kabel sirkuit, gunakan `InstancedMesh` atau `ShaderMaterial` khusus. Jangan membuat mesh individual secara berlebihan untuk menghindari penurunan FPS.

Berikut adalah pola shader GLSL untuk mensimulasikan aliran elektron berpendar sepanjang path kurva:

```javascript
import * as THREE from 'three';

const ElectronShader = {
  vertexShader: `
    uniform float uTime;
    uniform float uSpeed;
    varying vec2 vUv;
    void main() {
      vUv = uv;
      // Posisi partikel bergeser sepanjang koordinat X berdasarkan waktu
      vec3 newPosition = position;
      newPosition.x += sin(uTime * uSpeed + position.y) * 0.1;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    }
  `,
  fragmentShader: `
    varying vec2 vUv;
    uniform vec3 uColor;
    void main() {
      // Membuat efek pendaran sferis (radial glow) pada setiap partikel
      float dist = distance(vUv, vec2(0.5));
      float glow = 1.0 - smoothstep(0.0, 0.5, dist);
      gl_FragColor = vec4(uColor, glow * 0.8);
    }
  `
};
```

---

## 📈 Pemetaan Sensor ke Animasi (Data Binding)

Kecepatan aliran elektron harus mencerminkan arus listrik fisik secara proporsional. Gunakan formula normalisasi berikut saat menerima data dari ESP32 via WebSocket:

$$\text{Kecepatan Animasi } (uSpeed) = \text{Clamp}\left(\frac{\text{Arus terukur (mA)}}{I_{\text{max}}}, 0.1, 3.5\right)$$

- **Arus Nol (Open Circuit)**: Hentikan uSpeed (`uSpeed = 0`) dan ubah warna kabel secara instan menjadi `#10375c` (Redup/Mati) dengan transisi mulus.
- **Kondisi Short Circuit**: Jika arus melebihi ambang batas aman (misal > 500mA), ubah warna partikel menjadi merah neon berpendar `#ff3333` dan buat partikel bergerak sangat cepat dengan getaran acak (*jitter*).

---

## 🔄 Integrasi Jalur Sirkuit (CatmullRomCurve3)

Kabel penghubung antar komponen harus melengkung secara organik daripada lurus kaku:

1. Ambil koordinat 3D dari Node asal ($A$) dan Node tujuan ($B$).
2. Hitung titik tengah ($C$) dengan sedikit offset vertikal ($Y$) untuk memberikan efek kelenturan gravitasi (*cable sag*).
3. Buat kurva menggunakan `THREE.CatmullRomCurve3([A, C, B])`.
4. Extrude kurva tersebut menjadi `TubeGeometry` atau gunakan koordinat kurva untuk memandu posisi partikel elektron.

---

## 🛜 Mode Offline (Simulasi Cadangan)

Jika koneksi WebSocket ke ESP32 terputus atau tidak terdeteksi, aktifkan secara otomatis **Offline Simulator Mode**:
- Tampilkan toast pemberitahuan transparan di pojok layar: *"Hardware Offline — Menggunakan Simulator Virtual"*.
- Buat generator data dummy berbasis sinusoidal halus untuk menyimulasikan fluktuasi arus dan tegangan minor agar layar tetap terlihat "hidup".
