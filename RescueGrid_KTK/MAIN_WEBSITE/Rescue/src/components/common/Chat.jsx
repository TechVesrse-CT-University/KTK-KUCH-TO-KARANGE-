import React, { useState, useEffect, useRef } from 'react';
import { FiSend, FiPaperclip, FiMic } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';

const Chat = ({ channelId = 'general', agencyMode = false }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    // Simulate fetching chat history
    const fetchMessages = async () => {
      try {
        // In a real app, this would fetch from Firebase
        setTimeout(() => {
          const mockMessages = [
            {
              id: '1',
              text: 'Emergency response team deployed to the northern sector.',
              sender: {
                id: 'agency-1',
                name: 'Central Command',
                type: 'agency'
              },
              timestamp: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
            },
            {
              id: '2',
              text: 'Traffic blocked on Highway 101, need assistance with diversion.',
              sender: {
                id: 'user-2',
                name: 'Field Team Alpha',
                type: 'user'
              },
              timestamp: new Date(Date.now() - 1000 * 60 * 20) // 20 minutes ago
            },
            {
              id: '3',
              text: 'Medical team en route to location. ETA 5 minutes.',
              sender: {
                id: 'agency-3',
                name: 'Medical Response Unit',
                type: 'agency'
              },
              timestamp: new Date(Date.now() - 1000 * 60 * 10) // 10 minutes ago
            },
            {
              id: '4',
              text: 'Evacuation complete in Sector B. Moving to Sector C.',
              sender: {
                id: 'user-4',
                name: 'Evacuation Team',
                type: 'user'
              },
              timestamp: new Date(Date.now() - 1000 * 60 * 5) // 5 minutes ago
            }
          ];
          
          setMessages(mockMessages);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching messages:', error);
        setIsLoading(false);
      }
    };
    
    fetchMessages();
    
    // In a real app, set up real-time listener
    // const unsubscribe = onSnapshot(collection(db, 'channels', channelId, 'messages'), ...);
    // return () => unsubscribe();
  }, [channelId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    // In a real app, this would save to Firebase
    const newMsg = {
      id: Date.now().toString(),
      text: newMessage,
      sender: {
        id: user?.uid || 'current-user',
        name: user?.displayName || 'You',
        type: agencyMode ? 'agency' : 'user'
      },
      timestamp: new Date()
    };
    
    setMessages([...messages, newMsg]);
    setNewMessage('');
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[600px]">
      {/* Chat Messages */}
      <div className="flex-grow overflow-y-auto p-4 bg-gray-50">
        {messages.map(message => (
          <div 
            key={message.id} 
            className={`mb-4 flex ${message.sender.id === (user?.uid || 'current-user') ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`
                max-w-3/4 rounded-lg px-4 py-2 shadow-sm
                ${message.sender.id === (user?.uid || 'current-user')
                  ? 'bg-blue-600 text-white'
                  : message.sender.type === 'agency'
                    ? 'bg-green-700 text-white'
                    : 'bg-white border border-gray-200'
                }
              `}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-sm">
                  {message.sender.name}
                </span>
                <span className={`text-xs ${message.sender.id === (user?.uid || 'current-user') ? 'text-blue-200' : message.sender.type === 'agency' ? 'text-green-200' : 'text-gray-400'}`}>
                  {formatTime(message.timestamp)}
                </span>
              </div>
              <p className="text-sm">{message.text}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-200 bg-white">
        <div className="flex items-center">
          <button type="button" className="p-2 text-gray-500 hover:text-gray-700">
            <FiPaperclip />
          </button>
          <input
            type="text"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <FiSend />
          </button>
          <button type="button" className="p-2 text-gray-500 hover:text-gray-700">
            <FiMic />
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat;