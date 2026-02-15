'use client';

import { useState, useMemo, useEffect, useCallback, Suspense } from 'react';
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
import { formatRupiah } from '@/lib/priceDatabase';
import { INVOICE_TYPES } from '@/lib/customerConfig';
import {
    ArrowUpDown, ArrowUp, ArrowDown, Search, Calendar,
    Building2, RefreshCcw, ChevronDown, ChevronRight
} from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────

interface RowDataItem {
    noMobil?: string;
    noContainer?: string;
    tujuan?: string;
    harga?: number;
    [key: string]: unknown;
}

interface RecapRow {
    InvoiceNumber: string;
    InvoiceTypeName: string;
    InvoiceTypeId: number;
    BankGroup: string;
    IsFee: boolean;
    InvoiceDate: string;
    TotalAmount: number;
    DP: number;
    Jumlah: number;
    Terbilang: string;
    CreatedAt: string;
    RowData: RowDataItem[] | string;
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

import { useSearchParams } from 'next/navigation';

function RekapContent() {
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
            const res = await fetch('/api/recap');
            const json = await res.json();
            if (json.success) {
                const normalized = json.data.map((row: Record<string, unknown>) => {
                    let rowData: RowDataItem[] = [];
                    if (typeof row.RowData === 'string') {
                        try { rowData = JSON.parse(row.RowData); } catch { rowData = []; }
                    } else if (Array.isArray(row.RowData)) {
                        rowData = row.RowData as RowDataItem[];
                    }
                    return {
                        ...row,
                        RowData: rowData,
                        _allNoMobil: rowData.map((r) => r.noMobil || '').join(' | '),
                        _allNoContainer: rowData.map((r) => r.noContainer || '').join(' | '),
                    } as RecapRow;
                });
                setData(normalized);
            }
        } catch (err) {
            console.error('Failed to fetch recap:', err);
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

    const columns = useMemo<ColumnDef<RecapRow>[]>(
        () => [
            {
                id: 'expander',
                header: () => null,
                cell: ({ row }) => {
                    const rd = row.original.RowData;
                    if (!Array.isArray(rd) || rd.length === 0) return null;
                    return (
                        <button
                            onClick={row.getToggleExpandedHandler()}
                            style={{ cursor: 'pointer', background: 'none', border: 'none', color: 'var(--text-muted)', padding: '2px' }}
                        >
                            {row.getIsExpanded() ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        </button>
                    );
                },
                size: 36,
            },
            {
                accessorKey: 'InvoiceNumber',
                header: 'No. Invoice',
                cell: (info) => (
                    <span style={{ fontWeight: 600, color: 'var(--primary-400)' }}>
                        {info.getValue() as string}
                    </span>
                ),
                size: 170,
            },
            {
                accessorKey: 'InvoiceTypeName',
                header: 'Tipe Invoice',
                cell: (info) => {
                    const name = info.getValue() as string;
                    const isFee = info.row.original.IsFee;
                    return (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '12px' }}>{name}</span>
                            {isFee && (
                                <span style={{
                                    background: 'rgba(245, 158, 11, 0.15)',
                                    color: '#f59e0b',
                                    padding: '1px 6px',
                                    borderRadius: '3px',
                                    fontSize: '9px',
                                    fontWeight: 700,
                                }}>FEE</span>
                            )}
                        </div>
                    );
                },
                size: 230,
                filterFn: 'includesString',
            },
            {
                accessorKey: 'InvoiceDate',
                header: 'Tanggal',
                cell: (info) => {
                    const d = info.getValue() as string;
                    if (!d) return '—';
                    try {
                        return new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
                    } catch { return d; }
                },
                sortingFn: 'datetime',
                size: 120,
            },
            {
                accessorKey: 'TotalAmount',
                header: 'Total',
                cell: (info) => (
                    <span style={{ fontWeight: 700, color: 'var(--accent-400)' }}>
                        {formatRupiah(info.getValue() as number)}
                    </span>
                ),
                size: 140,
            },
            {
                accessorKey: 'Jumlah',
                header: 'Jumlah',
                cell: (info) => {
                    const isFee = info.row.original.IsFee;
                    const val = info.getValue() as number;
                    if (!isFee) return <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>—</span>;
                    return (
                        <span style={{ fontWeight: 700, color: '#f59e0b' }}>
                            {formatRupiah(val)}
                        </span>
                    );
                },
                size: 140,
            },
            {
                accessorKey: '_allNoMobil',
                header: 'No. Mobil',
                cell: (info) => (
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '180px', display: 'block' }}>
                        {(info.getValue() as string) || '—'}
                    </span>
                ),
                size: 180,
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
        table.getFilteredRowModel().rows.reduce((s, r) => s + (Number(r.original.TotalAmount) || 0), 0),
        [table.getFilteredRowModel().rows]
    );
    const filteredCount = table.getFilteredRowModel().rows.length;

