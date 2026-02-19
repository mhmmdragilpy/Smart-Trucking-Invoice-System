# Smart Trucking Invoice System

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-16.1-black)
![Supabase](https://img.shields.io/badge/Supabase-Database-green)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC)
![License](https://img.shields.io/badge/license-MIT-blue)

**Smart Trucking Invoice System** adalah platform manajemen invoice logistik modern yang dirancang khusus untuk menangani kompleksitas dokumen logistik. Sistem ini mendigitalkan seluruh alur kerja penagihan, mulai dari input data perjalanan, kalkulasi biaya otomatis, hingga pembuatan dokumen PDF siap cetak, menggantikan proses manual yang rentan kesalahan.

Dikembangkan sebagai solusi "Tailor-Made" yang memahami bahasa bisnis trucking, sistem ini menawarkan efisiensi administrasi hingga 80%.

---

## ✨ Fitur Unggulan

Berikut adalah fitur-fitur utama yang membuat sistem ini berbeda:

### 1. Manajemen Invoice Komprehensif (16+ Tipe)
Mendukung berbagai format tagihan logistik dengan kolom yang menyesuaikan otomatis:
-   Import & Export
-   Fee Mode
-   Transport
-   Refund
-   Dan banyak lagi.

### 2. Kalkulasi Cerdas & Otomatis
Lupakan kalkulator manual. Sistem menangani perhitungan kompleks secara instan:
-   Perhitungan Total, DP, dan Sisa Tagihan.
-   Kalkulasi Potongan Fee otomatis.
-   Fitur "Terbilang" otomatis untuk jumlah uang.
-   Minimalisir *human error* dalam perhitungan keuangan.

### 3. PDF Generator Pro
Cetak invoice standar industri (A4) dalam satu klik:
-   Format rapi dan profesional.
-   Siap kirim ke klien.
-   Mendukung cetak massal.

### 4. Rekapitulasi Sentral & Cloud Access 24/7
-   Semua data tersimpan aman di cloud (Supabase/PostgreSQL).
-   Pencarian invoice lama dalam hitungan detik.
-   Akses dari mana saja (Laptop, Tablet, HP) tanpa instalasi aplikasi tambahan.

### 5. Integrasi AI & Teknologi Modern
-   Dibangun dengan **Next.js 16** dan **React 19** untuk performa maksimal.
-   Integrasi **Google Generative AI** untuk fitur cerdas masa depan.
-   Autentikasi aman menggunakan **Better Auth**.

---

## 🚀 Tech Stack

Project ini dibangun menggunakan teknologi terkini untuk memastikan performa, keamanan, dan skalabilitas jangka panjang.

| Kategori | Teknologi | Deskripsi |
|----------|------------|-------------|
| **Frontend Framework** | [Next.js 16 (App Router)](https://nextjs.org/) | Framework React terbaru untuk performa dan SEO optimal. |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | Keamanan tipe data untuk kode yang lebih robust. |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | Styling modern, cepat, dan responsif. |
| **UI Components** | [Shadcn UI](https://ui.shadcn.com/) | Komponen antarmuka yang elegan dan aksesibel. |
| **Database** | [Supabase](https://supabase.com/) | Database PostgreSQL berbasis cloud yang scalable. |
| **ORM** | [Drizzle ORM](https://orm.drizzle.team/) | Interaksi database yang aman dan efisien (Type-safe). |
| **Authentication** | [Better Auth](https://better-auth.com/) | Sistem autentikasi modern dan aman. |
| **PDF Engine** | [@react-pdf/renderer](https://react-pdf.org/) | Pembuatan dokumen PDF performa tinggi di sisi klien. |
| **AI Integration** | [Google AI SDK](https://sdk.vercel.ai/) | Integrasi kecerdasan buatan untuk fitur lanjutan. |

---

## 🛠️ Persyaratan Sistem

Sebelum memulai, pastikan Anda telah menginstal:

-   **Node.js**: Versi 20.x atau lebih baru.
-   **npm** atau **pnpm**: Package manager.
-   **Git**: Untuk manajemen versi.

---

## 📦 Instalasi & Cara Menjalankan

Ikuti langkah-langkah berikut untuk menjalankan project ini di komputer lokal Anda.

### 1. Clone Repository
```bash
git clone https://github.com/mhmmdragilpy/Smart-Trucking-Invoice-System.git
cd Smart-Trucking-Invoice-System
```

### 2. Install Dependencies
```bash
npm install
# atau
pnpm install
```

### 3. Konfigurasi Environment Variables
Salin file `.env.example` (jika ada) atau buat file `.env.local` baru dan isi konfigurasi berikut:

```env
# Database (Supabase)
DATABASE_URL="postgresql://postgres.[YOUR-PROJECT]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres"
DIRECT_URL="postgresql://postgres.[YOUR-PROJECT]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"

# Supabase Client
NEXT_PUBLIC_SUPABASE_URL=https://[YOUR-PROJECT].supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=[YOUR-ANON-KEY]

# Authentication (Better Auth)
BETTER_AUTH_SECRET=[YOUR-GENERATED-SECRET]
BETTER_AUTH_URL=http://localhost:3000

# AI SDK (Google)
GOOGLE_GENERATIVE_AI_API_KEY=[YOUR-API-KEY]
```

### 4. Setup Database
Jalankan migrasi database menggunakan Drizzle Kit:
```bash
npm run db:push
# atau command migrasi yang sesuai di package.json Anda
```

### 5. Jalankan Development Server
```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda untuk melihat aplikasi berjalan.

---

## 🤝 Kontribusi

Kontribusi selalu diterima! Jika Anda ingin menambahkan fitur baru atau memperbaiki bug:

1.  Fork repository ini.
2.  Buat branch fitur baru (`git checkout -b fitur/NamaFitur`).
3.  Commit perubahan Anda (`git commit -m 'Menambahkan fitur baru'`).
4.  Push ke branch (`git push origin fitur/NamaFitur`).
5.  Buat Pull Request.

---

## 📄 Lisensi

Project ini dilindungi dan didistribusikan di bawah lisensi MIT.

---

## 👤 Author

Developed by **mhmmdragilpy**
