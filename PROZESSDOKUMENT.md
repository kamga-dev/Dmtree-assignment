
# Prozessdokument — DMTree Community Prototyp

**Datum:** März 2026
**Zeitaufwand:** ca. 8–12 Stunden

---

## 1. Problemverständnis & Lösungsansatz

### Analyse der Aufgabenstellung

Nach dem Lesen der Aufgabe habe ich das Problem in drei Kernbereiche aufgeteilt:

1. **Informationskanal** — Neuigkeiten & Ankündigungen strukturiert anzeigen
2. **Feedback-System** — Ideen einreichen und durch Abstimmungen priorisieren
3. **Direktkommunikation** — Echtzeit-Austausch zwischen Mitgliedern

Ich habe mich bewusst gegen eine 1:1-Nachbildung von Reddit oder Discourse entschieden, weil ich eine für DMTree zugeschnittene Lösung bauen wollte — keine generische Kopie.

### Meine Leitprinzipien

- **Qualität vor Quantität** — lieber wenige Features sauber umgesetzt
- **Sicherheit von Anfang an** — keine Kompromisse bei Auth und Datenschutz
- **Produktionsnaher Code** — kein Quick-and-dirty, sondern wartbarer, lesbarer Code
- **Nutzererfahrung** — jede Interaktion soll sich reaktiv und durchdacht anfühlen

---

## 2. Technische Entscheidungen

Jede Entscheidung habe ich aktiv analysiert und begründet getroffen.

### Warum Next.js statt Express + React getrennt?

Ich habe beide Ansätze abgewogen:

```
Express + React  →  2 Projekte, 2 Server, CORS konfigurieren,
                    komplexeres Deployment

Next.js          →  1 Projekt, 1 Server, keine CORS-Probleme,
                    Server Components für direkte DB-Abfragen
```

**Entscheidung:** Next.js — für einen Prototyp der richtige Kompromiss zwischen Geschwindigkeit und Code-Qualität.

### Warum SQLite statt PostgreSQL?

Für einen Prototyp, der lokal vorgeführt werden soll, ist SQLite ideal:
- Keine externe Datenbank-Installation notwendig
- Reviewer können das Projekt sofort starten
- Prisma ORM erlaubt späteren Wechsel zu PostgreSQL mit minimalem Aufwand (2 Zeilen in `schema.prisma`)

### Warum JWT in httpOnly Cookie?

Ich habe explizit **gegen localStorage** entschieden — eine häufige Sicherheitslücke in Prototypen. Ein httpOnly Cookie ist durch JavaScript nicht auslesbar und schützt so vor XSS-Angriffen. Das ist eine bewusste Designentscheidung, keine Selbstverständlichkeit.

### Warum HTTP Polling statt WebSocket für den Chat?

WebSocket mit Next.js erfordert einen custom Server — das kostet 2–3 Stunden extra Aufwand. Ich habe entschieden, diese Zeit lieber in saubereren Code und besseres UI zu investieren. Der 3-Sekunden-Delay ist für einen Prototyp akzeptabel und klar dokumentiert.

### Warum CSS Custom Properties für das Theme-System?

Ich habe `data-theme` auf dem `<html>`-Element serverseitig gesetzt (aus dem Cookie gelesen), um einen **Flash of Wrong Theme** beim Laden zu verhindern. Die Umschaltung erfolgt dann clientseitig durch Änderung des Attributs — ohne JavaScript-Bundle-Overhead.

### Warum ein eigenes i18n-System statt einer Bibliothek?

Das Projekt enthält ein leichtgewichtiges, maßgeschneidertes i18n-System (`src/lib/i18n.ts`) mit einem zentralen Übersetzungsobjekt für DE/EN/FR/ES. Bibliotheken wie `next-intl` hätten mehr Overhead und Konfigurationsaufwand bedeutet — für die gegebene Anzahl an Übersetzungsschlüsseln war die eigene Lösung effizienter und transparenter.

---

## 3. Einsatz von KI-Tools

### Verwendetes Tool

**Claude Code (Claude Sonnet 4.6 von Anthropic)** — eingesetzt als KI-Assistent im Terminal.

### Wie ich die KI eingesetzt habe

Ich habe die KI als fortgeschrittenes Assistenzwerkzeug genutzt – vergleichbar mit einem Tool, dem ich klare und strukturierte Aufgaben gebe und dessen Output ich anschließend überprüfe, anpasse und integriere.

Dabei war mir wichtig, dass ich jede Entscheidung — ob architektonisch oder technisch — selbst getroffen und jede umgesetzte Komponente vollständig durchdrungen habe.

Ich habe den generierten Code zudem systematisch getestet und validiert (manuelle Tests, Überprüfung von Edge Cases sowie kritische Code-Reviews), um Qualität und Stabilität sicherzustellen.

### Unterstützung durch die KI

Die KI wurde gezielt eingesetzt für:

- Code-Generierung basierend auf meinen Vorgaben (Architektur, Technologien, Anforderungen)
- Debugging – schnelle Identifikation und Behebung von Fehlern
- Dokumentation – Strukturierung von README und Prozessdokument nach meinen Anweisungen

Zusätzlich habe ich präzise und strukturierte Prompts formuliert und diese iterativ verfeinert, um konsistente und qualitativ hochwertige Ergebnisse zu erzielen.

### Meine eigenen Entscheidungen und Steuerung

Ich habe die folgenden Aspekte eigenständig definiert und umgesetzt:

- Die Gesamtarchitektur (Next.js, SQLite, JWT, Polling)
- Das Datenbankschema (Tabellenstruktur und Relationen)
- Das UI/UX-Konzept (Dark Theme, Glassmorphism, deutsche Sprache)
- Die Auswahl und Priorisierung der Features
- Die Sicherheitsstrategie (httpOnly-Cookies, serverseitige Validierung)
- Kontinuierliche Verbesserungen während der Entwicklung (z. B. Umstellung auf Daumen-Icons für das Voting)

Wenn Vorschläge der KI nicht optimal oder nicht passend waren, habe ich diese eigenständig angepasst, korrigiert oder verworfen.

### Konkrete Beispiele meiner Steuerung

- Die initialen Demo-Daten waren auf Englisch → Anweisung zur vollständigen Lokalisierung auf Deutsch
- Das ursprüngliche Design war zu einfach → Definition eines Glassmorphism-Designs mit konkreten CSS-Vorgaben
- Das Voting-System mit Pfeilen war nicht intuitiv genug → Entscheidung für Daumen-Icons
- Bei technischen Problemen (z. B. SQLite Enums, next.config.ts) habe ich die Fehler analysiert und gezielte Lösungsanweisungen gegeben

### Beispiel-Prompts aus meinem Workflow

Die folgenden Prompts zeigen, wie ich die KI konkret gesteuert habe — präzise, zielgerichtet und auf Basis eigener Analyse:

**Architektur & Feature-Definition:**
> *„Entwickle eine Login-Seite in Next.js mit folgenden Funktionen: Passwort anzeigen/verbergen, Fehlversuch-Zähler, Hilfebereich nach 2 Fehlversuchen mit Link zu 'Passwort vergessen'."*

**Eigenständig identifiziertes Problem → gezielter Prompt:**
> *„Ich habe festgestellt, dass andere Nutzer ihre eigenen Beiträge nicht löschen können. Bitte ergänze die Löschfunktion auch für den Autor des Beitrags."*

**Feature-Erweiterung auf Basis eigener Idee:**
> *„Beim Benachrichtigungssystem soll zusätzlich eine Benachrichtigung ausgelöst werden, wenn ein neuer Beitrag veröffentlicht wird — nicht nur bei Kommentaren."*

**UI/UX-Vorgabe:**
> *„Auf der Login-Seite soll oben rechts ein Sprachwechsler sowie ein Dark/Light-Mode-Toggle erscheinen — konsistent mit dem restlichen Design der Anwendung."*

**Feature-Schicht auf Basis eigener Analyse:**
> *„Füge folgende Features hinzu: Volltextsuche über Titel und Inhalt, Pagination mit 3 Beiträgen pro Seite, Inline-Bearbeitung eigener Beiträge, Kommentarlöschung durch den Autor, Profilseite mit Statistiken, Skeleton Loader beim Seitenwechsel und Online-Status im Chat basierend auf Kanal-Teilnehmern."*

