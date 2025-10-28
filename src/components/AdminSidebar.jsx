'use client';

import { useSession } from 'next-auth/react';
import {
  Home,
  Users,
  BookOpen,
  BarChart3,
  FileText,
  Calendar,
  Settings,
  X,
  LogOut,
  Send,
  UserCheck,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useState } from 'react';

export default function AdminSidebar({ activeModule, setActiveModule, sidebarOpen, setSidebarOpen }) {
  const { data: session, status } = useSession();
  const [collapsed, setCollapsed] = useState(false);

  // Admin-specific menu items
  const adminMenuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: Home },
    { id: 'notices', name: 'Send Notices', icon: Send },
    { id: 'meetings', name: 'Arrange Meetings', icon: Calendar }
  ];

  // Show all menu items for any authenticated user or if session is loading
  // For now, show menu items for any user (including unauthenticated) to test
  const filteredMenuItems = status === 'loading' || session?.user || true
    ? adminMenuItems
    : [];

  const sidebarWidth = collapsed ? 'w-16' : 'w-64';

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
        className={`fixed inset-y-0 left-0 z-30 overflow-y-auto transition-all duration-300 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } ${sidebarWidth}`}
      >
        <div className="flex items-center justify-between p-4">
          <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
            <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center">
              <span className="text-purple-700 font-semibold">{(session?.user?.name || 'A').charAt(0)}</span>
            </div>
            {!collapsed && (
              <div>
                <div className="text-sm font-semibold text-gray-900 dark:text-gray-200">{session?.user?.name || 'Admin'}</div>
                <div className="text-xs text-gray-700 dark:text-gray-400">Administrator</div>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {/* Collapse/Expand button */}
            <button
              className="hidden lg:block p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setCollapsed(!collapsed)}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
            <button
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="px-4 py-6">
          <ul className="mt-6">
            {filteredMenuItems.length === 0 ? (
              <li className="px-6 py-3 text-center text-gray-500 dark:text-gray-400">
                {status === 'loading' ? 'Loading...' : 'No admin access'}
              </li>
            ) : (
              filteredMenuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id} className="relative px-6 py-3">
                    <button
                      onClick={() => {
                        setActiveModule(item.id);
                        setSidebarOpen(false);
                      }}
                      className={`inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-900 dark:hover:text-gray-200 ${
                        activeModule === item.id
                          ? 'text-purple-600 dark:text-purple-400'
                          : 'text-gray-700 dark:text-gray-400'
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
              })
            )}

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
