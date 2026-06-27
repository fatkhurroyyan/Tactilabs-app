# TEMPLAT PRD SIAP-AI (AI-READY PRD TEMPLATE)

## Format Dokumen Kebutuhan Produk yang Dioptimalkan untuk LLM / AI Code Generator

> **Instruksi untuk AI:** Bacalah dokumen PRD berikut secara menyeluruh, pahami batasan dan logikanya, lalu tunggu instruksi saya selanjutnya untuk mulai membuat modul kode.

---

## 1. METADATA & KONTEKS GLOBAL

Gunakan bagian ini untuk mengunci pemahaman AI terhadap batasan ekosistem teknologi (*tech stack*) dan peran spesifik yang harus diambil.

- **Nama Proyek:** Tactilabs — Website Pembelajaran Phygital STEM (TactiApp)
- **Versi PRD & Tanggal:** v1.0.0 / 27 Juni 2026
- **Target Tech Stack:**

  - **Frontend:** React.js 18+ dengan Vite 5 sebagai bundler, TypeScript, Three.js (untuk visualisasi 3D aliran elektron), Framer Motion (animasi UI), Zustand (state management)
  - **Backend / API:** Node.js dengan Express.js, Socket.IO / WebSocket (komunikasi real-time antara hardware ESP32 dan web app)
  - **Database & ORM:** PostgreSQL dengan Prisma ORM
  - **Autentikasi:** JWT (JSON Web Token) dengan HttpOnly Cookies, refresh token rotation
  - **Styling:** Vanilla CSS dengan CSS Modules / CSS Custom Properties (design tokens), mengikuti brand color Tactilabs (`#10375C` Dark Blue, `#00A29A` Cyan/Teal, `#F4F6F9` Off-White)
  - **Deployment:** Docker, Nginx reverse proxy, CI/CD via GitHub Actions
- **Arsitektur & Standar Kode:**

  - SOLID Principles, Clean Architecture (domain-driven folder structure)
  - ESLint strict mode + Prettier
  - Dekstop fisrt Responsive Design
  - Semantic HTML5 + WCAG 2.1 AA Accessibility
  - Component-driven development (Atomic Design methodology)
- **Peran AI (AI Persona Prompts):**

  > Bertindaklah sebagai **Senior Full-Stack Developer, Software Architect, dan QA Engineer** berpengalaman. Semua respons, struktur kode, skema database, dan pengujian yang Anda hasilkan nanti harus mematuhi batasan teknologi dan standar yang didefinisikan dalam dokumen ini tanpa pengecualian.
  >

---

## 2. RINGKASAN PRODUK & TARGET PENGGUNA

### 2.1 Masalah & Solusi (Problem & Solution)

**Problem Statement:**

Di era AI dan digital yang serba cepat, terdapat tiga masalah kritis dalam pembelajaran sains dan elektronika dasar:

1. **Degradasi Pemahaman akibat AI:** Mahasiswa cenderung menyalin kode atau jawaban tugas sirkuit dari AI tanpa memahami esensi dan logika dasar kelistrikan, sehingga pemahaman fundamental tergerus.
2. **Metode Belajar Abstrak & Membosankan:** Buku teks (e-book), diagram sirkuit konvensional, dan modul praktikum sangat abstrak, teoretis, kaku, dan tidak interaktif bagi pemula. Platform digital eksisting (seperti PhET Simulation) bersifat digital murni tanpa stimulasi motorik/taktil.
3. **Tingginya Angka Kegagalan Praktikum:** Tingkat ketidaklulusan praktikum dasar mahasiswa teknik tahun pertama cukup tinggi karena kurangnya jembatan antara teori dan praktik fisik langsung. Solusi fisik eksisting (seperti Arduino Starter Kit) terlalu rumit dan intimidatif bagi pemula, sedangkan mainan edukatif (Snap Circuits) tidak memiliki integrasi digital dan akademis (LMS).

**Product Vision:**

Tactilabs hadir sebagai platform pembelajaran fisika dan elektronika dasar berbasis *hybrid physical-digital (phygital)* yang menghubungkan teori elektronika yang rumit dengan praktik langsung serta visualisasi yang sederhana dan interaktif. Website **TactiApp** adalah komponen digital utama yang menyediakan:

1. **Visualisasi Aliran Elektron 3D Real-Time** menggunakan Three.js — begitu komponen fisik TactiBlocks dihubungkan, aliran elektron langsung menyala interaktif di layar sesuai parameter kelistrikan riil (arus, tegangan, hambatan).
2. **Quest-Based Learning (Gamifikasi)** yang menuntun siswa menyelesaikan teka-teki logika sirkuit dengan cerita petualangan, badge, level-up, dan leaderboard.
3. **Dashboard Analitik Akademik (B2B)** terintegrasi LMS untuk dosen/guru melacak progres, nilai, dan ketuntasan belajar siswa secara otomatis.
4. **Landing Page Publik** yang menampilkan produk Tactilabs secara menarik, informatif, dan persuasif untuk menarik calon pengguna dan mitra institusi.

---

### 2.2 Target Pengguna (User Personas)

Aplikasi ini memiliki beberapa peran (*roles*) pengguna dengan hak akses yang terisolasi:

| Role               | Deskripsi Hak Akses                                                                                                                                                                                                              |
| :----------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **GUEST**    | Pengunjung publik yang belum login. Dapat mengakses Landing Page, halaman About, halaman Pricing, dan halaman Login/Register. Tidak dapat mengakses fitur interaktif pembelajaran atau dashboard.                                |
| **STUDENT**  | Mahasiswa/siswa yang terdaftar. Dapat mengakses Dashboard Pembelajaran, Modul Quest (Gamifikasi), Visualisasi Sirkuit 3D Real-Time, Profil Pribadi, Riwayat Progres Belajar, dan Leaderboard.                                    |
| **EDUCATOR** | Dosen/guru yang terdaftar oleh institusi. Dapat mengakses Dashboard Analitik Akademik, melihat progres dan nilai semua siswa yang ditugaskan, mengelola kelas/kelompok, menugaskan quest/modul, serta mengekspor laporan ke LMS. |
| **ADMIN**    | Administrator sistem. Dapat mengelola semua akun pengguna, konfigurasi institusi mitra, konten modul pembelajaran, serta pengaturan sistem secara menyeluruh.                                                                    |

---

## 3. ARSITEKTUR INFORMASI & STRUKTUR HALAMAN

AI memerlukan peta navigasi yang jelas untuk memahami bagaimana rute halaman (*routing*) dan proteksi halaman diatur di dalam sistem.

Berikut adalah hierarki halaman (*Sitemap*) dan batasan aksesnya:

### Halaman Publik (Public Routes)

