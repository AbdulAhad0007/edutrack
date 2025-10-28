// src/components/Header.jsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { Bell, Menu, Moon, Sun, User } from 'lucide-react';
import ReactDOM from 'react-dom';
import NotificationPopup from './NotificationPopup';

export default function Header({ toggleDarkMode, darkMode, setSidebarOpen, showToggle = true, showNav = true, notifications = [] }) {
  const { data: session } = useSession();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(true);

  // Mock notifications if none provided
  const defaultNotifications = [
    { id: 1, text: 'Assignment due for Mathematics on Friday', timestamp: '2 hours ago' },
    { id: 2, text: 'New notice: Library timing updated', timestamp: '1 day ago' },
    { id: 3, text: 'Exam schedule released for next month', timestamp: '3 days ago' },
  ];

  const displayNotifications = notifications.length > 0 ? notifications : defaultNotifications;

  const markAllAsRead = () => {
    setUnreadNotifications(false);
    setShowNotifications(false);
  };

  const notificationRef = useRef();
  const profileRef = useRef();
  const profileDropdownRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target) && profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
<<<<<<< HEAD
    <header className="z-10 py-3 sm:py-4 shadow-md overflow-visible" style={{ backgroundColor: 'var(--card)', color: 'var(--text)' }}>
      <div className="container flex items-center justify-between h-full px-4 sm:px-6 mx-auto text-purple-600 dark:text-purple-300 max-w-7xl">
        <button
          className="p-2 mr-3 sm:mr-5 -ml-1 rounded-md md:hidden focus:outline-none focus:shadow-outline-purple touch-manipulation"
          onClick={() => setSidebarOpen(true)}
          aria-label="Menu"
        >
          <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
=======
    <header className="z-10 py-4 shadow-md overflow-visible" style={{ backgroundColor: 'var(--card)', color: 'var(--text)' }}>
      <div className="container flex items-center justify-between h-full px-6 mx-auto text-purple-600 dark:text-purple-300">
        <button
          className="p-1 mr-5 -ml-1 rounded-md md:hidden focus:outline-none focus:shadow-outline-purple"
          onClick={() => setSidebarOpen(true)}
          aria-label="Menu"
        >
          <Menu className="w-6 h-6" />
>>>>>>> e72ad566b79fdad6a6790dcdbf09158b3490aec0
        </button>

        {showNav && (
          <nav className="flex items-center justify-center flex-1 lg:mr-32">
<<<<<<< HEAD
            <ul className="flex items-center space-x-4 sm:space-x-6">
              <li>
                <a href="#" onClick={() => window.location.href = '/'} className="text-sm sm:text-base text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Home</a>
              </li>
              <li>
                <a href="#about" className="text-sm sm:text-base text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">About</a>
=======
            <ul className="flex items-center space-x-6">
              <li>
                <a href="#" onClick={() => window.location.href = '/'} className="text-sm text-gray-700 dark:text-gray-200">Home</a>
              </li>
              <li>
                <a href="#about" className="text-sm text-gray-700 dark:text-gray-200">About</a>
>>>>>>> e72ad566b79fdad6a6790dcdbf09158b3490aec0
              </li>
            </ul>
          </nav>
        )}

