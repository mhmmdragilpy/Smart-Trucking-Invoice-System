// ============================================================
// Invoice Type Configuration — 16 Tipe Invoice
// PT Tunggal Mandiri Logistik
// ============================================================
// Selection is by INVOICE TYPE (not customer).
// Each type has its own columns, bank group, and FEE logic.

export interface BankAccount {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
}

export interface ColumnDef {
  key: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'currency';
  options?: string[];
  width?: string;
  required?: boolean;
}

export interface InvoiceType {
  id: number;
  name: string;
  customerName: string; // [NEW] For "To" field in PDF
  bankGroup: 'A' | 'B';
  isFee: boolean;
  columns: ColumnDef[];
}

// ── Bank Account Details ──────────────────────────────────────
export const BANK_ACCOUNTS: Record<'A' | 'B', BankAccount> = {
  A: {
    bankName: 'Bank BCA',
    accountNumber: '6910380271',
    accountHolder: 'HERI PURWANTO',
  },
  B: {
    bankName: 'Bank BCA',
    accountNumber: '6910415601',
    accountHolder: 'RISTUMMIYATI',
  },
};

import { CONTAINER_STATUSES, CONTAINER_SIZES, DEPOS, PICKUP_LOCATIONS } from './referenceData';

// ── Shared Options ────────────────────────────────────────────
const STATUS_OPTIONS = CONTAINER_STATUSES;
const SIZE_OPTIONS = CONTAINER_SIZES;
const PICKUP_LOCATIONS_REF = PICKUP_LOCATIONS;
const DEPO_LOCATIONS = DEPOS;

// ── Common Base Columns (shared by ALL types) ─────────────────
const baseColumns: ColumnDef[] = [
  { key: 'no', label: 'NO', type: 'number', width: '50px', required: true },
  { key: 'tanggal', label: 'TANGGAL', type: 'date', width: '130px', required: true },
  { key: 'consigne', label: 'CONSIGNE', type: 'text', width: '150px', required: true },
  { key: 'noMobil', label: 'NO. MOBIL', type: 'text', width: '120px', required: true },
  { key: 'noContainer', label: 'NO. CONTAINER', type: 'text', width: '140px' },
  { key: 'status', label: 'STATUS', type: 'select', options: STATUS_OPTIONS, width: '90px' },
  { key: 'size', label: 'SIZE', type: 'select', options: SIZE_OPTIONS, width: '65px' },
];

// ── Column fragments ──────────────────────────────────────────
const COL_PICKUP: ColumnDef = { key: 'pickup', label: 'PICK UP', type: 'select', options: PICKUP_LOCATIONS_REF, width: '110px' };
const COL_DEPO: ColumnDef = { key: 'depo', label: 'DEPO', type: 'select', options: DEPO_LOCATIONS, width: '110px' };
const COL_SMART_DEPO: ColumnDef = { key: 'smartDepo', label: 'SMART/DEPO', type: 'text', width: '120px' };
const COL_EMTY: ColumnDef = { key: 'emty', label: 'EMTY', type: 'text', width: '100px' };
const COL_TUJUAN: ColumnDef = { key: 'tujuan', label: 'TUJUAN', type: 'text', width: '130px', required: true };
const COL_HARGA: ColumnDef = { key: 'harga', label: 'HARGA', type: 'currency', width: '140px', required: true };
const COL_GATE_PASS: ColumnDef = { key: 'gatePass', label: 'GATE PASS', type: 'currency', width: '120px' };
const COL_LIFT_OFF: ColumnDef = { key: 'liftOff', label: 'LIFT OFF', type: 'currency', width: '120px' };
const COL_BONGKAR: ColumnDef = { key: 'bongkar', label: 'BONGKAR', type: 'currency', width: '120px' };
const COL_PERBAIKAN: ColumnDef = { key: 'perbaikan', label: 'PERBAIKAN', type: 'currency', width: '120px' };
const COL_PARKIR: ColumnDef = { key: 'parkir', label: 'PARKIR', type: 'currency', width: '120px' };
const COL_DEMURRAGE: ColumnDef = { key: 'demurrage', label: 'DEMURRAGE', type: 'currency', width: '120px' };
const COL_PMP: ColumnDef = { key: 'pmp', label: 'PMP', type: 'currency', width: '120px' };
const COL_REPAIR: ColumnDef = { key: 'repair', label: 'REPAIR', type: 'currency', width: '120px' };
const COL_NGEMAIL: ColumnDef = { key: 'ngemail', label: 'NGEMAIL', type: 'currency', width: '120px' };
const COL_RSM: ColumnDef = { key: 'rsm', label: 'RSM', type: 'currency', width: '120px' };

