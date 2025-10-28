'use client';

import { useState, useEffect } from 'react';
import { Bell, Users, Calendar, MessageSquare, AlertCircle } from 'lucide-react';

export default function TeacherNoticesManagement() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch('/api/admin/notifications');
      if (res.ok) {
        const data = await res.json();
        setNotices(data);
      } else {
        // If API fails, use mock data as fallback
        console.warn('API not available, using mock data');
        const mockNotices = [
          {
            id: 1,
            title: 'Mid-term Exam Schedule',
            message: 'Mid-term examinations will begin from next Monday. Please check the exam timetable and prepare accordingly.',
            target_audience: 'all',
            priority: 'high',
            created_at: '2024-01-15T10:30:00Z',
            sent_by: 'admin'
          },
          {
            id: 2,
            title: 'Holiday Notice',
            message: 'School will remain closed on January 26th for Republic Day celebration. Classes will resume on January 27th.',
            target_audience: 'all',
            priority: 'medium',
            created_at: '2024-01-10T14:20:00Z',
            sent_by: 'admin'
          },
          {
            id: 3,
            title: 'Parent-Teacher Meeting',
            message: 'PTM scheduled for February 5th. Parents are requested to attend. Please inform your students about this.',
            target_audience: 'all',
            priority: 'medium',
            created_at: '2024-01-08T16:45:00Z',
            sent_by: 'admin'
          }
        ];
        setNotices(mockNotices);
      }
    } catch (error) {
      console.error('Error fetching notices:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'urgent':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'urgent':
        return <AlertCircle className="w-4 h-4" />;
      case 'high':
        return <MessageSquare className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const getTargetAudienceText = (notice) => {
    switch (notice.target_audience) {
      case 'all':
        return 'All Users';
      case 'specific_class':
        return `${notice.specific_class}`;
      case 'specific_section':
        return `Section ${notice.specific_section}`;
      default:
        return 'Unknown';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <p className="text-red-600 dark:text-red-400 text-center">
          Error loading notices: {error}
        </p>
        <button
          onClick={fetchNotices}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notices</h1>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {notices.length} notice{notices.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Notices</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{notices.length}</p>
            </div>
            <Bell className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">High Priority</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {notices.filter(n => n.priority === 'high' || n.priority === 'urgent').length}
              </p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">This Week</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {notices.filter(n => {
                  const noticeDate = new Date(n.created_at);
                  const now = new Date();
                  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                  return noticeDate >= weekAgo;
                }).length}
              </p>
            </div>
            <Calendar className="w-8 h-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Notices List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Notices
          </h2>
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {notices.map((notice) => (
            <div key={notice.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className={`p-2 rounded-full ${getPriorityColor(notice.priority)}`}>
                      {getPriorityIcon(notice.priority)}
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {notice.title}
                    </h3>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(notice.priority)}`}>
                      {notice.priority.toUpperCase()}
                    </span>
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 mb-3 ml-11">
                    {notice.message}
                  </p>

                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 ml-11">
                    <span className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {getTargetAudienceText(notice)}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(notice.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {notices.length === 0 && (
          <div className="text-center py-8">
            <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              No notices available.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
