import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dev only: lets a phone on the same Wi-Fi load the dev server.
  allowedDevOrigins: ["192.168.1.116"],
  // The study search reads the Bible text and its index from disk on the server.
  // The paid texts (content-private/) are read from disk by /api/content (members only),
  // by the Consejero (the plans' days) and by the hourly cron (the Palabra del día comes
  // from the Estudio lessons) — they are never part of the app's JavaScript.
  outputFileTracingIncludes: {
    "/api/estudio": ["./public/biblia/**", "./lib/server/estudio-data/**"],
    "/api/content/**": ["./content-private/**"],
    "/api/consejero": ["./content-private/planes/**"],
    "/api/cron/recordatorio": ["./content-private/estudio/**"],
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
