import React from 'react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle: React.FC = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 bg-gray-300 dark:bg-primary-600"
            aria-label="Toggle theme"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
            <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                    theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                }`}
            />
        </button>
    );
};

export default ThemeToggle;

