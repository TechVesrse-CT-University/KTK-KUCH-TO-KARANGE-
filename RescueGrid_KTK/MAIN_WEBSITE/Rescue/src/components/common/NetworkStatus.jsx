import React, { useState, useEffect } from 'react';
import { FiWifi, FiWifiOff } from 'react-icons/fi';

const NetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showStatus, setShowStatus] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowStatus(true);
      // Hide the status message after 3 seconds
      setTimeout(() => setShowStatus(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowStatus(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showStatus) return null;

  return (
    <div
      className={`fixed bottom-20 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-full shadow-lg flex items-center z-50 ${
        isOnline ? 'bg-green-600' : 'bg-red-600'
      } text-white transition-all duration-500`}
    >
      {isOnline ? (
        <>
          <FiWifi className="mr-2" />
          <span>You're back online</span>
        </>
      ) : (
        <>
          <FiWifiOff className="mr-2" />
          <span>You're offline</span>
        </>
      )}
    </div>
  );
};

export default NetworkStatus;