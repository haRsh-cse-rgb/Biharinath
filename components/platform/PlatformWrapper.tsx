'use client';

import { usePlatform, getPlatformClass } from '@/lib/platform';
import { useEffect } from 'react';

export function PlatformWrapper({ children }: { children: React.ReactNode }) {
  const platformInfo = usePlatform();

  useEffect(() => {
    // Add platform class to body for global styling
    const body = document.body;
    const platformClass = getPlatformClass(platformInfo.platform);
    
    // Remove all platform classes first
    body.classList.remove('platform-ios', 'platform-android', 'platform-pwa', 'platform-web', 'platform-unknown');
    // Add current platform class
    body.classList.add(platformClass);
    
    // Add additional classes for styling
    if (platformInfo.isNative) {
      body.classList.add('is-native');
    }
    if (platformInfo.isPWA) {
      body.classList.add('is-pwa');
    }
    if (platformInfo.isWeb) {
      body.classList.add('is-web');
    }

    return () => {
      body.classList.remove(platformClass, 'is-native', 'is-pwa', 'is-web');
    };
  }, [platformInfo]);

  return <>{children}</>;
}

