"use client";

import { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePlatform } from '@/lib/platform';

export function InstallPWA() {
  const { isWeb } = usePlatform();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Only show on web, not on PWA or native apps
    if (!isWeb) {
      return;
    }

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Check if user dismissed it previously (only for this session)
    const dismissed = sessionStorage.getItem('pwa-install-dismissed');
    if (dismissed === 'true') {
      return;
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the default browser install prompt
      e.preventDefault();
      // Store the event for later use
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if app was just installed
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallButton(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [isWeb]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      return;
    }

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }

    // Clear the deferredPrompt
    setDeferredPrompt(null);
    setShowInstallButton(false);
  };

  const handleDismiss = () => {
    setShowInstallButton(false);
    // Store dismissal in sessionStorage to not show again for this session
    sessionStorage.setItem('pwa-install-dismissed', 'true');
  };

  // Don't show if already installed or not ready to show
  if (!showInstallButton || isInstalled) {
    return null;
  }

  return (
    <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4 md:bottom-4">
      <div className="bg-white rounded-lg shadow-2xl border border-gray-200 p-3 md:p-4 flex items-center gap-2 md:gap-3 animate-in slide-in-from-bottom-5">
        <div className="flex-shrink-0">
          <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-gradient-to-br from-green-600 to-green-700 flex items-center justify-center">
            <Download className="h-5 w-5 md:h-6 md:w-6 text-white flex-shrink-0" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-xs md:text-sm">Install Biharinath App</h3>
          <p className="text-xs text-gray-600 mt-0.5 hidden sm:block">
            Get the full app experience with offline access
          </p>
        </div>
        <div className="flex items-center gap-1.5 md:gap-2">
          <Button
            onClick={handleInstallClick}
            size="sm"
            className="bg-green-600 hover:bg-green-700 text-white text-xs px-2 md:px-3 h-8 md:h-9"
          >
            Install
          </Button>
          <Button
            onClick={handleDismiss}
            variant="ghost"
            size="icon"
            className="h-7 w-7 md:h-8 md:w-8 text-gray-400 hover:text-gray-600"
          >
            <X className="h-3.5 w-3.5 md:h-4 md:w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