| Rute          | Deskripsi                                                                                                               | Akses                |
| :------------ | :---------------------------------------------------------------------------------------------------------------------- | :------------------- |
| `/`         | **Landing Page** — Hero section, penjelasan produk TactiBlocks & TactiApp, testimoni, CTA registrasi, video demo | Publik (semua orang) |
| `/about`    | **Tentang Tactilabs** — Visi misi, tim, filosofi phygital learning                                               | Publik               |
| `/features` | **Fitur Produk** — Penjelasan detail 3 komponen utama (TactiBlocks, TactiApp, Dashboard Analitik)                | Publik               |
| `/pricing`  | **Harga & Paket** — Paket B2B (Institusi) dan B2C (Individu), perbandingan fitur                                 | Publik               |
| `/contact`  | **Kontak & Kemitraan** — Formulir kontak, informasi kemitraan CSR/Co-branding                                    | Publik               |

### Halaman Autentikasi (Auth Routes)

| Rute                       | Deskripsi                                                                           | Akses                                                    |
| :------------------------- | :---------------------------------------------------------------------------------- | :------------------------------------------------------- |
| `/login`                 | **Halaman Login** — Form email & password                                    | Hanya GUEST (redirect ke`/dashboard` jika sudah login) |
| `/register`              | **Halaman Registrasi** — Form pendaftaran akun baru (Student/Educator)       | Hanya GUEST (redirect ke`/dashboard` jika sudah login) |
| `/forgot-password`       | **Lupa Password** — Form reset password via email                            | Hanya GUEST                                              |
| `/reset-password/:token` | **Reset Password** — Form input password baru setelah verifikasi token email | Hanya GUEST                                              |

### Halaman Terproteksi — Student (Protected Routes)

| Rute                  | Deskripsi                                                                                                                                                                     | Akses                    |
| :-------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------- |
| `/dashboard`        | **Dashboard Utama Student** — Ringkasan progres belajar, quest aktif, notifikasi, dan shortcut aksi                                                                    | STUDENT, EDUCATOR, ADMIN |
| `/lab`              | **Lab Sirkuit Virtual** — Canvas visualisasi 3D aliran elektron real-time, panel kontrol komponen, pembacaan sensor (tegangan, arus) dari hardware ESP32 via WebSocket | STUDENT                  |
| `/lab/:quest-id`    | **Lab Sirkuit + Quest Mode** — Lab dengan panduan quest/tantangan tertentu yang harus diselesaikan                                                                     | STUDENT                  |
| `/quests`           | **Daftar Quest / Modul Pembelajaran** — Library semua modul quest tersedia (free & premium), filter berdasarkan level kesulitan dan topik                              | STUDENT                  |
| `/quests/:quest-id` | **Detail Quest** — Deskripsi quest, prasyarat, materi pendukung, tombol mulai                                                                                          | STUDENT                  |
| `/leaderboard`      | **Leaderboard** — Peringkat siswa berdasarkan XP, badge terkumpul, dan jumlah quest diselesaikan                                                                       | STUDENT                  |
| `/profile`          | **Profil Pribadi** — Informasi akun, statistik belajar, koleksi badge/achievement, pengaturan akun                                                                     | STUDENT, EDUCATOR        |
| `/settings`         | **Pengaturan Akun** — Ubah password, notifikasi, preferensi bahasa, koneksi hardware                                                                                   | STUDENT, EDUCATOR        |

### Halaman Terproteksi — Educator (Protected Routes)

| Rute                            | Deskripsi                                                                                                                | Akses    |
| :------------------------------ | :----------------------------------------------------------------------------------------------------------------------- | :------- |
| `/educator/dashboard`         | **Dashboard Analitik Educator** — Ringkasan performa kelas, grafik ketuntasan belajar, siswa yang butuh perhatian | EDUCATOR |
| `/educator/classes`           | **Manajemen Kelas** — Daftar kelas, tambah/hapus siswa, lihat progres per kelas                                   | EDUCATOR |
| `/educator/classes/:class-id` | **Detail Kelas** — Daftar siswa dalam kelas, statistik individu dan agregat                                       | EDUCATOR |
| `/educator/assignments`       | **Penugasan Quest** — Assign quest tertentu ke kelas/siswa, set deadline                                          | EDUCATOR |
| `/educator/reports`           | **Laporan & Ekspor** — Generate laporan PDF, integrasi ekspor ke LMS (CSV/API)                                    | EDUCATOR |

### Halaman Terproteksi Super — Admin (Protected Routes)

| Rute                    | Deskripsi                                                                                                    | Akses |
| :---------------------- | :----------------------------------------------------------------------------------------------------------- | :---- |
| `/admin/dashboard`    | **Dashboard Admin** — Overview seluruh platform: total users, institusi aktif, quest terpopuler       | ADMIN |
| `/admin/users`        | **Manajemen Pengguna** — CRUD semua akun (Student, Educator, Admin), reset password, suspend/activate | ADMIN |
| `/admin/institutions` | **Manajemen Institusi** — Kelola institusi mitra (kampus/sekolah), konfigurasi lisensi B2B            | ADMIN |
| `/admin/content`      | **Manajemen Konten** — CRUD modul quest/materi pembelajaran, unggah aset 3D, kelola level & badge     | ADMIN |
| `/admin/settings`     | **Pengaturan Sistem** — Konfigurasi global (rate limit, maintenance mode, API keys hardware)          | ADMIN |

---

## 4. SPESIFIKASI FITUR DETAIL (MENGGUNAKAN USER STORY & ACCEPTANCE CRITERIA)

> **Format Kaku untuk AI:** Duplikat struktur di bawah ini untuk setiap fitur. Format *Given-When-Then* mencegah AI menulis kode di luar ekspektasi (berhalusinasi).

---

### Fitur ID: F-01 — Autentikasi Pengguna (Login, Register, Logout)

**User Story:** Sebagai **GUEST**, saya ingin **mendaftarkan akun baru dan login ke platform** sehingga **saya dapat mengakses fitur pembelajaran interaktif dan dashboard pribadi saya**.

**Aturan Bisnis (Business Rules):**

1. Email tidak boleh duplikat di database; setiap email hanya bisa terasosiasi dengan satu akun.
2. Password minimal 8 karakter, mengandung huruf besar, huruf kecil, dan angka.
3. Password disimpan di database dalam bentuk hash (bcrypt, minimum 10 salt rounds).
4. Sesi login menggunakan JWT access token (expired: 15 menit) dan refresh token (expired: 7 hari) dengan mekanisme rotation.
5. Setelah registrasi, akun berstatus aktif secara langsung (tanpa verifikasi email untuk MVP).
6. Role default saat registrasi mandiri adalah `STUDENT`. Role `EDUCATOR` diberikan oleh `ADMIN` melalui panel admin.

**Kriteria Penerimaan (Acceptance Criteria — Gherkin Format):**

