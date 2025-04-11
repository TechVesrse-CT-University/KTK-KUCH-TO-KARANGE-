import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
// Replace with your own Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDLMWMFCvG8D2hpocem_FeL7HMQXtR5sxA",
  authDomain: "rescuex-ktk.firebaseapp.com",
  projectId: "rescuex-ktk",
  storageBucket: "rescuex-ktk.firebasestorage.app",
  messagingSenderId: "89726995953",
  appId: "1:89726995953:web:40a22904ba300ac606c850",
  measurementId: "G-N4N7HK8G4P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Firestore
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
