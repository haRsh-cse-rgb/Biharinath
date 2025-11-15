import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const response = NextResponse.json({ success: true });

  // Determine cookie settings for production
  const isProduction = process.env.NODE_ENV === 'production';

  // Clear cookie with same settings as when it was set
  response.cookies.set('auth-token', '', {
    httpOnly: true,
    secure: isProduction, // Match the secure setting used when setting the cookie
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });

  return response;
}
