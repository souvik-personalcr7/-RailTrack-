import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED_PAGES = ['/favorites'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get('token')?.value;

  const isProtectedPage = PROTECTED_PAGES.some((page) => pathname.startsWith(page));

  // Redirect unauthenticated visitors attempting to access protected pages (e.g. /favorites) to /login
  if (!token && isProtectedPage) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/favorites'],
};
