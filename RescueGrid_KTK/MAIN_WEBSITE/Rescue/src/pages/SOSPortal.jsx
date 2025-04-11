import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import SOSButton from '../components/emergency/SOSButton';
import ChatBot from '../components/sos/ChatBot';  // Updated path from emergency to sos
import MapView from '../components/map/MapView';
import { useEmergency } from '../hooks/useEmergency';

const SOSPortal = () => {
  const { activeEmergencies } = useEmergency();
  const [localEmergencies, setLocalEmergencies] = useState([]);
  
  // Filter emergencies by proximity to user's location
  useEffect(() => {
    // In a real app, you would filter emergencies based on proximity to user's location
    setLocalEmergencies(activeEmergencies.slice(0, 3));
  }, [activeEmergencies]);
  
  return (
    <div className="sos-portal">
      <div className="flex items-center mb-6">
        <Link to="/dashboard" className="flex items-center text-emergency-red hover:text-red-700 mr-4">
          <FiArrowLeft className="mr-1" /> Back
        </Link>
        <h1 className="text-3xl font-bold">Emergency SOS</h1>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-bold mb-4">Send Emergency Alert</h2>
        <SOSButton showDetails={true} />
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Emergency Assistance Bot */}
        <div>
          <h2 className="text-xl font-bold mb-4">Emergency Assistance</h2>
          <ChatBot />
        </div>
        
        {/* Emergency Map */}
        <div>
          <h2 className="text-xl font-bold mb-4">Nearby Emergencies & Services</h2>
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="h-[400px]">
              <MapView height="100%" showEmergencies={true} showAgencies={true} />
            </div>
          </div>
          
          {/* Local Emergencies List */}
          {localEmergencies.length > 0 && (
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="font-semibold mb-3">Active Emergencies Near You</h3>
              <div className="space-y-3">
                {localEmergencies.map(emergency => (
                  <div key={emergency.id} className="p-3 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-medium capitalize">{emergency.type} Emergency</span>
                      <span className="text-xs bg-red-100 text-red-800 py-1 px-2 rounded-full">
                        Active
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mt-1">
                      {emergency.description || 'No description provided'}
                    </p>
                    <div className="text-xs text-gray-500 mt-2">
                      Reported: {emergency.createdAt.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Emergency Instructions */}
      <div className="mt-8 bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
        <h3 className="font-semibold text-blue-800">Emergency Instructions:</h3>
        <ul className="mt-2 list-disc list-inside text-blue-700 space-y-1">
          <li>Stay calm and assess the situation</li>
          <li>Use the SOS button for immediate emergency assistance</li>
          <li>If possible, provide details about your emergency</li>
          <li>Stay in a safe location while help is on the way</li>
          <li>Keep your phone on and accessible</li>
        </ul>
      </div>
    </div>
  );
};

export default SOSPortal;