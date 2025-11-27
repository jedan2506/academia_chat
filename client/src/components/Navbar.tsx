import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { FaBuilding } from 'react-icons/fa';
import ThemeToggle from './ThemeToggle';

const Navbar: React.FC = () => {
    const { user, logout } = useAuth();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleLogout = () => {
        logout();
        setIsDropdownOpen(false);
    };

    return (
        <nav className="bg-white dark:bg-gray-900 shadow-lg border-b border-gray-200 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
                <div className="flex justify-between h-14 md:h-16">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 flex items-center">
                            <div className="bg-primary-600 text-white p-1.5 md:p-2 rounded-lg">
                                <FaBuilding className="w-4 h-4 md:w-6 md:h-6" />
                            </div>
                            <span className="ml-2 text-lg md:text-xl font-bold text-gray-900 dark:text-white">virallens</span>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3 md:space-x-4">
                        <ThemeToggle />
                        
                        <div className="hidden md:block">
                            <span className="text-gray-700 dark:text-gray-300">Welcome, {user?.name}</span>
                        </div>

                        <div className="relative">
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                            >
                                <div className="w-7 h-7 md:w-8 md:h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                                    <span className="text-primary-600 dark:text-primary-300 font-medium text-sm md:text-base">
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            </button>

                            {isDropdownOpen && (
                                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
                                    <div className="py-1">
                                        <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-700">
                                            <div className="font-medium">{user?.name}</div>
                                            <div className="text-gray-500 dark:text-gray-400">{user?.email}</div>
                                        </div>
                                        <a
                                            href="#"
                                            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                        >
                                            Profile
                                        </a>
                                        <a
                                            href="#"
                                            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                        >
                                            Settings
                                        </a>
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                        >
                                            Sign out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
