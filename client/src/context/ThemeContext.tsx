import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../utils/api';
import { THEME, Theme, DEFAULT_THEME, THEME_STORAGE_KEY, THEME_CLASS } from '../constants/theme';

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
    const [theme, setThemeState] = useState<Theme>(() => {
        const stored = localStorage.getItem(THEME_STORAGE_KEY);
        return (stored === THEME.DARK || stored === THEME.LIGHT) ? stored : DEFAULT_THEME;
    });

    useEffect(() => {
        const root = document.documentElement;
        if (theme === THEME.DARK) {
            root.classList.add(THEME_CLASS);
        } else {
            root.classList.remove(THEME_CLASS);
        }
        localStorage.setItem(THEME_STORAGE_KEY, theme);
    }, [theme]);

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
        setTheme(theme === THEME.LIGHT ? THEME.DARK : THEME.LIGHT);
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

