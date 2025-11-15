"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { usePlatform } from '@/lib/platform';

export function SplashScreen() {
  const { isNative, isPWA } = usePlatform();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Only show splash on native apps or PWA
    if (!isNative && !isPWA) {
      setShowSplash(false);
      return;
    }

    // Show splash for 2 seconds
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [isNative, isPWA]);

  if (!showSplash) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-green-600 via-green-700 to-green-900 flex items-center justify-center">
      <div className="flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative h-32 w-32 md:h-40 md:w-40 rounded-full overflow-hidden border-4 border-white shadow-2xl mb-6"
        >
          <Image
            src="/logo.jpeg"
            alt="Biharinath Organic Farms"
            fill
            className="object-cover"
            unoptimized
            priority
          />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-2xl md:text-3xl font-bold text-white text-center"
        >
          Biharinath Organic Farms
        </motion.h1>
      </div>
    </div>
  );
}

