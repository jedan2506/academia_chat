import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { FiSun, FiMoon } from 'react-icons/fi';
import { theme as themeConstants } from '../constants/theme';

const ThemeToggle: React.FC = () => {
    const { theme, toggleTheme } = useTheme();

    const handleToggle = () => {
        console.log('[ThemeToggle] 🖱️ Toggle clicked, current theme:', theme);
        toggleTheme();
    };

    return (
        <>
            <button
                onClick={handleToggle}
                className="md:hidden p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-20"
                aria-label="Toggle theme"
                title={`Switch to ${theme === themeConstants.light ? themeConstants.dark : themeConstants.light} mode`}
            >
                {theme === themeConstants.light ? (
                    <FiSun className="w-5 h-5" />
                ) : (
                    <FiMoon className="w-5 h-5" />
                )}
            </button>

            <button
                onClick={handleToggle}
                className="hidden md:inline-flex relative h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 bg-gray-300 dark:bg-primary-600"
                aria-label="Toggle theme"
                title={`Switch to ${theme === themeConstants.light ? themeConstants.dark : themeConstants.light} mode`}
            >
                <span
                    className={`inline-flex h-4 w-4 items-center justify-center transform rounded-full bg-white transition-transform duration-200 ${
                        theme === themeConstants.dark ? 'translate-x-6' : 'translate-x-1'
                    }`}
                >
                    {theme === themeConstants.light ? (
                        <FiSun className="w-3 h-3 text-yellow-500" />
                    ) : (
                        <FiMoon className="w-3 h-3 text-indigo-600" />
                    )}
                </span>
            </button>
        </>
    );
};

export default ThemeToggle;