export const INVOICE_TYPES: InvoiceType[] = [
  // ── GRUP A — HERI PURWANTO ────────────────────────────────────
  {
    id: 1,
    name: 'OB - PT ISL',
    customerName: 'PT ISL',
    bankGroup: 'A',
    isFee: false,
    columns: [...baseColumns, COL_PICKUP, COL_TUJUAN, COL_HARGA, COL_GATE_PASS],
  },
  {
    id: 2,
    name: 'Imp/Exp - PT ISL',
    customerName: 'PT ISL',
    bankGroup: 'A',
    isFee: false,
    columns: [...baseColumns, COL_DEPO, COL_TUJUAN, COL_HARGA, COL_LIFT_OFF, COL_BONGKAR],
  },
  {
    id: 3,
    name: 'OB - Bpk Dwi',
    customerName: 'Bpk Dwi',
    bankGroup: 'A',
    isFee: false,
    columns: [...baseColumns, COL_PICKUP, COL_TUJUAN, COL_HARGA],
  },
  {
    id: 4,
    name: 'Import - Bpk Dwi',
    customerName: 'Bpk Dwi',
    bankGroup: 'A',
    isFee: false,
    columns: [...baseColumns, COL_PICKUP, COL_DEPO, COL_TUJUAN, COL_HARGA, COL_LIFT_OFF, COL_PERBAIKAN, COL_PARKIR, COL_BONGKAR, COL_DEMURRAGE],
  },
  {
    id: 5,
    name: '🔶 Import FEE - Bpk Dwi',
    customerName: 'Bpk Dwi',
    bankGroup: 'A',
    isFee: true,
    columns: [...baseColumns, COL_PICKUP, COL_DEPO, COL_TUJUAN, COL_HARGA, COL_LIFT_OFF, COL_PERBAIKAN, COL_PARKIR, COL_BONGKAR, COL_DEMURRAGE],
  },
  {
    id: 6,
    name: 'Import - Bpk William',
    customerName: 'Bpk William',
    bankGroup: 'A',
    isFee: false,
    columns: [...baseColumns, COL_PICKUP, COL_DEPO, COL_TUJUAN, COL_HARGA, COL_LIFT_OFF, COL_PMP, COL_BONGKAR],
  },
  {
    id: 7,
    name: '🔶 Import FEE - Bpk William',
    customerName: 'Bpk William',
    bankGroup: 'A',
    isFee: true,
    columns: [...baseColumns, COL_PICKUP, COL_DEPO, COL_TUJUAN, COL_HARGA, COL_LIFT_OFF, COL_PMP, COL_BONGKAR],
  },
  {
    id: 8,
    name: 'Pribadi Import - Bpk Dwi',
    customerName: 'Bpk Dwi',
    bankGroup: 'A',
    isFee: false,
    columns: [...baseColumns, COL_PICKUP, COL_DEPO, COL_TUJUAN, COL_HARGA, COL_LIFT_OFF, COL_REPAIR, COL_PARKIR, COL_BONGKAR],
  },
  {
    id: 9,
    name: '🔶 Pribadi Import FEE - Bpk Dwi',
    customerName: 'Bpk Dwi',
    bankGroup: 'A',
    isFee: true,
    columns: [...baseColumns, COL_PICKUP, COL_DEPO, COL_TUJUAN, COL_HARGA, COL_LIFT_OFF, COL_REPAIR, COL_PARKIR, COL_BONGKAR],
  },
  {
    id: 10,
    name: 'Transport - Bpk Ryan',
    customerName: 'Bpk Ryan',
    bankGroup: 'A',
    isFee: false,
    columns: [...baseColumns, COL_EMTY, COL_TUJUAN, COL_HARGA, COL_LIFT_OFF, COL_PARKIR, COL_NGEMAIL, COL_BONGKAR],
  },
  {
    id: 11,
    name: 'Transport - PT CSL',
    customerName: 'PT CSL',
    bankGroup: 'A',
    isFee: false,
    columns: [...baseColumns, COL_PICKUP, COL_SMART_DEPO, COL_TUJUAN, COL_HARGA, COL_LIFT_OFF, COL_REPAIR, COL_BONGKAR],
  },
  {
    id: 12,
    name: 'Transport - PT BISMA LOGISTIK',
    customerName: 'PT BISMA LOGISTIK',
    bankGroup: 'A',
    isFee: false,
    columns: [...baseColumns, COL_PICKUP, COL_DEPO, COL_TUJUAN, COL_HARGA, COL_LIFT_OFF, COL_REPAIR],
  },
  {
    id: 13,
    name: 'Transport - PT LANJAKAR SUKSES MAKMUR',
    customerName: 'PT LANJAKAR SUKSES MAKMUR - Mba Amel',
    bankGroup: 'A',
    isFee: false,
    columns: [...baseColumns, COL_PICKUP, COL_DEPO, COL_TUJUAN, COL_HARGA, COL_LIFT_OFF, COL_BONGKAR, COL_PARKIR],
  },

  // ── GRUP B — RISTUMMIYATI ─────────────────────────────────────
  {
    id: 14,
    name: 'Transport - PT LANCAR JAYA KARGO',
    customerName: 'PT LANCAR JAYA KARGO - Mba Amel',
    bankGroup: 'B',
    isFee: false,
    columns: [...baseColumns, COL_PICKUP, COL_DEPO, COL_TUJUAN, COL_HARGA, COL_LIFT_OFF, COL_REPAIR],
  },
  {
    id: 15,
    name: 'Transport - PT HIRO PERMATA ABADI',
    customerName: 'PT HIRO PERMATA ABADI',
    bankGroup: 'B',
    isFee: false,
    columns: [...baseColumns, COL_PICKUP, COL_DEPO, COL_TUJUAN, COL_HARGA, COL_LIFT_OFF, COL_RSM],
  },
  {
    id: 16,
    name: 'Transport - PT ROCKET SALES MAKMUR',
    customerName: 'PT ROCKET SALES MAKMUR',
    bankGroup: 'B',
    isFee: false,
    columns: [...baseColumns, COL_PICKUP, COL_DEPO, COL_TUJUAN, COL_HARGA, COL_LIFT_OFF, COL_RSM, COL_REPAIR],
  },
];

