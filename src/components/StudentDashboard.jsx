'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Bell, BookOpen, Calendar, Users, CheckCircle, AlertCircle, X } from 'lucide-react';

export default function StudentDashboard() {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [loading, setLoading] = useState(true);
  const [attendanceData, setAttendanceData] = useState(null);
  const [attendanceLoading, setAttendanceLoading] = useState(true);
  const [timetableData, setTimetableData] = useState([]);
  const [timetableLoading, setTimetableLoading] = useState(true);
  const [showAllTimetables, setShowAllTimetables] = useState(false);
  const [searchFilters, setSearchFilters] = useState({
    class: '',
    section: '',
    subject: '',
    day: '',
    teacher: ''
  });
  const [availableFilters, setAvailableFilters] = useState({
    availableClasses: [],
    availableSections: [],
    availableSubjects: [],
    availableDays: []
  });

  useEffect(() => {
    fetchNotifications();
    fetchAttendanceData();
    fetchTimetableData();
  }, [showAllTimetables, searchFilters]);

  const fetchAttendanceData = async () => {
    try {
      setAttendanceLoading(true);
      const response = await fetch(`/api/student/attendance?studentId=${session?.user?.id}&period=week`);
      if (response.ok) {
        const data = await response.json();
        setAttendanceData(data);
      } else {
        console.warn('Attendance API not available, using default data');
        setAttendanceData({
          totalRecords: 8,
          presentCount: 7,
          absentCount: 1,
          lateCount: 0,
          attendancePercentage: 87.5,
          todayAttendance: { status: 'present', class: '10A', section: 'A' }
        });
      }
    } catch (error) {
      console.error('Error fetching attendance data:', error);
      setAttendanceData({
        totalRecords: 8,
        presentCount: 7,
        absentCount: 1,
        lateCount: 0,
        attendancePercentage: 87.5,
        todayAttendance: { status: 'present', class: '10A', section: 'A' }
      });
    } finally {
      setAttendanceLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      setLoading(true);

      // Fetch notifications from the student notifications API
      const response = await fetch(`/api/student/notifications?studentId=${session?.user?.id}&unreadOnly=false`);
      if (response.ok) {
        const data = await response.json();

        // Transform API data to match component format
        const transformedNotifications = data.map(notification => ({
          id: notification.id,
          type: notification.target_audience === 'specific_student' ? 'attendance' : 'notice',
          title: notification.title,
          message: notification.message,
          time: new Date(notification.created_at).toLocaleString(),
          read: notification.is_read || false,
          icon: notification.priority === 'high' || notification.priority === 'urgent' ? AlertCircle : CheckCircle,
          color: notification.priority === 'high' || notification.priority === 'urgent' ? 'text-red-600' : 'text-green-600'
        }));

        setNotifications(transformedNotifications);
      } else {
        console.warn('Student notifications API not available, using empty array');
        setNotifications([]);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchTimetableData = async () => {
    try {
      setTimetableLoading(true);

      // Build query parameters
      const params = new URLSearchParams();
      params.append('studentId', session?.user?.id || '');

      if (showAllTimetables) {
        params.append('showAll', 'true');
        // Add search filters
        Object.entries(searchFilters).forEach(([key, value]) => {
          if (value) {
            params.append(key, value);
          }
        });
      }

      const response = await fetch(`/api/student/timetable?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setTimetableData(data.timetable || []);
        setAvailableFilters({
          availableClasses: data.availableClasses || [],
          availableSections: data.availableSections || [],
          availableSubjects: data.availableSubjects || [],
          availableDays: data.availableDays || []
        });
      } else {
        console.warn('Student timetable API not available, using default data');
        // Set default timetable data for demonstration
        setTimetableData([
          {
            id: 1,
            subject: 'Mathematics',
            start_time: '09:00',
            end_time: '10:00',
            day_of_week: 'Monday',
            period: 1,
            room_number: '101'
          },
          {
            id: 2,
            subject: 'Science',
            start_time: '10:15',
            end_time: '11:15',
            day_of_week: 'Monday',
            period: 2,
            room_number: '102'
          },
          {
            id: 3,
            subject: 'English',
            start_time: '11:30',
            end_time: '12:30',
            day_of_week: 'Monday',
            period: 3,
            room_number: '103'
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching timetable data:', error);
      setTimetableData([]);
    } finally {
      setTimetableLoading(false);
    }
  };

  const handleSearchFilterChange = (filterType, value) => {
    setSearchFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearSearchFilters = () => {
    setSearchFilters({
      class: '',
      section: '',
      subject: '',
      day: '',
      teacher: ''
    });
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {session?.user?.name || 'Student'}!</h1>
        <p className="text-blue-100">Here's your academic overview and notifications.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 lg:p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">Total Classes</p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                {attendanceLoading ? '...' : (attendanceData?.totalRecords || 0)}
              </p>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">This week</p>
            </div>
            <div className="bg-blue-500 p-2 sm:p-3 rounded-lg ml-2 sm:ml-3">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 lg:p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">Present</p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-600">
                {attendanceLoading ? '...' : (attendanceData?.presentCount || 0)}
              </p>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">This week</p>
            </div>
            <div className="bg-green-500 p-2 sm:p-3 rounded-lg ml-2 sm:ml-3">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 lg:p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">Absent</p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-red-600">
                {attendanceLoading ? '...' : (attendanceData?.absentCount || 0)}
              </p>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">This week</p>
            </div>
            <div className="bg-red-500 p-2 sm:p-3 rounded-lg ml-2 sm:ml-3">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 lg:p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">Attendance %</p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-purple-600">
                {attendanceLoading ? '...' : `${attendanceData?.attendancePercentage || 0}%`}
              </p>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">This week</p>
            </div>
            <div className="bg-purple-500 p-2 sm:p-3 rounded-lg ml-2 sm:ml-3">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Notifications Bell */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h2>
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
          >
            <Bell className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Notifications
                  </h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
              </div>

              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                    No notifications
                  </div>
                ) : (
                  notifications.map((notification) => {
                    const Icon = notification.icon;
                    return (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 ${
                          !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-full bg-gray-100 dark:bg-gray-700`}>
                            <Icon className={`w-4 h-4 ${notification.color}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                              <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                                {notification.title}
                              </h4>
                              {!notification.read && (
                                <button
                                  onClick={() => markAsRead(notification.id)}
                                  className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                              {notification.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Today's Schedule */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {showAllTimetables ? 'All Timetables' : 'My Schedule'}
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowAllTimetables(!showAllTimetables)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                showAllTimetables
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {showAllTimetables ? 'My Schedule' : 'All Timetables'}
            </button>
          </div>
        </div>

        {/* Search Filters - Only show when viewing all timetables */}
        {showAllTimetables && (
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Class Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Class
                </label>
                <select
                  value={searchFilters.class}
                  onChange={(e) => handleSearchFilterChange('class', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Classes</option>
                  {availableFilters.availableClasses.map((cls) => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>
              </div>

              {/* Section Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Section
                </label>
                <select
                  value={searchFilters.section}
                  onChange={(e) => handleSearchFilterChange('section', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Sections</option>
                  {availableFilters.availableSections.map((section) => (
                    <option key={section} value={section}>{section}</option>
                  ))}
                </select>
              </div>

              {/* Subject Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  value={searchFilters.subject}
                  onChange={(e) => handleSearchFilterChange('subject', e.target.value)}
                  placeholder="Search subjects..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Day Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Day
                </label>
                <select
                  value={searchFilters.day}
                  onChange={(e) => handleSearchFilterChange('day', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Days</option>
                  {availableFilters.availableDays.map((day) => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>

              {/* Teacher Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Teacher
                </label>
                <input
                  type="text"
                  value={searchFilters.teacher}
                  onChange={(e) => handleSearchFilterChange('teacher', e.target.value)}
                  placeholder="Search teachers..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Clear Filters */}
              <div className="flex items-end">
                <button
                  onClick={clearSearchFilters}
                  className="w-full px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md text-sm font-medium transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>

            {/* Results Summary */}
            <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
              Showing {timetableData.length} entries
              {Object.values(searchFilters).some(value => value) && (
                <span className="ml-2 text-blue-600 dark:text-blue-400">
                  (filtered)
                </span>
              )}
            </div>
          </div>
        )}
        {timetableLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600 dark:text-gray-400">Loading schedule...</span>
          </div>
        ) : timetableData.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <p>No classes scheduled for today</p>
          </div>
        ) : (
          <div className="space-y-4">
            {timetableData.map((item, index) => (
              <div
                key={item.id}
                className={`flex items-center space-x-4 p-3 rounded-lg ${
                  index % 3 === 0
                    ? 'bg-green-50 dark:bg-green-900/20'
                    : index % 3 === 1
                    ? 'bg-blue-50 dark:bg-blue-900/20'
                    : 'bg-purple-50 dark:bg-purple-900/20'
                }`}
              >
                <div className={`w-3 h-3 rounded-full ${
                  index % 3 === 0
                    ? 'bg-green-500'
                    : index % 3 === 1
                    ? 'bg-blue-500'
                    : 'bg-purple-500'
                }`}></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{item.subject}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {item.start_time} - {item.end_time} • Room {item.room_number}
                    {showAllTimetables && item.class && item.section && (
                      <span className="ml-2">
                        • Class {item.class}-{item.section}
                        {item.teacher && <span> • {item.teacher}</span>}
                      </span>
                    )}
                  </p>
                </div>
                <CheckCircle className={`w-5 h-5 ${
                  index % 3 === 0
                    ? 'text-green-600'
                    : index % 3 === 1
                    ? 'text-blue-600'
                    : 'text-purple-600'
                }`} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            {/* <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            </div> */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white"></p>
              <p className="text-sm text-gray-500 dark:text-gray-400"></p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
             {/* <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                { <BookOpen className="w-5 h-5 text-blue-600" /> }
              </div>
            </div>  */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white"></p>
              <p className="text-sm text-gray-500 dark:text-gray-400"></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
