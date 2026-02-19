'use server';

import { db } from '@/db/drizzle';
import { invoices } from '@/db/schema';
import { sql } from 'drizzle-orm';

export interface DashboardStats {
  invoiceTypeStats: { name: string; value: number }[];
  customerStats: { name: string; value: number }[];
  totalInvoices: number;
}

export async function getDashboardStatsAction(): Promise<{ success: boolean; data?: DashboardStats; error?: string }> {
  try {
    // Aggregate total billing amount (grandTotal) by Invoice Type
    const invoiceTypeParams = await db
      .select({
        name: invoices.invoiceTypeName,
        value: sql<number>`cast(coalesce(sum(cast(${invoices.grandTotal} as numeric)), 0) as float)`,
      })
      .from(invoices)
      .groupBy(invoices.invoiceTypeName);

    // Aggregate total billing amount (grandTotal) by Customer Name
    const customerParams = await db
      .select({
        name: invoices.customerName,
        value: sql<number>`cast(coalesce(sum(cast(${invoices.grandTotal} as numeric)), 0) as float)`,
      })
      .from(invoices)
      .groupBy(invoices.customerName);

    const totalInvoicesResult = await db
      .select({ count: sql<number>`cast(count(${invoices.id}) as int)` })
      .from(invoices);

    return {
      success: true,
      data: {
        invoiceTypeStats: invoiceTypeParams,
        customerStats: customerParams,
        totalInvoices: totalInvoicesResult[0]?.count || 0
      },
    };
  } catch (error) {
    console.error('Failed to fetch dashboard stats:', error);
    return { success: false, error: (error as Error).message };
  }
}
