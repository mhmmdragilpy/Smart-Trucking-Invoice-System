// ============================================================
// Zod Validation Schemas — Now uses InvoiceType from customerConfig
// ============================================================

import { z } from 'zod';
import type { InvoiceType } from './customerConfig';

// ── Dynamic row schema based on InvoiceType columns ───────────
export function getRowSchema(invoiceType: InvoiceType) {
    const shape: Record<string, z.ZodTypeAny> = {};

    for (const col of invoiceType.columns) {
        switch (col.type) {
            case 'number':
                shape[col.key] = col.required
                    ? z.number().min(1, `${col.label} wajib diisi`)
                    : z.number().optional().default(0);
                break;
            case 'currency':
                shape[col.key] = col.required
                    ? z.number().min(0, `${col.label} tidak boleh negatif`)
                    : z.number().optional().default(0);
                break;
            case 'date':
                shape[col.key] = col.required
                    ? z.string().min(1, `${col.label} wajib diisi`)
                    : z.string().optional().default('');
                break;
            case 'select':
            case 'text':
            default:
                shape[col.key] = col.required
                    ? z.string().min(1, `${col.label} wajib diisi`)
                    : z.string().optional().default('');
                break;
        }
    }

    return z.object(shape);
}

// ── Invoice Header/Metadata Schema ────────────────────────────
export const invoiceHeaderSchema = z.object({
    invoiceTypeName: z.string().min(1, 'Tipe invoice wajib dipilih'),
    invoiceTypeId: z.number().min(1),
    invoiceNumber: z.string().optional(),
    invoiceDate: z.string().optional(),
    periodeStart: z.string().optional(),
    periodeEnd: z.string().optional(),
});

export type InvoiceHeader = z.infer<typeof invoiceHeaderSchema>;
