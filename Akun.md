# Daftar Akun & Kredensial Uji Coba (TactiLabs)

Berikut adalah daftar akun yang terdaftar di database untuk menguji masing-masing peran (*role*) dan fitur pada platform **TactiApp**:

---

## 1. Role: ADMIN (Administrator Utama)
*   **Email**: `admin@tactilabs.com`
*   **Password**: `password123`
*   **Deskripsi Akses**: Akses penuh ke Panel Admin (`/admin/dashboard`), Manajemen Pengguna, Manajemen Institusi B2B, Pembuatan Badge, dan Editor Sirkuit/Quest.

---

## 2. Role: EDUCATOR (Dosen / Guru)
*   **Email**: `dosen@telkomuniversity.ac.id`
*   **Password**: `password123`
*   **Institusi**: Telkom University
*   **Deskripsi Akses**: Akses ke Dashboard Analitik Dosen (`/educator/dashboard`), manajemen kelas, pemberian tugas quest ke kelas/siswa, dan penarikan laporan PDF/CSV resmi.

---

## 3. Role: STUDENT (Mahasiswa / Siswa)

### Akun Uji Coba Baru (Injected)
*   **Email**: `user@tactilabs.com`
*   **Password**: `password123`
*   **Institusi**: Mandiri (B2C)
*   **Deskripsi Akses**: Akses ke Lab Sirkuit Virtual 3D, pengerjaan modul Quest, pengumpulan XP, perolehan Badge prestasi, dan papan peringkat (Leaderboard).

### Akun Telkom University (Seeded)
*   **Email**: `thoriq@student.telkomuniversity.ac.id`
*   **Password**: `password123`
*   **Institusi**: Telkom University
*   **Statistik Awal**: Level 1, 450 XP, tergabung dalam kelas *"Praktikum Rangkaian Listrik I-A"*.

### Akun Siswa SMK (Seeded)
*   **Email**: `siswasmk@student.smk.id`
*   **Password**: `password123`
*   **Institusi**: SMK Negeri 1 Bandung
*   **Statistik Awal**: Level 1, 120 XP.

---

*Catatan: Semua sandi dienkripsi menggunakan bcrypt (10 salt rounds) secara aman pada server.*
