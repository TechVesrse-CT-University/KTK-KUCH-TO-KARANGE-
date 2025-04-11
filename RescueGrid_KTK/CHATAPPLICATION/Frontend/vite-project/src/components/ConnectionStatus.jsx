import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSocket } from '../contexts/SocketContext';
import { MdRefresh, MdInfo, MdClose, MdSignalWifi4Bar, MdSignalWifiOff } from 'react-icons/md';

// Create a new component to monitor real-time connectivity quality
const ConnectionStatus = ({ darkMode = false }) => {
  const { connected, connecting, connectionError, reconnect, currentRoom } = useSocket();
  const [showDetails, setShowDetails] = useState(false);
  const [lastMessageTime, setLastMessageTime] = useState(null);
  const [connectionQuality, setConnectionQuality] = useState('good');
  
  // Monitor socket activity
  useEffect(() => {
    let activityInterval;
    
    if (connected) {
      activityInterval = setInterval(() => {
        // Check if we've received messages recently
        const now = Date.now();
        if (lastMessageTime && now - lastMessageTime > 20000) {
          setConnectionQuality('poor');
        } else if (lastMessageTime && now - lastMessageTime > 10000) {
          setConnectionQuality('medium');
        } else {
          setConnectionQuality('good');
        }
      }, 5000);
    }
    
    return () => {
      if (activityInterval) clearInterval(activityInterval);
    };
  }, [connected, lastMessageTime]);
  
  // Reset message time when connection changes
  useEffect(() => {
    if (connected) {
      setLastMessageTime(Date.now());
    }
  }, [connected]);
  
  // Skip rendering if connected, quality is good, and no errors
  if (connected && !connectionError && connectionQuality === 'good') return null;
  
  return (
    <AnimatePresence>
      <motion.div 
        className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
      >
        <div 
          className={`rounded-lg shadow-lg px-4 py-3 ${
            connectionError 
              ? `${darkMode ? 'bg-emergency-900/80 text-white' : 'bg-emergency-50 text-emergency-800'}` 
              : connectionQuality === 'poor'
                ? `${darkMode ? 'bg-yellow-900/80 text-white' : 'bg-yellow-50 text-yellow-800'}`
                : `${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`
          } flex items-center gap-3`}
        >
          {/* Connection status */}
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full mr-2 ${
              connecting ? 'bg-yellow-500 animate-pulse' : 
              connectionError ? 'bg-emergency-500' :
              connectionQuality === 'poor' ? 'bg-yellow-500' :
              connectionQuality === 'medium' ? 'bg-yellow-300' : 
              'bg-green-500'
            }`}></div>
            <span className="font-medium">
              {connectionError ? 'Connection Error' : 
               connecting ? 'Connecting...' :
               connectionQuality === 'poor' ? 'Slow Connection' :
               connectionQuality === 'medium' ? 'Connection OK' :
               'Connected'}
            </span>
          </div>
          
          {/* Show current room if available */}
          {currentRoom && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200/20">
              Room: {currentRoom}
            </span>
          )}
          
          {/* Action button */}
          <button
            className={`px-3 py-1 rounded-md text-sm flex items-center gap-1 ${
              darkMode 
                ? 'bg-white/10 hover:bg-white/20' 
                : 'bg-black/10 hover:bg-black/20'
            }`}
            onClick={reconnect}
          >
            <MdRefresh size={16} />
            <span>Reconnect</span>
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ConnectionStatus;
