import { NextRequest, NextResponse } from 'next/server';

// Блокирует приватные страницы без токена
export function middleware(request: NextRequest) {
    const accessToken = request.cookies.get('accessToken')?.value;
    const refreshToken = request.cookies.get('refreshToken')?.value;

    if (!accessToken && !refreshToken) {
        return NextResponse.redirect(new URL('/auth', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/users/:path*', '/order-history']
};
