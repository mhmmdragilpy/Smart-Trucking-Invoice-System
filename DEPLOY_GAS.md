# 🚀 Google Apps Script (GAS) Deployment Guide

This guide explains how to set up the backend for your **Smart Trucking Invoice System**. This script will save your invoice data to a Google Sheet for backup and analysis.

## 1. Prepare the Script

1.  Open the file `gas/Code.gs` in your project folder.
2.  Select all code (`Ctrl+A`) and Copy (`Ctrl+C`).

## 2. Create Google Apps Script Project

1.  Go to [script.google.com](https://script.google.com).
2.  Click **+ New Project** (top left).
3.  Rename the project (click "Untitled Project" at top) to `Smart Trucking API`.
4.  Paste the code you copied into the editor (replace any existing code).
5.  **Important**: Find the line `const SPREADSHEET_ID = '';` at the top.
    -   Create a new Google Sheet in Drive.
    -   Copy its ID from the URL: `docs.google.com/spreadsheets/d/`**`THIS_PART_IS_THE_ID`**`/edit`.
    -   Paste it inside the quotes: `const SPREADSHEET_ID = '1rX...';`.
6.  Save (`Ctrl+S`).

## 3. Initialize Database

1.  In the toolbar dropdown (where it usually says `myFunction`), select **`initDatabase`**.
2.  Click **Run**.
3.  It will ask for **Review Permissions**.
    -   Click **Review Permissions**.
    -   Select your Google Account.
    -   (If "Google hasn't verified this app" appears) Click **Advanced** -> **Go to Smart Trucking API (unsafe)** -> **Allow**.
4.  Check your Google Sheet. You should see 3 clean sheets: `Transactions`, `InvoiceItems`, and `InvoiceCounter`.

## 4. Deploy as Web App

1.  Click **Deploy** (blue button, top right) -> **New deployment**.
2.  Click the gear icon (Select type) -> **Web App**.
3.  Fill in the details:
    -   **Description**: `v1`
    -   **Execute as**: **Me** (your email).
    -   **Who has access**: **Anyone** (Anyone with Google account or Anyone). *Recommended: Anyone*.
4.  Click **Deploy**.
5.  Copy the **Web App URL** (starts with `https://script.google.com/macros/s/...`).

## 5. Connect to Website

1.  Go to your Vercel Project Settings (or `.env.local` if running locally).
2.  Add a new Environment Variable:
    -   **Key**: `NEXT_PUBLIC_GAS_URL`
    -   **Value**: (Paste the Web App URL you just copied)
3.  Save and Redeploy Vercel.

## 6. Troubleshooting

### Error: `Invalid argument: id` (in `initDatabase`)
-   **Cause**: You forgot to fill in the `SPREADSHEET_ID` in Line 10.
-   **Fix**:
    1.  Open your Google Sheet.
    2.  Copy the long ID from the URL (between `/d/` and `/edit`).
        -   Example: `https://docs.google.com/spreadsheets/d/`**`1BxiMVs0XRA5nFMdKbBdBZjgmUUqptnbsCnWDfKTNZTk`**`/edit`
    3.  Paste it into the code: `const SPREADSHEET_ID = '1Bxi...';`.
    4.  Save and run again.

🎉 **Done!** Your invoices will now automatically save to your Google Sheet!
