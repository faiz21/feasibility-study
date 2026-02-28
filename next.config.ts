import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  cacheComponents: true,
  outputFileTracingRoot: path.resolve(__dirname),
};

export default nextConfig;
