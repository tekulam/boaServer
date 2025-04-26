/**
 * Configuration module for loading and managing application settings
 */

const fs = require('fs').promises;
const path = require('path');
const logger = require('./logger');

/**
 * Default configuration values
 */
const DEFAULT_CONFIG = {
  server: {
    port: 3000,
    host: 'localhost'
  },
  database: {
    type: 'sqlite',
    path: './data/oncall.db'
  },
  logging: {
    level: 'info',
    file: './logs/oncall.log'
  }
};

/**
 * Load configuration from file
 * @param {string} configPath - Path to the configuration file
 * @returns {Object} - Merged configuration
 */
async function load(configPath = null) {
  try {
    const configFilePath = configPath || path.resolve(__dirname, '../../config/config.json');
    
    // Read configuration file
    const configData = await fs.readFile(configFilePath, 'utf8');
    const fileConfig = JSON.parse(configData);
    
    // Merge with default configuration
    const mergedConfig = mergeConfigs(DEFAULT_CONFIG, fileConfig);
    
    // Validate configuration
    validateConfig(mergedConfig);
    
    return mergedConfig;
  } catch (error) {
    logger.error('Failed to load configuration:', error);
    
    if (error.code === 'ENOENT') {
      logger.warn('Configuration file not found, using defaults');
      return DEFAULT_CONFIG;
    }
    
    throw error;
  }
}

/**
 * Merge default and custom configurations
 * @param {Object} defaultConfig - Default configuration
 * @param {Object} customConfig - Custom configuration
 * @returns {Object} - Merged configuration
 */
function mergeConfigs(defaultConfig, customConfig) {
  const result = { ...defaultConfig };
  
  // Recursively merge configurations
  Object.keys(customConfig).forEach(key => {
    if (
      typeof customConfig[key] === 'object' && 
      customConfig[key] !== null &&
      !Array.isArray(customConfig[key]) &&
      typeof defaultConfig[key] === 'object' &&
      defaultConfig[key] !== null
    ) {
      result[key] = mergeConfigs(defaultConfig[key], customConfig[key]);
    } else {
      result[key] = customConfig[key];
    }
  });
  
  return result;
}

/**
 * Validate configuration object
 * @param {Object} config - Configuration to validate
 * @throws {Error} - If configuration is invalid
 */
function validateConfig(config) {
  // Validate server configuration
  if (!config.server || typeof config.server.port !== 'number') {
    throw new Error('Invalid server configuration');
  }
  
  // Validate AI configuration if enabled
  if (config.ai && config.ai.enabled) {
    if (!config.ai.models || Object.keys(config.ai.models).length === 0) {
      throw new Error('AI is enabled but no models are configured');
    }
    
    // Validate each AI model
    Object.values(config.ai.models).forEach(model => {
      if (!model.name || !model.endpoint) {
        throw new Error(`Invalid AI model configuration: ${JSON.stringify(model)}`);
      }
    });
  }
  
  // Validate impact evaluation configuration
  if (!config.impact || !Array.isArray(config.impact.severityLevels)) {
    throw new Error('Invalid impact evaluation configuration');
  }
  
  // Validate future proofing configuration
  if (config.future && config.future.learningEnabled) {
    if (typeof config.future.dataRetentionDays !== 'number') {
      throw new Error('Invalid future proofing configuration');
    }
  }
}

/**
 * Update specific configuration values
 * @param {Object} updates - Configuration updates
 * @param {string} configPath - Path to the configuration file
 * @returns {Object} - Updated configuration
 */
async function update(updates, configPath = null) {
  const config = await load(configPath);
  const updatedConfig = mergeConfigs(config, updates);
  
  // Validate updated configuration
  validateConfig(updatedConfig);
  
  // Save updated configuration
  const saveConfigPath = configPath || path.resolve(__dirname, '../../config/config.json');
  await fs.writeFile(saveConfigPath, JSON.stringify(updatedConfig, null, 2), 'utf8');
  
  return updatedConfig;
}

module.exports = {
  load,
  update,
  DEFAULT_CONFIG
};
