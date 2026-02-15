# 🚛 Smart Trucking Invoice System

**Smart Trucking Invoice System** adalah solusi digital modern yang dirancang untuk mengotomatisasi proses *invoicing* dan manajemen data logistik. Aplikasi ini mengubah alur kerja manual berbasis Excel menjadi sistem berbasis web yang efisien, terintegrasi, dan *scalable*.

Dikembangkan oleh **Mang Do-san** (IT Consultant & Web Developer) sebagai solusi *Enterprise Resource Planning* (ERP) mini untuk sektor logistik.

![Dashboard Preview](public/logo-full.png)

## 🌟 Overview Project

Sistem ini dibangun untuk mengatasi kompleksitas penagihan di industri trucking yang melibatkan banyak variabel (biaya lift-off, gate pass, cleaning, storage, dll). Dengan antarmuka yang intuitif dan *backend* yang ringan menggunakan Google Sheets, aplikasi ini menawarkan keseimbangan sempurna antara performa dan kemudahan penggunaan.

## ✨ Fitur Unggulan

### 1. Advanced Invoice Management
-   **Multi-Schema Support**: Mendukung 16+ jenis skema penagihan yang berbeda dalam satu platform.
-   **Dynamic Auto-Numbering**: Sistem penomoran cerdas dengan format custom (e.g., `INV/YYYY/MM/XXX`).
-   **Smart Auto-Complete**:
    -   Database Consignee & Customer terpusat.
    -   Riwayat Kendaraan & Kontainer otomatis tersimpan.
    -   *Price Logic*: Otomatisasi harga berdasarkan rute (Single/Multi rate).

### 2. High-Performance Financial Tools
-   **Real-time Calculation**: Kalkulasi otomatis untuk PPN, PPh, dan total biaya logistik.
-   **Auto-Formatting**: Input mata uang dengan *locale* Indonesia (`Rp 1.000.000`) untuk mencegah human error.
-   **Interactive Data Grid**: Tabel data responsif dengan fitur *summary row* untuk total per kolom.

### 3. Client-Side PDF Generation
-   **Fast & Secure**: Pembuatan PDF dilakukan di sisi klien (browser) menggunakan `@react-pdf/renderer` tanpa membebani server.
-   **Digital Signing**: Integrasi tanda tangan digital QR/Image pada dokumen invoice.
-   **Professional Layout**: Desain invoice standar industri yang siap cetak (A4).

### 4. Serverless Backend (Google Apps Script)
-   **Cost-Effective**: Menggunakan Google Sheets sebagai database (NoSQL-like) melalui Google Apps Script.
-   **Real-time Sync**: Data invoice tersimpan otomatis dan dapat diakses kapan saja untuk keperluan audit/rekap.
-   **Master-Detail Architecture**: Struktur data terpisah untuk *Header* (Transaksi) dan *Detail* (Item) demi integritas data.

---

## 🛠️ Tech Stack

Dibangun dengan teknologi terkini untuk menjamin kecepatan, keamanan, dan skalabilitas:

-   **Frontend**: [Next.js 15](https://nextjs.org/) (App Router), [React](https://react.dev/)
-   **Language**: [TypeScript](https://www.typescriptlang.org/) for Type Safety
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
-   **PDF Generation**: [@react-pdf/renderer](https://react-pdf.org/)
-   **Icons**: [Lucide React](https://lucide.dev/)
-   **Utilities**: `zod` (Validation), `clsx` (Class handling)
-   **Backend**: Google Apps Script (GAS) API

---

## 🚀 Instalasi & Pengembangan

Tertarik mempelajari kode sumbernya? Ikuti langkah berikut:

1.  **Clone Repository**
    ```bash
    git clone https://github.com/mhmmdragilpy/Smart-Trucking-Invoice-System.git
    cd invoice-app
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Setup Environment**
    Buat file `.env.local` dan tambahkan URL API Google Apps Script (Opsional untuk fitur save):
    ```env
    NEXT_PUBLIC_GAS_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
    ```

4.  **Jalankan Mode Development**
    ```bash
    npm run dev
    ```
    Buka `http://localhost:3000` di browser.

---

## 👨‍💻 Developer Credit

Project ini dirancang dan dikembangkan sepenuhnya oleh:

**Mang Do-san**
*IT Consultant | Fullstack Web Developer*

> "Building digital solutions that empower businesses."

---
*© 2026 Smart Trucking Invoice System. All Rights Reserved.*
