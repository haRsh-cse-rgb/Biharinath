'use client';

import { usePlatform } from '@/lib/platform';
import { Navbar } from '@/components/layout/Navbar';

export function PlatformAwareNavbar() {
  const platformInfo = usePlatform();
  
  // You can conditionally render different navbars based on platform
  // For now, we'll use the same navbar but with platform-specific classes
  return <Navbar />;
}

