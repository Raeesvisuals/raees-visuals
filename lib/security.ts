import { NextRequest, NextResponse } from 'next/server';

// Security headers configuration
export const securityHeaders = {
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  // X-Frame-Options removed - using CSP frame-ancestors instead (allows YouTube embeds)
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  'X-XSS-Protection': '1; mode=block',
  'X-Download-Options': 'noopen',
  'X-Permitted-Cross-Domain-Policies': 'none',
  'Cross-Origin-Embedder-Policy': 'unsafe-none', // Changed from 'require-corp' to allow YouTube embeds
  'Cross-Origin-Opener-Policy': 'same-origin-allow-popups', // Changed to allow popups
  'Cross-Origin-Resource-Policy': 'same-origin'
};

// Content Security Policy
export const getCSPHeader = (nonce: string) => ({
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "media-src 'self' https: blob:",
    "connect-src 'self' https: wss:",
    "frame-src 'self' https://www.youtube.com https://youtube.com https://youtu.be",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests"
  ].join('; ')
});

// Generate nonce for CSP
export const generateNonce = (): string => {
  return Buffer.from(crypto.getRandomValues(new Uint8Array(16))).toString('base64');
};

// Security middleware
export function securityMiddleware(request: NextRequest) {
  const response = NextResponse.next();
  const nonce = generateNonce();
  
  // Add security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  // Add CSP with nonce
  const cspHeader = getCSPHeader(nonce);
  Object.entries(cspHeader).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  // Add nonce to response for use in components
  response.headers.set('X-Nonce', nonce);
  
  return response;
}

// Input validation schemas
export const validationSchemas = {
  username: /^[a-zA-Z0-9_]{3,20}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/
};

// Sanitize input
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/['"]/g, '') // Remove quotes
    .replace(/[;]/g, '') // Remove semicolons
    .trim();
}

// Validate file upload
export function validateFile(file: File): { valid: boolean; error?: string } {
  const maxSize = parseInt(process.env.MAX_FILE_SIZE || '10485760'); // 10MB
  const allowedTypes = (process.env.ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/gif,video/mp4,video/webm').split(',');
  
  if (file.size > maxSize) {
    return { valid: false, error: 'File size exceeds limit' };
  }
  
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'File type not allowed' };
  }
  
  return { valid: true };
}

// Rate limiting configuration
export const rateLimitConfig = {
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  standardHeaders: true,
  legacyHeaders: false,
};

// Security logging
export function logSecurityEvent(event: string, details: any, request: NextRequest) {
  if (process.env.ENABLE_SECURITY_LOGGING === 'true') {
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      event,
      details,
      ip: request.ip || request.headers.get('x-forwarded-for'),
      userAgent: request.headers.get('user-agent'),
      url: request.url
    }));
  }
}
