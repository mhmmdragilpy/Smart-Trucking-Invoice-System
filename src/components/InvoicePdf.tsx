// ============================================================
// InvoicePdf — Client-side PDF generator for all 16 invoice types
// Uses @react-pdf/renderer
// ============================================================

import {
    Document,
    Page,
    Text,
    View,
    Image,
    StyleSheet,
    Font,
} from '@react-pdf/renderer';
import {
    type InvoiceType,
    BANK_ACCOUNTS,
    FEE_DISCOUNT,
    calculateRowTotal,
} from '@/lib/customerConfig';
import { terbilangCapitalized } from '@/lib/terbilang';
import { TTD_HERI_BASE64 } from '@/lib/pdfAssets';

// ── Props ─────────────────────────────────────────────────────
interface InvoicePdfProps {
    invoiceType: InvoiceType;
    invoiceNumber: string;
    invoiceDate: string;
    periodeStart: string;
    periodeEnd: string;
    rows: Record<string, unknown>[];
    grandTotal: number;
    dp: number;
    jumlah: number;
}

// ── Styles ────────────────────────────────────────────────────
const s = StyleSheet.create({
    page: { padding: 30, fontFamily: 'Helvetica', fontSize: 8 },
    header: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
    headerRight: { marginLeft: 12, flexDirection: 'column', justifyContent: 'center' },
    companyName: { fontSize: 16, fontWeight: 'bold', fontFamily: 'Helvetica-Bold', color: '#1e293b' },
    companyTag: { fontSize: 9, fontWeight: 'bold', letterSpacing: 0.5, fontFamily: 'Helvetica-Bold', color: '#475569', marginTop: 2 },
    companyAddr: { fontSize: 8, color: '#475569', marginTop: 2, lineHeight: 1.3 },
    divider: { borderBottom: '1px solid #cbd5e1', marginVertical: 2 },
    metaContainer: {
        backgroundColor: '#f8fafc',
        borderRadius: 4,
        padding: 8,
        marginBottom: 8,
        border: '1px solid #e2e8f0'
    },
    metaRow: { flexDirection: 'row', justifyContent: 'space-between' },
    metaBlock: { flex: 1 },
    metaLabel: { fontSize: 6.5, color: '#64748b', marginBottom: 1, textTransform: 'uppercase', letterSpacing: 0.5 },
    metaValue: { fontSize: 8.5, fontWeight: 'bold', fontFamily: 'Helvetica-Bold', color: '#0f172a' },
    table: { marginTop: 4, marginBottom: 8 },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#1a1a2e',
        paddingVertical: 4,
        paddingHorizontal: 2,
    },
    tableHeaderCell: {
        color: '#fff',
        fontSize: 6.5,
        fontFamily: 'Helvetica-Bold',
        textAlign: 'center',
        paddingHorizontal: 2,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 0.5,
        borderBottomColor: '#ddd',
        paddingVertical: 3,
        paddingHorizontal: 2,
    },
    tableRowAlt: {
        backgroundColor: '#f7f7fb',
    },
    tableCell: {
        fontSize: 7,
        textAlign: 'center',
        paddingHorizontal: 2,
    },
    tableCellRight: {
        fontSize: 7,
        textAlign: 'right',
        paddingHorizontal: 2,
    },
    footerSection: { marginTop: 6, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#222' },
    footerRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 },
    footerLabel: { fontSize: 9, fontFamily: 'Helvetica-Bold' },
    footerValue: { fontSize: 10, fontFamily: 'Helvetica-Bold' },
    footerFeeLabel: { fontSize: 9, fontFamily: 'Helvetica-Bold', color: '#d97706' },
    footerFeeValue: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: '#d97706' },
    footerJumlahLabel: { fontSize: 11, fontFamily: 'Helvetica-Bold', color: '#1a1a2e' },
    footerJumlahValue: { fontSize: 12, fontFamily: 'Helvetica-Bold', color: '#1a1a2e' },
    terbilang: { fontSize: 8, fontStyle: 'italic', color: '#444', marginTop: 6 },
    bankSection: {
        marginTop: 16,
        padding: 10,
        backgroundColor: '#f0f4ff',
        borderRadius: 4,
    },
    bankLabel: { fontSize: 7, color: '#666' },
    bankValue: { fontSize: 9, fontFamily: 'Helvetica-Bold', marginTop: 1 },
    feeBadge: {
        backgroundColor: '#fef3c7',
        color: '#92400e',
        fontSize: 7,
        fontFamily: 'Helvetica-Bold',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 3,
    },
});

