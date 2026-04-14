import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    // Add user to headers or something
    const response = NextResponse.next();
    response.headers.set('x-user-id', decoded.userId);
    response.headers.set('x-user-role', decoded.role);
    return response;
  } catch (error) {
    return NextResponse.redirect(new URL('/', request.url));
  }
}

export const config = {
  matcher: ['/dashboard/:path*'],
};