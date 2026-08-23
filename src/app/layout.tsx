import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { MobileBookBar } from "@/components/layout/MobileBookBar";
import { LocationProvider } from "@/components/locations/LocationContext";
import { listLocationsSync } from "@/lib/services/locations";
import { site } from "@/lib/data/site";
import { JsonLd } from "@/lib/seo/metadata";
import { organizationSchema, websiteSchema } from "@/lib/seo/schema";

/** Inter is the design system's documented substitute for FerrariSans. */
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.domain),
  title: {
    default: `${site.name} — Karting in Agadir, Casablanca & Marrakech`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.legalName }],
  creator: site.legalName,
  formatDetection: { telephone: true, address: true, email: true },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: site.locale,
    url: site.domain,
  },
};

export const viewport: Viewport = {
  themeColor: "#181818",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locations = listLocationsSync();

  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-dvh bg-canvas antialiased">
        <JsonLd data={organizationSchema()} />
        <JsonLd data={websiteSchema()} />

        <LocationProvider locations={locations}>
          <Navbar />
          <main id="main" className="pb-16 md:pb-0">
            {children}
          </main>
          <Footer />
          <MobileBookBar />
          <WhatsAppButton />
        </LocationProvider>
      </body>
    </html>
  );
}
