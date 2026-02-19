# Smart Trucking Invoice System

![Next.js](https://img.shields.io/badge/Next.js-16.1-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3FCF8E?logo=supabase)
![Drizzle](https://img.shields.io/badge/Drizzle_ORM-0.45-C5F74F?logo=drizzle)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?logo=tailwindcss)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![License](https://img.shields.io/badge/license-MIT-blue)

**Smart Trucking Invoice System** adalah platform manajemen invoice logistik modern yang dirancang khusus untuk **PT Tunggal Mandiri Logistik (TML)**. Sistem ini mendigitalkan seluruh alur kerja penagihan — mulai dari input data perjalanan, kalkulasi biaya otomatis, hingga pembuatan dokumen PDF profesional — menggantikan proses manual yang rentan kesalahan.

> Hemat waktu administrasi hingga **80%** dan hilangkan kesalahan hitung manusia.

---

## ✨ Fitur Utama

### 📋 Manajemen Invoice (16+ Tipe)
Mendukung berbagai format tagihan logistik dengan kolom yang menyesuaikan otomatis per tipe:
- **Import & Export** — OB ISL, Bpk Dwi, Bpk William, dll.
- **Fee Mode** — Kalkulasi fee dengan potongan Rp150.000 otomatis.
- **Transport** — PT CSL, PT Hiro Permata Abadi, PT Rocket Sales Makmur, dll.
- Pengelompokan **Bank Grup A & B** dengan rekening yang berbeda.

### 🧮 Kalkulasi Cerdas & Otomatis
- Perhitungan **Total**, **DP**, dan **Sisa Tagihan** real-time.
- Kalkulasi **Potongan Fee** otomatis per baris.
- Fitur **"Terbilang"** otomatis (angka → kata dalam Bahasa Indonesia).
- Dukungan kolom variabel: Gate Pass, Lift Off, Bongkar, Perbaikan, Parkir, PMP, Repair, dll.

### 📄 PDF Generator
Cetak invoice standar industri (A4) langsung dari browser:
- Format profesional dengan header perusahaan dan tanda tangan digital.
- Tabel data dinamis sesuai tipe invoice.
- Informasi bank dan terbilang otomatis.
- Download satu klik via `@react-pdf/renderer`.

### 📊 Dashboard & Rekapitulasi
- **Dashboard** dengan statistik invoice: total tagihan per tipe, per customer, dan grafik visual (Recharts).
- **Rekapitulasi** dengan tabel interaktif: sorting, filtering, global search, expand detail per baris.
- **Edit & Hapus** invoice langsung dari halaman rekap.
- Download PDF ulang untuk invoice yang sudah tersimpan.

### 🗃️ Data Master
Halaman referensi internal untuk melihat data statis yang digunakan sistem:
- Daftar **Customer** per tipe invoice.
- Daftar **Tujuan/Destinasi** dan harga referensi.
- Informasi **Depo**, **Pickup Location**, dan **Container Size**.

### 🔐 Autentikasi & Keamanan
- Login berbasis **cookie HTTP-only** dengan password di-hash via `bcryptjs`.
- **Middleware proxy** melindungi semua route (redirect otomatis ke `/login` jika belum login).
- Akun diberikan langsung oleh developer — tidak ada fitur registrasi publik untuk keamanan maksimal.

### 🌙 Dark Mode
Toggle tema Light/Dark langsung dari sidebar.

---

## 🏗️ Arsitektur & Tech Stack

Sistem ini dibangun dengan kombinasi **Next.js** dan **Supabase** sebagai inti, dengan arsitektur modern full-stack.

### Core Stack

| Kategori | Teknologi | Versi | Keterangan |
|----------|-----------|-------|------------|
| **Framework** | [Next.js](https://nextjs.org/) (App Router) | 16.1 | Server Actions, Middleware, SSR/SSG |
| **UI Library** | [React](https://react.dev/) | 19 | Client Components + Server Components |
| **Language** | [TypeScript](https://typescriptlang.org/) | 5.x | Type-safe codebase |
| **Database** | [Supabase](https://supabase.com/) (PostgreSQL) | — | Cloud database, connection pooling |
| **ORM** | [Drizzle ORM](https://orm.drizzle.team/) | 0.45 | Type-safe queries, migrations, relations |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) | 4.0 | Utility-first CSS |
| **UI Components** | [Shadcn UI](https://ui.shadcn.com/) + [Radix UI](https://radix-ui.com/) | — | Accessible, composable components |

### Libraries & Tools

| Kategori | Library | Kegunaan |
|----------|---------|----------|
| **PDF** | `@react-pdf/renderer` | Generate invoice PDF di client-side |
| **Charts** | `recharts` | Grafik dashboard (pie chart, bar chart) |
| **Tables** | `@tanstack/react-table` | Tabel sorting, filtering, pagination, expand |
| **Forms** | `react-hook-form` + `zod` | Form validation |
| **Auth** | `bcryptjs` + HTTP-only cookies | Login/logout, password hashing |
| **Toast** | `sonner` | Notifikasi success/error berwarna |
| **Themes** | `next-themes` | Dark/light mode toggle |
| **Fonts** | Google Fonts (Montserrat + Inter) | Typography heading & body |
| **Icons** | `lucide-react` | Icon set modern |
| **Date** | `date-fns` | Format tanggal Indonesia |
| **AI** | `@ai-sdk/google` + `ai` | Chat endpoint (Gemini) |

---

## 📁 Struktur Project

```
Smart-Trucking-Invoice-System/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Dashboard utama
│   │   ├── layout.tsx            # Root layout (Sidebar + ThemeProvider)
│   │   ├── login/page.tsx        # Halaman login
│   │   ├── invoice/page.tsx      # Form buat/edit invoice
│   │   ├── rekap/page.tsx        # Rekapitulasi & tabel invoice
│   │   ├── admin/data/page.tsx   # Data Master (referensi)
│   │   ├── actions/
│   │   │   ├── auth.ts           # Server Actions: login, logout, check auth
│   │   │   ├── invoices.ts       # Server Actions: CRUD invoice
│   │   │   └── dashboard.ts     # Server Actions: statistik dashboard
│   │   └── api/
│   │       ├── auth/[...all]/    # Better Auth API handler
│   │       ├── chat/             # AI chat endpoint (Gemini)
│   │       ├── invoice/          # Invoice API route
│   │       ├── recap/            # Recap API route
│   │       └── seed/             # Database seeder
│   ├── components/
│   │   ├── Sidebar.tsx           # Sidebar navigasi + user menu
│   │   ├── InvoicePdf.tsx        # PDF template (react-pdf)
│   │   ├── RecentInvoices.tsx    # Widget invoice terbaru
│   │   ├── ThemeProvider.tsx     # Dark/light mode provider
│   │   ├── dashboard/            # Komponen chart dashboard
│   │   └── ui/                   # Shadcn UI components
│   ├── db/
│   │   ├── drizzle.ts            # Database connection (postgres.js)
│   │   ├── schema.ts             # Drizzle schema (invoices, items, counters, auth)
│   │   ├── schema.sql            # Raw SQL reference
│   │   └── migrations/           # Drizzle migrations
│   ├── lib/
│   │   ├── customerConfig.ts     # 16 tipe invoice, kolom, bank config
│   │   ├── supabase.ts           # Supabase client
│   │   ├── auth.ts               # Better Auth config
│   │   ├── auth-client.ts        # Better Auth client
│   │   ├── pdfAssets.ts          # Base64 assets untuk PDF (TTD, logo)
│   │   ├── terbilang.ts          # Angka → kata Bahasa Indonesia
│   │   ├── schemas.ts            # Zod validation schemas
│   │   ├── utils.ts              # Utility (cn)
│   │   └── data/                 # Static data (harga, destinasi, depo)
│   ├── hooks/
│   │   └── useInvoiceCalculations.ts  # Custom hook kalkulasi invoice
│   └── proxy.ts                  # Middleware auth (route protection)
├── drizzle.config.ts             # Drizzle Kit config
├── package.json
├── tsconfig.json
└── next.config.ts
```

---

## 🛠️ Persyaratan Sistem

- **Node.js** ≥ 20.x
- **npm** atau **pnpm**
- **Git**
- Akun **Supabase** (gratis) untuk database PostgreSQL

---

## 📦 Instalasi & Setup

### 1. Clone Repository
```bash
git clone https://github.com/mhmmdragilpy/Smart-Trucking-Invoice-System.git
cd Smart-Trucking-Invoice-System
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Konfigurasi Environment
Buat file `.env.local` di root project:

```env
# Database (Supabase PostgreSQL - Transaction Pooler)
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres"

# Supabase Client
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT-REF].supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=[ANON-KEY]

# Authentication
BETTER_AUTH_SECRET=[RANDOM-SECRET-32-CHARS]
BETTER_AUTH_URL=http://localhost:3000

# AI (Optional - untuk fitur chat)
GOOGLE_GENERATIVE_AI_API_KEY=[API-KEY]
```

### 4. Setup Database
```bash
npx drizzle-kit push
```

### 5. Jalankan Development Server
```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

---

## 🔑 Login

Akun admin diberikan langsung oleh developer. Tidak ada fitur registrasi publik.

| Field | Default |
|-------|---------|
| Username | `admin` |
| Password | *(diberikan oleh developer)* |

---

## 📄 Lisensi

Didistribusikan di bawah lisensi **MIT**.

---

## 👤 Author

Developed by **[@mhmmdragilpy](https://github.com/mhmmdragilpy)**
