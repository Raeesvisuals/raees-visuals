import { NextRequest, NextResponse } from 'next/server';
import { authenticate, createSession } from '@/lib/auth';
import { validateInput, loginSchema } from '@/lib/validation';
import { loginRateLimit } from '@/lib/rate-limit';
import { bruteForceProtection } from '@/lib/rate-limit';
import { logSecurityEvent } from '@/lib/security';

export async function POST(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResult = loginRateLimit(request);
  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { success: false, error: 'Too many login attempts. Please try again later.' },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    
    // Validate input
    const validation = validateInput(loginSchema, body);
    if (!validation.success) {
      logSecurityEvent('INVALID_LOGIN_INPUT', { errors: validation.errors }, request);
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid input data',
        details: validation.errors 
      }, { status: 400 });
    }

    const { username, password } = validation.data!;
    const clientIP = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
    
    // Check brute force protection
    if (bruteForceProtection.isBlocked(clientIP)) {
      const lockoutTime = bruteForceProtection.getLockoutTime(clientIP);
      logSecurityEvent('BRUTE_FORCE_BLOCKED', { clientIP, lockoutTime }, request);
      return NextResponse.json({
        success: false,
        error: `Account temporarily locked. Try again in ${Math.ceil((lockoutTime || 0) / 60000)} minutes.`
      }, { status: 429 });
    }

    // Authenticate user
    const authResult = await authenticate(username, password, request);
    
    if (authResult.success) {
      // Create secure session
      await createSession(authResult.sessionToken!);
      
      // Record successful attempt
      bruteForceProtection.recordAttempt(clientIP, true);
      
      return NextResponse.json({ success: true });
    } else {
      // Record failed attempt
      bruteForceProtection.recordAttempt(clientIP, false);
      
      const remainingAttempts = bruteForceProtection.getRemainingAttempts(clientIP);
      
      return NextResponse.json({
        success: false,
        error: authResult.error,
        remainingAttempts
      }, { status: 401 });
    }
  } catch (error) {
    logSecurityEvent('LOGIN_ERROR', { error: error instanceof Error ? error.message : 'Unknown error' }, request);
    return NextResponse.json({ 
      success: false, 
      error: 'Login failed. Please try again.' 
    }, { status: 500 });
  }
}
