'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  BookOpen,
  Calendar,
  Award,
  TrendingUp,
  Download,
  Eye,
  Filter,
  Search,
  BarChart3,
  Target
} from 'lucide-react';

export default function StudentGrades() {
  const { data: session } = useSession();
  const [grades, setGrades] = useState([]);
  const [groupedGrades, setGroupedGrades] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [filterExamType, setFilterExamType] = useState('');
  const [showSummary, setShowSummary] = useState(true);

  // Fetch student grades
  const fetchGrades = async () => {
    try {
      const response = await fetch(`/api/student/grades?studentId=${session?.user?.uid}`);
      const result = await response.json();
      if (result.data) {
        setGrades(result.data);
        setGroupedGrades(result.grouped);
      }
    } catch (error) {
      console.error('Error fetching grades:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.uid) {
      fetchGrades();
    }
  }, [session]);

  // Filter grades
  const filteredGrades = grades.filter(grade => {
    const matchesSearch = grade.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         grade.teacher_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = !filterSubject || grade.subject === filterSubject;
    const matchesExamType = !filterExamType || grade.exam_type === filterExamType;

    return matchesSearch && matchesSubject && matchesExamType;
  });

  // Get unique subjects and exam types for filters
  const subjects = [...new Set(grades.map(grade => grade.subject))];
  const examTypes = [...new Set(grades.map(grade => grade.exam_type))];

  // Calculate summary statistics
  const summary = grades.length > 0 ? {
    totalGrades: grades.length,
    subjects: subjects.length,
    averagePercentage: (grades.reduce((sum, grade) => sum + parseFloat(grade.percentage), 0) / grades.length).toFixed(2),
    highestGrade: Math.max(...grades.map(grade => parseFloat(grade.percentage))).toFixed(2),
    lowestGrade: Math.min(...grades.map(grade => parseFloat(grade.percentage))).toFixed(2),
    gradeDistribution: grades.reduce((acc, grade) => {
      acc[grade.grade] = (acc[grade.grade] || 0) + 1;
      return acc;
    }, {})
  } : null;

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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Grades</h1>
          <p className="text-gray-600 dark:text-gray-400">View your academic performance and progress</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSummary(!showSummary)}
            className="px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            {showSummary ? 'Hide Summary' : 'Show Summary'}
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      {showSummary && summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Grades</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{summary.totalGrades}</p>
              </div>
              <Award className="w-8 h-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Subjects</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{summary.subjects}</p>
              </div>
              <BookOpen className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Average %</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{summary.averagePercentage}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Best Grade</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{summary.highestGrade}%</p>
              </div>
              <Target className="w-8 h-8 text-orange-600" />
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
                placeholder="Search by subject or teacher..."
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
              Exam Type
            </label>
            <select
              value={filterExamType}
              onChange={(e) => setFilterExamType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Types</option>
              {examTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterSubject('');
                setFilterExamType('');
              }}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Grades Display */}
      {filteredGrades.length > 0 ? (
        <div className="space-y-6">
          {Object.entries(groupedGrades).map(([subject, subjectGrades]) => {
            const subjectFilteredGrades = subjectGrades.filter(grade =>
              (!filterSubject || grade.subject === filterSubject) &&
              (!filterExamType || grade.exam_type === filterExamType) &&
              (grade.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
               grade.teacher_name.toLowerCase().includes(searchTerm.toLowerCase()))
            );

            if (subjectFilteredGrades.length === 0) return null;

            const subjectAverage = (subjectFilteredGrades.reduce((sum, grade) =>
              sum + parseFloat(grade.percentage), 0) / subjectFilteredGrades.length).toFixed(2);

            return (
              <div key={subject} className="bg-white dark:bg-gray-800 rounded-lg shadow">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{subject}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {subjectFilteredGrades.length} grades • Average: {subjectAverage}%
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        parseFloat(subjectAverage) >= 75
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : parseFloat(subjectAverage) >= 60
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {subjectAverage}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Exam Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Teacher
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
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Remarks
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {subjectFilteredGrades.map((grade) => (
                        <tr key={grade.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            {grade.exam_type}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {grade.teacher_name}
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
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {new Date(grade.exam_date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {grade.remarks || '-'}
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
      ) : (
        <div className="text-center py-12">
          <Award className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No grades found</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Your grades will appear here once your teachers upload them.
          </p>
        </div>
      )}
    </div>
  );
}
