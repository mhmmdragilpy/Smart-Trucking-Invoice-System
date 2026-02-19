'use client';

import { useState, useMemo, Suspense } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    flexRender,
    type ColumnDef,
    type SortingState,
} from '@tanstack/react-table';
import {
    Search, Database, ArrowUp, ArrowDown, ChevronLeft, ChevronRight,
    Truck, Container, MapPin, Anchor, Package, Users, LucideIcon
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Import Local Data Sources
import { CONSIGNEES, VEHICLES, CONTAINERS, DEPOS, PICKUP_LOCATIONS } from '@/lib/data/masterData';
import { ALL_DESTINATIONS } from '@/lib/data/priceData';

// ── Types ─────────────────────────────────────────────────────

interface ReferenceItem {
    value: string;
    index: number;
}

type Category = 'Consignee' | 'No. Mobil' | 'No. Container' | 'Tujuan' | 'Depo' | 'PickUp';

const CATEGORIES: { id: Category; label: string; description: string; icon: LucideIcon; data: string[]; color: string; bg: string }[] = [
    {
        id: 'Consignee',
        label: 'Consignee',
        description: 'Pelanggan / Penerima',
        icon: Users,
        data: CONSIGNEES,
        color: 'text-blue-600',
        bg: 'bg-blue-100 dark:bg-blue-900/20'
    },
    {
        id: 'No. Mobil',
        label: 'Armada',
        description: 'Daftar Unit Truck',
        icon: Truck,
        data: VEHICLES,
        color: 'text-emerald-600',
        bg: 'bg-emerald-100 dark:bg-emerald-900/20'
    },
    {
        id: 'No. Container',
        label: 'Container',
        description: 'Daftar No. Container',
        icon: Container,
        data: CONTAINERS,
        color: 'text-amber-600',
        bg: 'bg-amber-100 dark:bg-amber-900/20'
    },
    {
        id: 'Tujuan',
        label: 'Destinasi',
        description: 'Rute Pengiriman',
        icon: MapPin,
        data: ALL_DESTINATIONS,
        color: 'text-violet-600',
        bg: 'bg-violet-100 dark:bg-violet-900/20'
    },
    {
        id: 'Depo',
        label: 'Depo',
        description: 'Lokasi Depo',
        icon: Package,
        data: DEPOS,
        color: 'text-pink-600',
        bg: 'bg-pink-100 dark:bg-pink-900/20'
    },
    {
        id: 'PickUp',
        label: 'Pick Up',
        description: 'Lokasi Pengambilan',
        icon: Anchor,
        data: PICKUP_LOCATIONS,
        color: 'text-cyan-600',
        bg: 'bg-cyan-100 dark:bg-cyan-900/20'
    },
];

export default function ReferenceDataPage() {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>}>
            <ReferenceDataContent />
        </Suspense>
    );
}

function ReferenceDataContent() {
    const [activeTab, setActiveTab] = useState<Category>('Consignee');
    const [filter, setFilter] = useState('');

    const activeCategory = useMemo(() => CATEGORIES.find(c => c.id === activeTab), [activeTab]);
    const currentList = useMemo(() => activeCategory ? activeCategory.data : [], [activeCategory]);

    const filteredData = useMemo<ReferenceItem[]>(() => {
        return currentList
            .filter(item => item.toLowerCase().includes(filter.toLowerCase()))
            .map((value, index) => ({ value, index }));
    }, [currentList, filter]);

    const columns = useMemo<ColumnDef<ReferenceItem>[]>(() => [
        {
            accessorKey: 'index',
            header: 'NO',
            cell: info => <span className="text-muted-foreground text-xs font-mono">{(info.getValue() as number + 1)}</span>,
            size: 60,
        },
        {
            accessorKey: 'value',
            header: 'NAMA DATA',
            cell: info => (
                <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${activeCategory?.bg.replace('bg-', 'bg-').replace('/20', '')}`} />
                    <span className="font-medium text-sm">{info.getValue() as string}</span>
                </div>
            ),
        },
    ], [activeCategory]);


    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Data Referensi</h1>
                <p className="text-muted-foreground">
                    Kelola data master untuk otomatisasi form invoice. Edit di file <code className="bg-muted px-1 py-0.5 rounded text-sm">masterData.ts</code> untuk update permanen.
                </p>
                <div className="mt-2">
                    <Badge variant="outline" className="text-muted-foreground">
                        Total Data: <span className="font-bold text-foreground ml-1">{CATEGORIES.reduce((acc, cat) => acc + cat.data.length, 0)}</span>
                    </Badge>
                </div>
            </div>

            {/* Grid Tabs */}
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                {CATEGORIES.map((cat) => {
                    const isActive = activeTab === cat.id;
                    const Icon = cat.icon;
                    return (
                        <Card
                            key={cat.id}
                            onClick={() => { setActiveTab(cat.id); setFilter(''); }}
                            className={`cursor-pointer transition-all hover:shadow-md ${isActive ? 'ring-2 ring-primary border-primary' : ''}`}
                        >
                            <CardContent className="p-4 flex flex-col gap-3">
                                <div className="flex justify-between items-start">
                                    <div className={`p-2 rounded-lg ${cat.bg}`}>
                                        <Icon className={`h-5 w-5 ${cat.color}`} />
                                    </div>
                                    <span className={`text-xl font-bold ${cat.color}`}>{cat.data.length}</span>
                                </div>
                                <div>
                                    <div className="font-semibold text-sm">{cat.label}</div>
                                    <div className="text-xs text-muted-foreground line-clamp-1">{cat.description}</div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <Card className="border shadow-sm">
                <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-center gap-4 bg-muted/40">
                    <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-md ${activeCategory?.bg}`}>
                            <Database className={`h-4 w-4 ${activeCategory?.color}`} />
                        </div>
                        <h2 className="font-semibold text-lg">{activeCategory?.label}</h2>
                    </div>
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder={`Cari ${activeCategory?.label}...`}
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="pl-9 bg-background"
                        />
                    </div>
                </div>

                <div className="p-0">
                    <DataTable data={filteredData} columns={columns} />
                </div>
            </Card>
        </div>
    );
}

function DataTable<T>({ data, columns }: { data: T[], columns: ColumnDef<T>[] }) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 50 });

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            pagination
        },
        onSortingChange: setSorting,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    return (
        <div className="w-full">
            <div className="rounded-md border-none">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map(headerGroup => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <TableHead key={header.id} style={{ width: header.getSize() }}>
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map(row => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                    {row.getVisibleCells().map(cell => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    Tidak ada hasil.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-4 border-t bg-muted/20">
                <div className="text-xs text-muted-foreground">
                    Show {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} - {Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, data.length)} of {data.length} entries
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
