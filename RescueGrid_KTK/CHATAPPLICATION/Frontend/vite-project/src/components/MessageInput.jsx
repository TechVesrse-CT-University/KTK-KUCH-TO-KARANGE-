import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSocket } from '../contexts/SocketContext';
import { 
  MdSend, 
  MdMic, 
  MdStop,
  MdEmojiEmotions, 
  MdAttachFile, 
  MdGif,
  MdImage, 
  MdVideocam, 
  MdClose,
  MdAdd,
  MdLink,
  MdLocationOn,
  MdOutlinePolicy,
  MdRefresh
} from 'react-icons/md';
import EmojiPicker from './EmojiPicker';

const MessageInput = ({ darkMode, selectedRoom, isMobile = false }) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [confidenceLevel, setConfidenceLevel] = useState(0);
  const [attachMenuPosition, setAttachMenuPosition] = useState({ top: 'auto', left: 'auto' });
  const { connected, connecting, connectionError, sendMessage, sendTyping, reconnect, isIOS } = useSocket();
  const inputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const recognitionRef = useRef(null);
  const timerIntervalRef = useRef(null);
  
  // Debug state
  const [debugInfo, setDebugInfo] = useState({
    lastSent: null,
    sendAttempts: 0,
    connectionState: 'unknown'
  });

  // Add message sending state
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState(null);
  
  // Update debug info when connection state changes
  useEffect(() => {
    setDebugInfo(prev => ({
      ...prev,
      connectionState: connected ? 'connected' : connecting ? 'connecting' : 'disconnected',
      error: connectionError
    }));
  }, [connected, connecting, connectionError]);
  
  // Initialize Web Speech API
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onresult = (event) => {
        const speechResult = event.results[event.results.length - 1];
        const transcript = speechResult[0].transcript;
        const confidence = speechResult[0].confidence;
        
        setMessage(transcript);
        setConfidenceLevel(confidence * 100);
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        stopRecording();
      };
      
      recognitionRef.current.onend = () => {
        if (isRecording) {
          recognitionRef.current.start();
        }
      };
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      
      clearInterval(timerIntervalRef.current);
    };
  }, []);
  
  // Handle typing indicator
  useEffect(() => {
    if (message && connected) {
      sendTyping(true);
      
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      
      typingTimeoutRef.current = setTimeout(() => {
        sendTyping(false);
      }, 3000);
    }
    
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [message, connected, sendTyping]);
  
  // Improved handleSubmit with better feedback
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    // Update debug state (can remove in production)
    setDebugInfo(prev => ({
      ...prev,
      sendAttempts: prev.sendAttempts + 1,
      lastSent: new Date().toISOString(),
      lastMessage: message
    }));
    
    // Show sending state to give immediate feedback
    setSending(true);
    setSendError(null);
    
    try {
      if (connected) {
        console.log('Sending message with active connection:', message);
        
        // Send message and keep track of local message
        const localMessage = message;
        sendMessage(message);
        
        // Clear input and typing indicator
        setMessage('');
        sendTyping(false);
        
        // Clear typing timeout
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
        
        // iOS needs a shorter feedback cycle
        setTimeout(() => setSending(false), isIOS ? 200 : 500);
        
        // iOS sometimes needs input refocus 
        if (isIOS && inputRef.current) {
          setTimeout(() => {
            inputRef.current.focus();
          }, 100);
        }
      } else {
        throw new Error('Not connected to server');
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setSendError(err.message || 'Failed to send message');
      
      // If not connected, try to reconnect
      if (!connected && !connecting) {
        reconnect();
      }
      
      // Clear sending state after a delay
      setTimeout(() => {
        setSending(false);
      }, 1000);
    }
  };

  const startRecording = () => {
    if (!recognitionRef.current) {
      alert("Your browser doesn't support speech recognition");
      return;
    }
    
    try {
      recognitionRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);
      setConfidenceLevel(0);
      
      timerIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
    } catch (error) {
      console.error("Recognition error:", error);
    }
  };
  
  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
      clearInterval(timerIntervalRef.current);
    }
  };

  const toggleVoiceRecognition = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleEmojiSelect = (emoji) => {
    const cursorPosition = inputRef.current.selectionStart;
    const textBeforeCursor = message.substring(0, cursorPosition);
    const textAfterCursor = message.substring(cursorPosition);
    
    setMessage(textBeforeCursor + emoji + textAfterCursor);
    
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        const newCursorPos = cursorPosition + emoji.length;
        inputRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 10);
    
    setShowEmojiPicker(false);
  };
  
  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const quickEmojis = ['👍', '❤️', '😊', '🔥', '👏', '🎉', '🙏', '✅'];

  const positionAttachMenu = () => {
    if (!inputRef.current) return;
    
    const inputRect = inputRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    
    const spaceAbove = inputRect.top;
    const spaceBelow = viewportHeight - inputRect.bottom;
    const spaceLeft = inputRect.left;
    const spaceRight = viewportWidth - inputRect.right;
    
    if (isMobile || spaceBelow < 200) {
      setAttachMenuPosition({
        bottom: `${spaceBelow + inputRect.height + 60}px`,
        left: `${Math.max(10, Math.min(inputRect.left, viewportWidth - 240))}px`,
      });
    } else {
      setAttachMenuPosition({
        top: `${inputRect.top - 220}px`,
        left: `${Math.max(10, Math.min(inputRect.left, viewportWidth - 240))}px`,
      });
    }
  };

  useEffect(() => {
    if (showAttachMenu) {
      positionAttachMenu();
    }
  }, [showAttachMenu]);

  useEffect(() => {
    const handleResize = () => {
      if (showAttachMenu) {
        positionAttachMenu();
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [showAttachMenu]);

  // Format time since last send attempt
  const formatTimeSinceLastSend = () => {
    if (!debugInfo.lastSent) return 'Never';
    const now = new Date();
    const sent = new Date(debugInfo.lastSent);
    const diffSec = Math.floor((now - sent) / 1000);
    
    if (diffSec < 60) return `${diffSec}s ago`;
    return `${Math.floor(diffSec / 60)}m ${diffSec % 60}s ago`;
  };

  // Optimize handles for iOS touch events
  useEffect(() => {
    if (!isIOS || !inputRef.current) return;
    
    // iOS sometimes loses focus after sending messages
    const refocusInput = () => {
      if (inputRef.current && document.activeElement !== inputRef.current) {
        inputRef.current.focus();
      }
    };
    
    // Add special handling for iOS keyboard
    inputRef.current.addEventListener('blur', () => {
      if (!sending) {
        setTimeout(refocusInput, 100);
      }
    });
    
    return () => {
      if (inputRef.current) {
        inputRef.current.removeEventListener('blur', refocusInput);
      }
    };
  }, [isIOS, sending]);

  return (
    <div className={`w-full px-2 py-2 md:px-4 md:py-3 ${darkMode ? 'bg-dark-800' : 'bg-white'} border-t ${darkMode ? 'border-dark-700' : 'border-gray-200'} ${isIOS ? 'ios-input-container' : ''}`}>
      {/* Connection indicator */}
      {!connected && (
        <div className={`text-xs text-center mb-2 py-1 px-2 rounded ${darkMode ? 'bg-dark-700' : 'bg-gray-100'}`}>
          <span className={connecting ? 'text-yellow-400' : 'text-red-400'}>
            {connecting ? 'Connecting...' : 'Disconnected'}
          </span>
          {!connecting && (
            <button 
              className="ml-2 text-primary-500 hover:underline"
              onClick={() => reconnect()}
            >
              Reconnect
            </button>
          )}
        </div>
      )}
      
      {/* iOS-specific helper message */}
      {isIOS && !connected && (
        <div className={`text-xs text-center mb-2 py-1 px-2 rounded ${darkMode ? 'bg-blue-900/30' : 'bg-blue-50'} text-blue-600 dark:text-blue-300`}>
          <p>iOS device detected. If you experience connection issues, try switching to cellular data or restart the app.</p>
        </div>
      )}
      
      {/* Send error message */}
      {sendError && (
        <div className="text-xs text-center mb-2 py-1 px-2 rounded bg-emergency-100 dark:bg-emergency-900/30 text-emergency-600 dark:text-emergency-400">
          {sendError}
          <button 
            className="ml-2 underline"
            onClick={() => setSendError(null)}
          >
            Dismiss
          </button>
        </div>
      )}
      
      {/* Quick emoji buttons */}
      <div className="flex overflow-x-auto scrollbar-hide gap-1 md:gap-2 mb-2 md:mb-3 pb-1">
        {quickEmojis.map((emoji, index) => (
          <motion.button
            key={index}
            onClick={() => handleEmojiSelect(emoji)}
            className={`flex-shrink-0 w-8 h-8 md:w-9 md:h-9 rounded-full ${darkMode ? 'bg-dark-700 hover:bg-dark-600' : 'bg-white hover:bg-gray-50'} shadow-sm flex items-center justify-center`}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 1.2 }}
          >
            {emoji}
          </motion.button>
        ))}
      </div>

      {/* Attachment menu */}
      <AnimatePresence>
        {showAttachMenu && (
          <motion.div 
            className={`fixed ${darkMode ? 'bg-dark-800' : 'bg-white'} rounded-xl shadow-lg p-2 grid grid-cols-3 gap-2 z-20 border ${darkMode ? 'border-dark-700' : 'border-gray-200'}`}
            style={attachMenuPosition}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <button className={`flex flex-col items-center justify-center p-3 rounded-lg ${darkMode ? 'hover:bg-dark-700' : 'hover:bg-gray-50'}`}>
              <MdImage className="text-primary-500 mb-1 text-xl" />
              <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Image</span>
            </button>
            <button className={`flex flex-col items-center justify-center p-3 rounded-lg ${darkMode ? 'hover:bg-dark-700' : 'hover:bg-gray-50'}`}>
              <MdVideocam className="text-emergency-500 mb-1 text-xl" />
              <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Video</span>
            </button>
            <button className={`flex flex-col items-center justify-center p-3 rounded-lg ${darkMode ? 'hover:bg-dark-700' : 'hover:bg-gray-50'}`}>
              <MdLink className="text-blue-500 mb-1 text-xl" />
              <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Link</span>
            </button>
            <button className={`flex flex-col items-center justify-center p-3 rounded-lg ${darkMode ? 'hover:bg-dark-700' : 'hover:bg-gray-50'}`}>
              <MdLocationOn className="text-yellow-500 mb-1 text-xl" />
              <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Location</span>
            </button>
            <button className={`flex flex-col items-center justify-center p-3 rounded-lg ${darkMode ? 'hover:bg-dark-700' : 'hover:bg-gray-50'}`}>
              <MdOutlinePolicy className="text-purple-500 mb-1 text-xl" />
              <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Protocol</span>
            </button>
            <button 
              className={`flex flex-col items-center justify-center p-3 rounded-lg ${darkMode ? 'hover:bg-dark-700' : 'hover:bg-gray-50'}`}
              onClick={() => setShowAttachMenu(false)}
            >
              <MdClose className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-1 text-xl`} />
              <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Cancel</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Emoji picker */}
      <AnimatePresence>
        {showEmojiPicker && (
          <EmojiPicker 
            onSelect={handleEmojiSelect} 
            onClose={() => setShowEmojiPicker(false)} 
          />
        )}
      </AnimatePresence>

      {/* Recording UI */}
      {isRecording && (
        <motion.div 
          className={`mb-2 md:mb-3 p-2 md:p-3 rounded-xl ${darkMode ? 'bg-dark-700' : 'bg-gray-50'} border ${darkMode ? 'border-dark-600' : 'border-gray-200'}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="relative">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-emergency-100 dark:bg-emergency-900/30 flex items-center justify-center">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <MdMic className="text-emergency-500 dark:text-emergency-400 text-lg md:text-xl" />
                  </motion.div>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 md:w-4 md:h-4 rounded-full bg-emergency-500 border-2 border-white dark:border-dark-700"></div>
              </div>
              
              <div className="ml-2 md:ml-3">
                <div className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-200">Recording</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{formatTime(recordingTime)}</div>
              </div>
            </div>
            
            <motion.button
              className="p-2 rounded-full bg-emergency-100 dark:bg-emergency-900/30 text-emergency-500 dark:text-emergency-400"
              onClick={stopRecording}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <MdStop size={isMobile ? 18 : 20} />
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Message input form with better connection handling */}
      <form 
        onSubmit={handleSubmit}
        className={`flex items-center gap-1 md:gap-2 ${darkMode ? 'bg-dark-700' : 'bg-white'} rounded-full border ${darkMode ? 'border-dark-600' : 'border-gray-200'} pl-2 md:pl-3 pr-1 py-1 shadow-sm transition-all focus-within:shadow-md ${darkMode ? 'focus-within:border-primary-600' : 'focus-within:border-primary-400'}`}
      >
        <motion.button
          type="button"
          className={`p-2 rounded-full ${darkMode ? 'text-gray-300 hover:bg-dark-600' : 'text-gray-500 hover:bg-gray-100'}`}
          onClick={() => {
            setShowAttachMenu(!showAttachMenu);
            if (!showAttachMenu) {
              positionAttachMenu();
            }
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <MdAdd size={isMobile ? 22 : 20} />
        </motion.button>
        
        <motion.button
          type="button"
          className={`p-2 rounded-full ${showEmojiPicker ? 'text-primary-500' : darkMode ? 'text-gray-300 hover:bg-dark-600' : 'text-gray-500 hover:bg-gray-100'}`}
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <MdEmojiEmotions size={isMobile ? 22 : 20} />
        </motion.button>
        
        <input 
          ref={inputRef}
          type="text" 
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={
            sending ? "Sending..." :
            isRecording ? "Listening..." : 
            connecting ? "Connecting..." : 
            connected ? "Type a message..." : 
            "Disconnected..."
          }
          className={`flex-1 ${darkMode ? 'bg-transparent text-white placeholder-gray-400' : 'bg-transparent text-gray-800 placeholder-gray-400'} border-none focus:outline-none focus:ring-0 px-2 py-1.5 text-base`}
          disabled={isRecording || sending}
          inputMode="text"
          enterKeyHint="send"
        />
        
        <div className="flex items-center">
          {!connected && !connecting && (
            <motion.button
              type="button"
              className={`p-2 rounded-full ${darkMode ? 'text-yellow-300 hover:bg-dark-600' : 'text-yellow-500 hover:bg-gray-100'}`}
              onClick={reconnect}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Reconnect"
            >
              <MdRefresh size={isMobile ? 22 : 20} />
            </motion.button>
          )}
        
          <motion.button
            type="button"
            className={`p-2 rounded-full 
              ${isRecording 
                ? `${darkMode ? 'bg-emergency-900/30 text-emergency-400' : 'bg-emergency-100 text-emergency-600'}` 
                : `${darkMode ? 'text-gray-300 hover:bg-dark-600' : 'text-gray-500 hover:bg-gray-100'}`}`}
            onClick={toggleVoiceRecognition}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            disabled={!connected && isRecording}
            aria-label={isRecording ? "Stop recording" : "Start voice input"}
          >
            {isRecording ? <MdStop size={isMobile ? 22 : 20} /> : <MdMic size={isMobile ? 22 : 20} />}
          </motion.button>
          
          <motion.button
            type="submit"
            disabled={!connected || !message.trim() || sending}
            className={`p-2.5 ml-1 rounded-full ${
              sending ? 'bg-gray-400 dark:bg-gray-600 text-white' :
              connected && message.trim() ? 'bg-primary-500 hover:bg-primary-600 text-white' : 
              `${darkMode ? 'bg-dark-600 text-gray-500' : 'bg-gray-100 text-gray-400'}`
            }`}
            whileHover={connected && message.trim() && !sending ? { scale: 1.1 } : {}}
            whileTap={connected && message.trim() && !sending ? { scale: 0.9 } : {}}
            animate={sending ? { scale: [1, 0.95, 1], transition: { repeat: Infinity, duration: 0.5 }} : {}}
            aria-label="Send message"
          >
            <MdSend size={isMobile ? 20 : 18} />
          </motion.button>
        </div>
      </form>
      
      {/* Message priority options for emergency channels */}
      {(selectedRoom === 'emergency' || selectedRoom === 'search-rescue') && (
        <motion.div 
          className="mt-1 md:mt-2 flex justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="flex items-center gap-1 md:gap-2">
            <button className={`px-2 py-0.5 md:py-1 rounded-full text-xs font-medium ${darkMode ? 'bg-dark-700 text-gray-300' : 'bg-white text-gray-500'} border ${darkMode ? 'border-dark-600' : 'border-gray-200'}`}>
              Normal
            </button>
            <button className={`px-2 py-0.5 md:py-1 rounded-full text-xs font-medium ${darkMode ? 'bg-dark-700 text-yellow-400' : 'bg-yellow-50 text-yellow-600'} border ${darkMode ? 'border-yellow-700' : 'border-yellow-200'}`}>
              Priority
            </button>
            <button className={`px-2 py-0.5 md:py-1 rounded-full text-xs font-medium ${darkMode ? 'bg-dark-700 text-emergency-400' : 'bg-emergency-50 text-emergency-600'} border ${darkMode ? 'border-emergency-700' : 'border-emergency-200'}`}>
              EMERGENCY
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default MessageInput;
