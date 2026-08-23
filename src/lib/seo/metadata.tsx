import type { Metadata } from "next";
import { site } from "@/lib/data/site";

/**
 * One place that builds page metadata, so every route gets a unique title,
 * description, canonical URL and Open Graph block without repetition.
 */
export function buildMetadata({
  title,
  description,
  path,
  keywords,
  type = "website",
  noIndex,
}: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  type?: "website" | "article";
  noIndex?: boolean;
}): Metadata {
  const url = `${site.domain}${path}`;
  // The root layout owns the "%s | Atlas Karting" template, so `title` here
  // stays bare. Open Graph has no template, so it gets the suffixed form.
  const fullTitle = path === "/" ? title : `${title} | ${site.name}`;

  return {
    title,
    description,
    keywords,
    alternates: { canonical: url },
    robots: noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      type,
      url,
      title: fullTitle,
      description,
      siteName: site.name,
      locale: site.locale,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
  };
}

/** Renders a JSON-LD block. Kept as a helper so no page hand-rolls a script tag. */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Structured data is generated from our own typed data, never user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
