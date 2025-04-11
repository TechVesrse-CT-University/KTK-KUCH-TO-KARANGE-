import React, { createContext, useState, useEffect } from 'react';
import * as serviceWorkerRegistration from '../serviceWorkerRegistration';

export const ServiceWorkerContext = createContext();

export const ServiceWorkerProvider = ({ children }) => {
  const [waitingWorker, setWaitingWorker] = useState(null);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [registration, setRegistration] = useState(null);

  useEffect(() => {
    // Register the service worker
    serviceWorkerRegistration.register({
      onSuccess: (reg) => {
        console.log('Service worker registered successfully');
        setRegistration(reg);
      },
      onUpdate: (reg) => {
        console.log('New content is available');
        setWaitingWorker(reg.waiting);
        setUpdateAvailable(true);
      },
    });
  }, []);

  // Function to update the service worker
  const updateServiceWorker = () => {
    if (!waitingWorker) {
      return;
    }
    
    waitingWorker.addEventListener('statechange', (event) => {
      if (event.target.state === 'activated') {
        window.location.reload();
      }
    });
    
    // Send the SKIP_WAITING message to the waiting service worker
    waitingWorker.postMessage({ type: 'SKIP_WAITING' });
  };

  // Function to check for service worker updates
  const checkForUpdates = () => {
    if (!registration) return Promise.reject('No service worker registration');
    
    return registration.update()
      .then(() => console.log('Checked for service worker updates'))
      .catch((error) => console.error('Error checking for updates:', error));
  };

  const value = {
    updateAvailable,
    updateServiceWorker,
    checkForUpdates,
    registration,
  };

  return (
    <ServiceWorkerContext.Provider value={value}>
      {children}
    </ServiceWorkerContext.Provider>
  );
};