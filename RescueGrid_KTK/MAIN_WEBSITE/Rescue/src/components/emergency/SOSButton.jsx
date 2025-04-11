import React, { useState } from 'react';
import { FiAlertTriangle, FiSend, FiActivity, FiCheckCircle, FiX, FiMic, FiVideo, FiPhone } from 'react-icons/fi';
import { useEmergency } from '../../hooks/useEmergency';
import { useMap } from '../../hooks/useMap';

const SOSButton = ({ showDetails = true, size = 'large' }) => {
  const { sendSOS } = useEmergency();
  const { location } = useMap();
  const [isPressed, setIsPressed] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);
  const [showTypeSelector, setShowTypeSelector] = useState(false);
  const [description, setDescription] = useState('');
  const [emergencyType, setEmergencyType] = useState('sos');
  const [confirmationVisible, setConfirmationVisible] = useState(false);

  const handleSOSPress = () => {
    setIsPressed(true);
    setShowTypeSelector(true);
  };

  const handleSOSCancel = () => {
    setIsPressed(false);
    setShowTypeSelector(false);
    setConfirmationVisible(false);
  };

  const handleTypeSelect = (type) => {
    setEmergencyType(type);
    setShowTypeSelector(false);
    setConfirmationVisible(true);
  };

  const handleSOSSend = async () => {
    if (!location) {
      setError("Unable to determine your location. Please enable location services.");
      return;
    }

    try {
      setSending(true);
      setError(null);

      // Send the SOS through our context
      const result = await sendSOS(description, emergencyType);
      
      setSent(true);
      
      // Reset after 5 seconds
      setTimeout(() => {
        setSent(false);
        setIsPressed(false);
        setConfirmationVisible(false);
        setDescription('');
        setEmergencyType('sos');
      }, 5000);
    } catch (err) {
      console.error('Error sending SOS:', err);
      setError(err.message || "Failed to send SOS. Please try again.");
    } finally {
      setSending(false);
    }
  };

  // Different types of emergencies
  const emergencyTypes = [
    { id: 'fire', label: 'Fire', color: 'bg-red-600' },
    { id: 'medical', label: 'Medical', color: 'bg-blue-600' },
    { id: 'police', label: 'Police', color: 'bg-green-700' },
    { id: 'rescue', label: 'Rescue', color: 'bg-yellow-600' },
    { id: 'sos', label: 'SOS (General)', color: 'bg-emergency-red' }
  ];

  return (
    <div className="sos-container my-4">
      {/* Main SOS Button */}
      {!showTypeSelector && !confirmationVisible && !sent && (
        <button 
          className={`
            flex flex-col items-center justify-center 
            ${size === 'large' ? 'w-full md:w-72 h-32' : 'w-full h-20'} 
            rounded-2xl transition-all transform shadow-lg 
            ${isPressed ? 'scale-95' : 'hover:scale-105'} 
            ${sent ? 'bg-safe-green' : 'bg-emergency-red'} 
            text-white font-bold ${size === 'large' ? 'text-xl' : 'text-lg'}
          `}
          onClick={handleSOSPress}
          disabled={sending || sent}
        >
          <div className="flex flex-col items-center">
            <FiAlertTriangle size={size === 'large' ? 40 : 24} className="mb-2 animate-pulse" />
            <span>Send Emergency SOS</span>
          </div>
        </button>
      )}

      {/* Emergency Type Selector */}
      {showTypeSelector && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Select Emergency Type</h3>
            <button 
              onClick={handleSOSCancel}
              className="text-gray-500 hover:text-gray-700"
            >
              <FiX size={24} />
            </button>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
            {emergencyTypes.map(type => (
              <button
                key={type.id}
                onClick={() => handleTypeSelect(type.id)}
                className={`${type.color} text-white py-3 px-4 rounded-lg transition-transform hover:scale-105`}
              >
                <span className="block font-bold">{type.label}</span>
              </button>
            ))}
          </div>
          
          <div className="text-xs text-gray-500 mt-2">
            Select the type of emergency you're experiencing for faster response.
          </div>
        </div>
      )}

      {/* Confirmation & Description */}
      {confirmationVisible && !sent && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">
              Confirm {emergencyType.charAt(0).toUpperCase() + emergencyType.slice(1)} Emergency
            </h3>
            <button 
              onClick={handleSOSCancel}
              className="text-gray-500 hover:text-gray-700"
            >
              <FiX size={24} />
            </button>
          </div>
          
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Briefly describe your emergency (optional)
            </label>
            <textarea
              id="description"
              rows="3"
              className="w-full border border-gray-300 rounded-md p-2"
              placeholder="Example: Trapped in elevator on 3rd floor"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-6">
            <button className="flex items-center gap-1 text-sm bg-gray-200 text-gray-700 rounded-full px-3 py-1">
              <FiMic /> Voice Message
            </button>
            <button className="flex items-center gap-1 text-sm bg-gray-200 text-gray-700 rounded-full px-3 py-1">
              <FiVideo /> Video
            </button>
            <button className="flex items-center gap-1 text-sm bg-gray-200 text-gray-700 rounded-full px-3 py-1">
              <FiPhone /> Call
            </button>
          </div>
          
          <div className="flex flex-col md:flex-row gap-3">
            <button 
              onClick={handleSOSCancel}
              className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 font-medium"
            >
              Cancel
            </button>
            <button 
              onClick={handleSOSSend}
              className="flex-1 py-3 px-4 bg-emergency-red text-white rounded-lg font-medium flex items-center justify-center"
              disabled={sending}
            >
              {sending ? (
                <span className="flex items-center">
                  <FiActivity className="animate-pulse mr-2" /> Sending...
                </span>
              ) : (
                <span className="flex items-center">
                  <FiSend className="mr-2" /> Send Emergency Alert
                </span>
              )}
            </button>
          </div>
          
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg text-sm">
              {error}
            </div>
          )}
        </div>
      )}

      {/* Success State */}
      {sent && (
        <div className="bg-safe-green text-white rounded-lg p-6 text-center">
          <FiCheckCircle size={48} className="mx-auto mb-3" />
          <h3 className="text-xl font-bold mb-2">Emergency Alert Sent</h3>
          <p className="mb-4">Help is on the way. Stay where you are if safe to do so.</p>
          <div className="animate-pulse text-sm mt-4">
            Sharing your location with emergency services...
          </div>
        </div>
      )}

      {/* Additional Information (only if showDetails is true) */}
      {showDetails && !isPressed && !showTypeSelector && !confirmationVisible && (
        <div className="mt-4">
          <h3 className="text-sm font-semibold mb-1">Use this button for:</h3>
          <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
            <li>Life-threatening emergencies</li>
            <li>Immediate danger situations</li>
            <li>Serious medical emergencies</li>
            <li>Accidents requiring urgent response</li>
          </ul>
          
          <div className="mt-3 p-2 bg-blue-50 border border-blue-100 rounded-md text-xs text-blue-800">
            Your exact location will be shared with emergency responders.
          </div>
        </div>
      )}
    </div>
  );
};

export default SOSButton;