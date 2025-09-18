// src/components/Attendance.jsx
export default function Attendance() {
  // class-level quick stats
  const classes = [
    { name: '10-A', total: 30, present: 28 },
    { name: '9-B', total: 30, present: 27 },
    { name: '11-C', total: 30, present: 25 },
  ];

  // monthly breakdown and recent absent days
  const monthly = [
    { month: 'January', present: 20, total: 22 },
    { month: 'February', present: 18, total: 20 },
    { month: 'March', present: 21, total: 22 },
    { month: 'April', present: 19, total: 21 },
    { month: 'May', present: 22, total: 22 },
  ];

  const absentDays = ['2025-02-14', '2025-04-03', '2025-04-07'];

  const overall = Math.round((monthly.reduce((s, m) => s + m.present, 0) / monthly.reduce((s, m) => s + m.total, 0)) * 100);

  return (
    <div>
      <h2 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">Attendance</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {classes.map((c) => {
          const percent = Math.round((c.present / c.total) * 100);
          return (
            <div key={c.name} className="p-4 bg-white rounded-lg shadow-sm dark:bg-gray-800">
              <p className="text-sm text-gray-500 dark:text-gray-400">Class</p>
              <p className="text-xl font-semibold text-gray-800 dark:text-gray-200">{c.name}</p>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{c.present}/{c.total} present</p>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full mt-3 h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: `${percent}%` }} />
              </div>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">{percent}%</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="p-4 bg-white rounded-lg shadow dark:bg-gray-800">
          <p className="text-sm text-gray-500">Overall Attendance</p>
          <p className="text-2xl font-semibold text-gray-800 dark:text-gray-100">{overall}%</p>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full mt-3 h-3">
            <div className="bg-indigo-600 h-3 rounded-full" style={{ width: `${overall}%` }} />
          </div>
        </div>

        <div className="md:col-span-2 bg-white rounded-lg p-4 shadow dark:bg-gray-800">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200">Monthly Attendance</h3>
          <ul className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-300">
            {monthly.map((m) => {
              const pct = Math.round((m.present / m.total) * 100);
              return (
                <li key={m.month} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-800 dark:text-gray-200">{m.month}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{m.present}/{m.total} days</p>
                  </div>
                  <div className="w-1/2">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <div className="bg-green-500 h-3 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                  <div className="ml-3 text-sm text-gray-600 dark:text-gray-300">{pct}%</div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="bg-white rounded shadow p-4 dark:bg-gray-800">
        <h3 className="font-semibold text-gray-800 dark:text-gray-200">Recent Absent Days</h3>
        <ul className="mt-3 text-sm text-gray-600 dark:text-gray-300">
          {absentDays.map((d) => (
            <li key={d} className="py-1">{d}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}