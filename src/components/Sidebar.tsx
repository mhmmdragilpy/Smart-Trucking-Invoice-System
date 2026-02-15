'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { FileText, BarChart3, Home, Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeProvider';

const navItems = [
    { href: '/', label: 'Dashboard', icon: Home },
    { href: '/invoice', label: 'Buat Invoice', icon: FileText },
    { href: '/rekap', label: 'Rekapitulasi', icon: BarChart3 },
];

export function Sidebar() {
    const pathname = usePathname();
    const { theme, toggleTheme } = useTheme();

    return (
        <aside className="sidebar">
            <div className="sidebar-brand">
                <Image
                    src="/logo.png"
                    alt="PT Tunggal Mandiri Logistik"
                    width={56}
                    height={56}
                    style={{ borderRadius: 'var(--radius-md)', objectFit: 'contain' }}
                    priority
                />
                <div className="sidebar-brand-text">
                    <h2>TML Logistik</h2>
                    <span>Invoice System</span>
                </div>
            </div>

            <nav className="sidebar-nav">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`sidebar-link ${isActive ? 'active' : ''}`}
                        >
                            <Icon size={18} />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Spacer */}
            <div style={{ flex: 1 }} />

            {/* Theme Toggle */}
            <button
                onClick={toggleTheme}
                className="theme-toggle"
                title={theme === 'dark' ? 'Mode Terang' : 'Mode Gelap'}
            >
                <div className="theme-toggle-track">
                    <div className={`theme-toggle-thumb ${theme}`}>
                        {theme === 'dark' ? <Moon size={12} /> : <Sun size={12} />}
                    </div>
                </div>
                <span className="theme-toggle-label">
                    {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                </span>
            </button>
        </aside>
    );
}
