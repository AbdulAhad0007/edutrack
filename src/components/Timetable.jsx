<<<<<<< HEAD
// src/components/TimetableUpdated.jsx
'use client';

import { useState, useEffect } from 'react';

export default function Timetable({ student }) {
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTimetable = async () => {
      if (!student?.class) {
        console.log('No student class information available');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        console.log('Fetching timetable for student:', student);

        // Use student.class and student.section directly
        const className = student.class;
        const section = student.section || '';

        const params = new URLSearchParams({
          class: className,
          ...(section && { section })
        });

        console.log('Timetable API params:', params.toString());

        const response = await fetch(`/api/student/timetable?${params}`);

        if (!response.ok) {
          console.error('Timetable API error:', response.status, response.statusText);
          throw new Error(`Failed to fetch timetable: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Timetable API response:', data);

        // Transform API data to match the expected format
        const transformedTimetable = data.timetable.map(entry => ({
          day: entry.day_of_week,
          subject: entry.subject,
          time: `${entry.start_time} - ${entry.end_time}`,
          teacher: entry.teacher_name,
          room: entry.room_number || 'N/A'
        }));

        setTimetable(transformedTimetable);
      } catch (err) {
        console.error('Error fetching timetable:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTimetable();
  }, [student?.class, student?.section]);

  if (loading) {
    return (
      <div>
        <h2 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">Timetable</h2>
        <div className="bg-white rounded shadow p-4 dark:bg-gray-800">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h2 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">Timetable</h2>
        <div className="bg-white rounded shadow p-4 dark:bg-gray-800">
          <div className="text-center py-8">
            <p className="text-red-600 dark:text-red-400">Error loading timetable: {error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const schedule = timetable;
=======
// src/components/Timetable.jsx
export default function Timetable({ student }) {
  // Timetables based on class
  const timetables = {
    '10-A': [
      { day: 'Monday', subject: 'Math', time: '9:00 - 10:00', teacher: 'Mrs. Clara', room: 'A-101' },
      { day: 'Tuesday', subject: 'English', time: '10:00 - 11:00', teacher: 'Mr. John', room: 'B-202' },
      { day: 'Wednesday', subject: 'Science', time: '11:00 - 12:00', teacher: 'Dr. Smith', room: 'C-303' },
      { day: 'Thursday', subject: 'History', time: '9:00 - 10:00', teacher: 'Ms. Rose', room: 'A-102' },
      { day: 'Friday', subject: 'Computer', time: '1:00 - 2:00', teacher: 'Mr. Doe', room: 'Lab-1' },
    ],
    '9-B': [
      { day: 'Monday', subject: 'Science', time: '9:00 - 10:00', teacher: 'Dr. Smith', room: 'C-303' },
      { day: 'Tuesday', subject: 'Math', time: '10:00 - 11:00', teacher: 'Mrs. Clara', room: 'A-101' },
      { day: 'Wednesday', subject: 'English', time: '11:00 - 12:00', teacher: 'Mr. John', room: 'B-202' },
      { day: 'Thursday', subject: 'Computer', time: '9:00 - 10:00', teacher: 'Mr. Doe', room: 'Lab-1' },
      { day: 'Friday', subject: 'History', time: '1:00 - 2:00', teacher: 'Ms. Rose', room: 'A-102' },
    ],
    '11-C': [
      { day: 'Monday', subject: 'English', time: '9:00 - 10:00', teacher: 'Mr. John', room: 'B-202' },
      { day: 'Tuesday', subject: 'Science', time: '10:00 - 11:00', teacher: 'Dr. Smith', room: 'C-303' },
      { day: 'Wednesday', subject: 'Math', time: '11:00 - 12:00', teacher: 'Mrs. Clara', room: 'A-101' },
      { day: 'Thursday', subject: 'Computer', time: '9:00 - 10:00', teacher: 'Mr. Doe', room: 'Lab-1' },
      { day: 'Friday', subject: 'History', time: '1:00 - 2:00', teacher: 'Ms. Rose', room: 'A-102' },
    ],
    '12-B': [
      { day: 'Monday', subject: 'History', time: '9:00 - 10:00', teacher: 'Ms. Rose', room: 'A-102' },
      { day: 'Tuesday', subject: 'Computer', time: '10:00 - 11:00', teacher: 'Mr. Doe', room: 'Lab-1' },
      { day: 'Wednesday', subject: 'Math', time: '11:00 - 12:00', teacher: 'Mrs. Clara', room: 'A-101' },
      { day: 'Thursday', subject: 'English', time: '9:00 - 10:00', teacher: 'Mr. John', room: 'B-202' },
      { day: 'Friday', subject: 'Science', time: '1:00 - 2:00', teacher: 'Dr. Smith', room: 'C-303' },
    ],
    '8-A': [
      { day: 'Monday', subject: 'Math', time: '9:00 - 10:00', teacher: 'Mrs. Clara', room: 'A-101' },
      { day: 'Tuesday', subject: 'English', time: '10:00 - 11:00', teacher: 'Mr. John', room: 'B-202' },
      { day: 'Wednesday', subject: 'Science', time: '11:00 - 12:00', teacher: 'Dr. Smith', room: 'C-303' },
      { day: 'Thursday', subject: 'History', time: '9:00 - 10:00', teacher: 'Ms. Rose', room: 'A-102' },
      { day: 'Friday', subject: 'Computer', time: '1:00 - 2:00', teacher: 'Mr. Doe', room: 'Lab-1' },
    ],
  };

  const schedule = student?.class ? timetables[student.class] || [] : [];
>>>>>>> e72ad566b79fdad6a6790dcdbf09158b3490aec0

  return (
    <div>
      <h2 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">Timetable</h2>
      <div className="bg-white rounded shadow p-4 dark:bg-gray-800">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-600 dark:text-gray-300">
            <thead className="text-xs uppercase text-gray-500 bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-2">Day</th>
                <th className="px-4 py-2">Subject</th>
                <th className="px-4 py-2">Time</th>
                <th className="px-4 py-2">Teacher</th>
                <th className="px-4 py-2">Room</th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((s, idx) => (
                <tr key={idx} className="border-b dark:border-gray-700">
                  <td className="px-4 py-2">{s.day}</td>
                  <td className="px-4 py-2">{s.subject}</td>
                  <td className="px-4 py-2">{s.time}</td>
                  <td className="px-4 py-2">{s.teacher}</td>
                  <td className="px-4 py-2">{s.room}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
<<<<<<< HEAD
        {schedule.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">No timetable data available</p>
          </div>
        )}
=======
>>>>>>> e72ad566b79fdad6a6790dcdbf09158b3490aec0
      </div>
    </div>
  );
}
<<<<<<< HEAD
=======


>>>>>>> e72ad566b79fdad6a6790dcdbf09158b3490aec0
