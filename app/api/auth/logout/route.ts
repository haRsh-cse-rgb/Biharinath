import { NextResponse } from 'next/server';

// Force dynamic rendering - cookies() requires dynamic context
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: Request) {
  const response = NextResponse.json({ success: true });

  // Determine cookie settings - check for HTTPS properly
  const isProduction = process.env.NODE_ENV === 'production';
  const forwardedProto = request.headers.get('x-forwarded-proto');
  const origin = request.headers.get('origin');
  const url = new URL(request.url);
  
  // Check if request is over HTTPS
  const isHTTPS = 
    forwardedProto === 'https' || 
    url.protocol === 'https:' ||
    (origin && origin.startsWith('https://'));
  
  // Ensure it's always a boolean, not null or empty string
  const useSecure: boolean = Boolean(isProduction && isHTTPS);

  // Clear cookie with same settings as when it was set
  response.cookies.set('auth-token', '', {
    httpOnly: true,
    secure: useSecure,
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });

  return response;
}
