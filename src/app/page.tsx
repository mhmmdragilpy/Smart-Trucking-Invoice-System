'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  FileText, BarChart3, Plus, ArrowRight, Search,
  Package, Ship, TrendingUp, Zap, Clock, Shield
} from 'lucide-react';
import { INVOICE_TYPES } from '@/lib/customerConfig';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { RecentInvoices } from '@/components/RecentInvoices';

export default function DashboardPage() {
  const router = useRouter();
  const feeTypes = INVOICE_TYPES.filter(t => t.isFee);
  const nonFeeTypes = INVOICE_TYPES.filter(t => !t.isFee);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const val = ((e.currentTarget as HTMLFormElement).elements.namedItem('q') as HTMLInputElement).value;
    if (val) router.push(`/rekap?q=${encodeURIComponent(val)}`);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* ── Hero Section ────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-50 to-emerald-50 dark:from-slate-900 dark:to-slate-800 border border-blue-100 dark:border-slate-700 p-8 lg:p-10">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-20 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-white/50 dark:bg-slate-800/50 p-2 rounded-2xl backdrop-blur-sm shadow-sm border border-white/20">
              <Image
                src="/logo.png"
                alt="PT Tunggal Mandiri Logistik"
                width={64}
                height={64}
                className="object-contain"
                priority
              />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
                PT Tunggal Mandiri Logistik
              </h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium">
                Sistem Manajemen Invoice — Jasa Angkutan Darat (Trucking)
              </p>
            </div>
          </div>

          {/* ── Tracking Search Bar ───────────────────────────────── */}
          <form onSubmit={handleSearch} className="max-w-lg mt-8 relative">
            <div className="relative group">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <Input
                name="q"
                type="text"
                placeholder="Lacak No. Invoice / Mobil (B 1234 XX)..."
                className="pl-12 pr-24 h-12 rounded-full border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-lg shadow-slate-200/50 dark:shadow-none focus-visible:ring-blue-500 transition-shadow"
              />
              <Button
                type="submit"
                className="absolute right-1 top-1 rounded-full h-10 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md transition-transform active:scale-95"
              >
                Cari
              </Button>
            </div>
            <p className="text-xs text-slate-400 mt-3 pl-5">
              Contoh: <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-slate-600 dark:text-slate-300">INV/2023/X/001</code> atau <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-slate-600 dark:text-slate-300">B 9876 XYZ</code>
            </p>
          </form>
        </div>
      </div>

      {/* ── Quick Actions ───────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Buat Invoice Card */}
        <Link href="/invoice" className="group">
          <Card className="h-full border-blue-100 dark:border-blue-900/30 bg-gradient-to-br from-blue-600 to-blue-700 text-white overflow-hidden relative border-0 shadow-xl shadow-blue-500/20 transition-all duration-300 hover:shadow-2xl hover:scale-[1.01] hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none transition-transform group-hover:scale-150 duration-700" />
            <CardHeader className="relative z-10 pb-2">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm">
                <Plus className="text-white h-6 w-6" />
              </div>
              <CardTitle className="text-xl">Buat Invoice Baru</CardTitle>
              <CardDescription className="text-blue-100">
                Pilih dari 16 tipe invoice dengan template otomatis.
              </CardDescription>
            </CardHeader>
            <CardFooter className="relative z-10 pt-4">
              <div className="flex items-center text-sm font-semibold bg-white/20 px-4 py-2 rounded-full backdrop-blur-md group-hover:bg-white/30 transition-colors">
                Mulai Sekarang <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            </CardFooter>
          </Card>
        </Link>

        {/* Rekapitulasi Card */}
        <Link href="/rekap" className="group">
          <Card className="h-full border-emerald-100 dark:border-emerald-900/30 bg-gradient-to-br from-emerald-600 to-emerald-700 text-white overflow-hidden relative border-0 shadow-xl shadow-emerald-500/20 transition-all duration-300 hover:shadow-2xl hover:scale-[1.01] hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none transition-transform group-hover:scale-150 duration-700" />
            <CardHeader className="relative z-10 pb-2">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm">
                <BarChart3 className="text-white h-6 w-6" />
              </div>
              <CardTitle className="text-xl">Lihat Rekapitulasi</CardTitle>
              <CardDescription className="text-emerald-100">
                Pantau riwayat invoice, filter data, dan export laporan.
              </CardDescription>
            </CardHeader>
            <CardFooter className="relative z-10 pt-4">
              <div className="flex items-center text-sm font-semibold bg-white/20 px-4 py-2 rounded-full backdrop-blur-md group-hover:bg-white/30 transition-colors">
                Buka Data <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            </CardFooter>
          </Card>
        </Link>
      </div>

      {/* ── Recent Invoices ─────────────────────────────────── */}
      <RecentInvoices />

      {/* ── Features Highlights ─────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Zap, label: 'Template Otomatis', desc: '16 tipe kolom', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
          { icon: Shield, label: 'FEE Handling', desc: 'Auto potongan', color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
          { icon: FileText, label: 'PDF Instan', desc: 'Generate langsung', color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
          { icon: Clock, label: 'Rekapitulasi', desc: 'Filter & search', color: 'text-violet-500', bg: 'bg-violet-50 dark:bg-violet-900/20' },
        ].map((feat, i) => (
          <Card key={i} className="border-none shadow-sm hover:shadow-md transition-shadow bg-slate-50 dark:bg-slate-900">
            <CardContent className="flex flex-col items-center justify-center p-6 text-center h-full">
              <div className={`w-10 h-10 ${feat.bg} rounded-xl flex items-center justify-center mb-3`}>
                <feat.icon className={`h-5 w-5 ${feat.color}`} />
              </div>
              <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200 mb-1">{feat.label}</h4>
              <p className="text-xs text-slate-500">{feat.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Invoice Types Overview ──────────────────────────── */}
      <Card className="shadow-lg border-slate-200 dark:border-slate-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="space-y-1">
            <CardTitle className="text-xl">Tipe Invoice Tersedia</CardTitle>
            <CardDescription>
              {INVOICE_TYPES.length} tipe invoice siap digunakan
            </CardDescription>
          </div>
          <div className="text-4xl font-extrabold bg-gradient-to-br from-blue-500 to-indigo-600 bg-clip-text text-transparent">
            {INVOICE_TYPES.length}
          </div>
        </CardHeader>
        <CardContent className="grid gap-6">

          {/* Non-FEE types */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              <Package className="h-3 w-3" /> Standar ({nonFeeTypes.length} tipe)
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {nonFeeTypes.map(t => (
                <Link href="/invoice" key={t.id}>
                  <div className="group h-full flex items-center p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all cursor-pointer">
                    <div className="h-2 w-2 rounded-full bg-blue-500 mr-3 shrink-0" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate w-full group-hover:text-blue-700 dark:group-hover:text-blue-300">
                      {t.name}
                    </span>
                    <span className="ml-auto text-[10px] text-slate-400 shrink-0">
                      {t.columns.length} col
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <Separator />

          {/* FEE types */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              <TrendingUp className="h-3 w-3" /> FEE — Potongan Harga ({feeTypes.length} tipe)
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {feeTypes.map(t => (
                <Link href="/invoice" key={t.id}>
                  <div className="group h-full flex items-center p-3 rounded-lg border border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-900/10 hover:border-amber-400 dark:hover:border-amber-500 hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-all cursor-pointer">
                    <Badge variant="outline" className="mr-2 h-5 px-1 bg-amber-100 text-amber-700 border-amber-200 text-[9px]">FEE</Badge>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate w-full group-hover:text-amber-800 dark:group-hover:text-amber-400">
                      {t.name}
                    </span>
                    <span className="ml-auto text-[10px] text-amber-600/60 shrink-0">
                      {t.columns.length} col
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </CardContent>
      </Card>

      {/* ── Bottom Info Row ─────────────────────────────────── */}
      <div className="grid md:grid-cols-2 gap-6 pb-8">
        {/* Layanan */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Ship className="h-4 w-4 text-blue-500" /> Layanan Kami
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {['Handling Import', 'Handling Export', 'Trucking Kontainer', 'Pribadi Import'].map((s, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                <div className={`h-1.5 w-1.5 rounded-full ${i % 2 === 0 ? 'bg-blue-500' : 'bg-emerald-500'}`} />
                {s}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* FEE Rules */}
        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 text-amber-600 dark:text-amber-500">
              <Zap className="h-4 w-4" /> Aturan FEE
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              'Harga otomatis −Rp 150.000',
              'Footer: Total − DP = Jumlah',
              'Admin input DP manual',
            ].map((rule, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                {rule}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
