"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { LocationSelect } from "@/components/locations/LocationSelect";
import { useLocations } from "@/components/locations/LocationContext";
import { Wordmark } from "@/components/layout/Wordmark";
import { cx } from "@/lib/format";

const NAV = [
  { href: "/experiences", label: "Experiences" },
  { href: "/kids", label: "Kids" },
  { href: "/adults", label: "Adults" },
  { href: "/events", label: "Groups & Events" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const { locations } = useLocations();

  // Close the drawer whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Escape closes and returns focus to the toggle — expected dialog behaviour.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      className={cx(
        "sticky top-0 z-50 border-b transition-colors duration-300",
        scrolled || open
          ? "border-hairline bg-canvas/95 backdrop-blur-md"
          : "border-transparent bg-gradient-to-b from-canvas/85 to-transparent"
      )}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-xs focus:top-xs focus:z-50 focus:bg-primary focus:px-xs focus:py-xxs focus:text-on-primary"
      >
        Skip to content
      </a>

      <nav aria-label="Main" className="editorial">
        <div className="flex h-16 items-center justify-between gap-sm">
          <Link
            href="/"
            className="flex shrink-0 items-center py-xs"
            aria-label="Atlas Karting — home"
          >
            <Wordmark />
          </Link>

          {/* Desktop menu */}
          <ul className="hidden items-center gap-sm xl:flex">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={cx(
                    "t-nav-link relative whitespace-nowrap py-xs transition-colors duration-150",
                    isActive(item.href) ? "text-ink" : "text-body hover:text-ink"
                  )}
                >
                  {item.label}
                  {isActive(item.href) && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 -bottom-px h-0.5 bg-primary"
                    />
                  )}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-xs">
            {locations.length > 1 && (
              <LocationSelect className="hidden w-48 lg:block" />
            )}

            <ButtonLink href="/booking" size="sm" className="hidden sm:inline-flex">
              Book Now
            </ButtonLink>

            <button
              ref={toggleRef}
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              className="flex h-12 w-12 items-center justify-center border border-hairline text-ink transition-colors hover:border-ink/50 xl:hidden"
            >
              <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
              <span className="relative block h-4 w-5" aria-hidden="true">
                <span
                  className={cx(
                    "absolute left-0 h-0.5 w-5 bg-current transition-all duration-300",
                    open ? "top-1.5 rotate-45" : "top-0"
                  )}
                />
                <span
                  className={cx(
                    "absolute left-0 top-1.5 h-0.5 w-5 bg-current transition-opacity duration-200",
                    open ? "opacity-0" : "opacity-100"
                  )}
                />
                <span
                  className={cx(
                    "absolute left-0 h-0.5 w-5 bg-current transition-all duration-300",
                    open ? "top-1.5 -rotate-45" : "top-3"
                  )}
                />
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div
        id="mobile-nav"
        ref={panelRef}
        hidden={!open}
        className="border-t border-hairline bg-canvas xl:hidden"
      >
        <div className="editorial max-h-[calc(100dvh-4rem)] overflow-y-auto py-sm">
          <ul className="flex flex-col">
            {NAV.map((item) => (
              <li key={item.href} className="border-b border-hairline">
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={cx(
                    "t-nav-link flex items-center justify-between py-xs",
                    isActive(item.href) ? "text-primary" : "text-ink"
                  )}
                >
                  {item.label}
                  <span aria-hidden="true" className="text-muted">→</span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-sm flex flex-col gap-xs">
            <LocationSelect />
            <ButtonLink href="/booking" fullWidth>
              Book Now
            </ButtonLink>
          </div>

          <ul className="mt-sm flex flex-col gap-xxs">
            {locations.map((l) => (
              <li key={l.slug}>
                <Link
                  href={`/${l.slug}`}
                  className="t-body-sm text-body transition-colors hover:text-ink"
                >
                  Karting {l.city} →
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
}
