import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  console.log(
    `[Middleware] 요청 경로: ${request.nextUrl.pathname}, 메서드: ${request.method}`
  );

  // API 라우트에 대한 CORS 처리
  if (request.nextUrl.pathname.startsWith('/api/')) {
    console.log(`[Middleware] API 라우트 감지: ${request.nextUrl.pathname}`);

    // OPTIONS 요청 처리 (preflight)
    if (request.method === 'OPTIONS') {
      console.log('[Middleware] OPTIONS 요청 처리 (preflight)');
      return new NextResponse(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers':
            'Content-Type, Authorization, X-Requested-With',
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    // 실제 요청에 대한 CORS 헤더 추가
    console.log(`[Middleware] ${request.method} 요청에 CORS 헤더 추가`);
    const response = NextResponse.next();
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, OPTIONS'
    );
    response.headers.set(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization, X-Requested-With'
    );
    response.headers.set('Access-Control-Allow-Credentials', 'true');

    return response;
  }

  console.log(`[Middleware] API 라우트가 아님: ${request.nextUrl.pathname}`);
  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
