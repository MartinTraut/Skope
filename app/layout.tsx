import type { Metadata, Viewport } from "next";
import { Archivo, Instrument_Sans } from "next/font/google";

import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileCta } from "@/components/layout/mobile-cta";
import { site } from "@/lib/site";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
  weight: ["600", "700", "800"],
});

const instrument = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "E-Scooter Werkstatt Neuenstadt am Kocher | SKOPE",
    // Kurzes Suffix: das Template darf den Seitentitel nicht über die
    // Anzeigegrenze von rund 60 Zeichen schieben.
    template: "%s | SKOPE",
  },
  description:
    "E-Scooter Fachwerkstatt in Neuenstadt am Kocher für Heilbronn und Neckarsulm: Reparatur aller Marken, Checkup 59,99 €, geprüfte Gebrauchtgeräte.",
  applicationName: site.name,
  authors: [{ name: site.owner }],
  creator: site.legalName,
  alternates: { canonical: "/" },
  // og:url, Titel und Bild setzt jede Seite selbst — sonst zeigen alle
  // Unterseiten beim Teilen auf die Startseite.
  openGraph: {
    type: "website",
    locale: "de_DE",
    siteName: site.legalName,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: "#080d12",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="de"
      className={`${archivo.variable} ${instrument.variable} antialiased`}
    >
      <body>
        {/* Sicherheitsnetz für Browser ohne Unterstützung für
            @media (scripting: none) — siehe .reveal in globals.css */}
        <noscript>
          <style>{`.reveal,.reveal-mask-inner{opacity:1!important;transform:none!important;clip-path:none!important}`}</style>
        </noscript>
        <a
          href="#inhalt"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-sm focus:bg-flame focus:px-5 focus:py-3 focus:font-display focus:font-semibold focus:text-ink"
        >
          Zum Inhalt springen
        </a>
        <Header />
        {/* tabIndex, damit der Sprunglink den Fokus wirklich versetzt: Ohne ihn
            setzen Safari und ältere Engines ihn zurück auf <body>, und der Link
            tut sichtbar nichts. scroll-mt hält das Ziel unter dem festen Header. */}
        <main id="inhalt" tabIndex={-1} className="scroll-mt-24 focus:outline-none">
          {children}
        </main>
        <Footer />
        <MobileCta />
      </body>
    </html>
  );
}
