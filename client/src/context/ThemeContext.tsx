import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../utils/api';
import { theme, Theme, defaultTheme, themeStorageKey, themeClass } from '../constants/theme';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
};

interface ThemeProviderProps {
    children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const [currentTheme, setThemeState] = useState<Theme>(() => {
        const stored = localStorage.getItem(themeStorageKey);
        return (stored === theme.dark || stored === theme.light) ? stored : defaultTheme;
    });

    useEffect(() => {
        const root = document.documentElement;
        if (currentTheme === theme.dark) {
            root.classList.add(themeClass);
        } else {
            root.classList.remove(themeClass);
        }
        localStorage.setItem(themeStorageKey, currentTheme);
    }, [currentTheme]);

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
        const token = localStorage.getItem('token');
        if (token) {
            api.patch('/auth/theme', { theme: newTheme })
                .then(() => {
                    const userStr = localStorage.getItem('user');
                    if (userStr) {
                        const user = JSON.parse(userStr);
                        user.theme = newTheme;
                        localStorage.setItem('user', JSON.stringify(user));
                    }
                })
                .catch(console.error);
        }
    };

    const toggleTheme = () => {
        setTheme(currentTheme === theme.light ? theme.dark : theme.light);
    };

    return (
        <ThemeContext.Provider value={{ theme: currentTheme, toggleTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

