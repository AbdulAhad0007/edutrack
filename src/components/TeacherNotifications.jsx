'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  Bell,
  Send,
  Users,
  Plus,
  Edit2,
  Trash2,
  Search,
  Filter,
  Eye,
  Save,
  X,
  AlertCircle,
  CheckCircle,
  Clock,
  User
} from 'lucide-react';

export default function TeacherNotifications() {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingNotification, setEditingNotification] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    priority: 'medium',
    target_audience: 'all'
  });

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const response = await fetch(`/api/teacher/notifications?teacher_id=${session?.user?.id}`);
      const result = await response.json();
      if (Array.isArray(result)) {
        setNotifications(result);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch students
  const fetchStudents = async () => {
    try {
      const response = await fetch(`/api/teacher/students?teacherName=${encodeURIComponent(session?.user?.name)}`);
      if (response.ok) {
        const result = await response.json();
        setStudents(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  useEffect(() => {
    if (session?.user?.id) {
      fetchNotifications();
      fetchStudents();
    }
  }, [session]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const notificationData = {
      ...formData,
      teacher_id: session?.user?.id,
      teacher_name: session?.user?.name,
      target_students: selectedStudents.length > 0 ? selectedStudents : null
    };

    try {
      const response = await fetch('/api/teacher/notifications', {
        method: editingNotification ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingNotification ? { ...notificationData, id: editingNotification.id } : notificationData),
      });

      if (response.ok) {
        await fetchNotifications();
        resetForm();
        setShowForm(false);
      } else {
        alert('Error saving notification');
      }
    } catch (error) {
      console.error('Error saving notification:', error);
      alert('Error saving notification');
    }
  };

  // Handle edit
  const handleEdit = (notification) => {
    setEditingNotification(notification);
    setFormData({
      title: notification.title,
      message: notification.message,
      priority: notification.priority,
      target_audience: notification.target_audience
    });
    setSelectedStudents(notification.target_students || []);
    setShowForm(true);
  };

  // Handle delete
  const handleDelete = async (notificationId) => {
    if (!confirm('Are you sure you want to delete this notification?')) return;

    try {
      const response = await fetch(`/api/teacher/notifications?id=${notificationId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchNotifications();
      } else {
        alert('Error deleting notification');
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
      alert('Error deleting notification');
    }
  };

  // Send notification to students
  const sendToStudents = async (notificationId) => {
    try {
      const response = await fetch('/api/admin/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: notificationId,
          send_to_students: true
        }),
      });

      if (response.ok) {
        alert('Notification sent to students successfully!');
        await fetchNotifications();
      } else {
        alert('Error sending notification to students');
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      alert('Error sending notification to students');
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      message: '',
      priority: 'medium',
      target_audience: 'all'
    });
    setSelectedStudents([]);
    setEditingNotification(null);
  };

  // Separate notifications by type
  const sentNotifications = notifications.filter(notification => notification.type === 'sent');
  const receivedNotices = notifications.filter(notification => notification.type === 'received');

  // Filter sent notifications
  const filteredSentNotifications = sentNotifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = !filterPriority || notification.priority === filterPriority;

    return matchesSearch && matchesPriority;
  });

  // Filter received notices
  const filteredReceivedNotices = receivedNotices.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = !filterPriority || notification.priority === filterPriority;

    return matchesSearch && matchesPriority;
  });

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h1>
          <p className="text-gray-600 dark:text-gray-400">Send notifications to students and manage announcements</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Create Notification</span>
          <span className="sm:hidden">Create</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Search
            </label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Priority
            </label>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterPriority('');
              }}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Sent Notifications Section */}
      <div className="space-y-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Send className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-100">Sent Notifications ({filteredSentNotifications.length})</h2>
          </div>
          <p className="text-sm text-blue-700 dark:text-blue-300">Notifications you have created and sent to students</p>
        </div>

        {filteredSentNotifications.length > 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            {/* Mobile Card View */}
            <div className="block sm:hidden">
              {filteredSentNotifications.map((notification) => (
                <div key={notification.id} className="p-4 border-b border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                        {notification.title.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        {notification.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(notification.priority)}`}>
                          {notification.priority}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(notification.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          {notification.target_audience}
                        </span>
                        <div className="flex items-center gap-2">
                          {!notification.sent_to_students && (
                            <button
                              onClick={() => sendToStudents(notification.id)}
                              className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                              title="Send to Students"
                            >
                              <Send className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleEdit(notification)}
                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(notification.id)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto">
              {/* Table Header */}
              <div className="bg-gray-50 dark:bg-gray-700 px-6 py-3 border-b border-gray-200 dark:border-gray-600">
                <div className="grid grid-cols-12 gap-4 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  <div className="col-span-5">Notification</div>
                  <div className="col-span-2">Priority</div>
                  <div className="col-span-2">Target</div>
                  <div className="col-span-2">Date Sent</div>
                  <div className="col-span-1">Actions</div>
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-gray-200 dark:divide-gray-600">
                {filteredSentNotifications.map((notification) => (
                  <div key={notification.id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <div className="grid grid-cols-12 gap-4 items-center">
                      {/* Notification Column */}
                      <div className="col-span-5">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                              {notification.title.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {notification.title}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                              {notification.message}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Priority Column */}
                      <div className="col-span-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(notification.priority)}`}>
                          {notification.priority}
                        </span>
                      </div>

                      {/* Target Column */}
                      <div className="col-span-2">
                        <span className="text-sm text-gray-900 dark:text-white">
                          {notification.target_audience}
                        </span>
                      </div>

                      {/* Date Sent Column */}
                      <div className="col-span-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(notification.created_at).toLocaleDateString()}
                        </span>
                      </div>

                      {/* Actions Column */}
                      <div className="col-span-1">
                        <div className="flex items-center gap-2">
                          {!notification.sent_to_students && (
                            <button
                              onClick={() => sendToStudents(notification.id)}
                              className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                              title="Send to Students"
                            >
                              <Send className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleEdit(notification)}
                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(notification.id)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <Send className="mx-auto h-8 w-8 text-gray-400 mb-2" />
            <p className="text-gray-500 dark:text-gray-400">No sent notifications found.</p>
          </div>
        )}
      </div>

      {/* Received Notices Section */}
      <div className="space-y-4">
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Bell className="w-5 h-5 text-green-600 dark:text-green-400" />
            <h2 className="text-xl font-semibold text-green-900 dark:text-green-100">Received Notices ({filteredReceivedNotices.length})</h2>
          </div>
          <p className="text-sm text-green-700 dark:text-green-300">Notices and meetings sent by administrators</p>
        </div>

        {filteredReceivedNotices.length > 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            {/* Mobile Card View */}
            <div className="block sm:hidden">
              {filteredReceivedNotices.map((notice) => (
                <div key={notice.id} className="p-4 border-b border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                      <span className="text-green-600 dark:text-green-400 text-sm font-medium">
                        {notice.title.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        {notice.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {notice.message}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(notice.priority)}`}>
                          {notice.priority}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(notice.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          {notice.target_audience}
                        </span>
                        <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                          Admin
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto">
              {/* Table Header */}
              <div className="bg-gray-50 dark:bg-gray-700 px-6 py-3 border-b border-gray-200 dark:border-gray-600">
                <div className="grid grid-cols-12 gap-4 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  <div className="col-span-5">Notification</div>
                  <div className="col-span-2">Priority</div>
                  <div className="col-span-2">Target</div>
                  <div className="col-span-2">Date Received</div>
                  <div className="col-span-1">Source</div>
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-gray-200 dark:divide-gray-600">
                {filteredReceivedNotices.map((notice) => (
                  <div key={notice.id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <div className="grid grid-cols-12 gap-4 items-center">
                      {/* Notification Column */}
                      <div className="col-span-5">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                            <span className="text-green-600 dark:text-green-400 text-sm font-medium">
                              {notice.title.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {notice.title}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                              {notice.message}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Priority Column */}
                      <div className="col-span-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(notice.priority)}`}>
                          {notice.priority}
                        </span>
                      </div>

                      {/* Target Column */}
                      <div className="col-span-2">
                        <span className="text-sm text-gray-900 dark:text-white">
                          {notice.target_audience}
                        </span>
                      </div>

                      {/* Date Received Column */}
                      <div className="col-span-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(notice.created_at).toLocaleDateString()}
                        </span>
                      </div>

                      {/* Source Column */}
                      <div className="col-span-1">
                        <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                          Admin
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <Bell className="mx-auto h-8 w-8 text-gray-400 mb-2" />
            <p className="text-gray-500 dark:text-gray-400">No received notices found.</p>
          </div>
        )}
      </div>

      {/* Combined empty state when no notifications at all */}
      {filteredSentNotifications.length === 0 && filteredReceivedNotices.length === 0 && (
        <div className="text-center py-12">
          <Bell className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No notifications found</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Get started by creating your first notification.
          </p>
        </div>
      )}

      {/* Create/Edit Notification Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-4 sm:top-20 mx-auto p-4 sm:p-5 border w-full max-w-md sm:w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white">
                  {editingNotification ? 'Edit Notification' : 'Create New Notification'}
                </h3>
                <button
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white text-sm sm:text-base"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Message
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white text-sm sm:text-base resize-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Priority
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white text-sm sm:text-base"
                      required
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Target Audience
                    </label>
                    <select
                      value={formData.target_audience}
                      onChange={(e) => setFormData({ ...formData, target_audience: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white text-sm sm:text-base"
                      required
                    >
                      <option value="all">All Students</option>
                      <option value="specific_class">Specific Class</option>
                      <option value="specific_section">Specific Section</option>
                      <option value="specific_student">Specific Student</option>
                    </select>
                  </div>
                </div>

                {formData.target_audience === 'specific_student' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Select Students
                    </label>
                    <div className="max-h-32 sm:max-h-40 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-lg p-2">
                      {students.map(student => (
                        <label key={student.id} className="flex items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded">
                          <input
                            type="checkbox"
                            checked={selectedStudents.includes(student.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedStudents([...selectedStudents, student.id]);
                              } else {
                                setSelectedStudents(selectedStudents.filter(id => id !== student.id));
                              }
                            }}
                            className="mr-2"
                          />
                          <span className="text-xs sm:text-sm">{student.name} - {student.class} {student.section}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      resetForm();
                    }}
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    <Save className="w-4 h-4" />
                    {editingNotification ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
