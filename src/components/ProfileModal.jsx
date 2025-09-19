'use client';

import React, { useState } from 'react';

const ProfileModal = ({ student, isOpen, onClose }) => {
  const [activeModule, setActiveModule] = useState('dashboard');

  if (!isOpen) return null;

  const MemoizedDashboard = React.memo(require('./Dashboard').default);
  const MemoizedAttendance = React.memo(require('./Attendance').default);
  const MemoizedMarks = React.memo(require('./Marks').default);
  const MemoizedExams = React.memo(require('./Exams').default);
  const MemoizedFees = React.memo(require('./Fees').default);
  const MemoizedGrades = React.memo(require('./Grades').default);
  const MemoizedTimetable = React.memo(require('./Timetable').default);
  const MemoizedAnalytics = React.memo(require('./Analytics').default);
  const MemoizedFeedback = React.memo(require('./Feedback').default);

  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-11/12 max-w-4xl p-6 overflow-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Student Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-bold text-xl"
            aria-label="Close profile modal"
          >
            &times;
          </button>
        </div>
        <div className="mb-4 text-sm text-gray-600 dark:text-gray-300 space-y-2">
          <p><span className="font-medium text-gray-700 dark:text-gray-200">Name:</span> {student?.name || 'N/A'}</p>
          <p><span className="font-medium text-gray-700 dark:text-gray-200">Email:</span> {student?.email || 'N/A'}</p>
          <p><span className="font-medium text-gray-700 dark:text-gray-200">Class:</span> {student?.class || 'N/A'}</p>
          <p><span className="font-medium text-gray-700 dark:text-gray-200">Percentage:</span> {student?.percentage ? `${student.percentage}%` : 'N/A'}</p>
          <p><span className="font-medium text-gray-700 dark:text-gray-200">Unique ID:</span> {student?.id || 'N/A'}</p>
        </div>
        <div className="mb-4">
          <nav className="flex space-x-4 border-b border-gray-200 dark:border-gray-700">
            {['dashboard', 'attendance', 'marks', 'exams', 'fees', 'grades', 'timetable', 'analytics', 'feedback-form'].map((module) => (
              <button
                key={module}
                onClick={() => setActiveModule(module)}
                className={`px-3 py-2 text-sm font-medium rounded-t-md focus:outline-none ${
                  activeModule === module
                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
              >
                {module.charAt(0).toUpperCase() + module.slice(1).replace('-', ' ')}
              </button>
            ))}
          </nav>
        </div>
        <div className="min-h-[300px]">
          {activeModule === 'dashboard' && <MemoizedDashboard setActiveModule={setActiveModule} />}
          {activeModule === 'attendance' && <MemoizedAttendance />}
          {activeModule === 'marks' && <MemoizedMarks />}
          {activeModule === 'exams' && <MemoizedExams student={student} />}
          {activeModule === 'fees' && <MemoizedFees />}
          {activeModule === 'grades' && <MemoizedGrades />}
          {activeModule === 'timetable' && <MemoizedTimetable student={student} />}
          {activeModule === 'analytics' && <MemoizedAnalytics studentId={student?.id} />}
          {activeModule === 'feedback-form' && <MemoizedFeedback />}
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
