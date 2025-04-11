// In-memory data store for users and messages
const users = new Map();
const rooms = new Map();
const jwt = require('jsonwebtoken');
const logger = require('./utils/logger');

// JWT Secret key (in production, store this in environment variables)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-for-jwt-signing';

// Add debugging
const DEBUG = true;
const log = (...args) => DEBUG && console.log('[Socket Server]', ...args);
const error = (...args) => console.error('[Socket Server Error]', ...args);

// Initial rooms setup with some default messages
rooms.set('general', { 
  name: 'General Chat',
  messages: [{
    id: Date.now(),
    user: 'system',
    text: 'Welcome to the General Chat!',
    timestamp: new Date().toISOString()
  }]
});

rooms.set('emergency', { 
  name: 'Emergency Coordination',
  messages: [{
    id: Date.now(),
    user: 'system',
    text: '🚨 This channel is for emergency coordination only.',
    timestamp: new Date().toISOString()
  }]
});

const setupSocketEvents = (io) => {
  // ENHANCED: Better real-time WebSocket configuration
  io.engine.on('connection_error', (err) => {
    logger.error('Connection error:', { details: err });
  });
  
  // Configure for optimal real-time performance
  io.use((socket, next) => {
    socket.setMaxListeners(20); 
    
    // iOS-optimized connection handling
    const iosUserAgent = socket.handshake.headers['user-agent']?.includes('iPhone') || 
                         socket.handshake.headers['user-agent']?.includes('iPad');
    
    if (iosUserAgent) {
      console.log(`iOS device connected: ${socket.id}`);
      
      // Store iOS flag for special handling
      socket.isIOS = true;
      
      // iOS doesn't handle WebSocket compression well sometimes
      socket.conn.transport.socket.noDelay = true;
      socket.conn.transport.socket.setKeepAlive(true);
    }
    
    // Prioritize WebSocket transport for faster delivery
    socket.conn.on('upgrade', () => {
      // Enable nodelay for lowest latency - critical for iOS
      socket.conn.transport.socket.setNoDelay(true);
    });
    
    // Track room membership for better routing
    socket.roomData = {};
    next();
  });

  io.on('connection', (socket) => {
    logger.connection('New socket connection', {
      socketId: socket.id,
      transport: socket.conn.transport.name,
      ip: socket.handshake.address,
      userAgent: socket.handshake.headers['user-agent']
    });
    
    // Get user info from auth data with better fallbacks
    const { username } = socket.handshake.auth;
    const displayName = username || `Guest_${socket.id.substring(0, 5)}`;
    
    logger.connection('User connected', { 
      socketId: socket.id,
      username: displayName,
      isIOS: socket.isIOS
    });
    
    // Send immediate confirmation of connection
    socket.emit('message', {
      id: Date.now(),
      user: 'system',
      text: `Connected to server successfully!`,
      timestamp: new Date().toISOString()
    });
    
    // Handle iOS app state changes
    socket.on('ios_app_state', (state) => {
      const user = users.get(socket.id);
      console.log(`iOS app state changed for ${user?.username || 'unknown'}: ${state}`);
      
      if (state === 'background') {
        // Mark user as away but don't disconnect immediately (iOS optimization)
        if (user) {
          user.status = 'away';
          // Update room user list with status
          if (user.room) {
            io.to(user.room).emit('roomData', {
              room: user.room,
              users: getUsersInRoom(user.room)
            });
          }
        }
      } else if (state === 'active') {
        // User is back online
        if (user) {
          user.status = 'online';
          // Update room data
          if (user.room) {
            // Resend message history for recovery
            const roomData = rooms.get(user.room);
            if (roomData && Array.isArray(roomData.messages)) {
              // Send last 20 messages to catch up
              const recentMessages = roomData.messages.slice(-20).map(msg => ({
                ...msg,
                room: msg.room || user.room
              }));
              socket.emit('messageHistory', recentMessages);
            }
            
            // Update room user list with status
            io.to(user.room).emit('roomData', {
              room: user.room,
              users: getUsersInRoom(user.room)
            });
          }
        }
      }
    });

    // IMPROVED: Better room joining with iOS optimizations
    socket.on('join', ({ room }) => {
      try {
        // Validate room name
        if (!room) {
          console.warn('Join attempt with missing room name');
          socket.emit('message', {
            id: Date.now(),
            user: 'system',
            text: 'Error: Room name is required',
            timestamp: new Date().toISOString()
          });
          return;
        }
        
        // Leave any existing rooms (except socket ID room)
        if (socket.rooms) {
          for (const joinedRoom of socket.rooms) {
            if (joinedRoom !== socket.id) {
              console.log(`User ${displayName} leaving room: ${joinedRoom}`);
              socket.leave(joinedRoom);
            }
          }
        }
        
        logger.room('User joining room', {
          socketId: socket.id,
          username: displayName,
          room: room,
          isNewRoom: !rooms.has(room)
        });
        
        console.log(`🚪 User ${displayName} joining room: ${room}`);
        
        // Store user data with the new room
        const existingUser = users.get(socket.id);
        const oldRoom = existingUser?.room;
        
        users.set(socket.id, {
          id: socket.id,
          username: displayName,
          room // Update the room
        });
        
        // Create room if needed
        if (!rooms.has(room)) {
          console.log(`Creating new room: ${room}`);
          rooms.set(room, { 
            name: room, 
            messages: [{
              id: Date.now(),
              user: 'system',
              text: `Welcome to ${room}!`,
              timestamp: new Date().toISOString(),
              room: room // Include room information here too
            }] 
          });
        }
        
        // Actually join the room
        socket.join(room);
        
        // Update old room's user list if needed
        if (oldRoom && oldRoom !== room) {
          io.to(oldRoom).emit('roomData', {
            room: oldRoom,
            users: getUsersInRoom(oldRoom)
          });
        }
        
        // Send welcome messages
        setTimeout(() => {
          // Get room data after joining
          const roomData = rooms.get(room);
          
          // iOS-specific handling for faster connection
          if (socket.isIOS) {
            // Use smaller chunks for iOS to prevent disconnects
            const MAX_IOS_MESSAGES = 15; // Maximum messages to send at once to iOS
            
            // Send history to the joining user - ensure all messages have room property
            if (roomData && Array.isArray(roomData.messages)) {
              // For iOS: send in smaller batches to avoid disconnects
              const historyWithRoom = roomData.messages.map(msg => ({
                ...msg,
                room: msg.room || room
              }));
              
              if (historyWithRoom.length > MAX_IOS_MESSAGES) {
                // Send the most recent batch first
                const recentMessages = historyWithRoom.slice(-MAX_IOS_MESSAGES);
                socket.emit('messageHistory', recentMessages);
                
                // Then send any older messages in a separate event to avoid overwhelming iOS
                setTimeout(() => {
                  if (socket.connected) {
                    const olderMessages = historyWithRoom.slice(0, -MAX_IOS_MESSAGES);
                    socket.emit('olderMessages', olderMessages);
                  }
                }, 1000);
              } else {
                socket.emit('messageHistory', historyWithRoom);
              }
              console.log(`Sent messages to ${displayName} for room ${room} with iOS optimization`);
            } else {
              socket.emit('messageHistory', []);
            }
          } else {
            // Non-iOS handling
            if (roomData && Array.isArray(roomData.messages)) {
              // Make sure all history messages have room property
              const historyWithRoom = roomData.messages.map(msg => ({
                ...msg,
                room: msg.room || room
              }));
              
              socket.emit('messageHistory', historyWithRoom);
              console.log(`Sent ${historyWithRoom.length} messages to ${displayName} for room ${room}`);
            } else {
              socket.emit('messageHistory', []);
              console.error('No message history found for room:', room);
            }
          }
          
          // Send room user list to everyone
          const usersInRoom = getUsersInRoom(room);
          io.to(room).emit('roomData', {
            room,
            users: usersInRoom
          });
          
          // Send welcome message to the joining user
          socket.emit('message', {
            id: Date.now(),
            user: 'system',
            text: `Welcome to ${room}, ${displayName}!`,
            timestamp: new Date().toISOString(),
            room: room // Include room information
          });
        }, 100); // Small delay to ensure joining is complete
      } catch (err) {
        logger.error('Error in join handler', { 
          error: err.message,
          stack: err.stack,
          socketId: socket.id,
          username: displayName
        });
        console.error(`Error in join handler:`, err);
        socket.emit('message', {
          id: Date.now(),
          user: 'system',
          text: `Error joining room: ${err.message}`,
          timestamp: new Date().toISOString()
        });
      }
    });
    
    // CRITICAL: Enhanced for instant delivery to specific rooms
    socket.on('sendMessage', (message, room, callback) => {
      try {
        // Basic validation
        if (!message || typeof message !== 'string') {
          throw new Error('Invalid message format');
        }
        
        if (!room) {
          throw new Error('Room must be specified when sending a message');
        }
        
        // Get user info with fallback
        const user = users.get(socket.id);
        
        // Security check - only allow sending to rooms the user has joined
        const isInRoom = socket.rooms && socket.rooms.has(room);
        const isMemberRoom = user && user.room === room;
        
        if (!isInRoom && !isMemberRoom) {
          console.warn(`User ${user?.username || 'Unknown'} tried to send message to unjoined room: ${room}`);
          throw new Error(`You must join the room "${room}" before sending messages`);
        }
        
        // Use the specified room or user's current room
        const targetRoom = room || user?.room;
        
        if (!targetRoom) {
          throw new Error('No target room available. Join a room before sending messages');
        }
        
        logger.info(`💬 [MESSAGE] From ${user?.username || displayName} in room ${targetRoom}: ${message.substring(0, 50)}`);
        
        // Generate a consistent ID based on time and content hash
        const messageHash = require('crypto')
          .createHash('md5')
          .update(`${Date.now()}-${message}-${user?.username || displayName}`)
          .digest('hex')
          .substring(0, 10);
        
        const timestamp = Date.now();
        const messageId = `${timestamp}-${messageHash}`;
        
        // Create message object with room field for targeting
        const newMessage = {
          id: messageId,
          user: user?.username || displayName,
          text: message,
          timestamp: new Date(timestamp).toISOString(),
          room: targetRoom  // Critical for channel-specific delivery
        };
        
        // Store in room history
        const roomData = rooms.get(targetRoom) || { 
          name: targetRoom, 
          messages: []
        };
        
        roomData.messages.push(newMessage);
        if (roomData.messages.length > 100) {
          roomData.messages = roomData.messages.slice(-100);
        }
        
        // Update room data
        rooms.set(targetRoom, roomData);
        
        logger.message('Message received', { 
          from: user?.username || displayName, 
          room: targetRoom, 
          messagePreview: message.substring(0, 50) + (message.length > 50 ? '...' : ''),
          messageId: messageId,
          timestamp: new Date().toISOString()
        });
        
        // AVOID DUPLICATION: Better message delivery strategy
        // 1. Direct delivery to sender for immediate UI feedback
        logger.info(`Sending message ${messageId} to sender ${socket.id}`);
        socket.emit('message', newMessage);
        
        // 2. Send to everyone else in the room (not the sender)
        logger.info(`Broadcasting message ${messageId} to room ${targetRoom}`);
        socket.to(targetRoom).emit('message', newMessage);
        
        // Send immediate acknowledgement for better UX
        if (callback && typeof callback === 'function') {
          callback({ 
            success: true, 
            id: messageId, 
            room: targetRoom,
            timestamp: timestamp
          });
        }
      } catch (err) {
        logger.error('Error processing message', {
          error: err.message,
          stack: err.stack,
          socketId: socket.id,
          username: user?.username || displayName
        });
        console.error(`Error processing message:`, err);
        
        // Send error only to sender
        socket.emit('message', {
          id: Date.now(),
          user: 'system',
          text: `Error: ${err.message}`,
          timestamp: new Date().toISOString()
        });
        
        // Send negative acknowledgement
        if (callback && typeof callback === 'function') {
          callback({ 
            success: false, 
            error: err.message 
          });
        }
      }
    });
    
    // Handle typing indicator
    socket.on('typing', (isTyping) => {
      const user = users.get(socket.id);
      if (!user) return;
      
      socket.to(user.room).emit('userTyping', {
        user: user.username,
        isTyping
      });
    });
    
    // ADDED: Ping to keep connection alive and measure latency
    let pingInterval;
    
    // Start ping interval for this connection
    pingInterval = setInterval(() => {
      if (socket.connected) {
        const start = Date.now();
        socket.emit('ping', {}, () => {
          const latency = Date.now() - start;
          socket.emit('pong', { latency });
        });
      } else {
        clearInterval(pingInterval);
      }
    }, 30000);
    
    // Add special ping mechanism for iOS
    let iosPingInterval;
    
    if (socket.isIOS) {
      // iOS needs more frequent pings to stay connected
      iosPingInterval = setInterval(() => {
        if (socket.connected) {
          socket.emit('ios_ping');
        } else {
          clearInterval(iosPingInterval);
        }
      }, 15000); // 15 seconds
    }
    
    socket.on('ios_pong', () => {
      const user = users.get(socket.id);
      if (user) {
        user.lastPong = Date.now();
      }
    });
    
    // Enhanced disconnect handler for iOS
    socket.on('disconnect', (reason) => {
      // Clear ping intervals
      if (pingInterval) clearInterval(pingInterval);
      if (iosPingInterval) clearInterval(iosPingInterval);
      
      logger.connection('Socket disconnected', {
        socketId: socket.id,
        username: users.get(socket.id)?.username || 'unknown',
        reason: reason,
        isIOS: socket.isIOS,
        duration: users.get(socket.id) ? 
          `${(Date.now() - new Date(users.get(socket.id)?.createdAt || Date.now()).getTime()) / 1000}s` : 
          'unknown'
      });
      
      console.log(`🔌 Socket disconnected: ${socket.id}, reason: ${reason}`);
      const user = users.get(socket.id);
      
      // For iOS devices, we wait slightly before fully disconnecting
      // as iOS can reconnect quickly after temporary network issues
      if (socket.isIOS && (reason === 'transport close' || reason === 'ping timeout')) {
        // Keep the user object for a bit longer to allow for reconnection
        setTimeout(() => {
          // Check if user reconnected (would have new socket ID)
          if (users.has(socket.id)) {
            // If still disconnected, clean up
            notifyUserLeft(user, socket);
            users.delete(socket.id);
          }
        }, 15000); // 15 second grace period for iOS reconnection
      } else {
        // Non-iOS - clean up immediately
        notifyUserLeft(user, socket);
        users.delete(socket.id);
      }
    });
  });
  
  // Helper function for user left notifications
  function notifyUserLeft(user, socket) {
    if (user && user.room) {
      // Notify room that user left
      socket.to(user.room).emit('message', {
        id: Date.now(),
        user: 'system',
        text: `${user.username} has left the chat`,
        timestamp: new Date().toISOString()
      });
      
      // Update room user list
      io.to(user.room).emit('roomData', {
        room: user.room,
        users: getUsersInRoom(user.room)
      });
    }
  }
  
  // Helper function to get users in a room
  function getUsersInRoom(room) {
    const roomUsers = [];
    users.forEach(user => {
      if (user.room === room) {
        roomUsers.push({
          id: user.id,
          username: user.username
        });
      }
    });
    return roomUsers;
  }
};

// Export rooms for API access
const getRooms = rooms;

module.exports = { setupSocketEvents, getRooms };