<<<<<<< HEAD
        <ul className="flex items-center flex-shrink-0 space-x-3 sm:space-x-4 lg:space-x-6">
          {showToggle && (
            <li className="flex">
              <button
                className="p-2 rounded-md focus:outline-none focus:shadow-outline-purple touch-manipulation"
=======
        <ul className="flex items-center flex-shrink-0 space-x-6">
          {showToggle && (
            <li className="flex">
              <button
                className="rounded-md focus:outline-none focus:shadow-outline-purple"
>>>>>>> e72ad566b79fdad6a6790dcdbf09158b3490aec0
                onClick={toggleDarkMode}
                aria-label="Toggle color mode"
              >
                {darkMode ? (
<<<<<<< HEAD
                  <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
                ) : (
                  <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 dark:text-gray-400" />
=======
                  <Sun className="w-5 h-5 text-yellow-400" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-700" />
>>>>>>> e72ad566b79fdad6a6790dcdbf09158b3490aec0
                )}
              </button>
            </li>
          )}

          <li className="relative" ref={notificationRef}>
            <button
<<<<<<< HEAD
              className="relative align-middle p-2 rounded-md focus:outline-none focus:shadow-outline-purple touch-manipulation"
=======
              className="relative align-middle rounded-md focus:outline-none focus:shadow-outline-purple"
>>>>>>> e72ad566b79fdad6a6790dcdbf09158b3490aec0
              onClick={() => setShowNotifications(!showNotifications)}
              aria-label="Notifications"
              aria-haspopup="true"
            >
<<<<<<< HEAD
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              {displayNotifications.length > 0 && unreadNotifications && (
                <span
                  aria-hidden="true"
                  className="absolute top-0 right-0 inline-block w-2 h-2 sm:w-3 sm:h-3 transform translate-x-1 -translate-y-1 bg-red-600 border-2 border-white rounded-full dark:border-gray-800"
=======
              <Bell className="w-5 h-5" />
              {displayNotifications.length > 0 && unreadNotifications && (
                <span
                  aria-hidden="true"
                  className="absolute top-0 right-0 inline-block w-3 h-3 transform translate-x-1 -translate-y-1 bg-red-600 border-2 border-white rounded-full dark:border-gray-800"
>>>>>>> e72ad566b79fdad6a6790dcdbf09158b3490aec0
                ></span>
              )}
            </button>
            <NotificationPopup
              notifications={displayNotifications}
              isOpen={showNotifications}
              onClose={() => setShowNotifications(false)}
              markAllAsRead={markAllAsRead}
            />
          </li>

          <li className="relative">
            <button
<<<<<<< HEAD
              className="rounded-full focus:shadow-outline-purple focus:outline-none touch-manipulation"
=======
              className="rounded-full focus:shadow-outline-purple focus:outline-none"
>>>>>>> e72ad566b79fdad6a6790dcdbf09158b3490aec0
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              aria-label="Account"
              aria-haspopup="true"
            >
              <div className="flex items-center">
<<<<<<< HEAD
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-purple-200 dark:bg-purple-700 flex items-center justify-center mr-2 sm:mr-3">
                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-purple-700 dark:text-purple-200" />
                </div>
                <div className="text-left hidden md:block">
                  <p className="text-sm sm:text-base font-semibold text-gray-800 dark:text-gray-200 truncate max-w-24 sm:max-w-32">
                    {session?.user?.name || 'Student'}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
=======
                <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center mr-2">
                  <User className="w-5 h-5 text-purple-700" />
                </div>
                <div className="text-left hidden md:block">
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                    {session?.user?.name || 'Student'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
>>>>>>> e72ad566b79fdad6a6790dcdbf09158b3490aec0
                    UID: {session?.user?.id}
                  </p>
                </div>
              </div>
            </button>

          {showProfileDropdown && (
            <div className="relative">
<<<<<<< HEAD
              <div className="absolute right-0 w-56 sm:w-64 p-2 mt-2 space-y-2 text-gray-600 bg-white border border-gray-100 rounded-md shadow-md dark:border-gray-700 dark:text-gray-300 dark:bg-gray-700 z-60">
                <div className="px-3 sm:px-4 py-2 border-b border-gray-200 dark:border-gray-600">
                  <p className="text-sm sm:text-base font-semibold text-gray-800 dark:text-gray-200 truncate">
                    {session?.user?.name || 'Student'}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                    UID: {session?.user?.id}
                  </p>
                </div>
                <div className="px-3 sm:px-4 py-2 text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-600">
=======
              <div className="absolute right-0 w-56 p-2 mt-2 space-y-2 text-gray-600 bg-white border border-gray-100 rounded-md shadow-md dark:border-gray-700 dark:text-gray-300 dark:bg-gray-700 z-60">
                <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-600">
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                    {session?.user?.name || 'Student'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    UID: {session?.user?.id}
                  </p>
                </div>
                <div className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-600">
>>>>>>> e72ad566b79fdad6a6790dcdbf09158b3490aec0
                  Profile
                </div>
                <a
                  href="/settings"
<<<<<<< HEAD
                  className="block px-3 sm:px-4 py-2 text-sm sm:text-base transition-colors duration-150 rounded-md hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-200 touch-manipulation"
=======
                  className="block px-4 py-2 text-sm transition-colors duration-150 rounded-md hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-200"
>>>>>>> e72ad566b79fdad6a6790dcdbf09158b3490aec0
                >
                  Settings
                </a>
                <button
                  onClick={() => signOut({ callbackUrl: '/landing' })}
<<<<<<< HEAD
                  className="block w-full text-left px-3 sm:px-4 py-2 text-sm sm:text-base transition-colors duration-150 rounded-md hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-200 touch-manipulation"
=======
                  className="block w-full text-left px-4 py-2 text-sm transition-colors duration-150 rounded-md hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-200"
>>>>>>> e72ad566b79fdad6a6790dcdbf09158b3490aec0
                >
                  Log out
                </button>
              </div>
            </div>
          )}
          </li>
        </ul>
      </div>
    </header>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> e72ad566b79fdad6a6790dcdbf09158b3490aec0
