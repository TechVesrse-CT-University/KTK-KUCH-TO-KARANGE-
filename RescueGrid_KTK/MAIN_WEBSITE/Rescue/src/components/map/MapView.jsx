import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useMap as useMapContext } from '../../hooks/useMap';
import Heatmap from './Heatmap';

// Fix for default marker icons in Leaflet with webpack/vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Custom icons
const emergencyIcon = new L.Icon({
  iconUrl: '/src/assets/images/icons/emergency-marker.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

const agencyIcon = new L.Icon({
  iconUrl: '/src/assets/images/icons/agency-marker.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

// Component to handle map view updates
const MapUpdater = ({ center, zoom }) => {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.setView(center, zoom || map.getZoom());
    }
  }, [center, zoom, map]);
  
  return null;
};

const MapView = ({ 
  height = '500px', 
  showEmergencies = true, 
  showAgencies = true, 
  heatmapData = [],
  center = null,
  zoom = 12
}) => {
  const { location, emergencies, agencies } = useMapContext();
  const [mapCenter, setMapCenter] = useState(center || [40.7128, -74.0060]); // Default to NYC
  const [mapReady, setMapReady] = useState(false);
  
  // Update map center when location changes if no explicit center provided
  useEffect(() => {
    if (location && !center) {
      setMapCenter([location.lat, location.lng]);
    }
  }, [location, center]);

  // Set map as ready after a timeout to ensure proper rendering
  useEffect(() => {
    const timer = setTimeout(() => {
      setMapReady(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ height }} className="rounded-lg overflow-hidden">
      <MapContainer 
        center={mapCenter} 
        zoom={zoom} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Update map center when it changes */}
        <MapUpdater center={mapCenter} zoom={zoom} />
        
        {/* Display emergency markers */}
        {showEmergencies && emergencies.map(emergency => (
          <Marker 
            key={emergency.id} 
            position={[emergency.location.latitude, emergency.location.longitude]}
            icon={emergencyIcon}
          >
            <Popup>
              <div>
                <h3 className="font-bold">{emergency.type}</h3>
                <p>{emergency.description}</p>
                <p className="text-sm text-gray-500">
                  Reported: {new Date(emergency.createdAt.seconds * 1000).toLocaleString()}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
        
        {/* Display agency markers */}
        {showAgencies && agencies.map(agency => (
          <Marker 
            key={agency.id} 
            position={[agency.location.latitude, agency.location.longitude]}
            icon={agencyIcon}
          >
            <Popup>
              <div>
                <h3 className="font-bold">{agency.name}</h3>
                <p>{agency.description}</p>
                <p className="text-sm">{agency.phone}</p>
              </div>
            </Popup>
          </Marker>
        ))}
        
        {/* Display heatmap if data is provided */}
        {heatmapData.length > 0 && mapReady && (
          <Heatmap data={heatmapData} />
        )}
      </MapContainer>
    </div>
  );
};

export default MapView;