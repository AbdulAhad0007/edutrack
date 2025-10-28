 "use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { Sun, Moon } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import TeacherSidebar from '@/components/TeacherSidebar';
import StudentDashboard from '@/components/StudentDashboard';
import TeacherDashboard from '@/components/TeacherDashboard';
import StudentManagement from '@/components/StudentManagement';
import AttendanceManagement from '@/components/AttendanceManagement';
import TimetableManagement from '@/components/TimetableManagement';
import GradesManagement from '@/components/GradesManagement';
import ExamsManagement from '@/components/ExamsManagement';
import StudentGrades from '@/components/StudentGrades';
import StudentExams from '@/components/StudentExams';
import StudentAttendance from '@/components/StudentAttendance';
import Analytics from '@/components/Analytics';
import TeacherNotificationsManagement from '@/components/TeacherNotificationsManagement';
import Feedback from '@/components/Feedback';
import FeesManagement from '@/components/FeesManagement';
import StudentFees from '@/components/StudentFees';
const MemoizedStudentDashboard = React.memo(StudentDashboard);
const MemoizedTeacherDashboard = React.memo(TeacherDashboard);
const MemoizedStudentManagement = React.memo(StudentManagement);
const MemoizedAttendanceManagement = React.memo(AttendanceManagement);
const MemoizedTimetableManagement = React.memo(TimetableManagement);
const MemoizedGradesManagement = React.memo(GradesManagement);
const MemoizedExamsManagement = React.memo(ExamsManagement);
const MemoizedStudentGrades = React.memo(StudentGrades);
const MemoizedStudentExams = React.memo(StudentExams);
const MemoizedStudentAttendance = React.memo(StudentAttendance);
const MemoizedAnalytics = React.memo(Analytics);
const MemoizedTeacherNotificationsManagement = React.memo(TeacherNotificationsManagement);
const MemoizedFeesManagement = React.memo(FeesManagement);
const MemoizedStudentFees = React.memo(StudentFees);
const MemoizedFeedback = React.memo(Feedback)

export default function ERPPage() {
  const { data: session, status } = useSession();
  const params = useParams();
  const router = useRouter();

  // Check user role early to avoid hoisting issues
  const isTeacher = session?.user?.role === 'teacher';
  const isStudent = session?.user?.role === 'student';

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [activeModule, setActiveModule] = useState(isStudent ? 'dashboard' : 'students');

  const id = params?.id;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('darkMode') === 'true';
      setDarkMode(saved);
    }
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('darkMode', newDarkMode.toString());
    }
  };

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/email');
    }
    if (status === 'authenticated' && session?.user?.id && id && session.user.id !== id) {
      // Redirect to the logged-in user's page (prevent accessing others' pages)
      router.push(`/erp/${session.user.id}`);
    }
  }, [status, session, id, router]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!session) return null;

  // If neither teacher nor student, show access denied
  if (!isTeacher && !isStudent) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Access Denied</h1>
          <p className="text-gray-600 dark:text-gray-400">You do not have permission to access this page.</p>
        </div>
      </div>
    );
  }

  // Mobile navigation items
  const getMobileNavItems = () => {
    if (isTeacher) {
      return [
        { id: 'students', name: 'Students', icon: '👥' },
        { id: 'attendance', name: 'Attendance', icon: '✓' },
        { id: 'timetable', name: 'Schedule', icon: '📅' },
        { id: 'grades', name: 'Grades', icon: '📊' },
        { id: 'exams', name: 'Exams', icon: '📝' },
        { id: 'fees', name: 'Fees', icon: '💰' },
        { id: 'notifications', name: 'Alerts', icon: '🔔' },
      ];
    } else {
      return [
        { id: 'dashboard', name: 'Dashboard', icon: '🏠' },
        { id: 'attendance', name: 'Attendance', icon: '✓' },
        { id: 'exams', name: 'Exams', icon: '📝' },
        { id: 'fees', name: 'Fees', icon: '💰' },
        { id: 'grades', name: 'Grades', icon: '📊' },
        { id: 'analytics', name: 'Analytics', icon: '📊' },
        { id: 'feedback-form', name: 'form', icon: '' },
      ];
    }
  };

  const mobileNavItems = getMobileNavItems();

  return (
    <div className={`flex h-screen bg-gray-50 dark:bg-gray-900 ${darkMode ? 'dark' : ''}`}>
      {isTeacher ? (
        <TeacherSidebar
          activeModule={activeModule}
          setActiveModule={(m) => setActiveModule(m)}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
        />
      ) : (
        <Sidebar
          activeModule={activeModule}
          setActiveModule={(m) => setActiveModule(m)}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
        />
      )}

      <div className="flex flex-col flex-1 w-full lg:ml-0">
        {/* Mobile header for navigation */}
        <div className="lg:hidden bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-purple-200 dark:bg-purple-700 flex items-center justify-center">
                <span className="text-purple-700 dark:text-purple-200 font-semibold text-sm sm:text-base">
                  {(session?.user?.name || 'U').charAt(0)}
                </span>
              </div>
              <div>
                <h1 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white truncate">
                  {isTeacher ? 'Teacher Panel' : 'Student Panel'}
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                  {session?.user?.name || 'User'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 sm:p-2.5 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors touch-manipulation"
                title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {darkMode ? <Sun className="w-4 h-4 sm:w-5 sm:h-5" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5" />}
              </button>
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 sm:p-2.5 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors touch-manipulation"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto pb-20 sm:pb-16 lg:pb-0">
          <div className="container px-3 sm:px-4 md:px-6 mx-auto py-4 sm:py-6 lg:py-8 max-w-7xl">
            {/* Render content based on user role */}
            {isTeacher ? (
              // Teacher Layout
              <div className="grid grid-cols-1 gap-4 sm:gap-6">
                <section className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 shadow-lg">
                  {/* Render teacher modules */}
                  {activeModule === 'students' && <MemoizedStudentManagement />}
                  {activeModule === 'attendance' && <MemoizedAttendanceManagement />}
                  {activeModule === 'timetable' && <MemoizedTimetableManagement />}
                  {activeModule === 'grades' && <MemoizedGradesManagement />}
                  {activeModule === 'exams' && <MemoizedExamsManagement />}
                  {activeModule === 'fees' && <MemoizedFeesManagement />}
                  {activeModule === 'notifications' && <MemoizedTeacherNotificationsManagement />}
                </section>
              </div>
            ) : (
              // Student Layout
              <div className="grid grid-cols-1 gap-4 sm:gap-6">
                <section className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 shadow-lg">
                  {/* Render student modules */}
                  {activeModule === 'dashboard' && <MemoizedStudentDashboard />}
                  {/* Add other student modules as needed */}
                  {activeModule === 'attendance' && <MemoizedStudentAttendance />}
                  {activeModule === 'exams' && <MemoizedStudentExams />}
                  {activeModule === 'fees' && <MemoizedStudentFees />}
                  {activeModule === 'grades' && <MemoizedStudentGrades />}
                  {activeModule === 'analytics' && <MemoizedAnalytics/>}
                  {activeModule === 'feedback-form' && <MemoizedFeedback/>}
                </section>
              </div>
            )}
          </div>
        </main>

        {/* Mobile Bottom Navigation */}
        
      </div>
    </div>
  );
}
