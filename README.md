# Smart Trucking Invoice System

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-15.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC)
![License](https://img.shields.io/badge/license-MIT-blue)

**Smart Trucking Invoice System** adalah platform manajemen invoice logistik modern yang dirancang untuk efisiensi tinggi. Aplikasi ini mendigitalkan seluruh alur kerja penagihan, mulai dari input data perjalanan, kalkulasi biaya otomatis, hingga pembuatan dokumen PDF siap cetak dengan tanda tangan digital.

Dibuat sebagai solusi ERP mini yang *scalable*, aman, dan mudah digunakan.

---

## 🚀 Tech Stack

Project ini dibangun menggunakan teknologi terkini untuk memastikan performa yang cepat, aman, dan mudah dikembangkan.

| Category | Technology | Description |
|----------|------------|-------------|
| **Frontend** | [Next.js 15 (App Router)](https://nextjs.org/) | Framework React modern untuk server-side rendering dan performa optimal. |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | Superset JavaScript dengan static typing untuk keamanan kode dan skalabilitas. |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) | Utility-first CSS framework untuk desain antarmuka yang cepat dan responsif. |
| **UI Components** | [Shadcn UI](https://ui.shadcn.com/) | Komponen UI yang dapat dikustomisasi dan aksesibel. |
| **PDF Engine** | [@react-pdf/renderer](https://react-pdf.org/) | Pembuatan dokumen PDF performa tinggi langsung di sisi klien (browser). |
| **Icons** | [Lucide React](https://lucide.dev/) | Koleksi icon yang bersih, konsisten, dan ringan. |
| **Backend API** | [Google Apps Script](https://developers.google.com/apps-script) | Serverless backend yang memanfaatkan Google Sheets sebagai database yang hemat biaya. |

---

## ✨ Fitur Utama

Berikut adalah fitur-fitur unggulan yang telah diimplementasikan:

-   **Manajemen Invoice Komprehensif**: Mendukung 16+ jenis skema invoice logistik dengan fleksibilitas tinggi.
-   **Intelligent Automation**:
    -   **Dynamic Numbering**: Penomoran invoice otomatis (`INV/YYYY/MM/XXX`).
    -   **Smart Auto-Complete**: Saran otomatis untuk data pelanggan, kendaraan, dan rute berdasarkan riwayat.
    -   **Price Logic**: Penentuan harga otomatis berdasarkan rute dan jenis layanan.
-   **Financial Accuracy**:
    -   **Auto-Formatting**: Input mata uang yang diformat otomatis (`Rp 1.000.000`) meminimalkan kesalahan input.
    -   **Real-time Calculation**: Perhitungan otomatis untuk PPN, PPh, dan total biaya operasional.
-   **Document Generation**:
    -   **Instant PDF**: Cetak invoice dalam hitungan detik.
    -   **Digital Signature**: Integrasi tanda tangan QR/Digital untuk otentikasi dokumen.
-   **Data Reliability**: Struktur data Master-Detail yang tersimpan aman di cloud (Google Sheets) untuk kemudahan audit.

---

## 🛠️ Prerequisites

Sebelum memulai, pastikan Anda telah menginstal tools berikut di komputer Anda:

-   **Node.js**: Versi 18.x atau lebih baru.
-   **npm**: Package manager standar Node.js.
-   **Git**: Untuk manajemen versi source code.

---

## 📦 Installation & Getting Started

Ikuti langkah-langkah berikut untuk menjalankan project ini di environment lokal Anda.

### 1. Clone Repository
```bash
git clone https://github.com/mhmmdragilpy/Smart-Trucking-Invoice-System.git
cd Smart-Trucking-Invoice-System
```

### 2. Install Dependencies
Install semua library yang dibutuhkan menggunakan npm:
```bash
npm install
```

### 3. Setup Environment Variables
Buat file `.env.local` di root directory project Anda untuk konfigurasi API Backend (Google Apps Script).
```env
NEXT_PUBLIC_GAS_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

### 4. Menjalankan Development Server
Jalankan server lokal dalam mode development:
```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda untuk melihat hasilnya.

---

## 🤝 Contributing

Kontribusi sangat diterima untuk pengembangan fitur lebih lanjut.

1.  Fork repository ini.
2.  Buat branch fitur baru (`git checkout -b feature/AmazingFeature`).
3.  Commit perubahan Anda (`git commit -m 'Add some AmazingFeature'`).
4.  Push ke branch tersebut (`git push origin feature/AmazingFeature`).
5.  Buat Pull Request.

---

## 📄 License

Project ini didistribusikan di bawah lisensi MIT. Lihat file `LICENSE` untuk informasi lebih lanjut.

---

## 👤 Author

Developed with ❤️ and ☕ by **Mang Do-san**
