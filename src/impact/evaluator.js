/**
 * Impact Evaluation Module for assessing incident severity and impact
 */

const logger = require('../core/logger');

class ImpactEvaluator {
  /**
   * Create a new impact evaluator
   * @param {Object} config - Impact evaluation configuration
   */
  constructor(config) {
    this.config = config;
    this.metrics = config.evaluationMetrics || [];
    this.severityLevels = config.severityLevels || ['critical', 'high', 'medium', 'low'];
    this.notificationThresholds = config.notificationThresholds || {};
    
    logger.info('Impact Evaluator initialized with metrics:', this.metrics);
  }

  /**
   * Evaluate the impact of an incident
   * @param {Object} incidentData - Incident data to evaluate
   * @param {Object} initialAssessment - Optional AI-generated initial assessment
   * @returns {Object} - Impact assessment
   */
  async evaluate(incidentData, initialAssessment = null) {
    logger.info(`Evaluating impact for incident ${incidentData.id}`);
    
    // Start with initial assessment if provided
    const assessment = initialAssessment ? { ...initialAssessment } : {
      overallSeverity: null,
      metrics: {},
      responseTime: null,
      escalationTime: null,
      impactedSystems: [],
      impactedUsers: 0,
      recommendation: null
    };
    
    // Evaluate each metric
    for (const metric of this.metrics) {
      if (!assessment.metrics[metric]) {
        assessment.metrics[metric] = await this.evaluateMetric(metric, incidentData);
      }
    }
    
    // Determine overall severity if not already set
    if (!assessment.overallSeverity) {
      assessment.overallSeverity = this.determineSeverity(assessment.metrics);
    }
    
    // Set response and escalation times based on severity
    const thresholds = this.notificationThresholds[assessment.overallSeverity] || {};
    assessment.responseTime = thresholds.responseTime || 30;
    assessment.escalationTime = thresholds.escalationTime || 60;
    
    // Identify impacted systems if not already set
    if (!assessment.impactedSystems || assessment.impactedSystems.length === 0) {
      assessment.impactedSystems = this.identifyImpactedSystems(incidentData);
    }
    
    // Estimate impacted users if not already set
    if (!assessment.impactedUsers) {
      assessment.impactedUsers = this.estimateImpactedUsers(incidentData, assessment.impactedSystems);
    }
    
    // Generate recommendation if not already set
    if (!assessment.recommendation) {
      assessment.recommendation = this.generateRecommendation(assessment);
    }
    
    logger.info(`Impact evaluation complete for incident ${incidentData.id}. Severity: ${assessment.overallSeverity}`);
    
    return assessment;
  }

  /**
   * Evaluate a specific metric
   * @param {string} metric - Metric to evaluate
   * @param {Object} incidentData - Incident data
   * @returns {Object} - Metric evaluation result
   */
  async evaluateMetric(metric, incidentData) {
    logger.debug(`Evaluating metric '${metric}' for incident ${incidentData.id}`);
    
    // Different evaluation logic based on metric type
    switch (metric) {
      case 'service_impact':
        return this.evaluateServiceImpact(incidentData);
      
      case 'customer_impact':
        return this.evaluateCustomerImpact(incidentData);
      
      case 'revenue_impact':
        return this.evaluateRevenueImpact(incidentData);
      
      case 'security_impact':
        return this.evaluateSecurityImpact(incidentData);
      
      default:
        logger.warn(`Unknown metric type: ${metric}`);
        return {
          severity: 'unknown',
          confidence: 0,
          details: `Unknown metric type: ${metric}`
        };
    }
  }

  /**
   * Evaluate service impact
   * @param {Object} incidentData - Incident data
   * @returns {Object} - Service impact assessment
   */
  evaluateServiceImpact(incidentData) {
    // Extract relevant data
    const {
      serviceOutage = false,
      serviceDegradation = false,
      percentageImpacted = 0,
      durationMinutes = 0
    } = incidentData;
    
    let severity;
    let confidence = 0.8;
    let impactScore = 0;
    
    // Calculate impact score based on multiple factors
    if (serviceOutage) {
      impactScore += 50;
    } else if (serviceDegradation) {
      impactScore += 25;
    }
    
    // Add percentage impact score
    impactScore += percentageImpacted * 0.5;
    
    // Add duration impact
    if (durationMinutes > 60) {
      impactScore += 25;
    } else if (durationMinutes > 30) {
      impactScore += 15;
    } else if (durationMinutes > 10) {
      impactScore += 10;
    } else {
      impactScore += 5;
    }
    
    // Determine severity based on impact score
    if (impactScore >= 75) {
      severity = 'critical';
    } else if (impactScore >= 50) {
      severity = 'high';
    } else if (impactScore >= 25) {
      severity = 'medium';
    } else {
      severity = 'low';
    }
    
    return {
      severity,
      confidence,
      impactScore,
      details: {
        serviceOutage,
        serviceDegradation,
        percentageImpacted,
        durationMinutes
      }
    };
  }

