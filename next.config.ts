import type { NextConfig } from "next";
import withFlowbiteReact from "flowbite-react/plugin/nextjs";

const nextConfig: NextConfig = {
  eslint: {
    // Allow production build to succeed even with ESLint warnings (e.g. on Vercel).
    // Remove this once all lint issues are resolved.
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "fptsoftware.com",
      },
      {
        protocol: "https",
        hostname: "maisonoffice.vn",
      },
      {
        protocol: "https",
        hostname: "media.vneconomy.vn",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      { protocol: "https", hostname: "picsum.photos" },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      { protocol: "https", hostname: "upload.wikimedia.org" },
    ],
  },
};

export default withFlowbiteReact(nextConfig);
