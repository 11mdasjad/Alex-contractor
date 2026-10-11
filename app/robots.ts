import { origin } from "@/lib/content";
export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api/", "/search"],
    },
    sitemap: origin + "/sitemap.xml",
  };
}
