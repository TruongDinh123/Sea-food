import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  // Block crawlers trong staging/preview — chỉ cho phép index khi là production
  const isProduction =
    process.env.VERCEL_ENV === 'production' ||
    (process.env.NODE_ENV === 'production' && !process.env.VERCEL_ENV);

  return {
    rules: isProduction
      ? {
          userAgent: '*',
          allow: '/',
          disallow: ['/api/', '/dashboard/', '/auth/'],
        }
      : {
          // Staging/Preview: block toàn bộ — tránh index duplicate content
          userAgent: '*',
          disallow: '/',
        },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
