'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from '../../../components/AdminSidebar';
import AdminNoticesManagement from '../../../components/AdminNoticesManagement';
import AdminMeetingsManagement from '../../../components/AdminMeetingsManagement';
import AdminSettings from '../../../components/AdminSettings';
import StudentManagement from '../../../components/StudentManagement';
import AttendanceManagement from '../../../components/AttendanceManagement';
import TimetableManagement from '../../../components/TimetableManagement';
import { toggleTheme } from '../../../lib/theme';
import { Sun, Moon } from 'lucide-react';

function TeacherForm({ onAddTeacher, onClose, initialUid, initialPassword }) {
  const [formData, setFormData] = useState({
    uid: initialUid || '',
    password: initialPassword || '',
    name: '',
    age: '',
    dob: '',
    address: '',
    department: '',
    experience: '',
    jobrole: '',
    profession: '',
    hobbies: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddTeacher(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-lg overflow-auto max-h-[90vh]">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Add Teacher</h2>
        <form onSubmit={handleSubmit} className="space-y-4 overflow-auto max-h-[70vh]">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">UID</label>
            <input name="uid" value={formData.uid} readOnly className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white px-3 py-2 cursor-not-allowed" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
            <input name="password" type="password" value={formData.password} readOnly className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white px-3 py-2 cursor-not-allowed" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
            <input name="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Age</label>
            <input name="age" type="number" value={formData.age} onChange={handleChange} required className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date of Birth</label>
            <input name="dob" type="date" value={formData.dob} onChange={handleChange} required className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Address</label>
            <input name="address" value={formData.address} onChange={handleChange} required className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Department</label>
            <input name="department" value={formData.department} onChange={handleChange} required className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Experience (years)</label>
            <input name="experience" type="number" value={formData.experience} onChange={handleChange} required className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Job Role</label>
            <input name="jobrole" value={formData.jobrole} onChange={handleChange} required className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Profession</label>
            <input name="profession" value={formData.profession} onChange={handleChange} required className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Hobbies</label>
            <input name="hobbies" value={formData.hobbies} onChange={handleChange} required className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2" />
          </div>
          <div className="flex justify-end space-x-4 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-white">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700">Add</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [teachers, setTeachers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [nextUid, setNextUid] = useState('');
  const [nextPassword, setNextPassword] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeModule, setActiveModule] = useState('dashboard');

  // Fetch teachers from Supabase API
  const fetchTeachers = async () => {
    try {
      const res = await fetch('/api/admin/teachers');
      if (res.ok) {
        const data = await res.json();
        setTeachers(data);
      } else {
        console.error('Failed to fetch teachers');
      }
    } catch (err) {
      console.error('Error fetching teachers:', err);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const convertToCSV = (data) => {
    if (data.length === 0) return '';
    const headers = ['id', 'uid', 'name', 'age', 'dob', 'address', 'department', 'experience', 'jobrole', 'profession', 'hobbies'];
    const csvRows = [headers.join(',')];
    data.forEach(row => {
      const values = headers.map(header => {
        const value = String(row[header] || '');
        // Escape quotes and wrap in quotes if contains comma, quote, or newline
        if (value.includes(',') || value.includes('"') || value.includes('\n')) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      });
      csvRows.push(values.join(','));
    });
    return csvRows.join('\n');
  };

  const downloadCSV = (csvContent, filename) => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleAddTeacher = async (teacher) => {
    try {
      // Use UID and password from form data
      const teacherWithCredentials = {
        ...teacher,
        age: Number(teacher.age),
        experience: Number(teacher.experience)
      };

      console.log('Adding teacher:', teacherWithCredentials);

      const res = await fetch('/api/admin/teachers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(teacherWithCredentials),
      });
      if (res.ok) {
        alert(`Teacher added with UID: ${teacher.uid} and Password: ${teacher.password}`);
        fetchTeachers();
        setShowAddForm(false);
      } else {
        const errorText = await res.text();
        console.error('Failed to add teacher', res.status, errorText);
        alert(`Failed to add teacher: ${errorText}`);
      }
    } catch (err) {
      console.error('Error adding teacher:', err);
      alert(`Error adding teacher: ${err.message}`);
    }
  };

  const calculateNextUid = () => {
    const tecTeachers = teachers.filter(t => t.uid && t.uid.startsWith('tec'));
    if (tecTeachers.length === 0) return 'tec001';

    const numbers = tecTeachers.map(t => {
      const numStr = t.uid.slice(3);
      return parseInt(numStr, 10) || 0;
    });
    const maxNum = Math.max(...numbers);
    const nextNum = maxNum + 1;
    return `tec${nextNum.toString().padStart(3, '0')}`;
  };

  const calculateNextPassword = () => {
    const nextUid = calculateNextUid();
    const numStr = nextUid.slice(3);
    const num = parseInt(numStr, 10);
    return `teacher${num}`;
  };

  const handleRemoveTeacher = async (id) => {
    try {
      const res = await fetch(`/api/admin/teachers?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchTeachers();
      } else {
        console.error('Failed to remove teacher');
        alert('Failed to remove teacher');
      }
    } catch (err) {
      console.error('Error removing teacher:', err);
      alert(`Error removing teacher: ${err.message}`);
    }
  };

  const filteredTeachers = teachers.filter((t) =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {/* <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
            </div> */}

            <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
              <input
                type="text"
                placeholder="Search teachers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-2 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white w-full sm:w-64"
              />
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                <button
                  onClick={() => {
                    const uid = calculateNextUid();
                    const password = calculateNextPassword();
                    setNextUid(uid);
                    setNextPassword(password);
                    setShowAddForm(true);
                  }}
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 w-full sm:w-auto text-sm"
                >
                  Add Teacher
                </button>
                <button
                  onClick={() => downloadCSV(convertToCSV(teachers), 'teachers.csv')}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 w-full sm:w-auto text-sm"
                >
                  Download CSV
                </button>
              </div>
            </div>

            {showAddForm && (
              <TeacherForm
                onAddTeacher={handleAddTeacher}
                onClose={() => setShowAddForm(false)}
                initialUid={nextUid}
                initialPassword={nextPassword}
              />
            )}

            {/* Mobile Card Layout */}
            <div className="block sm:hidden space-y-4">
              {filteredTeachers.map((teacher) => (
                <div key={teacher.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{teacher.name}</h3>
                      <button
                        onClick={() => handleRemoveTeacher(teacher.id)}
                        className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="font-medium text-gray-600 dark:text-gray-400">Age:</span>
                        <span className="ml-1 text-gray-900 dark:text-white">{teacher.age}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600 dark:text-gray-400">DOB:</span>
                        <span className="ml-1 text-gray-900 dark:text-white">{teacher.dob}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600 dark:text-gray-400">Department:</span>
                        <span className="ml-1 text-gray-900 dark:text-white">{teacher.department}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600 dark:text-gray-400">Experience:</span>
                        <span className="ml-1 text-gray-900 dark:text-white">{teacher.experience} years</span>
                      </div>
                      <div className="col-span-2">
                        <span className="font-medium text-gray-600 dark:text-gray-400">Job Role:</span>
                        <span className="ml-1 text-gray-900 dark:text-white">{teacher.jobrole}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="font-medium text-gray-600 dark:text-gray-400">Profession:</span>
                        <span className="ml-1 text-gray-900 dark:text-white">{teacher.profession}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="font-medium text-gray-600 dark:text-gray-400">Hobbies:</span>
                        <span className="ml-1 text-gray-900 dark:text-white">{teacher.hobbies}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table Layout */}
            <div className="hidden sm:block overflow-x-auto rounded border border-gray-300 dark:border-gray-600">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white dark:bg-gray-700">
                    <th className="border border-gray-300 dark:border-gray-600 px-3 sm:px-4 py-2 text-sm sm:text-base">Name</th>
                    <th className="border border-gray-300 dark:border-gray-600 px-3 sm:px-4 py-2 text-sm sm:text-base">Age</th>
                    <th className="border border-gray-300 dark:border-gray-600 px-3 sm:px-4 py-2 text-sm sm:text-base">DOB</th>
                    <th className="border border-gray-300 dark:border-gray-600 px-3 sm:px-4 py-2 text-sm sm:text-base">Department</th>
                    <th className="border border-gray-300 dark:border-gray-600 px-3 sm:px-4 py-2 text-sm sm:text-base">Experience</th>
                    <th className="border border-gray-300 dark:border-gray-600 px-3 sm:px-4 py-2 text-sm sm:text-base">Job Role</th>
                    <th className="border border-gray-300 dark:border-gray-600 px-3 sm:px-4 py-2 text-sm sm:text-base">Profession</th>
                    <th className="border border-gray-300 dark:border-gray-600 px-3 sm:px-4 py-2 text-sm sm:text-base">Hobbies</th>
                    <th className="border border-gray-300 dark:border-gray-600 px-3 sm:px-4 py-2 text-sm sm:text-base">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTeachers.map((teacher) => (
                    <tr key={teacher.id} className="bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700">
                      <td className="border border-gray-300 dark:border-gray-600 px-3 sm:px-4 py-2 text-sm sm:text-base">{teacher.name}</td>
                      <td className="border border-gray-300 dark:border-gray-600 px-3 sm:px-4 py-2 text-sm sm:text-base">{teacher.age}</td>
                      <td className="border border-gray-300 dark:border-gray-600 px-3 sm:px-4 py-2 text-sm sm:text-base">{teacher.dob}</td>
                      <td className="border border-gray-300 dark:border-gray-600 px-3 sm:px-4 py-2 text-sm sm:text-base">{teacher.department}</td>
                      <td className="border border-gray-300 dark:border-gray-600 px-3 sm:px-4 py-2 text-sm sm:text-base">{teacher.experience}</td>
                      <td className="border border-gray-300 dark:border-gray-600 px-3 sm:px-4 py-2 text-sm sm:text-base">{teacher.jobrole}</td>
                      <td className="border border-gray-300 dark:border-gray-600 px-3 sm:px-4 py-2 text-sm sm:text-base">{teacher.profession}</td>
                      <td className="border border-gray-300 dark:border-gray-600 px-3 sm:px-4 py-2 text-sm sm:text-base">{teacher.hobbies}</td>
                      <td className="border border-gray-300 dark:border-gray-600 px-3 sm:px-4 py-2 text-sm sm:text-base">
                        <button
                          onClick={() => handleRemoveTeacher(teacher.id)}
                          className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredTeachers.length === 0 && (
                    <tr>
                      <td colSpan="9" className="text-center py-4 text-gray-500 dark:text-gray-400">
                        No teachers found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'teachers':
        return <StudentManagement />;
      case 'students':
        return <StudentManagement />;
      case 'timetable':
        return <TimetableManagement />;
      case 'notices':
        return <AdminNoticesManagement />;
      case 'meetings':
        return <AdminMeetingsManagement />;
      case 'settings':
        return <AdminSettings />;
      default:
        return <div>Module not found</div>;
    }
  };

  return (
    <div className="flex min-h-screen ">
      <AdminSidebar
        activeModule={activeModule}
        setActiveModule={setActiveModule}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <main className="flex-1 p-4 sm:p-6 lg:ml-0">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
              aria-label="Toggle theme"
            >
              <Sun className="w-5 h-5 hidden dark:block" />
              <Moon className="w-5 h-5 block dark:hidden" />
            </button>
            <button
              className="lg:hidden px-3 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle sidebar"
            >
              ☰
            </button>
          </div>
        </div>

        {renderActiveModule()}
      </main>
    </div>
  );
}
