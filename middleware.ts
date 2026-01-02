import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Allow all requests to pass through - authentication handled in API routes
  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};

