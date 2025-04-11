import { getApps, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase - check if already initialized to prevent duplicate app error
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);
const functions = getFunctions(app);

// Use emulators during development
if (import.meta.env.DEV) {
  // Uncomment if using local emulators
  // connectAuthEmulator(auth, 'http://localhost:9099');
  // connectFunctionsEmulator(functions, 'localhost', 5001);
}

// Initialize Firebase Cloud Messaging and get a reference to the service
let messaging = null;
try {
  // Only initialize messaging if browser supports service worker
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    messaging = getMessaging(app);
  }
} catch (error) {
  console.log('Firebase messaging not supported in this browser');
}

// Request notification permissions and get FCM token
export const requestNotificationPermission = async () => {
  if (!messaging) return null;
  
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      return getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY
      });
    }
    return null;
  } catch (error) {
    console.error('Notification permission error:', error);
    return null;
  }
};

// Listen for FCM messages
export const onMessageListener = (callback) => {
  if (!messaging) return () => {};
  
  return onMessage(messaging, (payload) => {
    callback(payload);
  });
};

export { app, db, storage, auth, functions };