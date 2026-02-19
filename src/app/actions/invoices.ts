'use server';

import { db } from '@/db/drizzle';
import { desc, eq, like } from 'drizzle-orm';
import { invoices, invoiceItems } from '@/db/schema';
import { revalidatePath } from 'next/cache';

// We default to returning a consistent structure
export type ActionResponse<T> = {
    success: boolean;
    data?: T;
    error?: string;
};

export async function getInvoicesAction() {
    try {
        // Use Drizzle Query API to fetch invoices with items
        const results = await db.query.invoices.findMany({
            with: {
                items: true,
            },
            orderBy: [desc(invoices.createdAt)],
        });

        return { success: true, data: results };

    } catch (error) {
        console.error('Failed to fetch invoices via Drizzle:', error);
        return { success: false, error: (error as Error).message };
    }
}

export async function createInvoiceAction(data: any) {
    try {
        const result = await db.transaction(async (tx) => {
            // 1. Insert Invoice Header
            const [newInvoice] = await tx.insert(invoices).values({
                invoiceNumber: data.invoice_number,
                customerName: data.customer_name,
                invoiceTypeId: data.invoice_type_id,
                invoiceTypeName: data.invoice_type_name,
                bankGroup: data.bank_group,
                isFee: data.is_fee,
                invoiceDate: data.invoice_date,
                periodStart: data.period_start || null,
                periodEnd: data.period_end || null,
                totalAmount: data.total_amount?.toString(),
                dp: data.dp?.toString(),
                grandTotal: data.grand_total?.toString(),
                terbilang: data.terbilang,
                status: 'DRAFT',
            }).returning();

            if (!newInvoice) throw new Error("Failed to create invoice header");

            // 2. Insert Items if any
            if (data.items && data.items.length > 0) {
                const itemsPayload = data.items.map((item: any) => ({
                    invoiceId: newInvoice.id,
                    rowNumber: item.row_number,
                    date: item.date,
                    consignee: item.consignee,
                    vehicleNumber: item.vehicle_number,
                    containerNumber: item.container_number,
                    destination: item.destination,
                    depo: item.depo,
                    status: item.status,
                    size: item.size,
                    pickupLocation: item.pickup_location,
                    smartDepo: item.smart_depo,
                    emty: item.emty,
                    price: item.price?.toString(),
                    gatePass: item.gate_pass?.toString(),
                    liftOff: item.lift_off?.toString(),
                    bongkar: item.bongkar?.toString(),
                    perbaikan: item.perbaikan?.toString(),
                    parkir: item.parkir?.toString(),
                    pmp: item.pmp?.toString(),
                    repair: item.repair?.toString(),
                    ngemail: item.ngemail?.toString(),
                    rsm: item.rsm?.toString(),
                    cleaning: item.cleaning?.toString(),
                    stuffing: item.stuffing?.toString(),
                    storage: item.storage?.toString(),
                    demurrage: item.demurrage?.toString(),
                    seal: item.seal?.toString(),
                    others: item.others?.toString(),
                }));
                await tx.insert(invoiceItems).values(itemsPayload);
            }

            return newInvoice;
        });

        revalidatePath('/rekap');
        revalidatePath('/invoice');
        return { success: true, data: result };
    } catch (error) {
        console.error('Failed to create invoice:', error);
        return { success: false, error: (error as Error).message };
    }
}

export async function updateInvoiceAction(id: string, data: any) {
    try {
        const result = await db.transaction(async (tx) => {
            // 1. Update Invoice Header
            const [updatedInvoice] = await tx.update(invoices).set({
                invoiceNumber: data.invoice_number,
                customerName: data.customer_name,
                invoiceTypeId: data.invoice_type_id,
                invoiceTypeName: data.invoice_type_name,
                bankGroup: data.bank_group,
                isFee: data.is_fee,
                invoiceDate: data.invoice_date,
                periodStart: data.period_start || null,
                periodEnd: data.period_end || null,
                totalAmount: data.total_amount?.toString(),
                dp: data.dp?.toString(),
                grandTotal: data.grand_total?.toString(),
                terbilang: data.terbilang,
                updatedAt: new Date(), // Update timestamp
            }).where(eq(invoices.id, id)).returning();

            if (!updatedInvoice) throw new Error("Invoice not found or update failed");

            // 2. Delete Existing Items
            await tx.delete(invoiceItems).where(eq(invoiceItems.invoiceId, id));

            // 3. Insert New Items
            if (data.items && data.items.length > 0) {
                const itemsPayload = data.items.map((item: any) => ({
                    invoiceId: id,
                    rowNumber: item.row_number,
                    date: item.date,
                    consignee: item.consignee,
                    vehicleNumber: item.vehicle_number,
                    containerNumber: item.container_number,
                    destination: item.destination,
                    depo: item.depo,
                    status: item.status,
                    size: item.size,
                    pickupLocation: item.pickup_location,
                    smartDepo: item.smart_depo,
                    emty: item.emty,
                    price: item.price?.toString(),
                    gatePass: item.gate_pass?.toString(),
                    liftOff: item.lift_off?.toString(),
                    bongkar: item.bongkar?.toString(),
                    perbaikan: item.perbaikan?.toString(),
                    parkir: item.parkir?.toString(),
                    pmp: item.pmp?.toString(),
                    repair: item.repair?.toString(),
                    ngemail: item.ngemail?.toString(),
                    rsm: item.rsm?.toString(),
                    cleaning: item.cleaning?.toString(),
                    stuffing: item.stuffing?.toString(),
                    storage: item.storage?.toString(),
                    demurrage: item.demurrage?.toString(),
                    seal: item.seal?.toString(),
                    others: item.others?.toString(),
                }));
                await tx.insert(invoiceItems).values(itemsPayload);
            }

            return updatedInvoice;
        });

        revalidatePath('/rekap');
        revalidatePath('/invoice');
        return { success: true, data: result };
    } catch (error) {
        console.error('Failed to update invoice:', error);
        return { success: false, error: (error as Error).message };
    }
}

export async function deleteInvoiceAction(id: string) {
    try {
        await db.delete(invoices).where(eq(invoices.id, id));
        revalidatePath('/rekap');
        return { success: true };
    } catch (error) {
        console.error('Failed to delete invoice:', error);
        return { success: false, error: (error as Error).message };
    }
}

export async function getInvoiceByIdAction(id: string) {
    try {
        const result = await db.query.invoices.findFirst({
            where: eq(invoices.id, id),
            with: {
                items: true,
            },
        });

        if (!result) {
            return { success: false, error: 'Invoice not found' };
        }

        return { success: true, data: result };
    } catch (error) {
        console.error('Failed to get invoice by id:', error);
        return { success: false, error: (error as Error).message };
    }
}

export async function getLatestInvoiceNumberAction(prefix: string) {
    try {
        const result = await db.query.invoices.findFirst({
            columns: {
                invoiceNumber: true,
            },
            where: like(invoices.invoiceNumber, `${prefix}%`),
            orderBy: [desc(invoices.createdAt)],
        });

        return { success: true, data: result };
    } catch (error) {
        console.error('Failed to get latest invoice number:', error);
        return { success: false, error: (error as Error).message };
    }
}
