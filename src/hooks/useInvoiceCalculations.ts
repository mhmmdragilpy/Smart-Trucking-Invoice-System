// ============================================================
// useInvoiceCalculations — Hook for invoice business logic
// Now works with 16 Invoice Types instead of customer schemas
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
    jumlah: number;
    terbilangText: string;
}

/**
 * Hook that computes all invoice values from the selected invoice type
 * and the current row data.
 *
 * For FEE types:
 *   - Each row's harga is auto-discounted by 150,000
 *   - Footer shows: Total - DP = Jumlah
 *   - `dp` is a user-editable field (down payment)
 *   - `jumlah` = grandTotal - dp
 *
 * For NON-FEE types:
 *   - Footer shows just: Total
 *   - No DP logic
 */
export function useInvoiceCalculations(
    invoiceType: InvoiceType | null,
    rows: Record<string, unknown>[],
    dp: number = 0,
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

    const jumlah = useMemo(() => {
        if (!isFee) return grandTotal;
        return grandTotal - dp;
    }, [isFee, grandTotal, dp]);

    const terbilangText = useMemo(() => {
        const amount = isFee ? jumlah : grandTotal;
        if (amount <= 0) return '';
        return terbilangCapitalized(amount);
    }, [isFee, jumlah, grandTotal]);

    return {
        columns,
        bankInfo,
        isFee,
        grandTotal,
        dp,
        jumlah,
        terbilangText,
    };
}
