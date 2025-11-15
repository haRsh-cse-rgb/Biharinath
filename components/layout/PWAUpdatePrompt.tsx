"use client";

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, X } from 'lucide-react';
import { usePlatform } from '@/lib/platform';

export function PWAUpdatePrompt() {
  const { isPWA, isNative } = usePlatform();
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    // Only show on PWA, not on native apps or regular web
    if (isNative || !isPWA) {
      return;
    }

    // Check if service workers are supported
    if ('serviceWorker' in navigator) {
      let refreshing = false;

      // Listen for controller change (new service worker activated)
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
          refreshing = true;
          window.location.reload();
        }
      });

      // Register service worker
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          setRegistration(reg);

          // Check for updates every hour
          setInterval(() => {
            reg.update();
          }, 60 * 60 * 1000);

          // Check for updates on page load
          reg.update();

          // Listen for new service worker
          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New service worker is installed and waiting
                  setShowUpdatePrompt(true);
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });

      // Check if there's a waiting service worker
      navigator.serviceWorker.ready.then((reg) => {
        if (reg.waiting) {
          setShowUpdatePrompt(true);
          setRegistration(reg);
        }
      });
    }
  }, [isPWA, isNative]);

  const handleUpdate = () => {
    if (!registration || !registration.waiting) {
      return;
    }

    setIsUpdating(true);
    
    // Send message to service worker to skip waiting
    registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    
    // The controllerchange event will reload the page
    // But if it doesn't, reload manually after a short delay
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handleDismiss = () => {
    setShowUpdatePrompt(false);
    // Show again after 24 hours
    sessionStorage.setItem('pwa-update-dismissed', Date.now().toString());
  };

  if (!showUpdatePrompt || isUpdating) {
    return null;
  }

  return (
    <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4 md:bottom-4">
      <div className="bg-white rounded-lg shadow-2xl border border-gray-200 p-4 flex items-center gap-3 animate-in slide-in-from-bottom-5">
        <div className="flex-shrink-0">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-600 to-green-700 flex items-center justify-center">
            <Download className="h-5 w-5 text-white" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-sm">Update Available</h3>
          <p className="text-xs text-gray-600 mt-0.5">
            A new version of the app is available. Update now to get the latest features.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleUpdate}
            size="sm"
            className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 h-8"
          >
            Update
          </Button>
          <Button
            onClick={handleDismiss}
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

