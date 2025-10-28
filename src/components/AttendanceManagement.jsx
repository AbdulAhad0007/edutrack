'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { UserCheck, UserX, Clock, Users, CheckCircle, AlertCircle, Save } from 'lucide-react';

export default function AttendanceManagement() {
  const { data: session } = useSession();
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedClass, setSelectedClass] = useState('10th Grade');
  const [selectedSection, setSelectedSection] = useState('A');
  const [selectedSubject, setSelectedSubject] = useState('Mathematics');
  const [selectedPeriod, setSelectedPeriod] = useState('1st Period');

  const classes = ['CSE', 'ME', 'EEE' , 'CE' ,'CSE-IOT', 'CSE-AIML' , 'CSE-DS','10th Grade', '11th Grade', '12th Grade'];
  const sections = ['A', 'B', 'C'];
  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'PDP', 'OS', 'TAFL','DSTL','DSA','Big Data', 'Web Tech', 'DAA', 'DA', 'COI'];
  const periods = ['1st Period', '2nd Period', '3rd Period', '4th Period', '5th Period', '6th Period', '7th Period', '8th Period'];

  useEffect(() => {
    fetchStudents();
  }, [selectedClass, selectedSection]);

  const fetchStudents = async () => {
    try {
      setLoading(true);

      const response = await fetch(`/api/admin/students?section=${selectedSection}`);
      if (response.ok) {
        const studentsData = await response.json();
        setStudents(studentsData);

        const initialAttendance = {};
        studentsData.forEach(student => {
          initialAttendance[student.id] = 'present';
        });
        setAttendance(initialAttendance);
      } else {
        console.error('Failed to fetch students');
        setStudents([]);
        setAttendance({});
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      setStudents([]);
      setAttendance({});
    } finally {
      setLoading(false);
    }
  };

  const handleAttendanceChange = (studentId, status) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleSaveAttendance = async () => {
    try {
      setSaving(true);

      const attendanceData = {
        class: selectedClass,
        section: selectedSection,
        subject: selectedSubject,
        period: selectedPeriod,
        date: new Date().toISOString().split('T')[0],
        records: Object.entries(attendance).map(([studentId, status]) => {
          const student = students.find(s => s.id === parseInt(studentId));
          return {
            studentId: parseInt(studentId),
            studentName: student?.name,
            rollNumber: student?.uid,
            status,
            markedBy: session?.user?.name || 'teacher',
            teacherUid: session?.user?.id,
            markedAt: new Date().toISOString()
          };
        })
      };

      console.log('Saving attendance:', attendanceData);

      const response = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(attendanceData)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Attendance saved successfully:', result);
        alert('Attendance saved successfully!');
      } else {
        const errorText = await response.text();
        console.error('Failed to save attendance:', errorText);
        alert(`Failed to save attendance: ${errorText}`);
      }
    } catch (error) {
      console.error('Error saving attendance:', error);
      alert('Failed to save attendance');
    } finally {
      setSaving(false);
    }
  };

  const getAttendanceStats = () => {
    const total = students.length;
    const present = Object.values(attendance).filter(status => status === 'present').length;
    const absent = Object.values(attendance).filter(status => status === 'absent').length;
    const late = Object.values(attendance).filter(status => status === 'late').length;

    return { total, present, absent, late };
  };

  const stats = getAttendanceStats();

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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Take Attendance</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleSaveAttendance}
            disabled={saving || students.length === 0}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Attendance
              </>
            )}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Class
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              {classes.map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Section
            </label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              {sections.map(section => (
                <option key={section} value={section}>{section}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Subject
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Period
            </label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              {periods.map(period => (
                <option key={period} value={period}>{period}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Attendance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Students</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Present</p>
              <p className="text-2xl font-bold text-green-600">{stats.present}</p>
            </div>
            <UserCheck className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Absent</p>
              <p className="text-2xl font-bold text-red-600">{stats.absent}</p>
            </div>
            <UserX className="w-8 h-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Late</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.late}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Attendance List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Mark Attendance - {selectedClass} {selectedSection} Section
          </h2>
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {students.map((student) => (
            <div key={student.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                      <span className="text-gray-600 dark:text-gray-300 font-medium">
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {student.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Roll No: {student.uid} {/* Display UID as roll number */}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleAttendanceChange(student.id, 'present')}
                    className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                      attendance[student.id] === 'present'
                        ? 'bg-green-100 text-green-800 border-2 border-green-500'
                        : 'bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-600'
                    }`}
                  >
                    <UserCheck className="w-4 h-4 mr-1" />
                    Present
                  </button>

                  <button
                    onClick={() => handleAttendanceChange(student.id, 'absent')}
                    className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                      attendance[student.id] === 'absent'
                        ? 'bg-red-100 text-red-800 border-2 border-red-500'
                        : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600'
                    }`}
                  >
                    <UserX className="w-4 h-4 mr-1" />
                    Absent
                  </button>

                  <button
                    onClick={() => handleAttendanceChange(student.id, 'late')}
                    className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                      attendance[student.id] === 'late'
                        ? 'bg-yellow-100 text-yellow-800 border-2 border-yellow-500'
                        : 'bg-gray-100 text-gray-600 hover:bg-yellow-50 hover:text-yellow-600'
                    }`}
                  >
                    <Clock className="w-4 h-4 mr-1" />
                    Late
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {students.length === 0 && (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 mb-2">
              No students found for {selectedClass} {selectedSection} Section.
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Please add students first using the "Add Student" button in the dashboard.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
