# Miss Saigon – Tisch & Bestell-Übersicht

Eine komplett offline funktionierende App zur Tisch- und Bestellverwaltung,
gebaut aus dem Sitzplan-Foto und der Speisekarte (`MissSaigon_A3_..._Flyer_Ver3_09.05.2026.pdf`).

Es gibt zwei fertige Versionen im selben Code:

1. **Website-Version** – Ordner `www/` – läuft in jedem Browser, offline nutzbar,
   auf dem Handy als App-Icon installierbar ("Zum Startbildschirm hinzufügen").
2. **Android-App** – Ordner `android/` – ein fertiges Android-Studio-Projekt
   (Capacitor), das dieselbe `www/`-Oberfläche in einer echten, offline
   installierbaren APK verpackt.

## Warum liegt keine fertige .apk-Datei bei?

Diese Sandbox hat keinen Internetzugang zu den Android-/Gradle-Servern
(dl.google.com, services.gradle.org sind gesperrt) - deshalb konnte die APK
hier nicht kompiliert werden. Das Projekt selbst ist aber zu 100 % fertig
eingerichtet. Drei Wege, um die echte App-Datei zu bekommen:

**Weg A - GitHub Actions (empfohlen, keine Installation auf dem PC nötig)**
Im Projekt liegt bereits eine fertige Baupipeline: `.github/workflows/build-apk.yml`.
1. Kostenlosen Account auf [github.com](https://github.com) anlegen (falls noch
   nicht vorhanden) und ein neues, leeres Repository erstellen.
2. Den kompletten Inhalt dieses Projektordners dort hochladen (per Drag & Drop
   im Browser über "Add file -> Upload files", oder per `git push`).
3. Im Repository oben auf den Reiter "Actions" gehen - der Workflow "Build
   Android APK" startet automatisch (dauert ca. 3-5 Minuten).
4. Nach Abschluss auf den grünen Lauf klicken -> unter "Artifacts" liegt
   `miss-saigon-debug-apk` zum Herunterladen bereit. Das ist die fertige,
   echte .apk-Datei zum Installieren auf jedem Android-Handy.

**Weg B - Android Studio (wenn du selbst weiterentwickeln willst)**
1. [Android Studio](https://developer.android.com/studio) installieren (kostenlos).
2. Diesen Ordner öffnen -> den `android`-Unterordner als Projekt öffnen ("Open").
3. Android Studio lädt einmalig automatisch die nötigen SDK/Gradle-Komponenten
   herunter (braucht Internet, nur beim ersten Mal).
4. Oben auf den grünen "Run"-Pfeil klicken (Handy per USB verbunden oder
   Emulator) - oder über *Build -> Generate Signed App Bundle / APK* eine
   .apk-Datei erzeugen. Einmal installiert, läuft die App komplett offline.

**Weg C - PWABuilder (ganz ohne Android Studio, ganz ohne GitHub)**
1. `www/` Ordner irgendwo mit einer echten URL hosten (z. B. GitHub Pages,
   Netlify - kostenlos).
2. Auf [pwabuilder.com](https://www.pwabuilder.com) die URL eingeben ->
   "Package for Android" -> fertige .apk/.aab herunterladen.

Die **Website-Version** (`www/index.html`) funktioniert dagegen sofort,
ganz ohne weitere Schritte - einfach die Datei im Browser öffnen oder den
`www`-Ordner auf einen beliebigen Webserver legen.

## Bedienung

- **Tischplan**: Alle Tische (Außen/Innen) plus 5 Abholung-Slots, farblich wie
  auf dem Sitzplan-Zettel - blaues Rechteck = 4er-Tisch, grünes Quadrat =
  2er-Tisch, goldenes Ticket = Abholung. Große Zahl = aktuell offener Betrag.
  Freie Tische antippen → Bestellung anlegen.
- **Artikel hinzufügen**: Nummer oder Namen eintippen (z. B. `13`, `V7 Garnelen`,
  `Ente Bali`). Auch die Kategorie-Liste unten kann durchgeblättert werden.
  Artikel mit Größen (Suppen Klein/Groß) fragen kurz nach, welche Variante.
- **Sonstiger Posten**: Eigene Bezeichnung + Preis eintragen. Ein Punkt (`.`)
  wird automatisch zu einem Komma (`,`), passend zum deutschen Format.
- **Rechnung teilen**: Häkchen setzen → einzelne Artikel ankreuzen → unten
  erscheint die Zwischensumme mit [Bezahlen]-Knopf. Wiederholen, bis alles
  bezahlt ist – der Tisch wird dann automatisch wieder frei.
- **Schnell bezahlen**: Einen belegten Tisch im Tischplan **10 Sekunden**
  gedrückt halten → Tisch gilt komplett als bezahlt und wird geleert
  (Fortschrittsbalken zeigt die Zeit an; loslassen bricht ab).
- **Autospeichern**: Alle 30 Sekunden und beim Minimieren/Schließen wird der
  Stand gespeichert. Beim nächsten Öffnen wird automatisch weitergemacht.

## Projektstruktur

```
www/                 die eigentliche App (HTML/CSS/JS), offline-fähig (PWA)
  index.html
  css/style.css
  js/menu.js          gesamte Speisekarte inkl. Preise (leicht anpassbar)
  js/tables.js        Sitzplan-Definition (Tische, Plätze, Zonen)
  js/app.js           App-Logik
  manifest.json, service-worker.js, icons/
android/              fertiges Capacitor-Android-Projekt (siehe oben)
test/smoke.js         automatisierter Testlauf der Kernfunktionen
```

### Speisekarte oder Tische später ändern

Preise/Artikel: `www/js/menu.js` – jede Zeile ist ein Gericht
(`code`, `name`, `price` in Cent). Tische: `www/js/tables.js`.
Nach einer Änderung im Android-Projekt einmal `npx cap sync android`
ausführen, damit sie auch dort übernommen wird (`npm install` vorher nötig).

### Getränke (nicht auf der gedruckten Karte, wie gewünscht ergänzt)

Softdrink 0,2l 1,50 € · 0,4l 3,00 € · Dose/Flasche 2,50 € · Asiasaft 3,00 € ·
Asia Bier 4,00 € · Becks/Vitamalz 2,50 € · Weißbier 3,00 € · Wasser 2,00 € ·
Tee/Kaffee 2,00 €

## Test

`node test/smoke.js` (Server vorher mit `npm run serve` starten) prüft
Tischplan, Suche/Aliase, Varianten, individuelle Posten, Rechnung teilen,
volle Bezahlung und das Speichern – alle 29 Prüfungen sind grün.
