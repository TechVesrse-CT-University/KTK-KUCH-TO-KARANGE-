import React, { useState, useRef, useEffect } from 'react';
import { FiSend, FiUser, FiAlertTriangle, FiInfo, FiPhone, FiX } from 'react-icons/fi';

// Pre-defined emergency responses
const emergencyResponses = {
  greeting: "Hello! I'm RescueBot, your emergency assistant. How can I help you today?",
  
  // Emergency templates
  fire: "If you're experiencing a fire emergency:\n1. Leave the building immediately\n2. Call 101 (Fire Department)\n3. Do not use elevators\n4. Stay low if there's smoke\n5. Once out, stay out",
  
  flood: "For flood emergencies:\n1. Move to higher ground immediately\n2. Avoid walking or driving through flood waters\n3. Follow evacuation orders\n4. Turn off utilities if safe to do so\n5. Avoid electrical equipment in wet areas",
  
  earthquake: "During an earthquake:\n1. Drop, Cover, and Hold On\n2. Stay indoors until shaking stops\n3. Stay away from windows\n4. If outdoors, find a clear spot away from buildings and power lines\n5. After shaking stops, check for injuries and damage",
  
  medical: "For medical emergencies:\n1. Call 102 (Ambulance) immediately\n2. Check for breathing and pulse\n3. If trained, administer CPR if necessary\n4. Control bleeding with pressure\n5. Keep the person still and comfortable\n6. Treat for shock",
  
  // Default responses
  unknown: "I'm sorry, I don't have specific guidance for that situation. Please call emergency services at:\n• Fire: 101\n• Police: 100\n• Ambulance: 102\n• Disaster Management: 108",
  
  help: "I can provide guidance for common emergencies like fires, floods, earthquakes, and medical situations. Just describe your emergency situation."
};

// Function to match keywords in user message and return appropriate response
const getResponseForMessage = (message) => {
  const lowercaseMsg = message.toLowerCase();
  
  if (lowercaseMsg.includes('fire') || lowercaseMsg.includes('burning')) {
    return emergencyResponses.fire;
  } else if (lowercaseMsg.includes('flood') || lowercaseMsg.includes('water') || lowercaseMsg.includes('drowning')) {
    return emergencyResponses.flood;
  } else if (lowercaseMsg.includes('earthquake') || lowercaseMsg.includes('shaking')) {
    return emergencyResponses.earthquake;
  } else if (lowercaseMsg.includes('medical') || lowercaseMsg.includes('hurt') || lowercaseMsg.includes('injured') || 
             lowercaseMsg.includes('bleeding') || lowercaseMsg.includes('pain')) {
    return emergencyResponses.medical;
  } else if (lowercaseMsg.includes('help')) {
    return emergencyResponses.help;
  } else {
    return emergencyResponses.unknown;
  }
};

const ChatBot = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: emergencyResponses.greeting, sender: 'bot', timestamp: new Date() }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Auto-scroll to bottom when new messages are added
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    if (!isMinimized) {
      scrollToBottom();
    }
  }, [messages, isMinimized]);
  
  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: newMessage,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages([...messages, userMessage]);
    setNewMessage('');
    
    // Simulate bot response with a slight delay
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: getResponseForMessage(newMessage),
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };
  
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };
  
  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-md ${isMinimized ? 'h-16' : 'h-[500px]'} flex flex-col transition-all duration-300`}>
      <div className="bg-emergency-red text-white px-4 py-3 rounded-t-lg flex justify-between items-center">
        <div className="flex items-center">
          <div className="bg-white rounded-full p-1 mr-2">
            <FiAlertTriangle className="text-emergency-red" />
          </div>
          <h3 className="font-bold">Emergency Assistant</h3>
        </div>
        <button 
          onClick={toggleMinimize}
          className="focus:outline-none hover:bg-red-700 rounded p-1"
        >
          {isMinimized ? '+' : <FiX />}
        </button>
      </div>
      
      {!isMinimized && (
        <>
          {/* Chat messages */}
          <div className="flex-grow overflow-y-auto p-4 space-y-3">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`
                    max-w-[80%] rounded-lg px-4 py-2
                    ${message.sender === 'user' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-gray-100 text-gray-800'}
                  `}
                >
                  <div className="flex items-center mb-1">
                    {message.sender === 'user' ? (
                      <FiUser className="mr-2 text-blue-600" size={14} />
                    ) : (
                      <FiInfo className="mr-2 text-red-600" size={14} />
                    )}
                    <span className="text-xs text-gray-500">{formatTime(message.timestamp)}</span>
                  </div>
                  <div className="whitespace-pre-line">{message.text}</div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Message input */}
          <form onSubmit={handleSendMessage} className="border-t p-3 flex">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Describe your emergency situation..."
              className="flex-grow px-3 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-emergency-red"
            />
            <button 
              type="submit"
              className="bg-emergency-red text-white px-4 py-2 rounded-r-lg hover:bg-red-700 transition-colors"
            >
              <FiSend />
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default ChatBot;