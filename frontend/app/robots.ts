import { MetadataRoute } from 'next';

// ponytail: use env var so staging/prod resolve correctly, fallback to production domain
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.meetmindai.co.in';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/login', '/dashboard/', '/app/', '/history', '/actions', '/settings', '/decisions'],
      },
      {
        userAgent: 'Mediapartners-Google',
        allow: '/',
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
