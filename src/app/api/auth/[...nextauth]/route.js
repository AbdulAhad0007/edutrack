<<<<<<< HEAD
import { createClient } from '@supabase/supabase-js';

=======
// src/app/api/auth/[...nextauth]/route.js
>>>>>>> e72ad566b79fdad6a6790dcdbf09158b3490aec0
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
<<<<<<< HEAD
import admin from 'firebase-admin';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
=======
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
>>>>>>> e72ad566b79fdad6a6790dcdbf09158b3490aec0

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

<<<<<<< HEAD
        // Check credentials
        if (!credentials?.uniqueId || !credentials?.password) throw new Error('Invalid Credentials');

        try {
          // Check Supabase teachers table first
          const { data: teacher, error: teacherError } = await supabase
            .from('teachers')
            .select('uid, name, role, password')
            .eq('uid', credentials.uniqueId)
            .single();

          if (!teacherError && teacher) {
            // Check password for teacher
            if (teacher.password !== credentials.password) {
              throw new Error('Invalid Credentials');
            }

            // Return teacher data
            return {
              id: teacher.uid,
              email: `${teacher.uid}@teacher.school.edu`,
              name: teacher.name,
              role: teacher.role || 'teacher'
            };
          }

          // Check Supabase students table
          console.log('Checking students table for UID:', credentials.uniqueId);
          const { data: student, error: studentError } = await supabase
            .from('students')
            .select('uid, name, password')
            .eq('uid', credentials.uniqueId)
            .single();

          if (studentError || !student) {
            console.log('Student not found in students table:', studentError);
            throw new Error('Invalid Credentials');
          }

          // Check password for student
          if (student.password !== credentials.password) {
            console.log('Password mismatch for student');
            throw new Error('Invalid Credentials');
          }

          // Return student data
          return {
            id: student.uid,
            email: `${student.uid}@student.school.edu`,
            name: student.name,
            role: 'student'
          };

        } catch (err) {
          console.error('Authentication error:', err);
          throw new Error('Invalid Credentials');
        }
=======
        // Fallback to mock uniqueId/password lookup
        if (!credentials?.uniqueId || !credentials?.password) throw new Error('Invalid Credentials');

        const user = users.find((user) => user.id === credentials.uniqueId);
        if (user && user.password === credentials.password && user.role === 'student') {
          return { id: user.id, email: user.email, name: user.name, role: user.role };
        }

        // Deny access for non-students or invalid credentials
        throw new Error('Invalid Credentials');
>>>>>>> e72ad566b79fdad6a6790dcdbf09158b3490aec0
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
<<<<<<< HEAD
        session.user.uid = token.sub; // Set uid to the same value as id for consistency
=======
>>>>>>> e72ad566b79fdad6a6790dcdbf09158b3490aec0
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