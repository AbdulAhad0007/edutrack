'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

export default function CalendarWidget() {
  const { data: session } = useSession();
  const userId = session?.user?.id || 'default';

  // Static holidays
  const holidays = [
    new Date(2024, 0, 1),
    new Date(2024, 0, 26),
    new Date(2024, 2, 29),
    new Date(2024, 3, 14),
    new Date(2024, 4, 1),
    new Date(2024, 7, 15),
    new Date(2024, 9, 2),
    new Date(2024, 10, 12),
    new Date(2024, 11, 25),
  ];

  const [attendanceData, setAttendanceData] = useState({});

  useEffect(() => {
    const mockAttendance = {};
    const currentYear = new Date().getFullYear();
    for (let month = 0; month < 12; month++) {
      const daysInMonth = new Date(currentYear, month + 1, 0).getDate();
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(currentYear, month, day);
        mockAttendance[date.toDateString()] =
          Math.random() > 0.2 ? 'present' : 'absent';
      }
    }
    setAttendanceData(mockAttendance);
  }, [userId]);

  const todayStr = new Date().toDateString();

  const getTileClassName = ({ date, view }) => {
    if (view === 'month') {
      const dateStr = date.toDateString();

      if (dateStr === todayStr) return 'today';
      if (holidays.some((h) => h.toDateString() === dateStr)) return 'holiday';

      const status = attendanceData[dateStr];
      if (status === 'present') return 'present';
      if (status === 'absent') return 'absent';
      return null;
    }
    return null;
  };

  const [currentMonth, setCurrentMonth] = useState(new Date());

  return (
    <div className="rounded-lg p-6 shadow dark:bg-gray-900 bg-gray-800">
      <h3 className="text-lg font-medium text-gray-200 mb-4">Attendance Calendar</h3>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-yellow-400 rounded mr-2"></div>
          <span className="text-sm text-gray-300">Holiday</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-400 rounded mr-2"></div>
          <span className="text-sm text-gray-300">Present</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-400 rounded mr-2"></div>
          <span className="text-sm text-gray-300">Absent</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-blue-400 rounded mr-2"></div>
          <span className="text-sm text-gray-300">Today</span>
        </div>
      </div>

      <Calendar
        value={currentMonth}
        onChange={setCurrentMonth}
        tileClassName={getTileClassName}
        showNavigation={true}
        showNeighboringMonth={false}
        className="w-full bg-gray-800 text-gray-950 rounded-lg"
      />

      <style jsx>{`
        .react-calendar {
          background-color: #1f2937 !important;
          color: #e5e7eb !important;
          border: none;
          border-radius: 0.5rem;
          padding: 0.5rem;
        }
        .react-calendar__navigation {
          background-color: #111827 !important;
          color: #f9fafb !important;
          border-radius: 0.5rem;
          margin-bottom: 0.5rem;
        }
        .react-calendar__navigation button {
          color: #f9fafb !important;
        }
        .react-calendar__month-view__weekdays {
          background-color: #111827 !important;
          color: #9ca3af !important;
          text-transform: uppercase;
        }
        .react-calendar__tile {
          background-color: transparent !important;
          color: #d1d5db !important;
          border-radius: 0.375rem;
        }
        .react-calendar__tile:enabled:hover,
        .react-calendar__tile:enabled:focus {
          background-color: #374151 !important;
        }
        /* Highlight Today */
        .react-calendar__tile.today {
          background-color: #3b82f6 !important; /* blue */
          color: #1e3a8a !important;
          font-weight: bold !important;
        }
        /* Holidays */
        .react-calendar__tile.holiday {
          background-color: yellow !important; /* yellow */
          color: yellow !important;
        }
        /* Present */
        .react-calendar__tile.present {
          background-color: green !important; /* green */
          color: green !important;
        }
        /* Absent */
        .react-calendar__tile.absent {
          background-color: #ef4444 !important; /* red */
          color: #7f1d1d !important;
        }
      `}</style>
    </div>
  );
}
