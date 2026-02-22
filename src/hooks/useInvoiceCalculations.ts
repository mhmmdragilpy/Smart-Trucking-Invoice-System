// ============================================================
// useInvoiceCalculations — Hook for invoice business logic
// Now works with 16 Invoice Types instead of customer schemas
// Supports optional tax rate (1% - 10%, 0.5% interval)
// ============================================================

import { useMemo } from 'react';
import {
    type InvoiceType,
    type ColumnDef,
    type BankAccount,
    BANK_ACCOUNTS,
    calculateRowTotal,
    calculateGrandTotal,
    FEE_DISCOUNT,
} from '@/lib/customerConfig';
import { terbilangCapitalized } from '@/lib/terbilang';

interface InvoiceCalculations {
    columns: ColumnDef[];
    bankInfo: BankAccount | null;
    isFee: boolean;
    grandTotal: number;
    dp: number;
    taxRate: number | null;
    taxAmount: number;
    jumlah: number;
    terbilangText: string;
}

/**
 * Hook that computes all invoice values from the selected invoice type
 * and the current row data.
 *
 * For FEE types:
 *   - Each row's harga is auto-discounted by 150,000
 *   - Footer shows: Total - DP + Pajak = Jumlah
 *   - `dp` is a user-editable field (down payment)
 *   - `jumlah` = (grandTotal - dp) + taxAmount
 *
 * For NON-FEE types:
 *   - Footer shows: Total + Pajak = Jumlah
 *   - No DP logic
 *
 * Tax is optional. When taxRate is null, no tax is applied.
 */
export function useInvoiceCalculations(
    invoiceType: InvoiceType | null,
    rows: Record<string, unknown>[],
    dp: number = 0,
    taxRate: number | null = null,
): InvoiceCalculations {
    const columns = useMemo(() => {
        if (!invoiceType) return [];
        return invoiceType.columns;
    }, [invoiceType]);

    const bankInfo = useMemo(() => {
        if (!invoiceType) return null;
        return BANK_ACCOUNTS[invoiceType.bankGroup];
    }, [invoiceType]);

    const isFee = invoiceType?.isFee ?? false;

    const grandTotal = useMemo(() => {
        if (!invoiceType) return 0;
        return calculateGrandTotal(invoiceType, rows);
    }, [invoiceType, rows]);

    const taxAmount = useMemo(() => {
        if (taxRate === null || taxRate <= 0) return 0;
        const subtotal = isFee ? grandTotal - dp : grandTotal;
        return Math.round(subtotal * (taxRate / 100));
    }, [taxRate, grandTotal, isFee, dp]);

    const jumlah = useMemo(() => {
        if (isFee) {
            return (grandTotal - dp) + taxAmount;
        }
        return grandTotal + taxAmount;
    }, [isFee, grandTotal, dp, taxAmount]);

    const terbilangText = useMemo(() => {
        const amount = jumlah;
        if (amount <= 0) return '';
        return terbilangCapitalized(amount);
    }, [jumlah]);

    return {
        columns,
        bankInfo,
        isFee,
        grandTotal,
        dp,
        taxRate,
        taxAmount,
        jumlah,
        terbilangText,
    };
}
