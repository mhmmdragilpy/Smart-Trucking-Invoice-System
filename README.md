# 🚛 Smart Trucking Invoice System

**Smart Trucking Invoice System** adalah aplikasi manajemen invoice berbasis web modern yang dirancang khusus untuk **PT. TUNGGAL MANDIRI LOGISTIK**. Sistem ini mendigitalkan proses pembuatan invoice trucking, ekspor-impor, dan manajemen data keuangan dengan efisiensi tinggi dan tampilan antarmuka yang premium.

![Dashboard Preview](public/logo-full.png)

## ✨ Fitur Utama

### 1. Manajemen Invoice Cerdas
-   **16 Tipe Invoice**: Mendukung berbagai format invoice (Group A, B, Fees, Reimbursement, dll).
-   **Dynamic Numbering**: Penomoran otomatis dengan format `TML/TAHUN/BULAN/URUTAN` (Auto-increment).
-   **Auto-Complete**:
    -   Database **Customer/Consignee** (~60 entri).
    -   **Vehicle & Container**: Mencatat dan menyarankan nomor kendaraan/kontainer yang pernah diinput.
    -   **Lokasi & Harga**: Input otomatis harga berdasarkan rute (Smart Price Logic).

### 2. Keuangan & Kalkulasi
-   **Auto-Formatting**: Input mata uang otomatis terformat (Contoh: `1.000.000`).
-   **Kalkulasi Otomatis**: Menghitung Total Harga, Gate Pass, Lift Off, dan biaya lainnya secara real-time.
-   **Column Totals**: Menampilkan ringkasan total per kolom di bagian bawah tabel.

### 3. PDF Generator & Digital Signature
-   **Client-Side Generation**: Pembuatan PDF instan tanpa loading lama.
-   **Professional Layout**: Header perusahaan, logo, dan tata letak yang rapi sesuai standar industri.
-   **Tanda Tangan Digital**: Invoice otomatis ditandatangani secara digital (QR/Image).

### 4. Integrasi Google Apps Script (Backend)
-   **Data Backup**: Semua data invoice tersimpan otomatis ke **Google Sheets**.
-   **Struktur Data**:
    -   `Transactions`: Data utama invoice (Header).
    -   `InvoiceItems`: Rincian item per invoice (Detail).
    -   `InvoiceCounter`: Penomoran otomatis yang sinkron.

---

## 🛠️ Teknologi

Project ini dibangun dengan teknologi web modern untuk performa maksimal:

-   **Frontend**: [Next.js 15](https://nextjs.org/) (App Router), [React](https://react.dev/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/), [Shadcn UI](https://ui.shadcn.com/)
-   **PDF Engine**: [@react-pdf/renderer](https://react-pdf.org/)
-   **Icons**: [Lucide React](https://lucide.dev/)
-   **Backend / Database**: Google Apps Script (GAS) & Google Sheets

---

## 🚀 Cara Install & Menjalankan (Local)

Pastikan **Node.js** sudah terinstall di komputer Anda.

1.  **Clone Repository**
    ```bash
    git clone https://github.com/mhmmdragilpy/Smart-Trucking-Invoice-System.git
    cd invoice-app
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Setup Environment Variables**
    Buat file `.env.local` dan tambahkan URL Google Apps Script Anda (lihat panduan GAS):
    ```env
    NEXT_PUBLIC_GAS_URL=https://script.google.com/macros/s/ID_SCRIPT_KAMU/exec
    ```

4.  **Jalankan Server**
    ```bash
    npm run dev
    ```
    Buka [http://localhost:3000](http://localhost:3000) di browser.

---

## 🌐 Panduan Deployment

### 1. Google Apps Script (Backend)
Backend Google Sheets wajib di-deploy terlebih dahulu.
👉 **[BACA PANDUAN LENGKAP DEPLOY GAS DISINI](DEPLOY_GAS.md)**

### 2. Vercel (Frontend)
Aplikasi ini siap di-deploy ke Vercel dengan mudah:
1.  Push kode ke GitHub.
2.  Import project di Dashboard Vercel.
3.  Masukkan `NEXT_PUBLIC_GAS_URL` di menu **Environment Variables**.
4.  Deploy! 🚀

---

## 👨‍💻 Author

Dikembangkan dengan ❤️ dan ☕ untuk **PT. Tunggal Mandiri Logistik**.

---
*© 2026 Smart Trucking Invoice System. Private Property.*
