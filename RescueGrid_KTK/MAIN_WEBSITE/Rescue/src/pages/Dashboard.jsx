import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiAlertTriangle, FiClock, FiMapPin, FiPhone, FiUser, FiBell, FiActivity } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import { useEmergency } from '../hooks/useEmergency';
import MapView from '../components/map/MapView';
import AgencyDashboard from '../components/agency/AgencyDashboard';
import SOSButton from '../components/emergency/SOSButton';

const Dashboard = () => {
  const { user } = useAuth();
  const { emergencies, activeEmergencies } = useEmergency();
  const [userEmergencies, setUserEmergencies] = useState([]);
  const [stats, setStats] = useState({
    activeEmergencies: 0,
    agenciesOnline: 0,
    averageResponseTime: '0 min',
    nearbyIncidents: 0
  });
  const [selectedTab, setSelectedTab] = useState('overview');
  
  useEffect(() => {
    if (user) {
      // Filter emergencies for current user
      const userSOS = emergencies.filter(emergency => emergency.userId === user.uid);
      setUserEmergencies(userSOS);
      
      // Get stats - in a real app this would come from a proper API call
      setStats({
        activeEmergencies: activeEmergencies.length,
        agenciesOnline: 15,  // Mocked data
        averageResponseTime: '7 min',  // Mocked data
        nearbyIncidents: Math.floor(Math.random() * 5) + 1  // Random number for demo
      });
    }
  }, [user, emergencies, activeEmergencies]);
  
  // Display different content based on user role
  if (user?.role === 'agency') {
    return <AgencyDashboard />;
  }
  
  const renderEmergencyStatus = (status) => {
    switch (status) {
      case 'active':
        return (
          <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
            Active
          </span>
        );
      case 'pending':
        return (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
            Pending
          </span>
        );
      case 'resolved':
        return (
          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
            Resolved
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
            {status}
          </span>
        );
    }
  };
  
  const formatTime = (date) => {
    if (!date) return 'Unknown';
    
    const now = new Date();
    const diff = (now.getTime() - date.getTime()) / 1000; // Difference in seconds
    
    if (diff < 60) {
      return 'Just now';
    } else if (diff < 3600) {
      const minutes = Math.floor(diff / 60);
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diff < 86400) {
      const hours = Math.floor(diff / 3600);
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="dashboard">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-600">
          Welcome back, {user?.displayName || 'Guest'}
        </p>
      </div>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-5 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="bg-red-100 p-3 rounded-full mr-3">
              <FiAlertTriangle className="text-emergency-red" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Emergencies</p>
              <p className="text-xl font-bold">{stats.activeEmergencies}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full mr-3">
              <FiUser className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Agencies Online</p>
              <p className="text-xl font-bold">{stats.agenciesOnline}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full mr-3">
              <FiClock className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Avg Response Time</p>
              <p className="text-xl font-bold">{stats.averageResponseTime}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-3 rounded-full mr-3">
              <FiMapPin className="text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Nearby Incidents</p>
              <p className="text-xl font-bold">{stats.nearbyIncidents}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tab Navigation */}
      <div className="flex border-b mb-6 overflow-x-auto">
        <button
          onClick={() => setSelectedTab('overview')}
          className={`flex items-center py-3 px-4 ${
            selectedTab === 'overview'
              ? 'text-emergency-red border-b-2 border-emergency-red'
              : 'text-gray-500 hover:text-emergency-red'
          }`}
        >
          <FiActivity className="mr-2" />
          <span className="font-medium">Overview</span>
        </button>
        
        <button
          onClick={() => setSelectedTab('emergencies')}
          className={`flex items-center py-3 px-4 ${
            selectedTab === 'emergencies'
              ? 'text-emergency-red border-b-2 border-emergency-red'
              : 'text-gray-500 hover:text-emergency-red'
          }`}
        >
          <FiAlertTriangle className="mr-2" />
          <span className="font-medium">My Emergencies</span>
        </button>
        
        <button
          onClick={() => setSelectedTab('map')}
          className={`flex items-center py-3 px-4 ${
            selectedTab === 'map'
              ? 'text-emergency-red border-b-2 border-emergency-red'
              : 'text-gray-500 hover:text-emergency-red'
          }`}
        >
          <FiMapPin className="mr-2" />
          <span className="font-medium">Area Map</span>
        </button>
        
        <button
          onClick={() => setSelectedTab('contacts')}
          className={`flex items-center py-3 px-4 ${
            selectedTab === 'contacts'
              ? 'text-emergency-red border-b-2 border-emergency-red'
              : 'text-gray-500 hover:text-emergency-red'
          }`}
        >
          <FiPhone className="mr-2" />
          <span className="font-medium">Emergency Contacts</span>
        </button>
      </div>
      
      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {selectedTab === 'overview' && (
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-bold mb-4">Quick SOS</h2>
              <p className="text-gray-600 mb-6">
                Need immediate help? Press the SOS button to alert emergency services.
              </p>
              <SOSButton size="medium" />
              
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-3">Recent Activity</h3>
                <div className="space-y-4">
                  {userEmergencies.length > 0 ? (
                    userEmergencies.slice(0, 3).map(emergency => (
                      <div key={emergency.id} className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{emergency.type} Emergency</p>
                            <p className="text-sm text-gray-500">{formatTime(emergency.createdAt)}</p>
                          </div>
                          {renderEmergencyStatus(emergency.status)}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No recent emergency activity.</p>
                  )}
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-bold mb-4">Current Area Status</h2>
              <div className="h-80 mb-4">
                <MapView height="100%" showEmergencies={true} />
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Nearby Emergency Services</h3>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <span className="flex-shrink-0 w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                    <div>
                      <p className="font-medium">Central Hospital</p>
                      <p className="text-sm text-gray-500">1.2 miles away</p>
                    </div>
                  </li>
                  <li className="flex items-center">
                    <span className="flex-shrink-0 w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                    <div>
                      <p className="font-medium">Downtown Fire Station</p>
                      <p className="text-sm text-gray-500">0.8 miles away</p>
                    </div>
                  </li>
                  <li className="flex items-center">
                    <span className="flex-shrink-0 w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                    <div>
                      <p className="font-medium">Police Department</p>
                      <p className="text-sm text-gray-500">2.3 miles away</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
        
        {selectedTab === 'emergencies' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">My Emergency History</h2>
              <Link
                to="/sos"
                className="bg-emergency-red text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors inline-flex items-center"
              >
                <FiAlertTriangle className="mr-2" /> New SOS
              </Link>
            </div>
            
            {userEmergencies.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                      <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date/Time</th>
                      <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {userEmergencies.map(emergency => (
                      <tr key={emergency.id}>
                        <td className="py-3 px-4">
                          <span className="font-medium">{emergency.type}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="line-clamp-1">{emergency.description}</span>
                        </td>
                        <td className="py-3 px-4">
                          {renderEmergencyStatus(emergency.status)}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-500">
                          {formatTime(emergency.createdAt)}
                        </td>
                        <td className="py-3 px-4">
                          <button className="text-blue-600 hover:text-blue-800">
                            Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-gray-50 p-8 text-center rounded-lg">
                <FiBell className="mx-auto text-4xl text-gray-400 mb-2" />
                <h3 className="text-lg font-medium mb-1">No Emergencies Found</h3>
                <p className="text-gray-500">
                  You haven't reported any emergencies yet.
                </p>
              </div>
            )}
          </div>
        )}
        
        {selectedTab === 'map' && (
          <div>
            <h2 className="text-xl font-bold mb-4">Area Map</h2>
            <div className="h-[500px] rounded-lg overflow-hidden">
              <MapView 
                height="100%"
                showEmergencies={true}
                showAgencies={true}
              />
            </div>
            <div className="mt-4 bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Map Legend</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <span className="w-4 h-4 bg-red-500 rounded-full mr-2"></span>
                  <span>Active Emergencies</span>
                </div>
                <div className="flex items-center">
                  <span className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></span>
                  <span>Pending Response</span>
                </div>
                <div className="flex items-center">
                  <span className="w-4 h-4 bg-blue-500 rounded-full mr-2"></span>
                  <span>Medical Facilities</span>
                </div>
                <div className="flex items-center">
                  <span className="w-4 h-4 bg-green-500 rounded-full mr-2"></span>
                  <span>Police Stations</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {selectedTab === 'contacts' && (
          <div>
            <h2 className="text-xl font-bold mb-6">Emergency Contacts</h2>
            
            {/* Emergency Numbers */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="p-4 bg-red-50 rounded-lg">
                <div className="font-bold mb-1">Fire Department</div>
                <a href="tel:101" className="text-2xl text-red-600 font-bold">101</a>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="font-bold mb-1">Police</div>
                <a href="tel:100" className="text-2xl text-blue-600 font-bold">100</a>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="font-bold mb-1">Ambulance</div>
                <a href="tel:102" className="text-2xl text-green-600 font-bold">102</a>
              </div>
              
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="font-bold mb-1">Disaster Management</div>
                <a href="tel:108" className="text-2xl text-purple-600 font-bold">108</a>
              </div>
            </div>
            
            {/* Agency Contacts */}
            <h3 className="font-semibold text-lg mb-4">Nearby Agencies</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium">Central Hospital</h4>
                <p className="text-sm text-gray-500 mb-2">1.2 miles away</p>
                <div className="flex items-center mb-2">
                  <FiPhone className="text-gray-500 mr-2" />
                  <a href="tel:555-123-4567" className="text-blue-600 hover:underline">555-123-4567</a>
                </div>
                <div className="flex items-center mb-2">
                  <FiMapPin className="text-gray-500 mr-2" />
                  <span className="text-sm">123 Main St, Downtown</span>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium">Downtown Fire Station</h4>
                <p className="text-sm text-gray-500 mb-2">0.8 miles away</p>
                <div className="flex items-center mb-2">
                  <FiPhone className="text-gray-500 mr-2" />
                  <a href="tel:555-987-6543" className="text-blue-600 hover:underline">555-987-6543</a>
                </div>
                <div className="flex items-center mb-2">
                  <FiMapPin className="text-gray-500 mr-2" />
                  <span className="text-sm">456 Fire Road, Downtown</span>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium">Police Department</h4>
                <p className="text-sm text-gray-500 mb-2">2.3 miles away</p>
                <div className="flex items-center mb-2">
                  <FiPhone className="text-gray-500 mr-2" />
                  <a href="tel:555-456-7890" className="text-blue-600 hover:underline">555-456-7890</a>
                </div>
                <div className="flex items-center mb-2">
                  <FiMapPin className="text-gray-500 mr-2" />
                  <span className="text-sm">789 Law Avenue, Midtown</span>
                </div>
              </div>
              
              <Link
                to="/agencies"
                className="bg-gray-50 p-4 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:bg-gray-100"
              >
                <FiArrowRight className="text-2xl mb-2" />
                <span>View All Agencies</span>
              </Link>
            </div>
          </div>
        )}
      </div>
      
      {/* Safety Tips */}
      <div className="mt-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-blue-800 font-medium mb-2">Safety Tip:</h3>
          <p className="text-blue-700">
            Remember to keep emergency supplies like water, non-perishable food, 
            flashlights, and a first aid kit easily accessible in your home.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;