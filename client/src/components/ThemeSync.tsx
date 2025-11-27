import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const ThemeSync = () => {
    const { user, isAuthenticated } = useAuth();
    const { setTheme } = useTheme();

    useEffect(() => {
        if (isAuthenticated && user?.theme) {
            setTheme(user.theme);
        }
    }, [user, isAuthenticated, setTheme]);

    return null;
};

export default ThemeSync;

