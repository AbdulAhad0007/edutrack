import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import admin from 'firebase-admin';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

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
        session.user.uid = token.sub; // Set uid to the same value as id for consistency
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