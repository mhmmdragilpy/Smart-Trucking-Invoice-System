import { NextResponse } from 'next/server';

const GAS_URL = process.env.NEXT_PUBLIC_GAS_URL || '';

// Demo data aligned with 16 invoice types
const DEMO_DATA = [
    {
        InvoiceNumber: '0001/TML/IMP/2025',
        InvoiceTypeName: 'OB Transfer - PT. ISL',
        InvoiceTypeId: 1,
        BankGroup: 'A',
        IsFee: false,
        InvoiceDate: '2025-01-15',
        PeriodeStart: '2025-01-01',
        PeriodeEnd: '2025-01-15',
        TotalAmount: 7200000,
        DP: 0,
        Jumlah: 7200000,
        Terbilang: 'Tujuh Juta Dua Ratus Ribu Rupiah',
        CreatedAt: '2025-01-15T10:00:00Z',
        RowData: JSON.stringify([
            { no: 1, tanggal: '2025-01-05', consigne: 'PT ABC', noMobil: 'B 9151 FEH', noContainer: 'MRKU2345678', status: 'DRY', size: '40', pickup: 'KOJA', tujuan: 'Padalarang', harga: 3700000, gatePass: 0 },
            { no: 2, tanggal: '2025-01-10', consigne: 'PT XYZ', noMobil: 'F 9142 FL', noContainer: 'TCLU9876543', status: 'DRY', size: '20', pickup: 'JICT', tujuan: 'Subang', harga: 2800000, gatePass: 350000 },
        ]),
    },
    {
        InvoiceNumber: '0002/TML/IMP/2025',
        InvoiceTypeName: 'Transport - PT. LJK (Mba Amel)',
        InvoiceTypeId: 14,
        BankGroup: 'B',
        IsFee: false,
        InvoiceDate: '2025-01-20',
        TotalAmount: 5600000,
        DP: 0,
        Jumlah: 5600000,
        Terbilang: 'Lima Juta Enam Ratus Ribu Rupiah',
        CreatedAt: '2025-01-20T14:30:00Z',
        RowData: JSON.stringify([
            { no: 1, tanggal: '2025-01-18', consigne: 'PT DEF', noMobil: 'B 9805 JH', noContainer: 'SEGU1234567', status: 'DRY', size: '40', pickup: 'PELABUHAN', depo: 'GTM', tujuan: 'Bekasi', harga: 2800000, liftOff: 0, repair: 0 },
            { no: 2, tanggal: '2025-01-19', consigne: 'PT GHI', noMobil: 'B 1234 KLM', noContainer: 'BMOU5678901', status: 'DRY', size: '20', pickup: 'PELABUHAN', depo: 'SINERGI', tujuan: 'Padalarang', harga: 2800000, liftOff: 0, repair: 0 },
        ]),
    },
    {
        InvoiceNumber: '0003/TML/IMP/2025',
        InvoiceTypeName: 'Transport - PT. Hiro (HPA)',
        InvoiceTypeId: 15,
        BankGroup: 'B',
        IsFee: false,
        InvoiceDate: '2025-02-03',
        TotalAmount: 3700000,
        DP: 0,
        Jumlah: 3700000,
        Terbilang: 'Tiga Juta Tujuh Ratus Ribu Rupiah',
        CreatedAt: '2025-02-03T09:15:00Z',
        RowData: JSON.stringify([
            { no: 1, tanggal: '2025-02-01', consigne: 'HIRO WH', noMobil: 'B 5678 NOP', noContainer: 'MSKU3456789', status: 'DRY', size: '40', pickup: 'PELABUHAN', depo: 'GFC', tujuan: 'Padalarang', harga: 3700000, liftOff: 0, rsm: 0 },
        ]),
    },
    {
        InvoiceNumber: '0004/TML/IMP/2025',
        InvoiceTypeName: 'Handling Import FEE - Bpk. Dwi',
        InvoiceTypeId: 5,
        BankGroup: 'A',
        IsFee: true,
        InvoiceDate: '2025-02-10',
        TotalAmount: 7100000,
        DP: 2000000,
        Jumlah: 5100000,
        Terbilang: 'Lima Juta Seratus Ribu Rupiah',
        CreatedAt: '2025-02-10T08:00:00Z',
        RowData: JSON.stringify([
            { no: 1, tanggal: '2025-02-09', consigne: 'Bpk Dwi', noMobil: 'B 4321 QRS', noContainer: 'OOLU1122334', status: 'DRY', size: '40', pickup: 'KOJA', depo: 'GTM', tujuan: 'Padalarang', harga: 3700000, liftOff: 0, perbaikan: 0, parkir: 0, bongkar: 0, demurrage: 0 },
            { no: 2, tanggal: '2025-02-10', consigne: 'Bpk Dwi', noMobil: 'F 6789 TUV', noContainer: 'TCNU4455667', status: 'DRY', size: '20', pickup: 'NPCT1', depo: 'SINERGI', tujuan: 'Cibitung', harga: 3700000, liftOff: 0, perbaikan: 0, parkir: 0, bongkar: 0, demurrage: 0 },
        ]),
    },
    {
        InvoiceNumber: '0005/TML/IMP/2025',
        InvoiceTypeName: 'Handling Imp/Exp - PT. ISL',
        InvoiceTypeId: 2,
        BankGroup: 'A',
        IsFee: false,
        InvoiceDate: '2025-02-12',
        TotalAmount: 4850000,
        DP: 0,
        Jumlah: 4850000,
        Terbilang: 'Empat Juta Delapan Ratus Lima Puluh Ribu Rupiah',
        CreatedAt: '2025-02-12T11:00:00Z',
        RowData: JSON.stringify([
            { no: 1, tanggal: '2025-02-11', consigne: 'ISL DC', noMobil: 'B 7890 TUV', noContainer: 'OOLU1122334', status: 'DRY', size: '40', depo: 'DELTA', tujuan: 'Padalarang', harga: 3700000, liftOff: 0, bongkar: 0 },
            { no: 2, tanggal: '2025-02-12', consigne: 'ISL DC', noMobil: 'F 1122 WXY', noContainer: 'TCNU4455667', status: 'RF', size: '20', depo: 'CCIS', tujuan: 'Cibitung', harga: 1150000, liftOff: 0, bongkar: 0 },
        ]),
    },
    {
        InvoiceNumber: '0006/TML/IMP/2025',
        InvoiceTypeName: 'Transport - PT. Rocket (RSM)',
        InvoiceTypeId: 16,
        BankGroup: 'B',
        IsFee: false,
        InvoiceDate: '2025-02-14',
        TotalAmount: 2800000,
        DP: 0,
        Jumlah: 2800000,
        Terbilang: 'Dua Juta Delapan Ratus Ribu Rupiah',
        CreatedAt: '2025-02-14T16:00:00Z',
        RowData: JSON.stringify([
            { no: 1, tanggal: '2025-02-13', consigne: 'ROCKET WH', noMobil: 'B 3344 ZAB', noContainer: 'HLBU6677889', status: 'DRY', size: '20', pickup: 'PELABUHAN', depo: 'TMJ', tujuan: 'Subang', harga: 2800000, liftOff: 0, rsm: 0, repair: 0 },
        ]),
    },
];

export async function GET() {
    try {
        if (!GAS_URL || GAS_URL.includes('YOUR_DEPLOYMENT_ID')) {
            return NextResponse.json({ success: true, data: DEMO_DATA });
        }
        const response = await fetch(GAS_URL, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
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
