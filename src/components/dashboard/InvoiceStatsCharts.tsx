'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { getDashboardStatsAction } from '@/app/actions/dashboard';
import { Loader2, PieChart as PieChartIcon } from 'lucide-react';

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

export function InvoiceStatsCharts() {
    const [invoiceTypeData, setInvoiceTypeData] = useState<ChartData[]>([]);
    const [customerData, setCustomerData] = useState<ChartData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getDashboardStatsAction();
                if (result.success && result.data) {
                    // Sort by value descending and take top 10 for better visualization if many entries
                    setInvoiceTypeData(result.data.invoiceTypeStats.sort((a: any, b: any) => b.value - a.value));
                    setCustomerData(result.data.customerStats.sort((a: any, b: any) => b.value - a.value));
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
            <div className="grid md:grid-cols-2 gap-6 mb-8">
                <Card className="h-[400px] flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                </Card>
                <Card className="h-[400px] flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                </Card>
            </div>
        );
    }

    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return percent > 0.05 ? (
            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="text-xs font-bold pointer-events-none" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        ) : null;
    };

    return (
        <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Invoice Type Chart */}
            <Card className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                            <PieChartIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <CardTitle className="text-lg">Distribusi Tipe Invoice</CardTitle>
                            <CardDescription>Persentase pembuatan invoice berdasarkan jenis layanan</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] w-full">
                        {invoiceTypeData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={invoiceTypeData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={renderCustomizedLabel}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {invoiceTypeData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(255,255,255,0.2)" strokeWidth={2} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        itemStyle={{ color: '#1e293b', fontWeight: 600 }}
                                    />
                                    <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400">
                                <PieChartIcon className="h-12 w-12 mb-2 opacity-20" />
                                <p>Belum ada data invoice</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Customer Chart */}
            <Card className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                            <PieChartIcon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                            <CardTitle className="text-lg">Distribusi Pelanggan</CardTitle>
                            <CardDescription>Persentase pembuatan invoice berdasarkan pelanggan</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] w-full">
                        {customerData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={customerData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={renderCustomizedLabel}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {customerData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[(index + 5) % COLORS.length]} stroke="rgba(255,255,255,0.2)" strokeWidth={2} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        itemStyle={{ color: '#1e293b', fontWeight: 600 }}
                                    />
                                    <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400">
                                <PieChartIcon className="h-12 w-12 mb-2 opacity-20" />
                                <p>Belum ada data invoice</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
