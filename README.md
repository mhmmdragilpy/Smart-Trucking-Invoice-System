# Smart Trucking Invoice System

A modern, web-based invoice generation system for **PT Tunggal Mandiri Logistik**.
Built with **Next.js**, **React PDF**, and **Google Apps Script**.

## Features

-   **16 Invoice Types**: Supports all required invoice formats (Group A & B, Fees, etc.).
-   **Auto-Complete**: Smart suggestions for Consignee, Vehicle No, Container No, Depot, and Price.
-   **Formatted Inputs**: Currency fields auto-format (e.g. `1.000.000`).
-   **PDF Generation**: Client-side PDF generation with digital signature.
-   **Data Management**: Google Apps Script integration for invoice numbering and recap.

## Tech Stack

-   **Frontend**: Next.js 15 (App Router), React, Tailwind CSS
-   **PDF**: @react-pdf/renderer
-   **Icons**: Lucide React
-   **Backend**: Google Apps Script (for simple data storage/numbering)

## Getting Started

1.  Clone the repository:
    ```bash
    git clone https://github.com/mhmmdragilpy/Smart-Trucking-Invoice-System.git
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run development server:
    ```bash
    npm run dev
    ```
4.  Open [http://localhost:3000](http://localhost:3000).

## Deployment

### Vercel
1.  Push your code to GitHub.
2.  Import the project in Vercel.
3.  Add environment variables (if any).
4.  Deploy!

### Google Apps Script
1.  Open the `gas/Code.gs` file.
2.  Copy the content.
3.  Create a new project in script.google.com.
4.  Paste the code and deploy as Web App.
5.  Update `NEXT_PUBLIC_GAS_URL` in `.env.local` with the deployment URL.

## License

Private software for PT Tunggal Mandiri Logistik.
