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
  Users,
  Bell,
  Settings,
  Search,
  UserCheck,
  Clock,
  Menu,
  ChevronLeft,
  ChevronRight,
  Award,
  FileCheck,
  Sun,
  Moon
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';

export default function TeacherSidebar({ activeModule, setActiveModule, sidebarOpen, setSidebarOpen, darkMode, toggleDarkMode }) {
  const { data: session } = useSession();
  const [collapsed, setCollapsed] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  // Teacher-specific menu items (removed dashboard and settings)
  const teacherMenuItems = [
    { id: 'students', name: 'Students', icon: Users, roles: ['teacher'] },
    { id: 'attendance', name: 'Attendance', icon: UserCheck, roles: ['teacher'] },
    { id: 'timetable', name: 'Timetable', icon: Clock, roles: ['teacher'] },
    { id: 'grades', name: 'Grades', icon: Award, roles: ['teacher'] },
    { id: 'exams', name: 'Exams', icon: FileCheck, roles: ['teacher'] },
    { id: 'fees', name: 'Fees Management', icon: CreditCard, roles: ['teacher'] },
    { id: 'notifications', name: 'Notifications', icon: Bell, roles: ['teacher'] },
  ];

  const filteredMenuItems = teacherMenuItems.filter(item =>
    item.roles.includes(session?.user?.role)
  );

  const sidebarWidth = collapsed ? 'w-16' : 'w-64';

  // Handle window resize to determine if we're on desktop
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 400);
    };

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle collapse/expand for all screen sizes
  const handleToggleCollapse = () => {
    if (isDesktop) {
      setCollapsed(!collapsed);
    } else {
      // On mobile/tablet, toggle sidebar open/close
      setSidebarOpen(!sidebarOpen);
    }
  };

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
        className={`fixed inset-y-0 left-0 z-30 overflow-y-auto transition-all duration-300 bg-white dark:bg-gray-800 lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } ${sidebarWidth} flex flex-col`}
      >
        <div className="flex items-center justify-between p-4">
          <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
            <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center">
              <span className="text-purple-700 font-semibold">{(session?.user?.name || 'T').charAt(0)}</span>
            </div>
            {!collapsed && (
              <div>
                <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">{session?.user?.name || 'Teacher'}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Teacher</div>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            {/* Collapse/Expand button - works on all screen sizes */}
            <button
              onClick={handleToggleCollapse}
              className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label={isDesktop ? (collapsed ? "Expand sidebar" : "Collapse sidebar") : (sidebarOpen ? "Close sidebar" : "Open sidebar")}
            >
              {isDesktop ? (
                collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />
              ) : (
                sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        <div className="px-4 py-6">
          <ul className="mt-6">
            {filteredMenuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id} className="relative px-6 py-3">
                  <button
                    onClick={() => {
                      setActiveModule(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200 ${
                      activeModule === item.id
                        ? 'text-purple-600 dark:text-purple-400'
                        : 'text-gray-600 dark:text-gray-400'
                    } ${collapsed ? 'justify-center px-2' : ''}`}
                    title={collapsed ? item.name : ''}
                  >
                    {activeModule === item.id && (
                      <span
                        className="absolute inset-y-0 left-0 w-1 bg-purple-600 rounded-tr-lg rounded-br-lg"
                        aria-hidden="true"
                      ></span>
                    )}
                    <Icon className="w-5 h-5" />
                    {!collapsed && <span className="ml-4">{item.name}</span>}
                  </button>
                </li>
              );
            })}

            <li className={`relative px-6 py-3 mt-10 ${collapsed ? 'flex justify-center' : ''}`}>
              <button
                onClick={() => signOut({ callbackUrl: '/landing' })}
                className="inline-flex items-center w-full text-sm font-semibold text-gray-600 transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200 dark:text-gray-400"
                title={collapsed ? 'Logout' : ''}
              >
                <LogOut className="w-5 h-5" />
                {!collapsed && <span className="ml-4">Logout</span>}
              </button>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
}
