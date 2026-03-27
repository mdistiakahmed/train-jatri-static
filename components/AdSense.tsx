'use client';

import Script from 'next/script';

export default function AdSense() {
  return (
    <Script
      id="adsbygoogle-script"
      async
      strategy="afterInteractive"
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
      crossOrigin="anonymous"
      data-ad-client="ca-pub-9851111861096184"
      
    />
  );
}