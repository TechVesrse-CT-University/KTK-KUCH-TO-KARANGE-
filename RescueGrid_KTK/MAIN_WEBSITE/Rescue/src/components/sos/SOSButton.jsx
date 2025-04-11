import React, { useState } from 'react';
import { FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import { useMap } from '../../hooks/useMap';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../hooks/useAuth';

const SOSButton = () => {
  const [isPressed, setIsPressed] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);
  const { location } = useMap();
  const { user } = useAuth();

  const handleSOSPress = async () => {
    setIsPressed(true);
    
    // Confirmation dialog
    if (window.confirm('Are you sure you want to send an emergency SOS signal?')) {
      try {
        setSending(true);
        setError(null);
        
        if (!location) {
          throw new Error("Unable to determine your location. Please enable location services.");
        }
        
        // Create emergency document in Firestore
        await addDoc(collection(db, 'emergencies'), {
          userId: user?.uid,
          userName: user?.displayName || 'Anonymous',
          location: {
            latitude: location.lat,
            longitude: location.lng
          },
          type: 'SOS Emergency',
          description: 'Emergency assistance requested',
          status: 'active',
          createdAt: serverTimestamp()
        });
        
        setSent(true);
        setTimeout(() => {
          setSent(false);
        }, 5000);
      } catch (err) {
        console.error('Error sending SOS:', err);
        setError(err.message);
      } finally {
        setSending(false);
        setTimeout(() => {
          setIsPressed(false);
        }, 500);
      }
    } else {
      // User cancelled
      setIsPressed(false);
    }
  };

  return (
    <div className="sos-button-container">
      <button 
        className={`
          flex flex-col items-center justify-center 
          w-full md:w-72 h-32 rounded-2xl 
          transition-all transform shadow-lg 
          ${isPressed ? 'scale-95' : 'hover:scale-105'} 
          ${sent ? 'bg-safe-green' : 'bg-emergency-red'} 
          text-white font-bold text-xl
        `}
        onClick={handleSOSPress}
        disabled={sending || sent}
      >
        {sending ? (
          <div className="flex flex-col items-center">
            <div className="loader border-white mb-2"></div>
            <span>Sending SOS...</span>
          </div>
        ) : sent ? (
          <div className="flex flex-col items-center">
            <FiCheckCircle size={40} className="mb-2" />
            <span>SOS Sent Successfully!</span>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <FiAlertCircle size={40} className="mb-2 animate-pulse" />
            <span>Send Emergency SOS</span>
          </div>
        )}
      </button>
      
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg">
          {error}
        </div>
      )}
      
      <p className="mt-4 text-sm text-gray-500 text-center">
        Press the button to alert emergency responders of your current location.
      </p>
    </div>
  );
};

export default SOSButton;