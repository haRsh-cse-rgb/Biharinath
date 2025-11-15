'use client';

import { useEffect, useState } from 'react';

export type Platform = 'web' | 'pwa' | 'ios' | 'android' | 'unknown';

export interface PlatformInfo {
  platform: Platform;
  isNative: boolean;
  isPWA: boolean;
  isWeb: boolean;
  isIOS: boolean;
  isAndroid: boolean;
}

export function usePlatform(): PlatformInfo {
  const [platformInfo, setPlatformInfo] = useState<PlatformInfo>({
    platform: 'web',
    isNative: false,
    isPWA: false,
    isWeb: true,
    isIOS: false,
    isAndroid: false,
  });

  useEffect(() => {
    const detectPlatform = (): PlatformInfo => {
      // Check if running in Capacitor (native app)
      const isCapacitor = typeof window !== 'undefined' && (window as any).Capacitor;
      
      // Check if PWA (installed as PWA)
      const isPWA = typeof window !== 'undefined' && 
        (window.matchMedia('(display-mode: standalone)').matches ||
         (window.navigator as any).standalone === true ||
         document.referrer.includes('android-app://'));

      // Check platform
      const userAgent = typeof window !== 'undefined' ? window.navigator.userAgent : '';
      const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;
      const isAndroid = /Android/.test(userAgent);

      let platform: Platform = 'web';
      let isNative = false;

      if (isCapacitor) {
        isNative = true;
        if (isIOS) {
          platform = 'ios';
        } else if (isAndroid) {
          platform = 'android';
        } else {
          platform = 'unknown';
        }
      } else if (isPWA) {
        platform = 'pwa';
      } else {
        platform = 'web';
      }

      return {
        platform,
        isNative,
        isPWA,
        isWeb: !isNative && !isPWA,
        isIOS,
        isAndroid,
      };
    };

    setPlatformInfo(detectPlatform());
  }, []);

  return platformInfo;
}

export function getPlatformClass(platform: Platform): string {
  switch (platform) {
    case 'ios':
      return 'platform-ios';
    case 'android':
      return 'platform-android';
    case 'pwa':
      return 'platform-pwa';
    case 'web':
      return 'platform-web';
    default:
      return 'platform-unknown';
  }
}

