import React, { useState, useEffect } from 'react';
import { FaUser, FaInfoCircle, FaMapMarkerAlt, FaBell, FaExclamationTriangle } from 'react-icons/fa';
import { FiSend, FiCheckCircle, FiXCircle, FiClock, FiTruck, FiUsers } from 'react-icons/fi';
import MapView from "../map/MapView";
import Chat from "../common/Chat";
import { getAgencies } from "../../services/api";
import { db } from '../../services/firebase';
import { collection, query, where, onSnapshot, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../../hooks/useAuth';

// Export as named export to fix the import error
export const AgencyDashboard = () => {
  const { user } = useAuth();
  const [agencyData, setAgencyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [emergencies, setEmergencies] = useState([]);
  const [activeEmergency, setActiveEmergency] = useState(null);
  const [stats, setStats] = useState({
    activeSOSCalls: 0,
    agenciesOnline: 0,
    resourcesAvailable: 0,
    completedMissions: 0
  });

  // Fetch agency data and set up listeners for emergencies
  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real app, this would fetch actual data from the backend
        const response = await getAgencyData('current-agency-id');
        
        setAgencyData({
          id: 'agency-123',
          name: 'Metro Fire & Rescue',
          type: 'Fire Department',
          location: {
            latitude: 40.7128,
            longitude: -74.0060
          },
          status: 'active',
          resources: [
            { type: 'Fire Truck', count: 5, available: 3 },
            { type: 'Ambulance', count: 3, available: 2 },
            { type: 'Rescue Team', count: 4, available: 3 }
          ],
          personnel: {
            total: 45,
            active: 32
          }
        });

        // Set up listener for emergencies
        const emergenciesRef = collection(db, 'emergencies');
        const activeEmergenciesQuery = query(
          emergenciesRef,
          where('status', 'in', ['active', 'assigned']),
          where('assignedTo', '==', 'agency-123') // In real app, use agencyData.id
        );
        
        const unsubscribe = onSnapshot(activeEmergenciesQuery, (snapshot) => {
          const emergencyData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          
          setEmergencies(emergencyData);
          setStats(prev => ({
            ...prev,
            activeSOSCalls: emergencyData.length
          }));
        });

        // For demo purposes, simulate real-time data with mock emergencies
        const mockEmergencies = [
          {
            id: 'emer1',
            type: 'fire',
            description: 'Building fire in residential area',
            location: { latitude: 40.7128, longitude: -74.0060 },
            status: 'active',
            priority: 'high',
            timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
            reporter: {
              name: 'John Smith',
              phone: '555-123-4567'
            }
          },
          {
            id: 'emer2',
            type: 'medical',
            description: 'Medical emergency at shopping mall',
            location: { latitude: 40.7150, longitude: -74.0070 },
            status: 'assigned',
            priority: 'medium',
            timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
            reporter: {
              name: 'Emily Johnson',
              phone: '555-789-1234'
            }
          },
          {
            id: 'emer3',
            type: 'rescue',
            description: 'Person trapped in elevator',
            location: { latitude: 40.7140, longitude: -74.0090 },
            status: 'active',
            priority: 'high',
            timestamp: new Date(Date.now() - 1000 * 60 * 2), // 2 minutes ago
            reporter: {
              name: 'Michael Davis',
              phone: '555-456-7890'
            }
          }
        ];
        
        setEmergencies(mockEmergencies);
        setStats({
          activeSOSCalls: mockEmergencies.length,
          agenciesOnline: 8,
          resourcesAvailable: 15,
          completedMissions: 24
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching agency data:', error);
        setLoading(false);
      }
    };
    
    fetchData();
    // In a real app, return the unsubscribe function
  }, []);

  // Handle emergency status updates
  const handleUpdateEmergency = async (emergencyId, status) => {
    try {
      // In a real app, update the Firestore document
      // const emergencyRef = doc(db, 'emergencies', emergencyId);
      // await updateDoc(emergencyRef, {
      //   status,
      //   updatedAt: serverTimestamp(),
      //   respondedBy: user?.uid
      // });
      
      // For demo, update the local state
      setEmergencies(prevEmergencies => 
        prevEmergencies.map(emergency => 
          emergency.id === emergencyId 
            ? { ...emergency, status } 
            : emergency
        )
      );
      
      // If we were viewing the emergency details, update the active emergency
      if (activeEmergency?.id === emergencyId) {
        setActiveEmergency(prev => ({ ...prev, status }));
      }
    } catch (error) {
      console.error('Error updating emergency status:', error);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    
    const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
    
    // If less than 24 hours ago, show relative time
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) {
      return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffMins < 1440) {
      const hours = Math.floor(diffMins / 60);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else {
      // Otherwise show date and time
      return date.toLocaleString();
    }
  };

  const handleEmergencySelect = (emergency) => {
    setActiveEmergency(emergency);
    setActiveTab('details');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="agency-dashboard">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{agencyData?.name || 'Agency Dashboard'}</h1>
        <p className="text-gray-600">{agencyData?.type || 'Emergency Services'}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-emergency-red">
          <div className="flex items-center">
            <div className="bg-red-100 rounded-full p-3 mr-4">
              <FaExclamationTriangle className="text-emergency-red text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active SOS Calls</p>
              <p className="text-2xl font-bold">{stats.activeSOSCalls}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-full p-3 mr-4">
              <FiUsers className="text-green-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Personnel Active</p>
              <p className="text-2xl font-bold">{agencyData?.personnel?.active || 0}/{agencyData?.personnel?.total || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-full p-3 mr-4">
              <FiTruck className="text-blue-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Resources Available</p>
              <p className="text-2xl font-bold">{stats.resourcesAvailable}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex items-center">
            <div className="bg-purple-100 rounded-full p-3 mr-4">
              <FiClock className="text-purple-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Completed Missions</p>
              <p className="text-2xl font-bold">{stats.completedMissions}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="border-b flex overflow-x-auto">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-6 ${activeTab === 'overview' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
          >
            Overview
          </button>
          <button 
            onClick={() => setActiveTab('emergencies')}
            className={`py-3 px-6 ${activeTab === 'emergencies' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
          >
            Emergencies
          </button>
          <button 
            onClick={() => setActiveTab('details')}
            className={`py-3 px-6 ${activeTab === 'details' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'} ${!activeEmergency ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!activeEmergency}
          >
            Emergency Details
          </button>
          <button 
            onClick={() => setActiveTab('resources')}
            className={`py-3 px-6 ${activeTab === 'resources' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
          >
            Resources
          </button>
          <button 
            onClick={() => setActiveTab('communication')}
            className={`py-3 px-6 ${activeTab === 'communication' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
          >
            Communication
          </button>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <h2 className="text-lg font-semibold mb-4">Emergency Map</h2>
                <div className="h-96 rounded-lg overflow-hidden">
                  <MapView 
                    height="100%" 
                    center={[agencyData?.location?.latitude || 40.7128, agencyData?.location?.longitude || -74.0060]}
                    showEmergencies={true}
                  />
                </div>
              </div>
              
              <div>
                <h2 className="text-lg font-semibold mb-4">Recent Alerts</h2>
                <div className="space-y-4">
                  {emergencies.slice(0, 5).map((emergency) => (
                    <div 
                      key={emergency.id} 
                      className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleEmergencySelect(emergency)}
                    >
                      <div className="flex items-center mb-2">
                        <span className={`w-3 h-3 rounded-full mr-2 ${
                          emergency.priority === 'high' ? 'bg-red-500' : 
                          emergency.priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                        }`}></span>
                        <span className="font-medium">{emergency.type.toUpperCase()}</span>
                        <span className="text-xs text-gray-500 ml-auto">{formatTime(emergency.timestamp)}</span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">{emergency.description}</p>
                      <div className="flex justify-between mt-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          emergency.status === 'active' ? 'bg-red-100 text-red-800' : 
                          emergency.status === 'assigned' ? 'bg-yellow-100 text-yellow-800' : 
                          emergency.status === 'en-route' ? 'bg-blue-100 text-blue-800' : 
                          emergency.status === 'on-scene' ? 'bg-purple-100 text-purple-800' : 
                          'bg-green-100 text-green-800'
                        }`}>
                          {emergency.status.toUpperCase()}
                        </span>
                        <button 
                          className="text-blue-600 text-xs hover:underline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEmergencySelect(emergency);
                          }}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Emergencies Tab */}
          {activeTab === 'emergencies' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">All Active Emergencies</h2>
                <div className="flex items-center">
                  <span className="text-gray-500 text-sm mr-2">Filter:</span>
                  <select className="border rounded-md p-1 text-sm">
                    <option value="all">All Types</option>
                    <option value="fire">Fire</option>
                    <option value="medical">Medical</option>
                    <option value="rescue">Rescue</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reporter</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reported</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {emergencies.map((emergency) => (
                      <tr 
                        key={emergency.id}
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleEmergencySelect(emergency)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            emergency.type === 'fire' ? 'bg-red-100 text-red-800' : 
                            emergency.type === 'medical' ? 'bg-blue-100 text-blue-800' : 
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {emergency.type.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{emergency.description}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            emergency.status === 'active' ? 'bg-red-100 text-red-800' : 
                            emergency.status === 'assigned' ? 'bg-yellow-100 text-yellow-800' : 
                            emergency.status === 'en-route' ? 'bg-blue-100 text-blue-800' : 
                            emergency.status === 'on-scene' ? 'bg-purple-100 text-purple-800' : 
                            'bg-green-100 text-green-800'
                          }`}>
                            {emergency.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{emergency.reporter?.name}</div>
                          <div className="text-sm text-gray-500">{emergency.reporter?.phone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatTime(emergency.timestamp)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEmergencySelect(emergency);
                            }}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            Details
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateEmergency(
                                emergency.id,
                                emergency.status === 'active' ? 'en-route' : 
                                emergency.status === 'assigned' ? 'en-route' : 
                                emergency.status === 'en-route' ? 'on-scene' : 
                                emergency.status === 'on-scene' ? 'resolved' : 'resolved'
                              );
                            }}
                            className="text-green-600 hover:text-green-900"
                          >
                            {emergency.status === 'active' || emergency.status === 'assigned' ? 'Respond' : 
                             emergency.status === 'en-route' ? 'Arrive' : 
                             emergency.status === 'on-scene' ? 'Resolve' : 'Closed'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Emergency Details Tab */}
          {activeTab === 'details' && activeEmergency && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        activeEmergency.type === 'fire' ? 'bg-red-100 text-red-800' : 
                        activeEmergency.type === 'medical' ? 'bg-blue-100 text-blue-800' : 
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {activeEmergency.type.toUpperCase()}
                      </span>
                      <span className={`ml-2 px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        activeEmergency.status === 'active' ? 'bg-red-100 text-red-800' : 
                        activeEmergency.status === 'assigned' ? 'bg-yellow-100 text-yellow-800' : 
                        activeEmergency.status === 'en-route' ? 'bg-blue-100 text-blue-800' : 
                        activeEmergency.status === 'on-scene' ? 'bg-purple-100 text-purple-800' : 
                        'bg-green-100 text-green-800'
                      }`}>
                        {activeEmergency.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">Reported {formatTime(activeEmergency.timestamp)}</p>
                  </div>
                  
                  <h2 className="text-xl font-bold mb-2">{activeEmergency.description}</h2>
                  
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border-l-2 border-gray-300 pl-4">
                      <h3 className="text-sm text-gray-500">Reporter</h3>
                      <p className="font-medium">{activeEmergency.reporter?.name}</p>
                      <p className="text-sm">{activeEmergency.reporter?.phone}</p>
                    </div>
                    
                    <div className="border-l-2 border-gray-300 pl-4">
                      <h3 className="text-sm text-gray-500">Location</h3>
                      <p className="font-medium">
                        {activeEmergency.location?.latitude.toFixed(6)}, {activeEmergency.location?.longitude.toFixed(6)}
                      </p>
                      <p className="text-sm">Exact coordinates</p>
                    </div>
                  </div>
                </div>
                
                <div className="h-80 rounded-lg overflow-hidden">
                  <MapView 
                    height="100%" 
                    center={[activeEmergency.location?.latitude, activeEmergency.location?.longitude]}
                    zoom={15}
                  />
                </div>
                
                <div className="bg-white p-4 rounded-lg border shadow-sm">
                  <h3 className="font-medium mb-2">Update Emergency Status</h3>
                  <div className="flex flex-wrap gap-2">
                    <button 
                      onClick={() => handleUpdateEmergency(activeEmergency.id, 'en-route')}
                      className={`px-3 py-1 rounded ${
                        activeEmergency.status === 'active' || activeEmergency.status === 'assigned'
                          ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                      disabled={activeEmergency.status !== 'active' && activeEmergency.status !== 'assigned'}
                    >
                      <FiTruck className="inline mr-1" /> En Route
                    </button>
                    
                    <button 
                      onClick={() => handleUpdateEmergency(activeEmergency.id, 'on-scene')}
                      className={`px-3 py-1 rounded ${
                        activeEmergency.status === 'en-route'
                          ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                      disabled={activeEmergency.status !== 'en-route'}
                    >
                      <FiMapMarkerAlt className="inline mr-1" /> On Scene
                    </button>
                    
                    <button 
                      onClick={() => handleUpdateEmergency(activeEmergency.id, 'resolved')}
                      className={`px-3 py-1 rounded ${
                        activeEmergency.status === 'on-scene'
                          ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                      disabled={activeEmergency.status !== 'on-scene'}
                    >
                      <FiCheckCircle className="inline mr-1" /> Resolve
                    </button>
                    
                    <button 
                      onClick={() => handleUpdateEmergency(activeEmergency.id, 'cancelled')}
                      className="px-3 py-1 rounded bg-red-600 text-white ml-auto"
                    >
                      <FiXCircle className="inline mr-1" /> Cancel
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4 border-b">
                  <h3 className="font-medium">Communication</h3>
                </div>
                <Chat channelId={`emergency-${activeEmergency.id}`} agencyMode={true} />
              </div>
            </div>
          )}

          {/* Resources Tab */}
          {activeTab === 'resources' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Resource Management</h2>
                <button className="bg-blue-600 text-white px-4 py-1 rounded">
                  Request Additional Resources
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {agencyData?.resources?.map((resource, index) => (
                  <div key={index} className="bg-white shadow-sm rounded-lg p-4 border">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{resource.type}</h3>
                      <span className={`
                        px-2 py-1 text-xs rounded-full font-medium
                        ${resource.available / resource.count > 0.5 ? 'bg-green-100 text-green-800' : 
                          resource.available / resource.count > 0.25 ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'}
                      `}>
                        {resource.available} of {resource.count} Available
                      </span>
                    </div>
                    
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className={`h-2.5 rounded-full ${
                            resource.available / resource.count > 0.5 ? 'bg-green-600' : 
                            resource.available / resource.count > 0.25 ? 'bg-yellow-500' : 
                            'bg-red-600'
                          }`}
                          style={{ width: `${(resource.available / resource.count) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-between text-sm">
                      <button className="text-blue-600 hover:underline">Deploy</button>
                      <button className="text-blue-600 hover:underline">Update Status</button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8">
                <h3 className="font-medium mb-4">Personnel Management</h3>
                <div className="bg-white shadow-sm rounded-lg p-4 border">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div className="p-4">
                      <div className="text-2xl font-bold text-blue-600">{agencyData?.personnel?.total || 0}</div>
                      <p className="text-gray-500">Total Personnel</p>
                    </div>
                    <div className="p-4">
                      <div className="text-2xl font-bold text-green-600">{agencyData?.personnel?.active || 0}</div>
                      <p className="text-gray-500">Currently Active</p>
                    </div>
                    <div className="p-4">
                      <div className="text-2xl font-bold text-yellow-600">{agencyData?.personnel?.total - agencyData?.personnel?.active || 0}</div>
                      <p className="text-gray-500">Off-Duty</p>
                    </div>
                    <div className="p-4">
                      <div className="text-2xl font-bold text-purple-600">4</div>
                      <p className="text-gray-500">Teams Deployed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Communication Tab */}
          {activeTab === 'communication' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4 border-b">
                  <h3 className="font-medium">Emergency Channel</h3>
                </div>
                <Chat channelId="emergency-general" agencyMode={true} />
              </div>
              
              <div>
                <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                  <h3 className="font-medium mb-4">Communication Channels</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center justify-between p-2 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center">
                        <span className="w-3 h-3 bg-blue-600 rounded-full mr-2"></span>
                        <span>Emergency General</span>
                      </div>
                      <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded-full">Active</span>
                    </li>
                    <li className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg border">
                      <div className="flex items-center">
                        <span className="w-3 h-3 bg-green-600 rounded-full mr-2"></span>
                        <span>Medical Teams</span>
                      </div>
                      <span className="text-xs bg-gray-200 text-gray-800 px-2 py-1 rounded-full">3 online</span>
                    </li>
                    <li className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg border">
                      <div className="flex items-center">
                        <span className="w-3 h-3 bg-red-600 rounded-full mr-2"></span>
                        <span>Fire Response</span>
                      </div>
                      <span className="text-xs bg-gray-200 text-gray-800 px-2 py-1 rounded-full">2 online</span>
                    </li>
                    <li className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg border">
                      <div className="flex items-center">
                        <span className="w-3 h-3 bg-yellow-600 rounded-full mr-2"></span>
                        <span>Command Center</span>
                      </div>
                      <span className="text-xs bg-gray-200 text-gray-800 px-2 py-1 rounded-full">4 online</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-4">
                  <h3 className="font-medium mb-4">Quick Contacts</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center p-2 hover:bg-gray-50 rounded-lg border">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                        CC
                      </div>
                      <div>
                        <div className="font-medium">Command Center</div>
                        <div className="text-sm text-gray-500">Online</div>
                      </div>
                      <button className="ml-auto bg-blue-600 text-white p-2 rounded-full">
                        <FiSend size={14} />
                      </button>
                    </li>
                    <li className="flex items-center p-2 hover:bg-gray-50 rounded-lg border">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                        MT
                      </div>
                      <div>
                        <div className="font-medium">Medical Team Alpha</div>
                        <div className="text-sm text-gray-500">Online</div>
                      </div>
                      <button className="ml-auto bg-blue-600 text-white p-2 rounded-full">
                        <FiSend size={14} />
                      </button>
                    </li>
                    <li className="flex items-center p-2 hover:bg-gray-50 rounded-lg border">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                        PD
                      </div>
                      <div>
                        <div className="font-medium">Police Department</div>
                        <div className="text-sm text-gray-500">Away</div>
                      </div>
                      <button className="ml-auto bg-blue-600 text-white p-2 rounded-full">
                        <FiSend size={14} />
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgencyDashboard;