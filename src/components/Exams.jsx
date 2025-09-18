'use client';

// src/components/Exams.jsx
import React from 'react';

export default function Exams({ student }) {
  const upcoming = [
    { subject: 'Math', date: '2025-10-01', time: '09:00' },
    { subject: 'Physics', date: '2025-10-03', time: '09:00' },
    { subject: 'English', date: '2025-10-05', time: '11:00' },
  ];

  const results = [
    { name: 'Alice Johnson', subject: 'Math', marks: 92 },
    { name: 'Bob Smith', subject: 'Math', marks: 78 },
  ];



  return (
    <div>
      <h2 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">Exams</h2>

      <section className="mb-6">
        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Upcoming Exams</h3>
        <ul className="mt-3 grid gap-3 md:grid-cols-3">
          {upcoming.map((e) => (
            <li key={e.subject} className="p-4 bg-white rounded shadow-sm dark:bg-gray-800">
              <p className="font-semibold">{e.subject}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{e.date} • {e.time}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Admit Card</h3>
        <button
          className="px-4 py-2 font-semibold text-white bg-purple-600 rounded hover:bg-purple-700"
        >
          Download Admit Card
        </button>
      </section>

      <section>
        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Recent Results</h3>
        <div className="mt-3 bg-white rounded shadow overflow-x-auto dark:bg-gray-800">
          <table className="w-full text-sm text-left text-gray-600 dark:text-gray-300">
            <thead className="text-xs uppercase text-gray-500 border-b dark:border-gray-700">
              <tr>
                <th className="py-2 px-3">Student</th>
                <th className="py-2 px-3">Subject</th>
                <th className="py-2 px-3">Marks</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r, i) => (
                <tr key={i} className="border-b dark:border-gray-700">
                  <td className="py-2 px-3">{r.name}</td>
                  <td className="py-2 px-3">{r.subject}</td>
                  <td className="py-2 px-3">{r.marks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
