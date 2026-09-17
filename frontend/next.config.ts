import type { NextConfig } from "next";
import withBundleAnalyzer from '@next/bundle-analyzer';

const analyzeBundle = process.env.ANALYZE === 'true';
const withAnalyzer = withBundleAnalyzer({
  enabled: analyzeBundle,
});

// ponytail: dynamically grab the backend domain for CSP to avoid blocking our own API
const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || '';
const backendDomain = apiBase ? (apiBase.startsWith('http') ? apiBase : `https://${apiBase}`) : '';

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
  productionBrowserSourceMaps: true,
  async redirects() {
    return [
      // Retired / Consolidated blog articles (301 Permanent Redirects)
      {
        source: '/blog/best-ai-note-taking-apps-2026',
        destination: '/features',
        permanent: true,
      },
      {
        source: '/blog/best-ai-meeting-assistants-2026',
        destination: '/features',
        permanent: true,
      },
      {
        source: '/blog/meeting-action-items',
        destination: '/features',
        permanent: true,
      },
      {
        source: '/blog/meeting-summary-templates',
        destination: '/features',
        permanent: true,
      },
      {
        source: '/blog/local-ai-transcription-privacy',
        destination: '/blog/ai-meeting-assistant-privacy-recording-guide',
        permanent: true,
      },
      {
        source: '/blog/meeting-recording-compliance-gdpr-dpdp-hipaa',
        destination: '/blog/ai-meeting-assistant-privacy-recording-guide',
        permanent: true,
      },
      {
        source: '/blog/integrating-meeting-notes-slack-notion-zapier',
        destination: '/blog/automated-meeting-workflows-jira-linear',
        permanent: true,
      },
      {
        source: '/blog/ai-for-students',
        destination: '/use-cases',
        permanent: true,
      },
      {
        source: '/blog/remote-team-meeting-best-practices',
        destination: '/features',
        permanent: true,
      },
      {
        source: '/blog/ai-in-business-communication',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/blog/ai-agents-vs-assistants',
        destination: '/how-it-works',
        permanent: true,
      },
      {
        source: '/blog/ai-productivity-tips',
        destination: '/how-it-works',
        permanent: true,
      },
      {
        source: '/blog/how-to-improve-meeting-productivity-with-ai',
        destination: '/how-it-works',
        permanent: true,
      },
      {
        source: '/blog/ai-tools-for-professionals',
        destination: '/features',
        permanent: true,
      },
      {
        source: '/blog/future-of-ai-meetings',
        destination: '/how-it-works',
        permanent: true,
      },
      {
        source: '/blog/common-meeting-mistakes',
        destination: '/how-it-works',
        permanent: true,
      },
      {
        source: '/blog/voice-ai-explained',
        destination: '/blog/faster-whisper-explained',
        permanent: true,
      },
      {
        source: '/blog/how-ai-transcription-works',
        destination: '/blog/faster-whisper-explained',
        permanent: true,
      },
      {
        source: '/blog/how-to-write-better-meeting-minutes',
        destination: '/features',
        permanent: true,
      },
      {
        source: '/blog/how-ai-saves-time-during-meetings',
        destination: '/features',
        permanent: true,
      },
      {
        source: '/blog/turn-meeting-transcripts-into-action-items-using-ai',
        destination: '/features',
        permanent: true,
      },
      {
        source: '/blog/ai-workflow-automation',
        destination: '/blog/automated-meeting-workflows-jira-linear',
        permanent: true,
      },
      {
        source: '/blog/how-ai-meeting-summaries-work',
        destination: '/blog/how-meetmind-ai-works',
        permanent: true,
      },
      {
        source: '/blog/what-is-an-ai-meeting-assistant',
        destination: '/blog/how-meetmind-ai-works',
        permanent: true,
      },
      {
        source: '/blog/how-to-transcribe-mp3-to-text-2026',
        destination: '/blog/speech-to-text-audio-preprocessing-guide',
        permanent: true,
      },
      {
        source: '/blog/best-practices-leveraging-ai-summaries',
        destination: '/features',
        permanent: true,
      },

      // Legacy legal / utility redirects
      {
        source: '/privacy',
        destination: '/legal/privacy',
        permanent: true,
      },
      {
        source: '/terms',
        destination: '/legal/terms',
        permanent: true,
      },
      {
        source: '/cookie-policy',
        destination: '/legal/cookies-policy',
        permanent: true,
      },
      {
        source: '/cookies',
        destination: '/legal/cookies-policy',
        permanent: true,
      },
      {
        source: '/cookies-policy',
        destination: '/legal/cookies-policy',
        permanent: true,
      },
      {
        source: '/ai-transparency',
        destination: '/legal/ai-transparency',
        permanent: true,
      },
      {
        source: '/acceptable-use',
        destination: '/legal/acceptable-use',
        permanent: true,
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
            value: 'unsafe-none', // Required for Razorpay popup postMessage communication
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

export default withAnalyzer(nextConfig);
