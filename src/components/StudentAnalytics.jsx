import { useState, useEffect } from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, LineElement, PointElement, Tooltip, Legend);

export default function StudentAnalytics({ studentId }) {
  const [gradesData, setGradesData] = useState(null);
  const [attendanceData, setAttendanceData] = useState(null);
  const [feesData, setFeesData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [gradesRes, attendanceRes, feesRes] = await Promise.all([
          fetch(`/api/student/grades?studentId=${studentId}`),
          fetch(`/api/student/attendance?studentId=${studentId}`),
          fetch(`/api/student/fees?studentUid=${studentId}`)
        ]);

        
        const attendance = await attendanceRes.json();
        const fees = await feesRes.json();

        
        setAttendanceData(attendance);
        setFeesData(fees);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    if (studentId) {
      fetchAnalytics();
    }
  }, [studentId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Grades Analytics for Student
  

  
  // Attendance Analytics for Student
  const attendanceTrendData = attendanceData?.recentAttendance ? {
    labels: attendanceData.recentAttendance.slice(-10).map(record => new Date(record.date).toLocaleDateString()),
    datasets: [{
      label: 'Attendance Status',
      data: attendanceData.recentAttendance.slice(-10).map(record => record.status === 'present' ? 1 : 0),
      borderColor: 'rgba(34, 197, 94, 1)',
      backgroundColor: 'rgba(34, 197, 94, 0.1)',
      tension: 0.4,
    }]
  } : null;

  // Fees Analytics for Student
  const feesStatusData = feesData?.data ? {
    labels: ['Paid', 'Pending', 'Overdue'],
    datasets: [{
      label: 'Fees Status',
      data: [
        feesData.data.filter(fee => fee.status === 'paid').length,
        feesData.data.filter(fee => fee.status === 'pending').length,
        feesData.data.filter(fee => fee.status === 'overdue').length
      ],
      backgroundColor: ['#22c55e', '#eab308', '#ef4444'],
    }]
  } : null;

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200">My Analytics</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Grades</h3>
          <p className="text-3xl font-bold text-blue-600">{gradesData?.summary?.averagePercentage?.toFixed(1) || 0}%</p>
          <p className="text-sm text-gray-500">Average Grade</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Attendance</h3>
          <p className="text-3xl font-bold text-green-600">{attendanceData?.attendancePercentage?.toFixed(1) || 0}%</p>
          <p className="text-sm text-gray-500">Overall Attendance</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Fees</h3>
          <p className="text-3xl font-bold text-yellow-600">₹{feesData?.data?.filter(f => f.status === 'paid').reduce((sum, f) => sum + parseFloat(f.amount), 0)?.toLocaleString() || 0}</p>
          <p className="text-sm text-gray-500">Paid Amount</p>
        </div>
      </div>

      {/* Grades Section */}
     

      {/* Attendance Section */}
     

      {/* Fees Section */}
      <section className="space-y-6">
        <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Fees Analytics</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {feesStatusData && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h4 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">Fees Status</h4>
              <Pie data={feesStatusData} options={{ responsive: true, maintainAspectRatio: false }} height={300} />
            </div>
          )}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h4 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">Fees Summary</h4>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Total Fees:</span>
                <span className="font-semibold">₹{feesData?.data?.reduce((sum, f) => sum + parseFloat(f.amount), 0)?.toLocaleString() || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Paid:</span>
                <span className="font-semibold text-green-600">₹{feesData?.data?.filter(f => f.status === 'paid').reduce((sum, f) => sum + parseFloat(f.amount), 0)?.toLocaleString() || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Pending:</span>
                <span className="font-semibold text-yellow-600">₹{feesData?.data?.filter(f => f.status === 'pending').reduce((sum, f) => sum + parseFloat(f.amount), 0)?.toLocaleString() || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Overdue:</span>
                <span className="font-semibold text-red-600">₹{feesData?.data?.filter(f => f.status === 'overdue').reduce((sum, f) => sum + parseFloat(f.amount), 0)?.toLocaleString() || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
