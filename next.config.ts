import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    // Chakra UI の未使用コードをバンドルしないようにする最適化
    optimizePackageImports: ["@chakra-ui/react"],
  },
};

export default nextConfig;
