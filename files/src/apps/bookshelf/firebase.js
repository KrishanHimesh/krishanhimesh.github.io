import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCGrFlWCWb84I2Tn7ZV0KNz7JKbWW5JS2o",
  authDomain: "unity-book-shop-6ebdd.firebaseapp.com",
  projectId: "unity-book-shop-6ebdd",
  storageBucket: "unity-book-shop-6ebdd.firebasestorage.app",
  messagingSenderId: "100493595845",
  appId: "1:100493595845:web:ba23090ebb20c3e2e18cac",
  measurementId: "G-E7TNR3MY8F"
};

const app  = initializeApp(firebaseConfig);
export const db   = getFirestore(app);
export const auth = getAuth(app);
export const FIREBASE_CONFIGURED = true;
export default app;
