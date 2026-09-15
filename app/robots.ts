import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/absen"],
    },
    sitemap: "https://bem-ft-unimma.vercel.app/sitemap.xml",
  };
}
