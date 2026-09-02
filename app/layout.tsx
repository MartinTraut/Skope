import type { Metadata, Viewport } from "next";
import { Instrument_Sans, Inter } from "next/font/google";

import "./globals.css";
import { Header } from "@/components/layout/header";
import { ScrollManager } from "@/components/motion/scroll-manager";
import { Footer } from "@/components/layout/footer";
import { MobileCta } from "@/components/layout/mobile-cta";
import { getGoogleRating } from "@/lib/google-rating";
import { isPreview } from "@/lib/seo";
import { site } from "@/lib/site";

/**
 * Schriftpaar: eine Stimme für die Schlagzeile, eine für die Lesestrecke.
 *
 * Instrument Sans trägt die Displaygrade: flache Endstriche, enge Punzen,
 * ein gerader Schnitt ohne die weichen Rundungen von Bricolage Grotesque
 * davor. Das ist eine Entscheidung über den Charakter, nicht über den Platz –
 * gemessen an derselben Zeile läuft sie nur rund 2 % schmaler (854 px zu
 * 871 px bei 64 px Schriftgröße).
 *
 * Inter darunter für alles, was gelesen und nicht angesehen wird. Sie ist auf
 * Bildschirmgrößen ab 14 px gezeichnet, hat saubere Umlaute und echte
 * Tabellenziffern für Preise und Telefonnummern.
 *
 * Beide sind variabel: ein Font-File pro Familie über alle Schnitte.
 * Instrument Sans reicht bis 700 – Displaytext geht deshalb nirgends darüber
 * hinaus, sonst rechnet der Browser sich ein falsches Fett zusammen.
 */
const display = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
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
    "Generalüberholte E-Scooter mit einem Jahr Gewährleistung, geprüft in eigener Werkstatt in Neuenstadt am Kocher. Dazu Reparatur aller Marken und Wartung.",
  applicationName: site.name,
  authors: [{ name: site.owner }],
  creator: site.legalName,
  alternates: { canonical: "/" },
  // og:url, Titel und Bild setzt jede Seite selbst – sonst zeigen alle
  // Unterseiten beim Teilen auf die Startseite.
  openGraph: {
    type: "website",
    locale: "de_DE",
    siteName: site.legalName,
  },
  robots: isPreview
    ? { index: false, follow: false }
    : {
        index: true,
        follow: true,
        googleBot: { index: true, follow: true, "max-image-preview": "large" },
      },
};

/**
 * Die Angaben, die auf dem Telefon über den Rand der Seite hinaus wirken.
 *
 * `themeColor` war `#f4f2ed` und `colorScheme` „light" – beides aus einer
 * Fassung, in der die Seite hell war. Seit Schwarz die Grundfläche ist, hat
 * Safari damit die Bedienleisten oben und unten in einem Beige eingefärbt, das
 * auf der Seite nirgends vorkommt: ein heller Rahmen um eine schwarze Seite,
 * genau der Bruch, den man an einer App nie sieht. Jetzt liegt dort die
 * Grundfläche selbst, und der Übergang von der Seite zum Gerät verschwindet.
 *
 * `colorScheme: "dark"` deckt sich mit `color-scheme: dark` im Stylesheet und
 * betrifft die Teile, die der Browser selbst zeichnet – Rollbalken,
 * Auswahllisten, die Tastatur über einem Feld.
 *
 * `viewportFit: "cover"` lässt die Fläche bis an die Gehäusekante laufen.
 * Ohne die Angabe setzt Safari die Seite im Querformat neben die Aussparung
 * und füllt den Streifen selbst – bei dieser Seite mit grauen Balken links und
 * rechts. Die Sperrzone der Kamera trägt dafür `.gutter` in globals.css; ohne
 * diesen Rand wäre „cover" ein Fehler, nicht eine Verbesserung.
 */
export const viewport: Viewport = {
  themeColor: "#08090b",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const rating = await getGoogleRating();

  return (
    <html
      lang="de"
      data-scroll-behavior="smooth"
      className={`${display.variable} ${sans.variable} antialiased`}
    >
      <body>
        {/* Sicherheitsnetz für Browser ohne Unterstützung für
            @media (scripting: none) – siehe .reveal in globals.css */}
        <noscript>
          <style>{`.reveal,.reveal-mask-inner{opacity:1!important;transform:none!important;clip-path:none!important}`}</style>
        </noscript>
        <a
          href="#inhalt"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-md focus:bg-ink focus:px-5 focus:py-3 focus:font-display focus:font-semibold focus:text-silver on-dark"
        >
          Zum Inhalt springen
        </a>
        {/* Seitenwechsel beginnen oben, Sprungziele stehen ganz im Bild –
            siehe das Bauteil. */}
        <ScrollManager />
        <Header rating={rating} />
        {/* tabIndex, damit der Sprunglink den Fokus wirklich versetzt: Ohne ihn
            setzen Safari und ältere Engines ihn zurück auf <body>, und der Link
            tut sichtbar nichts. scroll-mt hält das Ziel unter dem festen Header. */}
        <main
          id="inhalt"
          tabIndex={-1}
          className="scroll-mt-24 focus:outline-none"
        >
          {children}
        </main>
        <Footer />
        <MobileCta />
      </body>
    </html>
  );
}
