'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginAction } from '@/app/actions/auth';
import { Loader2, Truck, ShieldCheck, Lock, User } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);

        try {
            const result = await loginAction(formData);

            if (result.success) {
                toast.success('Login successful! Redirecting...');
                // Force full reload to ensure auth state is perfectly synced
                window.location.href = '/';
            } else {
                toast.error(result.error || 'Login failed');
                setLoading(false);
            }
        } catch (error) {
            console.error(error);
            toast.error('An unexpected error occurred');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid relative overflow-hidden bg-slate-50 dark:bg-slate-950">
            {/* Background Decoration */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="flex items-center justify-center p-6 relative z-10">
                <Card className="w-full max-w-md shadow-2xl border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
                    <CardHeader className="space-y-1 text-center pb-8">
                        <div className="mx-auto w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 mb-4">
                            <Truck className="text-white" size={24} />
                        </div>
                        <CardTitle className="text-2xl font-bold">
                            TML Logistik
                        </CardTitle>
                        <CardDescription>
                            Sign in to access your dashboard
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="username">Username</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                    <Input
                                        id="username"
                                        name="username"
                                        type="text"
                                        placeholder="Enter your username"
                                        className="pl-9 bg-white dark:bg-slate-950"
                                        required
                                        autoFocus
                                        autoComplete="username"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        placeholder="••••••••"
                                        className="pl-9 bg-white dark:bg-slate-950"
                                        required
                                        autoComplete="current-password"
                                    />
                                </div>
                            </div>

                            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 shadow-md" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Sign In
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4 text-center pb-8">
                        <div className="text-xs text-slate-500 flex items-center justify-center gap-2">
                            <ShieldCheck size={12} />
                            Secure Enterprise System
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
