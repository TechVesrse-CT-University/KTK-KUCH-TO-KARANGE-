import { useContext } from 'react';
import { EmergencyContext } from '../contexts/EmergencyContext';

export const useEmergency = () => {
  return useContext(EmergencyContext);
};