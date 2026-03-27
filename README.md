# DMTree Community — Prototyp

Ein funktionsfähiger Community-Plattform-Prototyp als Take-Home Assignment für DMTree Technologies GmbH.

---

## Überblick

DMTree Community ist eine zentrale Plattform, die drei Bereiche vereint:

- **News & Ankündigungen** — Strukturierter Bereich für offizielle Updates
- **Ideen & Feedback** — Beiträge einreichen und durch Abstimmungen priorisieren
- **Echtzeit-Chat** — Kanalbasierter Austausch zwischen Mitgliedern

---

## Tech Stack

| Bereich | Technologie |
|---|---|
| Framework | Next.js 14 (App Router) |
| Sprache | TypeScript |
| Datenbank | SQLite via Prisma ORM |
| Authentifizierung | JWT (httpOnly Cookie) + bcrypt |
| Styling | CSS Custom Properties + Tailwind CSS |
| Echtzeit | HTTP Polling (Chat: 3s, Benachrichtigungen: 15s) |

---

## Funktionen

### Authentifizierung
- Registrierung & Login mit E-Mail/Passwort (JWT, httpOnly Cookie)
- Passwort anzeigen/verbergen (Auge-Icon im Login-Formular)
- Fehlgeschlagene Login-Versuche werden gezählt — nach 2 Fehlversuchen erscheint ein Hilfebereich mit Links zu „Passwort vergessen" und „E-Mail vergessen"
- Dedicated-Seiten für `/forgot-password` und `/forgot-email`

### Beiträge
- Erstellen, anzeigen und filtern nach Kategorien (Neuigkeit, Idee, Allgemein)
- Sortierung: Beliebt / Neu / Top
- Upvote/Downvote-System mit optimistischen Updates
- Angepinnte Beiträge dauerhaft oben
- Kommentare mit Zeitangabe

### Rollen & Berechtigungen
- **Admin** — Beiträge anpinnen/löschen, Kanäle verwalten, Benutzerrollen ändern, Admin-Panel unter `/admin`
- **Mitglied** — eigene Beiträge und Kommentare verfassen, eigene Beiträge löschen

### Benachrichtigungen
- Benachrichtigung bei neuem Kommentar auf eigenen Beitrag
- Benachrichtigung wenn ein anderer Nutzer einen neuen Beitrag veröffentlicht
- Glocken-Icon mit ungelesen-Badge, 15-Sekunden-Polling

### UI & UX
- **Dark / Light Mode** — umschaltbar per Button in Seitenleiste und Login-Seite, Präferenz wird in Cookie gespeichert (kein Theme-Flash beim Laden)
- **Mehrsprachigkeit** — Deutsch, Englisch, Französisch, Spanisch (DE/EN/FR/ES) via Cookie `dmtree-lang`
- **Collapsible Sidebar** — Desktop-Seitenleiste lässt sich auf Icon-Breite reduzieren
- **Responsive / Mobile** — Fixe Top-Bar mit Hamburger-Menü auf kleinen Bildschirmen
- **Animationen** — Staggered Fade-in der Beitrags-Karten, Hover-Lift-Effekt
- **Glassmorphism UI** — Blur-Effekte, CSS Custom Properties, konsistente Variablen für beide Themes

---

## Lokale Installation

### Voraussetzungen

- Node.js 18 oder höher
- npm

### Schritt 1 — Repository klonen

```bash
git clone https://github.com/kamga-dev/Dmtree-assignment.git
cd Dmtree-assignment
```

### Schritt 2 — Abhängigkeiten installieren

```bash
npm install
```

### Schritt 3 — Umgebungsvariablen einrichten

```bash
cp .env.example .env
```

Die Datei `.env` enthält bereits Standardwerte und funktioniert ohne weitere Anpassung.

### Schritt 4 — Datenbank einrichten & befüllen

```bash
npx prisma db push
npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed.ts
```

### Schritt 5 — Entwicklungsserver starten

```bash
npm run dev
```

Die App ist unter **http://localhost:3000** erreichbar.

---

## Demo-Zugangsdaten

| E-Mail | Passwort | Rolle |
|---|---|---|
| admin@dmtree.io | admin123 | Administrator |
| alice@dmtree.io | demo123 | Mitglied |
| bob@dmtree.io | demo123 | Mitglied |

> Mit dem **Admin-Konto** ist das Admin-Panel unter `/admin` zugänglich.

---

## Projektstruktur

```
DMTreeProjekt/
├── prisma/
│   ├── schema.prisma      # Datenbankschema (User, Post, Comment, Vote, Channel, Message, Notification)
│   ├── seed.ts            # Beispieldaten
│   └── dev.db             # SQLite-Datenbank (wird automatisch erstellt)
├── src/
│   ├── app/
│   │   ├── (auth)/        # Login, Registrierung, Forgot Password, Forgot Email
│   │   ├── (main)/        # Geschützte Seiten (Feed, Chat, Admin)
│   │   └── api/           # REST API-Routen
│   ├── components/
│   │   ├── layout/        # Seitenleiste, Language Switcher, Notification Bell
│   │   ├── posts/         # Beitragskarten, Kommentare, Abstimmung, Detail-Header
│   │   ├── chat/          # Chat-Fenster
│   │   └── admin/         # Admin-Panel
│   ├── context/
│   │   ├── LanguageContext.tsx   # i18n (DE/EN/FR/ES)
│   │   └── ThemeContext.tsx      # Dark/Light Mode
│   └── lib/
│       ├── auth.ts        # JWT-Logik
│       ├── i18n.ts        # Übersetzungen
│       ├── prisma.ts      # Datenbank-Client
│       └── utils.ts       # Hilfsfunktionen
└── .env.example
```

---

## API-Endpunkte

| Methode | Route | Beschreibung |
|---|---|---|
| POST | `/api/auth/login` | Anmelden |
| POST | `/api/auth/register` | Registrieren |
| POST | `/api/auth/logout` | Abmelden |
| GET/POST | `/api/posts` | Beiträge abrufen / erstellen |
| GET/PATCH/DELETE | `/api/posts/[id]` | Einzelnen Beitrag verwalten |
| POST | `/api/posts/[id]/vote` | Abstimmen (+1 / -1) |
| GET/POST | `/api/posts/[id]/comments` | Kommentare |
| GET/POST | `/api/channels` | Kanäle abrufen / erstellen |
| GET/POST | `/api/channels/[id]/messages` | Nachrichten (Chat) |
| GET/PATCH | `/api/notifications` | Benachrichtigungen abrufen / als gelesen markieren |
| PATCH | `/api/users/[id]/role` | Benutzerrolle ändern (Admin) |

---

## Sicherheit

- Passwörter werden mit **bcrypt** (Kostenfaktor 10) gehasht — nie im Klartext gespeichert
- JWT-Token in **httpOnly Cookie** — nicht durch JavaScript auslesbar (XSS-Schutz)
- Alle API-Routen prüfen die Authentifizierung serverseitig
- Admin-Routen prüfen zusätzlich die Rolle
- Eigene Beiträge können nur vom Autor oder einem Admin gelöscht werden
- Middleware schützt alle nicht-öffentlichen Routen vor unauthentifizierten Zugriffen