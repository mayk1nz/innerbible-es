import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dev only: lets a phone on the same Wi-Fi load the dev server.
  allowedDevOrigins: ["192.168.1.116"],
  // The study search reads the Bible text and its index from disk on the server.
  outputFileTracingIncludes: {
    "/api/estudio": ["./public/biblia/**", "./lib/server/estudio-data/**"],
  },
  // Old upsell addresses (may still be set in KashPay) → the current pages.
  async redirects() {
    return [
      { source: "/up1", destination: "/upsell", permanent: false },
      { source: "/up2", destination: "/palabras-del-senor", permanent: false },
    ];
  },
};

export default nextConfig;
