import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: {
    appIsrStatus: false,
    buildActivity: false
    // 💡 Disables the floating Next.js badge indicator
  },
};

export default nextConfig;
