import { NextRequest, NextResponse } from 'next/server';
import { logSecurityEvent } from './security';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

// In-memory store (use Redis in production)
const rateLimitStore: RateLimitStore = {};

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  keyGenerator?: (req: NextRequest) => string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

export const defaultConfig: RateLimitConfig = {
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  keyGenerator: (req: NextRequest) => {
    // Use IP address as key
    return req.ip || req.headers.get('x-forwarded-for') || 'unknown';
  }
};

export function createRateLimit(config: RateLimitConfig = defaultConfig) {
  return (req: NextRequest): { allowed: boolean; remaining: number; resetTime: number } => {
    const key = config.keyGenerator ? config.keyGenerator(req) : defaultConfig.keyGenerator!(req);
    const now = Date.now();
    
    // Clean up expired entries
    Object.keys(rateLimitStore).forEach(storedKey => {
      if (rateLimitStore[storedKey].resetTime < now) {
        delete rateLimitStore[storedKey];
      }
    });
    
    // Get or create entry for this key
    if (!rateLimitStore[key]) {
      rateLimitStore[key] = {
        count: 0,
        resetTime: now + config.windowMs
      };
    }
    
    const entry = rateLimitStore[key];
    
    // Check if window has expired
    if (now > entry.resetTime) {
      entry.count = 0;
      entry.resetTime = now + config.windowMs;
    }
    
    // Increment counter
    entry.count++;
    
    const remaining = Math.max(0, config.maxRequests - entry.count);
    const allowed = entry.count <= config.maxRequests;
    
    if (!allowed) {
      logSecurityEvent('RATE_LIMIT_EXCEEDED', { 
        key, 
        count: entry.count, 
        maxRequests: config.maxRequests 
      }, req);
    }
    
    return {
      allowed,
      remaining,
      resetTime: entry.resetTime
    };
  };
}

// Specific rate limits for different endpoints
export const loginRateLimit = createRateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // 5 login attempts per 15 minutes
  keyGenerator: (req: NextRequest) => {
    const ip = req.ip || req.headers.get('x-forwarded-for') || 'unknown';
    return `login:${ip}`;
  }
});

export const uploadRateLimit = createRateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 10, // 10 uploads per hour
  keyGenerator: (req: NextRequest) => {
    const ip = req.ip || req.headers.get('x-forwarded-for') || 'unknown';
    return `upload:${ip}`;
  }
});

export const apiRateLimit = createRateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100, // 100 API calls per 15 minutes
  keyGenerator: (req: NextRequest) => {
    const ip = req.ip || req.headers.get('x-forwarded-for') || 'unknown';
    return `api:${ip}`;
  }
});

// Rate limit middleware
export function rateLimitMiddleware(rateLimitFn: ReturnType<typeof createRateLimit>) {
  return (req: NextRequest): NextResponse | null => {
    const result = rateLimitFn(req);
    
    if (!result.allowed) {
      const response = NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
      
      response.headers.set('X-RateLimit-Limit', '100');
      response.headers.set('X-RateLimit-Remaining', '0');
      response.headers.set('X-RateLimit-Reset', new Date(result.resetTime).toISOString());
      response.headers.set('Retry-After', Math.ceil((result.resetTime - Date.now()) / 1000).toString());
      
      return response;
    }
    
    return null;
  };
}

// Brute force protection
export class BruteForceProtection {
  private attempts: Map<string, { count: number; lastAttempt: number; lockedUntil?: number }> = new Map();
  private maxAttempts: number;
  private lockoutDuration: number;
  private windowMs: number;
  
  constructor(
    maxAttempts: number = 5,
    lockoutDuration: number = 15 * 60 * 1000, // 15 minutes
    windowMs: number = 15 * 60 * 1000 // 15 minutes
  ) {
    this.maxAttempts = maxAttempts;
    this.lockoutDuration = lockoutDuration;
    this.windowMs = windowMs;
  }
  
  isBlocked(key: string): boolean {
    const attempt = this.attempts.get(key);
    if (!attempt) return false;
    
    const now = Date.now();
    
    // Check if still locked
    if (attempt.lockedUntil && now < attempt.lockedUntil) {
      return true;
    }
    
    // Check if window has expired
    if (now - attempt.lastAttempt > this.windowMs) {
      this.attempts.delete(key);
      return false;
    }
    
    return attempt.count >= this.maxAttempts;
  }
  
  recordAttempt(key: string, success: boolean): void {
    const now = Date.now();
    const attempt = this.attempts.get(key) || { count: 0, lastAttempt: now };
    
    if (success) {
      // Clear attempts on success
      this.attempts.delete(key);
    } else {
      attempt.count++;
      attempt.lastAttempt = now;
      
      // Lock if max attempts reached
      if (attempt.count >= this.maxAttempts) {
        attempt.lockedUntil = now + this.lockoutDuration;
      }
      
      this.attempts.set(key, attempt);
    }
  }
  
  getRemainingAttempts(key: string): number {
    const attempt = this.attempts.get(key);
    if (!attempt) return this.maxAttempts;
    
    return Math.max(0, this.maxAttempts - attempt.count);
  }
  
  getLockoutTime(key: string): number | null {
    const attempt = this.attempts.get(key);
    if (!attempt || !attempt.lockedUntil) return null;
    
    return Math.max(0, attempt.lockedUntil - Date.now());
  }
}

export const bruteForceProtection = new BruteForceProtection();
