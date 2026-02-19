'use client';

import { createContext, useContext, useEffect, useState, useCallback, useRef, useLayoutEffect, type ReactNode } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
    theme: 'dark',
    toggleTheme: () => { },
});

export function useTheme() {
    return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setTheme] = useState<Theme>(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('tml-theme') as Theme | null;
            if (stored === 'light' || stored === 'dark') {
                return stored;
            }
        }
        return 'dark'; // Default for SSR
    });
    
    useEffect(() => {
        const root = document.documentElement;
        root.setAttribute('data-theme', theme);
        localStorage.setItem('tml-theme', theme);
    }, [theme]);

    const toggleTheme = useCallback(() => {
        setTheme(prev => {
            const newTheme = prev === 'dark' ? 'light' : 'dark';
            // Also update the DOM immediately when toggling
            const root = document.documentElement;
            root.setAttribute('data-theme', newTheme);
            localStorage.setItem('tml-theme', newTheme);
            return newTheme;
        });
    }, []);

    // For SSR, we don't need to worry about the flash since the theme will be applied on client side
    // We can just return the children directly

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}
