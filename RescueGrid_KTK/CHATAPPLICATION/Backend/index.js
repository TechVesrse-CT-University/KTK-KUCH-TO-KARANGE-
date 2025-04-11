// Import logger first to override console methods globally
require('./utils/logger');
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const { setupSocketEvents } = require('./socket');
const authRoutes = require('./routes/auth');
const messagesRoutes = require('./routes/messages');
const { logStartup } = require('./startup');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Socket.io setup with extensive configuration
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  },
  // Enhanced iOS-compatible connection settings
  connectTimeout: 15000,
  pingInterval: 25000,
  pingTimeout: 30000, // Increased for iOS which can be slower to respond
  maxHttpBufferSize: 1e8,
  allowEIO3: true, // Better backwards compatibility for older iOS
  transports: ['websocket', 'polling'], // Explicit transports with polling fallback for iOS
  // iOS needs these timeouts to be more generous
  upgradeTimeout: 10000,
  // Clean up disconnected clients faster to avoid iOS ghost connections
  cleanupEmptyChildNamespaces: true
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debug middleware to log all requests to chat.log
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} from ${req.ip}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/messages', messagesRoutes);

// Add a test route to verify the server is working
app.get('/api/test', (req, res) => {
  res.json({ success: true, message: 'API server is working properly' });
});

// Health check endpoint with socket stats
app.get('/api/health', (req, res) => {
  const socketStats = {
    connections: io.engine.clientsCount,
    rooms: Array.from(io.sockets.adapter.rooms.keys()).filter(room => !room.startsWith('/'))
  };
  
  res.status(200).json({ 
    status: 'ok', 
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    socket: socketStats
  });
});

// Add a better connection check endpoint for iOS
app.get('/api/ios-connection-check', (req, res) => {
  res.json({ 
    success: true, 
    timestamp: Date.now(),
    message: 'iOS connection check successful'
  });
});

// Better error handling for routes
app.use((err, req, res, next) => {
  console.error('Express error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Set up Socket.IO events
setupSocketEvents(io);

// Start server with structured log capture
const PORT = process.env.PORT || 3000;
const logShutdown = logStartup(PORT, {
  corsOrigin: process.env.FRONTEND_URL || 'http://localhost:5173',
  socketTimeout: 30000,
  iosPingInterval: 15000
});

server.listen(PORT);

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  logShutdown();
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

// Error handling - with structured logs
process.on('unhandledRejection', (err) => {
  require('./utils/logger').error('Unhandled Promise Rejection', {
    error: err.message,
    stack: err.stack
  });
});

process.on('uncaughtException', (err) => {
  require('./utils/logger').error('Uncaught Exception', {
    error: err.message,
    stack: err.stack
  });
  
  // Don't exit in development, but should in production
  if (process.env.NODE_ENV === 'production') {
    logShutdown();
    process.exit(1);
  }
});

// Export for testing
module.exports = { app, server };
