'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Filter,
  Download,
  Eye,
  Save,
  X,
  FileCheck,
  Calendar,
  Clock,
  MapPin,
  Users,
  BookOpen,
  AlertCircle
} from 'lucide-react';

export default function ExamsManagement() {
  const { data: session } = useSession();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingExam, setEditingExam] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [showUpcomingOnly, setShowUpcomingOnly] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    class: '',
    section: '',
    exam_date: '',
    start_time: '',
    end_time: '',
    total_marks: '',
    passing_marks: '',
    instructions: '',
    room_number: '',
    academic_year: '2024-25',
    semester: '1',
    exam_type: 'mid-term',
    duration: '' // Duration in minutes
  });

  // Fetch exams
  const fetchExams = async () => {
    try {
      const response = await fetch(`/api/teacher/exams?teacherId=${session?.user?.uid}`);
      const result = await response.json();
      if (result.data) {
        setExams(result.data);
      }
    } catch (error) {
      console.error('Error fetching exams:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.uid) {
      fetchExams();
    }
  }, [session]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Enhanced validation
    const requiredFields = [
      'title', 'subject', 'class', 'exam_date',
      'start_time', 'end_time', 'total_marks',
      'academic_year', 'exam_type'
    ];

    const missingFields = requiredFields.filter(field => !formData[field]);

    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    // Validate date and time
    const examDate = new Date(formData.exam_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (examDate < today) {
      alert('Exam date cannot be in the past');
      return;
    }

    if (formData.start_time >= formData.end_time) {
      alert('End time must be after start time');
      return;
    }

    // Validate marks
    if (formData.total_marks <= 0) {
      alert('Total marks must be greater than 0');
      return;
    }

    if (formData.passing_marks && formData.passing_marks > formData.total_marks) {
      alert('Passing marks cannot be greater than total marks');
      return;
    }



    const examData = {
      ...formData,
      teacher_id: session?.user?.uid,
      teacher_name: session?.user?.name,
      is_active: true, // Ensure new exams are active by default
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    console.log('Submitting exam data:', examData);

    try {
      const response = await fetch('/api/teacher/exams', {
        method: editingExam ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingExam ? { ...examData, id: editingExam.id } : examData),
      });

      if (response.ok) {
        await fetchExams();
        resetForm();
        setShowForm(false);
      } else {
        let errorData = {};
        let errorMessage = 'Unknown error';

        try {
          const responseText = await response.text();
          console.log('Raw response:', responseText);

          if (responseText) {
            errorData = JSON.parse(responseText);
            console.log('Parsed error response:', errorData);
          }
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError);
          errorData = {
            error: 'Failed to parse server response',
            details: 'The server returned an invalid response format'
          };
        }

        errorMessage = errorData.error || errorData.details || 'Unknown error occurred';
        console.error('Error saving exam:', errorData);
        alert(`Error saving exam: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Error saving exam:', error);
      alert('Error saving exam: ' + error.message);
    }
  };

  // Handle edit
  const handleEdit = (exam) => {
    setEditingExam(exam);
    setFormData({
      title: exam.title,
      description: exam.description || '',
      subject: exam.subject,
      class: exam.class,
      section: exam.section || '',
      exam_date: exam.exam_date,
      start_time: exam.start_time,
      end_time: exam.end_time,
      total_marks: exam.total_marks,
      passing_marks: exam.passing_marks || '',
      instructions: exam.instructions || '',
      room_number: exam.room_number || '',
      academic_year: exam.academic_year,
      semester: exam.semester || '1',
      exam_type: exam.exam_type,
      duration: exam.duration || ''
    });
    setShowForm(true);
  };

  // Handle delete
  const handleDelete = async (examId) => {
    if (!confirm('Are you sure you want to delete this exam?')) return;

    try {
      const response = await fetch(`/api/teacher/exams?id=${examId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchExams();
      } else {
        alert('Error deleting exam');
      }
    } catch (error) {
      console.error('Error deleting exam:', error);
      alert('Error deleting exam');
    }
  };

  // Handle toggle active status
  const handleToggleActive = async (examId, currentStatus) => {
    try {
      const response = await fetch('/api/teacher/exams', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: examId,
          is_active: !currentStatus
        }),
      });

      if (response.ok) {
        await fetchExams();
      } else {
        alert('Error updating exam status');
      }
    } catch (error) {
      console.error('Error updating exam status:', error);
      alert('Error updating exam status');
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      subject: '',
      class: '',
      section: '',
      exam_date: '',
      start_time: '',
      end_time: '',
      total_marks: '',
      passing_marks: '',
      instructions: '',
      room_number: '',
      academic_year: '2024-25',
      semester: '1',
      exam_type: 'mid-term',
      duration: ''
    });
    setEditingExam(null);
  };

  // Filter exams
  const filteredExams = exams.filter(exam => {
    const matchesSearch = exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exam.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = !filterSubject || exam.subject === filterSubject;
    const matchesClass = !filterClass || exam.class === filterClass;
    const matchesUpcoming = !showUpcomingOnly || new Date(exam.exam_date) >= new Date();

    return matchesSearch && matchesSubject && matchesClass && matchesUpcoming;
  });

  // Get unique subjects and classes for filters
  const subjects = [...new Set(exams.map(exam => exam.subject))];
  const classes = [...new Set(exams.map(exam => exam.class))];

  // Check if exam is upcoming
  const isUpcoming = (examDate) => {
    return new Date(examDate) >= new Date();
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Exams Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Create and manage examination schedules</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Exam
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Search
            </label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title or subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Subject
            </label>
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Subjects</option>
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Class
            </label>
            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Classes</option>
              {classes.map(className => (
                <option key={className} value={className}>{className}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showUpcomingOnly}
                onChange={(e) => setShowUpcomingOnly(e.target.checked)}
                className="mr-2 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Upcoming Only</span>
            </label>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterSubject('');
                setFilterClass('');
                setShowUpcomingOnly(false);
              }}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Exams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExams.map((exam) => (
          <div key={exam.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  {exam.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{exam.subject}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  exam.is_active
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {exam.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Calendar className="w-4 h-4 mr-2" />
                {new Date(exam.exam_date).toLocaleDateString()}
              </div>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Clock className="w-4 h-4 mr-2" />
                {exam.start_time} - {exam.end_time}
              </div>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Users className="w-4 h-4 mr-2" />
                Class {exam.class} {exam.section && `(${exam.section})`}
              </div>
              {exam.room_number && (
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <MapPin className="w-4 h-4 mr-2" />
                  Room {exam.room_number}
                </div>
              )}
            </div>

            <div className="flex justify-between items-center mb-4">
              <div className="text-sm">
                <span className="font-medium text-gray-900 dark:text-white">
                  {exam.total_marks} marks
                </span>
                {exam.passing_marks && (
                  <span className="text-gray-500 dark:text-gray-400 ml-2">
                    (Pass: {exam.passing_marks})
                  </span>
                )}
              </div>
              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                {exam.exam_type}
              </span>
            </div>

            {exam.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                {exam.description}
              </p>
            )}

            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(exam)}
                  className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                  title="Edit exam"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleToggleActive(exam.id, exam.is_active)}
                  className={`${
                    exam.is_active
                      ? 'text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300'
                      : 'text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300'
                  }`}
                  title={exam.is_active ? 'Deactivate exam' : 'Activate exam'}
                >
                  <AlertCircle className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(exam.id)}
                  className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                  title="Delete exam"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              {isUpcoming(exam.exam_date) && (
                <span className="text-xs text-orange-600 dark:text-orange-400 font-medium">
                  Upcoming
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredExams.length === 0 && (
        <div className="text-center py-12">
          <FileCheck className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No exams found</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Get started by creating your first exam.
          </p>
        </div>
      )}

      {/* Create/Edit Exam Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {editingExam ? 'Edit Exam' : 'Create New Exam'}
                </h3>
                <button
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Exam Title
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Class
                    </label>
                    <input
                      type="text"
                      value={formData.class}
                      onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                      placeholder="e.g., 10A"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Section (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.section}
                      onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                      placeholder="e.g., A"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Exam Date
                    </label>
                    <input
                      type="date"
                      value={formData.exam_date}
                      onChange={(e) => setFormData({ ...formData, exam_date: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={formData.start_time}
                      onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={formData.end_time}
                      onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Total Marks
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.total_marks}
                      onChange={(e) => setFormData({ ...formData, total_marks: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Passing Marks (Optional)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.passing_marks}
                      onChange={(e) => setFormData({ ...formData, passing_marks: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Room Number (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.room_number}
                      onChange={(e) => setFormData({ ...formData, room_number: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Exam Type
                    </label>
                    <select
                      value={formData.exam_type}
                      onChange={(e) => setFormData({ ...formData, exam_type: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                      required
                    >
                      <option value="mid-term">Mid Term</option>
                      <option value="final">Final</option>
                      <option value="quiz">Quiz</option>
                      <option value="practical">Practical</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Academic Year
                    </label>
                    <input
                      type="text"
                      value={formData.academic_year}
                      onChange={(e) => setFormData({ ...formData, academic_year: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Semester
                    </label>
                    <select
                      value={formData.semester}
                      onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="1">Semester 1</option>
                      <option value="2">Semester 2</option>
                    </select>
                  </div>


                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description (Optional)
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Instructions (Optional)
                  </label>
                  <textarea
                    value={formData.instructions}
                    onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      resetForm();
                    }}
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {editingExam ? 'Update Exam' : 'Create Exam'}
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
