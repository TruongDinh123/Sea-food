/**
 * middleware.ts — Edge Runtime Redirect Handler
 *
 * Xử lý URL normalization trước khi page rendering bắt đầu.
 * Theo chuẩn NotebookLM: "Redirecting non-canonical queries must occur before
 * route rendering begins to protect crawl budgets."
 *
 * Hiện tại xử lý:
 * 1. Trailing slash redirect: /san-pham/ → /san-pham (301 Permanent)
 *
 * Lưu ý: Next.js 15 đã rename proxy.ts → middleware.ts (legacy naming).
 */
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Redirect trailing slash (trừ root '/')
  // Ví dụ: /san-pham/ → /san-pham, /blog/bai-viet/ → /blog/bai-viet
  if (pathname !== '/' && pathname.endsWith('/')) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(0, -1);
    return NextResponse.redirect(url, { status: 301 });
  }

  return NextResponse.next();
}

export const config = {
  /**
   * Áp dụng middleware cho tất cả routes NGOẠI TRỪ:
   * - /api/* — API routes
   * - /_next/static/* — Next.js static assets
   * - /_next/image/* — Next.js image optimization
   * - /favicon.ico, /icon, /opengraph-image — SEO file assets
   * - /images/*, /icons/*, /uploads/* — Public static files
   */
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|icon|opengraph-image|images|icons|uploads).*)',
  ],
};
