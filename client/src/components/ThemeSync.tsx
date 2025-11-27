import { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const ThemeSync = () => {
    const { user, isAuthenticated } = useAuth();
    const { setTheme } = useTheme();
    const hasInitialized = useRef(false);

    useEffect(() => {
        if (isAuthenticated && user?.theme && !hasInitialized.current) {
            setTheme(user.theme);
            hasInitialized.current = true;
        }
    }, [isAuthenticated, user?.theme, setTheme]);

    return null;
};

export default ThemeSync;

