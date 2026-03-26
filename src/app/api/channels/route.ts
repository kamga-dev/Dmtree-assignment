import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/auth";

export async function GET() {
  const kanaele = await prisma.channel.findMany({
    orderBy: { name: "asc" },
  });
  return NextResponse.json(kanaele);
}

export async function POST(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Keine Berechtigung" }, { status: 403 });
  }

  const { name, description } = await req.json();

  if (!name?.trim()) {
    return NextResponse.json(
      { error: "Kanalname ist erforderlich" },
      { status: 400 }
    );
  }

  const slug = name.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-");

  try {
    const kanal = await prisma.channel.create({
      data: { name: slug, description: description?.trim() || null },
    });
    return NextResponse.json(kanal, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Kanalname bereits vergeben" },
      { status: 409 }
    );
  }
}