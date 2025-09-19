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
    { subject: 'Math', total: 100, marks: 92 },
    { subject: 'English', total: 100, marks: 78 },
     { subject: 'Hindi', total: 100, marks: 87 },
      { subject: 'Computer', total: 100, marks: 50 }
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
          onClick={() => {
            const content = `
              <html>
                <head>
                  <title>Admit Card</title>
                  <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    h1 { text-align: center; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th, td { border: 1px solid #000; padding: 8px; text-align: left; }
                  </style>
                </head>
                <body>
                  <h1>Sunderdeep World School</h1>
                  <p><strong>Name:</strong> ${student?.name || ''}</p>
          <p><strong>Roll No:</strong> ${student?.rollNo || Math.floor(Math.random() * 9000) + 1000}</p>
          <p><strong>Class:</strong> ${student?.className || '10-A'}</p>
                  <h2>Subjects and Timings</h2>
                  <table>
                    <thead>
                      <tr><th>Subject</th><th>Date</th><th>Time</th></tr>
                    </thead>
                    <tbody>
                      ${upcoming.map(e => `
                        <tr>
                          <td>${e.subject}</td>
                          <td>${e.date}</td>
                          <td>${e.time}</td>
                        </tr>
                      `).join('')}
                    </tbody>
                  </table>
                </body>
              </html>
            `;
            const newWindow = window.open('', '_blank', 'width=800,height=600');
            if (newWindow) {
              newWindow.document.write(content);
              newWindow.document.close();
              newWindow.focus();
              newWindow.print();
              // Do not close immediately to allow user to see/print
              // newWindow.close();
            } else {
              alert('Popup blocked. Please allow popups for this website.');
            }
          }}
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
                <th className="py-2 px-3">Subject</th>
                <th className="py-2 px-3">Total</th>
                <th className="py-2 px-3">Marks</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r, i) => (
                <tr key={i} className="border-b dark:border-gray-700">
                  <td className="py-2 px-3">{r.subject}</td>
                  <td className="py-2 px-3">{r.total}</td>
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