    const renderSortIcon = (columnId: string) => {
        const s = sorting.find((x) => x.id === columnId);
        if (!s) return <ArrowUpDown size={12} style={{ opacity: 0.3 }} />;
        return s.desc ? <ArrowDown size={12} /> : <ArrowUp size={12} />;
    };

    const renderExpandedRow = (row: RecapRow) => {
        const rowData = Array.isArray(row.RowData) ? row.RowData : [];
        if (rowData.length === 0) return null;
        return (
            <div style={{ padding: '12px 16px', background: 'var(--bg-card)', borderRadius: '8px', margin: '4px 0' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 600 }}>
                    Detail ({rowData.length} baris)
                </div>
                <table style={{ width: '100%', fontSize: '11px', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-primary)' }}>
                            <th style={{ padding: '4px 8px', textAlign: 'left', color: 'var(--text-muted)' }}>No</th>
                            <th style={{ padding: '4px 8px', textAlign: 'left', color: 'var(--text-muted)' }}>No. Mobil</th>
                            <th style={{ padding: '4px 8px', textAlign: 'left', color: 'var(--text-muted)' }}>No. Container</th>
                            <th style={{ padding: '4px 8px', textAlign: 'left', color: 'var(--text-muted)' }}>Tujuan</th>
                            <th style={{ padding: '4px 8px', textAlign: 'right', color: 'var(--text-muted)' }}>Harga</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rowData.map((item, idx) => (
                            <tr key={idx} style={{ borderBottom: '0.5px solid var(--border-primary)' }}>
                                <td style={{ padding: '4px 8px' }}>{idx + 1}</td>
                                <td style={{ padding: '4px 8px', fontWeight: 600, color: 'var(--primary-400)' }}>{item.noMobil || '—'}</td>
                                <td style={{ padding: '4px 8px' }}>{item.noContainer || '—'}</td>
                                <td style={{ padding: '4px 8px' }}>{item.tujuan || '—'}</td>
                                <td style={{ padding: '4px 8px', textAlign: 'right', fontWeight: 600, color: 'var(--accent-400)' }}>
                                    {typeof item.harga === 'number' ? formatRupiah(item.harga) : '—'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <>
            <div className="page-header">
                <h1>Rekapitulasi</h1>
                <p>Data invoice dari Google Sheets — filter berdasarkan Tipe Invoice, No. Mobil, Container</p>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-card-icon blue"><Building2 size={20} /></div>
                    <div className="stat-card-value">{filteredCount}</div>
                    <div className="stat-card-label">Invoice Ditampilkan</div>
                </div>
                <div className="stat-card">
                    <div className="stat-card-icon amber"><span style={{ fontSize: '20px' }}>💰</span></div>
                    <div className="stat-card-value" style={{ fontSize: '18px' }}>{formatRupiah(filteredTotal)}</div>
                    <div className="stat-card-label">Total Akumulasi (Filtered)</div>
                </div>
            </div>

            <div className="filter-bar">
                <div className="filter-group" style={{ flex: 1 }}>
                    <label><Search size={12} /> Cari Global</label>
                    <input
                        type="text"
                        placeholder="No. Mobil (B 9151 FEH), Container, Invoice, Tipe..."
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                    />
                </div>
                <div className="filter-group">
                    <label><Building2 size={12} /> Tipe Invoice</label>
                    <select
                        value={(columnFilters.find((f) => f.id === 'InvoiceTypeName')?.value as string) || ''}
                        onChange={(e) => {
                            setColumnFilters((prev) => {
                                const n = prev.filter((f) => f.id !== 'InvoiceTypeName');
                                if (e.target.value) n.push({ id: 'InvoiceTypeName', value: e.target.value });
                                return n;
                            });
                        }}
                    >
                        <option value="">Semua Tipe</option>
                        {INVOICE_TYPES.map((t) => (
                            <option key={t.id} value={t.name}>{t.name}</option>
                        ))}
                    </select>
                </div>
                <div className="filter-group">
                    <label><Calendar size={12} /> Dari</label>
                    <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
                </div>
                <div className="filter-group">
                    <label><Calendar size={12} /> Sampai</label>
                    <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
                </div>
                <button className="btn btn-secondary btn-sm" onClick={fetchData} title="Refresh">
                    <RefreshCcw size={14} />
                </button>
            </div>

            {loading ? (
                <div className="loading-overlay">
                    <div className="loading-spinner" />
                    <span>Memuat data dari Google Sheets...</span>
                </div>
            ) : (
                <div className="data-table-wrapper">
                    <table className="data-table">
                        <thead>
                            {table.getHeaderGroups().map((hg) => (
                                <tr key={hg.id}>
                                    {hg.headers.map((h) => (
                                        <th
                                            key={h.id}
                                            className={h.column.getIsSorted() ? 'sorted' : ''}
                                            onClick={h.id !== 'expander' ? h.column.getToggleSortingHandler() : undefined}
                                            style={{ width: h.getSize(), cursor: h.id !== 'expander' ? 'pointer' : 'default' }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                {flexRender(h.column.columnDef.header, h.getContext())}
                                                {h.id !== 'expander' && renderSortIcon(h.column.id)}
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody>
                            {table.getRowModel().rows.length === 0 ? (
                                <tr>
                                    <td colSpan={columns.length} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                                        {data.length === 0 ? 'Belum ada data invoice.' : 'Tidak ada yang cocok dengan filter.'}
                                    </td>
                                </tr>
                            ) : (
                                table.getRowModel().rows.map((row) => (
                                    <>
                                        <tr key={row.id}>
                                            {row.getVisibleCells().map((cell) => (
                                                <td key={cell.id}>
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </td>
                                            ))}
                                        </tr>
                                        {row.getIsExpanded() && (
                                            <tr key={`${row.id}-exp`}>
                                                <td colSpan={columns.length} style={{ padding: '0 8px 8px' }}>
                                                    {renderExpandedRow(row.original)}
                                                </td>
                                            </tr>
                                        )}
                                    </>
                                ))
                            )}
                        </tbody>
                        {table.getRowModel().rows.length > 0 && (
                            <tfoot>
                                <tr>
                                    <td colSpan={5} style={{ textAlign: 'right' }}>TOTAL ({filteredCount} invoice):</td>
                                    <td style={{ textAlign: 'right', fontSize: '16px' }}>{formatRupiah(filteredTotal)}</td>
                                    <td colSpan={2}></td>
                                </tr>
                            </tfoot>
                        )}
                    </table>
                </div>
            )}
        </>
    );
}

export default function RekapPage() {
    return (
        <Suspense fallback={
            <div className="loading-overlay">
                <div className="loading-spinner" />
                <span>Memuat data rekap...</span>
            </div>
        }>
            <RekapContent />
        </Suspense>
    );
}
