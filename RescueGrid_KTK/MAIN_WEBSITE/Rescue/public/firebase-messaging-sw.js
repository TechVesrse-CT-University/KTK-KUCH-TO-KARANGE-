// This is needed for Firebase Cloud Messaging
importScripts('https://www.gstatic.com/firebasejs/9.15.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.15.0/firebase-messaging-compat.js');

// Your Firebase configuration
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
firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message:', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/favicon.svg',
    badge: '/notification-badge.svg',
    tag: payload.data?.emergencyId || 'emergency',
    data: payload.data
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  const emergencyId = event.notification.data?.emergencyId;
  
  event.notification.close();

  // Open or focus emergency details page
  const urlToOpen = new URL(`/emergency/${emergencyId || 'latest'}`, self.location.origin).href;

  const promiseChain = clients.matchAll({
    type: 'window',
    includeUncontrolled: true
  })
  .then((windowClients) => {
    // Check if there is already a window open with the target URL
    for (let i = 0; i < windowClients.length; i++) {
      const client = windowClients[i];
      if (client.url === urlToOpen && 'focus' in client) {
        return client.focus();
      }
    }
    // If no window found, open a new one
    if (clients.openWindow) {
      return clients.openWindow(urlToOpen);
    }
  });

  event.waitUntil(promiseChain);
});