**Skenario 1: Berhasil Register**

- **Given:** Pengguna berada di halaman `/register` dan belum terautentikasi.
- **When:** Pengguna mengisi nama lengkap, email yang belum terdaftar, dan password yang memenuhi kriteria, lalu menekan tombol "Daftar".
- **Then:** Sistem membuat akun baru dengan role `STUDENT`, membuat session JWT, dan mengalihkan pengguna ke rute `/dashboard` dengan pesan selamat datang.

**Skenario 2: Gagal Register karena Email Duplikat**

- **Given:** Pengguna berada di halaman `/register`.
- **When:** Pengguna mengisi email yang sudah terdaftar di database, lalu menekan tombol "Daftar".
- **Then:** Sistem menolak permintaan dan menampilkan pesan error: "Email sudah terdaftar. Silakan gunakan email lain atau login."

**Skenario 3: Berhasil Login**

- **Given:** Pengguna berada di halaman `/login` dan belum terautentikasi.
- **When:** Pengguna memasukkan email dan password yang valid, lalu menekan tombol "Masuk".
- **Then:** Sistem memvalidasi kredensial, membuat session JWT (access + refresh token), dan mengalihkan pengguna ke rute `/dashboard`.

**Skenario 4: Gagal Login karena Kredensial Salah**

- **Given:** Pengguna berada di halaman `/login`.
- **When:** Pengguna memasukkan email yang tidak terdaftar atau password yang salah, lalu menekan tombol "Masuk".
- **Then:** Sistem menolak permintaan dan menampilkan pesan error generic: "Kredensial yang Anda masukkan salah." demi alasan keamanan (tidak membedakan email salah atau password salah).

**Skenario 5: Logout**

- **Given:** Pengguna sedang terautentikasi di halaman manapun.
- **When:** Pengguna menekan tombol "Keluar" di navbar/sidebar.
- **Then:** Sistem menghapus session JWT (menghapus cookie), menginvalidasi refresh token di server, dan mengalihkan pengguna ke halaman `/login`.

**Kebutuhan UI/UX & Komponen Website:**

- Layout form harus centered secara vertikal dan horizontal, responsif (mobile-first).
- Input menggunakan komponen custom yang konsisten dengan design system Tactilabs (border `#10375C`, focus ring `#00A29A`).
- Tombol submit menampilkan state loading (spinner) saat API memproses request.
- Transisi halaman menggunakan fade-in animation (Framer Motion).
- Halaman login/register memiliki ilustrasi/dekorasi bertema sirkuit (electron flow pattern) di sisi kiri (desktop) sebagai visual branding.

---

### Fitur ID: F-02 — Landing Page Publik

**User Story:** Sebagai **GUEST**, saya ingin **melihat halaman utama website Tactilabs yang informatif dan menarik** sehingga **saya memahami apa itu Tactilabs, manfaatnya, dan tertarik untuk mendaftar atau menghubungi tim untuk kemitraan**.

**Aturan Bisnis (Business Rules):**

1. Landing page harus memuat semua informasi kunci tanpa harus login.
2. CTA (Call-to-Action) utama mengarah ke halaman `/register` (untuk individu) dan `/contact` (untuk institusi).
3. Semua aset gambar/video harus dioptimasi (WebP/AVIF, lazy loading).
4. Halaman harus skor 90+ di Google Lighthouse (Performance, Accessibility, SEO).

**Kriteria Penerimaan (Acceptance Criteria — Gherkin Format):**

**Skenario 1: Melihat Landing Page**

- **Given:** Pengguna (siapa saja) mengakses URL root `/`.
- **When:** Halaman selesai dimuat.
- **Then:** Pengguna melihat secara berurutan: (1) Hero Section dengan headline, tagline "Empowering the Next Generation of Hardware Pioneers through Phygital Learning", video/animasi demo produk, dan tombol CTA "Mulai Belajar"; (2) Section "Masalah" yang menjelaskan 3 problem utama; (3) Section "Solusi / Fitur Utama" yang menampilkan 3 pilar produk (TactiBlocks, TactiApp, Dashboard Analitik) dengan ikon/ilustrasi; (4) Section "Cara Kerja" (How It Works) step-by-step; (5) Section "Testimoni / Social Proof"; (6) Section "Pricing" ringkas dengan link ke halaman `/pricing`; (7) Footer dengan navigasi, kontak, dan social media links.

**Skenario 2: Klik CTA Hero**

- **Given:** Pengguna berada di Landing Page dan melihat Hero Section.
- **When:** Pengguna menekan tombol CTA "Mulai Belajar".
- **Then:** Pengguna diarahkan ke halaman `/register`.

**Skenario 3: Navigasi Responsif**

- **Given:** Pengguna mengakses Landing Page dari perangkat mobile (viewport < 768px).
- **When:** Halaman dimuat.
- **Then:** Navbar berubah menjadi hamburger menu, semua section ditampilkan dalam layout single-column yang readable, dan semua gambar/video responsif.

**Kebutuhan UI/UX & Komponen Website:**

- **Design Theme:** Dark mode utama menggunakan warna `#10375C` (Tacti Dark Blue) sebagai background, aksen `#00A29A` (Tacti Cyan/Teal), teks putih `#FFFFFF` dan off-white `#F4F6F9`.
- **Glassmorphism:** Kartu fitur dan section informasi menggunakan efek glassmorphism (background blur, border semi-transparan).
- **Animasi:** Scroll-triggered animations pada tiap section (fade-up, slide-in). Partikel/garis bergerak (particle effect) yang menyerupai aliran elektron sebagai dekorasi background hero.
- **Tipografi:** Google Fonts — Montserrat (heading, Bold 700) dan Inter (body text, Regular 400/Light 300).
- **Navbar:** Sticky/fixed di atas, transparan saat di hero lalu berubah solid saat scroll, berisi logo Tactilabs, link navigasi (Beranda, Fitur, Harga, Tentang, Kontak), dan tombol Login/Daftar.

---

### Fitur ID: F-03 — Lab Sirkuit Virtual (Visualisasi 3D Aliran Elektron Real-Time)

**User Story:** Sebagai **STUDENT**, saya ingin **melihat visualisasi 3D aliran elektron yang bergerak secara real-time sesuai sirkuit fisik TactiBlocks yang saya rangkai** sehingga **saya dapat memahami konsep arus, tegangan, dan hambatan secara visual dan intuitif, bukan hanya teori abstrak**.

**Aturan Bisnis (Business Rules):**