// ── Fee Discount Amount ───────────────────────────────────────
export const FEE_DISCOUNT = 150000;

// ── Helper Functions ──────────────────────────────────────────

export function getInvoiceTypeById(id: number): InvoiceType | undefined {
  return INVOICE_TYPES.find((t) => t.id === id);
}

export function getInvoiceTypeByName(name: string): InvoiceType | undefined {
  return INVOICE_TYPES.find((t) => t.name === name);
}

export function getBankForType(invoiceType: InvoiceType): BankAccount {
  return BANK_ACCOUNTS[invoiceType.bankGroup];
}

export function getGrupATypes(): InvoiceType[] {
  return INVOICE_TYPES.filter((t) => t.bankGroup === 'A');
}

export function getGrupBTypes(): InvoiceType[] {
  return INVOICE_TYPES.filter((t) => t.bankGroup === 'B');
}

/**
 * Calculate total for a single row. Sums all currency columns.
 * For FEE types, auto-applies harga - 150,000 discount.
 */
export function calculateRowTotal(invoiceType: InvoiceType, row: Record<string, unknown>): number {
  const currencyKeys = invoiceType.columns
    .filter((c) => c.type === 'currency')
    .map((c) => c.key);

  let total = 0;
  for (const key of currencyKeys) {
    if (key === 'harga' && invoiceType.isFee) {
      // FEE type: harga - 150,000
      total += Math.max(0, (Number(row[key]) || 0) - FEE_DISCOUNT);
    } else {
      total += Number(row[key]) || 0;
    }
  }
  return total;
}

/**
 * Calculate grand total across all rows.
 */
export function calculateGrandTotal(invoiceType: InvoiceType, rows: Record<string, unknown>[]): number {
  return rows.reduce((sum, row) => sum + calculateRowTotal(invoiceType, row), 0);
}

/**
 * Generate a default empty row for the given invoice type.
 */
export function getDefaultRow(invoiceType: InvoiceType, rowNumber: number): Record<string, unknown> {
  const row: Record<string, unknown> = {};
  for (const col of invoiceType.columns) {
    if (col.key === 'no') {
      row[col.key] = rowNumber;
    } else if (col.type === 'currency' || col.type === 'number') {
      row[col.key] = 0;
    } else {
      row[col.key] = '';
    }
  }
  return row;
}
