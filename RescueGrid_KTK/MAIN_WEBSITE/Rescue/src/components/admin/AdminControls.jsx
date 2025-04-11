import React, { useState } from 'react';
import { FiFilter, FiRefreshCw, FiAlertCircle, FiBell, FiCheck } from 'react-icons/fi';

const AdminControls = ({ agencies = [] }) => {
  const [selectedAgencies, setSelectedAgencies] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [showNotification, setShowNotification] = useState(false);
  
  const handleAgencySelect = (agencyId) => {
    if (selectedAgencies.includes(agencyId)) {
      setSelectedAgencies(selectedAgencies.filter(id => id !== agencyId));
    } else {
      setSelectedAgencies([...selectedAgencies, agencyId]);
    }
  };
  
  const handleBroadcastAlert = () => {
    // In a real app, this would send alerts to selected agencies
    console.log('Broadcasting alert to:', selectedAgencies);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };
  
  const isAllSelected = selectedAgencies.length === agencies.length;
  
  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedAgencies([]);
    } else {
      setSelectedAgencies(agencies.map(agency => agency.id));
    }
  };
  
  const filteredAgencies = filterType === 'all'
    ? agencies
    : agencies.filter(agency => agency.type === filterType);

  return (
    <div className="admin-controls bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex flex-wrap items-center justify-between mb-6">
        <h2 className="text-xl font-bold mb-2 md:mb-0">Agency Control Panel</h2>
        
        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiFilter className="text-gray-400" />
            </div>
            <select 
              className="pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="fire">Fire Departments</option>
              <option value="medical">Medical Teams</option>
              <option value="police">Police</option>
              <option value="rescue">Rescue Teams</option>
            </select>
          </div>
          
          <button 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center"
            onClick={() => console.log('Refresh')}
          >
            <FiRefreshCw className="mr-2" /> Refresh
          </button>
          
          <button 
            className={`px-4 py-2 rounded-md transition flex items-center ${
              selectedAgencies.length > 0
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
            onClick={handleBroadcastAlert}
            disabled={selectedAgencies.length === 0}
          >
            <FiAlertCircle className="mr-2" /> Broadcast Alert
          </button>
        </div>
      </div>
      
      {showNotification && (
        <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-md flex items-center">
          <FiCheck className="mr-2" /> Alert successfully broadcast to {selectedAgencies.length} agencies
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={isAllSelected}
                    onChange={toggleSelectAll}
                  />
                  <span className="ml-2">Select All</span>
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Agency
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Response Time
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAgencies.map(agency => (
              <tr key={agency.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={selectedAgencies.includes(agency.id)}
                    onChange={() => handleAgencySelect(agency.id)}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                      agency.type === 'fire' ? 'bg-red-100 text-red-600' : 
                      agency.type === 'medical' ? 'bg-blue-100 text-blue-600' : 
                      agency.type === 'police' ? 'bg-green-100 text-green-600' : 
                      'bg-yellow-100 text-yellow-600'
                    }`}>
                      {agency.type === 'fire' && '🔥'}
                      {agency.type === 'medical' && '🚑'}
                      {agency.type === 'police' && '👮'}
                      {agency.type === 'rescue' && '🆘'}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {agency.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {agency.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    agency.type === 'fire' ? 'bg-red-100 text-red-800' : 
                    agency.type === 'medical' ? 'bg-blue-100 text-blue-800' : 
                    agency.type === 'police' ? 'bg-green-100 text-green-800' : 
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {agency.type.charAt(0).toUpperCase() + agency.type.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    agency.status === 'active' ? 'bg-green-100 text-green-800' : 
                    agency.status === 'busy' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-red-100 text-red-800'
                  }`}>
                    {agency.status.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {agency.responseTime}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">
                    Contact
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    <FiBell />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminControls;