import React, { useState } from 'react';
import { FiGrid, FiUsers, FiMapPin, FiBell, FiSettings } from 'react-icons/fi';
import AdminDashboard from '../components/admin/AdminDashboard';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Define tab components
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <AdminDashboard />;
      case 'agencies':
        return <div>Agency Management Component</div>;
      case 'emergencies':
        return <div>Emergency Monitoring Component</div>;
      case 'notifications':
        return <div>Notification System Component</div>;
      case 'settings':
        return <div>Admin Settings Component</div>;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="admin-panel">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <p className="text-gray-600">System management and monitoring</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap border-b mb-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center py-3 px-4 ${
            activeTab === 'overview'
              ? 'text-emergency-red border-b-2 border-emergency-red'
              : 'text-gray-500 hover:text-emergency-red'
          }`}
        >
          <FiGrid className="mr-2" />
          <span className="font-medium">Overview</span>
        </button>
        
        <button
          onClick={() => setActiveTab('agencies')}
          className={`flex items-center py-3 px-4 ${
            activeTab === 'agencies'
              ? 'text-emergency-red border-b-2 border-emergency-red'
              : 'text-gray-500 hover:text-emergency-red'
          }`}
        >
          <FiUsers className="mr-2" />
          <span className="font-medium">Agencies</span>
        </button>
        
        <button
          onClick={() => setActiveTab('emergencies')}
          className={`flex items-center py-3 px-4 ${
            activeTab === 'emergencies'
              ? 'text-emergency-red border-b-2 border-emergency-red'
              : 'text-gray-500 hover:text-emergency-red'
          }`}
        >
          <FiMapPin className="mr-2" />
          <span className="font-medium">Emergencies</span>
        </button>
        
        <button
          onClick={() => setActiveTab('notifications')}
          className={`flex items-center py-3 px-4 ${
            activeTab === 'notifications'
              ? 'text-emergency-red border-b-2 border-emergency-red'
              : 'text-gray-500 hover:text-emergency-red'
          }`}
        >
          <FiBell className="mr-2" />
          <span className="font-medium">Notifications</span>
        </button>
        
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center py-3 px-4 ${
            activeTab === 'settings'
              ? 'text-emergency-red border-b-2 border-emergency-red'
              : 'text-gray-500 hover:text-emergency-red'
          }`}
        >
          <FiSettings className="mr-2" />
          <span className="font-medium">Settings</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default AdminPanel;