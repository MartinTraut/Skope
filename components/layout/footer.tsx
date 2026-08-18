import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

import { LogoLockup } from "@/components/brand/logo";
import { Container } from "@/components/ui/section";
import {
  fullAddress,
  legalNav,
  nav,
  nearbyPlaceNames,
  priceNote,
  serviceArea,
  site,
} from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-current/10 bg-ink pt-20 pb-10 text-silver on-dark">
      <Container>
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          {/* Marke + Kontakt */}
          <div className="lg:col-span-5">
            {/* Im Footer steht die Marke so, wie sie geliefert wurde:
                Roller über dem Schriftzug. Der Seitenkopf muss sie
                nebeneinander setzen, weil dort nur 56 px Bauhöhe zur Verfügung
                stehen und die Buchstaben in der gestapelten Fassung auf 16 px
                Versalhöhe fielen. Hier ist der Platz da, also gibt es keinen
                Grund für den Kompromiss. */}
            <LogoLockup className="h-20 w-auto text-silver" />
            {/* 11 px, nicht 8. Gemessen war die Zeile die kleinste Schrift der ganzen
                Seite – acht Pixel mit 0,24 em Sperrung in Versalien, bei 55 %
                Deckkraft auf Tinte. Das ist keine Auszeichnung mehr, sondern
                ein Muster: Man erkennt, dass dort etwas steht, und liest es
                nicht. Auf einem Telefon mit 320 px trifft es zusätzlich die
                Gruppe, für die der Firmenzusatz überhaupt dasteht.

                Mit dem Grad geht die Sperrung zurück (0,2 em) und die
                Deckkraft hoch (70 %): Ein größerer Grad trägt weniger
                Sperrung, sonst zerfällt das Wort in Buchstaben. */}
            <p className="mt-4 text-[0.6875rem] leading-none font-semibold tracking-[0.2em] uppercase opacity-70">
              Gebrauchtwarenhandel
            </p>
            <p className="mt-6 max-w-sm leading-relaxed text-current/60">
              Fachwerkstatt für Elektrokleinstfahrzeuge und Verkauf geprüfter
              refurbished E-Scooter in Neuenstadt am Kocher, für Heilbronn,
              Neckarsulm, Bad Friedrichshall und die ganze Region.
            </p>

            <address className="mt-8 flex flex-col gap-3 not-italic">
              <a
                href={site.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="press inline-flex min-h-11 items-start gap-3 py-1.5 text-current/80 transition-[color,transform] hover:text-accent"
              >
                <MapPin className="mt-1 size-4 shrink-0" aria-hidden="true" />
                {fullAddress}
              </a>
              <a
                href={site.phone.href}
                className="press inline-flex min-h-11 items-center gap-3 py-1.5 text-current/80 transition-[color,transform] hover:text-accent"
              >
                <Phone className="size-4 shrink-0" aria-hidden="true" />
                <span className="tabular">{site.phone.display}</span>
              </a>
              <a
                href={`mailto:${site.email}`}
                className="press inline-flex min-h-11 items-center gap-3 py-1.5 break-all text-current/80 transition-[color,transform] hover:text-accent"
              >
                <Mail className="size-4 shrink-0" aria-hidden="true" />
                {site.email}
              </a>
            </address>

            {/* TODO Betreiber: verbindliche Öffnungszeiten hinterlegen (lib/site.ts) */}
            <p className="mt-6 text-sm text-current/60">{site.openingHours}</p>
          </div>

          {/* Leistungen */}
          <nav aria-label="Leistungen" className="lg:col-span-3">
            <p className="eyebrow-plain text-current/90">Leistungen</p>
            {/* Wie die Rechtslinks unten: mindestens 44 px Zielfläche.
                Bei `gap-3` und Zeilenhöhe blieben davon rund 24 px übrig. */}
            <ul className="mt-4 -mb-2 flex flex-col">
              {[...nav, { href: "/kontakt", label: "Kontakt & Anfahrt" }].map(
                (item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="press -mx-2 inline-flex min-h-11 items-center px-2 text-current/70 transition-[color,transform] hover:text-accent"
                    >
                      {item.label}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </nav>

          {/* Einzugsgebiet – echter GEO-Nutzen, nicht Keyword-Stapelung */}
          <div className="lg:col-span-4">
            <p className="eyebrow-plain text-current/90">Einzugsgebiet</p>
            <ul className="mt-6 grid grid-cols-2 gap-x-6 gap-y-2.5">
              {serviceArea.map((place) => (
                <li
                  key={place.name}
                  className="flex items-baseline justify-between gap-2 border-b border-current/8 pb-2 text-sm"
                >
                  <span className="text-current/70">{place.name}</span>
                  <span className="tabular text-xs text-current/60">
                    {place.distance}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm leading-relaxed text-current/60">
              Ebenso im Einzugsgebiet: {nearbyPlaceNames.join(", ")}.
            </p>
          </div>
        </div>

        <div className="mt-16 border-t border-current/10 pt-8">
          <p className="text-xs leading-relaxed text-current/60">{priceNote}</p>
          <div className="mt-6 flex flex-col-reverse gap-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-current/60">
              © {year} {site.legalName} · Inhaber {site.owner}
            </p>
            {/* Rechtlich verpflichtende Links: mindestens 44 px Zielfläche */}
            <ul className="-my-2 flex flex-wrap gap-x-4">
              {legalNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="press -mx-2 inline-flex min-h-11 items-center px-2 text-xs text-current/70 transition-[color,transform] hover:text-accent"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </footer>
  );
}
