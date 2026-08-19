import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDummyKeyForMindBloomLocalDev123",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "mindbloom-dummy.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "mindbloom-dummy",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "mindbloom-dummy.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "1234567890",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:1234567890:web:abcdef1234567890",
};

let app;
let authInstance: any;
let dbInstance: any;

try {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  authInstance = getAuth(app);
  dbInstance = getFirestore(app);
} catch (error) {
  console.warn("Firebase initialization failed, using mock interface:", error);
  const mockUser = {
    uid: "mock-user-123",
    email: "student@mindbloom.app",
    displayName: "Guest Student",
    photoURL: null,
  };
  authInstance = {
    currentUser: mockUser,
    onAuthStateChanged: (callback: any) => {
      setTimeout(() => callback(mockUser), 0);
      return () => {};
    },
    signOut: () => Promise.resolve(),
  };
  dbInstance = {};
}

export const auth = authInstance;
export const db = dbInstance;
