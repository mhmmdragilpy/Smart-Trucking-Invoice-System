'use client';

import { useState, useCallback, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
    INVOICE_TYPES,
    BANK_ACCOUNTS,
    FEE_DISCOUNT,
    getDefaultRow,
    type InvoiceType,
    type ColumnDef,
} from '@/lib/customerConfig';
import { ALL_DESTINATIONS, lookupPrice, lookupPrices, formatRupiah } from '@/lib/data/priceData';
import { useInvoiceCalculations } from '@/hooks/useInvoiceCalculations';
import { Save, Plus, Trash2, AlertCircle, CheckCircle, FileDown, Tag, Loader2, ArrowLeft, Percent, Copy } from 'lucide-react';
import { pdf } from '@react-pdf/renderer';
import { CONSIGNEES, VEHICLES, CONTAINERS, GATE_PASS_OPTIONS } from '@/lib/data/masterData';
import { createInvoiceAction, updateInvoiceAction, getInvoiceByIdAction, getLatestInvoiceNumberAction } from '@/app/actions/invoices';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function InvoicePage() {
    return (
        <Suspense fallback={<div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>}>
            <InvoiceEditor />
        </Suspense>
    );
}

function InvoiceEditor() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const editId = searchParams.get('id');
    const isEditMode = !!editId;

    const [selectedType, setSelectedType] = useState<InvoiceType | null>(null);
    const [rows, setRows] = useState<Record<string, unknown>[]>([]);
    const [invoiceNumber, setInvoiceNumber] = useState('');
    const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
    const [periodeStart, setPeriodeStart] = useState('');
    const [periodeEnd, setPeriodeEnd] = useState('');
    const [dp, setDp] = useState(0);
    const [taxRate, setTaxRate] = useState<number | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isPdfGenerating, setIsPdfGenerating] = useState(false);

    // ── Payloads & Logic ──────────────────────────────────────
    const { columns, isFee, grandTotal, jumlah, taxAmount, terbilangText } =
        useInvoiceCalculations(selectedType, rows, dp, taxRate);

    // ── Load Invoice for Edit ─────────────────────────────────
    useEffect(() => {
        if (!editId) return;

        const loadInvoice = async () => {
            const result = await getInvoiceByIdAction(editId);

            if (!result.success || !result.data) {
                toast.error('Invoice tidak ditemukan');
                // Ensure rows are cleared if not found, or handle redirect
                return;
            }

            const invoiceData = result.data;

            const type = INVOICE_TYPES.find(t => t.id === invoiceData.invoiceTypeId); // Drizzle returns camelCase
            if (type) setSelectedType(type);

            setInvoiceNumber(invoiceData.invoiceNumber);
            setInvoiceDate(invoiceData.invoiceDate);
            setPeriodeStart(invoiceData.periodStart || '');
            setPeriodeEnd(invoiceData.periodEnd || '');
            setDp(Number(invoiceData.dp) || 0);
            setTaxRate(invoiceData.taxRate != null ? Number(invoiceData.taxRate) : null);

            if (invoiceData.items && Array.isArray(invoiceData.items)) {
                // items from Drizzle query are already joined
                const sortedItems = invoiceData.items.sort((a: any, b: any) => a.rowNumber - b.rowNumber);
                const mappedRows = sortedItems.map((item: any) => ({
                    no: item.rowNumber,
                    tanggal: item.date,
                    consigne: item.consignee,
                    noMobil: item.vehicleNumber,
                    noContainer: item.containerNumber,
                    tujuan: item.destination,
                    depo: item.depo,
                    status: item.status,
                    size: item.size,
                    pickup: item.pickupLocation,
                    smartDepo: item.smartDepo,
                    emty: item.emty,
                    harga: Number(item.price) || 0,
                    gatePass: Number(item.gatePass) || 0,
                    liftOff: Number(item.liftOff) || 0,
                    bongkar: Number(item.bongkar) || 0,
                    perbaikan: Number(item.perbaikan) || 0,
                    parkir: Number(item.parkir) || 0,
                    pmp: Number(item.pmp) || 0,
                    repair: Number(item.repair) || 0,
                    ngemail: Number(item.ngemail) || 0,
                    rsm: Number(item.rsm) || 0,
                    cleaning: Number(item.cleaning) || 0,
                    stuffing: Number(item.stuffing) || 0,
                    storage: Number(item.storage) || 0,
                    demurrage: Number(item.demurrage) || 0,
                    seal: Number(item.seal) || 0,
                    others: Number(item.others) || 0,
                }));
                setRows(mappedRows);
            }
        };

        loadInvoice();
    }, [editId]);

    // ── Auto-Numbering ────────────────────────────────────────
    useEffect(() => {
        if (isEditMode) return;
        const fetchLatest = async () => {
            try {
                const now = new Date();
                const year = now.getFullYear();
                const month = now.getMonth() + 1;
                const romanMonths = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
                const romanJs = romanMonths[month];
                const prefix = `INV/TML/IMP/${year}/${romanJs}/`;

                const result = await getLatestInvoiceNumberAction(prefix);

                let nextSeq = '001';
                if (result.success && result.data) {
                    const lastNum = result.data.invoiceNumber;
                    const parts = lastNum.split('/');
                    const lastSeq = parseInt(parts[parts.length - 1], 10);
                    if (!isNaN(lastSeq)) {
                        nextSeq = String(lastSeq + 1).padStart(3, '0');
                    }
                }
                setInvoiceNumber(`${prefix}${nextSeq}`);
            } catch (e) {
                console.error("Auto-number error", e);
            }
        };
        fetchLatest();
    }, [isEditMode]);

    // ── Handlers ──────────────────────────────────────────────
    const handleTypeChange = useCallback((typeId: string) => {
        const id = Number(typeId);
        const invoiceType = INVOICE_TYPES.find((t) => t.id === id);
        if (invoiceType) {
            setSelectedType(invoiceType);
            if (!isEditMode && rows.length === 0) {
                setRows([getDefaultRow(invoiceType, 1)]);
            }
            if (!isEditMode) setDp(0);
        } else {
            setSelectedType(null);
            setRows([]);
        }
    }, [isEditMode, rows.length]);

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

    const copyRow = useCallback((index: number) => {
        setRows((prev) => {
            const cloned = { ...prev[index] };
            const newRows = [...prev.slice(0, index + 1), cloned, ...prev.slice(index + 1)];
            return newRows.map((row, i) => ({ ...row, no: i + 1 }));
        });
    }, []);

    const updateRow = useCallback((index: number, key: string, value: unknown) => {
        setRows((prev) => {
            const newRows = [...prev];
            newRows[index] = { ...newRows[index], [key]: value };

            if (key === 'tujuan' || key === 'size') {
                const tujuan = key === 'tujuan' ? (value as string) : (newRows[index].tujuan as string);
                const size = key === 'size' ? (value as string) : (newRows[index].size as string);
                const possiblePrices = lookupPrices(tujuan, size);
                if (possiblePrices.length === 1) {
                    newRows[index] = { ...newRows[index], harga: possiblePrices[0] };
                } else if (possiblePrices.length > 1) {
                    newRows[index] = { ...newRows[index], harga: 0 };
                } else {
                    if (key === 'tujuan') newRows[index] = { ...newRows[index], harga: 0 };
                }
            }
            return newRows;
        });
    }, []);

    const handleSubmit = async () => {
        if (!selectedType || rows.length === 0) return;
        if (!invoiceNumber || !selectedType.customerName) {
            toast.error('Data tidak lengkap (No Invoice / Customer)');
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                invoice_number: invoiceNumber,
                customer_name: selectedType.customerName,
                invoice_type_id: selectedType.id,
                invoice_type_name: selectedType.name,
                bank_group: selectedType.bankGroup,
                is_fee: selectedType.isFee,
                invoice_date: invoiceDate,
                period_start: periodeStart || null,
                period_end: periodeEnd || null,
                total_amount: grandTotal,
                dp: isFee ? dp : 0,
                grand_total: jumlah,
                tax_rate: taxRate,
                tax_amount: taxAmount,
                terbilang: terbilangText,
                items: rows.map(r => ({
                    row_number: r.no,
                    date: r.tanggal,
                    consignee: r.consigne,
                    vehicle_number: r.noMobil,
                    container_number: r.noContainer,
                    destination: r.tujuan,
                    depo: r.depo,
                    status: r.status,
                    size: r.size,
                    pickup_location: r.pickup,
                    smart_depo: r.smartDepo,
                    emty: r.emty,
                    price: Number(r.harga) || 0,
                    gate_pass: Number(r.gatePass) || 0,
                    lift_off: Number(r.liftOff) || 0,
                    bongkar: Number(r.bongkar) || 0,
                    perbaikan: Number(r.perbaikan) || 0,
                    parkir: Number(r.parkir) || 0,
                    pmp: Number(r.pmp) || 0,
                    repair: Number(r.repair) || 0,
                    ngemail: Number(r.ngemail) || 0,
                    rsm: Number(r.rsm) || 0,
                    cleaning: Number(r.cleaning) || 0,
                    stuffing: Number(r.stuffing) || 0,
                    storage: Number(r.storage) || 0,
                    demurrage: Number(r.demurrage) || 0,
                    seal: Number(r.seal) || 0,
                    others: Number(r.others) || 0,
                }))
            };

            let result;
            if (isEditMode && editId) {
                result = await updateInvoiceAction(editId, payload);
            } else {
                result = await createInvoiceAction(payload);
            }

            if (!result.success) {
                throw new Error(result.error);
            }

            toast.success(`Invoice ${invoiceNumber} berhasil disimpan!`);
            setTimeout(() => router.push('/rekap'), 1500);

        } catch (err) {
            toast.error('Gagal menyimpan: ' + (err as Error).message);
        } finally {
            setIsSubmitting(false);
        }
    };

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
                    taxRate={taxRate}
                    taxAmount={taxAmount}
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
            toast.success('PDF berhasil diunduh');
        } catch (err) {
            toast.error('Gagal generate PDF');
        } finally {
            setIsPdfGenerating(false);
        }
    };

    // ── Render Helpers ────────────────────────────────────────
    const renderCellInput = (col: ColumnDef, row: Record<string, unknown>, rowIndex: number) => {
        const value = row[col.key] ?? '';

        if (col.key === 'no') {
            return <div className="text-center font-bold text-slate-500">{rowIndex + 1}</div>;
        }

        const commonClasses = "h-8 text-xs"; // Compact inputs for table

        if (col.type === 'select') {
            return (
                <div className="min-w-[100px]">
                    <select
                        className="flex h-8 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-1 text-xs placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus:ring-slate-300"
                        value={value as string}
                        onChange={(e) => updateRow(rowIndex, col.key, e.target.value)}
                    >
                        <option value="">—</option>
                        {col.options?.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                </div>
            );
        }

        if (col.type === 'date') {
            return (
                <Input
                    type="date"
                    className={commonClasses}
                    value={value as string}
                    onChange={(e) => updateRow(rowIndex, col.key, e.target.value)}
                />
            );
        }

        if (col.type === 'currency' || col.type === 'number') {
            const currentTujuan = (row['tujuan'] as string) || '';
            const currentSize = (row['size'] as string) || '';
            const priceOptions = col.key === 'harga' && currentTujuan ? lookupPrices(currentTujuan, currentSize) : [];

            return (
                <>
                    <Input
                        type="text"
                        className={`${commonClasses} text-right font-mono`}
                        value={value ? (value as number).toLocaleString('id-ID') : ''}
                        placeholder="0"
                        list={col.key === 'gatePass' ? `gatepass-${rowIndex}` : (col.key === 'harga' && priceOptions.length > 0 ? `prices-${rowIndex}` : undefined)}
                        onChange={(e) => {
                            const raw = e.target.value.replace(/\D/g, '');
                            updateRow(rowIndex, col.key, raw ? parseInt(raw, 10) : 0);
                        }}
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
        }

        // Default Text with Datalist support
        let listId = undefined;
        let options: string[] = [];

        if (col.key === 'tujuan') { listId = `dest-${rowIndex}`; options = ALL_DESTINATIONS; }
        if (col.key === 'consigne') { listId = `cons-${rowIndex}`; options = CONSIGNEES; }
        if (col.key === 'noMobil') { listId = `veh-${rowIndex}`; options = VEHICLES; }
        if (col.key === 'noContainer') { listId = `cont-${rowIndex}`; options = CONTAINERS; }

        return (
            <>
                <Input
                    type="text"
                    className={commonClasses}
                    value={value as string}
                    onChange={(e) => updateRow(rowIndex, col.key, col.key === 'tujuan' || col.key.includes('no') ? e.target.value.toUpperCase() : e.target.value)}
                    list={listId}
                    placeholder={col.label}
                />
                {listId && (
                    <datalist id={listId}>
                        {options.map(opt => <option key={opt} value={opt} />)}
                    </datalist>
                )}
            </>
        );
    };

    return (
        <div className="space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.push('/rekap')}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        {isEditMode ? 'Edit Invoice' : 'Buat Invoice Baru'}
                    </h1>
                    <p className="text-slate-500 text-sm">
                        {isEditMode ? `Memperbarui invoice ${invoiceNumber}` : 'Isi form di bawah untuk membuat invoice baru.'}
                    </p>
                </div>
            </div>

            {/* Header Configuration */}
            <Card className="border-t-4 border-t-blue-500 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Tag className="h-4 w-4 text-blue-500" /> Informasi Dasar
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <div className="space-y-2">
                        <Label>Tipe Invoice</Label>
                        <Select
                            value={selectedType?.id.toString() || ''}
                            onValueChange={handleTypeChange}
                            disabled={isEditMode}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih Tipe Invoice" />
                            </SelectTrigger>
                            <SelectContent>
                                {INVOICE_TYPES.map(t => (
                                    <SelectItem key={t.id} value={t.id.toString()}>
                                        {t.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>No. Invoice</Label>
                        <Input
                            value={invoiceNumber}
                            onChange={e => setInvoiceNumber(e.target.value)}
                            className="font-mono font-semibold"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Tanggal Invoice</Label>
                        <Input
                            type="date"
                            value={invoiceDate}
                            onChange={e => setInvoiceDate(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Periode (Opsional)</Label>
                        <div className="flex items-center gap-2">
                            <Input
                                type="date"
                                value={periodeStart}
                                onChange={e => setPeriodeStart(e.target.value)}
                            />
                            <span className="text-slate-400">-</span>
                            <Input
                                type="date"
                                value={periodeEnd}
                                onChange={e => setPeriodeEnd(e.target.value)}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Tax Configuration */}
            <Card className="border-t-4 border-t-emerald-500 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Percent className="h-4 w-4 text-emerald-500" /> Pajak (Opsional)
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="flex items-center gap-3">
                        <Switch
                            id="tax-toggle"
                            checked={taxRate !== null}
                            onCheckedChange={(checked) => {
                                if (checked) {
                                    setTaxRate(1);
                                } else {
                                    setTaxRate(null);
                                }
                            }}
                        />
                        <Label htmlFor="tax-toggle" className="font-medium">
                            {taxRate !== null ? 'Pajak Aktif' : 'Tanpa Pajak'}
                        </Label>
                    </div>
                    {taxRate !== null && (
                        <div className="flex items-center gap-2">
                            <Label className="text-sm text-slate-500">Tarif:</Label>
                            <Select
                                value={taxRate.toString()}
                                onValueChange={(val) => setTaxRate(Number(val))}
                            >
                                <SelectTrigger className="w-[120px]">
                                    <SelectValue placeholder="Pilih %" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Array.from({ length: 19 }, (_, i) => {
                                        const rate = 1 + i * 0.5;
                                        return (
                                            <SelectItem key={rate} value={rate.toString()}>
                                                {rate % 1 === 0 ? rate.toFixed(0) : rate.toFixed(1)}%
                                            </SelectItem>
                                        );
                                    })}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                    {taxRate !== null && grandTotal > 0 && (
                        <div className="text-sm text-emerald-700 bg-emerald-50 dark:bg-emerald-950/30 dark:text-emerald-400 px-3 py-1.5 rounded-lg font-medium">
                            Pajak: {formatRupiah(taxAmount)}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Main Content */}
            {selectedType ? (
                <div className="space-y-6">
                    <Card className="shadow-lg overflow-hidden border-0 ring-1 ring-slate-200 dark:ring-slate-700">
                        <div className="bg-slate-50 dark:bg-slate-900 border-b p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Badge variant={isFee ? 'secondary' : 'default'} className={isFee ? 'bg-amber-100 text-amber-800 hover:bg-amber-200' : 'bg-blue-100 text-blue-800 hover:bg-blue-200'}>
                                    {selectedType.name}
                                </Badge>
                                {isFee && <span className="text-xs font-medium text-amber-600">FEE Mode (Potongan Rp 150rb)</span>}
                            </div>
                            <div className="text-xs text-slate-500">
                                {rows.length} baris data
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <div className="min-w-max p-4">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="hover:bg-transparent">
                                            {columns.map((col) => (
                                                <TableHead key={col.key} style={{ width: col.width }} className="whitespace-nowrap">
                                                    {col.label}
                                                </TableHead>
                                            ))}
                                            <TableHead className="w-[50px]"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {rows.map((row, rowIndex) => (
                                            <TableRow key={rowIndex} className="hover:bg-slate-50/50">
                                                {columns.map((col) => (
                                                    <TableCell key={col.key} className="p-2">
                                                        {renderCellInput(col, row, rowIndex)}
                                                    </TableCell>
                                                ))}
                                                <TableCell className="p-2 text-center">
                                                    <div className="flex items-center gap-1 justify-center">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                                                            onClick={() => copyRow(rowIndex)}
                                                            title="Duplikat baris"
                                                        >
                                                            <Copy size={16} />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                                                            onClick={() => removeRow(rowIndex)}
                                                        >
                                                            <Trash2 size={16} />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>

                        <div className="p-4 border-t bg-slate-50/50">
                            <Button variant="outline" onClick={addRow} className="gap-2 text-blue-600 border-blue-200 hover:bg-blue-50">
                                <Plus size={16} /> Tambah Baris
                            </Button>
                        </div>
                    </Card>

                    {/* Footer Totals */}
                    <Card className="bg-slate-900 text-white border-0 shadow-xl">
                        <CardContent className="p-6">
                            <div className="grid md:grid-cols-2 gap-8 items-center">
                                <div>
                                    <div className="text-slate-400 text-sm mb-1 uppercase tracking-wider font-semibold">Total Tagihan</div>
                                    <div className="text-4xl font-bold tracking-tight text-white mb-2">
                                        {formatRupiah(jumlah)}
                                    </div>
                                    <div className="text-slate-400 italic text-sm border-l-2 border-blue-500 pl-3">
                                        "{terbilangText}"
                                    </div>
                                </div>

                                <div className="flex flex-col gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-300">Subtotal</span>
                                        <span className="font-mono">{formatRupiah(grandTotal)}</span>
                                    </div>

                                    {isFee && (
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-amber-400 font-medium">Potongan DP</span>
                                            <div className="w-32">
                                                <Input
                                                    type="number"
                                                    className="h-8 text-right bg-slate-800 border-slate-700 text-white"
                                                    value={dp}
                                                    onChange={e => setDp(Number(e.target.value) || 0)}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {taxRate !== null && taxRate > 0 && (
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-emerald-400 font-medium">Pajak ({taxRate}%)</span>
                                            <span className="font-mono text-emerald-400">+ {formatRupiah(taxAmount)}</span>
                                        </div>
                                    )}

                                    {(isFee || (taxRate !== null && taxRate > 0)) && (
                                        <>
                                            <Separator className="bg-white/10" />
                                            <div className="flex justify-between items-center">
                                                <span className="font-bold text-lg text-blue-400">Total Akhir</span>
                                                <span className="font-bold text-2xl font-mono">{formatRupiah(jumlah)}</span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 sticky bottom-4 z-50">
                        <div className="bg-white/80 dark:bg-slate-950/80 backdrop-blur-md p-2 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 flex gap-3">
                            <Button
                                variant="secondary"
                                size="lg"
                                onClick={handleDownloadPdf}
                                disabled={isPdfGenerating || rows.length === 0}
                                className="shadow-sm"
                            >
                                {isPdfGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileDown className="mr-2 h-4 w-4" />}
                                PDF
                            </Button>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        size="lg"
                                        disabled={isSubmitting || rows.length === 0}
                                        className="bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20"
                                    >
                                        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                        {isEditMode ? 'Update Invoice' : 'Simpan Invoice'}
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Konfirmasi Simpan</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Apakah data yang dimasukkan sudah benar?
                                            {isEditMode ? ' Perubahan akan menimpa data invoice sebelumnya.' : ' Invoice baru akan dibuat.'}
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Periksa Lagi</AlertDialogCancel>
                                        <AlertDialogAction onClick={handleSubmit}>
                                            Ya, Simpan
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
                        <Tag size={32} />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Pilih Tipe Invoice</h3>
                    <p className="text-slate-500 max-w-sm text-center mt-2">
                        Silakan pilih tipe invoice di atas untuk mulai mengisi data. Template kolom akan menyesuaikan secara otomatis.
                    </p>
                </div>
            )}
        </div>
    );
}
