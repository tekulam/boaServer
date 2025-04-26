/**
 * Main application file for the Oncall Tool
 */

const fs = require('fs');
const path = require('path');

// Import core modules
const config = require('./config');
const logger = require('./logger');
const server = require('./server');
const database = require('./database');

// Import feature modules
const impactEvaluator = require('../impact/evaluator');
const troubleshooter = require('../troubleshooting/troubleshooter');
const refactoring = require('../refactoring/refactor');
const aiService = require('../ai/service');
const futureProofing = require('../future/adaptor');

class OncallTool {
  constructor() {
    this.config = null;
    this.isInitialized = false;
    this.modules = {
      impact: null,
      troubleshooting: null,
      refactoring: null,
      ai: null,
      future: null
    };
  }

  /**
   * Initialize the application
   */
  async initialize() {
    try {
      // Load configuration
      this.config = await config.load();
      logger.info('Configuration loaded successfully');

      // Initialize database
      await database.connect(this.config.database);
      logger.info('Database connection established');

      // Initialize modules
      this.modules.impact = new impactEvaluator.ImpactEvaluator(this.config.impact);
      this.modules.troubleshooting = new troubleshooter.Troubleshooter(this.config.troubleshooting);
      this.modules.refactoring = new refactoring.CodeRefactoring(this.config.refactoring);
      
      // Initialize AI service if enabled
      if (this.config.ai.enabled) {
        this.modules.ai = new aiService.AIService(this.config.ai);
        await this.modules.ai.initialize();
        logger.info('AI services initialized');
      }
      
      // Initialize future proofing module
      this.modules.future = new futureProofing.FutureAdaptor(this.config.future);
      await this.modules.future.initialize();
      
      // Start server
      await server.start(this.config.server, this);
      logger.info(`Server started on port ${this.config.server.port}`);
      
      this.isInitialized = true;
      logger.info('OncallTool initialization complete');
      
      return true;
    } catch (error) {
      logger.error('Failed to initialize application:', error);
      throw error;
    }
  }

  /**
   * Evaluate the impact of an incident
   * @param {Object} incidentData - Data about the incident
   * @returns {Object} - Impact assessment
   */
  async evaluateImpact(incidentData) {
    try {
      logger.info('Evaluating impact for incident:', incidentData.id);
      
      // Use AI for initial assessment if available
      let initialAssessment = null;
      if (this.modules.ai) {
        initialAssessment = await this.modules.ai.analyzeIncident(incidentData);
      }
      
      // Perform impact evaluation
      const assessment = await this.modules.impact.evaluate(incidentData, initialAssessment);
      
      // Record for future learning
      if (this.modules.future && this.config.future.learningEnabled) {
        this.modules.future.recordImpactAssessment(incidentData.id, assessment);
      }
      
      return assessment;
    } catch (error) {
      logger.error('Impact evaluation failed:', error);
      throw error;
    }
  }

  /**
   * Start troubleshooting process for an incident
   * @param {Object} incident - Incident details
   * @returns {Object} - Troubleshooting steps and results
   */
  async startTroubleshooting(incident) {
    try {
      logger.info('Starting troubleshooting for incident:', incident.id);
      
      // Get AI recommendations if available
      let recommendations = null;
      if (this.modules.ai) {
        recommendations = await this.modules.ai.getTroubleshootingSteps(incident);
      }
      
      // Start troubleshooting process
      const troubleshootingPlan = await this.modules.troubleshooting.createPlan(incident, recommendations);
      
      // Execute automated steps
      const results = await this.modules.troubleshooting.executeAutomatedSteps(troubleshootingPlan);
      
      // Record for future improvement
      if (this.modules.future && this.config.future.learningEnabled) {
        this.modules.future.recordTroubleshootingSession(incident.id, results);
      }
      
      return {
        plan: troubleshootingPlan,
        results: results
      };
    } catch (error) {
      logger.error('Troubleshooting failed:', error);
      throw error;
    }
  }

  /**
   * Analyze code for refactoring
   * @param {Object} codeData - Code and related metadata
   * @returns {Object} - Refactoring suggestions
   */
  async analyzeCodeForRefactoring(codeData) {
    try {
      logger.info('Analyzing code for refactoring:', codeData.id);
      
      // Get AI recommendations if available
      let aiSuggestions = null;
      if (this.modules.ai) {
        aiSuggestions = await this.modules.ai.analyzeCode(codeData);
      }
      
      // Perform code analysis
      const analysis = await this.modules.refactoring.analyzeCode(codeData, aiSuggestions);
      
      // Generate refactoring suggestions
      const suggestions = await this.modules.refactoring.generateSuggestions(analysis);
      
      // Record for future improvement
      if (this.modules.future && this.config.future.learningEnabled) {
        this.modules.future.recordRefactoringAnalysis(codeData.id, suggestions);
      }
      
      return suggestions;
    } catch (error) {
      logger.error('Code analysis failed:', error);
      throw error;
    }
  }

  /**
   * Shutdown the application gracefully
   */
  async shutdown() {
    logger.info('Shutting down OncallTool');
    
    // Close AI connections if active
    if (this.modules.ai) {
      await this.modules.ai.shutdown();
    }
    
    // Save learning data
    if (this.modules.future) {
      await this.modules.future.saveData();
    }
    
    // Close database connections
    await database.disconnect();
    
    // Stop server
    await server.stop();
    
    logger.info('OncallTool shutdown complete');
  }
}

// Export the application class
module.exports = {
  OncallTool
};

// Create and initialize application if this is the main entry point
if (require.main === module) {
  const app = new OncallTool();
  app.initialize()
    .then(() => {
      logger.info('OncallTool is ready');
    })
    .catch(error => {
      logger.error('Failed to start OncallTool:', error);
      process.exit(1);
    });
}
