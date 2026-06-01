import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  experimental: {
    optimizePackageImports: [
      "@mui/material",
      "@mui/icons-material",
      "@emotion/react",
      "@emotion/styled",
      "lucide-react",
      "framer-motion",
    ],
  },
};

export default nextConfig;
