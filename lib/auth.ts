import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { logSecurityEvent } from './security';

// Enhanced authentication system
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'its_raees';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Morih@srat41471';
const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret';
const SESSION_COOKIE_NAME = 'admin_session';
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

// In-memory store for login attempts (in production, use Redis)
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();

export async function authenticate(username: string, password: string, request: any): Promise<{ success: boolean; error?: string; sessionToken?: string }> {
  const clientIP = request?.ip || request?.headers?.get('x-forwarded-for') || 'unknown';
  
  // Check for brute force attempts
  const attempts = loginAttempts.get(clientIP);
  if (attempts && attempts.count >= MAX_LOGIN_ATTEMPTS) {
    const timeSinceLastAttempt = Date.now() - attempts.lastAttempt;
    if (timeSinceLastAttempt < LOCKOUT_DURATION) {
      logSecurityEvent('BRUTE_FORCE_ATTEMPT', { clientIP, username }, request);
      return { success: false, error: 'Too many login attempts. Please try again later.' };
    } else {
      // Reset attempts after lockout period
      loginAttempts.delete(clientIP);
    }
  }
  
  // Validate credentials
  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    const currentAttempts = loginAttempts.get(clientIP) || { count: 0, lastAttempt: 0 };
    loginAttempts.set(clientIP, {
      count: currentAttempts.count + 1,
      lastAttempt: Date.now()
    });
    
    logSecurityEvent('FAILED_LOGIN', { clientIP, username }, request);
    return { success: false, error: 'Invalid username or password' };
  }
  
  // Clear attempts on successful login
  loginAttempts.delete(clientIP);
  
  // Create secure session
  const sessionId = generateSecureSessionId();
  const sessionToken = jwt.sign(
    { sessionId, username, timestamp: Date.now() },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
  
  logSecurityEvent('SUCCESSFUL_LOGIN', { clientIP, username }, request);
  
  return { success: true, sessionToken };
}

export async function createSession(sessionToken: string): Promise<string> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/'
  });
  
  return sessionToken;
}

export async function verifySession(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get(SESSION_COOKIE_NAME);
    
    if (!session?.value) return false;
    
    const decoded = jwt.verify(session.value, JWT_SECRET) as any;
    
    // Check if session is not expired
    if (Date.now() - decoded.timestamp > 24 * 60 * 60 * 1000) {
      return false;
    }
    
    return true;
  } catch (error) {
    return false;
  }
}

export async function requireAuth() {
  const isAuthenticated = await verifySession();
  if (!isAuthenticated) {
    redirect('/secure-admin/login');
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  redirect('/secure-admin/login');
}

function generateSecureSessionId(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Role-based access control
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user'
}

export function hasPermission(userRole: UserRole, requiredRole: UserRole): boolean {
  const roleHierarchy = {
    [UserRole.USER]: 1,
    [UserRole.ADMIN]: 2
  };
  
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}

// Password strength validation
export function validatePasswordStrength(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[@$!%*?&]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}