1. Visualisasi 3D menggunakan Three.js dan merender skema sirkuit sebagai node (komponen) dan edge (koneksi) yang interaktif.
2. Data sensor dari hardware ESP32 (tegangan via INA219 dan identifikasi komponen via ADC detection) dikirim ke TactiApp melalui WebSocket (Socket.IO) secara real-time.
3. Partikel aliran elektron (warna cyan/hijau neon berpendar) bergerak melalui jalur sirkuit dengan kecepatan proporsional terhadap besaran arus yang terukur.
4. Jika sirkuit terputus (open circuit), aliran partikel berhenti dan ditampilkan indikator visual peringatan.
5. Panel informasi menampilkan pembacaan sensor secara numerik: Tegangan (V), Arus (mA), dan Daya (mW).
6. Student dapat melakukan zoom, pan, dan rotasi pada canvas 3D.
7. Jika hardware tidak terhubung (offline mode), tampilkan mode simulasi dengan data dummy interaktif agar student tetap bisa belajar.

**Kriteria Penerimaan (Acceptance Criteria — Gherkin Format):**

**Skenario 1: Membuka Lab Sirkuit dengan Hardware Terhubung**

- **Given:** Student sudah login dan hardware TactiBlocks (ESP32) terhubung ke jaringan WiFi dan WebSocket aktif.
- **When:** Student membuka halaman `/lab`.
- **Then:** Canvas 3D menampilkan skema sirkuit sesuai komponen yang terdeteksi oleh ESP32 (via ADC detection). Partikel elektron berwarna cyan bergerak mengalir melalui jalur sirkuit. Panel samping menampilkan nilai tegangan, arus, dan daya secara real-time yang diperbarui setiap 100ms.

**Skenario 2: Menambah/Melepas Komponen Fisik**

- **Given:** Student berada di halaman `/lab` dengan hardware terhubung.
- **When:** Student memasang atau melepas satu blok komponen TactiBlocks secara fisik.
- **Then:** Dalam waktu < 500ms, visualisasi 3D di layar diperbarui secara otomatis: komponen baru muncul/menghilang dari skema, dan aliran elektron menyesuaikan jalur serta kecepatannya berdasarkan pembacaan sensor terbaru.

**Skenario 3: Mode Offline (Simulasi)**

- **Given:** Student sudah login tetapi hardware TactiBlocks tidak terhubung.
- **When:** Student membuka halaman `/lab`.
- **Then:** Sistem menampilkan notifikasi "Hardware tidak terdeteksi — Mode Simulasi aktif." Canvas 3D memuat sirkuit contoh (preset) dengan data dummy. Student dapat mengubah parameter (menambah/hapus komponen virtual) dan melihat visualisasi simulasi aliran elektron.

**Skenario 4: Interaksi dengan Canvas 3D**

- **Given:** Student berada di halaman `/lab` dengan visualisasi aktif.
- **When:** Student melakukan gesture scroll (zoom), drag (pan), atau right-click drag (rotasi) pada canvas 3D.
- **Then:** Kamera Three.js merespons secara smooth (60fps) tanpa lag, memungkinkan eksplorasi visual sirkuit dari berbagai sudut pandang.

**Kebutuhan UI/UX & Komponen Website:**

- **Layout:** Full-width canvas 3D di area utama (80% viewport), panel informasi di sidebar kanan (20%) yang collapsible di mobile.
- **Tema Visual Canvas:** Background canvas gelap (dark blue `#0A1929`), node komponen berupa kotak 3D matte dark blue dengan simbol putih, edge/kabel sebagai garis neon `#00A29A`, partikel elektron berpendar cyan.
- **Panel Sensor:** Menampilkan gauge/angka digital (font monospace) untuk Tegangan (V), Arus (mA), Daya (mW) dengan warna indikator hijau (normal), kuning (peringatan), merah (bahaya/short circuit).
- **Status Koneksi:** Indikator koneksi WebSocket (titik hijau = terhubung, merah = terputus) di pojok kiri atas canvas.

---

### Fitur ID: F-04 — Sistem Quest / Gamifikasi Pembelajaran

**User Story:** Sebagai **STUDENT**, saya ingin **menyelesaikan quest (misi/tantangan) sirkuit yang terstruktur dan bergamifikasi** sehingga **proses belajar elektronika menjadi menyenangkan, terarah, dan memotivasi saya untuk terus belajar melalui reward (XP, badge, level-up)**.

**Aturan Bisnis (Business Rules):**

1. Setiap quest memiliki: judul, deskripsi, level kesulitan (Beginner / Intermediate / Advanced), topik (Arus, Tegangan, Hambatan, Gerbang Logika, dll.), prasyarat quest sebelumnya, poin XP reward, dan badge terkait.
2. Quest diselesaikan dengan merangkai sirkuit yang benar pada TactiBlocks fisik (divalidasi oleh sensor ESP32) ATAU melalui mode simulasi virtual.
3. Validasi keberhasilan quest menggunakan kriteria terukur (misal: "arus rangkaian harus berada di rentang 15-25 mA" atau "LED harus menyala").
4. Progres quest disimpan secara persistent di database.
5. Sistem XP dan leveling: setiap quest memberikan XP, akumulasi XP meningkatkan level Student.
6. Badge diberikan untuk pencapaian milestone (misal: "Rangkai 10 Sirkuit", "Kuasai Hukum Ohm", "Master Gerbang Logika").

**Kriteria Penerimaan (Acceptance Criteria — Gherkin Format):**

**Skenario 1: Melihat Daftar Quest**

- **Given:** Student sudah login dan berada di halaman `/quests`.
- **When:** Halaman dimuat.
- **Then:** Ditampilkan daftar quest dalam format grid/card, masing-masing menunjukkan judul, ikon topik, level kesulitan (badge warna), XP reward, dan status (Terkunci / Belum Dimulai / Sedang Dikerjakan / Selesai). Quest yang terkunci (belum memenuhi prasyarat) ditampilkan dengan overlay grayscale.

**Skenario 2: Memulai dan Menyelesaikan Quest**

- **Given:** Student berada di halaman `/lab/:quest-id` dengan quest tertentu dimuat.
- **When:** Student merangkai sirkuit fisik sesuai instruksi quest, dan sensor ESP32 mendeteksi bahwa kriteria keberhasilan terpenuhi (misal: arus berada di rentang target).
- **Then:** Sistem menampilkan animasi celebration (confetti/particle burst), memberikan XP reward, menyimpan status quest sebagai "Selesai" di database, dan menampilkan tombol "Quest Selanjutnya".

**Skenario 3: Gagal Memenuhi Kriteria Quest**

- **Given:** Student berada di halaman `/lab/:quest-id`.
- **When:** Student merangkai sirkuit tetapi parameter sensor tidak memenuhi kriteria keberhasilan.
- **Then:** Sistem menampilkan feedback berupa hint/petunjuk (misal: "Arus terlalu rendah. Coba periksa apakah semua blok terhubung dengan benar.") tanpa langsung memberikan jawaban. Student dapat mencoba ulang tanpa batas.

**Kebutuhan UI/UX & Komponen Website:**

