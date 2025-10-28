'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, Calendar, Clock, MapPin, BookOpen } from 'lucide-react';

export default function TeacherTimetable({ teacher }) {
  const [timetable, setTimetable] = useState([]);
  const [groupedTimetable, setGroupedTimetable] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [activeView, setActiveView] = useState('all'); // 'all', 'class', 'day'

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  useEffect(() => {
    const fetchTimetable = async () => {
      if (!teacher?.name) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams({
          teacher: teacher.name
        });

        const response = await fetch(`/api/teacher/timetable?${params}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch timetable: ${response.statusText}`);
        }

        const data = await response.json();
        setTimetable(data.timetable);
        setGroupedTimetable(data.groupedTimetable);
      } catch (err) {
        console.error('Error fetching teacher timetable:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTimetable();
  }, [teacher?.name]);

  // Filter timetable based on search and filters
  const getFilteredTimetable = () => {
    let filtered = timetable;

    if (searchTerm.trim()) {
      filtered = filtered.filter(entry =>
        entry.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.room_number?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedClass) {
      filtered = filtered.filter(entry => entry.class === selectedClass);
    }

    if (selectedDay) {
      filtered = filtered.filter(entry => entry.day_of_week === selectedDay);
    }

    return filtered;
  };

  const getUniqueClasses = () => {
    return [...new Set(timetable.map(entry => entry.class))];
  };

  const getClassSchedule = (className) => {
    return timetable.filter(entry => entry.class === className);
  };

  if (loading) {
    return (
      <div>
        <h2 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">My Timetable</h2>
        <div className="bg-white rounded shadow p-4 dark:bg-gray-800">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h2 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">My Timetable</h2>
        <div className="bg-white rounded shadow p-4 dark:bg-gray-800">
          <div className="text-center py-8">
            <p className="text-red-600 dark:text-red-400">Error loading timetable: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  const filteredTimetable = getFilteredTimetable();
  const uniqueClasses = getUniqueClasses();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">My Timetable</h2>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {timetable.length} total entries
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by subject, class, or room..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Class
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Classes</option>
              {uniqueClasses.map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Day
            </label>
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Days</option>
              {days.map(day => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedClass('');
                setSelectedDay('');
              }}
              className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex space-x-2">
        <button
          onClick={() => setActiveView('all')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeView === 'all'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          All Entries
        </button>
        <button
          onClick={() => setActiveView('class')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeView === 'class'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          By Class
        </button>
        <button
          onClick={() => setActiveView('day')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeView === 'day'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          By Day
        </button>
      </div>

      {/* Content */}
      {activeView === 'all' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
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
                {filteredTimetable.map((entry) => (
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
        </div>
      )}

      {activeView === 'class' && (
        <div className="space-y-6">
          {uniqueClasses.map(className => {
            const classSchedule = getClassSchedule(className);
            if (classSchedule.length === 0) return null;

            return (
              <div key={className} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  {className}
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Day
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Period
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Subject
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Time & Room
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {classSchedule.map((entry) => (
                        <tr key={entry.id}>
                          <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">
                            {entry.day_of_week}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">
                            {entry.period}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">
                            {entry.subject}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">
                            <div>{entry.start_time} - {entry.end_time}</div>
                            <div className="text-gray-500 dark:text-gray-400">
                              Room {entry.room_number || 'N/A'}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeView === 'day' && (
        <div className="space-y-6">
          {days.map(day => {
            const daySchedule = filteredTimetable.filter(entry => entry.day_of_week === day);
            if (daySchedule.length === 0) return null;

            return (
              <div key={day} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  {day}
                </h3>
                <div className="space-y-3">
                  {daySchedule.map((entry) => (
                    <div key={entry.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          Period {entry.period}
                        </div>
                        <div className="text-sm text-gray-900 dark:text-white">
                          {entry.subject}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {entry.start_time} - {entry.end_time}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {entry.class} • Room {entry.room_number || 'N/A'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {filteredTimetable.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">
            {timetable.length === 0 ? 'No timetable entries found.' : 'No entries match your search criteria.'}
          </p>
        </div>
      )}
    </div>
  );
}
