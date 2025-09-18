"use client";

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useTranslation } from 'react-i18next';


export default function EmailAuth() {
  const { t } = useTranslation();
  const [uniqueId, setUniqueId] = useState('');
  const [password, setPassword] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await signIn('credentials', { redirect: false, uniqueId: uniqueId.trim(), password });
      if (res?.error) {
        setError(res.error || 'Invalid credentials');
        return;
      }
      router.push(`/erp/${encodeURIComponent(uniqueId.trim())}`);
    } catch (err) {
      setError(err?.message || 'An error occurred');
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--bg)' }}>
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-xl font-bold text-gray-800 dark:text-white">EduTrack</div>
          <nav className="space-x-6 hidden md:flex items-center">
            <a href="/" className="text-gray-700 dark:text-gray-200">Home</a>
<a href="/contact" className="text-gray-700 dark:text-gray-200">Contact Us</a>
            <button
              onClick={() => {
                const isDark = document.documentElement.classList.toggle('dark');
                try {
                  localStorage.setItem('darkMode', isDark.toString());
                } catch (e) {}
                setMenuOpen(false);
              }}
              aria-label="Toggle color mode"
              className="ml-4 p-1 rounded-md bg-gray-100 dark:bg-gray-800"
            >
              {document.documentElement.classList.contains('dark') ? (
                <svg className="w-5 h-5 text-yellow-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 3v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 19v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4.2 4.2l1.4 1.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M18.4 18.4l1.4 1.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M1 12h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21 12h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4.2 19.8l1.4-1.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M18.4 5.6l1.4-1.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <svg className="w-5 h-5 text-gray-700" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
          </nav>
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden ml-3 p-2 rounded-md bg-gray-100 dark:bg-gray-800" aria-label="Toggle menu">
            {menuOpen ? (
              <svg className="w-6 h-6 text-gray-700 dark:text-gray-200" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            ) : (
              <svg className="w-6 h-6 text-gray-700 dark:text-gray-200" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            )}
          </button>
          {menuOpen && (
            <div className="md:hidden bg-white/90 dark:bg-gray-900/90">
              <div className="px-6 pb-4 space-y-2">
                <a href="/" onClick={() => setMenuOpen(false)} className="block text-gray-700 dark:text-gray-200">Home</a>
                <a href="/contact" onClick={() => setMenuOpen(false)} className="block text-gray-700 dark:text-gray-200">Contact Us</a>
                <button
                  onClick={() => {
                    const isDark = document.documentElement.classList.toggle('dark');
                    try {
                      localStorage.setItem('darkMode', isDark.toString());
                    } catch (e) {}
                    setMenuOpen(false);
                  }}
                  aria-label="Toggle color mode"
                  className="block text-gray-700 dark:text-gray-200"
                >
                  {document.documentElement.classList.contains('dark') ? (
                    <svg className="w-5 h-5 text-yellow-400 inline" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 3v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 19v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M4.2 4.2l1.4 1.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M18.4 18.4l1.4 1.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M1 12h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M21 12h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M4.2 19.8l1.4-1.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M18.4 5.6l1.4-1.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-gray-700 inline" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br  dark:from-gray-900/60 dark:to-gray-800/30 backdrop-blur-sm py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="bg-white dark:bg-gray-800/40 border rounded-2xl p-8 shadow-lg backdrop-blur-md">
          <h2 className="text-center text-3xl font-extrabold text-gray-900 dark:text-white mb-2">{t('Sign In')}</h2>
          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-6">{t('Enter your unique ID and password')}</p>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-200">Unique ID</label>
              <input value={uniqueId} onChange={(e) => setUniqueId(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white/60 dark:bg-gray-700/60 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 dark:text-white focus:outline-none" placeholder="e.g. UID001" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-200">Password</label>
              <input value={password} onChange={(e) => setPassword(e.target.value)} required type="password" className="mt-1 block w-full px-3 py-2 bg-white/60 dark:bg-gray-700/60 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 dark:text-white focus:outline-none" placeholder="Password" />
            </div>

            <div>
              <button type="submit" className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">{t('Sign In')}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
  );
}
