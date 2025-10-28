'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { toggleTheme } from '../../../lib/theme';
import { Sun, Moon } from 'lucide-react';
import Link from 'next/link';

export default function EmailAuth() {
  const router = useRouter();
  const [uid, setUid] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const adminCredentials = {
    uid: 'admin@edutrack',
    password: 'admin123',
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Check admin credentials
    if (uid === adminCredentials.uid && password === adminCredentials.password) {
      localStorage.setItem('isAdminLoggedIn', 'true');
      router.push('/admin/dashboard');
      setIsLoading(false);
      return;
    }

    // Use NextAuth for teacher/student authentication
    try {
      console.log('Attempting NextAuth login for UID:', uid);

      const result = await signIn('credentials', {
        uniqueId: uid,
        password: password,
        redirect: false,
      });

      console.log('NextAuth result:', result);

      if (result?.error) {
        console.error('NextAuth error:', result.error);
        setError('Invalid credentials. Please check your UID and password.');
      } else if (result?.ok) {
        console.log('NextAuth login successful');

        // Get user session to determine role
        const response = await fetch('/api/auth/session');
        const session = await response.json();

        console.log('User session:', session);

        if (session?.user) {
          const userRole = session.user.role;
          const userId = session.user.id || uid;

          if (userRole === 'teacher') {
            localStorage.setItem('teacherUid', userId);
            router.push(`/erp/${userId}`);
          } else if (userRole === 'student') {
            localStorage.setItem('studentUid', userId);
            router.push(`/erp/${userId}`);
          } else {
            setError('Invalid role assigned to user');
          }
        } else {
          setError('Failed to get user session');
        }
      }
    } catch (err) {
      console.error('Unexpected error during login:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen ">
      {/* Navbar */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">EduTrack</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-gray-900 dark:text-white hover:text-indigo-600">Home</Link>
              <button
                onClick={toggleTheme}
                className="p-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                aria-label="Toggle theme"
              >
                <Sun className="w-5 h-5 hidden dark:block" />
                <Moon className="w-5 h-5 block dark:hidden" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Sign In Form */}
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white text-center">Sign In</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <p className="text-red-600 text-center">{error}</p>}
          <div>
            <label htmlFor="uid" className="block text-sm font-medium text-gray-800 dark:text-gray-400">User ID</label>
            <input
              id="uid"
              type="text"
              value={uid}
              onChange={(e) => setUid(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Enter your User ID"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-800 dark:text-gray-400">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        </div>
      </div>
    </div>
  );
}