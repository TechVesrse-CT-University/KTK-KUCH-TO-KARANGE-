import { useEffect, useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSocket } from '../contexts/SocketContext';
import { useAuth } from '../contexts/AuthContext';
import { MdDone, MdDoneAll, MdLocationOn, MdMedicalServices, MdWarning, MdArrowDownward } from 'react-icons/md';

const MessageList = ({ darkMode }) => {
  const { messages, roomMessages, currentRoom, typingUsers, registerMessageHandler, isIOS } = useSocket();
  const { currentUser } = useAuth();
  const messagesEndRef = useRef(null);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [prevMessagesLength, setPrevMessagesLength] = useState(messages.length);
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [forceUpdateCounter, setForceUpdateCounter] = useState(0);
  const [realtimeMessages, setRealtimeMessages] = useState([]);
  const [processedMessageIds, setProcessedMessageIds] = useState(new Set());

  // Detect mobile viewport and handle resizing
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // iOS-specific smoothness optimizations
  useEffect(() => {
    if (!isIOS) return;
    
    // For iOS, batch message processing to maintain UI responsiveness
    const processMessagesBatched = (msgs) => {
      // Process in chunks of 10 for smoother iOS rendering
      const batchSize = 10;
      const totalMessages = msgs.length;
      let processed = 0;
      
      const processNextBatch = () => {
        if (processed >= totalMessages) return;
        
        const end = Math.min(processed + batchSize, totalMessages);
        const batch = msgs.slice(processed, end);
        
        setRealtimeMessages(prev => {
          const newMessages = [...prev];
          
          for (const msg of batch) {
            if (!prev.some(m => m.id === msg.id)) {
              newMessages.push(msg);
            }
          }
          
          return newMessages;
        });
        
        processed = end;
        
        if (processed < totalMessages) {
          setTimeout(processNextBatch, 16); // ~60fps for smoothness
        }
      };
      
      processNextBatch();
    };
    
    // Replace bulk message processing with batched version for iOS
    if (currentRoom && roomMessages[currentRoom]) {
      processMessagesBatched(roomMessages[currentRoom]);
    }
  }, [isIOS, currentRoom, roomMessages]);

  // Display messages with better deduplication
  const displayMessages = useMemo(() => {
    // First deduplicate by ID
    const messageMap = new Map();
    
    // Process realtime messages first (highest priority)
    realtimeMessages.forEach(msg => {
      if (msg && msg.id) {
        messageMap.set(msg.id, msg);
      }
    });
    
    // Add room-specific messages that aren't already in the map
    if (currentRoom && roomMessages[currentRoom]) {
      roomMessages[currentRoom].forEach(msg => {
        if (msg && msg.id && !messageMap.has(msg.id)) {
          messageMap.set(msg.id, msg);
        }
      });
    }
    
    // Finally add general messages as fallback
    messages.forEach(msg => {
      if (msg && msg.id && !messageMap.has(msg.id)) {
        messageMap.set(msg.id, msg);
      }
    });
    
    // Convert back to array and sort by timestamp
    return Array.from(messageMap.values())
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  }, [realtimeMessages, currentRoom, roomMessages, messages]);

  // IMPROVED: Direct message subscription for instant updates
  useEffect(() => {
    if (!currentRoom) return;
    
    console.log(`Setting up real-time listener for room: ${currentRoom}`);
    
    const unsubscribe = registerMessageHandler(currentRoom, (newMessage) => {
      console.log(`🔴 Real-time message received:`, newMessage);
      
      // Check if we've already processed this message to prevent duplicates
      if (processedMessageIds.has(newMessage.id)) {
        console.log(`Message ${newMessage.id} already processed, ignoring duplicate`);
        return;
      }
      
      // Add to processed set
      setProcessedMessageIds(prev => new Set([...prev, newMessage.id]));
      
      setRealtimeMessages(prev => {
        // Additional duplication check
        if (!prev.some(m => m.id === newMessage.id)) {
          return [...prev.filter(m => 
            !m.pending || (m.pending && m.id !== `local-${newMessage.local_id}`)
          ), newMessage];
        }
        return prev;
      });
      
      setForceUpdateCounter(c => c + 1);
      
      if (containerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
        const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;
        
        if (isAtBottom) {
          setTimeout(() => {
            if (messagesEndRef.current) {
              messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
            }
          }, 10);
        } else {
          setShowScrollButton(true);
          setHasNewMessage(true);
        }
      }
    });
    
    // Clean up realtime messages when changing rooms
    setRealtimeMessages([]);
    setProcessedMessageIds(new Set());
    
    return unsubscribe;
  }, [currentRoom, registerMessageHandler]);

  // Reset real-time messages when room messages update from server
  useEffect(() => {
    if (currentRoom && roomMessages[currentRoom]) {
      if (roomMessages[currentRoom].length > realtimeMessages.length) {
        setRealtimeMessages(roomMessages[currentRoom]);
      }
    }
  }, [currentRoom, roomMessages]);

  // Auto-scroll to bottom on room change
  useEffect(() => {
    scrollToBottom();
    setPrevMessagesLength(displayMessages.length);
  }, [currentRoom]);

  // Detect new messages
  useEffect(() => {
    if (displayMessages.length > prevMessagesLength) {
      setHasNewMessage(true);
      
      const container = containerRef.current;
      if (container) {
        const { scrollTop, scrollHeight, clientHeight } = container;
        if (scrollHeight - scrollTop - clientHeight > 100) {
          setShowScrollButton(true);
        }
      }
    }
    setPrevMessagesLength(displayMessages.length);
  }, [displayMessages.length, prevMessagesLength]);

  // Handle scroll events to show/hide scroll button
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;
      
      if (isAtBottom) {
        setShowScrollButton(false);
        setHasNewMessage(false);
      } else if (hasNewMessage) {
        setShowScrollButton(true);
      }
    };
    
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [hasNewMessage]);

  // Optimized scroll behavior for iOS
  const scrollToBottom = () => {
    if (!messagesEndRef.current) return;
    
    if (isIOS) {
      // iOS needs smoother scrolling with less animation
      messagesEndRef.current.scrollIntoView({ behavior: 'auto' });
      
      // iOS sometimes needs a second scroll
      setTimeout(() => {
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: 'auto' });
        }
      }, 100);
    } else {
      // Regular smooth scrolling for non-iOS
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    
    setHasNewMessage(false);
    setShowScrollButton(false);
  };

  // Group messages by date
  const groupMessagesByDate = () => {
    const groups = {};
    
    displayMessages.forEach(message => {
      const date = new Date(message.timestamp).toLocaleDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    
    return groups;
  };
  
  const messageGroups = groupMessagesByDate();
  
  // Format timestamp for messages
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Determine if message is from the same sender as previous
  const isFromSameSender = (messages, idx) => {
    if (idx === 0) return false;
    
    const currentMsg = messages[idx];
    const prevMsg = messages[idx - 1];
    
    return currentMsg.user === prevMsg.user && 
           new Date(currentMsg.timestamp) - new Date(prevMsg.timestamp) < 120000; // 2 min
  };
  
  // Determine message priority (for styling)
  const getMessagePriority = (message) => {
    if (message.text.startsWith('🚨') || message.text.includes('EMERGENCY')) {
      return 'emergency';
    } else if (message.text.startsWith('⚠️') || message.text.includes('WARNING')) {
      return 'warning';
    } else if (message.text.startsWith('🔍') || message.text.includes('PRIORITY')) {
      return 'priority';
    }
    return 'normal';
  };
  
  // Render message content based on type
  const renderMessageContent = (message) => {
    if (message.text.startsWith('[GIF]')) {
      return (
        <div className="rounded-lg overflow-hidden bg-gray-100 dark:bg-dark-700">
          <img 
            src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExemdnZDFpejI4NHJ3djRwajF5NHprNzd0aDY3a3NkdTZtbWVkN3BsdCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0HlNaQ6gWfllcjDO/giphy.gif" 
            alt="GIF" 
            loading="lazy"
            className="max-h-60 w-auto object-contain" 
          />
        </div>
      );
    } else if (message.text.startsWith('[AUDIO]')) {
      return (
        <div className={`flex items-center p-2 rounded-lg ${darkMode ? 'bg-dark-700' : 'bg-gray-100'}`}>
          <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-500 dark:text-primary-400 flex items-center justify-center mr-2">
            🎤
          </div>
          <div>
            <div className="text-sm font-medium">Voice message</div>
            <audio controls className="mt-1 max-w-xs">
              <source src="#" type="audio/webm" />
              Your browser doesn't support audio playback.
            </audio>
          </div>
        </div>
      );
    } else if (message.text.startsWith('🎤')) {
      return (
        <div className="flex items-start">
          <div className="w-5 h-5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-500 dark:text-primary-400 flex items-center justify-center mr-2 flex-shrink-0">
            🎤
          </div>
          <div>{message.text.slice(2)}</div>
        </div>
      );
    } else if (message.text.includes('[LOCATION]')) {
      return (
        <div className="flex flex-col">
          <div className="flex items-center mb-2">
            <MdLocationOn className="text-emergency-500 dark:text-emergency-400 mr-1" size={18} />
            <span className="font-medium">Location Shared</span>
          </div>
          <div className={`rounded-lg overflow-hidden aspect-video bg-gray-200 dark:bg-dark-700 flex items-center justify-center`}>
            <span className="text-gray-500 dark:text-gray-400 text-sm">Location Map</span>
          </div>
        </div>
      );
    } else if (message.text.includes('[MEDICAL]')) {
      return (
        <div className={`p-2 rounded-lg border ${darkMode ? 'border-emergency-700 bg-emergency-900/20' : 'border-emergency-200 bg-emergency-50'} text-emergency-600 dark:text-emergency-400`}>
          <div className="flex items-center mb-2">
            <MdMedicalServices className="mr-2" size={18} />
            <span className="font-medium">Medical Alert</span>
          </div>
          <p>{message.text.replace('[MEDICAL]', '')}</p>
        </div>
      );
    } else {
      return message.text;
    }
  };

  // Add debug info about message display
  useEffect(() => {
    if (currentRoom) {
      console.log(`MessageList: Displaying ${messages.length} messages for room ${currentRoom}`);
      
      const wrongRoomMessages = messages.filter(m => m.room && m.room !== currentRoom);
      if (wrongRoomMessages.length > 0) {
        console.warn(`Found ${wrongRoomMessages.length} messages with incorrect room!`);
      }
    }
  }, [messages, currentRoom]);

  // Render message with pending indicator
  const renderMessage = (message) => {
    const isCurrentUser = currentUser?.username === message.user;
    const isSystem = message.user === 'system';
    const isPending = message.pending === true;

    if (isPending) {
      return (
        <div className={`message ${isPending ? 'opacity-70' : ''}`}>
          {renderMessageContent(message)}
          <div className="flex items-center justify-end gap-1 mt-1 text-[10px] md:text-xs opacity-70">
            <span>{formatTime(message.timestamp)}</span>
            <span className="ml-1">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="w-3 h-3 rounded-full border-2 border-t-transparent border-current"
              />
            </span>
          </div>
        </div>
      );
    }

    return renderMessageContent(message);
  };
  
  return (
    <div className={`h-full flex flex-col relative ${isIOS ? 'ios-optimized' : ''}`} 
         ref={containerRef} 
         key={`message-list-${currentRoom}-${forceUpdateCounter}`}>
      <div className="flex-1 overflow-y-auto p-2 md:p-4 custom-scrollbar">
        {displayMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center">
            <div className={`w-16 h-16 rounded-full ${darkMode ? 'bg-dark-700' : 'bg-gray-100'} flex items-center justify-center mb-4`}>
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: [0.8, 1.2, 0.8] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="text-2xl"
              >
                💬
              </motion.div>
            </div>
            <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-800'} mb-2`}>No messages yet</h3>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} text-center max-w-xs`}>
              Be the first to send a message in this channel.
              Quick updates and coordination happen here!
            </p>
          </div>
        ) : (
          <>
            {Object.entries(messageGroups).map(([date, dateMessages]) => (
              <div key={date} className="mb-4 md:mb-6 last:mb-0">
                <div className="relative flex items-center my-4 md:my-6">
                  <div className="flex-grow border-t border-gray-200 dark:border-dark-700"></div>
                  <span className={`flex-shrink-0 px-2 md:px-3 ${darkMode ? 'text-gray-400 bg-dark-900' : 'text-gray-500 bg-gray-50'} text-xs`}>
                    {date}
                  </span>
                  <div className="flex-grow border-t border-gray-200 dark:border-dark-700"></div>
                </div>
                
                <div className="space-y-2 md:space-y-3">
                  {dateMessages.map((message, idx) => {
                    const isCurrentUser = currentUser?.username === message.user;
                    const isSystem = message.user === 'system';
                    const fromSameSender = isFromSameSender(dateMessages, idx);
                    const priority = getMessagePriority(message);
                    
                    if (isSystem) {
                      return (
                        <motion.div
                          key={message.id}
                          className="flex justify-center my-2 md:my-3"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <div className={`py-1 px-3 md:px-4 rounded-full text-xs md:text-sm ${darkMode ? 'bg-dark-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                            {message.text}
                          </div>
                        </motion.div>
                      );
                    }
                    
                    return (
                      <motion.div
                        key={message.id}
                        className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} ${fromSameSender ? '' : 'mt-3 md:mt-4'}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: "spring", duration: 0.3 }}
                      >
                        {!isCurrentUser && !fromSameSender && (
                          <div className="flex-shrink-0 mr-2 md:mr-3">
                            <div className={`w-7 h-7 md:w-9 md:h-9 rounded-full flex items-center justify-center text-white font-medium ${
                              darkMode ? 'bg-gray-700' : 'bg-gray-600'
                            }`}>
                              {message.user.charAt(0).toUpperCase()}
                            </div>
                          </div>
                        )}
                        
                        <div className={`max-w-[75%] md:max-w-md ${fromSameSender && !isCurrentUser ? 'ml-9 md:ml-12' : ''}`}>
                          {!isCurrentUser && !fromSameSender && (
                            <div className="text-xs text-gray-500 dark:text-gray-400 ml-1 mb-0.5 md:mb-1">
                              {message.user}
                            </div>
                          )}
                          
                          <div 
                            className={`p-2 md:p-3 rounded-2xl ${
                              priority === 'emergency' 
                                ? `${darkMode ? 'bg-emergency-900/30 text-white' : 'bg-emergency-100 text-emergency-800'} border ${darkMode ? 'border-emergency-800' : 'border-emergency-200'}`
                                : priority === 'warning'
                                ? `${darkMode ? 'bg-yellow-900/30 text-white' : 'bg-yellow-100 text-yellow-800'} border ${darkMode ? 'border-yellow-800' : 'border-yellow-200'}`
                                : priority === 'priority'
                                ? `${darkMode ? 'bg-blue-900/30 text-white' : 'bg-blue-100 text-blue-800'} border ${darkMode ? 'border-blue-800' : 'border-blue-200'}`
                                : isCurrentUser
                                ? `${darkMode ? 'bg-primary-900/40 text-white' : 'bg-primary-500 text-white'}`
                                : `${darkMode ? 'bg-dark-700 text-gray-100' : 'bg-white text-gray-800 border border-gray-100'}`
                            } ${isCurrentUser ? 'rounded-br-sm' : 'rounded-bl-sm'} shadow-sm break-words`}
                          >
                            <div className={`message-content text-sm md:text-base`}>
                              {renderMessage(message)}
                            </div>
                            
                            <div className="flex items-center justify-end gap-1 mt-1 text-[10px] md:text-xs opacity-70">
                              <span>{formatTime(message.timestamp)}</span>
                              {isCurrentUser && (
                                <span className="ml-1">
                                  <MdDoneAll size={12} />
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </>
        )}
        
        <AnimatePresence>
          {typingUsers.length > 0 && (
            <motion.div 
              className="flex items-start gap-1 md:gap-2 mt-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-xs">
                {typingUsers[0].charAt(0).toUpperCase()}
              </div>
              <div className={`py-2 px-3 md:px-4 rounded-xl text-xs md:text-sm max-w-[60%] md:max-w-xs ${darkMode ? 'bg-dark-700' : 'bg-white border border-gray-100'} shadow-sm`}>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-[typing_1s_infinite_0ms]"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-[typing_1s_infinite_150ms]"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-[typing_1s_infinite_300ms]"></div>
                  </div>
                  <span className="text-[10px] md:text-xs text-gray-500">
                    {typingUsers.length === 1 
                      ? `${typingUsers[0]}` 
                      : `${typingUsers.length} people`}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div ref={messagesEndRef} />
      </div>
      
      <AnimatePresence>
        {showScrollButton && (
          <motion.button
            className={`absolute bottom-4 right-4 p-3 md:p-3 rounded-full shadow-md ${darkMode ? 'bg-dark-700 text-gray-300' : 'bg-white text-gray-700'}`}
            onClick={scrollToBottom}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Scroll to bottom"
          >
            <MdArrowDownward size={isMobile ? 24 : 20} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MessageList;
