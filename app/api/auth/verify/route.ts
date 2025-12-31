import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('admin_session');
    
    return NextResponse.json({ 
      authenticated: !!session?.value 
    });
  } catch (error) {
    console.error('Auth verification error:', error);
    return NextResponse.json({ 
      authenticated: false 
    });
  }
}
