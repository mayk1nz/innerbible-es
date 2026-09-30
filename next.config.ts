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
  // Old funnel addresses (may still be set in KashPay) → the current pages. The query
  // string (KashPay's ks) goes along.
  async redirects() {
    return [
      { source: "/up1", destination: "/resumen-en-audio", permanent: false },
      { source: "/upsell", destination: "/resumen-en-audio", permanent: false },
      { source: "/upsell-downsell", destination: "/resumen-en-audio-oferta", permanent: false },
      { source: "/up2", destination: "/palabras-del-senor", permanent: false },
      { source: "/palabras-del-senor-downsell", destination: "/palabras-del-senor-oferta", permanent: false },
      // The short link said in the YouTube videos: the quiz, marked as coming from YouTube
      // (a link with its own utm_* keeps them).
      {
        source: "/regalo",
        missing: [{ type: "query", key: "utm_source" }],
        destination: "/quiz?utm_source=youtube&utm_medium=video&utm_campaign=regalo",
        permanent: false,
      },
      { source: "/regalo", destination: "/quiz", permanent: false },
      // The Instagram bio link: the quiz, marked as coming from the profile.
      {
        source: "/bio",
        missing: [{ type: "query", key: "utm_source" }],
        destination: "/quiz?utm_source=instagram&utm_medium=bio&utm_campaign=perfil",
        permanent: false,
      },
      { source: "/bio", destination: "/quiz", permanent: false },
    ];
  },
};

export default nextConfig;
