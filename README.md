# Portal Cuti & SPK (Sistem Pendukung Keputusan)

Sistem Informasi Manajemen Cuti Karyawan yang modern dan responsif, terintegrasi penuh dengan Sistem Pendukung Keputusan (SPK) menggunakan metode **SAW (Simple Additive Weighting)**.

## 🌟 Fitur Utama
- **Dashboard Karyawan**: Pengajuan cuti, tracking kuota cuti secara real-time, dan histori pengajuan.
- **Dashboard Approver**: Manajemen persetujuan cuti yang efisien, kelola data master karyawan, dan data approver.
- **Rekomendasi Cerdas (SPK SAW)**: Sistem akan memproses dan memberikan rekomendasi "Approve" atau "Reject" secara objektif berdasarkan kriteria seperti Masa Kerja, Sisa Kuota Cuti, Durasi Cuti, dan lainnya.
- **Transparansi SPK**: Terdapat menu khusus (Matrix & Ranking) untuk menampilkan perhitungan SPK langkah demi langkah dari Matriks Keputusan hingga nilai Peringkat akhir.
- **Sistem Autentikasi**: Fitur Login yang aman dengan pemisahan hak akses (Role-Based Access Control) antara Karyawan dan Approver.
- **Desain UI/UX Modern**: Antarmuka pengguna bergaya elegan dengan dukungan penuh pergantian tema Gelap (Dark Mode) dan Terang (Light Mode).

## 🚀 Teknologi yang Digunakan
- **Frontend**: React.js, Vite, React Router DOM, Custom CSS Variables
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Koneksi**: RESTful API (`fetch` API)

## 📸 Screenshots Aplikasi

### 1. Halaman Autentikasi
Tampilan minimalis untuk akses Karyawan dan Approver.
![Login Page](docs/01_Login.png)

### 2. Panel Karyawan
Karyawan dapat melihat sisa cuti tahunannya dan mengajukan tanggal cuti baru. Terdapat perbedaan warna sidebar (Ungu) khusus untuk Karyawan.
![Status Cuti Karyawan](docs/02_Karyawan_Status.png)
![Pengajuan Baru](docs/03_Karyawan_Pengajuan.png)
![Histori Karyawan](docs/04_Karyawan_Histori.png)

### 3. Panel Approver (HR/Manajer)
Approver disambut dengan ringkasan permohonan cuti dan top ranking prioritas harian.
![Beranda Approver](docs/05_Approver_Beranda.png)
![Persetujuan Cuti](docs/06_Approver_Persetujuan.png)
![Histori Approval](docs/07_Approver_Histori.png)

### 4. Manajemen Master Data
Mengelola akun dan jatah cuti karyawan serta pengaturan rekan Approver.
![Data Karyawan](docs/08_Approver_Data_Karyawan.png)
![Data Approver](docs/09_Approver_Data_Approver.png)

### 5. Konfigurasi & Analisis SPK (SAW)
Menampilkan secara gamblang bobot kriteria, nilai alternatif, tabel matriks normalisasi, hingga skor kecocokan akhir.
![Kriteria & Bobot](docs/10_Approver_Kriteria.png)
![Data Alternatif](docs/11_Approver_Alternatif.png)
![Table Matrix](docs/12_Approver_Matrix.png)
![Table Ranking](docs/13_Approver_Ranking.png)

### 6. Dukungan Mode Gelap (Dark Mode)
Aplikasi didesain untuk kenyamanan maksimal di kondisi minim cahaya.
![Dark Mode - Ranking](docs/14_Approver_Ranking_Dark.png)

---
*Dibuat untuk mempermudah alur birokrasi cuti perusahaan dan membantu manajemen mengambil keputusan persetujuan secara cepat, tepat, dan objektif.*
