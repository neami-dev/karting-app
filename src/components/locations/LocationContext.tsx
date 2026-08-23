"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Location } from "@/lib/types";

/**
 * The visitor's chosen circuit, remembered across pages. Deliberately tiny: it
 * holds a slug, not a Location object, so it stays valid if the location list
 * changes underneath it.
 */

const STORAGE_KEY = "atlas.location";

interface LocationContextValue {
  locations: Location[];
  selected: Location | null;
  selectedSlug: string | null;
  select: (slug: string) => void;
  clear: () => void;
  /** False until localStorage has been read, so SSR and hydration agree */
  ready: boolean;
}

const Ctx = createContext<LocationContextValue | null>(null);

export function LocationProvider({
  locations,
  initialSlug,
  children,
}: {
  locations: Location[];
  initialSlug?: string;
  children: ReactNode;
}) {
  const [slug, setSlug] = useState<string | null>(initialSlug ?? null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (initialSlug) {
      setReady(true);
      return;
    }
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored && locations.some((l) => l.slug === stored)) setSlug(stored);
    } catch {
      /* private mode / storage disabled — the picker still works, just unremembered */
    }
    setReady(true);
  }, [initialSlug, locations]);

  const select = useCallback((next: string) => {
    setSlug(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* non-fatal */
    }
  }, []);

  const clear = useCallback(() => {
    setSlug(null);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* non-fatal */
    }
  }, []);

  const value = useMemo<LocationContextValue>(
    () => ({
      locations,
      selected: locations.find((l) => l.slug === slug) ?? null,
      selectedSlug: slug,
      select,
      clear,
      ready,
    }),
    [locations, slug, select, clear, ready]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLocations() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useLocations must be used inside <LocationProvider>");
  return ctx;
}
