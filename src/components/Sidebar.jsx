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
  LogOut
} from 'lucide-react';
import { signOut } from 'next-auth/react';

export default function Sidebar({ activeModule, setActiveModule, sidebarOpen, setSidebarOpen }) {
  const { data: session } = useSession();

  // Student-only menu (ordered)
  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: Home, roles: ['student'] },
    { id: 'attendance', name: 'Attendance', icon: Calendar, roles: ['student'] },
    { id: 'exams', name: 'Exams', icon: ClipboardList, roles: ['student'] },
    { id: 'fees', name: 'Fees', icon: CreditCard, roles: ['student'] },
    { id: 'grades', name: 'Grades', icon: BarChart3, roles: ['student'] },
    { id: 'timetable', name: 'Timetable', icon: Calendar, roles: ['student'] },
    { id: 'analytics', name: 'Analytics', icon: BarChart3, roles: ['student'] },
    { id: 'feedback-form', name: 'Feedback Form', icon: FileText, roles: ['student'] },
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
        className={`fixed inset-y-0 left-0 z-30 w-64 overflow-y-auto transition-transform duration-300 bg-white dark:bg-gray-800 lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center">
              <span className="text-purple-700 font-semibold">{(session?.user?.name || 'S').charAt(0)}</span>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">{session?.user?.name || 'Student'}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{session?.user?.id || ''}</div>
            </div>
          </div>
          <button
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="w-6 h-6" />
          </button>
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
                    }`}
                  >
                    {activeModule === item.id && (
                      <span
                        className="absolute inset-y-0 left-0 w-1 bg-purple-600 rounded-tr-lg rounded-br-lg"
                        aria-hidden="true"
                      ></span>
                    )}
                    <Icon className="w-5 h-5" />
                    <span className="ml-4">{item.name}</span>
                  </button>
                </li>
              );
            })}
            
            <li className="relative px-6 py-3 mt-10">
              <button
                onClick={() => signOut({ callbackUrl: '/landing' })}
                className="inline-flex items-center w-full text-sm font-semibold text-gray-600 transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200 dark:text-gray-400"
              >
                <LogOut className="w-5 h-5" />
                <span className="ml-4">Logout</span>
              </button>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
}