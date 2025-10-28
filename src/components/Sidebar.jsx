// src/components/Sidebar.jsx
'use client';

import { useSession } from 'next-auth/react';
import {
  Home,
  Calendar,
  BookOpen,
  BarChart3,
  CreditCard,
  ClipboardList,
  FileText,
  X,
  LogOut,
  Sun,
  Moon
} from 'lucide-react';
import { signOut } from 'next-auth/react';

export default function Sidebar({ activeModule, setActiveModule, sidebarOpen, setSidebarOpen, darkMode, toggleDarkMode }) {
  const { data: session } = useSession();

  // Student-only menu (ordered)
  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: Home, roles: [ 'admin','student','teacher'] },
    { id: 'attendance', name: 'Attendance', icon: Calendar, roles: ['student', 'teacher'] },
    { id: 'exams', name: 'Exams', icon: ClipboardList, roles: ['student', 'teacher'] },
    { id: 'fees', name: 'Fees', icon: CreditCard, roles: ['student'] },
    { id: 'grades', name: 'Grades', icon: BarChart3, roles: ['student'] },
    { id: 'timetable', name: 'Timetable', icon: Calendar, roles: ['teacher'] },
    { id: 'feedback-form', name: 'Feedback Form', icon: FileText, roles: ['student'] },

    // Admin menu items
    { id: 'notifications', name: 'Notifications', icon: FileText, roles: ['admin'] },
    { id: 'meetings', name: 'Meetings', icon: Calendar, roles: ['admin'] },
    { id: 'settings', name: 'Settings', icon: BarChart3, roles: ['admin'] },

    // Teacher menu items
    { id: 'teacher-profile', name: 'Profile', icon: FileText, roles: ['teacher'] },
    { id: 'teacher-classes', name: 'Classes', icon: ClipboardList, roles: ['teacher'] },
  ];

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(session?.user?.role)
  );

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-10 transition-opacity bg-black opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
      
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 sm:w-72 overflow-y-auto transition-transform duration-300 ease-in-out bg-white dark:bg-gray-800 lg:translate-x-0 lg:static lg:inset-0 shadow-xl lg:shadow-none ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-purple-200 dark:bg-purple-700 flex items-center justify-center">
              <span className="text-purple-700 dark:text-purple-200 font-semibold text-sm sm:text-base">
                {(session?.user?.name || 'S').charAt(0)}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm sm:text-base font-semibold text-gray-800 dark:text-gray-200 truncate">
                {session?.user?.name || 'Student'}
              </div>
              <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                {session?.user?.id || ''}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors touch-manipulation"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <Sun className="w-4 h-4 sm:w-5 sm:h-5" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>
            <button
              className="lg:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors touch-manipulation"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>
        
        <div className="px-4 sm:px-6 py-6">
          <ul className="mt-6 space-y-1">
            {filteredMenuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id} className="relative">
                  <button
                    onClick={() => {
                      setActiveModule(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`inline-flex items-center w-full px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-semibold transition-all duration-150 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg touch-manipulation ${
                      activeModule === item.id
                        ? 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {activeModule === item.id && (
                      <span
                        className="absolute inset-y-0 left-0 w-1 bg-purple-600 rounded-tr-lg rounded-br-lg"
                        aria-hidden="true"
                      ></span>
                    )}
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
                    <span className="ml-3 sm:ml-4 truncate">{item.name}</span>
                  </button>
                </li>
              );
            })}
            
            <li className="relative mt-8 sm:mt-10">
              <button
                onClick={() => signOut({ callbackUrl: '/landing' })}
                className="inline-flex items-center w-full px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-semibold text-gray-600 dark:text-gray-400 transition-all duration-150 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 rounded-lg touch-manipulation"
              >
                <LogOut className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
                <span className="ml-3 sm:ml-4">Logout</span>
              </button>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
}