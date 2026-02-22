'use client';

import { useState, useMemo, useEffect, useCallback, Suspense, Fragment } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    getExpandedRowModel,
    flexRender,
    type ColumnDef,
    type SortingState,
    type ColumnFiltersState,
    type FilterFn,
    type Row,
} from '@tanstack/react-table';
import { formatRupiah } from '@/lib/data/priceData';
import { INVOICE_TYPES } from '@/lib/customerConfig';
import {
    ArrowUpDown, Search, Calendar,
    Building2, RefreshCcw, ChevronDown, ChevronRight, FileDown, Trash2, Edit2, Loader2, Filter
} from 'lucide-react';
import { pdf } from '@react-pdf/renderer';
import { useRouter, useSearchParams } from 'next/navigation';
import { getInvoicesAction, deleteInvoiceAction } from '../actions/invoices';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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



// ── Types ─────────────────────────────────────────────────────

interface RowDataItem {
    noMobil?: string;
    noContainer?: string;
    tujuan?: string;
    harga?: number;
    [key: string]: unknown;
}

interface RecapRow {
    id: string; // UUID
    InvoiceNumber: string;
    InvoiceTypeName: string;
    InvoiceTypeId: number;
    BankGroup: string;
    IsFee: boolean;
    InvoiceDate: string;
    TotalAmount: number;
    DP: number;
    TaxRate: number | null;
    TaxAmount: number;
    Jumlah: number;
    Terbilang: string;
    CreatedAt: string;
    RowData: RowDataItem[];
    PeriodeStart?: string;
    PeriodeEnd?: string;
    _allNoMobil: string;
    _allNoContainer: string;
}

// ── Custom Global Filter ──────────────────────────────────────
const globalSearchFilter: FilterFn<RecapRow> = (
    row: Row<RecapRow>,
    _columnId: string,
    filterValue: string
) => {
    const search = filterValue.toLowerCase().trim();
    if (!search) return true;
    const o = row.original;
    return (
        o.InvoiceNumber.toLowerCase().includes(search) ||
        o.InvoiceTypeName.toLowerCase().includes(search) ||
        o._allNoMobil.toLowerCase().includes(search) ||
        o._allNoContainer.toLowerCase().includes(search)
    );
};

function RekapContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const query = searchParams.get('q');

    const [data, setData] = useState<RecapRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [sorting, setSorting] = useState<SortingState>([{ id: 'InvoiceDate', desc: true }]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState(query || '');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [expanded, setExpanded] = useState({});

    // Sync URL param changes
    useEffect(() => {
        if (query) setGlobalFilter(query);
    }, [query]);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const result = await getInvoicesAction();

            if (!result.success || !result.data) {
                throw new Error(result.error || 'Unknown error');
            }

            const normalized: RecapRow[] = result.data.map((inv: any) => {
                const rowData: RowDataItem[] = (inv.items || []).map((item: any) => ({
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

                return {
                    id: inv.id,
                    InvoiceNumber: inv.invoiceNumber,
                    InvoiceTypeName: inv.invoiceTypeName,
                    InvoiceTypeId: inv.invoiceTypeId,
                    BankGroup: inv.bankGroup,
                    IsFee: inv.isFee,
                    InvoiceDate: inv.invoiceDate,
                    TotalAmount: Number(inv.totalAmount) || 0,
                    DP: Number(inv.dp) || 0,
                    TaxRate: inv.taxRate != null ? Number(inv.taxRate) : null,
                    TaxAmount: Number(inv.taxAmount) || 0,
                    Jumlah: Number(inv.grandTotal) || 0,
                    Terbilang: inv.terbilang,
                    CreatedAt: inv.createdAt,
                    RowData: rowData,
                    PeriodeStart: inv.periodStart,
                    PeriodeEnd: inv.periodEnd,
                    _allNoMobil: rowData.map((r) => r.noMobil || '').join(' | '),
                    _allNoContainer: rowData.map((r) => r.noContainer || '').join(' | '),
                };
            });
            setData(normalized);

        } catch (err) {
            console.error('Failed to fetch recap:', err);
            toast.error('Gagal mengambil data: ' + (err as Error).message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const filteredByDate = useMemo(() => {
        if (!dateFrom && !dateTo) return data;
        return data.filter((row) => {
            const d = row.InvoiceDate?.split('T')[0] || '';
            if (dateFrom && d < dateFrom) return false;
            if (dateTo && d > dateTo) return false;
            return true;
        });
    }, [data, dateFrom, dateTo]);

    const handleDownloadPdf = async (row: RecapRow) => {
        let type = INVOICE_TYPES.find(t => t.id === row.InvoiceTypeId);
        if (!type && row.InvoiceTypeName) {
            type = INVOICE_TYPES.find(t => t.name === row.InvoiceTypeName);
        }

        if (!type) {
            toast.error(`Tipe invoice tidak ditemukan: ${row.InvoiceTypeName}`);
            return;
        }

        try {
            const { default: InvoicePdfComponent } = await import('@/components/InvoicePdf');
            const rows = row.RowData;
            const element = (
                <InvoicePdfComponent
                    invoiceType={type}
                    invoiceNumber={row.InvoiceNumber}
                    invoiceDate={row.InvoiceDate || new Date().toISOString()}
                    periodeStart={row.PeriodeStart || ''}
                    periodeEnd={row.PeriodeEnd || ''}
                    rows={rows.map(r => ({ ...r, consignee: r.consigne })) as Record<string, unknown>[]} // Map back for PDF if needed, or PDF uses consignee? generic PDF uses keys.
                    grandTotal={row.TotalAmount}
                    dp={row.DP}
                    taxRate={row.TaxRate}
                    taxAmount={row.TaxAmount}
                    jumlah={row.Jumlah}
                />
            );

            const blob = await pdf(element).toBlob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `Invoice_${row.InvoiceNumber.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            toast.success('PDF berhasil diunduh');
        } catch (err) {
            console.error('PDF Download Error:', err);
            toast.error('Gagal mengunduh PDF');
        }
    };

    const handleDelete = async (invoiceId: string) => {
        // Confirmation handled by AlertDialog UI


        setLoading(true);
        try {
            const result = await deleteInvoiceAction(invoiceId);
            if (!result.success) throw new Error(result.error);

            toast.success('Invoice berhasil dihapus!');
            fetchData();
        } catch (err) {
            console.error('Delete Error:', err);
            toast.error('Error saat menghapus invoice');
        } finally {
            setLoading(false);
        }
    };

    const columns = useMemo<ColumnDef<RecapRow>[]>(
        () => [
            {
                id: 'expander',
                header: () => null,
                cell: ({ row }) => {
                    const rd = row.original.RowData;
                    if (!Array.isArray(rd) || rd.length === 0) return null;
                    return (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 p-0"
                            onClick={row.getToggleExpandedHandler()}
                        >
                            {row.getIsExpanded() ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        </Button>
                    );
                },
                size: 40,
            },
            {
                accessorKey: 'InvoiceNumber',
                header: ({ column }) => (
                    <Button variant="ghost" className="p-0 hover:bg-transparent font-semibold" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                        No. Invoice
                        <ArrowUpDown className="ml-2 h-3 w-3" />
                    </Button>
                ),
                cell: (info) => (
                    <span className="font-mono font-semibold text-blue-600 dark:text-blue-400">
                        {info.getValue() as string}
                    </span>
                ),
            },
            {
                accessorKey: 'InvoiceTypeName',
                header: 'Tipe Invoice',
                cell: (info) => {
                    const name = (info.row.original.InvoiceTypeName || 'Unknown') as string;
                    const isFee = info.row.original.IsFee;
                    return (
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium truncate max-w-[200px]" title={name}>{name}</span>
                            {isFee && <Badge variant="secondary" className="bg-amber-100 text-amber-800 text-[10px] h-5">FEE</Badge>}
                        </div>
                    );
                },
                filterFn: 'includesString',
            },
            {
                accessorKey: 'InvoiceDate',
                header: ({ column }) => (
                    <Button variant="ghost" className="p-0 hover:bg-transparent font-semibold" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                        Tanggal
                        <ArrowUpDown className="ml-2 h-3 w-3" />
                    </Button>
                ),
                cell: (info) => {
                    const d = info.getValue() as string;
                    if (!d) return '—';
                    try {
                        return new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
                    } catch { return d; }
                },
                sortingFn: 'datetime',
            },
            {
                accessorKey: 'Jumlah',
                header: 'Total',
                cell: (info) => {
                    const value = info.getValue();
                    const amount = typeof value === 'number' ? value : Number(value) || 0;
                    return (
                        <span className="font-bold text-slate-700 dark:text-slate-200">
                            {formatRupiah(amount)}
                        </span>
                    );
                },
            },
            {
                id: 'actions',
                header: 'Aksi',
                cell: ({ row }) => (
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={(e) => { e.stopPropagation(); handleDownloadPdf(row.original); }}
                            title="Download PDF"
                        >
                            <FileDown size={14} />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7 text-blue-600 hover:text-blue-700 border-blue-200 hover:bg-blue-50"
                            onClick={(e) => { e.stopPropagation(); router.push(`/invoice?id=${row.original.id}`); }}
                            title="Edit Invoice"
                        >
                            <Edit2 size={14} />
                        </Button>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-7 w-7 text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50"
                                    onClick={(e) => e.stopPropagation()}
                                    title="Hapus Invoice"
                                >
                                    <Trash2 size={14} />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Apakah anda mutlak yakin?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Tindakan ini tidak dapat dibatalkan. Ini akan menghapus permanen invoice
                                        <span className="font-bold text-slate-900 dark:text-slate-100"> {row.original.InvoiceNumber} </span>
                                        dan semua data item yang terkait dari server.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Batal</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(row.original.id);
                                        }}
                                        className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                                    >
                                        Hapus Permanen
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                ),
            },
        ],
        []
    );

    const table = useReactTable({
        data: filteredByDate,
        columns,
        state: { sorting, columnFilters, globalFilter, expanded },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        onExpandedChange: setExpanded,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        globalFilterFn: globalSearchFilter,
        getRowCanExpand: (row) => {
            const rd = row.original.RowData;
            return Array.isArray(rd) && rd.length > 0;
        },
    });

    const filteredTotal = useMemo(() =>
        table.getFilteredRowModel().rows.reduce((s, r) => {
            const amount = Number(r.original.Jumlah);
            return s + (isNaN(amount) ? 0 : amount);
        }, 0),
        [table.getFilteredRowModel().rows]
    );
    const filteredCount = table.getFilteredRowModel().rows.length;

    const renderExpandedRow = (row: RecapRow) => {
        const rowData = Array.isArray(row.RowData) ? row.RowData : [];
        if (rowData.length === 0) return null;

        // Get invoice type definition to know valid columns
        const invoiceType = INVOICE_TYPES.find(t => t.id === row.InvoiceTypeId);

        // If type found, use its columns. Otherwise fallback to all keys (legacy behavior)
        let displayColumns: { key: string; label: string; type?: string }[] = [];

        if (invoiceType) {
            displayColumns = invoiceType.columns.map(c => ({
                key: c.key,
                label: c.label,
                type: c.type
            }));
        } else {
            // Fallback: collect all non-empty keys
            const allKeys = new Set<string>();
            rowData.forEach(item => {
                Object.keys(item).forEach(key => {
                    if (key !== 'no' && typeof item[key] !== 'undefined' && item[key] !== null && item[key] !== '') {
                        allKeys.add(key);
                    }
                });
            });

            // Define display names for common keys (fallback only)
            const keyDisplayNames: Record<string, string> = {
                no: 'No',
                tanggal: 'Tanggal',
                consigne: 'Consigne',
                noMobil: 'No. Mobil',
                noContainer: 'No. Container',
                status: 'Status',
                size: 'Size',
                tujuan: 'Tujuan',
                harga: 'Harga',
                pickup: 'Pickup',
                gatePass: 'Gate Pass',
                depo: 'Depo',
                liftOff: 'Lift Off',
                bongkar: 'Bongkar',
                cleaning: 'Cleaning',
                stuffing: 'Stuffing',
                storage: 'Storage',
                demurrage: 'Demurrage',
                seal: 'Seal',
                others: 'Others',
                repair: 'Repair',
                rsm: 'RSM',
                ngemail: 'Ngemail',
                pmp: 'PMP',
                perbaikan: 'Perbaikan',
                parkir: 'Parkir',
                smartDepo: 'Smart Depo',
                emty: 'Emty'
            };

            displayColumns = Array.from(allKeys).map(key => ({
                key,
                label: keyDisplayNames[key] || key,
                type: 'text' // default
            }));
            // Always ensure 'no' is first if exists, but we usually want specific order. 
            // Without config, order is not guaranteed.
        }

        return (
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border shadow-inner">
                <div className="flex justify-between items-center mb-2">
                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        Detail Items ({rowData.length}) - {invoiceType?.name || 'Unknown Type'}
                    </h4>
                </div>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-b-slate-200 dark:border-b-slate-700 bg-slate-100/50 dark:bg-slate-800">
                                {displayColumns.map(col => (
                                    <TableHead key={col.key} className="h-8 text-xs whitespace-nowrap font-bold text-slate-700 dark:text-slate-300">
                                        {col.label}
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {rowData.map((item, idx) => (
                                <TableRow key={idx} className="hover:bg-white dark:hover:bg-slate-800 border-0">
                                    {displayColumns.map(col => {
                                        const val = item[col.key];
                                        const isNumber = typeof val === 'number' || col.type === 'currency' || col.type === 'number';

                                        let displayVal: React.ReactNode = val as React.ReactNode;
                                        if (val === null || val === undefined || val === '') displayVal = <span className="text-slate-300">-</span>;
                                        else if (col.type === 'currency' || (typeof val === 'number' && col.key !== 'no')) {
                                            displayVal = formatRupiah(Number(val));
                                        } else if (col.type === 'date' && typeof val === 'string') {
                                            // try format date if needed, or keep as string
                                        }

                                        return (
                                            <TableCell
                                                key={col.key}
                                                className={`py-2 text-xs whitespace-nowrap ${isNumber ? 'font-mono text-right' : ''}`}
                                            >
                                                {displayVal}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Rekapitulasi Invoice</h1>
                    <p className="text-slate-500">Kelola dan pantau semua invoice yang telah dibuat.</p>
                </div>
            </div>


            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Invoice Ditampilkan</CardTitle>
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{filteredCount}</div>
                        <p className="text-xs text-muted-foreground">Unit invoice sesuai filter</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Nominal</CardTitle>
                        <div className="h-4 w-4 text-muted-foreground">💰</div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                            {formatRupiah(filteredTotal)}
                        </div>
                        <p className="text-xs text-muted-foreground">Total Grand Total dari data terfilter</p>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="p-4 space-y-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 space-y-2">
                            <label className="text-xs font-medium text-slate-500 flex items-center gap-1"><Search size={12} /> Cari Global</label>
                            <Input
                                placeholder="Cari No. Invoice, Customer, Mobil, Container..."
                                value={globalFilter}
                                onChange={(e) => setGlobalFilter(e.target.value)}
                                className="h-9"
                            />
                        </div>
                        <div className="w-full md:w-[250px] space-y-2">
                            <label className="text-xs font-medium text-slate-500 flex items-center gap-1"><Filter size={12} /> Tipe Invoice</label>
                            <Select
                                value={(columnFilters.find((f) => f.id === 'InvoiceTypeName')?.value as string) || ''}
                                onValueChange={(val) => {
                                    setColumnFilters((prev) => {
                                        const n = prev.filter((f) => f.id !== 'InvoiceTypeName');
                                        if (val && val !== 'all') n.push({ id: 'InvoiceTypeName', value: val });
                                        return n;
                                    });
                                }}
                            >
                                <SelectTrigger className="h-9">
                                    <SelectValue placeholder="Semua Tipe" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Tipe</SelectItem>
                                    {INVOICE_TYPES.map((t) => (
                                        <SelectItem key={t.id} value={t.name}>{t.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-slate-500 flex items-center gap-1"><Calendar size={12} /> Dari Tanggal</label>
                            <Input
                                type="date"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                                className="h-9 w-full md:w-[160px]"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-slate-500 flex items-center gap-1"><Calendar size={12} /> Sampai Tanggal</label>
                            <Input
                                type="date"
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                                className="h-9 w-full md:w-[160px]"
                            />
                        </div>
                        <Button variant="secondary" size="sm" onClick={fetchData} className="h-9 gap-2 ml-auto">
                            <RefreshCcw size={14} /> Refresh Data
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Table */}
            <div className="rounded-md border bg-white dark:bg-slate-950 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex flex-col items-center justify-center p-12 text-slate-500">
                        <Loader2 className="h-8 w-8 animate-spin mb-4 text-blue-500" />
                        <p>Memuat data terbaru...</p>
                    </div>
                ) : (
                    <Table>
                        <TableHeader className="bg-slate-50 dark:bg-slate-900 border-b">
                            {table.getHeaderGroups().map((hg) => (
                                <TableRow key={hg.id} className="hover:bg-transparent">
                                    {hg.headers.map((h) => (
                                        <TableHead key={h.id} style={{ width: h.getSize() }}>
                                            {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <Fragment key={row.id}>
                                        <TableRow data-state={row.getIsSelected() && "selected"} className="group hover:bg-slate-50 dark:hover:bg-slate-900/50">
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id} className="py-3">
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                        {row.getIsExpanded() && (
                                            <TableRow className="hover:bg-transparent bg-slate-50/30">
                                                <TableCell colSpan={columns.length} className="p-4">
                                                    {renderExpandedRow(row.original)}
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </Fragment>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center text-slate-500">
                                        Tidak ada data yang sesuai filter.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                )}
            </div>

            <div className="text-xs text-slate-400 text-center pb-8">
                Menampilkan {filteredCount} dari {data.length} total invoice.
            </div>
        </div >
    );
}

export default function RekapPage() {
    return (
        <Suspense fallback={<div className="flex justify-center p-20"><Loader2 className="animate-spin" /></div>}>
            <RekapContent />
        </Suspense>
    );
}
