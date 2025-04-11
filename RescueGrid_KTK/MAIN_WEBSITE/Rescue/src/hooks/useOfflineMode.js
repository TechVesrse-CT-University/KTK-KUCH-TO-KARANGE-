import { useState, useEffect } from 'react';

/**
 * Hook to track online/offline status and handle offline functionality
 */
export const useOfflineMode = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineData, setOfflineData] = useState(null);
  const [pendingActions, setPendingActions] = useState([]);

  // Track online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Process any pending actions when coming back online
  useEffect(() => {
    const processPendingActions = async () => {
      if (isOnline && pendingActions.length > 0) {
        try {
          for (const action of pendingActions) {
            // Process each action based on its type
            switch (action.type) {
              case 'SOS':
                // Send SOS data that was created while offline
                await sendSOSWhenOnline(action.data);
                break;
              case 'UPDATE':
                // Update data that was modified while offline
                await updateDataWhenOnline(action.data);
                break;
              default:
                console.warn('Unknown pending action type:', action.type);
            }
          }
          // Clear pending actions after successful processing
          setPendingActions([]);
        } catch (error) {
          console.error('Error processing pending actions:', error);
        }
      }
    };

    processPendingActions();
  }, [isOnline, pendingActions]);

  /**
   * Add a new action to the pending queue
   */
  const addPendingAction = (type, data) => {
    setPendingActions(prev => [...prev, { type, data, timestamp: Date.now() }]);
  };

  /**
   * Cache data locally for offline use
   */
  const cacheOfflineData = (key, data) => {
    try {
      // Store in memory
      setOfflineData(prev => ({ ...prev, [key]: data }));
      
      // Also store in localStorage for persistence
      localStorage.setItem(`offline_${key}`, JSON.stringify(data));
    } catch (error) {
      console.error('Error caching offline data:', error);
    }
  };

  /**
   * Retrieve cached offline data
   */
  const getCachedData = (key) => {
    // First try memory cache
    if (offlineData && offlineData[key]) {
      return offlineData[key];
    }
    
    // Fallback to localStorage
    try {
      const data = localStorage.getItem(`offline_${key}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error retrieving cached data:', error);
      return null;
    }
  };

  /**
   * Create an emergency SOS request that works offline
   */
  const createOfflineSOS = (sosData) => {
    // Generate a temporary ID
    const tempId = `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Add metadata
    const enhancedData = {
      ...sosData,
      id: tempId,
      status: 'pending',
      createdAt: new Date(),
      isOffline: true
    };
    
    // Store locally
    cacheOfflineData(`sos_${tempId}`, enhancedData);
    
    // Add to pending actions queue
    addPendingAction('SOS', enhancedData);
    
    return enhancedData;
  };

  // Helper function to send SOS when back online
  const sendSOSWhenOnline = async (sosData) => {
    // Implementation would depend on your API
    console.log('Sending offline SOS now that we are online:', sosData);
    // Actual implementation would go here
  };

  // Helper function to update data when back online
  const updateDataWhenOnline = async (data) => {
    // Implementation would depend on your API
    console.log('Updating offline data now that we are online:', data);
    // Actual implementation would go here
  };

  return {
    isOnline,
    createOfflineSOS,
    cacheOfflineData,
    getCachedData,
    pendingActions
  };
};

export default useOfflineMode;