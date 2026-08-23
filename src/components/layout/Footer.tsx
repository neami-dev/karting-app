import Link from "next/link";
import { Wordmark } from "@/components/layout/Wordmark";
import { site } from "@/lib/data/site";
import { listLocationsSync } from "@/lib/services/locations";
import { listExperiencesSync } from "@/lib/services/experiences";

export function Footer() {
  const locations = listLocationsSync();
  const karting = listExperiencesSync().filter((e) => e.category === "karting");
  const events = listExperiencesSync().filter((e) => e.category === "events");
  const year = new Date().getFullYear();

  // inline-block + padding lifts these dense footer links clear of the 24px
  // minimum target size; a bare inline link was only 16px tall.
  const linkClass =
    "t-body-sm inline-block py-xxxs text-body transition-colors duration-150 hover:text-ink";

  return (
    <footer className="border-t border-hairline bg-canvas">
      <div className="editorial py-xl">
        <div className="grid gap-lg md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <Wordmark />
            <p className="t-body-sm mt-xs max-w-[20rem] text-body">
              Professional karting circuits across Morocco. Race-spec karts, timed
              sessions, and a booking that takes two minutes.
            </p>
            <ul className="mt-sm flex flex-wrap gap-xxs">
              {Object.entries(site.social).map(([name, href]) => (
                <li key={name}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="t-caption-upper flex h-11 w-11 items-center justify-center border border-hairline text-muted-soft transition-colors hover:border-ink/40 hover:text-ink"
                  >
                    <span aria-hidden="true">{name.slice(0, 2)}</span>
                    <span className="sr-only">{name} — opens in a new tab</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav aria-labelledby="footer-circuits">
            <h2 id="footer-circuits" className="t-caption-upper text-ink">
              Circuits
            </h2>
            <ul className="mt-xs flex flex-col gap-xxs">
              {locations.map((l) => (
                <li key={l.slug}>
                  <Link href={`/${l.slug}`} className={linkClass}>
                    Karting {l.city}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/contact" className={linkClass}>
                  All contact details
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-labelledby="footer-karting">
            <h2 id="footer-karting" className="t-caption-upper text-ink">
              Karting
            </h2>
            <ul className="mt-xs flex flex-col gap-xxs">
              {karting.map((e) => (
                <li key={e.slug}>
                  <Link href={`/experiences/${e.slug}`} className={linkClass}>
                    {e.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-events">
            <h2 id="footer-events" className="t-caption-upper text-ink">
              Groups & Events
            </h2>
            <ul className="mt-xs flex flex-col gap-xxs">
              {events.map((e) => (
                <li key={e.slug}>
                  <Link href={`/experiences/${e.slug}`} className={linkClass}>
                    {e.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-info">
            <h2 id="footer-info" className="t-caption-upper text-ink">
              Information
            </h2>
            <ul className="mt-xs flex flex-col gap-xxs">
              <li>
                <Link href="/pricing" className={linkClass}>
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/about" className={linkClass}>
                  About us
                </Link>
              </li>
              <li>
                <Link href="/faq" className={linkClass}>
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/booking" className={linkClass}>
                  Book a session
                </Link>
              </li>
              <li>
                <a href={`tel:${site.phone.replace(/\s/g, "")}`} className={linkClass}>
                  {site.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${site.email}`} className={linkClass}>
                  {site.email}
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-xl flex flex-col gap-xs border-t border-hairline pt-sm md:flex-row md:items-center md:justify-between">
          <p className="t-caption text-muted-soft">
            © {year} {site.legalName}. All rights reserved.
          </p>
          <p className="t-caption text-muted-soft">
            Circuit specifications, opening hours and prices shown on this site are
            placeholder data pending confirmation.
          </p>
        </div>
      </div>
    </footer>
  );
}
