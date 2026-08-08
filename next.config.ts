import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/refunds',
        destination: '/refund',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