- Card quest menggunakan glassmorphism dengan gradasi warna sesuai level kesulitan (hijau = Beginner, kuning = Intermediate, merah = Advanced).
- Animasi micro-interaction pada hover card (scale up + glow effect).
- Progress bar XP di header/navbar menampilkan level saat ini dan XP menuju level selanjutnya.
- Animasi confetti/particle burst saat quest berhasil diselesaikan.

---

### Fitur ID: F-05 — Dashboard Analitik Educator (B2B)

**User Story:** Sebagai **EDUCATOR**, saya ingin **memantau progres belajar seluruh siswa dalam kelas saya melalui dashboard analitik visual** sehingga **saya dapat mengidentifikasi siswa yang membutuhkan bimbingan tambahan dan melacak ketuntasan belajar secara efisien tanpa input manual**.

**Aturan Bisnis (Business Rules):**

1. Educator hanya dapat melihat data siswa yang tergabung di kelas yang ia kelola.
2. Dashboard menampilkan data agregat: rata-rata progres kelas, distribusi level siswa, quest paling banyak gagal, dan tren waktu pengerjaan.
3. Data diperbarui secara near-real-time (polling interval 30 detik atau WebSocket push).
4. Educator dapat mengekspor laporan dalam format CSV dan PDF.
5. Educator dapat menugaskan quest tertentu ke seluruh kelas atau siswa individual dengan deadline.

**Kriteria Penerimaan (Acceptance Criteria — Gherkin Format):**

**Skenario 1: Melihat Overview Kelas**

- **Given:** Educator sudah login dan berada di halaman `/educator/dashboard`.
- **When:** Halaman dimuat.
- **Then:** Dashboard menampilkan: (1) Ringkasan jumlah siswa aktif vs total, (2) Grafik bar chart progres rata-rata per kelas, (3) Tabel "Siswa Perlu Perhatian" (progres < 30%), (4) Quest paling sering gagal (pie chart).

**Skenario 2: Assign Quest ke Kelas**

- **Given:** Educator berada di halaman `/educator/assignments`.
- **When:** Educator memilih kelas, memilih quest dari dropdown, menetapkan deadline, dan menekan tombol "Tugaskan".
- **Then:** Sistem membuat assignment baru di database, dan semua siswa dalam kelas menerima notifikasi di dashboard mereka tentang quest baru yang ditugaskan.

**Skenario 3: Ekspor Laporan**

- **Given:** Educator berada di halaman `/educator/reports`.
- **When:** Educator memilih kelas dan rentang tanggal, lalu menekan tombol "Ekspor PDF".
- **Then:** Sistem men-generate file PDF berisi tabel progres siswa (nama, email, quest diselesaikan, XP, level, persentase ketuntasan) dan grafik ringkasan, lalu mengunduhnya ke perangkat Educator.

**Kebutuhan UI/UX & Komponen Website:**

- Layout dashboard menggunakan grid cards yang responsif.
- Grafik menggunakan library Chart.js atau Recharts dengan tema warna Tactilabs (dark blue, cyan, off-white).
- Tabel data menggunakan pagination, sorting, dan search/filter.
- Dark mode konsisten dengan desain keseluruhan platform.

---

### Fitur ID: F-06 — Profil Pengguna & Koleksi Achievement

**User Story:** Sebagai **STUDENT**, saya ingin **melihat profil pribadi saya yang menampilkan statistik belajar, level, XP, dan koleksi badge yang telah saya peroleh** sehingga **saya merasa termotivasi dan bangga dengan pencapaian belajar saya**.

**Aturan Bisnis (Business Rules):**

1. Profil menampilkan: avatar, nama, email, institusi, level, total XP, jumlah quest selesai, jumlah badge, dan tanggal bergabung.
2. Koleksi badge ditampilkan dalam grid visual dengan ikon unik per badge. Badge yang belum diperoleh ditampilkan dalam bentuk silhouette (locked).
3. Student dapat mengedit informasi profil (nama, avatar) tetapi tidak dapat mengubah email atau role.

**Kriteria Penerimaan (Acceptance Criteria — Gherkin Format):**

**Skenario 1: Melihat Profil**

- **Given:** Student sudah login.
- **When:** Student membuka halaman `/profile`.
- **Then:** Halaman menampilkan card profil dengan avatar, nama, level & XP bar, statistik ringkas (quest selesai, badge total), dan grid koleksi badge.

**Skenario 2: Mengedit Profil**

- **Given:** Student berada di halaman `/profile`.
- **When:** Student menekan tombol "Edit Profil", mengubah nama, mengunggah avatar baru, dan menekan "Simpan".
- **Then:** Sistem memperbarui data di database, menampilkan notifikasi sukses "Profil berhasil diperbarui", dan menampilkan data terbaru.

**Kebutuhan UI/UX & Komponen Website:**

- Card profil menggunakan glassmorphism dengan avatar besar di tengah atas.
- XP bar menggunakan gradient animasi (dark blue → cyan) yang bergerak.
- Grid badge menggunakan ikon 3D kecil dengan efek glow saat hover.
- Animasi reveal saat badge baru diperoleh.

---

### Fitur ID: F-07 — Leaderboard

**User Story:** Sebagai **STUDENT**, saya ingin **melihat peringkat saya dibandingkan siswa lain di platform** sehingga **saya termotivasi untuk terus belajar dan bersaing secara sehat**.

**Aturan Bisnis (Business Rules):**

1. Leaderboard menampilkan peringkat berdasarkan total XP (default), jumlah quest selesai, atau jumlah badge.
2. Filter berdasarkan: Global (semua pengguna), Per Institusi, atau Per Kelas.
3. Data leaderboard di-cache dan diperbarui setiap 5 menit.
4. Posisi student yang sedang login di-highlight secara visual (highlighted row).

**Kriteria Penerimaan (Acceptance Criteria — Gherkin Format):**

**Skenario 1: Melihat Leaderboard Global**

- **Given:** Student sudah login dan membuka halaman `/leaderboard`.
- **When:** Halaman dimuat.
- **Then:** Ditampilkan tabel leaderboard dengan kolom: Peringkat, Avatar, Nama, Institusi, Level, Total XP. Top 3 ditampilkan dengan podium visual (emas, perak, perunggu). Baris milik student yang login di-highlight dengan border cyan.

**Kebutuhan UI/UX & Komponen Website:**

- Top 3 ditampilkan sebagai podium card besar di atas tabel.
- Tabel menggunakan alternating row colors dan hover highlight.
- Filter (Global/Institusi/Kelas) menggunakan segmented control/tabs di atas tabel.
- Animasi counter saat halaman pertama kali dimuat (angka XP naik secara increment).

---

### Fitur ID: F-08 — Panel Administrasi (Admin Panel)

