import type { NextConfig } from "next";

// ponytail: dynamically grab the backend domain for CSP to avoid blocking our own API
const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || '';
const backendDomain = apiBase.startsWith('http') ? apiBase : '';

const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://pagead2.googlesyndication.com https://www.googletagmanager.com https://unpkg.com https://checkout.razorpay.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data: https://pagead2.googlesyndication.com https://*.google-analytics.com https://www.googletagmanager.com;
  font-src 'self' data:;
  object-src 'none';
  base-uri 'self';
  form-action 'self' https://api.web3forms.com;
  frame-src 'self' https://*.razorpay.com https://*.google.com https://*.doubleclick.net;
  connect-src 'self' ${backendDomain} https://*.supabase.co wss://*.supabase.co https://*.razorpay.com https://api.web3forms.com https://*.google-analytics.com https://pagead2.googlesyndication.com https://*.doubleclick.net https://*.lottie.host https://lottie.host https://unpkg.com;
`.replace(/\s{2,}/g, ' ').trim()

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://127.0.0.1:8000/:path*',
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), geolocation=(), accelerometer=(), gyroscope=(), magnetometer=(), payment=(self), microphone=(self)',
          },
          {
            key: 'Content-Security-Policy',
            value: cspHeader,
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups', // Allows Supabase OAuth and Razorpay popups
          },
          {
            key: 'Cross-Origin-Resource-Policy',
            value: 'cross-origin', // Needed for external scripts like Adsense and GTM
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'unsafe-none', // Necessary so Adsense and embedded scripts aren't blocked
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
      {
        source: '/(login|signup|forgot-password|reset-password|verify-email)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
