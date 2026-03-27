"use client";
import React, { ReactNode, useEffect, useState } from 'react';

type Props = {
  children?: ReactNode;
};

declare global {
  interface Window {
    adsbygoogle?: any | any[];
  }
}

interface AdSizeWithWidthHeight {
  width: number;
  height: number;
}

const FIXED_AD_SLOT_ID_BY_NAME: Record<string, string> = {
  'ad-slot-1': '1301835385', // Desktop
  'ad-slot-2': '5160101609'  // Mobile
};

const ADSENSE_CLIENT_ID = "ca-pub-9851111861096184";
const isLocalEnv = process.env.NODE_ENV === 'development';

const DesktopAdSize: AdSizeWithWidthHeight = { width: 728, height: 430 };
const MobileAdSize: AdSizeWithWidthHeight = { width: 320, height: 430 };

const GoogleAd = ({ children }: Props) => {
  const [isMobile, setIsMobile] = useState<boolean>(true);

  // ✅ Detect mobile screen using window.innerWidth
  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Initial check
    checkIsMobile();

    // Listen for resize to adapt dynamically
    window.addEventListener("resize", checkIsMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);


  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error(err);
    }
  }, [isMobile]);

  const appliedAdSize = isMobile ? MobileAdSize : DesktopAdSize;
  const adSlotNo = isMobile ? FIXED_AD_SLOT_ID_BY_NAME['ad-slot-2'] : FIXED_AD_SLOT_ID_BY_NAME['ad-slot-1'];
  const height = `${appliedAdSize.height}px`;
  const width = `${appliedAdSize.width}px`;

  return (
    <div
      style={{
        overflow: 'hidden',
        width: '100%',
        maxHeight: '430px',
        minHeight: '430px',
        display: 'flex',
        justifyContent: 'center',
        margin: '1rem 0',
      }}
    >
      {isLocalEnv && (
        <div style={{ width, height, textAlign: 'center', border: '1px solid red', padding: '10px' }}>
          Type: <b>{isMobile ? 'Mobile' : 'Desktop'}</b> | Dimension: <b>{width} x {height}</b>
        </div>
      )}

      {!isLocalEnv && (
        <ins
          className="adsbygoogle ads-container"
          style={{ display: 'inline-block', width, height }}
          data-ad-client={ADSENSE_CLIENT_ID}
          data-ad-slot={adSlotNo}
        />
      )}

      {children}
    </div>
  );
};

export default GoogleAd;
