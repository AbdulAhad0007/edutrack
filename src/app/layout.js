// src/app/layout.js
import { Inter } from 'next/font/google';
import './globals.css';
import AuthProvider from '@/providers/Authprovider';
import I18nProvider from '@/providers/I18nProvider';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'EduTrack - Student Management System',
  description: 'ERP-based integrated student management system',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Script id="theme-init" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: `
          (function() {
            try {
              var stored = localStorage.getItem('darkMode');
              if (stored === null) {
                localStorage.setItem('darkMode', 'false');
              } else if (stored === 'true') {
                document.documentElement.classList.add('dark');
              } else {
                document.documentElement.classList.remove('dark');
              }
            } catch (e) {}
          })();
        ` }} />
        <I18nProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </I18nProvider>
      </body>
    </html>
  );
}