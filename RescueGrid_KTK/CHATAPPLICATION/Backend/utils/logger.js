const fs = require('fs');
const path = require('path');
const util = require('util');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Set the path for the central chat.log file
const logFilePath = path.join(logsDir, 'chat.log');

// Path for structured logs (separate files for different log categories)
const structuredLogsDir = path.join(logsDir, 'structured');
if (!fs.existsSync(structuredLogsDir)) {
  fs.mkdirSync(structuredLogsDir, { recursive: true });
}

const structuredLogPaths = {
  connection: path.join(structuredLogsDir, 'connections.log'),
  message: path.join(structuredLogsDir, 'messages.log'),
  room: path.join(structuredLogsDir, 'rooms.log'),
  auth: path.join(structuredLogsDir, 'auth.log'),
  error: path.join(structuredLogsDir, 'errors.log'),
  system: path.join(structuredLogsDir, 'system.log')
};

// Create empty log files if they don't exist
Object.values(structuredLogPaths).forEach(filePath => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '');
  }
});

// Override console methods to capture all logs
const originalConsole = {
  log: console.log,
  error: console.error,
  warn: console.warn,
  info: console.info,
  debug: console.debug
};

// Format the log entry with timestamp and level
const formatLogEntry = (level, args) => {
  const timestamp = new Date().toISOString();
  const message = args.map(arg => 
    typeof arg === 'object' ? util.inspect(arg, { depth: null, colors: false }) : String(arg)
  ).join(' ');
  
  return `[${timestamp}] [${level}] ${message}\n`;
};

// Write to log file
const writeToLog = (entry) => {
  try {
    fs.appendFileSync(logFilePath, entry);
  } catch (err) {
    originalConsole.error('Error writing to log file:', err);
  }
};

// Write structured logs with better formatting
const writeStructuredLog = (category, level, data) => {
  try {
    const timestamp = new Date().toISOString();
    let entry = `====================\n`;
    entry += `TIMESTAMP: ${timestamp}\n`;
    entry += `LEVEL: ${level}\n`;
    
    if (typeof data === 'string') {
      entry += `MESSAGE: ${data}\n`;
    } else {
      // If data is an object with message and details
      if (data.message) {
        entry += `MESSAGE: ${data.message}\n`;
        
        if (data.details) {
          entry += 'DETAILS:\n';
          // Format details as key-value pairs
          Object.entries(data.details).forEach(([key, value]) => {
            const valueStr = typeof value === 'object' 
              ? JSON.stringify(value, null, 2)
              : String(value);
            entry += `  ${key}: ${valueStr}\n`;
          });
        }
      } else {
        entry += `DATA: ${util.inspect(data, { depth: null, colors: false })}\n`;
      }
    }
    entry += `====================\n\n`;
    
    // Determine which log file to write to
    const targetPath = structuredLogPaths[category] || structuredLogPaths.system;
    fs.appendFileSync(targetPath, entry);
    
  } catch (err) {
    originalConsole.error('Error writing structured log:', err);
  }
};

// Override console methods
console.log = (...args) => {
  const entry = formatLogEntry('INFO', args);
  originalConsole.log(...args);
  writeToLog(entry);
};

console.error = (...args) => {
  const entry = formatLogEntry('ERROR', args);
  originalConsole.error(...args);
  writeToLog(entry);
  // Also write to structured error log
  writeStructuredLog('error', 'ERROR', args.join(' '));
};

console.warn = (...args) => {
  const entry = formatLogEntry('WARN', args);
  originalConsole.warn(...args);
  writeToLog(entry);
};

console.info = (...args) => {
  const entry = formatLogEntry('INFO', args);
  originalConsole.info(...args);
  writeToLog(entry);
};

console.debug = (...args) => {
  if (process.env.DEBUG) {
    const entry = formatLogEntry('DEBUG', args);
    originalConsole.debug(...args);
    writeToLog(entry);
  }
};

// Export custom logger functions with structured logging
const logger = {
  info: (message, details) => {
    console.log(message, details || '');
    writeStructuredLog('system', 'INFO', { message, details });
  },
  
  error: (message, details) => {
    console.error(message, details || '');
    writeStructuredLog('error', 'ERROR', { message, details });
  },
  
  warn: (message, details) => {
    console.warn(message, details || '');
    writeStructuredLog('system', 'WARN', { message, details });
  },
  
  auth: (message, details) => {
    const entry = formatLogEntry('AUTH', [message, details || '']);
    originalConsole.log(message, details || '');
    writeToLog(entry);
    writeStructuredLog('auth', 'AUTH', { message, details });
  },
  
  connection: (message, details) => {
    originalConsole.log(message, details || '');
    writeStructuredLog('connection', 'INFO', { message, details });
  },
  
  message: (message, details) => {
    originalConsole.log(message, details || '');
    writeStructuredLog('message', 'INFO', { message, details });
  },
  
  room: (message, details) => {
    originalConsole.log(message, details || '');
    writeStructuredLog('room', 'INFO', { message, details });
  },
  
  debug: (message, details) => {
    if (process.env.DEBUG) {
      console.debug(message, details || '');
      writeStructuredLog('system', 'DEBUG', { message, details });
    }
  }
};

module.exports = logger;
