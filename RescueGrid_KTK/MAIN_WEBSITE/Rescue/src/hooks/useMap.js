import { useContext } from 'react';
import { MapContext } from '../contexts/MapContext';

export const useMap = () => {
  return useContext(MapContext);
};