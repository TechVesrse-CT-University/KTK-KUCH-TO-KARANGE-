// Firebase Cloud Messaging Service Worker

// Import Firebase SDK
importScripts(
  "https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js"
);

// Initialize Firebase app with your project configuration
firebase.initializeApp({
  apiKey: "AIzaSyDLMWMFCvG8D2hpocem_FeL7HMQXtR5sxA",
  authDomain: "rescuex-ktk.firebaseapp.com",
  projectId: "rescuex-ktk",
  storageBucket: "rescuex-ktk.firebasestorage.app",
  messagingSenderId: "89726995953",
  appId: "1:89726995953:web:40a22904ba300ac606c850",
  measurementId: "G-N4N7HK8G4P",
});

// Get Firebase Messaging instance
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message",
    payload
  );

  // Customize notification
  const notificationTitle = payload.notification?.title || "Emergency Alert";
  const notificationOptions = {
    body: payload.notification?.body || "New emergency situation reported.",
    icon: "/img/notification-icon.png",
    badge: "/img/badge-icon.png",
    data: payload.data,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Service worker lifecycle events
self.addEventListener("install", () => {
  console.log("Service Worker installed");
});

self.addEventListener("activate", () => {
  console.log("Service Worker activated");
});

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  console.log("Notification clicked", event);

  event.notification.close();

  // Navigate to the app when notification is clicked
  event.waitUntil(
    clients.matchAll({ type: "window" }).then((clientList) => {
      for (const client of clientList) {
        if (client.url && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow("/");
      }
    })
  );
});
