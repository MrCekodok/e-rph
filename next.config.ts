import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["unpdf"],
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
