import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import api from '../utils/api';
import { theme, Theme, defaultTheme, themeClass } from '../constants/theme';

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
    const [currentTheme, setThemeState] = useState<Theme>(defaultTheme);

    useEffect(() => {
        const root = document.documentElement;
        if (currentTheme === theme.dark) {
            root.classList.add(themeClass);
        } else {
            root.classList.remove(themeClass);
        }
    }, [currentTheme]);

    const setTheme = useCallback((newTheme: Theme) => {
        console.log('[ThemeContext] setTheme called with:', newTheme);
        console.trace('[ThemeContext] Call stack');
        setThemeState((prevTheme) => {
            console.log('[ThemeContext] prevTheme:', prevTheme, 'newTheme:', newTheme);
            if (newTheme === prevTheme) {
                console.log('[ThemeContext] Theme unchanged, returning prevTheme');
                return prevTheme;
            }
            const token = localStorage.getItem('token');
            if (token) {
                console.log('[ThemeContext] 🔥 CALLING API to update theme to:', newTheme);
                api.patch('/auth/theme', { theme: newTheme })
                    .then(() => {
                        console.log('[ThemeContext] ✅ API call succeeded');
                        const userStr = localStorage.getItem('user');
                        if (userStr) {
                            const user = JSON.parse(userStr);
                            user.theme = newTheme;
                            localStorage.setItem('user', JSON.stringify(user));
                            console.log('[ThemeContext] 📢 Dispatching userThemeUpdated event');
                            window.dispatchEvent(new CustomEvent('userThemeUpdated', { detail: { theme: newTheme } }));
                        }
                    })
                    .catch((error) => {
                        console.error('[ThemeContext] ❌ API call failed:', error);
                    });
            } else {
                console.log('[ThemeContext] No token, skipping API call');
            }
            return newTheme;
        });
    }, []);

    const toggleTheme = useCallback(() => {
        setTheme(currentTheme === theme.light ? theme.dark : theme.light);
    }, [currentTheme, setTheme]);

    return (
        <ThemeContext.Provider value={{ theme: currentTheme, toggleTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
