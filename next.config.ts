import type { NextConfig } from "next";
import redirects from "./content/redirects.json";
const preview = process.env.SITE_EXPORT === "1";
const config: NextConfig = {
  ...(preview ? { output: "export", trailingSlash: true } : {}),
  poweredByHeader: false,
  images: { unoptimized: preview, formats: ["image/avif", "image/webp"] },
  ...(preview
    ? {}
    : {
        async redirects() {
          return redirects.map((r) => ({ ...r, permanent: true }));
        },
        async headers() {
          return [
            {
              source: "/:path*",
              headers: [
                { key: "X-Content-Type-Options", value: "nosniff" },
                {
                  key: "Referrer-Policy",
                  value: "strict-origin-when-cross-origin",
                },
                {
                  key: "Permissions-Policy",
                  value: "camera=(), microphone=(), geolocation=()",
                },
                { key: "X-Frame-Options", value: "SAMEORIGIN" },
              ],
            },
          ];
        },
      }),
};
export default config;
