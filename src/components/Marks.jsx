// src/components/Marks.jsx
export default function Marks() {
  const students = [
    { name: 'Alice Johnson', roll: 'A01', marks: { math: 92, eng: 88, sci: 95 } },
    { name: 'Bob Smith', roll: 'B02', marks: { math: 78, eng: 81, sci: 74 } },
  ];

  return (
    <div>
      <h2 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">Marks</h2>
      <div className="bg-white rounded shadow p-4 dark:bg-gray-800">
        <table className="w-full text-sm text-left text-gray-600 dark:text-gray-300">
          <thead className="text-xs uppercase text-gray-500 border-b dark:border-gray-700">
            <tr>
              <th className="py-2 px-3">Student</th>
              <th className="py-2 px-3">Roll</th>
              <th className="py-2 px-3">Math</th>
              <th className="py-2 px-3">English</th>
              <th className="py-2 px-3">Science</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.roll} className="border-b dark:border-gray-700">
                <td className="py-2 px-3">{s.name}</td>
                <td className="py-2 px-3">{s.roll}</td>
                <td className="py-2 px-3">{s.marks.math}</td>
                <td className="py-2 px-3">{s.marks.eng}</td>
                <td className="py-2 px-3">{s.marks.sci}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}