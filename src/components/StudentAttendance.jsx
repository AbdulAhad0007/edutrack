'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  AlertTriangle,
  Filter,
  Search,
  Download
} from 'lucide-react';

export default function StudentAttendance() {
  const { data: session } = useSession();
  const [attendance, setAttendance] = useState([]);
  const [attendanceStats, setAttendanceStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMonth, setFilterMonth] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [generatingReport, setGeneratingReport] = useState(false);

  // Fetch student attendance
  const fetchAttendance = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/student/attendance?studentId=${session?.user?.id}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch attendance: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // The API returns attendance statistics directly, not wrapped in a data property
      // We need to extract the attendance records from the response
      setAttendance(data.recentAttendance || []);

      // Store the full API response for statistics
      setAttendanceStats(data);
    } catch (err) {
      console.error('Error fetching attendance:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.id) {
      fetchAttendance();
    }
  }, [session]);

  // Filter attendance records
  const filteredAttendance = attendance.filter(record => {
    const matchesSearch = record.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.teacher_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         new Date(record.date).toLocaleDateString().includes(searchTerm);
    const matchesMonth = !filterMonth || new Date(record.date).getMonth() === parseInt(filterMonth);
    const matchesStatus = !filterStatus || record.status === filterStatus;

    return matchesSearch && matchesMonth && matchesStatus;
  });

  // Get unique months and statuses for filters
  const months = [...new Set(attendance.map(record => new Date(record.date).getMonth()))];
  const statuses = [...new Set(attendance.map(record => record.status))];

  // Use API response statistics instead of calculating from attendance records
  const stats = attendanceStats ? {
    totalDays: attendanceStats.totalRecords,
    presentDays: attendanceStats.presentCount,
    absentDays: attendanceStats.absentCount,
    lateDays: attendanceStats.lateCount,
    attendancePercentage: attendanceStats.attendancePercentage,
    currentStreak: attendanceStats.streaks?.current || 0,
    bestMonth: { month: '', percentage: 0 }, // Will be calculated from attendance records if needed
    subjects: [...new Set(attendance.map(r => r.subject).filter(Boolean))].length
  } : null;

  // Calculate current attendance streak
  function calculateCurrentStreak(records) {
    const sortedRecords = records.sort((a, b) => new Date(b.date) - new Date(a.date));
    let streak = 0;

    for (const record of sortedRecords) {
      if (record.status === 'present') {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }

  // Get best performing month
  function getBestMonth(records) {
    const monthlyStats = records.reduce((acc, record) => {
      const month = new Date(record.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      if (!acc[month]) {
        acc[month] = { total: 0, present: 0 };
      }
      acc[month].total++;
      if (record.status === 'present') {
        acc[month].present++;
      }
      return acc;
    }, {});

    let bestMonth = '';
    let bestPercentage = 0;

    Object.entries(monthlyStats).forEach(([month, stats]) => {
      const percentage = Math.round((stats.present / stats.total) * 100);
      if (percentage > bestPercentage) {
        bestPercentage = percentage;
        bestMonth = month;
      }
    });

    return { month: bestMonth, percentage: bestPercentage };
  }

  // Generate attendance report
  const handleDownloadReport = async () => {
    try {
      setGeneratingReport(true);

      // Check if we have the required data
      if (!session?.user?.id || !session?.user?.name) {
        alert('Session data not available. Please refresh the page and try again.');
        return;
      }

      if (!attendance || attendance.length === 0) {
        alert('No attendance data available to generate report. Please wait for attendance records to load.');
        return;
      }

      console.log('Generating report with data:', {
        studentId: session.user.id,
        studentName: session.user.name,
        studentClass: session.user.class,
        studentSection: session.user.section,
        attendanceCount: attendance.length
      });

      const response = await fetch('/api/student/attendance/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: session.user.id,
          studentName: session.user.name,
          studentClass: session.user.class || 'N/A',
          studentSection: session.user.section || 'N/A',
          attendance: attendance
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Report generation failed:', response.status, errorText);
        throw new Error(`Failed to generate report: ${response.status} ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `attendance_report_${session.user.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      console.log('Report downloaded successfully');
    } catch (error) {
      console.error('Error generating report:', error);
      alert(`Error generating report: ${error.message}`);
    } finally {
      setGeneratingReport(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="mx-auto h-12 w-12 text-red-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Error loading attendance</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{error}</p>
        <button
          onClick={fetchAttendance}
          className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
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
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Attendance</h1>
          <p className="text-gray-600 dark:text-gray-400">Track your attendance record and performance</p>
        </div>
        <button
          onClick={handleDownloadReport}
          disabled={generatingReport}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${
            generatingReport
              ? 'bg-gray-400 cursor-not-allowed text-gray-600'
              : 'bg-purple-600 hover:bg-purple-700 text-white'
          }`}
        >
          {generatingReport ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Generating...
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              Download Report
            </>
          )}
        </button>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Overall Attendance</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.attendancePercentage}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full mt-3 h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${stats.attendancePercentage}%` }}
              />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Present Days</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.presentDays}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Absent Days</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.absentDays}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Current Streak</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.currentStreak}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Search
            </label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search by subject, teacher, or date..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Month
            </label>
            <select
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Months</option>
              {months.map(month => (
                <option key={month} value={month}>
                  {new Date(2024, month).toLocaleDateString('en-US', { month: 'long' })}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Status</option>
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterMonth('');
                setFilterStatus('');
              }}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Attendance Records */}
      {filteredAttendance.length > 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Teacher
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Period
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Remarks
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredAttendance.map((record, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {new Date(record.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {record.subject || 'General'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {record.teacher_name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {record.period || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        record.status === 'present'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : record.status === 'absent'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}>
                        {record.status === 'present' && <CheckCircle className="w-3 h-3 mr-1" />}
                        {record.status === 'absent' && <XCircle className="w-3 h-3 mr-1" />}
                        {record.status === 'late' && <Clock className="w-3 h-3 mr-1" />}
                        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {record.remarks || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No attendance records found</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Your attendance records will appear here once your teachers mark attendance.
          </p>
        </div>
      )}

      {/* Additional Info */}
      {stats && stats.bestMonth.month && (
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-blue-800 dark:text-blue-200">
              Your best month was <strong>{stats.bestMonth.month}</strong> with <strong>{stats.bestMonth.percentage}%</strong> attendance!
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
