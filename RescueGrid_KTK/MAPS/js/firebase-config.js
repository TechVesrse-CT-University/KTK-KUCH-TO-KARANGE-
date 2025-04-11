// Firebase configuration
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

// Initialize services
const auth = firebase.auth();
const db = firebase.firestore();
let messaging;

// Try to initialize messaging only if supported
try {
    messaging = firebase.messaging();
} catch (error) {
    console.warn("Firebase messaging not supported in this browser", error);
}

// Request FCM permission and get token
async function requestNotificationPermission() {
    try {
        // Check if messaging is supported
        if (!messaging) {
            console.warn("Firebase messaging not supported in this browser");
            return null;
        }

        // First ensure service worker is registered
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
                console.log('Service Worker registered successfully with scope:', registration.scope);
                
                // Request notification permission
                const permission = await Notification.requestPermission();
                console.log('Notification permission:', permission);
                
                if (permission === 'granted') {
                    // Valid VAPID key for FCM
                    const token = await messaging.getToken({
                        vapidKey: "BLBr4LvwO9M-hFH7nZxIJgNRwDWOZ8xTg_JwFbqcPF23_KZCf1aNwbZ0IUzLbT27vGu_PT2Jz7E9yA79k1M-UZk"
                    });
                    
                    if (token) {
                        console.log("FCM Token:", token);
                        
                        // Save token to user document if logged in
                        if (auth.currentUser) {
                            await db.collection('users').doc(auth.currentUser.uid).update({
                                fcmToken: token
                            });
                        }
                        
                        return token;
                    }
                }
            } catch (error) {
                console.error("Service Worker registration failed:", error);
            }
        } else {
            console.warn("Service Workers not supported in this browser");
        }
    } catch (error) {
        console.error("Error getting FCM token:", error);
    }
    
    return null;
}

// Listen for FCM messages when app is in foreground
if (messaging) {
    messaging.onMessage((payload) => {
        console.log('Message received:', payload);
        
        // Create notification
        const notificationArea = document.getElementById('notification-area');
        if (notificationArea) {
            const notification = document.createElement('div');
            notification.className = 'notification';
            notification.textContent = payload.notification?.body || 'New alert received';
            notificationArea.appendChild(notification);
            
            // Remove notification after 10 seconds
            setTimeout(() => {
                notification.remove();
            }, 10000);
        }
    });
}
