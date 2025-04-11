import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiAlertTriangle } from 'react-icons/fi';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <div className="text-9xl font-bold text-emergency-red mb-6">
        <FiAlertTriangle className="inline-block" />
      </div>
      <h1 className="text-9xl font-bold text-emergency-red">404</h1>
      <h2 className="text-3xl font-bold mt-6 mb-2">Page Not Found</h2>
      <p className="text-lg text-gray-600 mb-8 max-w-md">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <Link 
          to="/" 
          className="px-6 py-3 bg-emergency-red text-white font-medium rounded-lg hover:bg-red-700 transition-colors flex items-center"
        >
          <FiHome className="mr-2" />
          Back to Home
        </Link>
        <Link 
          to="/dashboard" 
          className="px-6 py-3 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors"
        >
          Go to Dashboard
        </Link>
      </div>
      
      <div className="mt-12 p-6 bg-blue-50 rounded-lg max-w-md">
        <h3 className="font-bold text-blue-800 mb-2">Need Help?</h3>
        <p className="text-blue-700">
          If you're experiencing an emergency, please call our emergency hotline at 
          <a href="tel:911" className="font-bold ml-1 underline">911</a> or use the SOS button on the dashboard.
        </p>
      </div>
    </div>
  );
};

export default NotFound;