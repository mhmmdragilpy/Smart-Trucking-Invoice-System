Implementation Plan - Data Page UI Refactor (Iteration 2)
Goal Description
The previous "Split View" design was rejected for being too stiff. The new goal is to create a Fluid, Modern Data Page that matches the visual impactful style of the Dashboard. We will use Horizontal Tabs, Glassmorphism, and Gradients to make the page feel alive and less like a spreadsheet.

User Review Required
NOTE

I am switching to a Top Navigation Tab System (Pills) instead of a sidebar. This allows the table to breathe. I will wrap the table in a Glassmorphic Card similar to the Dashboard widgets. I will add a Gradient Hero Section at the top.

Proposed Changes
1. Fix Invoice Type & Customer Name Saving
[MODIFY] 
src/app/invoice/page.tsx
Update 
handleSubmit
 to include customerName in the payload.
Ensure invoiceTypeName is correctly sent.
2. Google Apps Script Enhancements
[MODIFY] 
gas/Code.gs
Separate Sheets: Implement logic to create/append to sheets named by Invoice Type (e.g., "INV_OB - PT ISL").
Fix Columns: Add 
InvoiceType
 column to Transactions sheet interactions.
CRUD - Delete: Implement 
doPost
 handler for { action: 'delete', invoiceNumber: ... }.
Delete from Transactions.
Delete from InvoiceItems.
Delete from the specific Invoice Type sheet.
3. Recap Page Features
[MODIFY] 
src/app/rekap/page.tsx
Delete Action: Add a Delete button that calls /api/invoice with action: 'delete'.
View Sheet: Add a "View Google Sheet" button linking to the spreadsheet.
PDF Download: Verify existing functionality (it seems implemented).
4. API Route Update
[MODIFY] 
src/app/api/invoice/route.ts
Ensure it passes action and invoiceNumber correctly to GAS.
5. Edit Feature (New)
[MODIFY] 
gas/Code.gs
Update Logic: Add action: 'update' handling.
Reuse 
delete
 logic to remove old data.
Reuse create logic to save new data.
[MODIFY] 
src/app/invoice/page.tsx
Edit Mode: Add functionality to load invoice data from URL params (e.g., ?edit=INV...).
Populate Form: Auto-fill selectedType, rows, invoiceDate, customerName, etc.
Submit Update: If in edit mode, send action: 'update' to API.
[MODIFY] 
src/app/rekap/page.tsx
Edit Button: Add an "Edit" button (Pencil icon) that redirects to /invoice?edit=INV....
6. Database Refactoring (Customer-Based Sheets)
[MODIFY] 
gas/Code.gs
Goal: Group invoice data by CustomerName instead of 
InvoiceType
.
Save Logic: Use payload.customerName to determine the specific sheet name (e.g., "PT ISL", "Bpk Dwi").
Columns: Add 
InvoiceType
 column to these specific sheets to distinguish records since they will now contain mixed types.
Delete Logic: Retrieve CustomerName from Transactions sheet (Column 2) to identify which sheet to delete the record from.
Sheet Naming: Sanitize CustomerName to be valid sheet names.
Verification Plan
Create Invoice: Create an invoice for "PT ISL" (any type).
Verify Sheet: Check if a sheet named PT ISL (or similar) is created/updated.
Delete Invoice: Delete the invoice and ensure it's removed from the PT ISL sheet.
7. Core Data Refactoring
[NEW] 
src/lib/data/masterData.ts
Goal: Centralize all static lists (Consignees, Vehicles, Containers, Depos, Pickups) into one file.
Structure: Export specific arrays and a helper object MASTER_DATA.
[MOVE] [src/lib/priceDatabase.ts] -> [src/lib/data/priceData.ts]
Move logic-heavy price data to the new data directory.
[MODIFY] [src/lib/customerConfig.ts]
Update imports to point to new 
src/lib/data/masterData.ts
.
[DELETE]
src/lib/consignees.ts
src/lib/referenceData.ts
8. Data Seeding (GAS Helper)
[MODIFY] 
gas/Code.gs
Function: seedDatabase()
Goal: Generate 5-10 dummy invoices for different customers (PT ISL, Bpk Dwi, etc.) to verify sheet creation logic.
Usage: Run manually from GAS Editor.
9. Robust Data Seeding (Separate File)
[NEW] 
gas/Seed.gs
Function: 
seedAllTypes()
Goal: Generate 10 invoices for EACH of the 16 invoice types.
Features:
Randomized Dates within a range.
Randomized Consignees, Vehicles, Containers from master data.
Randomized Prices (within reasonable range).
Uses 
saveInvoice
 from 
Code.gs
.
Note: This file is intended to be copied into a new script file in GAS (e.g., 
Seed.gs
).
Verification Plan
Build Check: Run npm run build to ensure no import errors remain.
Runtime Check: Verify dropdowns in Invoice Form still populate correctly.
Seeding Check: Run 
seedAllTypes()
 in GAS and verify data populated.
10. Polishing & Fixes (Iteration 3)
[MODIFY] 
src/app/rekap/page.tsx
Fix Visibility: Ensure InvoiceTypeName is correctly mapped from API (add fallbacks).
Simplify Actions: Remove "Edit" button from the table.
[MODIFY] 
src/app/invoice/page.tsx
Remove Edit Logic: Delete editId handling, 
loadInvoice
 effect, and "Edit" related UI states. Keep form strictly for creation.
[MODIFY] 
src/app/admin/data/page.tsx
UI Redesign: Simplify the layout for a cleaner, modern professional look.
Optimization: Reduce heavy visual effects (gradients/glass) to improve readability.
Verification Plan
Recap Verification: Ensure "Tipe Invoice" column displays names correctly.
Edit Removal Check: Confirm no "Edit" button exists and /invoice page is clean.
Data Design Review: Verify the new modern layout for Reference Data.