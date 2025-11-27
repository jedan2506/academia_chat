import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const ThemeSync = () => {
    const { user, isAuthenticated, updateUser } = useAuth();
    const { setTheme } = useTheme();
    const location = useLocation();
    const isAuthPage = location.pathname === '/signin' || location.pathname === '/signup';
    const hasInitialized = useRef(false);

    useEffect(() => {
        if (!hasInitialized.current && isAuthenticated && user?.theme && !isAuthPage) {
            setTheme(user.theme);
            hasInitialized.current = true;
        }
    }, [isAuthenticated, user?.theme, isAuthPage, setTheme]);

    useEffect(() => {
        if (!isAuthenticated || isAuthPage) {
            hasInitialized.current = false;
        }
    }, [isAuthenticated, isAuthPage]);

    useEffect(() => {
        const handleThemeUpdate = (event: CustomEvent) => {
            updateUser({ theme: event.detail.theme });
        };

        window.addEventListener('userThemeUpdated', handleThemeUpdate as EventListener);
        return () => {
            window.removeEventListener('userThemeUpdated', handleThemeUpdate as EventListener);
        };
    }, [updateUser]);

    return null;
};

export default ThemeSync;
