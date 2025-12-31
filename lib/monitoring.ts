import { NextRequest } from 'next/server';

// Security event types
export enum SecurityEventType {
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILED = 'LOGIN_FAILED',
  BRUTE_FORCE_ATTEMPT = 'BRUTE_FORCE_ATTEMPT',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  UNAUTHORIZED_ACCESS = 'UNAUTHORIZED_ACCESS',
  FILE_UPLOAD = 'FILE_UPLOAD',
  INVALID_INPUT = 'INVALID_INPUT',
  SECURITY_HEADER_VIOLATION = 'SECURITY_HEADER_VIOLATION',
  SUSPICIOUS_ACTIVITY = 'SUSPICIOUS_ACTIVITY'
}

// Log entry interface
export interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'security';
  event: SecurityEventType;
  message: string;
  details: any;
  ip?: string;
  userAgent?: string;
  url?: string;
  userId?: string;
  sessionId?: string;
}

// Security monitoring class
export class SecurityMonitor {
  private static instance: SecurityMonitor;
  private logs: LogEntry[] = [];
  private maxLogs = 10000; // Keep last 10k logs in memory

  static getInstance(): SecurityMonitor {
    if (!SecurityMonitor.instance) {
      SecurityMonitor.instance = new SecurityMonitor();
    }
    return SecurityMonitor.instance;
  }

  log(event: SecurityEventType, message: string, details: any, request?: NextRequest, userId?: string) {
    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: this.getLogLevel(event),
      event,
      message,
      details,
      ip: request?.ip || request?.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request?.headers.get('user-agent') || undefined,
      url: request?.url,
      userId,
      sessionId: request?.cookies.get('admin_session')?.value || undefined
    };

    this.logs.push(logEntry);
    
    // Keep only recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Console output for development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[${logEntry.level.toUpperCase()}] ${logEntry.event}: ${logEntry.message}`, logEntry.details);
    }

    // Send to external monitoring service (Sentry, etc.)
    this.sendToExternalService(logEntry);
  }

  private getLogLevel(event: SecurityEventType): 'info' | 'warn' | 'error' | 'security' {
    switch (event) {
      case SecurityEventType.LOGIN_SUCCESS:
        return 'info';
      case SecurityEventType.LOGIN_FAILED:
      case SecurityEventType.RATE_LIMIT_EXCEEDED:
        return 'warn';
      case SecurityEventType.BRUTE_FORCE_ATTEMPT:
      case SecurityEventType.UNAUTHORIZED_ACCESS:
      case SecurityEventType.SUSPICIOUS_ACTIVITY:
        return 'security';
      default:
        return 'info';
    }
  }

  private sendToExternalService(logEntry: LogEntry) {
    // In production, send to Sentry, LogDNA, or similar
    if (process.env.SENTRY_DSN && logEntry.level === 'error') {
      // Send error logs to Sentry
      // Sentry.captureException(new Error(logEntry.message), { extra: logEntry.details });
    }
  }

  getLogs(filter?: { event?: SecurityEventType; level?: string; since?: Date }): LogEntry[] {
    let filteredLogs = this.logs;

    if (filter) {
      if (filter.event) {
        filteredLogs = filteredLogs.filter(log => log.event === filter.event);
      }
      if (filter.level) {
        filteredLogs = filteredLogs.filter(log => log.level === filter.level);
      }
      if (filter.since) {
        filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) >= filter.since!);
      }
    }

    return filteredLogs;
  }

  getSecurityMetrics(): {
    totalLogins: number;
    failedLogins: number;
    bruteForceAttempts: number;
    rateLimitHits: number;
    suspiciousActivity: number;
  } {
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentLogs = this.logs.filter(log => new Date(log.timestamp) >= last24Hours);

    return {
      totalLogins: recentLogs.filter(log => log.event === SecurityEventType.LOGIN_SUCCESS).length,
      failedLogins: recentLogs.filter(log => log.event === SecurityEventType.LOGIN_FAILED).length,
      bruteForceAttempts: recentLogs.filter(log => log.event === SecurityEventType.BRUTE_FORCE_ATTEMPT).length,
      rateLimitHits: recentLogs.filter(log => log.event === SecurityEventType.RATE_LIMIT_EXCEEDED).length,
      suspiciousActivity: recentLogs.filter(log => log.event === SecurityEventType.SUSPICIOUS_ACTIVITY).length
    };
  }

  detectAnomalies(): string[] {
    const metrics = this.getSecurityMetrics();
    const anomalies: string[] = [];

    // High failed login rate
    if (metrics.failedLogins > 10) {
      anomalies.push('High failed login rate detected');
    }

    // Brute force attempts
    if (metrics.bruteForceAttempts > 5) {
      anomalies.push('Brute force attempts detected');
    }

    // High rate limit hits
    if (metrics.rateLimitHits > 50) {
      anomalies.push('High rate limit hits detected');
    }

    // Suspicious activity
    if (metrics.suspiciousActivity > 3) {
      anomalies.push('Suspicious activity detected');
    }

    return anomalies;
  }
}

// Global security monitor instance
export const securityMonitor = SecurityMonitor.getInstance();

// Helper function for logging security events
export function logSecurityEvent(
  event: SecurityEventType,
  message: string,
  details: any,
  request?: NextRequest,
  userId?: string
) {
  securityMonitor.log(event, message, details, request, userId);
}

// Uptime monitoring
export class UptimeMonitor {
  private static instance: UptimeMonitor;
  private startTime: Date;
  private healthChecks: { [key: string]: Date } = {};

  static getInstance(): UptimeMonitor {
    if (!UptimeMonitor.instance) {
      UptimeMonitor.instance = new UptimeMonitor();
    }
    return UptimeMonitor.instance;
  }

  constructor() {
    this.startTime = new Date();
  }

  recordHealthCheck(service: string) {
    this.healthChecks[service] = new Date();
  }

  getUptime(): number {
    return Date.now() - this.startTime.getTime();
  }

  getHealthStatus(): { [key: string]: { lastCheck: Date; status: 'healthy' | 'unhealthy' } } {
    const now = new Date();
    const status: { [key: string]: { lastCheck: Date; status: 'healthy' | 'unhealthy' } } = {};

    Object.entries(this.healthChecks).forEach(([service, lastCheck]) => {
      const timeSinceLastCheck = now.getTime() - lastCheck.getTime();
      status[service] = {
        lastCheck,
        status: timeSinceLastCheck < 5 * 60 * 1000 ? 'healthy' : 'unhealthy' // 5 minutes threshold
      };
    });

    return status;
  }
}

export const uptimeMonitor = UptimeMonitor.getInstance();
