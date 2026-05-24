import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCg60JISOSneF0JYyDrhMZdRJcEfaMmLgo",
  authDomain: "unity-book-shop.firebaseapp.com",
  projectId: "unity-book-shop",
  storageBucket: "unity-book-shop.firebasestorage.app",
  messagingSenderId: "104337365978",
  appId: "1:104337365978:web:183f74af273256feacbee3",
  measurementId: "G-GH3DR9L3QL"
};

const app  = initializeApp(firebaseConfig);
export const db   = getFirestore(app);
export const auth = getAuth(app);
export const FIREBASE_CONFIGURED = true;
export default app;
