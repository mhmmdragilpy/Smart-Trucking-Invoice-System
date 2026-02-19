'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FileText, BarChart3, Home, Sun, Moon, Database, Menu, PanelLeftClose, PanelLeftOpen, LogOut, ShieldCheck } from 'lucide-react';
import { useTheme } from 'next-themes';
import { logoutAction } from '@/app/actions/auth';


import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';

const navItems = [
    { href: '/', label: 'Dashboard', icon: Home },
    { href: '/invoice', label: 'Buat Invoice', icon: FileText },
    { href: '/rekap', label: 'Rekapitulasi', icon: BarChart3 },
    { href: '/admin/data', label: 'Data Master', icon: Database },
];

export function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    // Use next-themes correctly if configured, otherwise using custom hook from previous implementation
    // Assuming we want to use the previous ThemeProvider logic or switch to next-themes
    // The previous implementation used a custom context. I will stick to a simple toggle for now or check ThemeProvider.tsx
    // Let's assume standard next-themes for shadcn compatibility, requiring a ThemeProvider wrapper.
    // I'll check ThemeProvider.tsx content later. For now, I'll allow toggle.
    // Edit: The user has existing ThemeProvider.tsx. I should use that or replace it.
    // Shadcn typically uses next-themes. I'll assume users want that. 
    // But to be safe and avoid breaking, I'll try to import useTheme from next-themes 
    // AND if it fails (context missing), fallback or just implement the button logic.
    // Actually, I'll attempt to use the existing theme provider logic if I can find it, 
    // but the `useTheme` from `next-themes` is standard for Shadcn.

    // Let's use a local state for theme for now if next-themes is not installed, 
    // or just assume dark mode support via class strategy (which is what shadcn uses).

    const [isCollapsed, setIsCollapsed] = useState(false);
    // Hardcoded session for admin
    const session = {
        user: {
            name: 'Admin User',
            email: 'admin@tml-logistik.com',
            image: ''
        }
    };

    // For theme, let's implement a manual toggle that adds/removes 'dark' class 
    // effectively mimicking next-themes or the existing one.
    const [theme, setTheme] = useState<'light' | 'dark'>('light');

    useEffect(() => {
        if (document.documentElement.classList.contains('dark')) {
            setTheme('dark');
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    const handleLogout = async () => {
        await logoutAction();
    };

    const SidebarContent = ({ mobile = false }) => (
        <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground">
            {/* Header / Brand */}
            <div className={cn(
                "h-16 flex items-center border-b border-sidebar-border px-4 transition-all duration-300",
                isCollapsed && !mobile ? "justify-center" : "justify-between"
            )}>
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-9 h-9 shrink-0 bg-primary/10 text-primary rounded-lg flex items-center justify-center font-bold shadow-sm">
                        <TruckIcon className="w-5 h-5" />
                    </div>
                    <div className={cn(
                        "flex flex-col transition-opacity duration-200",
                        isCollapsed && !mobile ? "w-0 opacity-0 hidden" : "opacity-100"
                    )}>
                        <h1 className="font-heading font-bold text-sidebar-foreground text-sm leading-tight">
                            TML Logistik
                        </h1>
                        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                            Invoice System
                        </span>
                    </div>
                </div>

                {/* Collapse Button (Desktop Only) */}
                {!mobile && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className={cn("h-8 w-8 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground", isCollapsed && "hidden")}
                        onClick={() => setIsCollapsed(true)}
                    >
                        <PanelLeftClose className="h-4 w-4" />
                    </Button>
                )}
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto py-4">
                <nav className="space-y-1 px-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Button
                                key={item.href}
                                asChild
                                variant={isActive ? "secondary" : "ghost"}
                                className={cn(
                                    "w-full justify-start h-11 mb-1 font-body",
                                    isActive
                                        ? "bg-sidebar-primary/10 text-sidebar-primary font-semibold"
                                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                                    isCollapsed && !mobile ? "justify-center px-0" : "px-4"
                                )}
                                title={isCollapsed && !mobile ? item.label : undefined}
                            >
                                <Link href={item.href}>
                                    <Icon className={cn("h-5 w-5 shrink-0", !isCollapsed || mobile ? "mr-3" : "")} />
                                    {(!isCollapsed || mobile) && <span>{item.label}</span>}
                                    {isActive && !isCollapsed && !mobile && (
                                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-sidebar-primary" />
                                    )}
                                </Link>
                            </Button>
                        );
                    })}
                </nav>
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t border-sidebar-border space-y-2">
                {/* Theme Toggle */}
                <Button
                    variant="outline"
                    className={cn(
                        "w-full justify-start border-sidebar-border hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                        isCollapsed && !mobile ? "justify-center px-0" : ""
                    )}
                    onClick={toggleTheme}
                >
                    {theme === 'dark' ? <Moon className="h-4 w-4 shrink-0" /> : <Sun className="h-4 w-4 shrink-0" />}
                    {(!isCollapsed || mobile) && <span className="ml-2 font-body">{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>}
                </Button>

                {/* User Profile */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className={cn(
                                "w-full justify-start h-auto py-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                                isCollapsed && !mobile ? "justify-center px-0" : ""
                            )}
                        >
                            <Avatar className="h-8 w-8 shrink-0">
                                <AvatarImage src={session?.user?.image || ''} />
                                <AvatarFallback className="bg-sidebar-primary/10 text-sidebar-primary">
                                    {session?.user?.name?.charAt(0) || 'U'}
                                </AvatarFallback>
                            </Avatar>
                            {(!isCollapsed || mobile) && (
                                <div className="flex flex-col items-start ml-2 text-left overflow-hidden">
                                    <span className="text-xs font-semibold truncate w-full max-w-[120px] text-sidebar-foreground">
                                        {session?.user?.name || 'Guest User'}
                                    </span>
                                    <span className="text-[10px] text-muted-foreground truncate w-full max-w-[120px]">
                                        {session?.user?.email || 'Not logged in'}
                                    </span>
                                </div>
                            )}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={handleLogout}>
                            <LogOut className="mr-2 h-4 w-4" /> Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Desktop Expand Button */}
                {isCollapsed && !mobile && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="w-full mt-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        onClick={() => setIsCollapsed(false)}
                    >
                        <PanelLeftOpen className="h-4 w-4" />
                    </Button>
                )}
            </div>
        </div>
    );

    return (
        <>
            {/* Mobile Sheet */}
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="lg:hidden fixed top-4 left-4 z-50 bg-background/80 backdrop-blur-sm border shadow-sm">
                        <Menu className="h-5 w-5" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-[280px]">
                    <SidebarContent mobile />
                </SheetContent>
            </Sheet>

            {/* Desktop Sidebar */}
            <aside
                className={cn(
                    "hidden lg:flex flex-col border-r h-screen sticky top-0 transition-all duration-300 bg-sidebar border-sidebar-border",
                    isCollapsed ? "w-[80px]" : "w-[260px]"
                )}
            >
                <SidebarContent />
            </aside>
        </>
    );
}

function TruckIcon({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M10 17h4V5H2v12h3" />
            <path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5" />
            <path d="M14 17h1" />
            <circle cx="7.5" cy="17.5" r="2.5" />
            <circle cx="17.5" cy="17.5" r="2.5" />
        </svg>
    )
}
