"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import Dashboard from '@/components/Dashboard';
import Attendance from '@/components/Attendance';
import Marks from '@/components/Marks';
import Exams from '@/components/Exams';
import Fees from '@/components/Fees';
import Grades from '@/components/Grades';
import Timetable from '@/components/Timetable';
import Analytics from '@/components/Analytics';
import Feedback from '@/components/Feedback';
import { getStudentById } from '@/lib/students';

const MemoizedDashboard = React.memo(Dashboard);
const MemoizedAttendance = React.memo(Attendance);
const MemoizedMarks = React.memo(Marks);
const MemoizedExams = React.memo(Exams);
const MemoizedFees = React.memo(Fees);
const MemoizedGrades = React.memo(Grades);
const MemoizedTimetable = React.memo(Timetable);
const MemoizedAnalytics = React.memo(Analytics);
const MemoizedFeedback = React.memo(Feedback);

export default function StudentERPPage() {
  const { data: session, status } = useSession();
  const params = useParams();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [activeModule, setActiveModule] = useState('dashboard');

  const id = params?.id;
  const student = getStudentById(id);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('darkMode') === 'true';
      setDarkMode(saved);
    }
  }, []);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/email');
    }
    if (status === 'authenticated' && session?.user?.id && id && session.user.id !== id) {
      // Redirect to the logged-in student's page (prevent accessing others' pages)
      router.push(`/erp/${session.user.id}`);
    }
  }, [status, session, id, router]);

  if (status === 'loading') {
    return null;
  }

  if (!session) return null;

  return (
    <div className={`flex h-screen bg-gray-50 dark:bg-gray-900 ${darkMode ? 'dark' : ''}`}>
      <Sidebar
        activeModule={activeModule}
        setActiveModule={(m) => setActiveModule(m)}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex flex-col flex-1 w-full">
        {/* On dashboard we hide full navbar and only show profile (no toggle) */}
        <Header toggleDarkMode={() => {}} darkMode={false} setSidebarOpen={setSidebarOpen} showToggle={false} showNav={false} />

        <main className="h-full  overflow-y-auto">
          <div className="container px-6 mx-auto py-8">
            <div className="grid">
              

              <section className="md:col-span-2 bg-white rounded-lg p-6 shadow dark:bg-gray-800">
                {/* Render selected module */}
                {activeModule === 'dashboard' && <MemoizedDashboard setActiveModule={setActiveModule} />}
                {activeModule === 'attendance' && <MemoizedAttendance />}
                {activeModule === 'marks' && <MemoizedMarks />}
                {activeModule === 'exams' && <MemoizedExams student={student} />}
                {activeModule === 'fees' && <MemoizedFees />}
                {activeModule === 'grades' && <MemoizedGrades />}
                {activeModule === 'timetable' && <MemoizedTimetable student={student} />}
                {activeModule === 'analytics' && <MemoizedAnalytics studentId={id} />}
                {activeModule === 'feedback-form' && <MemoizedFeedback />}
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}


