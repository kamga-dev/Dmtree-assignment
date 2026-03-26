import { PrismaClient } from "@prisma/client";

import bcrypt from "bcryptjs";

const prisma = new PrismaClient();


async function main() {
  console.log("Datenbank wird befüllt...");

  // Admin-Benutzer erstellen
  const adminPasswort = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@dmtree.io" },
    update: {},
    create: {
      email: "admin@dmtree.io",
      name: "Admin Benutzer",
      password: adminPasswort,
      role: "ADMIN",
    },
  });

  // Demo-Benutzer erstellen
  const passwort = await bcrypt.hash("demo123", 10);
  const alice = await prisma.user.upsert({
    where: { email: "alice@dmtree.io" },
    update: {},
    create: {
      email: "alice@dmtree.io",
      name: "Alice Müller",
      password: passwort,
      role: "MEMBER",
    },
  });

  const bob = await prisma.user.upsert({
    where: { email: "bob@dmtree.io" },
    update: {},
    create: {
      email: "bob@dmtree.io",
      name: "Bob Schmidt",
      password: passwort,
      role: "MEMBER",
    },
  });

  // Kanäle erstellen
  const allgemeinKanal = await prisma.channel.upsert({
    where: { name: "allgemein" },
    update: {},
    create: {
      name: "allgemein",
      description: "Allgemeine Diskussion für alle Mitglieder",
    },
  });

  await prisma.channel.upsert({
    where: { name: "ankuendigungen" },
    update: {},
    create: {
      name: "ankuendigungen",
      description: "Offizielle Ankündigungen und Updates",
    },
  });

  await prisma.channel.upsert({
    where: { name: "ideen" },
    update: {},
    create: {
      name: "ideen",
      description: "Ideen teilen und diskutieren",
    },
  });

  // Beispielbeiträge erstellen
  const beitrag1 = await prisma.post.create({
    data: {
      title: "Willkommen in der DMTree Community!",
      content:
        "Wir freuen uns, unsere neue Community-Plattform vorzustellen. Hier könnt ihr Neuigkeiten teilen, Ideen einbringen und euch mit anderen Mitgliedern vernetzen. Erstellt Beiträge, bewertet Ideen und tauscht euch in unseren Chat-Kanälen aus.",
      category: "NEWS",
      isPinned: true,
      authorId: admin.id,
    },
  });

  const beitrag2 = await prisma.post.create({
    data: {
      title: "Idee: Dark Mode für die Plattform",
      content:
        "Es wäre toll, einen Dark Mode für die Plattform zu haben. Viele Nutzer bevorzugen dunkle Oberflächen, besonders bei längerer Nutzung am Abend. Das könnte einfach als Umschalter in den Benutzereinstellungen umgesetzt werden – idealerweise mit automatischer Erkennung der Systemeinstellung.",
      category: "IDEAS",
      authorId: alice.id,
    },
  });

  const beitrag3 = await prisma.post.create({
    data: {
      title: "Produkt-Roadmap Q1 – Update",
      content:
        "Hier ist eine Zusammenfassung unserer Schwerpunkte für Q1: (1) Verbessertes Benachrichtigungssystem, (2) Optimierungen der mobilen App, (3) API-Integrationen mit gängigen Tools, (4) Performance-Verbesserungen in der gesamten Plattform. Bleibt gespannt auf weitere Updates!",
      category: "NEWS",
      authorId: admin.id,
    },
  });

  const beitrag4 = await prisma.post.create({
    data: {
      title: "Idee: Wöchentlicher Community-Newsletter",
      content:
        "Was haltet ihr von einem wöchentlichen E-Mail-Digest, der die Top-Beiträge und Diskussionen der Woche zusammenfasst? So bleiben auch Mitglieder auf dem Laufenden, die nicht täglich die Plattform besuchen können. Natürlich als Opt-in.",
      category: "IDEAS",
      authorId: bob.id,
    },
  });

  const beitrag5 = await prisma.post.create({
    data: {
      title: "Rückblick: Virtuelles Team-Treffen",
      content:
        "Unser letztes virtuelles Treffen war ein voller Erfolg! Wir haben kommende Features besprochen, Demos gezeigt und eine lustige Quiz-Runde veranstaltet. Vielen Dank an alle Teilnehmer. Die Aufzeichnung wird bald verfügbar sein.",
      category: "GENERAL",
      authorId: alice.id,
    },
  });

  // Bewertungen hinzufügen
  await prisma.vote.createMany({
    data: [
      { userId: alice.id, postId: beitrag1.id, value: 1 },
      { userId: bob.id, postId: beitrag1.id, value: 1 },
      { userId: bob.id, postId: beitrag2.id, value: 1 },
      { userId: admin.id, postId: beitrag2.id, value: 1 },
      { userId: alice.id, postId: beitrag3.id, value: 1 },
      { userId: bob.id, postId: beitrag4.id, value: 1 },
      { userId: alice.id, postId: beitrag5.id, value: 1 },
      { userId: admin.id, postId: beitrag5.id, value: 1 },
    ],
  });

  // Kommentare hinzufügen
  await prisma.comment.createMany({
    data: [
      {
        content: "Freue mich auf die Plattform! Bin gespannt auf die Diskussionen.",
        postId: beitrag1.id,
        authorId: alice.id,
      },
      {
        content: "Genau das haben wir gebraucht. Danke für die Umsetzung!",
        postId: beitrag1.id,
        authorId: bob.id,
      },
      {
        content:
          "+1 für Dark Mode! Meine Augen werden es euch danken. Am besten mit automatischer Systemerkennung.",
        postId: beitrag2.id,
        authorId: bob.id,
      },
      {
        content:
          "Super Roadmap! Freue mich besonders auf die verbesserten Benachrichtigungen.",
        postId: beitrag3.id,
        authorId: alice.id,
      },
      {
        content:
          "Tolle Idee mit dem Newsletter! Ich würde mich sofort anmelden.",
        postId: beitrag4.id,
        authorId: alice.id,
      },
    ],
  });

  // Chat-Nachrichten hinzufügen
  await prisma.message.createMany({
    data: [
      {
        content: "Hallo zusammen! Willkommen im allgemeinen Kanal.",
        channelId: allgemeinKanal.id,
        authorId: admin.id,
      },
      {
        content: "Danke! Freue mich dabei zu sein.",
        channelId: allgemeinKanal.id,
        authorId: alice.id,
      },
      {
        content: "Die Plattform sieht super aus! Tolles Design.",
        channelId: allgemeinKanal.id,
        authorId: bob.id,
      },
      {
        content: "Weiß jemand, wann das App-Update kommt?",
        channelId: allgemeinKanal.id,
        authorId: alice.id,
      },
      {
        content: "Wir planen Ende Q1. Bleibt dran!",
        channelId: allgemeinKanal.id,
        authorId: admin.id,
      },
    ],
  });

  console.log("✅ Datenbank erfolgreich befüllt!");
  console.log("\nDemo-Zugangsdaten:");
  console.log("  Admin:    admin@dmtree.io / admin123");
  console.log("  Mitglied: alice@dmtree.io / demo123");
  console.log("  Mitglied: bob@dmtree.io   / demo123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });