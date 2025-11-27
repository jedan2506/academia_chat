import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { themeClass } from '../constants/theme';

const ForceAuthTheme = () => {
    const location = useLocation();
    const isAuthPage = location.pathname === '/signin' || location.pathname === '/signup';

    useEffect(() => {
        const root = document.documentElement;
        
        if (isAuthPage) {
            root.classList.remove(themeClass);
        }
    }, [isAuthPage]);

    return null;
};

export default ForceAuthTheme;

