import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import MessageList from '../components/MessageList';
import MessageInput from '../components/MessageInput';
import ConnectionStatus from '../components/ConnectionStatus';
import { 
  MdMenu, MdClose, MdLogout, MdPerson, MdGroups, MdOutlineEmergency,
  MdHeadsetMic, MdOutlineWbSunny, MdOutlineDarkMode, MdNotifications,
  MdCheckCircle, MdOutlineMedicalServices, MdLocationOn, MdOutlineWavingHand,
  MdSearch
} from 'react-icons/md';

const ChatRoom = () => {
  const { currentUser, logout, authToken } = useAuth();
  const { connected, connecting, connectionError, joinRoom, messages, users, typingUsers, reconnect } = useSocket();
  const [selectedRoom, setSelectedRoom] = useState('emergency');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [roomFilter, setRoomFilter] = useState('');
  const [isNotificationsPanelOpen, setIsNotificationsPanelOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [joinAttempted, setJoinAttempted] = useState(false);
  const navigate = useNavigate();
  
  // Simulated notifications
  const notifications = [
    { id: 1, type: 'emergency', message: 'Flash flood reported in sector 7', time: '2 minutes ago' },
    { id: 2, type: 'update', message: 'Medical supplies delivered to base camp', time: '15 minutes ago' },
    { id: 3, type: 'message', message: '5 new messages in Medical Team channel', time: '30 minutes ago' },
    { id: 4, type: 'emergency', message: 'Evacuation needed for building on 5th street', time: '1 hour ago' },
  ];

  // Simulate loading state
  useEffect(() => {
    setTimeout(() => {
      setAvailableRooms([
        { id: 'emergency', name: 'Emergency Coordination', unread: 12, online: 24, status: 'emergency', icon: <MdOutlineEmergency/> },
        { id: 'medical', name: 'Medical Team', unread: 3, online: 8, status: 'active', icon: <MdOutlineMedicalServices/> },
        { id: 'logistics', name: 'Logistics & Supply', unread: 0, online: 12, status: 'active', icon: <MdGroups/> },
        { id: 'search-rescue', name: 'Search & Rescue', unread: 5, online: 15, status: 'emergency', icon: <MdLocationOn/> },
        { id: 'volunteer', name: 'Volunteer Network', unread: 0, online: 32, status: 'active', icon: <MdPerson/> },
        { id: 'comms', name: 'Public Communications', unread: 7, online: 6, status: 'active', icon: <MdHeadsetMic/> },
        { id: 'general', name: 'General Chat', unread: 0, online: 18, status: 'active', icon: <MdGroups/> },
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    if (connected && currentUser && selectedRoom) {
      joinRoom(selectedRoom);
    }
  }, [connected, selectedRoom, currentUser, joinRoom]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile && sidebarOpen) {
        setSidebarOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarOpen]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleRoomSelect = (roomId) => {
    if (roomId !== selectedRoom) {
      console.log(`Changing room from ${selectedRoom} to ${roomId}`);
      
      // Important: Set loading state while changing rooms
      setIsLoading(true);
      
      // Change the selected room
      setSelectedRoom(roomId);
      
      // Join the new room
      joinRoom(roomId);
      
      // Clear loading after a short delay
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
      
      setJoinAttempted(true);
    }
    
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  
  const filteredRooms = availableRooms.filter(room => 
    room.name.toLowerCase().includes(roomFilter.toLowerCase())
  );

  // Add a useEffect to handle authentication errors
  useEffect(() => {
    // If there's no token but we're still on this page, redirect to login
    if (!authToken && !isLoading) {
      console.log('No auth token found, redirecting to login page');
      navigate('/login');
    }
  }, [authToken, navigate, isLoading]);

  // Use a background image that exists or set a fallback 
  useEffect(() => {
    // Set a CSS variable that can be used for the background
    const root = document.documentElement;
    
    // Check if the image exists
    const img = new Image();
    img.onload = () => {
      root.style.setProperty('--chat-bg-image', 'url("/assets/chat-bg.jpg")');
    };
    img.onerror = () => {
      // If the image doesn't exist, use a gradient as fallback
      root.style.setProperty('--chat-bg-image', 'linear-gradient(to right bottom, #f0f9ff, #e0f2fe)');
      console.warn('Chat background image not found, using fallback gradient');
    };
    img.src = '/assets/chat-bg.jpg';
    
    return () => {
      root.style.removeProperty('--chat-bg-image');
    };
  }, []);

  // Add connection status checker
  useEffect(() => {
    if (!connected && currentUser && !isLoading) {
      console.log('Socket not connected but user is authenticated, attempting to reconnect');
      
      // Give it a bit of time before attempting reconnect
      const timer = setTimeout(() => {
        if (!connected && !connecting) {
          console.log('Attempting manual reconnection');
          reconnect();
          
          // Try to join room again after reconnection
          setTimeout(() => {
            if (selectedRoom) {
              console.log('Re-joining room after reconnection:', selectedRoom);
              joinRoom(selectedRoom);
            }
          }, 2000);
        }
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [connected, connecting, currentUser, isLoading, reconnect, joinRoom, selectedRoom]);

  // Make room joining logic more robust
  useEffect(() => {
    // Don't try to join a room if we're still loading or we don't have a selected room
    if (isLoading || !selectedRoom) return;
    
    console.log(`Attempting to join room: ${selectedRoom}`);
    joinRoom(selectedRoom);
    
    // Set up a retry mechanism if the join fails
    if (!connected) {
      const retryTimer = setTimeout(() => {
        console.log('Connection not established, retrying join with reconnect');
        reconnect();
        
        // Try joining again after reconnection
        setTimeout(() => joinRoom(selectedRoom), 2000);
      }, 5000);
      
      return () => clearTimeout(retryTimer);
    }
  }, [selectedRoom, isLoading, connected, joinRoom, reconnect]);

  // Add a retry mechanism for joining rooms
  useEffect(() => {
    if (joinAttempted && !connected && !connecting && currentUser) {
      console.log('Connection lost after join attempt. Setting up retry...');
      
      const retryTimer = setTimeout(() => {
        console.log('Retrying connection and room join...');
        reconnect();
        joinRoom(selectedRoom); // Try to join room again
      }, 3000);
      
      return () => clearTimeout(retryTimer);
    }
  }, [connected, connecting, currentUser, joinAttempted, reconnect, selectedRoom, joinRoom]);

  // Add a debug indicator for current room
  useEffect(() => {
    if (selectedRoom) {
      console.log('Currently active room:', selectedRoom);
    }
  }, [selectedRoom]);

  if (isLoading) {
    return (
      <div className={`h-screen w-screen flex items-center justify-center ${darkMode ? 'bg-gradient-to-tr from-dark-900 to-dark-800' : 'bg-gradient-to-tr from-primary-500/10 to-primary-500/20'}`}>
        <div className="text-center">
          <motion.div
            className={`text-5xl ${darkMode ? 'text-primary-400' : 'text-primary-500'} mb-6 mx-auto`}
            animate={{ 
              y: [0, -15, 0],
              rotateZ: [0, -10, 10, -10, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "loop"
            }}
          >
            <MdOutlineWavingHand />
          </motion.div>
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-dark-800'} mb-3`}>RescueConnect</h1>
          <div className="relative h-2 w-64 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mx-auto">
            <motion.div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
          <p className={`mt-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Connecting rescue teams...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-screen w-screen flex overflow-hidden ${darkMode ? 'dark bg-dark-900' : 'bg-gray-50'}`}
         style={!darkMode ? { backgroundImage: 'var(--chat-bg-image, none)' } : {}}>
      {/* Mobile sidebar backdrop with higher z-index to prevent overlap */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>
      
      {/* Sidebar with higher z-index */}
      <motion.div 
        className={`fixed lg:relative w-80 h-full bg-white dark:bg-dark-800 z-40 border-r border-gray-200 dark:border-dark-700 flex flex-col
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        initial={false}
        animate={{ translateX: sidebarOpen ? 0 : (window.innerWidth >= 1024 ? 0 : -320) }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-dark-700">
          <h1 className="font-bold text-xl text-gray-800 dark:text-white flex items-center">
            <span className="text-primary-500 mr-2 animate-wave">
              <MdOutlineWavingHand />
            </span>
            RescueConnect
          </h1>
          <button 
            className="lg:hidden p-2 text-gray-500 dark:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-dark-700"
            onClick={() => setSidebarOpen(false)}
          >
            <MdClose size={20} />
          </button>
        </div>
        
        {/* User Profile */}
        <div className="p-4 border-b border-gray-100 dark:border-dark-700">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 text-white flex items-center justify-center font-bold shadow-md">
              {currentUser?.username?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="ml-3 flex-1">
              <div className="font-medium text-gray-800 dark:text-white">{currentUser?.username || 'User'}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                <span className="w-2 h-2 bg-primary-500 rounded-full mr-1"></span>
                Active Responder
              </div>
            </div>
            
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700"
            >
              {darkMode ? <MdOutlineWbSunny size={20} /> : <MdOutlineDarkMode size={20} />}
            </button>
          </div>
        </div>
        
        {/* Channel Search */}
        <div className="p-4">
          <div className="flex items-center bg-gray-50 dark:bg-dark-700 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-primary-500">
            <MdSearch className="text-gray-400 dark:text-gray-500 mr-2" />
            <input 
              type="text"
              placeholder="Search channels"
              value={roomFilter}
              onChange={(e) => setRoomFilter(e.target.value)}
              className="bg-transparent border-none focus:outline-none text-sm w-full text-gray-700 dark:text-gray-200"
            />
          </div>
        </div>
        
        {/* Channels List */}
        <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
          <div className="flex items-center justify-between px-4 py-2">
            <h2 className="font-semibold text-xs uppercase text-gray-500 dark:text-gray-400">Emergency Channels</h2>
            <div className="h-5 w-5 rounded-full bg-emergency-100 dark:bg-emergency-900/30 flex items-center justify-center text-emergency-600 dark:text-emergency-400 text-xs font-medium">
              2
            </div>
          </div>
          
          {filteredRooms
            .filter(room => room.status === 'emergency')
            .map(room => (
            <motion.button
              key={room.id}
              className={`w-full rounded-xl px-4 py-3 mb-1 flex items-center justify-between text-left
                ${selectedRoom === room.id 
                  ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 border-l-4 border-primary-500' 
                  : 'hover:bg-gray-50 dark:hover:bg-dark-700'}`}
              onClick={() => handleRoomSelect(room.id)}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center 
                  ${room.status === 'emergency' 
                    ? 'bg-emergency-100 dark:bg-emergency-900/30 text-emergency-600 dark:text-emergency-400' 
                    : 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'}`}>
                  {room.icon}
                </div>
                <div className="ml-3">
                  <div className={`font-medium text-gray-800 dark:text-gray-100 ${room.unread > 0 ? 'font-semibold' : ''}`}>
                    {room.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></span>
                    {room.online} online
                  </div>
                </div>
              </div>
              
              {room.unread > 0 && (
                <span className="bg-emergency-500 text-white text-xs rounded-full h-5 min-w-5 px-1.5 flex items-center justify-center">
                  {room.unread}
                </span>
              )}
            </motion.button>
          ))}

          <div className="flex items-center justify-between px-4 py-2 mt-4">
            <h2 className="font-semibold text-xs uppercase text-gray-500 dark:text-gray-400">Team Channels</h2>
          </div>
          
          {filteredRooms
            .filter(room => room.status !== 'emergency')
            .map(room => (
            <motion.button
              key={room.id}
              className={`w-full rounded-xl px-4 py-3 mb-1 flex items-center justify-between text-left
                ${selectedRoom === room.id 
                  ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 border-l-4 border-primary-500' 
                  : 'hover:bg-gray-50 dark:hover:bg-dark-700'}`}
              onClick={() => handleRoomSelect(room.id)}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center">
                  {room.icon}
                </div>
                <div className="ml-3">
                  <div className={`font-medium text-gray-800 dark:text-gray-100 ${room.unread > 0 ? 'font-semibold' : ''}`}>
                    {room.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></span>
                    {room.online} online
                  </div>
                </div>
              </div>
              
              {room.unread > 0 && (
                <span className="bg-primary-500 text-white text-xs rounded-full h-5 min-w-5 px-1.5 flex items-center justify-center">
                  {room.unread}
                </span>
              )}
            </motion.button>
          ))}
          
          {filteredRooms.length === 0 && (
            <div className="flex flex-col items-center justify-center h-32 text-gray-500 dark:text-gray-400">
              <MdSearch size={24} className="mb-2" />
              <p className="text-sm">No channels found</p>
            </div>
          )}
        </div>
        
        {/* Sidebar Footer */}
        <div className="border-t border-gray-100 dark:border-dark-700 p-4">
          <button 
            className="w-full py-2.5 px-4 rounded-xl bg-emergency-50 hover:bg-emergency-100 dark:bg-emergency-900/30 dark:hover:bg-emergency-900/50 text-emergency-600 dark:text-emergency-400 flex items-center justify-center gap-2 font-medium shadow-sm transition-all"
            onClick={handleLogout}
          >
            <MdLogout size={18} />
            <span>Sign out</span>
          </button>
        </div>
      </motion.div>
      
      {/* Main Content - Ensure it doesn't overlap with sidebar on mobile */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Chat Header with better touch targets for mobile */}
        <div className="h-16 md:h-16 bg-white dark:bg-dark-800 border-b border-gray-200 dark:border-dark-700 flex items-center justify-between px-2 md:px-4">
          <div className="flex items-center">
            <button 
              className="lg:hidden mr-2 p-3 rounded-md hover:bg-gray-100 dark:hover:bg-dark-700"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <MdMenu size={24} className="text-gray-700 dark:text-gray-200" />
            </button>
            
            <div className="flex items-center">
              {availableRooms.find(r => r.id === selectedRoom)?.status === 'emergency' ? (
                <div className="w-8 h-8 rounded-lg bg-emergency-100 dark:bg-emergency-900/30 text-emergency-600 dark:text-emergency-400 flex items-center justify-center mr-3">
                  {availableRooms.find(r => r.id === selectedRoom)?.icon}
                </div>
              ) : (
                <div className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center mr-3">
                  {availableRooms.find(r => r.id === selectedRoom)?.icon}
                </div>
              )}
              
              <div>
                <h2 className="font-semibold text-gray-800 dark:text-gray-100">
                  {availableRooms.find(r => r.id === selectedRoom)?.name || 'Channel'}
                </h2>
                
                {typingUsers.length > 0 && (
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex space-x-1 mr-1">
                      <div className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-[typing_1.5s_infinite_0ms]"></div>
                      <div className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-[typing_1.5s_infinite_100ms]"></div>
                      <div className="w-1.5 h-1.5 bg-primary-300 rounded-full animate-[typing_1.5s_infinite_200ms]"></div>
                    </div>
                    {typingUsers.join(', ')} typing...
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Mobile-friendly header actions */}
          <div className="flex items-center">
            {/* Responsive notification panel position */}
            <div className="relative">
              <button 
                className={`p-3 rounded-full hover:bg-gray-100 dark:hover:bg-dark-700 relative ${isNotificationsPanelOpen ? 'text-primary-500' : 'text-gray-500 dark:text-gray-300'}`}
                onClick={() => setIsNotificationsPanelOpen(!isNotificationsPanelOpen)}
                aria-label="Notifications"
              >
                <MdNotifications size={24} />
                <span className="absolute top-0 right-0 w-2 h-2 bg-emergency-500 rounded-full"></span>
              </button>
              
              <AnimatePresence>
                {isNotificationsPanelOpen && (
                  <motion.div 
                    className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] bg-white dark:bg-dark-800 rounded-xl shadow-lg border border-gray-100 dark:border-dark-700 z-50"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-dark-700">
                      <h3 className="font-medium text-gray-800 dark:text-white">Notifications</h3>
                      <span className="bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 text-xs px-2 py-1 rounded-full">
                        {notifications.length} new
                      </span>
                    </div>
                    
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map(notification => (
                        <div key={notification.id} className="p-3 border-b border-gray-100 dark:border-dark-700 hover:bg-gray-50 dark:hover:bg-dark-700">
                          <div className="flex items-start">
                            <div className={`mt-0.5 p-1 rounded-lg flex-shrink-0 ${
                              notification.type === 'emergency' 
                                ? 'bg-emergency-100 dark:bg-emergency-900/30 text-emergency-600 dark:text-emergency-400' 
                                : 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                            }`}>
                              {notification.type === 'emergency' ? (
                                <MdOutlineEmergency size={16} />
                              ) : notification.type === 'update' ? (
                                <MdCheckCircle size={16} />
                              ) : (
                                <MdPerson size={16} />
                              )}
                            </div>
                            <div className="ml-3 flex-1">
                              <p className="text-sm text-gray-800 dark:text-gray-200">{notification.message}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notification.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="p-3 flex justify-center">
                      <button className="text-sm text-primary-500 dark:text-primary-400 hover:underline">
                        View all notifications
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Condensed info for mobile */}
            <div className="ml-2 flex items-center bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 rounded-full px-2 py-1 md:px-3 md:py-1">
              <span className="mr-1 w-2 h-2 bg-primary-500 rounded-full"></span>
              <span className="text-xs font-medium">{availableRooms.find(r => r.id === selectedRoom)?.online || 0}</span>
            </div>
          </div>
        </div>
        
        {/* Chat Messages - Full height with scroll */}
        <div className="flex-1 overflow-hidden bg-gray-50 dark:bg-dark-900">
          <MessageList darkMode={darkMode} />
        </div>
        
        {/* Message Input with mobile keyboard considerations */}
        <MessageInput darkMode={darkMode} selectedRoom={selectedRoom} isMobile={isMobile} />
      </div>
      
      {/* Display connection error with retry button and more information */}
      <AnimatePresence>
        {connectionError && (
          <motion.div
            className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-emergency-100 dark:bg-emergency-900/70 
              text-emergency-700 dark:text-emergency-300 px-4 py-2 rounded-full shadow-lg font-medium text-sm z-50
              flex items-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
          >
            <span className="w-2 h-2 bg-emergency-500 animate-pulse rounded-full mr-2"></span>
            <span className="mr-2">
              {connectionError.includes('timeout') 
                ? "Connection timed out" 
                : connectionError.includes('Token') 
                  ? "Authentication error" 
                  : "Connection error"}
            </span>
            <button 
              onClick={() => {
                console.log('Manual reconnect triggered');
                setJoinAttempted(false); // Reset join attempt flag
                reconnect();
              }}
              className="bg-emergency-200 dark:bg-emergency-800 px-2 py-0.5 rounded-full text-xs"
            >
              Retry
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* No connection indicator */}
      <AnimatePresence>
        {!connected && !connectionError && (
          <motion.div
            className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-yellow-100 dark:bg-yellow-900/70 
              text-yellow-700 dark:text-yellow-300 px-4 py-2 rounded-full shadow-lg font-medium text-sm z-50
              flex items-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
          >
            <span className="w-2 h-2 bg-yellow-500 animate-pulse rounded-full mr-2"></span>
            {connecting ? "Connecting..." : "Reconnecting..."}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add the new debug connection component */}
      <ConnectionStatus darkMode={darkMode} />
    </div>
  );
};

export default ChatRoom;
