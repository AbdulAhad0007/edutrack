'use client';

import { useSession } from 'next-auth/react';
import { upsertUser } from '@/lib/firebaseClient';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import LandingPage from './landing/page';
import Feedback from '@/components/Feedback';
import Dashboard from '@/components/Dashboard';
import Attendance from '@/components/Attendance';
import Marks from '@/components/Marks';
import Timetable from '@/components/Timetable';
import Grades from '@/components/Grades';
import Exams from '@/components/Exams';
import Fees from '@/components/Fees';
import Analytics from '@/components/Analytics';
import SettingsPage from '@/app/settings/page';

export default function Home() {
  const { data: session, status } = useSession();
  const [darkMode, setDarkMode] = useState(false);
  const [activeModule, setActiveModule] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark');
    }
  };

  const renderModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return <Dashboard />;
      case 'attendance':
        return <Attendance />;
      case 'marks':
        return <Marks />;
      case 'timetable':
        return <Timetable />;
      case 'grades':
        return <Grades />;
      case 'exams':
        return <Exams />;
      case 'fees':
        return <Fees />;
      case 'analytics':
        return <Analytics />;
      case 'feedback-form':
        return <Feedback />;
      case 'about':
        return <About />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <Dashboard />;
    }
  };

  useEffect(() => {
    // Check if we're on the client side
    if (typeof window !== 'undefined') {
      // Check if dark mode was previously set
      const isDark = localStorage.getItem('darkMode') === 'true';
      setDarkMode(isDark);
      if (isDark) {
        document.documentElement.classList.add('dark');
      }
    }
    // Upsert signed-in user to Firestore
    if (session?.user) {
      upsertUser(session.user);
    }
  }, []);

  useEffect(() => {
    // Save dark mode preference
    if (typeof window !== 'undefined') {
      localStorage.setItem('darkMode', darkMode.toString());
    }
  }, [darkMode]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Always show landing page at root. Users should login to access their ERP at /erp/[uid]
  return <LandingPage />;
}