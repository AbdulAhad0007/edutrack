// src/app/api/auth/[...nextauth]/route.js
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
// import GoogleProvider from 'next-auth/providers/google';
import admin from 'firebase-admin';

// Mock user data (10 pre-saved unique IDs/passwords). Replace with your real user store in production.
const users = [
  { id: 'UID001', email: 'student01@school.edu', password: 'password1', name: 'Rashad Nabeel', role: 'student' },
  { id: 'UID002', email: 'student02@school.edu', password: 'password2', name: 'Abdul Ahad', role: 'student' },
  { id: 'UID003', email: 'student03@school.edu', password: 'password3', name: 'Nishant', role: 'student' },
  { id: 'UID004', email: 'student04@school.edu', password: 'password4', name: 'Pushpender Bharti', role: 'student' },
  { id: 'UID005', email: 'student05@school.edu', password: 'password5', name: 'Raja Tyagi', role: 'student' },
  { id: 'UID006', email: 'student06@school.edu', password: 'password6', name: 'Kakashi Hatake', role: 'student' },
  { id: 'UID007', email: 'student07@school.edu', password: 'password7', name: 'Itachi Qureshi', role: 'student' },
  { id: 'UID008', email: 'student08@school.edu', password: 'password8', name: 'GanSung Lee', role: 'student' },
  { id: 'UID009', email: 'student09@school.edu', password: 'password9', name: 'Kisa Zaidi', role: 'student' },
  { id: 'UID010', email: 'student10@school.edu', password: 'password10', name: 'Matlum Ali', role: 'student' },
];

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        uniqueId: { label: 'Unique ID', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // Allow server-side token verification path if needed
        if (credentials?.token) {
          try {
            if (!admin.apps.length) {
              admin.initializeApp();
            }
            const decoded = await admin.auth().verifyIdToken(credentials.token);
            return { id: decoded.uid, email: decoded.email, name: decoded.name || decoded.email, role: 'student' };
          } catch (err) {
            console.error('Failed to verify Firebase ID token', err);
            return null;
          }
        }

        // Fallback to mock uniqueId/password lookup
        if (!credentials?.uniqueId || !credentials?.password) throw new Error('Invalid Credentials');

        const user = users.find((user) => user.id === credentials.uniqueId);
        if (user && user.password === credentials.password && user.role === 'student') {
          return { id: user.id, email: user.email, name: user.name, role: user.role };
        }

        // Deny access for non-students or invalid credentials
        throw new Error('Invalid Credentials');
      }
    })
    ,
    // Removed GoogleProvider for this ERP - only credentials provider will be used
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (token) {
        session.user.id = token.sub;
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  }
};

let handler;
try {
  handler = NextAuth(authOptions);
} catch (err) {
  console.error('NextAuth initialization error:', err);
  throw err;
}

export { handler as GET, handler as POST };