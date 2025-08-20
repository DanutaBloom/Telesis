/**
 * Centralized Security Logging System
 * SECURITY: Provides comprehensive audit trail for security events
 */

export enum SecurityEventType {
  // Authentication events
  AUTH_SUCCESS = 'auth_success',
  AUTH_FAILURE = 'auth_failure',
  AUTH_BYPASS_ATTEMPT = 'auth_bypass_attempt',
  
  // Authorization events
  ACCESS_GRANTED = 'access_granted',
  ACCESS_DENIED = 'access_denied',
  PRIVILEGE_ESCALATION_ATTEMPT = 'privilege_escalation_attempt',
  CROSS_TENANT_ACCESS_ATTEMPT = 'cross_tenant_access_attempt',
  
  // Input validation events
  VALIDATION_FAILED = 'validation_failed',
  XSS_ATTEMPT = 'xss_attempt',
  INJECTION_ATTEMPT = 'injection_attempt',
  
  // Rate limiting events
  RATE_LIMIT_EXCEEDED = 'rate_limit_exceeded',
  SUSPICIOUS_ACTIVITY = 'suspicious_activity',
  
  // System events
  SECURITY_CONFIG_CHANGE = 'security_config_change',
  ENCRYPTION_ERROR = 'encryption_error',
  DATABASE_ERROR = 'database_error',
}

export enum SecurityLevel {
  INFO = 'info',
  WARNING = 'warning',
  CRITICAL = 'critical',
  EMERGENCY = 'emergency',
}

export interface SecurityEvent {
  type: SecurityEventType;
  level: SecurityLevel;
  message: string;
  userId?: string;
  orgId?: string;
  sessionId?: string;
  ipAddress?: string;
  userAgent?: string;
  endpoint?: string;
  method?: string;
  timestamp: string;
  context?: Record<string, any>;
  stackTrace?: string;
}

class SecurityLogger {
  private events: SecurityEvent[] = [];
  private maxEvents = 10000; // Keep last 10k events in memory

  /**
   * Log a security event
   */
  log(event: Omit<SecurityEvent, 'timestamp'>): void {
    const fullEvent: SecurityEvent = {
      ...event,
      timestamp: new Date().toISOString(),
    };

    // Add to in-memory store
    this.events.push(fullEvent);
    
    // Maintain circular buffer
    if (this.events.length > this.maxEvents) {
      this.events.shift();
    }

    // Console logging with appropriate level
    const logMethod = this.getLogMethod(event.level);
    logMethod(`[SECURITY ${event.level.toUpperCase()}]`, {
      type: event.type,
      message: event.message,
      userId: event.userId,
      orgId: event.orgId,
      endpoint: event.endpoint,
      timestamp: fullEvent.timestamp,
      ...event.context,
    });

    // For critical/emergency events, also log stack trace if available
    if (event.level === SecurityLevel.CRITICAL || event.level === SecurityLevel.EMERGENCY) {
      if (event.stackTrace) {
        console.error('Stack trace:', event.stackTrace);
      }
      
      // In production, you might want to send alerts here
      this.handleCriticalEvent(fullEvent);
    }
  }

  private getLogMethod(level: SecurityLevel) {
    switch (level) {
      case SecurityLevel.INFO:
        return console.info;
      case SecurityLevel.WARNING:
        return console.warn;
      case SecurityLevel.CRITICAL:
      case SecurityLevel.EMERGENCY:
        return console.error;
      default:
        return console.log;
    }
  }

  private handleCriticalEvent(event: SecurityEvent): void {
    // In a production environment, you would:
    // 1. Send alerts to monitoring systems (Sentry, DataDog, etc.)
    // 2. Notify security team
    // 3. Potentially trigger automated responses
    
    console.error(`CRITICAL SECURITY EVENT: ${event.type}`, event);
    
    // Example: Send to external monitoring (implement as needed)
    // await this.sendToSentry(event);
    // await this.sendSlackAlert(event);
  }

