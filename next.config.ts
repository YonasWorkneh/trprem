import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // CoinGecko image sources
      {
        protocol: "https",
        hostname: "assets.coingecko.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "coin-images.coingecko.com",
        pathname: "/**",
      },
      // Flag images for Forex
      {
        protocol: "https",
        hostname: "flagcdn.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.flagcdn.com",
        pathname: "/**",
      },
      // Common CDN and image hosting services
      {
        protocol: "https",
        hostname: "via.placeholder.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.unsplash.com",
        pathname: "/**",
      },
      // Metals API and financial data sources
      {
        protocol: "https",
        hostname: "api.metals.live",
        pathname: "/**",
      },
      // NFT marketplaces
      {
        protocol: "https",
        hostname: "opensea.io",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.opensea.io",
        pathname: "/**",
      },
      // Generic image hosting patterns (be cautious with these)
      {
        protocol: "https",
        hostname: "**.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.cloudfront.net",
        pathname: "/**",
      },
    ],
    // Allow unoptimized images as fallback (not recommended for production)
    // unoptimized: false,
    // Increase image sizes if needed
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};

export default nextConfig;
