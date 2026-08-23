import type { MetadataRoute } from "next";
import { site } from "@/lib/data/site";
import { listLocationsSync } from "@/lib/services/locations";
import { experiences } from "@/lib/data/experiences";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${site.domain}/`, priority: 1, changeFrequency: "weekly" },
    { url: `${site.domain}/experiences`, priority: 0.9, changeFrequency: "monthly" },
    { url: `${site.domain}/kids`, priority: 0.9, changeFrequency: "monthly" },
    { url: `${site.domain}/adults`, priority: 0.9, changeFrequency: "monthly" },
    { url: `${site.domain}/events`, priority: 0.8, changeFrequency: "monthly" },
    { url: `${site.domain}/pricing`, priority: 0.8, changeFrequency: "weekly" },
    { url: `${site.domain}/about`, priority: 0.5, changeFrequency: "yearly" },
    { url: `${site.domain}/faq`, priority: 0.6, changeFrequency: "monthly" },
    { url: `${site.domain}/contact`, priority: 0.7, changeFrequency: "monthly" },
  ];

  // Circuit pages carry the local search intent — highest priority after home.
  const locationPages: MetadataRoute.Sitemap = listLocationsSync().map((l) => ({
    url: `${site.domain}/${l.slug}`,
    priority: 0.95,
    changeFrequency: "weekly",
  }));

  const experiencePages: MetadataRoute.Sitemap = experiences.map((e) => ({
    url: `${site.domain}/experiences/${e.slug}`,
    priority: 0.7,
    changeFrequency: "monthly",
  }));

  return [...staticPages, ...locationPages, ...experiencePages].map((page) => ({
    ...page,
    lastModified: now,
  }));
}
