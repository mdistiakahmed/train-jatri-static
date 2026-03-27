/*
import { Box } from '@mantine/core';
import { useEffect } from 'react';
import useAppStore from '../../state/useAppStore';

const ADSENSE_CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

const isLocalEnv = process.env.NODE_ENV === 'development';

const FIXED_AD_SLOT_ID_BY_NAME: Record<string, string> = {
  'ad-slot-1': '3989132691', // After navbar
  'ad-slot-2': '2676051022', // After upload container
  'ad-slot-3': '2813999435',
};

interface AdSizeWithWidthHeight {
  width: number;
  height: number;
}

export type AdSize = 'LARGE' | 'SMALL' | 'VERY_LARGE';
const DesktopAdSizeWithWidthHeight: Record<AdSize, AdSizeWithWidthHeight> = {
  LARGE: {
    width: 728,
    height: 90,
  },
  SMALL: {
    width: 300,
    height: 250,
  },
  VERY_LARGE: {
    width: 970,
    height: 250,
  },
};

const MobileAdSizeWithWidthHeight: Record<AdSize, AdSizeWithWidthHeight> = {
  LARGE: {
    width: 320,
    height: 50,
  },
  SMALL: {
    width: 300,
    height: 250,
  },
  VERY_LARGE: {
    width: 320,
    height: 100,
  },
};

interface FixedAdProps {
  name: string;
  adSize: AdSize;
}

function FixedAd({ name, adSize }: Readonly<FixedAdProps>) {
  const adSlot = FIXED_AD_SLOT_ID_BY_NAME[name];
  const isMobile = useAppStore((state) => state.isMobile);

  const appliedAdSize = isMobile
    ? MobileAdSizeWithWidthHeight[adSize]
    : DesktopAdSizeWithWidthHeight[adSize];

  const height = `${appliedAdSize.height}px`;
  const width = `${appliedAdSize.width}px`;

  return (
    <Box
      sx={{
        overflow: 'hidden',
        width: '100%',
        height: 'auto !important',
        minHeight: height,
        display: 'flex',
        justifyContent: 'center',
        // border: isLocalEnv ? '1px solid red' : 'none',
        backgroundSize: 'contain',
      }}
      my="xs"
      className={`${name}-fixed-ad`}
    >
      {isLocalEnv && (
        <Box w={width} h={height} ta="center" className="ads-container">
          Slot: <b>fixed - {name}</b> | Type: <b>{isMobile ? 'Mobile' : 'Desktop'}</b> | Size:{' '}
          <b>{adSize}</b> | Dimension:
          <b>
            {width} x {height}
          </b>
        </Box>
      )}

      {!isLocalEnv && (
        <ins
          className="adsbygoogle ads-container"
          style={{ display: 'inline-block', width, height }}
          data-ad-client={ADSENSE_CLIENT_ID}
          data-ad-slot={adSlot}
        />
      )}
    </Box>
  );
}

interface Props {
  adSlotNo: number;
  adSize?: AdSize;
}

const DisplayAdContainer = ({ adSlotNo, adSize }: Props) => {
  const adSlotName = `ad-slot-${adSlotNo}`;

  const isMobile = useAppStore((state) => state.isMobile);
  const setIsMobile = useAppStore((state) => state.setIsMobile);

  useEffect(() => {
    if (isMobile !== undefined) return;
    setIsMobile(window?.matchMedia('(max-width: 500px)')?.matches);
  }, [isMobile]);

  useEffect(() => {
    if (isMobile === undefined) return;
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error(err);
    }
  }, [isMobile]);

  if (isMobile === undefined) {
    return (
      <Box
        sx={{ height: 100, maxWidth: '730px', width: '100%' }}
        mx="auto"
        my="xs"
        className="ads-container"
      >
        {isLocalEnv && <div>default ad container (isMobile = undefined)</div>}
      </Box>
    );
  }

  return <FixedAd name={adSlotName} adSize={adSize ?? 'LARGE'} />;
};

export default DisplayAdContainer;

*/