// ── Formatting ────────────────────────────────────────────────
function fmtRp(n: number): string {
    return 'Rp ' + n.toLocaleString('id-ID');
}

function fmtDate(d: string): string {
    if (!d) return '-';
    try {
        return new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
    } catch {
        return d;
    }
}

// ── Column widths (proportional) ──────────────────────────────
function getColWidths(colCount: number): string[] {
    // Give first col (NO) and small selects less space, currency cols more
    // We'll just distribute evenly for simplicity
    const w = (100 / colCount).toFixed(1) + '%';
    return Array(colCount).fill(w);
}

// ── Component ─────────────────────────────────────────────────
export default function InvoicePdf({
    invoiceType,
    invoiceNumber,
    invoiceDate,
    periodeStart,
    periodeEnd,
    rows,
    grandTotal,
    dp,
    jumlah,
}: InvoicePdfProps) {
    const bank = BANK_ACCOUNTS[invoiceType.bankGroup];
    const cols = invoiceType.columns;
    const widths = getColWidths(cols.length);
    const finalAmount = invoiceType.isFee ? jumlah : grandTotal;
    const terbilang = terbilangCapitalized(Math.max(0, finalAmount));

    return (
        <Document>
            <Page size="A4" orientation="landscape" style={s.page}>
                {/* Company Header */}
                {/* Company Header */}
                <View style={s.header}>
                    <Image
                        src="/logo.png"
                        style={{ width: 80, height: 80, objectFit: 'contain' }}
                    />
                    <View style={s.headerRight}>
                        <Text style={s.companyName}>PT. TUNGGAL MANDIRI LOGISTIK</Text>
                        <Text style={s.companyTag}>JASA ANGKUTAN DARAT (TRUCKING)</Text>
                        <Text style={s.companyAddr}>
                            Jl. Bugis Raya No. 54, Tanjung Priok, Jakarta Utara{'\n'}
                            Email: tunggalmandirilogistik@gmail.com
                        </Text>
                    </View>
                </View>

                <View style={s.divider} />

                {/* Invoice Meta */}
                <View style={s.metaContainer}>
                    <View style={s.metaRow}>
                        <View style={s.metaBlock}>
                            <Text style={s.metaLabel}>kepada</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                <Text style={s.metaValue}>{invoiceType.customerName}</Text>
                                {invoiceType.isFee && (
                                    <Text style={s.feeBadge}>FEE</Text>
                                )}
                            </View>
                        </View>
                        <View style={s.metaBlock}>
                            <Text style={s.metaLabel}>No Invoice</Text>
                            <Text style={s.metaValue}>{invoiceNumber}</Text>
                        </View>
                        <View style={s.metaBlock}>
                            <Text style={s.metaLabel}>Tanggal</Text>
                            <Text style={s.metaValue}>{fmtDate(invoiceDate)}</Text>
                        </View>

                    </View>
                </View>

                {/* Data Table */}
                <View style={s.table}>
                    {/* Header Row */}
                    <View style={s.tableHeader}>
                        {cols.map((col, i) => (
                            <Text
                                key={col.key}
                                style={[s.tableHeaderCell, { width: widths[i] }]}
                            >
                                {col.label}
                            </Text>
                        ))}
                    </View>

                    {/* Data Rows */}
                    {rows.map((row, rowIdx) => {
                        const rowTotal = calculateRowTotal(invoiceType, row);
                        return (
                            <View
                                key={rowIdx}
                                style={[s.tableRow, rowIdx % 2 === 1 ? s.tableRowAlt : {}]}
                            >
                                {cols.map((col, i) => {
                                    const val = row[col.key];
                                    const isCurrency = col.type === 'currency';
                                    let displayVal = '';

                                    if (col.key === 'no') {
                                        displayVal = String(rowIdx + 1);
                                    } else if (isCurrency) {
                                        const numVal = Number(val) || 0;
                                        displayVal = numVal > 0 ? numVal.toLocaleString('id-ID') : '-';
                                    } else {
                                        displayVal = val ? String(val) : '-';
                                    }

                                    return (
                                        <Text
                                            key={col.key}
                                            style={[
                                                isCurrency ? s.tableCellRight : s.tableCell,
                                                { width: widths[i] },
                                            ]}
                                        >
                                            {displayVal}
                                        </Text>
                                    );
                                })}
                            </View>
                        );
                    })}

                    {/* Footer Row (Column Totals) */}
                    <View style={[s.tableRow, { backgroundColor: '#e2e8f0', borderTopWidth: 1, borderTopColor: '#94a3b8' }]}>
                        {cols.map((col, i) => {
                            let displayVal = '';
                            let isCurrency = false;

                            if (col.key === 'no') {
                                displayVal = 'TOTAL';
                            } else if (col.type === 'currency') {
                                isCurrency = true;
                                const sum = rows.reduce((acc, r) => acc + (Number(r[col.key]) || 0), 0);
                                displayVal = sum > 0 ? sum.toLocaleString('id-ID') : '-';
                            }

                            return (
                                <Text
                                    key={`total-${col.key}`}
                                    style={[
                                        isCurrency ? s.tableCellRight : s.tableCell,
                                        { width: widths[i], fontFamily: 'Helvetica-Bold', fontSize: 7 }
                                    ]}
                                >
                                    {displayVal}
                                </Text>
                            );
                        })}
                    </View>
                </View>

                {/* Footer — Total / DP / Jumlah */}
                <View style={s.footerSection}>
                    <View style={s.footerRow}>
                        <Text style={s.footerLabel}>TOTAL</Text>
                        <Text style={s.footerValue}>{fmtRp(grandTotal)}</Text>
                    </View>

                    {invoiceType.isFee && (
                        <>
                            <View style={s.footerRow}>
                                <Text style={s.footerFeeLabel}>DP (Down Payment)</Text>
                                <Text style={s.footerFeeValue}>- {fmtRp(dp)}</Text>
                            </View>
                            <View style={[s.divider, { marginVertical: 3 }]} />
                            <View style={s.footerRow}>
                                <Text style={s.footerJumlahLabel}>JUMLAH</Text>
                                <Text style={s.footerJumlahValue}>{fmtRp(jumlah)}</Text>
                            </View>
                        </>
                    )}

                    <Text style={s.terbilang}>Terbilang: {terbilang}</Text>
                </View>

                {/* Bank Info + Signature */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
                    {/* Bank Info (Left) */}
                    <View style={[s.bankSection, { flex: 1, marginRight: 40 }]}>
                        <Text style={s.bankLabel}>Pembayaran ke:</Text>
                        <Text style={s.bankValue}>
                            {bank.bankName} — {bank.accountNumber}
                        </Text>
                        <Text style={[s.bankValue, { fontSize: 8, marginTop: 2 }]}>
                            A/N: {bank.accountHolder}
                        </Text>
                    </View>

                    {/* Signature (Right) */}
                    <View style={{ width: 180, textAlign: 'center' }}>
                        <Text style={{ fontSize: 8, color: '#444', marginBottom: 4 }}>
                            Jakarta, {fmtDate(invoiceDate)}
                        </Text>
                        <Text style={{ fontSize: 8, fontFamily: 'Helvetica-Bold', marginBottom: 2 }}>
                            Hormat Kami,
                        </Text>
                        {/* Signature image */}
                        <Image src={TTD_HERI_BASE64} style={{ width: 80, height: 60, alignSelf: 'center', marginTop: 2, marginBottom: 2, objectFit: 'contain' }} />
                        <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold', marginTop: 2 }}>
                            HERI PURWANTO
                        </Text>

                    </View>
                </View>
            </Page>
        </Document>
    );
}
