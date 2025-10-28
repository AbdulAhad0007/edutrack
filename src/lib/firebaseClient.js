// Firebase client initialization and helper to upsert user
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

if (!getApps().length) {
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    console.error('Firebase client not initialized: missing NEXT_PUBLIC_FIREBASE_* env vars');
  } else {
    initializeApp(firebaseConfig);
  }
}

const db = getFirestore();
export const auth = getAuth();

export async function upsertUser(user) {
  if (!user || !user.email) return;
  try {
    const ref = doc(db, 'users', user.email);
    await setDoc(ref, {
      name: user.name || null,
      email: user.email,
      image: user.image || null,
      role: user.role || 'student',
      lastSeen: new Date().toISOString(),
    }, { merge: true });
  } catch (err) {
    console.error('Failed to upsert user to Firestore', err);
  }
}


