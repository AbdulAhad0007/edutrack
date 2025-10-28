'use client';

import { useState, useEffect } from 'react';
import { Calendar, Users, Clock, MapPin, Plus, Trash2, Edit, UserCheck } from 'lucide-react';

export default function AdminMeetingsManagement() {
  const [meetings, setMeetings] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [scheduling, setScheduling] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    meeting_date: '',
    meeting_time: '',
    location: '',
    selected_teachers: [],
    meeting_type: 'online',
    duration: 60
  });

  const meetingTypes = [
    { value: 'online', label: 'Online Meeting' },
    { value: 'offline', label: 'In-Person Meeting' },
    { value: 'hybrid', label: 'Hybrid Meeting' }
  ];

  useEffect(() => {
    fetchMeetings();
    fetchTeachers();
  }, []);

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/meetings');
      if (res.ok) {
        const data = await res.json();
        setMeetings(data);
      } else {
        console.error('Failed to fetch meetings');
      }
    } catch (error) {
      console.error('Error fetching meetings:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeachers = async () => {
    try {
      const res = await fetch('/api/admin/teachers');
      if (res.ok) {
        const data = await res.json();
        setTeachers(data);
      } else {
        console.error('Failed to fetch teachers');
      }
    } catch (error) {
      console.error('Error fetching teachers:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTeacherSelection = (teacherId) => {
    setFormData(prev => ({
      ...prev,
      selected_teachers: prev.selected_teachers.includes(teacherId)
        ? prev.selected_teachers.filter(id => id !== teacherId)
        : [...prev.selected_teachers, teacherId]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setScheduling(true);

      const meetingData = {
        ...formData,
        scheduled_by: 'admin',
        created_at: new Date().toISOString(),
        attendees: formData.selected_teachers
      };

      const res = await fetch('/api/admin/meetings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(meetingData),
      });

      if (res.ok) {
        try {
          const newMeeting = await res.json();

          // Handle different response formats safely
          let meetingToAdd;
          if (Array.isArray(newMeeting) && newMeeting.length > 0) {
            meetingToAdd = newMeeting[0];
          } else if (newMeeting && typeof newMeeting === 'object') {
            meetingToAdd = newMeeting;
          } else {
            // If API doesn't return the meeting, create it locally
            meetingToAdd = {
              id: Date.now(), // Temporary ID
              ...meetingData,
              created_at: new Date().toISOString()
            };
          }

          setMeetings(prev => [meetingToAdd, ...prev]);
          resetForm();
          setShowScheduleForm(false);
          alert('Meeting scheduled successfully!');
        } catch (parseError) {
          console.error('Error parsing response:', parseError);
          // Create meeting locally if parsing fails
          const meetingToAdd = {
            id: Date.now(),
            ...meetingData,
            created_at: new Date().toISOString()
          };
          setMeetings(prev => [meetingToAdd, ...prev]);
          resetForm();
          setShowScheduleForm(false);
          alert('Meeting scheduled successfully!');
        }
      } else {
        // Handle error responses - read response body only once
        try {
          const errorData = await res.json();
          const errorMessage = errorData.error || 'Unknown error occurred';
          const errorDetails = errorData.details || '';
          alert(`Failed to schedule meeting: ${errorMessage}${errorDetails ? `\nDetails: ${errorDetails}` : ''}`);
        } catch (parseError) {
          // If JSON parsing fails, try to read as text
          try {
            const errorText = await res.text();
            alert(`Failed to schedule meeting: ${errorText}`);
          } catch (textError) {
            // If both fail, show generic error
            alert('Failed to schedule meeting: Unknown error occurred');
          }
        }
      }
    } catch (error) {
      console.error('Error scheduling meeting:', error);
      alert(`Failed to schedule meeting: ${error.message}`);
    } finally {
      setScheduling(false);
    }
  };

  const handleDelete = async (meetingId) => {
    if (!confirm('Are you sure you want to delete this meeting?')) return;

    try {
      const res = await fetch(`/api/admin/meetings?id=${meetingId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setMeetings(prev => prev.filter(m => m.id !== meetingId));
        alert('Meeting deleted successfully!');
      } else {
        alert('Failed to delete meeting');
      }
    } catch (error) {
      console.error('Error deleting meeting:', error);
      alert('Failed to delete meeting');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      meeting_date: '',
      meeting_time: '',
      location: '',
      selected_teachers: [],
      meeting_type: 'online',
      duration: 60
    });
  };

  const getMeetingTypeColor = (type) => {
    switch (type) {
      case 'online':
        return 'bg-blue-100 text-blue-800';
      case 'offline':
        return 'bg-green-100 text-green-800';
      case 'hybrid':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSelectedTeachersNames = () => {
    return teachers
      .filter(teacher => formData.selected_teachers.includes(teacher.id))
      .map(teacher => teacher.name)
      .join(', ');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Arrange Meetings</h1>
        <button
          onClick={() => {
            resetForm();
            setShowScheduleForm(true);
          }}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Schedule Meeting
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Scheduled</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{meetings.length}</p>
            </div>
            <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">This Month</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                {meetings.filter(m => {
                  const meetingDate = new Date(m.meeting_date);
                  const now = new Date();
                  return meetingDate.getMonth() === now.getMonth() && meetingDate.getFullYear() === now.getFullYear();
                }).length}
              </p>
            </div>
            <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Upcoming</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                {meetings.filter(m => new Date(m.meeting_date) > new Date()).length}
              </p>
            </div>
            <UserCheck className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Schedule Meeting Form */}
      {showScheduleForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Schedule New Meeting
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Meeting Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Enter meeting title"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Enter meeting description"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Date *
                    </label>
                    <input
                      type="date"
                      name="meeting_date"
                      value={formData.meeting_date}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Time *
                    </label>
                    <input
                      type="time"
                      name="meeting_time"
                      value={formData.meeting_time}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Duration (minutes) *
                    </label>
                    <select
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      <option value={30}>30 minutes</option>
                      <option value={60}>1 hour</option>
                      <option value={90}>1.5 hours</option>
                      <option value={120}>2 hours</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Meeting Type *
                    </label>
                    <select
                      name="meeting_type"
                      value={formData.meeting_type}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      {meetingTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Location {formData.meeting_type === 'online' ? '(Optional)' : '*'}
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      required={formData.meeting_type !== 'online'}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder={formData.meeting_type === 'online' ? 'Meeting link or leave empty' : 'Enter meeting location'}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Select Teachers *
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-40 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-lg p-3">
                      {teachers.map((teacher) => (
                        <label key={teacher.id} className="flex items-center space-x-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded">
                          <input
                            type="checkbox"
                            checked={formData.selected_teachers.includes(teacher.id)}
                            onChange={() => handleTeacherSelection(teacher.id)}
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {teacher.name} - {teacher.department}
                          </span>
                        </label>
                      ))}
                    </div>
                    {formData.selected_teachers.length > 0 && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        Selected: {getSelectedTeachersNames()}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowScheduleForm(false);
                      resetForm();
                    }}
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={scheduling || formData.selected_teachers.length === 0}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                  >
                    {scheduling ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
                        Scheduling...
                      </>
                    ) : (
                      <>
                        <Calendar className="w-4 h-4 mr-2 inline-block" />
                        Schedule Meeting
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Meetings List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Scheduled Meetings ({meetings.length})
          </h2>
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {meetings.map((meeting) => (
            <div key={meeting.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {meeting.title}
                    </h3>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getMeetingTypeColor(meeting.meeting_type)}`}>
                      {meeting.meeting_type.toUpperCase()}
                    </span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      new Date(meeting.meeting_date) > new Date()
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {new Date(meeting.meeting_date) > new Date() ? 'Upcoming' : 'Past'}
                    </span>
                  </div>

                  {meeting.description && (
                    <p className="text-gray-600 dark:text-gray-400 mb-3">
                      {meeting.description}
                    </p>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(meeting.meeting_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {meeting.meeting_time} ({meeting.duration}min)
                    </span>
                    <span className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {meeting.location || 'Online'}
                    </span>
                    <span className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {Array.isArray(meeting.attendees) ? meeting.attendees.length : 0} attendees
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => handleDelete(meeting.id)}
                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    title="Delete meeting"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {meetings.length === 0 && (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              No meetings scheduled yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
