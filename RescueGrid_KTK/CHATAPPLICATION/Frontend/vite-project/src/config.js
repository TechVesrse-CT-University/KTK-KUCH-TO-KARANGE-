// Base API URL - change this depending on your environment
export const API_URL = 'http://localhost:3000';

// Socket.IO connection options
export const SOCKET_OPTIONS = {
  transports: ['websocket'],
  autoConnect: true,
  forceNew: true
};
