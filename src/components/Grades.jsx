// src/components/Grades.jsx
export default function Grades() {
  const subjects = [
    { name: 'Math', score: 78 },
    { name: 'English', score: 82 },
    { name: 'Science', score: 80 },
  ];

  const percentage = Math.round(subjects.reduce((s, sub) => s + sub.score, 0) / subjects.length);

  return (
    <div>
      <h2 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">Grades</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded shadow p-4 dark:bg-gray-800">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200">Subject-wise Grades</h3>
          <ul className="mt-3 text-sm text-gray-700 dark:text-gray-300">
            {subjects.map((s) => (
              <li key={s.name} className="py-2 border-b dark:border-gray-700">{s.name} — <span className="font-semibold">{s.score}%</span></li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded shadow p-4 dark:bg-gray-800">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200">Overall Percentage</h3>
          <p className="text-2xl font-bold mt-2 text-gray-800 dark:text-gray-100">{percentage}%</p>
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">Class Ranking: <span className="font-semibold">12/120</span></p>
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
            <h4 className="font-semibold">Grading Policy</h4>
            <p>A: 90-100, B: 80-89, C: 70-79, D: 60-69, F: &lt;60</p>
          </div>
        </div>
      </div>
    </div>
  );
}