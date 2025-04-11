import React, { createContext, useState, useEffect } from 'react';
import { collection, onSnapshot, query, where, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../hooks/useAuth';

export const EmergencyContext = createContext();

export const EmergencyProvider = ({ children }) => {
  const { user } = useAuth();
  const [emergencies, setEmergencies] = useState([]);
  const [activeEmergencies, setActiveEmergencies] = useState([]);
  const [userEmergencies, setUserEmergencies] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch all emergencies
  useEffect(() => {
    const fetchEmergencies = async () => {
      try {
        const emergenciesRef = collection(db, 'emergencies');
        const q = query(
          emergenciesRef,
          orderBy('createdAt', 'desc')
        );
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const emergencyData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate?.() || new Date()
          }));
          
          setEmergencies(emergencyData);
          setActiveEmergencies(emergencyData.filter(e => e.status === 'active'));
          
          if (user) {
            setUserEmergencies(emergencyData.filter(e => e.userId === user.uid));
          }
          
          setLoading(false);
        });
  
        return () => unsubscribe();
      } catch (error) {
        console.error('Error fetching emergencies:', error);
        setLoading(false);
        
        // Mock data for development
        const mockEmergencies = [
          {
            id: 'emer1',
            type: 'fire',
            description: 'Building fire in residential area',
            location: { latitude: 40.7128, longitude: -74.0060 },
            status: 'active',
            priority: 'high',
            createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
            userId: 'user1'
          },
          {
            id: 'emer2',
            type: 'medical',
            description: 'Medical emergency at shopping mall',
            location: { latitude: 40.7120, longitude: -74.0050 },
            status: 'active',
            priority: 'medium',
            createdAt: new Date(Date.now() - 1000 * 60 * 15), // 15 min ago
            userId: 'user2'
          },
          {
            id: 'emer3',
            type: 'flood',
            description: 'Flash flooding in downtown area',
            location: { latitude: 40.7110, longitude: -74.0055 },
            status: 'resolved',
            priority: 'high',
            createdAt: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
            userId: 'user3'
          }
        ];
        
        setEmergencies(mockEmergencies);
        setActiveEmergencies(mockEmergencies.filter(e => e.status === 'active'));
      }
    };
    
    fetchEmergencies();
  }, [user]);
  
  // Update user emergencies when user changes
  useEffect(() => {
    if (user) {
      setUserEmergencies(emergencies.filter(e => e.userId === user.uid));
    } else {
      setUserEmergencies([]);
    }
  }, [user, emergencies]);
  
  // Send SOS function
  const sendSOS = async (description, type = 'sos') => {
    if (!user) {
      throw new Error("You must be logged in to send an SOS");
    }
    
    try {
      const emergencyData = {
        userId: user.uid,
        userName: user.displayName || 'Anonymous',
        type,
        description: description || `Emergency ${type} alert`,
        status: 'active',
        priority: 'high',
        location: {
          // This should be the user's actual location from the map context in a real app
          latitude: 40.7128,
          longitude: -74.0060
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      const docRef = await addDoc(collection(db, 'emergencies'), emergencyData);
      return { id: docRef.id, ...emergencyData };
    } catch (error) {
      console.error('Error sending SOS:', error);
      throw error;
    }
  };
  
  const value = {
    emergencies,
    activeEmergencies,
    userEmergencies,
    loading,
    sendSOS
  };
  
  return (
    <EmergencyContext.Provider value={value}>
      {children}
    </EmergencyContext.Provider>
  );
};

export default EmergencyProvider;