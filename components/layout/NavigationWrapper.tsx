"use client";

import { usePlatform } from '@/lib/platform';
import { Navbar } from './Navbar';
import { BottomNav } from './BottomNav';

export function NavigationWrapper() {
  const { isNative, isPWA } = usePlatform();
  const showBottomNav = isNative || isPWA;
  const showTopNav = !showBottomNav;

  return (
    <>
      {showTopNav && <Navbar />}
      {showBottomNav && <BottomNav />}
    </>
  );
}

