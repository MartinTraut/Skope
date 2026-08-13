/**
 * Aktueller Bestand an generalüberholten E-Scootern.
 *
 * TODO Betreiber: Hier die tatsächlich verfügbaren Geräte pflegen.
 * Der alte Shopify-Shop war inaktiv, echte Bestandsdaten lagen beim Relaunch
 * nicht vor – deshalb bewusst leer statt mit erfundenen Modellen und Preisen
 * gefüllt. Solange die Liste leer ist, zeigt die Seite den Anfrage-Weg;
 * sobald Einträge existieren, erscheint automatisch das Bestandsraster.
 *
 * Beispiel:
 * {
 *   id: "ninebot-max-g30-01",
 *   model: "Segway-Ninebot MAX G30",
 *   price: "449 €",
 *   batteryHealth: "92 % Restkapazität",
 *   range: "bis 50 km",
 *   note: "Neue Bremsbeläge, neuer Vorderreifen",
 *   image: "/img/bestand/ninebot-max-g30-01.jpg",
 * }
 */

export type InventoryItem = {
  id: string;
  model: string;
  price: string;
  batteryHealth: string;
  range: string;
  note?: string;
  image?: string;
};

export const inventory: InventoryItem[] = [];
