import { useState, useEffect, useCallback } from 'react';

export function usePWA() {
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Check if the app is already installed
  useEffect(() => {
    // Check if app is displayed in standalone mode or installed
    if (window.matchMedia('(display-mode: standalone)').matches || 
        window.navigator.standalone === true) {
      setIsInstalled(true);
    }

    // Listen for changes in network status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Listen for the beforeinstallprompt event
  useEffect(() => {
    const handler = (event) => {
      // Prevent the default browser prompt
      event.preventDefault();
      // Store the event for later use
      setDeferredPrompt(event);
      // Update state to show install button
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  // Listen for successful installation
  useEffect(() => {
    const handler = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('appinstalled', handler);

    return () => {
      window.removeEventListener('appinstalled', handler);
    };
  }, []);

  // Prompt the user to install the PWA
  const promptToInstall = useCallback(async () => {
    if (!deferredPrompt) {
      console.log('Cannot prompt to install: installation prompt not available');
      return false;
    }

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const choiceResult = await deferredPrompt.userChoice;

    // Clear the saved prompt as it can only be used once
    setDeferredPrompt(null);
    setIsInstallable(false);

    return choiceResult.outcome === 'accepted';
  }, [deferredPrompt]);

  return {
    isInstallable,
    isInstalled,
    promptToInstall,
    isOnline,
  };
}

export default usePWA;