  /**
   * Evaluate customer impact
   * @param {Object} incidentData - Incident data
   * @returns {Object} - Customer impact assessment
   */
  evaluateCustomerImpact(incidentData) {
    // Extract relevant data
    const {
      customersFacing = false,
      customerCount = 0,
      customerTier = 'standard',
      customerReports = 0
    } = incidentData;
    
    let severity;
    let confidence = 0.7;
    let impactScore = 0;
    
    // Calculate impact score based on multiple factors
    if (customersFacing) {
      impactScore += 30;
    }
    
    // Add customer count impact
    if (customerCount > 1000) {
      impactScore += 40;
    } else if (customerCount > 100) {
      impactScore += 30;
    } else if (customerCount > 10) {
      impactScore += 20;
    } else if (customerCount > 0) {
      impactScore += 10;
    }
    
    // Add customer tier impact
    if (customerTier === 'enterprise') {
      impactScore += 20;
    } else if (customerTier === 'business') {
      impactScore += 15;
    } else if (customerTier === 'premium') {
      impactScore += 10;
    }
    
    // Add customer reports impact
    if (customerReports > 50) {
      impactScore += 20;
    } else if (customerReports > 10) {
      impactScore += 15;
    } else if (customerReports > 0) {
      impactScore += 10;
    }
    
    // Determine severity based on impact score
    if (impactScore >= 70) {
      severity = 'critical';
    } else if (impactScore >= 50) {
      severity = 'high';
    } else if (impactScore >= 30) {
      severity = 'medium';
    } else {
      severity = 'low';
    }
    
    return {
      severity,
      confidence,
      impactScore,
      details: {
        customersFacing,
        customerCount,
        customerTier,
        customerReports
      }
    };
  }

  /**
   * Evaluate revenue impact
   * @param {Object} incidentData - Incident data
   * @returns {Object} - Revenue impact assessment
   */
  evaluateRevenueImpact(incidentData) {
    // Extract relevant data
    const {
      revenueImpacted = false,
      estimatedLoss = 0,
      affectsPayments = false,
      affectsBilling = false,
      durationMinutes = 0
    } = incidentData;
    
    let severity;
    let confidence = 0.6;
    let impactScore = 0;
    
    // Calculate impact score based on multiple factors
    if (revenueImpacted) {
      impactScore += 30;
    }
    
    // Add estimated loss impact
    if (estimatedLoss > 100000) {
      impactScore += 50;
    } else if (estimatedLoss > 10000) {
      impactScore += 40;
    } else if (estimatedLoss > 1000) {
      impactScore += 30;
    } else if (estimatedLoss > 0) {
      impactScore += 20;
    }
    
    // Add payment impact
    if (affectsPayments) {
      impactScore += 25;
    }
    
    // Add billing impact
    if (affectsBilling) {
      impactScore += 15;
    }
    
    // Add duration impact for revenue
    if (durationMinutes > 60) {
      impactScore += 15;
    } else if (durationMinutes > 30) {
      impactScore += 10;
    } else if (durationMinutes > 10) {
      impactScore += 5;
    }
    
    // Determine severity based on impact score
    if (impactScore >= 75) {
      severity = 'critical';
    } else if (impactScore >= 50) {
      severity = 'high';
    } else if (impactScore >= 30) {
      severity = 'medium';
    } else {
      severity = 'low';
    }
    
    return {
      severity,
      confidence,
      impactScore,
      details: {
        revenueImpacted,
        estimatedLoss,
        affectsPayments,
        affectsBilling,
        durationMinutes
      }
    };
  }

  /**
   * Evaluate security impact
   * @param {Object} incidentData - Incident data
   * @returns {Object} - Security impact assessment
   */
  evaluateSecurityImpact(incidentData) {
    // Extract relevant data
    const {
      securityBreach = false,
      dataExposure = false,
      sensitiveDataInvolved = false,
      breachSize = 0,
      systemsCompromised = []
    } = incidentData;
    
    let severity;
    let confidence = 0.7;
    let impactScore = 0;
    
    // Calculate impact score based on multiple factors
    if (securityBreach) {
      impactScore += 50;
    }
    
    // Add data exposure impact
    if (dataExposure) {
      impactScore += 30;
    }
    
    // Add sensitive data impact
    if (sensitiveDataInvolved) {
      impactScore += 20;
    }
    
    // Add breach size impact
    if (breachSize > 10000) {
      impactScore += 30;
    } else if (breachSize > 1000) {
      impactScore += 20;
    } else if (breachSize > 0) {
      impactScore += 10;
    }
    
    // Add systems compromised impact
    impactScore += Math.min(systemsCompromised.length * 5, 20);
    
    // Determine severity based on impact score
    if (impactScore >= 70) {
      severity = 'critical';
    } else if (impactScore >= 50) {
      severity = 'high';
    } else if (impactScore >= 30) {
      severity = 'medium';
    } else {
      severity = 'low';
    }
    
    return {
      severity,
      confidence,
      impactScore,
      details: {
        securityBreach,
        dataExposure,
        sensitiveDataInvolved,
        breachSize,
        systemsCompromised
      }
    };
  }

