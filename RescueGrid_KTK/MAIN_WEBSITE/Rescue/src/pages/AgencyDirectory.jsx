import React, { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiMapPin, FiPhone, FiMail, FiArrowRight } from 'react-icons/fi';
import { getAgencies } from '../services/api';
import MapView from '../components/map/MapView';
import AgencyCard from '../components/agency/AgencyCard';

const AgencyDirectory = () => {
  const [agencies, setAgencies] = useState([]);
  const [filteredAgencies, setFilteredAgencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedAgency, setSelectedAgency] = useState(null);
  
  useEffect(() => {
    const fetchAgencies = async () => {
      try {
        const agencyData = await getAgencies();
        setAgencies(agencyData);
        setFilteredAgencies(agencyData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching agencies:', error);
        setLoading(false);
      }
    };
    
    fetchAgencies();
  }, []);

  // Filter agencies when search term or type changes
  useEffect(() => {
    const filtered = agencies.filter(agency => {
      const matchesSearch = searchTerm === '' || 
        agency.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = selectedType === 'all' || 
        agency.type === selectedType;
      
      return matchesSearch && matchesType;
    });
    
    setFilteredAgencies(filtered);
  }, [searchTerm, selectedType, agencies]);

  const handleAgencyClick = (agency) => {
    setSelectedAgency(agency);
  };

  const agencyTypes = [
    { id: 'all', label: 'All Agencies' },
    { id: 'fire', label: 'Fire Departments' },
    { id: 'medical', label: 'Medical Services' },
    { id: 'police', label: 'Police' },
    { id: 'rescue', label: 'Rescue Teams' }
  ];
  
  return (
    <div className="agency-directory">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Emergency Service Agencies</h1>
        <p className="text-gray-600">
          Find and contact emergency service providers in your area
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search agencies by name..."
              className="pl-10 w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emergency-red"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="md:w-64 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiFilter className="text-gray-400" />
            </div>
            <select
              className="pl-10 w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emergency-red appearance-none"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              {agencyTypes.map(type => (
                <option key={type.id} value={type.id}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="loader"></div>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column: Agency List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 border-b">
                <h2 className="font-semibold">Available Agencies</h2>
                <p className="text-sm text-gray-500">
                  {filteredAgencies.length} agencies found
                </p>
              </div>
              
              <div className="divide-y max-h-[600px] overflow-y-auto">
                {filteredAgencies.length > 0 ? (
                  filteredAgencies.map(agency => (
                    <div 
                      key={agency.id}
                      onClick={() => handleAgencyClick(agency)}
                      className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 ${
                        selectedAgency?.id === agency.id ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-center">
                        <div className={`
                          w-10 h-10 rounded-full flex items-center justify-center mr-3
                          ${agency.type === 'fire' ? 'bg-red-100 text-red-600' : 
                            agency.type === 'medical' ? 'bg-blue-100 text-blue-600' : 
                            agency.type === 'police' ? 'bg-green-100 text-green-600' : 
                            'bg-yellow-100 text-yellow-600'}
                        `}>
                          {agency.type === 'fire' && '🔥'}
                          {agency.type === 'medical' && '🚑'}
                          {agency.type === 'police' && '👮'}
                          {agency.type === 'rescue' && '🆘'}
                        </div>
                        
                        <div>
                          <h3 className="font-medium">{agency.name}</h3>
                          <div className="flex items-center text-sm text-gray-500">
                            <FiMapPin size={12} className="mr-1" />
                            <span>{agency.address}</span>
                          </div>
                          
                          <div className="mt-2 flex items-center">
                            <span className={`
                              text-xs px-2 py-1 rounded-full
                              ${agency.status === 'active' ? 'bg-green-100 text-green-800' : 
                                agency.status === 'busy' ? 'bg-yellow-100 text-yellow-800' : 
                                'bg-gray-100 text-gray-800'}
                            `}>
                              {agency.status.toUpperCase()}
                            </span>
                            <span className="ml-2 text-xs text-gray-500">
                              Response: {agency.responseTime}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    No agencies match your search criteria
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Right Column: Map and Details */}
          <div className="lg:col-span-2">
            {/* Map View */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <div className="h-[300px]">
                <MapView 
                  height="100%" 
                  center={selectedAgency ? 
                    [selectedAgency.location.latitude, selectedAgency.location.longitude] : 
                    null
                  }
                  zoom={selectedAgency ? 15 : 12}
                  showAgencies={true}
                  showEmergencies={false}
                />
              </div>
            </div>
            
            {/* Agency Details */}
            {selectedAgency ? (
              <AgencyCard agency={selectedAgency} />
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <h3 className="text-xl font-semibold mb-2">Agency Details</h3>
                <p className="text-gray-500 mb-4">
                  Select an agency from the list to view more details
                </p>
                <FiArrowRight size={24} className="text-gray-400 mx-auto" />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AgencyDirectory;