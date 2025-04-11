import React, { useEffect, useState } from 'react';
import { getAgencies, getSOSHeatmap, getEmergencyStats } from '../../services/api';
import MapView from '../map/MapView';
import AdminControls from './AdminControls';
import { FiAlertOctagon, FiClock, FiUsers, FiAward } from 'react-icons/fi';

const AdminDashboard = () => {
    const [agencies, setAgencies] = useState([]);
    const [heatmapData, setHeatmapData] = useState([]);
    const [stats, setStats] = useState({
        activeEmergencies: 0,
        resolvedLast24h: 0,
        averageResponseTime: '0 min',
        availableAgencies: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const agencyData = await getAgencies();
                const sosData = await getSOSHeatmap();
                const statsData = await getEmergencyStats();
                
                setAgencies(agencyData);
                setHeatmapData(sosData);
                setStats(statsData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="loader"></div>
            </div>
        );
    }

    return (
        <div className="admin-dashboard">
            <h2 className="text-2xl font-bold mb-6">Admin Overview</h2>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
                    <div className="rounded-full bg-red-100 p-4 mr-4">
                        <FiAlertOctagon className="text-red-600 text-xl" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Active Emergencies</p>
                        <p className="text-2xl font-bold">{stats.activeEmergencies}</p>
                    </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
                    <div className="rounded-full bg-green-100 p-4 mr-4">
                        <FiAward className="text-green-600 text-xl" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Resolved (24h)</p>
                        <p className="text-2xl font-bold">{stats.resolvedLast24h}</p>
                    </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
                    <div className="rounded-full bg-blue-100 p-4 mr-4">
                        <FiClock className="text-blue-600 text-xl" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Avg Response Time</p>
                        <p className="text-2xl font-bold">{stats.averageResponseTime}</p>
                    </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
                    <div className="rounded-full bg-purple-100 p-4 mr-4">
                        <FiUsers className="text-purple-600 text-xl" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Available Agencies</p>
                        <p className="text-2xl font-bold">{stats.availableAgencies}</p>
                    </div>
                </div>
            </div>
            
            {/* Agency Controls */}
            <AdminControls agencies={agencies} />
            
            {/* Map View */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                <div className="p-4 border-b">
                    <h3 className="font-semibold">Emergency Heatmap</h3>
                </div>
                <div className="h-96">
                    <MapView 
                        height="100%" 
                        heatmapData={heatmapData} 
                        agencies={agencies}
                    />
                </div>
            </div>
            
            {/* Recent Emergencies */}
            <div className="bg-white rounded-lg shadow-md">
                <div className="p-4 border-b flex justify-between items-center">
                    <h3 className="font-semibold">Recent Emergencies</h3>
                    <button className="text-blue-600 hover:text-blue-800 text-sm">
                        View All
                    </button>
                </div>
                <div className="p-4">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Type
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Location
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Reported
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {/* Mock data - in a real app, this would be from the API */}
                            {[
                                {
                                    id: 'e1',
                                    type: 'fire',
                                    location: '123 Main St, Downtown',
                                    status: 'active',
                                    reported: '10 minutes ago'
                                },
                                {
                                    id: 'e2',
                                    type: 'medical',
                                    location: '456 Park Ave, Midtown',
                                    status: 'pending',
                                    reported: '15 minutes ago'
                                },
                                {
                                    id: 'e3',
                                    type: 'flood',
                                    location: '789 River Rd, Westside',
                                    status: 'resolved',
                                    reported: '1 hour ago'
                                }
                            ].map(emergency => (
                                <tr key={emergency.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            emergency.type === 'fire' ? 'bg-red-100 text-red-800' : 
                                            emergency.type === 'medical' ? 'bg-blue-100 text-blue-800' : 
                                            'bg-teal-100 text-teal-800'
                                        }`}>
                                            {emergency.type.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {emergency.location}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            emergency.status === 'active' ? 'bg-red-100 text-red-800' : 
                                            emergency.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                            'bg-green-100 text-green-800'
                                        }`}>
                                            {emergency.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {emergency.reported}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button className="text-blue-600 hover:text-blue-900 mr-3">
                                            Details
                                        </button>
                                        <button className="text-red-600 hover:text-red-900">
                                            Assign
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;