Diese Beispiele zeigen: Ich habe der KI keine offenen Fragen gestellt, sondern konkrete, durchdachte Anweisungen gegeben — basierend auf eigener Analyse und klaren Vorstellungen des gewünschten Ergebnisses.

### Reflexion

Der Einsatz von KI ermöglicht es mir, innerhalb kurzer Zeit effizient hochwertige Ergebnisse zu erzielen.
Gleichzeitig ersetzt die KI weder das technische Verständnis noch die Fähigkeit zur Problemanalyse oder zur Architekturentscheidung – diese Verantwortung liegt vollständig bei mir.

Die KI wurde außerdem iterativ eingesetzt, um Codequalität, Architektur und User Experience kontinuierlich zu verbessern.

---

## 4. Implementierungsreihenfolge

Ich habe das Projekt in logischen Schritten aufgebaut — zuerst das Fundament, dann die Features:

```
Phase 1 — Fundament
  → Projektstruktur & Konfiguration
  → Datenbankschema (Prisma + SQLite)
  → Authentifizierung (JWT, bcrypt, Middleware)

Phase 2 — Kernfeatures
  → Post-Feed mit Kategorien & Filterung
  → Abstimmungssystem mit optimistischen Updates
  → Kommentarfunktion

Phase 3 — Erweiterte Features
  → Chat mit HTTP Polling
  → Admin-Panel (Pin, Löschen, Rollen)
  → Benachrichtigungssystem (Kommentare + neue Beiträge)

Phase 4 — UI/UX & Erfahrung
  → Dark/Light Mode mit Cookie-Persistenz (kein Theme-Flash)
  → Mehrsprachigkeit DE/EN/FR/ES (i18n-System)
  → Collapsible Sidebar (Desktop) + Mobile Top-Bar
  → Animationen & Micro-Interactions (Staggered Cards, Hover-Lift)

Phase 5 — Login-Erfahrung & Abgabe
  → Show/Hide-Passwort-Toggle
  → Language Switcher + Theme Toggle auf Login-Seite
  → Fehlversuch-Tracking mit Hilfebereich nach 2 Fehlern
  → Forgot Password & Forgot Email Seiten
  → README & Prozessdokument

Phase 6 — Feature-Erweiterung
  → Volltextsuche über Titel und Inhalt (URL-Parameter)
  → Pagination (3 Beiträge pro Seite, Prev/Next)
  → Inline-Bearbeitung eigener Beiträge (ohne Seitenwechsel)
  → Kommentarlöschung durch den Autor
  → Profilseite mit Statistiken (Beiträge, Votes, Kommentare)
  → Skeleton Loader beim Seitenwechsel (loading.tsx)
  → Online-Status im Chat (Kanal-Teilnehmer)
```

---

## 5. Was gut funktioniert hat

- **Next.js Server Components** reduzieren die Komplexität erheblich — direkte DB-Abfragen ohne useEffect
- **Optimistische Updates** beim Voting und Chat — die App fühlt sich reaktiv an
- **Prisma ORM** — typ-sicherer Datenbankzugriff, der Bugs verhindert
- **Das Glassmorphism-Design** — professionelles Erscheinungsbild mit wenig CSS-Aufwand
- **CSS Custom Properties für Theming** — Dark/Light-Mode ohne JavaScript-Flackern, ein einziges `[data-theme="light"]`-Block überschreibt alle Variablen
- **Eigenes i18n-System** — einfach erweiterbar, keine Abhängigkeit von Drittbibliotheken
- **Benachrichtigungssystem** — `createMany()` für effiziente Massen-Benachrichtigungen bei neuen Beiträgen
- **Volltextsuche mit Prisma** — `contains`-Filter über Titel und Inhalt mit `OR`-Verknüpfung, ohne zusätzliche Suchdatenbank
- **Inline-Bearbeitung** — Beiträge lassen sich direkt im Feed bearbeiten; optimistisches State-Management ohne Seitenneuladen
- **Profilseite mit Aggregaten** — Vote-Summen und Kommentarzahlen via Prisma `_count` und `reduce` direkt aus der Datenbank

