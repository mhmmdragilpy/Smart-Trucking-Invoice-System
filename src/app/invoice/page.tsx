'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import {
    INVOICE_TYPES,
    BANK_ACCOUNTS,
    FEE_DISCOUNT,
    getDefaultRow,
    type InvoiceType,
    type ColumnDef,
} from '@/lib/customerConfig';
import { ALL_DESTINATIONS, lookupPrice, lookupPrices, formatRupiah } from '@/lib/priceDatabase';
import { useInvoiceCalculations } from '@/hooks/useInvoiceCalculations';
import { Save, Plus, Trash2, AlertCircle, CheckCircle, FileDown, Tag } from 'lucide-react';
import { pdf } from '@react-pdf/renderer';
import { CONSIGNEES } from '@/lib/consignees';
import { VEHICLES, CONTAINERS, GATE_PASS_OPTIONS } from '@/lib/referenceData';

export default function InvoicePage() {
    const [selectedType, setSelectedType] = useState<InvoiceType | null>(null);
    const [rows, setRows] = useState<Record<string, unknown>[]>([]);
    const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
    const [periodeStart, setPeriodeStart] = useState('');
    const [periodeEnd, setPeriodeEnd] = useState('');
    const [dp, setDp] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isPdfGenerating, setIsPdfGenerating] = useState(false);
    const [invoiceNumber, setInvoiceNumber] = useState('');
    const [lastInvoiceNumber, setLastInvoiceNumber] = useState(''); // Keep for toast/history if needed
    const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    // ── Payloads & Logic ──────────────────────────────────────
    const { columns, bankInfo, isFee, grandTotal, jumlah, terbilangText } =
        useInvoiceCalculations(selectedType, rows, dp);

    // ── Auto-Generate Invoice Number ──────────────────────────
    useEffect(() => {
        // Fetch existing invoices to determine next number
        const fetchLatest = async () => {
            try {
                const res = await fetch('/api/recap');
                const json = await res.json();
                if (json.success && Array.isArray(json.data)) {
                    // Current Date Info
                    const now = new Date();
                    const year = now.getFullYear();
                    const month = now.getMonth() + 1;
                    const romanMonths = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
                    const romanJs = romanMonths[month];

                    // Filter invoices for current year/month to find max sequence
                    // Format: TML/YYYY/MM/XXX e.g. TML/2026/II/001
                    const prefix = `TML/${year}/${romanJs}/`;

                    let maxSeq = 0;
                    json.data.forEach((inv: any) => {
                        const num = inv.InvoiceNumber || '';
                        if (num.startsWith(prefix)) {
                            const seqPart = num.split('/').pop();
                            const seq = parseInt(seqPart, 10);
                            if (!isNaN(seq) && seq > maxSeq) maxSeq = seq;
                        }
                    });

                    // Generate Next
                    const nextSeq = String(maxSeq + 1).padStart(3, '0');
                    setInvoiceNumber(`${prefix}${nextSeq}`);
                }
            } catch (e) {
                console.error("Failed to fetch info for auto-numbering", e);
                // Fallback
                const now = new Date();
                const roman = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'][now.getMonth() + 1];
                setInvoiceNumber(`TML/${now.getFullYear()}/${roman}/...`);
            }
        };

        fetchLatest();
    }, []);

    // ── Handle invoice type selection ─────────────────────────
    const handleTypeChange = useCallback((typeId: string) => {
        const id = Number(typeId);
        const invoiceType = INVOICE_TYPES.find((t) => t.id === id);
        if (invoiceType) {
            setSelectedType(invoiceType);
            setRows([getDefaultRow(invoiceType, 1)]);
            setDp(0);
        } else {
            setSelectedType(null);
            setRows([]);
        }
    }, []);

    // ── Row management ────────────────────────────────────────
    const addRow = useCallback(() => {
        if (!selectedType) return;
        setRows((prev) => [...prev, getDefaultRow(selectedType, prev.length + 1)]);
    }, [selectedType]);

    const removeRow = useCallback((index: number) => {
        setRows((prev) => {
            const newRows = prev.filter((_, i) => i !== index);
            return newRows.map((row, i) => ({ ...row, no: i + 1 }));
        });
    }, []);

    const updateRow = useCallback((index: number, key: string, value: unknown) => {
        setRows((prev) => {
            const newRows = [...prev];
            newRows[index] = { ...newRows[index], [key]: value };

            // Auto-fill price when tujuan/size changes
            if (key === 'tujuan' || key === 'size') {
                const tujuan = key === 'tujuan' ? (value as string) : (newRows[index].tujuan as string);
                const size = key === 'size' ? (value as string) : (newRows[index].size as string);
                const possiblePrices = lookupPrices(tujuan, size);
                if (possiblePrices.length === 1) {
                    // Exact match (only one option) -> Auto-fill
                    newRows[index] = { ...newRows[index], harga: possiblePrices[0] };
                } else if (possiblePrices.length > 1) {
                    // Multiple options -> Clear price to force selection from dropdown
                    newRows[index] = { ...newRows[index], harga: 0 };
                } else {
                    // No match -> Keep existing or clear? Let's clear if unknown destination
                    // or maybe keep 0
                    if (key === 'tujuan') newRows[index] = { ...newRows[index], harga: 0 };
                }
            }

            return newRows;
        });
    }, []);

    // ── Submit ─────────────────────────────────────────────────
    const handleSubmit = async () => {
        if (!selectedType || rows.length === 0) return;
        setIsSubmitting(true);
        try {
            const payload = {
                invoiceNumber, // [NEW]
                invoiceTypeName: selectedType.name,
                invoiceTypeId: selectedType.id,
                bankGroup: selectedType.bankGroup,
                isFee: selectedType.isFee,
                invoiceDate,
                periodeStart,
                periodeEnd,
                rows,
                totalAmount: grandTotal,
                dp: isFee ? dp : 0,
                jumlah: isFee ? jumlah : grandTotal,
                terbilang: terbilangText,
            };

            const res = await fetch('/api/invoice', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            if (data.success) {
                setLastInvoiceNumber(data.invoiceNumber);
                setToast({ type: 'success', message: `Invoice ${data.invoiceNumber} berhasil disimpan!` });
            } else {
                setToast({ type: 'error', message: data.error || 'Gagal menyimpan invoice' });
            }
        } catch (err) {
            setToast({ type: 'error', message: 'Network error: ' + (err as Error).message });
        } finally {
            setIsSubmitting(false);
            setTimeout(() => setToast(null), 4000);
        }
    };

    // ── Generate PDF ──────────────────────────────────────────
    const handleDownloadPdf = async () => {
        if (!selectedType || rows.length === 0) return;
        setIsPdfGenerating(true);
        try {
            const { default: InvoicePdfComponent } = await import('@/components/InvoicePdf');
            const element = (
                <InvoicePdfComponent
                    invoiceType={selectedType}
                    invoiceNumber={invoiceNumber || 'DRAFT'}
                    invoiceDate={invoiceDate}
                    periodeStart={periodeStart}
                    periodeEnd={periodeEnd}
                    rows={rows}
                    grandTotal={grandTotal}
                    dp={dp}
                    jumlah={jumlah}
                />
            );
            const blob = await pdf(element).toBlob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `Invoice_${selectedType.name.replace(/[^a-zA-Z0-9]/g, '_')}_${invoiceDate}.pdf`;
            link.click();
            URL.revokeObjectURL(url);
            setToast({ type: 'success', message: 'PDF berhasil diunduh!' });
        } catch (err) {
            setToast({ type: 'error', message: 'Gagal generate PDF: ' + (err as Error).message });
        } finally {
            setIsPdfGenerating(false);
            setTimeout(() => setToast(null), 3000);
        }
    };

    // ── Render cell input ─────────────────────────────────────
    const renderCellInput = (col: ColumnDef, row: Record<string, unknown>, rowIndex: number) => {
        const value = row[col.key] ?? '';

        switch (col.type) {
            case 'number':
                if (col.key === 'no') {
                    return (
                        <span style={{ textAlign: 'center', display: 'block', fontWeight: 600, color: 'var(--text-muted)' }}>
                            {rowIndex + 1}
                        </span>
                    );
                }
                return (
                    <input
                        type="number"
                        value={value as number}
                        onChange={(e) => updateRow(rowIndex, col.key, Number(e.target.value) || 0)}
                    />
                );

            case 'date':
                return (
                    <input
                        type="date"
                        value={value as string}
                        onChange={(e) => updateRow(rowIndex, col.key, e.target.value)}
                    />
                );

            case 'select':
                return (
                    <select
                        value={value as string}
                        onChange={(e) => updateRow(rowIndex, col.key, e.target.value)}
                    >
                        <option value="">—</option>
                        {col.options?.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                );

            case 'currency':
                // Check if we have multiple price options for this row's destination
                const currentTujuan = (row['tujuan'] as string) || '';
                const currentSize = (row['size'] as string) || '';
                const priceOptions = currentTujuan ? lookupPrices(currentTujuan, currentSize) : [];

                // Helper to format/parse
                const displayValue = (value as number || '').toLocaleString('id-ID');

                const handleCurrencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                    // Remove non-digits
                    const raw = e.target.value.replace(/\D/g, '');
                    const num = raw ? parseInt(raw, 10) : 0;
                    updateRow(rowIndex, col.key, num);
                };

                return (
                    <>
                        <input
                            type="text"
                            className="currency-input"
                            value={value ? displayValue : ''}
                            placeholder="0"
                            list={col.key === 'gatePass' ? `gatepass-${rowIndex}` : (col.key === 'harga' && priceOptions.length > 0 ? `prices-${rowIndex}` : undefined)}
                            onChange={handleCurrencyChange}
                        />
                        {col.key === 'gatePass' && (
                            <datalist id={`gatepass-${rowIndex}`}>
                                {GATE_PASS_OPTIONS.map((gp) => (
                                    <option key={gp} value={parseInt(gp).toLocaleString('id-ID')} />
                                ))}
                            </datalist>
                        )}
                        {col.key === 'harga' && priceOptions.length > 0 && (
                            <datalist id={`prices-${rowIndex}`}>
                                {priceOptions.map((p) => (
                                    <option key={p} value={p.toLocaleString('id-ID')} />
                                ))}
                            </datalist>
                        )}
                    </>
                );

            case 'text':
            default:
                if (col.key === 'tujuan') {
                    return (
                        <>
                            <input
                                type="text"
                                list={`destinations-${rowIndex}`}
                                value={value as string}
                                placeholder={col.label}
                                onChange={(e) => updateRow(rowIndex, col.key, e.target.value.toUpperCase())}
                            />
                            <datalist id={`destinations-${rowIndex}`}>
                                {ALL_DESTINATIONS.map((d) => (
                                    <option key={d} value={d} />
                                ))}
                            </datalist>
                        </>
                    );
                }
                if (col.key === 'consigne') {
                    return (
                        <>
                            <input
                                type="text"
                                list={`consignees-${rowIndex}`}
                                value={value as string}
                                placeholder={col.label}
                                onChange={(e) => updateRow(rowIndex, col.key, e.target.value.toUpperCase())}
                            />
                            <datalist id={`consignees-${rowIndex}`}>
                                {CONSIGNEES.map((c) => (
                                    <option key={c} value={c} />
                                ))}
                            </datalist>
                        </>
                    );
                }
                if (col.key === 'noMobil') {
                    return (
                        <>
                            <input
                                type="text"
                                list={`vehicles-${rowIndex}`}
                                value={value as string}
                                placeholder={col.label}
                                onChange={(e) => updateRow(rowIndex, col.key, e.target.value.toUpperCase())}
                            />
                            <datalist id={`vehicles-${rowIndex}`}>
                                {VEHICLES.map((v) => (
                                    <option key={v} value={v} />
                                ))}
                            </datalist>
                        </>
                    );
                }
                if (col.key === 'noContainer') {
                    return (
                        <>
                            <input
                                type="text"
                                list={`containers-${rowIndex}`}
                                value={value as string}
                                placeholder={col.label}
                                onChange={(e) => updateRow(rowIndex, col.key, e.target.value.toUpperCase())}
                            />
                            <datalist id={`containers-${rowIndex}`}>
                                {CONTAINERS.map((c) => (
                                    <option key={c} value={c} />
                                ))}
                            </datalist>
                        </>
                    );
                }
                return (
                    <input
                        type="text"
                        value={value as string}
                        placeholder={col.label}
                        onChange={(e) => updateRow(rowIndex, col.key, e.target.value)}
                    />
                );
        }
    };



    return (
        <>
            {/* Toast */}
            {toast && (
                <div className={`toast ${toast.type}`}>
                    {toast.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                    {' '}{toast.message}
                </div>
            )}

            <div className="page-header">
                <h1>Buat Invoice</h1>
                <p>Pilih Tipe Invoice — kolom & template akan menyesuaikan otomatis</p>
            </div>

            {/* Invoice Type Selection */}
            <div className="glass-card" style={{ marginBottom: '20px' }}>
                <div className="form-row">
                    <div className="form-group" style={{ minWidth: '200px' }}>
                        <label className="form-label">No. Invoice (Auto)</label>
                        <input
                            type="text"
                            className="form-input"
                            value={invoiceNumber}
                            onChange={(e) => setInvoiceNumber(e.target.value)}
                            placeholder="INV/YYYY/MM/..."
                            style={{ fontFamily: 'monospace', fontWeight: 600 }}
                        />
                    </div>
                    <div className="form-group" style={{ flex: 2 }}>
                        <label className="form-label">
                            <Tag size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                            Tipe Invoice
                        </label>
                        <select
                            className="form-select"
                            value={selectedType?.id || ''}
                            onChange={(e) => handleTypeChange(e.target.value)}
                        >
                            <option value="">— Pilih Tipe Invoice —</option>
                            {INVOICE_TYPES.map((t) => (
                                <option key={t.id} value={t.id}>
                                    {t.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Tanggal Invoice</label>
                        <input
                            type="date"
                            className="form-input"
                            value={invoiceDate}
                            onChange={(e) => setInvoiceDate(e.target.value)}
                        />
                    </div>

                </div>
            </div>

            {/* Type Badge */}
            {selectedType && (
                <div className="glass-card" style={{ padding: '12px 20px', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span
                            className="schema-badge"
                            style={{
                                background: isFee
                                    ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                                    : 'linear-gradient(135deg, var(--primary-500), var(--primary-600))',
                                color: '#fff',
                                padding: '4px 12px',
                                borderRadius: '6px',
                                fontSize: '12px',
                                fontWeight: 700,
                            }}
                        >
                            {selectedType.name}
                        </span>
                        {isFee && (
                            <span style={{
                                background: 'rgba(245, 158, 11, 0.15)',
                                color: '#f59e0b',
                                padding: '3px 10px',
                                borderRadius: '4px',
                                fontSize: '10px',
                                fontWeight: 700,
                                border: '1px solid rgba(245, 158, 11, 0.3)',
                            }}>
                                FEE — Harga dikurangi Rp 150.000
                            </span>
                        )}
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: 'auto' }}>
                            {columns.length} kolom • {isFee ? 'Total − DP = Jumlah' : 'Total saja'}
                        </span>
                    </div>
                </div>
            )}

            {/* Dynamic Invoice Table */}
            {selectedType && columns.length > 0 && (
                <div className="glass-card" style={{ padding: '16px' }}>
                    <div className="invoice-table-wrapper">
                        <table className="invoice-table">
                            <thead>
                                <tr>
                                    {columns.map((col) => (
                                        <th key={col.key} style={{ minWidth: col.width }}>
                                            {col.label}
                                        </th>
                                    ))}
                                    <th style={{ width: '50px' }}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((row, rowIndex) => (
                                    <tr key={rowIndex}>
                                        {columns.map((col) => (
                                            <td key={col.key}>
                                                {renderCellInput(col, row, rowIndex)}
                                            </td>
                                        ))}
                                        <td className="p-3">
                                            <button
                                                onClick={() => removeRow(rowIndex)}
                                                className="text-red-500 hover:text-red-700 transition"
                                                title="Hapus Baris"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {/* Column Totals Footer */}
                                <tr className="bg-slate-100 font-bold border-t-2 border-slate-300">
                                    {selectedType.columns.map((col) => {
                                        if (col.key === 'no') {
                                            return <td key="total-label" className="p-2 text-center text-xs">TOTAL</td>;
                                        }
                                        if (col.type === 'currency') {
                                            const sum = rows.reduce((acc, r) => acc + (Number(r[col.key]) || 0), 0);
                                            return (
                                                <td key={`total-${col.key}`} className="p-2 text-right text-xs">
                                                    {sum > 0 ? sum.toLocaleString('id-ID') : '-'}
                                                </td>
                                            );
                                        }
                                        return <td key={`total-${col.key}`} className="p-2"></td>;
                                    })}
                                    <td></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div style={{ marginTop: '12px' }}>
                        <button className="btn btn-secondary btn-sm" onClick={addRow}>
                            <Plus size={14} /> Tambah Baris
                        </button>
                    </div>

                    {/* Total Bar — Different for FEE vs NON-FEE */}
                    <div className="total-bar">
                        <div style={{ flex: 1 }}>
                            <div className="total-label">Total</div>
                            <div className="total-amount">{formatRupiah(grandTotal)}</div>
                        </div>

                        {isFee && (
                            <>
                                <div style={{ borderLeft: '1px solid var(--border-primary)', margin: '0 20px', height: '60px' }} />
                                <div style={{ textAlign: 'center' }}>
                                    <div className="total-label">DP (Down Payment)</div>
                                    <input
                                        type="number"
                                        className="currency-input"
                                        style={{
                                            width: '160px',
                                            background: 'var(--bg-elevated)',
                                            border: '2px solid var(--primary-500)',
                                            borderRadius: '8px',
                                            padding: '8px 12px',
                                            fontSize: '16px',
                                            fontWeight: 700,
                                            color: 'var(--text-primary)',
                                            textAlign: 'right',
                                        }}
                                        value={dp || ''}
                                        placeholder="0"
                                        onChange={(e) => setDp(Number(e.target.value) || 0)}
                                    />
                                </div>
                                <div style={{ borderLeft: '1px solid var(--border-primary)', margin: '0 20px', height: '60px' }} />
                                <div style={{ textAlign: 'right' }}>
                                    <div className="total-label" style={{ color: 'var(--accent-400)' }}>Jumlah (Total-DP)</div>
                                    <div className="total-amount" style={{ color: 'var(--accent-400)' }}>
                                        {formatRupiah(jumlah)}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Terbilang */}
                    {terbilangText && (
                        <div style={{
                            padding: '10px 16px',
                            background: 'var(--bg-elevated)',
                            borderRadius: '8px',
                            marginTop: '8px',
                            fontSize: '12px',
                            color: 'var(--text-secondary)',
                            fontStyle: 'italic',
                        }}>
                            <strong>Terbilang:</strong> {terbilangText}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="actions-bar">
                        <button
                            className="btn btn-primary btn-lg"
                            onClick={handleSubmit}
                            disabled={isSubmitting || rows.length === 0}
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="loading-spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
                                    Menyimpan...
                                </>
                            ) : (
                                <>
                                    <Save size={18} />
                                    Simpan ke Google Sheets
                                </>
                            )}
                        </button>
                        <button
                            className="btn btn-secondary btn-lg"
                            onClick={handleDownloadPdf}
                            disabled={isPdfGenerating || rows.length === 0}
                        >
                            {isPdfGenerating ? (
                                <>
                                    <span className="loading-spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <FileDown size={18} />
                                    Download PDF
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}

            {/* Empty State */}
            {!selectedType && (
                <div className="glass-card" style={{ textAlign: 'center', padding: '80px 40px' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                        Pilih Tipe Invoice untuk Mulai
                    </h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', maxWidth: '440px', margin: '0 auto' }}>
                        Ada 16 tipe invoice yang tersedia. Kolom tabel, logika harga, dan template PDF
                        akan menyesuaikan otomatis berdasarkan tipe yang dipilih.
                    </p>
                    <div style={{ marginTop: '24px', display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '11px', padding: '4px 10px', background: 'var(--bg-card)', borderRadius: '6px', color: 'var(--text-muted)' }}>
                            🟦 13 Tipe Grup A (Heri)
                        </span>
                        <span style={{ fontSize: '11px', padding: '4px 10px', background: 'var(--bg-card)', borderRadius: '6px', color: 'var(--text-muted)' }}>
                            🟩 3 Tipe Grup B (Ristummiyati)
                        </span>
                        <span style={{ fontSize: '11px', padding: '4px 10px', background: 'rgba(245, 158, 11, 0.15)', borderRadius: '6px', color: '#f59e0b' }}>
                            🔶 3 Tipe FEE (Harga - 150rb)
                        </span>
                    </div>
                </div>
            )}
        </>
    );
}
