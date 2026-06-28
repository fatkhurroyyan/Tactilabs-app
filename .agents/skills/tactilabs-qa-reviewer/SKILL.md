---
name: tactilabs-qa-reviewer
description: >-
  Provides testing, QA, and code review guidelines for full-stack TypeScript/Node.js/React applications.
---

# Tactilabs QA & Code Reviewer Skill

## Overview
Skill ini memandu agen Antigravity untuk menjalankan tugas sebagai **QA Engineer** dan **Code Reviewer** di seluruh repositori Tactilabs. Pedoman ini menjamin kode yang diproduksi memenuhi standar kualitas tinggi, memiliki cakupan pengujian (*test coverage*) yang memadai, bebas dari kebocoran memori (khususnya Three.js & WebSocket), serta mematuhi prinsip Clean Architecture.

---

## 🧪 Pedoman Pengujian (QA Testing Guidelines)

Setiap fitur baru wajib dilengkapi dengan unit test atau integration test. Gunakan pola pengujian berikut:

### 1. Backend API & Router Testing (Jest & Supertest)
Uji setiap endpoint Express.js untuk memastikan penanganan kesalahan (*error handling*) berjalan sesuai spesifikasi dan tidak membocorkan stack trace internal.

```typescript
import request from 'supertest';
import app from '../src/app';
import { prismaMock } from './singleton'; // Mocking Prisma Client

describe('POST /api/auth/login', () => {
  it('harus mengembalikan error 400 jika format email tidak valid', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'invalid-email', password: 'Password123' });
      
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toContain('Format email salah');
  });
});
```

### 2. Database Mocking (Prisma Client)
Dilarang memicu mutasi basis data PostgreSQL riil selama pengujian unit (*unit tests*). Gunakan *prisma-mock-extended* untuk memalsukan query database.

### 3. Frontend Component & State Testing (Vitest & RTL)
Uji rendering komponen React, interaksi tombol, dan perubahan state Zustand:
- Pastikan komponen memproses state `loading` dan `error` dengan benar.
- Pastikan mock Socket.io-client bekerja untuk menyimulasikan penerimaan data sensor dari ESP32.

---

## 🔍 Pedoman Peninjauan Kode (Code Review Checklist)

Sebagai peninjau kode (*code reviewer*), periksa berkas-berkas yang diubah dengan fokus pada area kritis berikut:

### 1. Audit Kebocoran Memori (Memory Leak Audit)
Area yang paling sering mengalami kebocoran memori di Tactilabs adalah **Three.js (Lab Sirkuit 3D)** dan **WebSocket**:
- **Three.js Disposal**: Pastikan semua geometri, material, dan tekstur di-dispose secara eksplisit saat komponen di-unmount:
  ```javascript
  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);
  ```
- **WebSocket Cleanups**: Pastikan semua event listener Socket.IO dimatikan (`socket.off('sensor-data')`) saat komponen React dihancurkan agar tidak terjadi penumpukan event listener di latar belakang.

### 2. Keamanan Tipe (Type Safety & Zod Validation)
- Hindari penggunaan tipe data `any` secara longgar. Gunakan `unknown` jika tipe belum pasti dan lakukan type narrowing.
- Semua data masukan yang diterima dari API atau WebSocket wajib divalidasi terlebih dahulu menggunakan skema **Zod** sebelum diproses oleh domain logic.

### 3. Keamanan Kredensial & Lingkungan (Secrets Audit)
- Pastikan tidak ada berkas `.env` atau kunci API keras (*hardcoded secrets*) yang tidak sengaja dimasukkan (*committed*) ke git repository. Periksa kesesuaian berkas `.gitignore` proyek.