**User Story:** Sebagai **ADMIN**, saya ingin **mengelola seluruh pengguna, institusi mitra, dan konten modul pembelajaran dari satu dashboard terpusat** sehingga **saya dapat mengoperasikan platform secara efisien dan memastikan semua data terkelola dengan baik**.

**Aturan Bisnis (Business Rules):**

1. Admin dapat melakukan CRUD (Create, Read, Update, Delete) pada entitas: Users, Institutions, Quests, Badges.
2. Admin dapat mengubah role pengguna (STUDENT ↔ EDUCATOR).
3. Admin dapat suspend/activate akun pengguna.
4. Admin dapat melihat statistik keseluruhan platform (total users, active users, institusi, quest completion rate).
5. Akses ke rute `/admin/*` hanya tersedia untuk role `ADMIN`. Upaya akses oleh role lain akan di-redirect ke `/dashboard` dengan pesan "Akses ditolak".

**Kriteria Penerimaan (Acceptance Criteria — Gherkin Format):**

**Skenario 1: Melihat Dashboard Admin**

- **Given:** Admin sudah login dan membuka halaman `/admin/dashboard`.
- **When:** Halaman dimuat.
- **Then:** Dashboard menampilkan stat cards: Total Users, Total Institutions, Total Quests, Average Completion Rate. Di bawahnya terdapat grafik tren pengguna baru per bulan.

**Skenario 2: Mengelola Pengguna**

- **Given:** Admin berada di halaman `/admin/users`.
- **When:** Admin mencari pengguna berdasarkan email, lalu menekan tombol "Edit" pada row pengguna.
- **Then:** Modal/dialog edit terbuka menampilkan form: nama, email (read-only), role (dropdown: STUDENT/EDUCATOR/ADMIN), status (Active/Suspended). Admin dapat mengubah role dan status, lalu menekan "Simpan" untuk memperbarui data.

**Skenario 3: Akses Ditolak untuk Non-Admin**

- **Given:** Pengguna dengan role `STUDENT` atau `EDUCATOR` sudah login.
- **When:** Pengguna mencoba mengakses rute `/admin/dashboard` secara langsung (mengetik URL).
- **Then:** Sistem memeriksa role, menolak akses, dan mengalihkan pengguna ke `/dashboard` dengan notifikasi toast: "Anda tidak memiliki izin untuk mengakses halaman ini."

**Kebutuhan UI/UX & Komponen Website:**

- Layout admin menggunakan sidebar navigation (collapsible) di kiri dengan ikon menu.
- Tabel data menggunakan DataTable dengan fitur: search, filter, sorting, pagination, dan bulk action.
- Warna tema admin tetap konsisten dark mode Tactilabs.
- Konfirmasi dialog untuk aksi destruktif (delete, suspend) menggunakan modal dengan input konfirmasi.

---

## 5. SKEMA DATA & ENTITAS DATABASE (DATA MODEL)

Gunakan format tabel ini untuk mendefinisikan struktur tabel database agar AI dapat menghasilkan file migrasi (Prisma schema) secara instan.

---

### Entitas 1: User

| Field Name     | Data Type     | Constraints                             | Description                                          |
| :------------- | :------------ | :-------------------------------------- | :--------------------------------------------------- |
| id             | String (UUID) | Primary Key, Unique                     | ID unik entitas pengguna                             |
| email          | String        | Unique, Required                        | Alamat email untuk login                             |
| password       | String        | Required                                | Password yang sudah di-hash (bcrypt, 10 salt rounds) |
| name           | String        | Required                                | Nama lengkap pengguna                                |
| avatar_url     | String        | Nullable                                | URL foto profil pengguna                             |
| role           | Enum          | Default: 'STUDENT'                      | Nilai: 'STUDENT'\| 'EDUCATOR' \| 'ADMIN'             |
| status         | Enum          | Default: 'ACTIVE'                       | Nilai: 'ACTIVE'\| 'SUSPENDED'                        |
| institution_id | String (UUID) | Foreign Key → Institution.id, Nullable | Institusi tempat pengguna terdaftar                  |
| xp             | Integer       | Default: 0                              | Total poin pengalaman (XP) akumulatif                |
| level          | Integer       | Default: 1                              | Level pengguna saat ini (dihitung dari XP)           |
| created_at     | DateTime      | Default: now()                          | Waktu pembuatan akun                                 |
| updated_at     | DateTime      | Auto-update                             | Waktu terakhir data diubah                           |

---

### Entitas 2: Institution

| Field Name         | Data Type     | Constraints         | Description                                                        |
| :----------------- | :------------ | :------------------ | :----------------------------------------------------------------- |
| id                 | String (UUID) | Primary Key, Unique | ID unik institusi                                                  |
| name               | String        | Required, Unique    | Nama institusi (misal: "Telkom University")                        |
| type               | Enum          | Required            | Nilai: 'UNIVERSITY'\| 'HIGH_SCHOOL' \| 'VOCATIONAL' \| 'CORPORATE' |
| license_type       | Enum          | Default: 'FREE'     | Nilai: 'FREE'\| 'BASIC' \| 'PREMIUM'                               |
| license_expires_at | DateTime      | Nullable            | Tanggal kedaluwarsa lisensi B2B                                    |
| max_students       | Integer       | Default: 50         | Batas maksimal student dalam lisensi                               |
| logo_url           | String        | Nullable            | URL logo institusi                                                 |
| created_at         | DateTime      | Default: now()      | Waktu pembuatan data                                               |
| updated_at         | DateTime      | Auto-update         | Waktu terakhir data diubah                                         |

---

### Entitas 3: Class

| Field Name     | Data Type     | Constraints                             | Description                                       |
| :------------- | :------------ | :-------------------------------------- | :------------------------------------------------ |
| id             | String (UUID) | Primary Key, Unique                     | ID unik kelas                                     |
| name           | String        | Required                                | Nama kelas (misal: "Praktikum Fisika Dasar A")    |
| educator_id    | String (UUID) | Foreign Key → User.id, Required        | ID Educator yang mengelola kelas                  |
| institution_id | String (UUID) | Foreign Key → Institution.id, Required | ID Institusi pemilik kelas                        |
| invite_code    | String        | Unique, Required                        | Kode undangan unik untuk siswa bergabung ke kelas |
| created_at     | DateTime      | Default: now()                          | Waktu pembuatan kelas                             |
| updated_at     | DateTime      | Auto-update                             | Waktu terakhir data diubah                        |

---

### Entitas 4: ClassMember

| Field Name | Data Type     | Constraints                       | Description                    |
| :--------- | :------------ | :-------------------------------- | :----------------------------- |
| id         | String (UUID) | Primary Key, Unique               | ID unik membership             |
| class_id   | String (UUID) | Foreign Key → Class.id, Required | ID Kelas                       |
| student_id | String (UUID) | Foreign Key → User.id, Required  | ID Student                     |
| joined_at  | DateTime      | Default: now()                    | Waktu siswa bergabung ke kelas |

