const logger = require('./utils/logger');
const path = require('path');
const os = require('os');
const fs = require('fs');

// Structured server startup logging
function logStartup(port, options = {}) {
  const startTime = new Date();
  
  // Get system info
  const systemInfo = {
    hostname: os.hostname(),
    platform: os.platform(),
    arch: os.arch(),
    cpus: os.cpus().length,
    memory: `${Math.round(os.totalmem() / (1024 * 1024 * 1024))} GB`,
    node: process.version,
  };
  
  // Get log file paths
  const logPaths = {
    main: path.join(__dirname, 'logs/chat.log'),
    structured: path.join(__dirname, 'logs/structured')
  };
  
  // Check if log files are writable
  let logsWritable = true;
  try {
    fs.accessSync(path.dirname(logPaths.main), fs.constants.W_OK);
  } catch (err) {
    logsWritable = false;
  }
  
  // Log structured startup information
  logger.info('Server starting', {
    startTime: startTime.toISOString(),
    port: port,
    environment: process.env.NODE_ENV || 'development',
    system: systemInfo,
    logs: {
      paths: logPaths,
      writable: logsWritable
    },
    options: options
  });
  
  console.log(`==== Server started at ${startTime.toISOString()} ====`);
  console.log(`Server running on port ${port}`);
  console.log(`WebSocket server ready at ws://localhost:${port}`);
  console.log(`Allowing CORS from ${options.corsOrigin || 'default origins'}`);
  console.log(`Logs being written to ${logPaths.main}`);
  console.log(`Structured logs in ${logPaths.structured}`);
  
  // Return function to log shutdown
  return function logShutdown() {
    const shutdownTime = new Date();
    const uptime = (shutdownTime - startTime) / 1000; // in seconds
    
    logger.info('Server shutting down', {
      shutdownTime: shutdownTime.toISOString(),
      uptime: `${Math.floor(uptime / 60)}m ${Math.round(uptime % 60)}s`,
    });
    
    console.log(`==== Server shutting down at ${shutdownTime.toISOString()} ====`);
    console.log(`Server was up for ${Math.floor(uptime / 60)}m ${Math.round(uptime % 60)}s`);
  };
}

module.exports = { logStartup };
