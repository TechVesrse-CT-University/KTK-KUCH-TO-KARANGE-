// Mock API service for development purposes

export const getAgencies = async () => {
  // Normally would fetch from an API or Firebase
  return [
    {
      id: '1',
      name: 'City Fire Department',
      type: 'fire',
      location: { latitude: 40.7128, longitude: -74.0060 },
      address: '123 Main St, New York, NY',
      phone: '555-123-4567',
      email: 'contact@cityfire.org',
      status: 'active',
      responseTime: '5 min'
    },
    {
      id: '2',
      name: 'Metro Medical Response',
      type: 'medical',
      location: { latitude: 40.7155, longitude: -74.0080 },
      address: '456 Park Ave, New York, NY',
      phone: '555-987-6543',
      email: 'help@metromedical.org',
      status: 'active',
      responseTime: '7 min'
    },
    {
      id: '3',
      name: 'Central Police Department',
      type: 'police',
      location: { latitude: 40.7112, longitude: -74.0040 },
      address: '789 Broadway, New York, NY',
      phone: '555-456-7890',
      email: 'info@centralpolice.gov',
      status: 'busy',
      responseTime: '15 min'
    }
  ];
};

export const getSOSHeatmap = async () => {
  // Mock heatmap data for SOS incidents
  return [
    { latitude: 40.7128, longitude: -74.0060, intensity: 0.8 },
    { latitude: 40.7155, longitude: -74.0080, intensity: 0.5 },
    { latitude: 40.7112, longitude: -74.0040, intensity: 0.3 },
    { latitude: 40.7145, longitude: -74.0070, intensity: 0.9 },
    { latitude: 40.7135, longitude: -74.0050, intensity: 0.7 },
    { latitude: 40.7125, longitude: -74.0065, intensity: 0.4 },
    { latitude: 40.7115, longitude: -74.0075, intensity: 0.6 }
  ];
};

export const getEmergencyStats = async () => {
  // Mock emergency statistics
  return {
    activeEmergencies: 12,
    resolvedLast24h: 8,
    averageResponseTime: '7 min',
    availableAgencies: 15
  };
};

export const sendSOSSignal = async (userId, location, description) => {
  // Mock SOS signal sending
  console.log('SOS Signal:', { userId, location, description });
  
  return {
    success: true,
    emergencyId: 'emer-' + Math.random().toString(36).substr(2, 9),
    estimatedResponse: '5 minutes'
  };
};

export const updateEmergencyStatus = async (emergencyId, status) => {
  // Mock emergency status update
  console.log('Emergency Status Update:', { emergencyId, status });
  
  return {
    success: true,
    updated: new Date().toISOString()
  };
};