> **Constraint:** Composite Unique pada (class_id, student_id) — satu siswa hanya bisa bergabung sekali di satu kelas.

---

### Entitas 5: Quest

| Field Name            | Data Type     | Constraints                       | Description                                                                                                         |
| :-------------------- | :------------ | :-------------------------------- | :------------------------------------------------------------------------------------------------------------------ |
| id                    | String (UUID) | Primary Key, Unique               | ID unik quest                                                                                                       |
| title                 | String        | Required                          | Judul quest (misal: "Hukum Ohm: Rangkaian Seri")                                                                    |
| description           | Text          | Required                          | Deskripsi lengkap quest                                                                                             |
| topic                 | Enum          | Required                          | Nilai: 'CURRENT'\| 'VOLTAGE' \| 'RESISTANCE' \| 'OHM_LAW' \| 'LOGIC_GATE' \| 'TRANSISTOR' \| 'CAPACITOR' \| 'MIXED' |
| difficulty            | Enum          | Required                          | Nilai: 'BEGINNER'\| 'INTERMEDIATE' \| 'ADVANCED'                                                                    |
| xp_reward             | Integer       | Required                          | Jumlah XP yang diberikan saat quest berhasil diselesaikan                                                           |
| prerequisite_quest_id | String (UUID) | Foreign Key → Quest.id, Nullable | Quest yang harus diselesaikan terlebih dahulu                                                                       |
| circuit_config        | JSON          | Required                          | Konfigurasi sirkuit target (komponen yang harus ada, parameter target: rentang arus/tegangan)                       |
| instructions          | JSON          | Required                          | Array langkah-langkah instruksi quest untuk ditampilkan ke student                                                  |
| hint                  | Text          | Nullable                          | Petunjuk bantuan jika student gagal                                                                                 |
| is_premium            | Boolean       | Default: false                    | Apakah quest ini hanya tersedia untuk subscriber premium                                                            |
| order_index           | Integer       | Required                          | Urutan quest dalam curriculum/daftar                                                                                |
| created_at            | DateTime      | Default: now()                    | Waktu pembuatan quest                                                                                               |
| updated_at            | DateTime      | Auto-update                       | Waktu terakhir data diubah                                                                                          |

---

### Entitas 6: QuestProgress

| Field Name           | Data Type     | Constraints                       | Description                                                                  |
| :------------------- | :------------ | :-------------------------------- | :--------------------------------------------------------------------------- |
| id                   | String (UUID) | Primary Key, Unique               | ID unik progress                                                             |
| student_id           | String (UUID) | Foreign Key → User.id, Required  | ID Student yang mengerjakan quest                                            |
| quest_id             | String (UUID) | Foreign Key → Quest.id, Required | ID Quest yang dikerjakan                                                     |
| status               | Enum          | Default: 'NOT_STARTED'            | Nilai: 'NOT_STARTED'\| 'IN_PROGRESS' \| 'COMPLETED' \| 'FAILED'              |
| attempts             | Integer       | Default: 0                        | Jumlah percobaan yang dilakukan                                              |
| completed_at         | DateTime      | Nullable                          | Waktu quest berhasil diselesaikan                                            |
| time_spent_seconds   | Integer       | Default: 0                        | Total durasi pengerjaan (akumulatif semua attempt) dalam detik               |
| sensor_data_snapshot | JSON          | Nullable                          | Snapshot data sensor terakhir saat quest berhasil diselesaikan (untuk audit) |
| created_at           | DateTime      | Default: now()                    | Waktu pertama kali quest dimulai                                             |
| updated_at           | DateTime      | Auto-update                       | Waktu terakhir data diubah                                                   |

> **Constraint:** Composite Unique pada (student_id, quest_id) — satu siswa hanya memiliki satu record progres per quest.

---

### Entitas 7: Badge

| Field Name     | Data Type     | Constraints         | Description                                                                                       |
| :------------- | :------------ | :------------------ | :------------------------------------------------------------------------------------------------ |
| id             | String (UUID) | Primary Key, Unique | ID unik badge                                                                                     |
| name           | String        | Required, Unique    | Nama badge (misal: "Ohm Master")                                                                  |
| description    | String        | Required            | Deskripsi kriteria perolehan badge                                                                |
| icon_url       | String        | Required            | URL ikon/gambar badge                                                                             |
| criteria_type  | Enum          | Required            | Nilai: 'QUEST_COUNT'\| 'TOPIC_MASTERY' \| 'STREAK' \| 'SPEED' \| 'SPECIAL'                        |
| criteria_value | JSON          | Required            | Kriteria spesifik (misal:`{"quest_count": 10}` atau `{"topic": "OHM_LAW", "quest_count": 5}`) |
| created_at     | DateTime      | Default: now()      | Waktu pembuatan badge                                                                             |

---

### Entitas 8: UserBadge

| Field Name | Data Type     | Constraints                       | Description                       |
| :--------- | :------------ | :-------------------------------- | :-------------------------------- |
| id         | String (UUID) | Primary Key, Unique               | ID unik entitas                   |
| user_id    | String (UUID) | Foreign Key → User.id, Required  | ID pengguna yang memperoleh badge |
| badge_id   | String (UUID) | Foreign Key → Badge.id, Required | ID badge yang diperoleh           |
| earned_at  | DateTime      | Default: now()                    | Waktu badge diperoleh             |

> **Constraint:** Composite Unique pada (user_id, badge_id) — satu pengguna hanya mendapatkan satu badge yang sama satu kali.

---

### Entitas 9: Assignment

| Field Name  | Data Type     | Constraints                       | Description                        |
| :---------- | :------------ | :-------------------------------- | :--------------------------------- |
| id          | String (UUID) | Primary Key, Unique               | ID unik assignment                 |
| class_id    | String (UUID) | Foreign Key → Class.id, Required | ID kelas yang ditugaskan           |
| quest_id    | String (UUID) | Foreign Key → Quest.id, Required | ID quest yang ditugaskan           |
| educator_id | String (UUID) | Foreign Key → User.id, Required  | ID Educator yang membuat penugasan |
| deadline    | DateTime      | Required                          | Batas waktu penyelesaian           |
| created_at  | DateTime      | Default: now()                    | Waktu pembuatan penugasan          |

---

### Entitas 10: RefreshToken

| Field Name | Data Type     | Constraints                      | Description                     |
| :--------- | :------------ | :------------------------------- | :------------------------------ |
| id         | String (UUID) | Primary Key, Unique              | ID unik token                   |
| token      | String        | Unique, Required                 | Nilai refresh token (hashed)    |
| user_id    | String (UUID) | Foreign Key → User.id, Required | ID pengguna pemilik token       |
| expires_at | DateTime      | Required                         | Waktu kedaluwarsa token         |
| is_revoked | Boolean       | Default: false                   | Apakah token sudah diinvalidasi |
| created_at | DateTime      | Default: now()                   | Waktu pembuatan token           |

