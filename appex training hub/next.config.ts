import type { NextConfig } from "next";

const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
});

const nextConfig: NextConfig = {
  serverExternalPackages: ['bcryptjs', 'resend'],
  env: {
    PRISMA_CLIENT_ENGINE_TYPE: 'library',
  },
  turbopack: {},
};

export default withPWA(nextConfig);
