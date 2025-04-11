import React, { useState } from 'react';
import { FiMapPin, FiPhone, FiMail, FiClock, FiAlertCircle, FiMessageSquare } from 'react-icons/fi';

const AgencyCard = ({ agency }) => {
  const [activeTab, setActiveTab] = useState('details');
  
  const TypeIcon = () => {
    switch (agency.type) {
      case 'fire':
        return <div className="bg-red-100 text-red-600 p-3 rounded-full">🔥</div>;
      case 'medical':
        return <div className="bg-blue-100 text-blue-600 p-3 rounded-full">🚑</div>;
      case 'police':
        return <div className="bg-green-100 text-green-600 p-3 rounded-full">👮</div>;
      case 'rescue':
        return <div className="bg-yellow-100 text-yellow-600 p-3 rounded-full">🆘</div>;
      default:
        return <div className="bg-gray-100 text-gray-600 p-3 rounded-full">?</div>;
    }
  };
  
  const AgencyStatusBadge = () => (
    <span className={`
      text-xs px-2 py-1 rounded-full
      ${agency.status === 'active' ? 'bg-green-100 text-green-800' : 
        agency.status === 'busy' ? 'bg-yellow-100 text-yellow-800' : 
        'bg-gray-100 text-gray-800'}
    `}>
      {agency.status.toUpperCase()}
    </span>
  );

  const handleSendAlert = () => {
    // In a real app, this would send an alert to the agency
    console.log('Sending alert to agency:', agency.id);
    alert(`Alert sent to ${agency.name}. They will contact you shortly.`);
  };
  
  const handleContact = () => {
    // In a real app, this would initiate contact with the agency
    console.log('Contacting agency:', agency.id);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Agency Header */}
      <div className="p-6 border-b">
        <div className="flex items-center">
          <TypeIcon />
          <div className="ml-4">
            <h2 className="text-xl font-bold">{agency.name}</h2>
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <FiMapPin size={14} className="mr-1" />
              <span>{agency.address}</span>
            </div>
          </div>
          <div className="ml-auto">
            <AgencyStatusBadge />
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="flex border-b">
        <button
          onClick={() => setActiveTab('details')}
          className={`flex-1 py-3 px-4 text-center ${
            activeTab === 'details' 
              ? 'border-b-2 border-blue-500 text-blue-600' 
              : 'text-gray-500'
          }`}
        >
          Details
        </button>
        <button
          onClick={() => setActiveTab('services')}
          className={`flex-1 py-3 px-4 text-center ${
            activeTab === 'services' 
              ? 'border-b-2 border-blue-500 text-blue-600' 
              : 'text-gray-500'
          }`}
        >
          Services
        </button>
        <button
          onClick={() => setActiveTab('contact')}
          className={`flex-1 py-3 px-4 text-center ${
            activeTab === 'contact' 
              ? 'border-b-2 border-blue-500 text-blue-600' 
              : 'text-gray-500'
          }`}
        >
          Contact
        </button>
      </div>
      
      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'details' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center">
                <FiClock className="text-gray-500 mr-2" />
                <div>
                  <div className="text-sm text-gray-500">Response Time</div>
                  <div className="font-medium">{agency.responseTime}</div>
                </div>
              </div>
              
              <div className="flex items-center">
                <FiAlertCircle className="text-gray-500 mr-2" />
                <div>
                  <div className="text-sm text-gray-500">Emergency Type</div>
                  <div className="font-medium">
                    {agency.type.charAt(0).toUpperCase() + agency.type.slice(1)}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center">
                <FiPhone className="text-gray-500 mr-2" />
                <div>
                  <div className="text-sm text-gray-500">Phone</div>
                  <div className="font-medium">{agency.phone}</div>
                </div>
              </div>
              
              <div className="flex items-center">
                <FiMail className="text-gray-500 mr-2" />
                <div>
                  <div className="text-sm text-gray-500">Email</div>
                  <div className="font-medium">{agency.email}</div>
                </div>
              </div>
            </div>
            
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">About</h3>
              <p className="text-gray-700">
                {agency.description || 
                  `${agency.name} is a ${agency.type} emergency service provider located in 
                  ${agency.address}. They respond to emergencies in the area with an average 
                  response time of ${agency.responseTime}.`
                }
              </p>
            </div>
          </div>
        )}
        
        {activeTab === 'services' && (
          <div>
            <h3 className="text-lg font-semibold mb-3">Services Offered</h3>
            <ul className="space-y-3">
              {agency.type === 'fire' && (
                <>
                  <li className="flex items-start">
                    <span className="bg-red-100 text-red-600 p-2 rounded-full mr-3">🔥</span>
                    <div>
                      <h4 className="font-medium">Fire Response</h4>
                      <p className="text-sm text-gray-600">Emergency response to fires in buildings, vehicles, and outdoor areas</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-red-100 text-red-600 p-2 rounded-full mr-3">🚒</span>
                    <div>
                      <h4 className="font-medium">Rescue Operations</h4>
                      <p className="text-sm text-gray-600">Extraction and rescue for trapped individuals</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-red-100 text-red-600 p-2 rounded-full mr-3">⚠️</span>
                    <div>
                      <h4 className="font-medium">Hazardous Materials</h4>
                      <p className="text-sm text-gray-600">Response and containment for hazardous spills and incidents</p>
                    </div>
                  </li>
                </>
              )}
              
              {agency.type === 'medical' && (
                <>
                  <li className="flex items-start">
                    <span className="bg-blue-100 text-blue-600 p-2 rounded-full mr-3">🚑</span>
                    <div>
                      <h4 className="font-medium">Emergency Medical Response</h4>
                      <p className="text-sm text-gray-600">Immediate medical care for emergencies and injuries</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-blue-100 text-blue-600 p-2 rounded-full mr-3">🏥</span>
                    <div>
                      <h4 className="font-medium">Patient Transport</h4>
                      <p className="text-sm text-gray-600">Emergency transportation to medical facilities</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-blue-100 text-blue-600 p-2 rounded-full mr-3">💉</span>
                    <div>
                      <h4 className="font-medium">First Aid</h4>
                      <p className="text-sm text-gray-600">Critical care and stabilization of patients</p>
                    </div>
                  </li>
                </>
              )}
              
              {agency.type === 'police' && (
                <>
                  <li className="flex items-start">
                    <span className="bg-green-100 text-green-600 p-2 rounded-full mr-3">👮</span>
                    <div>
                      <h4 className="font-medium">Emergency Response</h4>
                      <p className="text-sm text-gray-600">Rapid response to emergency calls and incidents</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-green-100 text-green-600 p-2 rounded-full mr-3">🔒</span>
                    <div>
                      <h4 className="font-medium">Public Safety</h4>
                      <p className="text-sm text-gray-600">Protection and security during emergencies</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-green-100 text-green-600 p-2 rounded-full mr-3">🚨</span>
                    <div>
                      <h4 className="font-medium">Traffic Control</h4>
                      <p className="text-sm text-gray-600">Management of traffic during disasters and emergencies</p>
                    </div>
                  </li>
                </>
              )}
              
              {agency.type === 'rescue' && (
                <>
                  <li className="flex items-start">
                    <span className="bg-yellow-100 text-yellow-600 p-2 rounded-full mr-3">🆘</span>
                    <div>
                      <h4 className="font-medium">Search and Rescue</h4>
                      <p className="text-sm text-gray-600">Finding and rescuing people in distress or danger</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-yellow-100 text-yellow-600 p-2 rounded-full mr-3">🧗</span>
                    <div>
                      <h4 className="font-medium">Technical Rescue</h4>
                      <p className="text-sm text-gray-600">Specialized rescues in difficult situations or terrain</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-yellow-100 text-yellow-600 p-2 rounded-full mr-3">🌊</span>
                    <div>
                      <h4 className="font-medium">Water Rescue</h4>
                      <p className="text-sm text-gray-600">Rescue operations in flooding and water emergencies</p>
                    </div>
                  </li>
                </>
              )}
            </ul>
          </div>
        )}
        
        {activeTab === 'contact' && (
          <div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <FiPhone className="text-gray-500 mr-3" />
                  <a href={`tel:${agency.phone}`} className="text-blue-600 hover:underline">
                    {agency.phone}
                  </a>
                </div>
                <div className="flex items-center">
                  <FiMail className="text-gray-500 mr-3" />
                  <a href={`mailto:${agency.email}`} className="text-blue-600 hover:underline">
                    {agency.email}
                  </a>
                </div>
                <div className="flex items-center">
                  <FiMapPin className="text-gray-500 mr-3" />
                  <span>{agency.address}</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={handleSendAlert}
                className="bg-emergency-red hover:bg-red-700 text-white rounded-lg py-3 flex items-center justify-center"
              >
                <FiAlertCircle className="mr-2" /> Send Emergency Alert
              </button>
              
              <button
                onClick={handleContact}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3 flex items-center justify-center"
              >
                <FiMessageSquare className="mr-2" /> Contact Agency
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgencyCard;