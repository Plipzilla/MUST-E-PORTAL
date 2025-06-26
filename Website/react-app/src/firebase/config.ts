import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Your Firebase configuration
// Replace these values with your actual Firebase project credentials
const firebaseConfig = {
  apiKey: "AIzaSyCEq1qp8B9oh--6F2iiVBC4MCDx3RiDUYo",
  authDomain: "must-e-portal-b29d0.firebaseapp.com",
  databaseURL: "https://must-e-portal-b29d0-default-rtdb.firebaseio.com",
  projectId: "must-e-portal-b29d0",
  storageBucket: "must-e-portal-b29d0.firebasestorage.app",
  messagingSenderId: "14690937959",
  appId: "1:14690937959:web:3515c0cc4080f24ade78c2",
  measurementId: "G-7KWVZR73W2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

export default app; 