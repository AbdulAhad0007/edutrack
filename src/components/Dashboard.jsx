// src/components/Dashboard.jsx
'use client';

<<<<<<< HEAD
=======
import CalendarWidget from './CalendarWidget';

>>>>>>> e72ad566b79fdad6a6790dcdbf09158b3490aec0
import { useSession } from 'next-auth/react';
import { Users, BookOpen, Calendar } from 'lucide-react';

export default function Dashboard({ setActiveModule = () => {} }) {
  const { data: session } = useSession();
  
  const stats = [
    {
      title: 'Total Students',
<<<<<<< HEAD
      value: '1,248',
=======
      value: '86',
>>>>>>> e72ad566b79fdad6a6790dcdbf09158b3490aec0
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Total Subjects',
<<<<<<< HEAD
      value: '12',
=======
      value: '6',
>>>>>>> e72ad566b79fdad6a6790dcdbf09158b3490aec0
      icon: BookOpen,
      color: 'text-green-500',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Classes Today',
      value: '8',
      icon: Calendar,
      color: 'text-purple-500',
      bgColor: 'bg-purple-100'
    }
  ];

  // Personalized student info (prefer mock student data if available)
  const studentName = session?.user?.name || 'Student';
  const studentEmail = session?.user?.email || '';
  const studentId = session?.user?.id || '';

  // Mock upcoming classes (replace with real data)
  const upcoming = [
    { title: 'Mathematics', time: 'Tomorrow • 09:00 AM', room: 'A-101' },
    { title: 'English Literature', time: 'Tomorrow • 11:00 AM', room: 'B-202' },
  ];

  // Mock attendance percent (replace with real calculation)
  const attendancePercent = 85;

  const notifications = [
<<<<<<< HEAD
    { id: 1, text: '' },
    { id: 2, text: '' },
  ];

  return (
    <div>
      <h2 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">Dashboard</h2>

      <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
=======
    { id: 1, text: 'Assignment due for Mathematics on Friday' },
    { id: 2, text: 'New notice: Library timing updated' },
  ];

  return (
    <div className="w-full min-w-full">
   
      <div className="w-full mb-6">
        <div className="w-full bg-white rounded-lg p-4 shadow-sm dark:bg-gray-800">
          <h3 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">Welcome back, {studentName}</h3>
          <p className="text-sm text-gray-700 dark:text-gray-300">Good to see you — here's a quick summary of your day.</p>
          <div className="mt-4 flex flex-col sm:flex-row items-center gap-4">
            <div className="p-4 bg-indigo-50 rounded-md w-full sm:w-auto">
              <p className="text-xs text-gray-600">Attendance</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">{attendancePercent}%</p>
            </div>
            <div className="p-4 bg-green-50 rounded-md w-full sm:w-auto">
              <p className="text-xs text-gray-600">Upcoming Class</p>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{upcoming[0].title} • {upcoming[0].time}</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-md w-full sm:w-auto">
              <p className="text-xs text-gray-600">Reminders</p>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Low attendance alert: {attendancePercent < 75 ? 'Yes' : 'No'}</p>
            </div>
          </div>
        </div>

        {/* <aside className="bg-white rounded-lg p-4 shadow-sm dark:bg-gray-800">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Notifications</h4>
          <ul className="mt-2 space-y-2 text-sm text-gray-600 dark:text-gray-300">
            {notifications.map((n) => (
              <li key={n.id} className="border-b pb-2">{n.text}</li>
            ))}
          </ul>
        </aside> */}
      </div>

            <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4 max-w-full px-4">
>>>>>>> e72ad566b79fdad6a6790dcdbf09158b3490aec0
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="flex items-center p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
              <div className={`p-3 mr-4 rounded-full ${stat.bgColor} ${stat.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.title}
                </p>
                <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                  {stat.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

<<<<<<< HEAD
      {/* Header strip: welcome, notifications, quick links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="col-span-2 bg-white rounded-lg p-4 shadow-sm dark:bg-gray-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Welcome back, {studentName}</h3>
          <p className="text-sm text-gray-700 dark:text-gray-300">Good to see you — here's a quick summary of your day.</p>
          <div className="mt-4 flex items-center gap-4">
            <div className="p-4 bg-indigo-50 rounded-md">
              <p className="text-xs text-gray-600">Attendance</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">{attendancePercent}%</p>
            </div>
            <div className="p-4 bg-green-50 rounded-md">
              <p className="text-xs text-gray-600">Upcoming Class</p>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{upcoming[0].title} • {upcoming[0].time}</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-md">
              <p className="text-xs text-gray-600">Reminders</p>
              {/* <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Low attendance alert: {attendancePercent < 75 ? 'Yes' : 'No'}</p> */}
            </div>
          </div>
        </div>

        <aside className="bg-white rounded-lg p-4 shadow-sm dark:bg-gray-800">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Notifications</h4>
          <ul className="mt-2 space-y-2 text-sm text-gray-600 dark:text-gray-300">
            {notifications.map((n) => (
              <li key={n.id} className="border-b pb-2">{n.text}</li>
            ))}
          </ul>
        </aside>
      </div>

      {/* Main content: student details + quick links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-white rounded-lg p-6 shadow dark:bg-gray-800 block md:hidden">
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Profile</h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{studentName}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">{studentEmail}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">{studentId}</p>
=======
      {/* Main content: profile, quick links, calendar */}
      <div className="max-w-full mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
        <div className="bg-white rounded-lg p-6 shadow dark:bg-gray-800">
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Profile</h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Name : {studentName}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">Email :   {studentEmail}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">UID :    {studentId}</p>
>>>>>>> e72ad566b79fdad6a6790dcdbf09158b3490aec0
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Upcoming Classes</h4>
            <ul className="mt-2 text-sm text-gray-600 dark:text-gray-300 space-y-2">
              {upcoming.map((u, idx) => (
                <li key={idx}>{u.title} — {u.time} ({u.room})</li>
              ))}
            </ul>
          </div>
        </div>

<<<<<<< HEAD
        <div className="md:col-span-2 bg-white rounded-lg p-6 shadow dark:bg-gray-800">
=======
        <div className="bg-white rounded-lg p-6 shadow dark:bg-gray-800">
>>>>>>> e72ad566b79fdad6a6790dcdbf09158b3490aec0
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Quick Links</h3>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <button onClick={() => setActiveModule('attendance')} className="p-3 bg-indigo-50 rounded">Attendance</button>
            <button onClick={() => setActiveModule('exams')} className="p-3 bg-indigo-50 rounded">Exams</button>
            <button onClick={() => setActiveModule('fees')} className="p-3 bg-indigo-50 rounded">Fees</button>
            <button onClick={() => setActiveModule('grades')} className="p-3 bg-indigo-50 rounded">Grades</button>
          </div>
        </div>
<<<<<<< HEAD
      </div>
    </div>
  );
}
=======

        <div className="bg-white rounded-lg p-6 shadow dark:bg-gray-800">
          <CalendarWidget />
        </div>
      </div>
    </div>
  );
}
>>>>>>> e72ad566b79fdad6a6790dcdbf09158b3490aec0
