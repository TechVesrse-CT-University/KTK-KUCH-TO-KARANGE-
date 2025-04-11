import React, { createContext, useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

export const MapContext = createContext();

export const MapProvider = ({ children }) => {
  const [location, setLocation] = useState(null);
  const [emergencies, setEmergencies] = useState([]);
  const [agencies, setAgencies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          // Default location (could be a city center)
          setLocation({ lat: 40.7128, lng: -74.0060 });
        }
      );
    }
  }, []);

  // Get emergencies from Firebase
  useEffect(() => {
    try {
      const emergenciesRef = collection(db, 'emergencies');
      
      const unsubscribe = onSnapshot(emergenciesRef, (snapshot) => {
        const emergenciesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        
        setEmergencies(emergenciesData);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error('Error fetching emergencies:', error);
    }
  }, []);

  // Get agencies from Firebase
  useEffect(() => {
    try {
      const agenciesRef = collection(db, 'agencies');
      
      const unsubscribe = onSnapshot(agenciesRef, (snapshot) => {
        const agenciesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        
        setAgencies(agenciesData);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error('Error fetching agencies:', error);
      setLoading(false);
    }
  }, []);

  const value = {
    location,
    emergencies,
    agencies,
    loading,
  };

  return (
    <MapContext.Provider value={value}>
      {children}
    </MapContext.Provider>
  );
};