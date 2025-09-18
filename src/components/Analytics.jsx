// src/components/Analytics.jsx
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
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
    </div>
  );
}
