/**
 * Logging module for the Oncall Tool
 */

const fs = require('fs');
const path = require('path');
const util = require('util');

// Log levels
const LOG_LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3
};

// Default configuration
const DEFAULT_CONFIG = {
  level: 'info',
  file: null,
  console: true,
  timestamp: true
};

// Current configuration
let config = { ...DEFAULT_CONFIG };
let logStream = null;

/**
 * Configure the logger
 * @param {Object} options - Logger configuration options
 */
function configure(options = {}) {
  config = { ...DEFAULT_CONFIG, ...options };
  
  // Validate log level
  if (!LOG_LEVELS.hasOwnProperty(config.level)) {
    console.warn(`Invalid log level: ${config.level}. Using 'info' instead.`);
    config.level = 'info';
  }
  
  // Close existing log stream if any
  if (logStream) {
    logStream.end();
    logStream = null;
  }
  
  // Create log directory if file logging is enabled
  if (config.file) {
    const logDir = path.dirname(config.file);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    
    // Open log file stream
    logStream = fs.createWriteStream(config.file, { flags: 'a' });
  }
}

/**
 * Format a log message
 * @param {string} level - Log level
 * @param {string} message - Log message
 * @param {any[]} args - Additional arguments
 * @returns {string} - Formatted log message
 */
function formatLogMessage(level, message, args) {
  // Create timestamp if enabled
  const timestamp = config.timestamp ? `[${new Date().toISOString()}] ` : '';
  
  // Format the message
  let formattedMessage = `${timestamp}[${level.toUpperCase()}] ${message}`;
  
  // Add additional arguments if any
  if (args.length > 0) {
    formattedMessage += ' ' + args.map(arg => {
      if (typeof arg === 'object' && arg !== null) {
        return util.inspect(arg, { depth: 4 });
      }
      return String(arg);
    }).join(' ');
  }
  
  return formattedMessage;
}

/**
 * Write a log message
 * @param {string} level - Log level
 * @param {string} message - Log message
 * @param {...any} args - Additional arguments
 */
function log(level, message, ...args) {
  // Check if this log level should be displayed
  if (LOG_LEVELS[level] > LOG_LEVELS[config.level]) {
    return;
  }
  
  const formattedMessage = formatLogMessage(level, message, args);
  
  // Write to console if enabled
  if (config.console) {
    const consoleMethod = level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log';
    console[consoleMethod](formattedMessage);
  }
  
  // Write to log file if enabled
  if (logStream) {
    logStream.write(formattedMessage + '\n');
  }
}

// Log level specific methods
const error = (message, ...args) => log('error', message, ...args);
const warn = (message, ...args) => log('warn', message, ...args);
const info = (message, ...args) => log('info', message, ...args);
const debug = (message, ...args) => log('debug', message, ...args);

// Initialize with default configuration
configure();

module.exports = {
  configure,
  log,
  error,
  warn,
  info,
  debug,
  LOG_LEVELS
};
