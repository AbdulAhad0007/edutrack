<<<<<<< HEAD
import { useState, useEffect } from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
=======
// src/components/Analytics.jsx
import { Bar, Pie } from 'react-chartjs-2';
>>>>>>> e72ad566b79fdad6a6790dcdbf09158b3490aec0
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
<<<<<<< HEAD
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, LineElement, PointElement, Tooltip, Legend);

export default function Analytics({ isAdmin = false }) {
  const [gradesData, setGradesData] = useState(null);
  const [attendanceData, setAttendanceData] = useState(null);
  const [feesData, setFeesData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [gradesRes, attendanceRes, feesRes] = await Promise.all([
          fetch('/api/admin/grades'),
          fetch('/api/admin/attendance'),
          fetch('/api/admin/fees')
        ]);

        const grades = await gradesRes.json();
        const attendance = await attendanceRes.json();
        const fees = await feesRes.json();

        setGradesData(grades);
        setAttendanceData(attendance);
        setFeesData(fees);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Grades Analytics
  const gradesChartData = gradesData ? {
    labels: Object.keys(gradesData.grouped || {}).slice(0, 10), // Top 10 subjects
    datasets: [{
      label: 'Average Grade %',
      data: Object.values(gradesData.grouped || {}).slice(0, 10).map(subjectGrades => {
        const avg = subjectGrades.reduce((sum, grade) => sum + parseFloat(grade.percentage || 0), 0) / subjectGrades.length;
        return Math.round(avg * 100) / 100;
      }),
      backgroundColor: 'rgba(59, 130, 246, 0.7)',
    }]
  } : null;

  const gradeDistributionData = gradesData ? {
    labels: ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F'],
    datasets: [{
      label: 'Grade Distribution',
      data: ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F'].map(grade =>
        gradesData.data?.filter(g => g.grade === grade).length || 0
      ),
      backgroundColor: [
        '#22c55e', '#16a34a', '#84cc16', '#eab308',
        '#f97316', '#ea580c', '#dc2626', '#b91c1c'
      ],
    }]
  } : null;

  // Attendance Analytics
  const attendanceTrendData = attendanceData ? {
    labels: attendanceData.attendanceTrend?.map(t => new Date(t.date).toLocaleDateString()) || [],
    datasets: [{
      label: 'Attendance %',
      data: attendanceData.attendanceTrend?.map(t => Math.round(t.percentage * 100) / 100) || [],
      borderColor: 'rgba(34, 197, 94, 1)',
      backgroundColor: 'rgba(34, 197, 94, 0.1)',
      tension: 0.4,
    }]
  } : null;

  const attendanceStatusData = attendanceData ? {
    labels: ['Present', 'Absent', 'Late'],
    datasets: [{
      label: 'Attendance Status',
      data: [
        attendanceData.presentCount || 0,
        attendanceData.absentCount || 0,
        attendanceData.lateCount || 0
      ],
      backgroundColor: ['#22c55e', '#ef4444', '#f97316'],
    }]
  } : null;

  // Fees Analytics
  const feesStatusData = feesData ? {
    labels: ['Paid', 'Pending', 'Overdue'],
    datasets: [{
      label: 'Fees Status',
      data: [
        feesData.paidFees || 0,
        feesData.pendingFees || 0,
        feesData.overdueFees || 0
      ],
      backgroundColor: ['#22c55e', '#eab308', '#ef4444'],
    }]
  } : null;

  const feesMonthlyData = feesData ? {
    labels: feesData.monthlyTrend?.map(t => t.month) || [],
    datasets: [
      {
        label: 'Collected Amount',
        data: feesData.monthlyTrend?.map(t => t.collected) || [],
        backgroundColor: 'rgba(34, 197, 94, 0.7)',
      },
      {
        label: 'Pending Amount',
        data: feesData.monthlyTrend?.map(t => t.pending) || [],
        backgroundColor: 'rgba(234, 179, 8, 0.7)',
      }
    ]
  } : null;

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Analytics Dashboard</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Grades</h3>
          <p className="text-3xl font-bold text-blue-600">{gradesData?.summary?.averagePercentage?.toFixed(1) || 0}%</p>
          <p className="text-sm text-gray-500">Average Grade</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Attendance</h3>
          <p className="text-3xl font-bold text-green-600">{attendanceData?.overallAttendancePercentage?.toFixed(1) || 0}%</p>
          <p className="text-sm text-gray-500">Overall Attendance</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Fees</h3>
          <p className="text-3xl font-bold text-yellow-600">₹{feesData?.paidAmount?.toLocaleString() || 0}</p>
          <p className="text-sm text-gray-500">Collected</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Payment Rate</h3>
          <p className="text-3xl font-bold text-purple-600">{feesData?.paymentRate?.toFixed(1) || 0}%</p>
          <p className="text-sm text-gray-500">Collection Rate</p>
        </div>
      </div>

      {/* Grades Section */}

      {/* Attendance Section */}

      {/* Fees Section */}
     
=======
  Tooltip,
  Legend,
} from 'chart.js';
import { getStudentById } from '@/lib/students';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

