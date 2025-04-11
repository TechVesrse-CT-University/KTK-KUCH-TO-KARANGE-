import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

const DEBUG = true;
const log = (...args) => DEBUG && console.log('[Socket]', ...args);
const error = (...args) => console.error('[Socket Error]', ...args);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [roomMessages, setRoomMessages] = useState({});
  const [currentRoom, setCurrentRoom] = useState(null);
  const { currentUser, authToken } = useAuth();
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 10;
  const socketInstanceRef = useRef(null);
  const hasAttemptedConnectionRef = useRef(false);
  const isInitializingRef = useRef(false);
  const connectionTimeoutRef = useRef(null);
  const mountedRef = useRef(true);
  const currentRoomRef = useRef(null);
  const connectionStatusRef = useRef({
    isConnecting: false,
    isConnected: false,
    connectionAttempts: 0,
    hasCleanup: false
  });

  const SOCKET_URL = 'http://localhost:3000';

  const pendingMessagesRef = useRef(new Map());
  const messageListenersRef = useRef({});
  const roomMessageHandlersRef = useRef({});

  const messageCache = new Map();

  const [isIOS, setIsIOS] = useState(false);
  const [iosAppState, setIosAppState] = useState('active');

  useEffect(() => {
    mountedRef.current = true;
    connectionStatusRef.current.hasCleanup = false;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    console.log('Current room changed to:', currentRoom);

    if (currentRoom) {
      setMessages(roomMessages[currentRoom] || []);
    }
  }, [currentRoom, roomMessages]);

  useEffect(() => {
    const checkIOS = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      const isIOSDevice = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
      setIsIOS(isIOSDevice);

      if (isIOSDevice) {
        console.log('iOS device detected - applying special handling');
      }
    };

    checkIOS();
  }, []);

  const initializeSocketRef = useRef(() => {});
  const reconnectRef = useRef(() => {});

  const initializeSocket = useCallback(() => {
    if (isInitializingRef.current || connectionStatusRef.current.hasCleanup) {
      return;
    }

    try {
      isInitializingRef.current = true;
      connectionStatusRef.current.isConnecting = true;
      setConnecting(true);
      setConnectionError(null);

      console.log('🔌 Connecting to socket server at:', SOCKET_URL, {
        token: 'dev-token',
        username: currentUser?.username || 'Guest_' + Math.floor(Math.random() * 1000),
        transports: isIOS ? ['polling', 'websocket'] : ['websocket', 'polling'],
        isIOS: isIOS
      });

      const oldSocket = socketInstanceRef.current;
      if (oldSocket) {
        console.log('Cleaning up previous socket instance');
        socketInstanceRef.current = null;
        try {
          oldSocket.disconnect();
        } catch (e) {
          console.error('Error cleaning up socket:', e);
        }
      }

      const newSocket = io(SOCKET_URL, {
        auth: {
          token: 'dev-token',
          username: currentUser?.username || 'Guest_' + Math.floor(Math.random() * 1000),
          isIOS: isIOS
        },
        reconnection: true,
        reconnectionAttempts: isIOS ? 10 : 5,
        transports: isIOS ? ['polling', 'websocket'] : ['websocket', 'polling'],
        timeout: isIOS ? 20000 : 10000,
        forceNew: true,
        pingInterval: isIOS ? 8000 : 10000,
        pingTimeout: isIOS ? 10000 : 5000,
        maxHttpBufferSize: 1e6
      });

      socketInstanceRef.current = newSocket;

      newSocket.io.on("reconnect_attempt", () => {
        if (isIOS) {
          console.log('iOS reconnect attempt - forcing polling transport');
          newSocket.io.opts.transports = ['polling', 'websocket'];
        }
      });

      newSocket.io.on("reconnect", () => {
        if (isIOS) {
          setTimeout(() => {
            if (newSocket.io?.engine?.transport?.name === 'polling') {
              console.log('iOS reconnected with polling, trying to upgrade to WebSocket');
              newSocket.io.engine.transport.on('upgrade', () => {
                console.log('iOS transport upgraded to WebSocket');
              });
            }
          }, 1000);
        }
      });

      const originalEmit = newSocket.emit;
      if (isIOS) {
        newSocket.iosMessageQueue = [];
        newSocket.iosFlushScheduled = false;

        newSocket.emit = function(event, ...args) {
          if (event === 'ios_pong' || event === 'join' || event === 'ios_app_state') {
            return originalEmit.apply(this, [event, ...args]);
          }

          if (event === 'sendMessage') {
            newSocket.iosMessageQueue.push({ event, args });

            if (!newSocket.iosFlushScheduled && newSocket.iosMessageQueue.length === 1) {
              newSocket.iosFlushScheduled = true;
              setTimeout(() => {
                if (newSocket.connected && newSocket.iosMessageQueue.length > 0) {
                  while (newSocket.iosMessageQueue.length > 0) {
                    const msg = newSocket.iosMessageQueue.shift();
                    originalEmit.apply(newSocket, [msg.event, ...msg.args]);
                  }
                }
                newSocket.iosFlushScheduled = false;
              }, 50);
            }

            return newSocket;
          }

          return originalEmit.apply(this, [event, ...args]);
        };
      }

      newSocket.on('connect', () => {
        console.log('✅ Socket connected successfully!', newSocket.id);
        setConnected(true);
        setConnecting(false);
        isInitializingRef.current = false;
        setConnectionError(null);

        if (currentRoomRef.current) {
          setTimeout(() => {
            if (newSocket.connected) {
              newSocket.emit('join', { room: currentRoomRef.current });
            }
          }, 500);
        }
      });

      newSocket.on('connect_error', (err) => {
        console.error('Socket connection error:', err.message);
        setConnectionError(`Connection error: ${err.message}`);
        setConnected(false);
        setConnecting(false);
        isInitializingRef.current = false;
        connectionStatusRef.current.isConnecting = false;
      });

      newSocket.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason);
        setConnected(false);
        connectionStatusRef.current.isConnected = false;
      });

      newSocket.on('message', (message) => {
        if (messageCache.has(message.id)) {
          return;
        }

        messageCache.set(message.id, Date.now());

        if (messageCache.size > 200) {
          const now = Date.now();
          const expiryTime = 60000;
          messageCache.forEach((timestamp, id) => {
            if (now - timestamp > expiryTime) {
              messageCache.delete(id);
            }
          });
        }

        if (message.id && pendingMessagesRef.current.has(message.id)) {
          pendingMessagesRef.current.delete(message.id);
        }

        const messageRoom = message.room || currentRoomRef.current;

        if (message && mountedRef.current && messageRoom) {
          setRoomMessages(prev => {
            const roomMsgs = [...(prev[messageRoom] || [])];

            if (!roomMsgs.some(m => m.id === message.id)) {
              return {
                ...prev,
                [messageRoom]: [...roomMsgs, message]
              };
            }
            return prev;
          });

          if (messageRoom === currentRoomRef.current) {
            setMessages(prevMessages => {
              if (!prevMessages.some(m => m.id === message.id)) {
                return [...prevMessages, message];
              }
              return prevMessages;
            });
          }

          if (roomMessageHandlersRef.current[messageRoom]) {
            roomMessageHandlersRef.current[messageRoom].forEach(handler => {
              try {
                handler(message);
              } catch (err) {
                console.error('Error in message handler:', err);
              }
            });
          }
        }
      });

      newSocket.on('messageHistory', (history) => {
        const room = currentRoomRef.current;

        if (Array.isArray(history) && room) {
          const historyWithRoom = history.map(msg => ({
            ...msg,
            room: msg.room || room
          }));

          setRoomMessages(prev => ({
            ...prev,
            [room]: historyWithRoom
          }));

          setMessages(historyWithRoom);
          setCurrentRoom(room);

          setTimeout(() => {
            setMessages(prev => [...prev]);
          }, 10);
        } else {
          if (room) {
            setRoomMessages(prev => ({
              ...prev,
              [room]: []
            }));
            setMessages([]);
          }
        }
      });

      newSocket.on('roomData', (data) => {
        if (data?.users) {
          setUsers(data.users);
        }
      });

      newSocket.on('userTyping', (data) => {
        if (data.isTyping) {
          setTypingUsers((prev) =>
            prev.includes(data.user) ? prev : [...prev, data.user]
          );
        } else {
          setTypingUsers((prev) => prev.filter((user) => user !== data.user));
        }
      });

      newSocket.on('error', (err) => {
        console.error('Socket error event:', err);
      });

      newSocket.on('connect_timeout', (timeout) => {
        setConnectionError('Connection timeout');
      });

      newSocket.io.on('reconnect', (attempt) => {
        setConnected(true);
        setConnecting(false);
        setConnectionError(null);
      });

      newSocket.io.on("error", (error) => {
        console.error('Socket.io manager error:', error);
      });

      newSocket.io.on("reconnect_attempt", (attempt) => {
        console.log(`Socket reconnect attempt #${attempt}`);
      });

      newSocket.io.on("reconnect_error", (error) => {
        console.error('Socket reconnect error:', error);
      });

      newSocket.io.on("reconnect_failed", () => {
        console.error('Socket reconnect failed after all attempts');
      });

      setSocket(newSocket);
    } catch (err) {
      setConnecting(false);
      isInitializingRef.current = false;
      setConnectionError(`Failed to initialize socket: ${err.message}`);
    }
  }, [currentUser, isIOS]);

  useEffect(() => {
    initializeSocketRef.current = initializeSocket;
  }, [initializeSocket]);

  const reconnect = useCallback(() => {
    console.log('Manual reconnect triggered');

    hasAttemptedConnectionRef.current = false;
    reconnectAttemptsRef.current = 0;

    if (socketInstanceRef.current) {
      try {
        socketInstanceRef.current.removeAllListeners();
        socketInstanceRef.current.disconnect();
        socketInstanceRef.current = null;
      } catch (err) {
        console.error('Error cleaning up socket during reconnect:', err);
      }
    }

    isInitializingRef.current = false;
    connectionStatusRef.current.isConnecting = false;
    setConnecting(false);

    setTimeout(() => {
      initializeSocketRef.current();
    }, 300);
  }, []);

  useEffect(() => {
    reconnectRef.current = reconnect;
  }, [reconnect]);

  useEffect(() => {
    if (!isIOS) return;

    const handleVisibilityChange = () => {
      const newState = document.hidden ? 'background' : 'active';
      setIosAppState(newState);

      if (socketInstanceRef.current?.connected) {
        socketInstanceRef.current.emit('ios_app_state', newState);
      }

      console.log(`iOS app state: ${newState}`);

      if (newState === 'active' && !socketInstanceRef.current?.connected && currentUser) {
        console.log('iOS app became active - checking connection');
        setTimeout(() => reconnectRef.current(), 500);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    if (socketInstanceRef.current) {
      socketInstanceRef.current.on('ios_ping', () => {
        socketInstanceRef.current.emit('ios_pong');
      });

      socketInstanceRef.current.on('olderMessages', (oldMessages) => {
        if (Array.isArray(oldMessages) && oldMessages.length > 0 && currentRoomRef.current) {
          console.log(`📜 Received older messages for iOS: ${oldMessages.length}`);

          setRoomMessages(prev => {
            const roomId = currentRoomRef.current;
            const currentMessages = prev[roomId] || [];

            const combinedMessages = [...oldMessages];
            currentMessages.forEach(msg => {
              if (!combinedMessages.some(m => m.id === msg.id)) {
                combinedMessages.push(msg);
              }
            });

            combinedMessages.sort((a, b) =>
              new Date(a.timestamp) - new Date(b.timestamp)
            );

            return {
              ...prev,
              [roomId]: combinedMessages
            };
          });
        }
      });
    }

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);

      if (socketInstanceRef.current) {
        socketInstanceRef.current.off('ios_ping');
        socketInstanceRef.current.off('olderMessages');
      }
    };
  }, [isIOS, currentUser]);

  const safeCleanupSocket = useCallback(() => {
    if (!mountedRef.current) {
      connectionStatusRef.current.hasCleanup = true;

      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current);
        connectionTimeoutRef.current = null;
      }

      const socket = socketInstanceRef.current;
      if (socket) {
        socketInstanceRef.current = null;

        try {
          socket.removeAllListeners();
          socket.disconnect();
        } catch (err) {
          console.error('Error during socket cleanup:', err);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (!socketInstanceRef.current && !connecting && !isInitializingRef.current && currentUser) {
      console.log('Initial socket connection attempt');
      initializeSocketRef.current();
    }

    return () => {
      safeCleanupSocket();
    };
  }, [currentUser, connecting, safeCleanupSocket]);

  const attemptReconnect = useCallback(() => {
    if (connecting || (!currentUser && process.env.NODE_ENV !== 'development')) return;

    reconnectAttemptsRef.current += 1;
    if (reconnectAttemptsRef.current < maxReconnectAttempts) {
      const delay = Math.min(1000 * Math.pow(1.5, reconnectAttemptsRef.current), 30000);
      console.log(`Will attempt reconnection in ${delay}ms. Attempt ${reconnectAttemptsRef.current}`);

      hasAttemptedConnectionRef.current = false;

      setTimeout(() => {
        if (!connected && !connecting) {
          initializeSocketRef.current();
        }
      }, delay);
    } else {
      console.log('Maximum reconnection attempts reached');
    }
  }, [connecting, currentUser, connected]);

  useEffect(() => {
    if (connectionError && !connecting && !connected) {
      console.log('Handling connection error with reconnect');
      attemptReconnect();
    }
  }, [connectionError, connecting, connected, attemptReconnect]);

  const joinRoom = useCallback((roomId) => {
    if (!roomId) {
      return;
    }

    setMessages([]);

    currentRoomRef.current = roomId;
    setCurrentRoom(roomId);

    const currentSocket = socketInstanceRef.current;

    if (currentSocket?.connected) {
      currentSocket.emit('join', { room: roomId });

      if (isIOS) {
        setTimeout(() => {
          if (currentSocket.connected && currentRoomRef.current === roomId) {
            currentSocket.emit('join', { room: roomId });
          }
        }, 500);
      }

      setTimeout(() => {
        setMessages(prev => [...prev]);
      }, 50);
    } else {
      if (!connecting && !isInitializingRef.current && currentUser) {
        console.log('Socket not connected - attempting to connect before joining room');
        initializeSocketRef.current();
      }
    }
  }, [connecting, currentUser, isIOS]);

  const sendMessage = useCallback((text) => {
    if (!text || !text.trim()) {
      return;
    }

    const trimmedMessage = text.trim();
    const currentSocket = socketInstanceRef.current;
    const room = currentRoomRef.current;

    if (!room) {
      return;
    }

    if (currentSocket?.connected && room) {
      const localId = Date.now();
      const localMsgId = `local-${localId}`;

      messageCache.set(localMsgId, Date.now());

      const localEcho = {
        id: localMsgId,
        user: currentUser?.username || 'Me',
        text: trimmedMessage,
        timestamp: new Date().toISOString(),
        pending: true,
        room: room
      };

      pendingMessagesRef.current.set(localId, {
        text: trimmedMessage,
        timestamp: Date.now(),
        room: room
      });

      setRoomMessages(prev => {
        const roomMsgs = [...(prev[room] || [])];
        return {
          ...prev,
          [room]: [...roomMsgs, localEcho]
        };
      });

      if (room === currentRoomRef.current) {
        setMessages(prev => [...prev, localEcho]);
      }

      currentSocket.emit('sendMessage', trimmedMessage, room, (ack) => {
        if (ack?.success) {
          pendingMessagesRef.current.delete(localId);

          messageCache.set(ack.id, Date.now());

          if (roomMessageHandlersRef.current[room]) {
            const completedMsg = {
              ...localEcho,
              id: ack.id,
              pending: false
            };
            roomMessageHandlersRef.current[room].forEach(h => {
              try { h(completedMsg); } catch (e) {}
            });
          }
        }
      });

      setTimeout(() => {
        if (pendingMessagesRef.current.has(localId)) {
          pendingMessagesRef.current.delete(localId);
        }
      }, 5000);
    } else {
      console.error('Cannot send message: socket not connected properly', {
        socketExists: !!socketInstanceRef.current,
        socketId: socketInstanceRef.current?.id,
        socketConnected: socketInstanceRef.current?.connected,
        stateConnected: connected
      });

      if (!connecting && !isInitializingRef.current && currentUser) {
        console.log('Will attempt reconnection to send message');
        initializeSocketRef.current();
      }
    }
  }, [connected, connecting, currentUser]);

  const sendTyping = useCallback((isTyping) => {
    if (socket && connected) {
      socket.emit('typing', isTyping);
    }
  }, [socket, connected]);

  const registerMessageHandler = useCallback((room, handler) => {
    if (!room || typeof handler !== 'function') return () => {};

    if (!roomMessageHandlersRef.current[room]) {
      roomMessageHandlersRef.current[room] = [];
    }

    if (!roomMessageHandlersRef.current[room].includes(handler)) {
      roomMessageHandlersRef.current[room].push(handler);
    }

    return () => {
      if (roomMessageHandlersRef.current[room]) {
        roomMessageHandlersRef.current[room] =
          roomMessageHandlersRef.current[room].filter(h => h !== handler);
      }
    };
  }, []);

  const contextValue = useRef({
    connected,
    connecting,
    connectionError,
    messages,
    roomMessages,
    currentRoom,
    users,
    typingUsers,
    joinRoom,
    sendMessage,
    sendTyping,
    reconnect,
    registerMessageHandler,
    isIOS,
    iosAppState
  }).current;

  useEffect(() => {
    contextValue.connected = connected;
    contextValue.connecting = connecting;
    contextValue.connectionError = connectionError;
    contextValue.messages = messages;
    contextValue.roomMessages = roomMessages;
    contextValue.currentRoom = currentRoom;
    contextValue.users = users;
    contextValue.typingUsers = typingUsers;
    contextValue.registerMessageHandler = registerMessageHandler;
    contextValue.isIOS = isIOS;
    contextValue.iosAppState = iosAppState;
  }, [contextValue, connected, connecting, connectionError, messages, roomMessages, currentRoom, users, typingUsers, registerMessageHandler, isIOS, iosAppState]);

  useEffect(() => {
    console.log('Socket connection state changed:', {
      connected,
      socket: socket?.id,
      socketInstanceRef: socketInstanceRef.current?.id,
      socketConnected: socketInstanceRef.current?.connected
    });
  }, [connected, socket]);

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};
