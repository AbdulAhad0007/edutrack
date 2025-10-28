'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import i18n from '@/lib/i18n';

export default function ContactPage() {
  const { t } = useTranslation();
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('en');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isDark = localStorage.getItem('darkMode') === 'true';
      setDarkMode(isDark);
      if (isDark) document.documentElement.classList.add('dark');
      setCurrentLang(i18n.language || 'en');
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm" style={{ backgroundColor: 'var(--card)', color: 'var(--text)' }}>
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-xl font-bold text-gray-800 dark:text-white">EduTrack</div>
          <nav className="space-x-6 hidden md:flex items-center">
            <Link href="/" className="text-gray-700 dark:text-gray-200">{t('Home')}</Link>
            <Link href="/contact" className="text-gray-700 dark:text-gray-200">{t('Contact Us')}</Link>
<<<<<<< HEAD
=======
            <Link href="/auth/email" className="text-gray-700 dark:text-gray-200">{t('Sign In')}</Link>
>>>>>>> e72ad566b79fdad6a6790dcdbf09158b3490aec0

            <button
              onClick={() => {
                const isDark = document.documentElement.classList.toggle('dark');
                try { localStorage.setItem('darkMode', isDark.toString()); } catch (e) {}
                setDarkMode(isDark);
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
          {menuOpen && (
            <div className="md:hidden bg-white/90 dark:bg-gray-900/90">
              <div className="px-6 pb-4 space-y-2">
                <Link href="/" onClick={() => setMenuOpen(false)} className="block text-gray-700 dark:text-gray-200">{t('Home')}</Link>
                <Link href="/contact" onClick={() => setMenuOpen(false)} className="block text-gray-700 dark:text-gray-200">{t('Contact Us')}</Link>
<<<<<<< HEAD
=======
                <Link href="/auth/email" onClick={() => setMenuOpen(false)} className="block text-gray-700 dark:text-gray-200">{t('Sign In')}</Link>
>>>>>>> e72ad566b79fdad6a6790dcdbf09158b3490aec0
                <button onClick={() => { const isDark = document.documentElement.classList.toggle('dark'); try { localStorage.setItem('darkMode', isDark.toString()); } catch (e) {} setDarkMode(isDark); setMenuOpen(false); }} className="block text-gray-700 dark:text-gray-200">{t('Toggle Light / Dark')}</button>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">{t('Sunderdeep World School')}</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">{t('Sunderdeep World School is committed to academic excellence and holistic development. We provide a nurturing environment where every student can grow.')}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-white rounded shadow dark:bg-gray-800">
                <h3 className="font-semibold text-gray-800 dark:text-gray-100">{t('Address')}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{t('SDEC Dasna , Ghaziabad, UP')}</p>
              </div>

              <div className="p-4 bg-white rounded shadow dark:bg-gray-800">
                <h3 className="font-semibold text-gray-800 dark:text-gray-100">{t('Contact')}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{t('Email: info@sunderdeepworld.edu')}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">{t('Phone: +91 76467 98373')}</p>
              </div>
            </div>

            <div className="bg-white rounded shadow p-6 dark:bg-gray-800">
              <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-3">{t('Get in touch')}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{t('Fill out the feedback form to contact our admissions or support team, or use the details above to reach us directly.')}</p>
              <Link href="/auth/email" className="inline-block px-4 py-2 bg-indigo-600 text-white rounded">{t('Sign In')}</Link>
            </div>
          </div>

          <aside className="bg-white rounded shadow p-6 dark:bg-gray-800">
            <h3 className="font-semibold text-gray-800 dark:text-gray-100">{t('Office Hours')}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">{t('Mon - Fri: 8:00 AM - 4:00 PM')}</p>
            <h4 className="mt-4 font-semibold text-gray-800 dark:text-gray-100">{t('Quick Links')}</h4>
            <ul className="mt-2 text-sm text-gray-600 dark:text-gray-300 space-y-2">
              <li><Link href="/">{t('Home')}</Link></li>
              <li><Link href="/contact">{t('Contact Us')}</Link></li>
              <li><Link href="/auth/email">{t('Sign In')}</Link></li>
            </ul>
          </aside>
        </div>
      </main>

      <footer className="bg-gray-900 text-gray-500">
        <div className="container mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-bold text-lg">{t('Sunderdeep World School')}</h4>
            <p className="text-sm mt-2 text-gray-300">{t('SDEC Dasna , Ghaziabad, UP — providing quality education since 1995.')}</p>
          </div>

          <div>
            <h4 className="font-semibold">{t('Contact')}</h4>
            <ul className="mt-3 space-y-2 text-sm text-gray-300">
              <li>{t('Email: info@sunderdeepworld.edu')}</li>
              <li>{t('Phone: +91 87786 89345')}</li>
              <li>{t('Fax: +91 9015378337')}</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold">{t('Resources')}</h4>
            <ul className="mt-3 space-y-2 text-sm text-gray-300">
              <li><a href="#">{t('Admissions')}</a></li>
              <li><a href="#">{t('Academics')}</a></li>
              <li><a href="#">{t('Careers')}</a></li>
            </ul>
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
          <div>© {new Date().getFullYear()} Sunderdeep World School. {t('All rights reserved.')}</div>
        </div>
      </footer>
    </div>
  );
}
