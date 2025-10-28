'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';
import {
  Users,
  UserCheck,
  Building,
  Calendar,
  Bell,
  Eye,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  FileText,
  TrendingUp,
  X,
  Settings,
  LogOut,
  Menu,
  Search,
  Sun,
  Moon,
  ChevronDown,
  Briefcase,
  DollarSign,
  Award,
  FileCheck,
  Download,
  CreditCard,
  Plus
} from 'lucide-react';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

export default function TeacherDashboard({ setActiveModule }) {
  const { data: session } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const [dashboardData, setDashboardData] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalEmployees: 0,
    totalEarnings: 0,
    studentsByGender: {
      boys: 0,
      girls: 0
    },
    attendanceData: {
      mon: 0,
      tue: 0,
      wed: 0,
      thu: 0,
      fri: 0,
      sat: 0
    },
    notices: [],
    teacherInfo: {
      name: '',
      studentsCount: 0,
      classesCount: 0,
      availableTeachers: [],
      debugInfo: {
        studentsFound: 0,
        studentsError: null,
        teacherCountError: null
      }
    }
  });

  const [timetableData, setTimetableData] = useState([]);
  const [examsData, setExamsData] = useState([]);
  const [feesData, setFeesData] = useState([]);
  const [gradesData, setGradesData] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [loadingTimetable, setLoadingTimetable] = useState(false);
  const [loadingExams, setLoadingExams] = useState(false);
  const [loadingFees, setLoadingFees] = useState(false);
  const [loadingGrades, setLoadingGrades] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const teacherName = session?.user?.name;
        const response = await fetch(`/api/teacher/dashboard?teacherName=${encodeURIComponent(teacherName)}`);

        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }

        const result = await response.json();

        if (result.success) {
          setDashboardData(result.data);
        } else {
          throw new Error(result.error || 'Failed to fetch dashboard data');
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.name) {
      fetchDashboardData();
    }
  }, [session?.user?.name]);

  useEffect(() => {
    const fetchTimetableData = async () => {
      try {
        setLoadingTimetable(true);
        const teacherName = session?.user?.name;
        const response = await fetch(`/api/teacher/timetable?teacher=${encodeURIComponent(teacherName)}`);

        if (!response.ok) {
          throw new Error('Failed to fetch timetable data');
        }

        const result = await response.json();
        setTimetableData(result.timetable || []);
      } catch (error) {
        console.error('Error fetching timetable data:', error);
      } finally {
        setLoadingTimetable(false);
      }
    };

    if (session?.user?.name) {
      fetchTimetableData();
    }
  }, [session?.user?.name]);

  const fetchStudents = async () => {
    try {
      const teacherName = session?.user?.name;
      const response = await fetch(`/api/teacher/students?teacherName=${encodeURIComponent(teacherName)}`);

      if (response.ok) {
        const data = await response.json();
        setStudents(data.data || []);
      } else {
        console.error('Failed to fetch students');
      }
    } catch (err) {
      console.error('Error fetching students:', err);
    }
  };

  useEffect(() => {
    if (session?.user?.name) {
      fetchStudents();
    }
  }, [session?.user?.name]);

  const navigationItems = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3, active: true },
    { id: 'students', name: 'Students', icon: Users, active: false },
    { id: 'exam', name: 'Exams', icon: FileText, active: false },
    { id: 'grades', name: 'Grades', icon: Award, active: false },
    { id: 'timetable', name: 'Timetable', icon: Calendar, active: false },
    { id: 'attendance', name: 'Attendance', icon: UserCheck, active: false },
    { id: 'fees', name: 'Fees', icon: DollarSign, active: false },
    { id: 'notice', name: 'Notices', icon: Bell, active: false },
  ];

  const handleNavigation = (moduleId) => {
    if (setActiveModule) {
      setActiveModule(moduleId);
    }
    setSidebarOpen(false);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const convertToCSV = (data) => {
    if (!data || data.length === 0) return '';
    const headers = Object.keys(data[0]);
    const csvRows = [];
    csvRows.push(headers.join(','));

    data.forEach(row => {
      const values = headers.map(header => {
        const value = row[header];
        if (value === null || value === undefined) return '';
        const stringValue = String(value);
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      });
      csvRows.push(values.join(','));
    });

    return csvRows.join('\n');
  };

  const downloadCSV = (csvContent, filename) => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <nav className="mt-8">
          <div className="px-4 space-y-2">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                  item.active
                    ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <item.icon className="mr-3 w-5 h-5" />
                {item.name}
              </button>
            ))}
          </div>
        </nav>
      </div>

      <div className="">
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between px-4 py-4 sm:px-6">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-1 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div className="ml-4 lg:ml-0">
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Welcome Back {session?.user?.name}👋
                </h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              
              <div className="relative hidden sm:block">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                />
              </div>

              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Bell className="w-5 h-5" />
                </button>

                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-10">
                    <div className="py-1">
                      <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 font-medium border-b border-gray-200 dark:border-gray-700">
                        Notifications
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {dashboardData.notices.length > 0 ? (
                          dashboardData.notices.map((notice) => (
                            <div key={notice.id} className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                              <div className="flex items-start">
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-gray-900 dark:text-white">{notice.title}</p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">{notice.date}</p>
                                  <p className="text-xs text-gray-400 dark:text-gray-500">{notice.views} views</p>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                            No new notifications
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile dropdown */}
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center space-x-3 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {session?.user?.name?.charAt(0)}
                    </span>
                  </div>
                  <span className="hidden sm:block text-gray-700 dark:text-gray-300 font-medium">
                    {session?.user?.name}
                  </span>
                  <span className="hidden sm:block text-xs text-gray-500 dark:text-gray-400">
                    Admin
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-10">
                    <div className="py-1">
                      <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 font-medium border-b border-gray-200 dark:border-gray-700">
                        {session?.user?.name}
                      </div>
                      <button
                        onClick={() => handleNavigation('settings')}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Settings
                      </button>
                      <button
                        onClick={() => signOut({ callbackUrl: '/landing' })}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main dashboard content */}
        <main className="p-6 bg-white dark:bg-gray-900">
          {/* Stats Cards */}
         


          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Gender Distribution Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Total Students by Gender</h3>
              <div className="flex items-center justify-center">
                <div className="relative w-48 h-48">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    {/* Background circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="8"
                      className="dark:stroke-gray-600"
                    />
                    {/* Boys segment */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="8"
                      strokeDasharray={`${(dashboardData.studentsByGender.boys / dashboardData.totalStudents) * 251.2} 251.2`}
                      strokeLinecap="round"
                      className="transition-all duration-1000"
                    />
                    {/* Girls segment */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="8"
                      strokeDasharray={`${(dashboardData.studentsByGender.girls / dashboardData.totalStudents) * 251.2} 251.2`}
                      strokeDashoffset={`${-(dashboardData.studentsByGender.boys / dashboardData.totalStudents) * 251.2}`}
                      strokeLinecap="round"
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900 dark:text-white">{dashboardData.totalStudents}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Total Students</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-center space-x-6 mt-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Boys: {dashboardData.studentsByGender.boys}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Girls: {dashboardData.studentsByGender.girls}</span>
                </div>
              </div>
            </div>

            {/* Attendance Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Attendance</h3>
                <div className="flex items-center space-x-4">
                  <select className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                    <option>This week</option>
                    <option>Last week</option>
                    <option>This month</option>
                  </select>
                  <select className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                    <option>Class 10</option>
                    <option>Class 9</option>
                    <option>Class 8</option>
                    <option>Computer Engineering</option>
                    <option>Mechanical Engineering</option>
                  </select>
                </div>
              </div>
              <div className="h-64">
                <div className="flex items-end justify-between h-full">
                  {Object.entries(dashboardData.attendanceData).map(([day, percentage]) => (
                    <div key={day} className="flex flex-col items-center">
                      <div
                        className="w-8 bg-blue-500 rounded-t-sm transition-all duration-1000"
                        style={{ height: `${percentage}%` }}
                      ></div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 mt-2">{day}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Timetable Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">My Timetable</h3>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {timetableData.length} total entries
              </div>
            </div>

            {loadingTimetable ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            ) : timetableData.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Class & Section
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Day & Period
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Subject
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Time & Room
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {timetableData.slice(0, 10).map((entry) => (
                      <tr key={entry.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {entry.class}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Section {entry.section || 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">
                            {entry.day_of_week}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Period {entry.period}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {entry.subject}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">
                            {entry.start_time} - {entry.end_time}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Room {entry.room_number || 'N/A'}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">No timetable entries found</p>
              </div>
            )}
          </div>

          {/* Debug Information */}
          {dashboardData.teacherInfo.debugInfo && (
            <div className="bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-yellow-200 mb-2">Debug Information</h3>
              <div className="text-sm text-gray-800 dark:text-yellow-300 space-y-1">
                <p>Teacher Name: {dashboardData.teacherInfo.name}</p>
                <p>Students Found: {dashboardData.teacherInfo.debugInfo.studentsFound}</p>
                <p>Available Teachers: {dashboardData.teacherInfo.availableTeachers.join(', ') || 'None'}</p>
                
              </div>
            </div>
          )}

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Notices */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Notices</h3>
              <div className="space-y-4">
                {dashboardData.notices.length > 0 ? (
                  dashboardData.notices.slice(0, 5).map((notice) => (
                    <div key={notice.id} className="border-b border-gray-200 dark:border-gray-700 pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white">{notice.title}</h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notice.date}</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">{notice.views} views</p>
                        </div>
                        <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">No notices available</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
              <div className="grid grid-cols-3 gap-4">
                <button
                  onClick={() => handleNavigation('students')}
                  className="p-4 bg-blue-50 dark:bg-blue-900 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors"
                >
                  <Users className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-300">View Students</p>
                </button>
                <button
                  onClick={() => handleNavigation('exam')}
                  className="p-4 bg-green-50 dark:bg-green-900 rounded-lg hover:bg-green-100 dark:hover:bg-green-800 transition-colors"
                >
                  <FileText className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-green-900 dark:text-green-300">Manage Exams</p>
                </button>

                <button
                  onClick={() => handleNavigation('timetable')}
                  className="p-4 bg-purple-50 dark:bg-purple-900 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-800 transition-colors"
                >
                  <Calendar className="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-purple-900 dark:text-purple-300">View Timetable</p>
                </button>
                <button
                  onClick={() => downloadCSV(convertToCSV(students), 'students.csv')}
                  className="p-4 bg-red-50 dark:bg-red-900 rounded-lg hover:bg-red-100 dark:hover:bg-red-800 transition-colors"
                >
                  <Download className="w-8 h-8 text-red-600 dark:text-red-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-red-900 dark:text-red-300">Download Students CSV</p>
                </button>
                <button
                  onClick={() => handleNavigation('students')}
                  className="p-4 bg-indigo-50 dark:bg-indigo-900 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-800 transition-colors"
                >
                  <Plus className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-indigo-900 dark:text-indigo-300">Add Student</p>
                </button>
                <button
                  onClick={() => handleNavigation('notice')}
                  className="p-4 bg-yellow-50 dark:bg-yellow-900 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-800 transition-colors"
                >
                  <Bell className="w-8 h-8 text-yellow-600 dark:text-yellow-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-yellow-900 dark:text-yellow-300">Notice</p>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
