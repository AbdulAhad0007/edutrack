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
  Award,
  BookOpen,
  Calendar,
  User
} from 'lucide-react';

export default function GradesManagement() {
  const { data: session } = useSession();
  const [grades, setGrades] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingGrade, setEditingGrade] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [filterClass, setFilterClass] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    student_id: '',
    student_name: '',
    student_class: '',
    student_section: '',
    subject: '',
    marks_obtained: '',
    total_marks: '',
    academic_year: '2025-26',
    semester: '1',
    exam_type: 'mid-term',
    exam_date: '',
    remarks: ''
  });

  // Fetch grades
  const fetchGrades = async () => {
    try {
      const response = await fetch(`/api/teacher/grades?teacherId=${session?.user?.uid}`);
      const result = await response.json();
      if (result.data) {
        setGrades(result.data);
      }
    } catch (error) {
      console.error('Error fetching grades:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch students for the teacher
  const fetchStudents = async () => {
    try {
      const response = await fetch(`/api/teacher/students?teacherName=${encodeURIComponent(session?.user?.name)}`);
      if (response.ok) {
        const result = await response.json();
        setStudents(result.data || []);

        // Log information about the students loaded
        console.log('📚 Students loaded for teacher:', session?.user?.name);
        console.log('📊 Total students loaded:', result.data?.length || 0);
        console.log('👥 Students data structure:', result.data?.slice(0, 3)); 

        if (result.fallback) {
          console.log('⚠️ Fallback mode: No students specifically assigned to teacher. Showing all students.');
        } else {
          console.log('✅ Students loaded successfully');
        }
      } else {
        console.error('Failed to fetch students:', response.status);
        let errorData = {};
        try {
          errorData = await response.json();
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError);
          errorData = {
            error: 'Unknown error occurred',
            details: 'The server returned an empty or invalid error response'
          };
        }
        console.error('Error details:', errorData);
        setStudents([]);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      setStudents([]);
    }
  };

  useEffect(() => {
    if (session?.user?.id) {
      fetchGrades();
      fetchStudents();
    }
  }, [session]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = ['student_id', 'student_name', 'subject', 'marks_obtained', 'total_marks', 'exam_type', 'exam_date'];
    const missingFields = requiredFields.filter(field => !formData[field]);

    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    const marksObtained = parseFloat(formData.marks_obtained);
    const totalMarks = parseFloat(formData.total_marks);

    if (isNaN(marksObtained) || isNaN(totalMarks) || marksObtained < 0 || totalMarks <= 0) {
      alert('Please enter valid marks (positive numbers)');
      return;
    }

    if (marksObtained > totalMarks) {
      alert('Marks obtained cannot be greater than total marks');
      return;
    }

    const gradeData = {
      ...formData,
      teacher_uid: session?.user?.uid,
      teacher_name: session?.user?.name
    };

    console.log('Submitting grade data:', gradeData);

    try {
      const response = await fetch('/api/teacher/grades', {
        method: editingGrade ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingGrade ? { ...gradeData, id: editingGrade.id } : gradeData),
      });

      if (response.ok) {
        await fetchGrades();
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
        console.error('Error saving grade:', errorData);
        alert(`Error saving grade: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Error saving grade:', error);
      alert('Error saving grade: ' + error.message);
    }
  };

  const handleEdit = (grade) => {
    setEditingGrade(grade);
    setFormData({
      student_id: grade.student_uid,
      student_name: grade.student_name,
      student_class: grade.student_class,
      student_section: grade.student_section,
      subject: grade.subject,
      marks_obtained: grade.marks_obtained,
      total_marks: grade.total_marks,
      academic_year: grade.academic_year,
      semester: grade.semester,
      exam_type: grade.exam_type,
      exam_date: grade.exam_date,
      remarks: grade.remarks || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (gradeId) => {
    if (!confirm('Are you sure you want to delete this grade?')) return;

    try {
      const response = await fetch(`/api/teacher/grades?id=${gradeId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchGrades();
      } else {
        alert('Error deleting grade');
      }
    } catch (error) {
      console.error('Error deleting grade:', error);
      alert('Error deleting grade');
    }
  };

  const resetForm = () => {
    setFormData({
      student_id: '',
      student_name: '',
      student_class: '',
      student_section: '',
      subject: '',
      marks_obtained: '',
      total_marks: '',
      academic_year: '2025-26',
      semester: '1',
      exam_type: 'mid-term',
      exam_date: '',
      remarks: ''
    });
    setEditingGrade(null);
  };

  // Filter grades
  const filteredGrades = grades.filter(grade => {
    const matchesSearch = grade.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         grade.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = !filterSubject || grade.subject === filterSubject;
    const matchesClass = !filterClass || grade.student_class === filterClass;

    return matchesSearch && matchesSubject && matchesClass;
  });

  // Get unique subjects and classes for filters
  const subjects = [...new Set(grades.map(grade => grade.subject))];
  const classes = [...new Set(grades.map(grade => grade.student_class))];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {students.length === 0 && !loading }

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Grades Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage student grades and academic performance</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          disabled={students.length === 0}
        >
          <Plus className="w-4 h-4" />
          Add Grade
        </button>
      </div>

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
                placeholder="Search by student or subject..."
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

          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterSubject('');
                setFilterClass('');
              }}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Marks
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Percentage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Grade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Exam Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredGrades.map((grade) => (
                <tr key={grade.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                          <User className="h-5 w-5 text-purple-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {grade.student_name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {grade.student_class} {grade.student_section}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <BookOpen className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900 dark:text-white">{grade.subject}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {grade.marks_obtained} / {grade.total_marks}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      parseFloat(grade.percentage) >= 75
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : parseFloat(grade.percentage) >= 60
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {grade.percentage}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                      {grade.grade}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {grade.exam_type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(grade.exam_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(grade)}
                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(grade.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredGrades.length === 0 && (
          <div className="text-center py-12">
            <Award className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No grades found</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Get started by adding your first grade.
            </p>
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {editingGrade ? 'Edit Grade' : 'Add New Grade'}
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Student
                    </label>
                    <select
                      value={formData.student_id}
                      onChange={(e) => {
                        const studentUid = e.target.value;
                        console.log('🔍 Looking for student with UID:', studentUid, 'Type:', typeof studentUid);
                        console.log('📋 Available students:', students.map(s => ({ uid: s.uid, name: s.name, class: s.class, uidType: typeof s.uid })));

                        const student = students.find(s => String(s.uid) === studentUid);

                        if (student) {
                          console.log('✅ Found student:', student);
                          setFormData({
                            ...formData,
                            student_id: student.uid, 
                            student_name: student.name || '',
                            student_class: student.class || '',
                            student_section: student.section || ''
                          });
                          console.log('✅ Updated form data:', {
                            student_id: student.uid,
                            student_name: student.name || '',
                            student_class: student.class || '',
                            student_section: student.section || ''
                          });
                        } else {
                          console.log('❌ Student not found with UID:', studentUid);
                          console.log('❌ Available student UIDs:', students.map(s => s.uid));
                          setFormData({
                            ...formData,
                            student_id: studentUid,
                            student_name: '',
                            student_class: '',
                            student_section: ''
                          });
                        }
                      }}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white ${
                        formData.student_id && !formData.student_name
                          ? 'border-red-500 dark:border-red-400'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                      required
                    >
                      <option value="">Select Student</option>
                      {students.length === 0 ? (
                        <option value="" disabled>
                          No students found - Please check database setup
                        </option>
                      ) : (
                        students.map(student => (
                          <option key={student.uid} value={student.uid}>
                            {student.name} - {student.class} {student.section}
                          </option>
                        ))
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Student UID <span className="text-xs text-gray-500">(Auto-filled)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.student_id}
                      onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white"
                      placeholder="Student UID will appear here..."
                      readOnly
                      title="This field is automatically populated when you select a student"
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
                      Marks Obtained
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.marks_obtained}
                      onChange={(e) => setFormData({ ...formData, marks_obtained: e.target.value })}
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
                      <option value="assignment">Assignment</option>
                      <option value="project">Project</option>
                    </select>
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
                      <option value="3">Semester 3</option>
                      <option value="4">Semester 4</option>
                      <option value="5">Semester 5</option>
                      <option value="6">Semester 6</option>
                      <option value="7">Semester 7</option>
                      <option value="8">Semester 8</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Remarks
                  </label>
                  <textarea
                    value={formData.remarks}
                    onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
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
                    {editingGrade ? 'Update Grade' : 'Save Grade'}
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