  /**
   * Determine overall severity based on individual metric assessments
   * @param {Object} metrics - Metric assessment results
   * @returns {string} - Overall severity level
   */
  determineSeverity(metrics) {
    // Extract severity levels and sort them by priority
    const severities = Object.values(metrics)
      .map(m => m.severity)
      .filter(s => this.severityLevels.includes(s));
    
    if (severities.length === 0) {
      return 'low';
    }
    
    // Find the highest severity level
    const severityOrder = {};
    this.severityLevels.forEach((level, index) => {
      severityOrder[level] = index;
    });
    
    let highestSeverity = 'low';
    let highestPriority = severityOrder['low'] || 999;
    
    for (const severity of severities) {
      const priority = severityOrder[severity] || 999;
      if (priority < highestPriority) {
        highestPriority = priority;
        highestSeverity = severity;
      }
    }
    
    return highestSeverity;
  }

  /**
   * Identify systems impacted by the incident
   * @param {Object} incidentData - Incident data
   * @returns {Array} - List of impacted systems
   */
  identifyImpactedSystems(incidentData) {
    const { affectedSystems = [], relatedServices = [] } = incidentData;
    
    // Combine explicitly specified affected systems with related services
    const impactedSystems = [...new Set([...affectedSystems, ...relatedServices])];
    
    return impactedSystems;
  }

  /**
   * Estimate the number of users impacted by the incident
   * @param {Object} incidentData - Incident data
   * @param {Array} impactedSystems - List of impacted systems
   * @returns {number} - Estimated number of impacted users
   */
  estimateImpactedUsers(incidentData, impactedSystems) {
    const { userCount = 0, percentageImpacted = 0 } = incidentData;
    
    // If user count and percentage are explicitly provided, use them
    if (userCount > 0 && percentageImpacted > 0) {
      return Math.round(userCount * (percentageImpacted / 100));
    }
    
    // If only user count is provided, use that
    if (userCount > 0) {
      return userCount;
    }
    
    // Fallback: estimate based on impacted systems
    // This is a simplified approach and should be enhanced with actual system usage data
    const estimatedUsersPerSystem = 100;
    return impactedSystems.length * estimatedUsersPerSystem;
  }

  /**
   * Generate recommendation based on impact assessment
   * @param {Object} assessment - Impact assessment
   * @returns {string} - Recommendation
   */
  generateRecommendation(assessment) {
    const { overallSeverity, impactedSystems, impactedUsers } = assessment;
    
    let recommendation = '';
    
    // Generate severity-based recommendations
    switch (overallSeverity) {
      case 'critical':
        recommendation = 'Immediate all-hands response required. ';
        recommendation += 'Notify executive team and establish incident command. ';
        recommendation += 'Begin user communication strategy immediately.';
        break;
      
      case 'high':
        recommendation = 'Assemble dedicated response team. ';
        recommendation += 'Escalate to service owners and senior technical staff. ';
        recommendation += 'Prepare user communication if outage exceeds 30 minutes.';
        break;
      
      case 'medium':
        recommendation = 'Assign dedicated engineer for investigation. ';
        recommendation += 'Notify service owners and prepare contingency plans. ';
        recommendation += 'Monitor for escalation triggers.';
        break;
      
      case 'low':
        recommendation = 'Standard troubleshooting procedures. ';
        recommendation += 'Monitor for changes in impact level. ';
        recommendation += 'Document in ticket and address during business hours.';
        break;
      
      default:
        recommendation = 'Unable to determine appropriate response. Investigate further.';
    }
    
    // Add system-specific recommendations if applicable
    if (impactedSystems.length > 0) {
      recommendation += ` Focus on affected systems: ${impactedSystems.join(', ')}.`;
    }
    
    // Add user impact recommendations if significant
    if (impactedUsers > 1000) {
      recommendation += ' Significant user base affected; consider public status update.';
    } else if (impactedUsers > 100) {
      recommendation += ' Multiple users affected; monitor support channels for reports.';
    }
    
    return recommendation;
  }
}

module.exports = {
  ImpactEvaluator
};
