import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function proxy(request: NextRequest) {
    const session = request.cookies.get('auth_session');
    const { pathname } = request.nextUrl;

    // Login page access: redirect to dashboard if already logged in
    if (pathname === '/login') {
        if (session) {
            return NextResponse.redirect(new URL('/', request.url));
        }
        return NextResponse.next();
    }

    // Protected routes: redirect to login if not logged in
    // Exclude static assets and api routes that might be public (if any)
    // Here we protect everything else
    const isPublicAsset = pathname.includes('.') || pathname.startsWith('/_next');

    if (!session && !isPublicAsset) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - logo.png (logo file)
         * - grid.svg (background pattern)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|logo.png|grid.svg).*)',
    ],
};