---

## 6. Was ich mit mehr Zeit anders machen würde

### Bereits über die Anforderungen hinaus umgesetzt

Folgende Features wurden eigenständig ergänzt — ohne dass sie explizit gefordert waren:

| Feature | Umsetzung |
|---|---|
| Benachrichtigungssystem | 15s-Polling, ausgelöst bei Kommentaren & neuen Beiträgen |
| Dark/Light Mode | Cookie-basiert, kein Theme-Flash beim Laden |
| Mehrsprachigkeit | DE/EN/FR/ES via eigenem i18n-System |
| Volltextsuche | Prisma `contains`-Filter über Titel und Inhalt |
| Pagination | 3 Beiträge pro Seite mit URL-Parametern |
| Inline-Bearbeitung | Optimistisches State-Management ohne Seitenneuladen |
| Profilseite | Statistiken via Prisma `_count` und `reduce` |
| Skeleton Loader | Next.js `loading.tsx` für alle Seitenübergänge |
| Online-Status | Kanal-Teilnehmer als Online-Indikator im Chat |

### Verbesserungspotenzial

| Bereich | Aktuell | Mit mehr Zeit |
|---|---|---|
| Echtzeit-Chat | HTTP Polling (3s) | WebSocket via Socket.io |
| Datenbank | SQLite | PostgreSQL |
| Tests | Keine | Vitest Unit-Tests + Playwright E2E |
| Suche | Implementiert (Prisma `contains`) | Dedizierte Volltextsuchmaschine (z. B. MeiliSearch) |
| Rate Limiting | Fehlt | Schutz gegen Spam & Missbrauch |
| Forgot Password | UI-Mockup | Echter E-Mail-Versand (z. B. Resend) |
| Inhaltsübersetzung | Nicht vorhanden | Integration einer Übersetzungs-API (z. B. DeepL) |
| Deployment | Lokal (npm run dev) | Docker + GitHub Actions CI/CD |

### Langfristige Architekturvision

Mit mehr Zeit würde ich das Backend komplett in **Python** neu entwickeln — einer Sprache, die ich sehr gut beherrsche. Der konkrete Stack wäre:

- **FastAPI** — modernes, hochperformantes Python-Framework für REST APIs
- **SQLAlchemy** — ORM für die Datenbankanbindung
- **WebSocket** — native Unterstützung in FastAPI für Echtzeit-Chat ohne Polling
- **Pydantic** — automatische Datenvalidierung und Typsicherheit

```python
# Beispiel: So würde die Vote-API in FastAPI aussehen
@app.post("/posts/{post_id}/vote")
async def vote(
    post_id: str,
    vote: VoteSchema,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_vote = db.query(Vote).filter_by(
        user_id=current_user.id,
        post_id=post_id
    ).first()

    if vote.value == 0:
        db.delete(db_vote)
    elif db_vote:
        db_vote.value = vote.value
    else:
        db.add(Vote(user_id=current_user.id, post_id=post_id, value=vote.value))

    db.commit()
    return {"ok": True}
```

Das Frontend (Next.js + TypeScript) würde ich beibehalten — eine klare Frontend/Backend-Trennung ist die richtige Basis für jedes wachsende Projekt.

---

## 7. Fazit

Dieser Prototyp zeigt meine Fähigkeit, ein komplexes Problem zu analysieren, eine durchdachte Architektur zu entwerfen und ein vollständiges, funktionsfähiges Produkt in kurzer Zeit zu liefern. Die iterative Weiterentwicklung — von den Kernfeatures über das Benachrichtigungssystem und Dark Mode bis hin zu Mehrsprachigkeit, verbesserter Login-Erfahrung und einer zusätzlichen Feature-Schicht mit Suche, Pagination, Inline-Bearbeitung, Profilseite und Skeleton Loader — zeigt, dass ich nicht nur schnell implementiere, sondern auch den Blick für Details und Nutzererfahrung behalte.

Der Einsatz von KI-Tools hat dabei meine Produktivität erhöht — die technischen Entscheidungen, die Qualitätskontrolle und die Steuerung der Entwicklung lagen durchgehend bei mir.