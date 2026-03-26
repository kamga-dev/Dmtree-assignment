import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const kategorie = searchParams.get("category");

  const beitraege = await prisma.post.findMany({
    where: kategorie ? { category: kategorie } : {},
    include: {
      author: { select: { id: true, name: true } },
      _count: { select: { comments: true, votes: true } },
    },
    orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
  });

  return NextResponse.json(beitraege);
}

export async function POST(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
  }

  try {
    const { title, content, category } = await req.json();

    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json(
        { error: "Titel und Inhalt sind erforderlich" },
        { status: 400 }
      );
    }

    const erlaubteKategorien = ["NEWS", "IDEAS", "GENERAL"];
    const kat = erlaubteKategorien.includes(category) ? category : "GENERAL";

    const beitrag = await prisma.post.create({
      data: {
        title: title.trim(),
        content: content.trim(),
        category: kat,
        authorId: session.userId,
      },
    });

    return NextResponse.json(beitrag, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}