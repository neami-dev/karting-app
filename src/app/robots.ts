import type { MetadataRoute } from "next";
import { site } from "@/lib/data/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // The booking flow is transactional and its URLs are query-driven.
      disallow: ["/api/", "/booking", "/booking/"],
    },
    sitemap: `${site.domain}/sitemap.xml`,
    host: site.domain,
  };
}
