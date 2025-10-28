'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import {
  FileCheck,
  Calendar,
  Clock,
  MapPin,
  BookOpen,
  Download,
  Eye,
  Filter,
  Search,
  AlertCircle,
  CheckCircle,
  Clock as ClockIcon,
  Users,
  RefreshCw
} from 'lucide-react';

export default function StudentExams() {
  const { data: session } = useSession();
  const [exams, setExams] = useState([]);
  const [upcomingExams, setUpcomingExams] = useState([]);
  const [pastExams, setPastExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [showUpcomingOnly, setShowUpcomingOnly] = useState(false);
  const [showPastOnly, setShowPastOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalExams, setTotalExams] = useState(0);

  // Enhanced fetch function with retry logic
  const fetchExams = useCallback(async (page = 1) => {
    if (!session?.user?.id) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `/api/student/exams?studentId=${session?.user?.id}&upcoming=true&page=${page}&limit=50`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setExams(result.data || []);
        setUpcomingExams(result.upcoming || []);
        setPastExams(result.past || []);
        setTotalPages(result.pagination?.totalPages || 1);
        setTotalExams(result.pagination?.total || 0);
      } else {
        throw new Error(result.error || 'Failed to fetch exams');
      }
    } catch (err) {
      console.error('Error fetching exams:', err);
      setError(err.message);

      // Retry logic for network errors
      if (retryCount < 3) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          fetchExams(page);
        }, 1000 * (retryCount + 1));
      }
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id, retryCount]);

  useEffect(() => {
    if (session?.user?.id) {
      fetchExams(currentPage);
    }
  }, [session, currentPage, fetchExams]);

  // Filter exams
  const getFilteredExams = (examList) => {
    return examList.filter(exam => {
      const matchesSearch = exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           exam.subject.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSubject = !filterSubject || exam.subject === filterSubject;

      return matchesSearch && matchesSubject;
    });
  };

  // Get unique subjects for filters
  const subjects = [...new Set(exams.map(exam => exam.subject))];

  // Check if exam is today
  const isToday = (examDate) => {
    const today = new Date().toISOString().split('T')[0];
    return examDate === today;
  };

  // Check if exam is upcoming (within 7 days)
  const isUpcoming = (examDate) => {
    const today = new Date();
    const exam = new Date(examDate);
    const diffTime = exam - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 && diffDays <= 7;
  };

  // Generate PDF for exams
  const handleDownloadPDF = async (examIds, isBulk = false) => {
    try {
      const response = await fetch('/api/student/exams/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: session?.user?.id,
          studentName: session?.user?.name,
          studentClass: session?.user?.class,
          studentSection: session?.user?.section,
          examIds: examIds
        }),
      });

      if (response.ok) {
        // Get the HTML content
        const htmlContent = await response.text();
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;

        const fileName = isBulk
          ? `admit_cards_${session?.user?.name?.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.html`
          : `admit_card_${session?.user?.name?.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.html`;

        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        alert(`Admit card${isBulk ? 's' : ''} downloaded successfully!`);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate admit card');
      }
    } catch (error) {
      console.error('Error generating admit card:', error);
      alert(`Error generating admit card: ${error.message}`);
    }
  };

  // Enhanced error display with retry option
  if (error && retryCount >= 3) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
            Error loading exams
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {error}
          </p>
          <div className="mt-4 flex justify-center gap-2">
            <button
              onClick={() => {
                setRetryCount(0);
                setError(null);
                fetchExams(currentPage);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              <RefreshCw className="w-4 h-4" />
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        {retryCount > 0 && (
          <p className="ml-4 text-gray-600 dark:text-gray-400">
            Retrying... ({retryCount}/3)
          </p>
        )}
      </div>
    );
  }

  const filteredUpcoming = getFilteredExams(upcomingExams);
  const filteredPast = getFilteredExams(pastExams);

  // Handle bulk download for multiple exams
  const handleBulkDownload = async () => {
    try {
      const allExamIds = [...filteredUpcoming, ...filteredPast].map(exam => exam.id);
      if (allExamIds.length === 0) {
        alert('No exams available for download');
        return;
      }

      await handleDownloadPDF(allExamIds, true);
    } catch (error) {
      console.error('Error generating bulk admit cards:', error);
      alert(`Error generating admit cards: ${error.message}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Exams</h1>
          <p className="text-gray-600 dark:text-gray-400">View your upcoming and past examinations</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowUpcomingOnly(!showUpcomingOnly)}
            className={`px-3 py-2 text-sm rounded-lg ${
              showUpcomingOnly
                ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            Upcoming Only
          </button>
          <button
            onClick={() => setShowPastOnly(!showPastOnly)}
            className={`px-3 py-2 text-sm rounded-lg ${
              showPastOnly
                ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            Past Only
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Upcoming Exams</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{upcomingExams.length}</p>
            </div>
            <ClockIcon className="w-8 h-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Past Exams</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{pastExams.length}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Subjects</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{subjects.length}</p>
            </div>
            <BookOpen className="w-8 h-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Bulk Download Button - Show when more than 3 exams */}
      {(filteredUpcoming.length + filteredPast.length > 3) && (
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="text-white">
              <h3 className="text-lg font-semibold">Download All Admit Cards</h3>
              <p className="text-purple-100">
                You have {filteredUpcoming.length + filteredPast.length} exams. Download all admit cards in one PDF.
              </p>
            </div>
            <button
              onClick={handleBulkDownload}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-purple-600 rounded-lg hover:bg-gray-100 font-semibold transition-colors"
            >
              <Download className="w-5 h-5" />
              Download All ({filteredUpcoming.length + filteredPast.length} exams)
            </button>
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

          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterSubject('');
              }}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              Clear Filters
            </button>
          </div>

          <div className="flex items-end">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <p>Total: {totalExams} exams</p>
              <p>Page {currentPage} of {totalPages}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <div className="flex gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-2 text-sm rounded-lg ${
                    currentPage === pageNum
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

      {/* Upcoming Exams */}
      {(!showPastOnly && filteredUpcoming.length > 0) && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <ClockIcon className="w-5 h-5 text-orange-600" />
            Upcoming Exams
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUpcoming.map((exam) => (
              <div key={exam.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border-l-4 border-orange-500">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      {exam.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{exam.subject}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {isToday(exam.exam_date) && (
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                        Today!
                      </span>
                    )}
                    {isUpcoming(exam.exam_date) && !isToday(exam.exam_date) && (
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                        Soon
                      </span>
                    )}
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

                {exam.instructions && (
                  <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <strong>Instructions:</strong> {exam.instructions}
                    </p>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Created by: {exam.teacher_name}
                  </div>
                  <button
                    onClick={() => handleDownloadPDF([exam.id])}
                    className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    <Download className="w-3 h-3" />
                    Admit Card
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Past Exams */}
      {(!showUpcomingOnly && filteredPast.length > 0) && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Past Exams
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPast.map((exam) => (
              <div key={exam.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border-l-4 border-green-500">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      {exam.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{exam.subject}</p>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-600" />
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
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                    {exam.exam_type}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Completed • {exam.teacher_name}
                  </div>
                  <button
                    onClick={() => handleDownloadPDF([exam.id])}
                    className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                  >
                    <Download className="w-3 h-3" />
                    Result
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No exams message */}
      {filteredUpcoming.length === 0 && filteredPast.length === 0 && (
        <div className="text-center py-12">
          <FileCheck className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No exams found</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Your exam schedule will appear here once your teachers create them.
          </p>
        </div>
      )}

      {/* Show only upcoming or past when filtered */}
      {showUpcomingOnly && filteredUpcoming.length === 0 && (
        <div className="text-center py-8">
          <ClockIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No upcoming exams</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Check back later for upcoming examinations.
          </p>
        </div>
      )}

      {showPastOnly && filteredPast.length === 0 && (
        <div className="text-center py-8">
          <CheckCircle className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No past exams</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Your completed exams will appear here.
          </p>
        </div>
      )}
    </div>
  );
}
