import { NextRequest, NextResponse } from 'next/server';

const GAS_URL = process.env.NEXT_PUBLIC_GAS_URL || '';

export async function POST(request: NextRequest) {
    try {
        const payload = await request.json();

        if (!GAS_URL || GAS_URL.includes('YOUR_DEPLOYMENT_ID')) {
            // Demo mode — return mock success
            const mockInvoiceNumber = `${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}/TML/IMP/${new Date().getFullYear()}`;
            return NextResponse.json({
                success: true,
                invoiceNumber: mockInvoiceNumber,
                message: `[DEMO] Invoice ${mockInvoiceNumber} berhasil disimpan!`,
            });
        }

        // GAS is pure CRUD — just forward the payload
        // totalAmount & terbilang already computed by React
        const response = await fetch(GAS_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            { success: false, error: (error as Error).message },
            { status: 500 }
        );
    }
}
