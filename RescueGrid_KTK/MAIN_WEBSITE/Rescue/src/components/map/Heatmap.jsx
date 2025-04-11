import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';

const Heatmap = ({ data }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !data.length) return;

    // Convert data to format expected by leaflet.heat
    const heatData = data.map(point => [
      point.lat || point.latitude,
      point.lng || point.longitude,
      point.intensity || 0.5 // Default intensity if not provided
    ]);

    // Create heat layer
    const heatLayer = L.heatLayer(heatData, { 
      radius: 25,
      blur: 15,
      maxZoom: 17,
      gradient: {
        0.2: '#FEF3C7', // Light yellow
        0.4: '#FCD34D', // Yellow
        0.6: '#F59E0B', // Amber
        0.8: '#D97706', // Dark amber
        1.0: '#B91C1C'  // Red
      }
    }).addTo(map);

    // Clean up on unmount
    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, data]);

  return null;
};

export default Heatmap;