import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@just-apps/auth"],
  webpack(config) {
    config.module.rules.push({
      resourceQuery: /raw/,
      type: "asset/source",
    });
    return config;
  },
};

export default nextConfig;
