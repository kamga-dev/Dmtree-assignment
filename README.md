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
| Echtzeit | HTTP Polling (3s Intervall) |

---

## Funktionen

### Mindestanforderungen ✓
- **Authentifizierung** — Registrierung & Login mit E-Mail/Passwort (JWT, httpOnly Cookie)
- **Beiträge** — Erstellen, anzeigen und filtern nach Kategorien (Neuigkeit, Idee, Allgemein)
- **Interaktion** — Upvote/Downvote-System mit Daumen-Icons und Echtzeit-Update
- **Kommunikation** — Kanalbasierter Chat mit automatischer Aktualisierung

### Zusätzliche Features ✓
- **Rollen & Berechtigungen** — Admin vs. Mitglied mit unterschiedlichen Rechten
- **Admin-Panel** — Beiträge anpinnen/löschen, Kanäle verwalten, Rollen ändern
- **Kategorisierung & Filterung** — Filter nach Kategorie, Sortierung (Beliebt / Neu / Top)
- **Angepinnte Beiträge** — Wichtige Beiträge dauerhaft oben anzeigen
- **Optimistische Updates** — UI reagiert sofort ohne auf den Server zu warten
- **Responsive Design** — Mobile-freundliche Seitenleiste mit Hamburger-Menü
- **Glassmorphism UI** — Modernes Dark-Theme mit Blur-Effekten

---

## Lokale Installation

### Voraussetzungen

- Node.js 18 oder höher
- npm

### Schritt 1 — Repository klonen

```bash
git clone <repository-url>
cd DMTreeProjekt
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
│   ├── schema.prisma      # Datenbankschema
│   ├── seed.ts            # Beispieldaten
│   └── dev.db             # SQLite-Datenbank (wird automatisch erstellt)
├── src/
│   ├── app/
│   │   ├── (auth)/        # Login & Registrierung
│   │   ├── (main)/        # Geschützte Seiten (Feed, Chat, Admin)
│   │   └── api/           # REST API-Routen
│   ├── components/
│   │   ├── layout/        # Seitenleiste, Navigation
│   │   ├── posts/         # Beitragskarten, Kommentare, Abstimmung
│   │   ├── chat/          # Chat-Fenster
│   │   └── admin/         # Admin-Panel
│   └── lib/
│       ├── auth.ts        # JWT-Logik
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
| PATCH | `/api/users/[id]/role` | Benutzerrolle ändern |

---

## Sicherheit

- Passwörter werden mit **bcrypt** (Kostenfaktor 10) gehasht — nie im Klartext gespeichert
- JWT-Token in **httpOnly Cookie** — nicht durch JavaScript auslesbar (XSS-Schutz)
- Alle API-Routen prüfen die Authentifizierung serverseitig
- Admin-Routen prüfen zusätzlich die Rolle
- Eigene Beiträge können nur vom Autor oder einem Admin gelöscht werden