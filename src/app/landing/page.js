// src/app/landing/page.js
'use client';
import { useState, useEffect } from 'react';
import { toggleTheme, getStoredTheme } from '@/lib/theme';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useTranslation } from 'react-i18next';
import i18n from '@/lib/i18n';

export default function LandingPage() {
  const { t } = useTranslation();
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('en');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isDark = getStoredTheme();
      setDarkMode(isDark);
      if (isDark) document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
      setCurrentLang(i18n.language || 'en');
    }
  }, []);
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg)' }}>
      <header className="backdrop-blur-sm" style={{ backgroundColor: 'var(--card)', color: 'var(--text)' }}>
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-xl font-bold" style={{ color: 'var(--text)' }}>EduTrack</div>
            <nav className="space-x-6 hidden md:flex items-center">
              <Link href="/" style={{ color: 'var(--text)' }}>{t('Home')}</Link>
              <Link href="/contact" style={{ color: 'var(--text)' }}>{t('Contact Us')}</Link>
              <Link href="/auth/email" style={{ color: 'var(--text)' }}>{t('Sign In')}</Link>
              <button
                onClick={() => {
                  const isDark = toggleTheme();
                  setDarkMode(!!isDark);
                }}
                aria-label="Toggle color mode"
                className="ml-4 p-1 rounded-md bg-gray-100 dark:bg-gray-800"
              >
                {darkMode ? (
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
        </div>
        {menuOpen && (
          <div className="md:hidden" style={{ backgroundColor: 'var(--card)' }}>
            <div className="px-6 pb-4 space-y-2">
              <a href="/" onClick={() => setMenuOpen(false)} className="block text-gray-700 dark:text-gray-200">{t('Home')}</a>
              <a href="/contact" onClick={() => setMenuOpen(false)} className="block text-gray-700 dark:text-gray-200">{t('Contact Us')}</a>
              <a href="/auth/email" onClick={() => setMenuOpen(false)} className="block text-gray-700 dark:text-gray-200">{t('Sign In')}</a>
              {/* Theme toggle inside mobile menu */}
              <button
                onClick={() => { const isDark = toggleTheme(); setDarkMode(!!isDark); setMenuOpen(false); }}
                aria-label="Toggle color mode"
                className="w-full text-left text-gray-700 dark:text-gray-200"
              >
                {darkMode ? (
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
      </header>

      <main className="flex-1">
        <div className="container mx-auto px-6 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-6">
             {t('EduTrack - Student Management System')}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto">
              {t('An ERP-based integrated platform for managing student information, attendance, grades, and more.')}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/auth/email"
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                {t('Sign In with ID / Password')}
              </Link>
            </div>
          </div>
        </div>

        <section id="features" className="container mx-auto px-6 py-12">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 text-center mb-6">{t('Key Features')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-white rounded-lg shadow-sm dark:bg-gray-800">
                <h3 className="font-semibold text-lg">{t('Attendance Tracking')}</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{t('Monitor attendance easily with daily & monthly reports.')}</p>
              </div>
              <div className="p-6 bg-white rounded-lg shadow-sm dark:bg-gray-800">
                <h3 className="font-semibold text-lg">{t('Multilingual Support')}</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{t('Easily switch languages for a personalized experience.')}</p>
              </div>
              <div className="p-6 bg-white rounded-lg shadow-sm dark:bg-gray-800">
                <h3 className="font-semibold text-lg">{t('Marks & Grades')}</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{t('Record marks, calculate grades and generate transcripts.')}</p>
              </div>
              <div className="p-6 bg-white rounded-lg shadow-sm dark:bg-gray-800">
                <h3 className="font-semibold text-lg">{t('Timetable & Exams')}</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{t('Create timetables and manage exam schedules and results.')}</p>
              </div>
              <div className="p-6 bg-white rounded-lg shadow-sm dark:bg-gray-800">
                <h3 className="font-semibold text-lg">{t('Fees Management')}</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{t('Manage student fees, payments, and financial records.')}</p>
              </div>
              <div className="p-6 bg-white rounded-lg shadow-sm dark:bg-gray-800">
                <h3 className="font-semibold text-lg">{t('Analytics')}</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{t('Generate insights and reports on student performance and trends.')}</p>
              </div>
        
            </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-gray-100" style={{ backgroundColor: 'var(--card)', color: 'var(--text)' }}>
        <div className="container mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-bold text-lg" style={{ color: 'var(--text)' }}>EduTrack</h4>
            <p className="text-sm mt-2" style={{ color: 'var(--muted)' }}>{t('All-in-one ERP for schools — attendance, marks, timetables, fees and analytics.')}</p>
          </div>

          <div>
            <h4 className="font-semibold">{t('Quick Links')}</h4>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              <li><a href="#features">{t('Features')}</a></li>
              <li><a href="#pricing">{t('Sign In')}</a></li>
              <li><a href="/contact">{t('Contact Us')}</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold">{t('Get the App')}</h4>
            <p className="text-sm text-gray-600 mt-2">{t('Download our mobile app')}</p>
            <div className="flex items-center gap-3 mt-4">
              <a href="https://drive.google.com/uc?export=download&id=1gbU3xuA3FGe_SVdrXVQxBmjXY-83srAV
" download className="inline-block">
                <img src="/playstore-badge.png" alt="Get it on Google Play" className="h-12" />
              </a>
              <a href="https://drive.google.com/uc?export=download&id=1gbU3xuA3FGe_SVdrXVQxBmjXY-83srAV
" className="inline-block">
                <img src="/appstore-badge.png" alt="Download on the App Store" className="h-12" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800/60 py-4 flex flex-col items-center text-sm text-gray-400">
          <div className="mb-2">
            <label htmlFor="lang-select" className="mr-2">{t('Language:')}</label>
            <select
              id="lang-select"
              value={currentLang}
              onChange={(e) => {
                const lang = e.target.value;
                i18n.changeLanguage(lang);
                setCurrentLang(lang);
                localStorage.setItem('i18nextLng', lang);
              }}
              className="bg-gray-800 text-gray-200 border border-gray-600 rounded px-2 py-1"
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
              <option value="ta">தமிழ்</option>
              <option value="es">Español</option>
            </select>
          </div>
          <div>© {new Date().getFullYear()} EduTrack. {t('All rights reserved.')}</div>
        </div>
      </footer>
    </div>
  );
}