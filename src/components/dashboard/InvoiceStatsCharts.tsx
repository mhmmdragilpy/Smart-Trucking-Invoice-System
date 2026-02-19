'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { getDashboardStatsAction } from '@/app/actions/dashboard';
import { Loader2, PieChart as PieChartIcon, TrendingUp, Users } from 'lucide-react';

const COLORS = [
    '#3b82f6', // blue-500
    '#ef4444', // red-500
    '#22c55e', // green-500
    '#eab308', // yellow-500
    '#ec4899', // pink-500
    '#f97316', // orange-500
    '#8b5cf6', // violet-500
    '#06b6d4', // cyan-500
    '#84cc16', // lime-500
    '#14b8a6', // teal-500
    '#6366f1', // indigo-500
    '#d946ef', // fuchsia-500
    '#f43f5e', // rose-500
    '#0ea5e9', // sky-500
    '#10b981', // emerald-500
    '#f59e0b', // amber-500
];

interface ChartData {
    name: string;
    value: number;
}

/**
 * Format currency to short Indonesian notation
 * e.g. 150000000 => "150 Jt", 1500000000 => "1,5 M", 500000 => "500 Rb"
 */
function formatShortCurrency(value: number): string {
    if (value >= 1_000_000_000) {
        const val = value / 1_000_000_000;
        return `${val % 1 === 0 ? val.toFixed(0) : val.toFixed(1).replace('.', ',')} M`;
    }
    if (value >= 1_000_000) {
        const val = value / 1_000_000;
        return `${val % 1 === 0 ? val.toFixed(0) : val.toFixed(1).replace('.', ',')} Jt`;
    }
    if (value >= 1_000) {
        const val = value / 1_000;
        return `${val % 1 === 0 ? val.toFixed(0) : val.toFixed(1).replace('.', ',')} Rb`;
    }
    return value.toLocaleString('id-ID');
}

function formatFullCurrency(value: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
}

export function InvoiceStatsCharts() {
    const [invoiceTypeData, setInvoiceTypeData] = useState<ChartData[]>([]);
    const [customerData, setCustomerData] = useState<ChartData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getDashboardStatsAction();
                if (result.success && result.data) {
                    setInvoiceTypeData(result.data.invoiceTypeStats.sort((a, b) => b.value - a.value));
                    setCustomerData(result.data.customerStats.sort((a, b) => b.value - a.value));
                }
            } catch (error) {
                console.error('Failed to load chart data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="space-y-6">
                <Card className="h-[500px] flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                </Card>
                <Card className="h-[500px] flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                </Card>
            </div>
        );
    }

    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, value }: any) => {
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return percent > 0.04 ? (
            <text
                x={x}
                y={y}
                fill="white"
                textAnchor="middle"
                dominantBaseline="central"
                className="font-bold pointer-events-none"
                style={{ textShadow: '0 1px 3px rgba(0,0,0,0.6)', fontSize: '11px' }}
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        ) : null;
    };

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0];
            return (
                <div className="bg-white dark:bg-slate-800 rounded-xl px-4 py-3 shadow-xl border border-slate-100 dark:border-slate-700">
                    <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm">{data.name}</p>
                    <p className="text-blue-600 dark:text-blue-400 font-bold text-base mt-1">
                        {formatFullCurrency(data.value)}
                    </p>
                    <p className="text-slate-400 text-xs mt-0.5">
                        {`${((data.payload.percent || (data.value / data.payload.total)) * 100).toFixed(1)}% dari total`}
                    </p>
                </div>
            );
        }
        return null;
    };

    const totalInvoiceType = invoiceTypeData.reduce((sum, d) => sum + d.value, 0);
    const totalCustomer = customerData.reduce((sum, d) => sum + d.value, 0);

    const invoiceTypeWithPercent = invoiceTypeData.map(d => ({ ...d, percent: d.value / totalInvoiceType, total: totalInvoiceType }));
    const customerWithPercent = customerData.map(d => ({ ...d, percent: d.value / totalCustomer, total: totalCustomer }));

    const renderLegendValue = (value: string, entry: any) => {
        const amount = entry.payload?.value;
        return (
            <span className="text-slate-600 dark:text-slate-400 text-sm">
                {value} — <span className="font-semibold text-slate-800 dark:text-slate-200">{formatShortCurrency(amount)}</span>
            </span>
        );
    };

    return (
        <div className="space-y-6">
            {/* ── Invoice Type Chart ───────────────────────────────── */}
            <Card className="shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                                <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <CardTitle className="text-xl">Distribusi Tipe Invoice</CardTitle>
                                <CardDescription>Total tagihan berdasarkan jenis layanan</CardDescription>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-slate-400 uppercase tracking-wider">Total Tagihan</p>
                            <p className="text-2xl font-extrabold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
                                {formatShortCurrency(totalInvoiceType)}
                            </p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="h-[420px] w-full">
                        {invoiceTypeData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={invoiceTypeWithPercent}
                                        cx="50%"
                                        cy="45%"
                                        labelLine={false}
                                        label={renderCustomizedLabel}
                                        outerRadius={150}
                                        innerRadius={60}
                                        fill="#8884d8"
                                        dataKey="value"
                                        paddingAngle={2}
                                    >
                                        {invoiceTypeWithPercent.map((_, index) => (
                                            <Cell key={`cell-type-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(255,255,255,0.3)" strokeWidth={2} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend
                                        layout="horizontal"
                                        verticalAlign="bottom"
                                        align="center"
                                        formatter={renderLegendValue}
                                        wrapperStyle={{ paddingTop: '16px' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400">
                                <PieChartIcon className="h-16 w-16 mb-3 opacity-20" />
                                <p className="text-lg">Belum ada data invoice</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* ── Customer Chart ────────────────────────────────────── */}
            <Card className="shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
                                <Users className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div>
                                <CardTitle className="text-xl">Distribusi Pelanggan</CardTitle>
                                <CardDescription>Total tagihan berdasarkan pelanggan ({customerData.length} pelanggan)</CardDescription>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-slate-400 uppercase tracking-wider">Total Tagihan</p>
                            <p className="text-2xl font-extrabold bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
                                {formatShortCurrency(totalCustomer)}
                            </p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="h-[420px] w-full">
                        {customerData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={customerWithPercent}
                                        cx="50%"
                                        cy="45%"
                                        labelLine={false}
                                        label={renderCustomizedLabel}
                                        outerRadius={150}
                                        innerRadius={60}
                                        fill="#8884d8"
                                        dataKey="value"
                                        paddingAngle={2}
                                    >
                                        {customerWithPercent.map((_, index) => (
                                            <Cell key={`cell-cust-${index}`} fill={COLORS[(index + 5) % COLORS.length]} stroke="rgba(255,255,255,0.3)" strokeWidth={2} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend
                                        layout="horizontal"
                                        verticalAlign="bottom"
                                        align="center"
                                        formatter={renderLegendValue}
                                        wrapperStyle={{ paddingTop: '16px' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400">
                                <PieChartIcon className="h-16 w-16 mb-3 opacity-20" />
                                <p className="text-lg">Belum ada data pelanggan</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
