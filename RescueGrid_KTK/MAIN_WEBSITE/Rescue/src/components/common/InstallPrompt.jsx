import React, { useState, useEffect } from 'react';
import { FiDownload, FiX } from 'react-icons/fi';
import usePWA from '../../hooks/usePWA';

const InstallPrompt = () => {
  const { isInstallable, isInstalled, promptToInstall } = usePWA();
  const [isDismissed, setIsDismissed] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    if (isInstallable && !isInstalled && !isDismissed) {
      // Wait a bit before showing to not interrupt the initial user experience
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 20000); // 20 seconds
      
      return () => clearTimeout(timer);
    } else {
      setShowPrompt(false);
    }
  }, [isInstallable, isInstalled, isDismissed]);

  const handleInstall = async () => {
    const installed = await promptToInstall();
    if (!installed) {
      // User declined installation
      setIsDismissed(true);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    setShowPrompt(false);
    
    // Save dismiss state for a day
    const expiry = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    localStorage.setItem('pwa-prompt-dismissed', expiry.toString());
  };

  if (!showPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-full max-w-md mx-auto flex items-center">
        <div className="rounded-full bg-emergency-red p-3 mr-4">
          <FiDownload className="text-white" size={20} />
        </div>
        <div className="flex-grow">
          <h4 className="font-bold">Install RescueGrid</h4>
          <p className="text-sm text-gray-600">
            Install this app for offline access to emergency features.
          </p>
        </div>
        <div className="flex items-center">
          <button
            onClick={handleDismiss}
            className="mr-2 p-2 hover:bg-gray-100 rounded-full"
          >
            <FiX />
          </button>
          <button
            onClick={handleInstall}
            className="bg-emergency-red text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            Install
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallPrompt;