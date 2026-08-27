/**
 * PHOTOGRAPHY REGISTRY
 * --------------------
 * Maps a surface to a real photograph in /public/images. Anything not listed
 * here falls back to the generated SVG cinema plate in `TrackVisual`, so the
 * site can be migrated to real imagery one page at a time without ever
 * rendering a broken or empty surface.
 *
 * To add a photo: drop the file in the matching folder and add one line below.
 */

/** Keyed by Experience.slug — used by every experience card. */
export const experienceImages: Record<string, string> = {
  // "adult-karting": "/images/experiences/adult-karting.jpg",
};

/** Keyed by an arbitrary hero id passed to <PageHero image="…" />. */
export const heroImages: Record<string, string> = {
  // experiences: "/images/heroes/experiences.jpg",
};

export function experienceImage(slug: string): string | undefined {
  return experienceImages[slug];
}

export function heroImage(id?: string): string | undefined {
  return id ? heroImages[id] : undefined;
}
