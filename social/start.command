#!/bin/bash
# Doppelklick öffnet den Contentplan im Browser.
#
# Über einen kleinen lokalen Server statt direkt aus dem Finder: Beim Aufruf
# als Datei (file://) verweigern Safari und Chrome sowohl das Herunterladen
# mehrerer Bilder als auch die Zwischenablage. Über http://localhost geht beides.
cd "$(dirname "$0")" || exit 1
PORT=8411
python3 -m http.server "$PORT" --bind 127.0.0.1 >/dev/null 2>&1 &
SRV=$!
trap 'kill $SRV 2>/dev/null' EXIT INT TERM
sleep 1
open "http://127.0.0.1:$PORT/index.html"
echo "Contentplan läuft auf http://127.0.0.1:$PORT"
echo "Dieses Fenster offen lassen. Beenden mit Strg-C."
wait $SRV
