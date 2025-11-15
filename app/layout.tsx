import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import { Footer } from '@/components/layout/Footer';
import { PlatformWrapper } from '@/components/platform/PlatformWrapper';
import { NavigationWrapper } from '@/components/layout/NavigationWrapper';
import { SplashScreen } from '@/components/layout/SplashScreen';
import { InstallPWA } from '@/components/layout/InstallPWA';
import { PWAUpdatePrompt } from '@/components/layout/PWAUpdatePrompt';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Biharinath Organic Farms',
    template: '%s | Biharinath Organic Farms',
  },
  description: 'Fresh, healthy, and naturally grown organic produce from Biharinath Organic Farms. Shop organic products, book farm visits, and experience farm-to-home freshness.',
  icons: {
    icon: '/logo.jpeg',
    shortcut: '/logo.jpeg',
    apple: '/logo.jpeg',
  },
  manifest: '/manifest.json',
  themeColor: '#16a34a',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Biharinath Organic Farms',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={inter.className}>
        <PlatformWrapper>
          <AuthProvider>
            <SplashScreen />
            <NavigationWrapper />
            <main className="min-h-screen">
              {children}
            </main>
            <Footer />
            <InstallPWA />
            <PWAUpdatePrompt />
            <Toaster />
          </AuthProvider>
        </PlatformWrapper>
      </body>
    </html>
  );
}
