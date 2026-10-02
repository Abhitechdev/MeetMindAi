'use client';

import { usePathname } from 'next/navigation';
import Script from 'next/script';

export function Adsense() {
  const pathname = usePathname() || '';
  
  // Only load on public pages. Do not load behind auth or on app pages.
  const isPrivatePage = pathname.startsWith('/dashboard') || 
                        pathname.startsWith('/app') || 
                        pathname.startsWith('/meeting') || 
                        pathname.startsWith('/admin') ||
                        pathname.startsWith('/actions') ||
                        pathname.startsWith('/history') ||
                        pathname.startsWith('/decisions') ||
                        pathname.startsWith('/settings');

  if (isPrivatePage) {
    return null;
  }

  return (
    <Script
      id="adsbygoogle-init"
      strategy="afterInteractive"
      crossOrigin="anonymous"
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8627957484050006"
    />
  );
}