export default function Analytics({ studentId }) {
  const student = getStudentById(studentId);

  // Prepare data from student marks and attendance
  const attendanceTrend = student?.attendance?.monthly || [];
  const averageGrades = student?.marks || {};
  const weakSubjects = [];
  const strongSubjects = [];

  // Determine weak and strong subjects based on marks threshold
  Object.entries(averageGrades).forEach(([subject, grade]) => {
    if (grade < 75) {
      weakSubjects.push(subject);
    } else {
      strongSubjects.push(subject);
    }
  });

  const attendanceData = {
    labels: attendanceTrend.map((_, i) => `Week ${i + 1}`),
    datasets: [
      {
        label: 'Attendance %',
        data: attendanceTrend,
        backgroundColor: 'rgba(99, 102, 241, 0.7)', // Indigo-500
      },
    ],
  };

  const gradesData = {
    labels: Object.keys(averageGrades).map((sub) => sub.toUpperCase()),
    datasets: [
      {
        label: 'Average Grade %',
        data: Object.values(averageGrades),
        backgroundColor: ['#3b82f6', '#10b981', '#f59e0b'], // Blue, Green, Yellow
      },
    ],
  };

  const weakStrongData = {
    labels: ['Weak Subjects', 'Strong Subjects'],
    datasets: [
      {
        label: 'Subjects',
        data: [weakSubjects.length, strongSubjects.length],
        backgroundColor: ['#ef4444', '#22c55e'], // Red, Green
      },
    ],
  };

  return (
    <div>
      <h2 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">Analytics</h2>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-4 shadow dark:bg-gray-800">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200">Attendance Trend (last 7 weeks)</h3>
          <Bar data={attendanceData} />
        </div>

        <div className="bg-white rounded-lg p-4 shadow dark:bg-gray-800">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200">Subject Averages</h3>
          <Bar data={gradesData} />
        </div>
      </section>

      <section className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-4 shadow dark:bg-gray-800">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200">Weak vs Strong Subjects</h3>
          <Pie data={weakStrongData} />
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">Weak: {weakSubjects.join(', ') || 'None'}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">Strong: {strongSubjects.join(', ')}</p>
        </div>

        <div className="bg-white rounded-lg p-4 shadow dark:bg-gray-800">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200">Recommendations</h3>
          <ul className="mt-2 list-disc list-inside text-sm text-gray-600 dark:text-gray-300">
            <li>Focus extra practice on Math — consider weekly mock tests.</li>
            <li>Attend revision sessions in Science to maintain strong performance.</li>
            <li>Look into peer study groups for English to push top grades higher.</li>
          </ul>
        </div>
      </section>
>>>>>>> e72ad566b79fdad6a6790dcdbf09158b3490aec0
    </div>
  );
}