  /**
   * Get recent security events for analysis
   */
  getRecentEvents(
    limit: number = 100,
    level?: SecurityLevel,
    type?: SecurityEventType
  ): SecurityEvent[] {
    let filtered = this.events;

    if (level) {
      filtered = filtered.filter(event => event.level === level);
    }

    if (type) {
      filtered = filtered.filter(event => event.type === type);
    }

    return filtered
      .slice(-limit)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  /**
   * Get security statistics
   */
  getStatistics(timeframeHours: number = 24): {
    totalEvents: number;
    eventsByLevel: Record<SecurityLevel, number>;
    eventsByType: Record<SecurityEventType, number>;
    topEndpoints: Array<{ endpoint: string; count: number }>;
    topUsers: Array<{ userId: string; count: number }>;
  } {
    const cutoff = new Date(Date.now() - timeframeHours * 60 * 60 * 1000);
    const recentEvents = this.events.filter(
      event => new Date(event.timestamp) >= cutoff
    );

    const eventsByLevel = {} as Record<SecurityLevel, number>;
    const eventsByType = {} as Record<SecurityEventType, number>;
    const endpointCounts = {} as Record<string, number>;
    const userCounts = {} as Record<string, number>;

    recentEvents.forEach(event => {
      // Count by level
      eventsByLevel[event.level] = (eventsByLevel[event.level] || 0) + 1;
      
      // Count by type
      eventsByType[event.type] = (eventsByType[event.type] || 0) + 1;
      
      // Count by endpoint
      if (event.endpoint) {
        endpointCounts[event.endpoint] = (endpointCounts[event.endpoint] || 0) + 1;
      }
      
      // Count by user
      if (event.userId) {
        userCounts[event.userId] = (userCounts[event.userId] || 0) + 1;
      }
    });

    return {
      totalEvents: recentEvents.length,
      eventsByLevel,
      eventsByType,
      topEndpoints: Object.entries(endpointCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([endpoint, count]) => ({ endpoint, count })),
      topUsers: Object.entries(userCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([userId, count]) => ({ userId, count })),
    };
  }

  /**
   * Clear old events (for memory management)
   */
  clearOldEvents(olderThanHours: number = 168): void { // 7 days default
    const cutoff = new Date(Date.now() - olderThanHours * 60 * 60 * 1000);
    this.events = this.events.filter(
      event => new Date(event.timestamp) >= cutoff
    );
  }
}

// Singleton instance
export const securityLogger = new SecurityLogger();

// Convenience functions for common security events
export const logSecurityEvent = {
  authSuccess: (userId: string, orgId: string, sessionId: string, context?: Record<string, any>) =>
    securityLogger.log({
      type: SecurityEventType.AUTH_SUCCESS,
      level: SecurityLevel.INFO,
      message: 'User authentication successful',
      userId,
      orgId,
      sessionId,
      context,
    }),

  authFailure: (reason: string, ipAddress?: string, userAgent?: string, context?: Record<string, any>) =>
    securityLogger.log({
      type: SecurityEventType.AUTH_FAILURE,
      level: SecurityLevel.WARNING,
      message: `Authentication failed: ${reason}`,
      ipAddress,
      userAgent,
      context,
    }),

  accessDenied: (userId: string, orgId: string, endpoint: string, reason: string, context?: Record<string, any>) =>
    securityLogger.log({
      type: SecurityEventType.ACCESS_DENIED,
      level: SecurityLevel.WARNING,
      message: `Access denied: ${reason}`,
      userId,
      orgId,
      endpoint,
      context,
    }),

  crossTenantAttempt: (userId: string, userOrgId: string, requestedOrgId: string, endpoint: string) =>
    securityLogger.log({
      type: SecurityEventType.CROSS_TENANT_ACCESS_ATTEMPT,
      level: SecurityLevel.CRITICAL,
      message: 'Cross-tenant access attempt detected',
      userId,
      orgId: userOrgId,
      endpoint,
      context: { requestedOrgId },
    }),

  validationFailed: (endpoint: string, method: string, errors: string, userId?: string, context?: Record<string, any>) =>
    securityLogger.log({
      type: SecurityEventType.VALIDATION_FAILED,
      level: SecurityLevel.WARNING,
      message: 'Input validation failed',
      userId,
      endpoint,
      method,
      context: { errors, ...context },
    }),

  rateLimitExceeded: (identifier: string, endpoint: string, limit: number, context?: Record<string, any>) =>
    securityLogger.log({
      type: SecurityEventType.RATE_LIMIT_EXCEEDED,
      level: SecurityLevel.WARNING,
      message: `Rate limit exceeded for ${identifier}`,
      endpoint,
      context: { identifier, limit, ...context },
    }),

  suspiciousActivity: (description: string, userId?: string, orgId?: string, context?: Record<string, any>) =>
    securityLogger.log({
      type: SecurityEventType.SUSPICIOUS_ACTIVITY,
      level: SecurityLevel.CRITICAL,
      message: `Suspicious activity detected: ${description}`,
      userId,
      orgId,
      context,
    }),

  systemError: (error: Error, endpoint?: string, userId?: string, context?: Record<string, any>) =>
    securityLogger.log({
      type: SecurityEventType.DATABASE_ERROR,
      level: SecurityLevel.CRITICAL,
      message: `System error: ${error.message}`,
      userId,
      endpoint,
      stackTrace: error.stack,
      context,
    }),
};