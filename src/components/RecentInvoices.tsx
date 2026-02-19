'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getInvoicesAction } from '@/app/actions/invoices';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Loader2 } from 'lucide-react';

export function RecentInvoices() {
    const [invoices, setInvoices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const result = await getInvoicesAction();
                if (result.success && result.data) {
                    setInvoices(result.data.slice(0, 5)); // Take only first 5
                }
            } catch (error) {
                console.error("Failed to fetch invoices", error);
            } finally {
                setLoading(false);
            }
        };

        fetchInvoices();
    }, []);

    const formatCurrency = (amount: number | string) => {
        const num = typeof amount === 'string' ? parseFloat(amount) : amount;
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(num);
    };

    if (loading) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Recent Invoices</CardTitle>
                    <CardDescription>Loading latest transactions...</CardDescription>
                </CardHeader>
                <CardContent className="h-[200px] flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Recent Invoices</CardTitle>
                    <CardDescription>Latest 5 transactions from your system.</CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                    <Link href="/rekap" className="flex items-center gap-2">
                        View All <ArrowRight className="h-3 w-3" />
                    </Link>
                </Button>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Invoice No.</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Total Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {invoices.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center h-24 text-slate-500">
                                    No invoices found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            invoices.map((inv) => (
                                <TableRow key={inv.id}>
                                    <TableCell className="font-medium">{inv.invoiceNumber}</TableCell>
                                    <TableCell>{inv.customerName}</TableCell>
                                    <TableCell>
                                        {format(new Date(inv.invoiceDate), 'dd MMM yyyy', { locale: idLocale })}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={inv.status === 'PAID' ? 'default' : inv.status === 'DRAFT' ? 'secondary' : 'outline'}
                                            className={
                                                inv.status === 'PAID' ? 'bg-emerald-500 hover:bg-emerald-600' :
                                                    inv.status === 'DRAFT' ? 'bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-300' :
                                                        'border-amber-500 text-amber-600'
                                            }
                                        >
                                            {inv.status || 'DRAFT'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right font-semibold">
                                        {formatCurrency(inv.grandTotal)}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
