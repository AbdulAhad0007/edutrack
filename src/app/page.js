'use client';

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
  }, []);

  useEffect(() => {
    // Save dark mode preference
    if (typeof window !== 'undefined') {
      localStorage.setItem('darkMode', darkMode.toString());
    }
  }, [darkMode]);

  // Always show landing page at root. Users should login to access their ERP at /erp/[uid]
  return <LandingPage />;
}