---

### Diagram Relasi Antar Entitas (ERD Summary)

```
User (1) ──────── (N) QuestProgress
User (1) ──────── (N) UserBadge
User (1) ──────── (N) ClassMember (as Student)
User (1) ──────── (N) Class (as Educator)
User (1) ──────── (N) Assignment (as Educator)
User (N) ──────── (1) Institution
Institution (1) ─ (N) Class
Class (1) ──────── (N) ClassMember
Class (1) ──────── (N) Assignment
Quest (1) ──────── (N) QuestProgress
Quest (1) ──────── (N) Assignment
Quest (1) ──────── (1) Quest (self-ref: prerequisite)
Badge (1) ──────── (N) UserBadge
User (1) ──────── (N) RefreshToken
```

---

## 6. BATASAN NON-FUNGSIONAL, KEAMANAN, & VALIDASI

Bagian ini bertindak sebagai penjaga gerbang (*guardrails*) keamanan dan performa agar AI tidak menulis kode yang rentan bug.

### Keamanan (Security)

1. **Validasi Input Ganda:** Semua input form wajib divalidasi di sisi klien (*frontend*) menggunakan **Zod** (schema validation) dan di sisi server (*backend*) menggunakan Zod yang sama (shared schema). Tidak ada input mentah yang langsung masuk ke query database.
2. **Proteksi Serangan Umum:**
   - **XSS (Cross-Site Scripting):** Sanitasi semua input pengguna sebelum rendering ke DOM. Gunakan `DOMPurify` jika merender konten HTML dinamis.
   - **CSRF Protection:** Implementasikan token CSRF pada semua form mutation (POST/PUT/DELETE) atau gunakan `SameSite=Strict` pada cookie.
   - **SQL Injection:** Prisma ORM secara default menggunakan parameterized queries; pastikan tidak ada raw query tanpa parameter binding.
   - **Enkripsi Data Sensitif:** Password di-hash dengan bcrypt (minimum 10 salt rounds) sebelum disimpan ke database.
3. **Rate Limiting:** Implementasikan rate limiting pada rute API sensitif:
   - Endpoint `/api/auth/login`: Maksimal **5 percobaan per menit** per IP address.
   - Endpoint `/api/auth/register`: Maksimal **3 percobaan per menit** per IP address.
   - Endpoint API lainnya: Maksimal **100 request per menit** per user.
4. **CORS (Cross-Origin Resource Sharing):** Konfigurasi CORS hanya mengizinkan origin dari domain frontend yang sah.
5. **Helmet.js:** Pasang header keamanan HTTP (X-Content-Type-Options, X-Frame-Options, Strict-Transport-Security, dll.) menggunakan Helmet.js di Express.
6. **JWT Security:** Access token disimpan di memori (JavaScript variable), refresh token disimpan di HttpOnly Secure cookie. Implementasikan refresh token rotation (setiap kali refresh digunakan, token lama diinvalidasi dan token baru diterbitkan).

### Performa (Performance)

1. **Google Lighthouse Score:** Halaman publik (Landing Page, About, Features, Pricing) harus mencapai skor minimal **90+** untuk kategori: Performance, Accessibility, dan SEO.
2. **Optimasi Media:** Semua gambar wajib menggunakan format modern (WebP/AVIF) dengan `<picture>` element fallback. Implementasikan **lazy loading** (`loading="lazy"`) untuk semua gambar di bawah fold.
3. **Code Splitting:** Implementasikan React lazy loading (`React.lazy()` + `Suspense`) untuk route-level code splitting agar initial bundle size minimal.
4. **Caching:** Gunakan HTTP cache headers yang tepat (immutable untuk static assets, no-cache untuk API responses). Implementasikan in-memory cache (Redis atau Zustand) untuk data yang jarang berubah (leaderboard, daftar quest).
5. **Three.js Performance:** Canvas 3D harus mempertahankan **60 FPS** pada perangkat mid-range. Gunakan instanced rendering untuk partikel elektron, dispose geometry/material saat komponen unmount, dan limiter render loop saat tab tidak aktif.
6. **WebSocket Efficiency:** Kirim data sensor hanya jika nilai berubah (delta encoding) untuk mengurangi traffic. Implementasikan reconnect otomatis dengan exponential backoff jika koneksi WebSocket terputus.

### Aksesibilitas (Accessibility)

1. **Standar WCAG 2.1 AA:** Struktur HTML harus semantik (`<main>`, `<nav>`, `<section>`, `<article>`, `<aside>`, `<header>`, `<footer>`) dan mendukung navigasi keyboard penuh (Tab, Enter, Escape, Arrow keys).
2. **ARIA Labels:** Semua elemen interaktif (button, link, input, modal) harus memiliki `aria-label` atau `aria-labelledby` yang deskriptif, terutama untuk ikon tanpa teks.
3. **Kontras Warna:** Rasio kontras teks minimal **4.5:1** (normal text) dan **3:1** (large text) terhadap background. Pastikan warna cyan `#00A29A` di atas dark blue `#10375C` memenuhi rasio ini.
4. **Screen Reader Friendly:** Canvas 3D (Three.js) harus memiliki `aria-label` deskriptif dan teks alternatif yang mendeskripsikan keadaan sirkuit saat ini (misal: "Sirkuit aktif: 3 komponen terhubung, arus 20mA").
5. **Focus Visible:** Semua elemen focusable harus memiliki outline/ring yang jelas saat di-focus (menggunakan `focus-visible` pseudo-class).

### Responsivitas (Responsive Design)

1. **Breakpoints:**
   - Mobile: `< 768px` (single column, hamburger menu, stacked layout)
   - Tablet: `768px – 1024px` (2-column grid, collapsible sidebar)
   - Desktop: `> 1024px` (full layout, sidebar visible, multi-column grid)
2. **Touch Friendly:** Semua tombol dan elemen interaktif memiliki minimum touch target **44x44px** (WCAG recommendation).
3. **Canvas 3D Responsif:** Canvas Three.js harus resize sesuai viewport dan mendukung gesture touch (pinch-to-zoom, swipe-to-rotate) di perangkat mobile.

---

> **Catatan Akhir:** Dokumen PRD ini merupakan satu-satunya sumber kebenaran (*single source of truth*) untuk seluruh pengembangan website TactiApp. Setiap modul kode, skema database, dan pengujian yang dihasilkan oleh AI harus merujuk kembali ke dokumen ini. Perubahan spesifikasi harus dilakukan melalui revisi versi PRD ini.
