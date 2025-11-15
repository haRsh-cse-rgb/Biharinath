/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    domains: ['images.pexels.com'],
  },
  // Note: Static export removed because API routes require a server
  // For Capacitor, point to your deployed Next.js URL instead
  // trailingSlash: true,
};

module.exports = nextConfig;
