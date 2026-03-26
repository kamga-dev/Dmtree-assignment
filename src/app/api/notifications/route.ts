import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const notifications = await prisma.notification.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return NextResponse.json(notifications);
}

export async function POST(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { userId, type, message, actorName, relatedId } = await req.json();

  if (!userId || !type || !message || !relatedId) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (userId === session.userId) {
    return NextResponse.json({ error: "Self-notification not allowed" }, { status: 400 });
  }

  const notification = await prisma.notification.create({
    data: { userId, type, message, actorName: actorName ?? session.name, relatedId },
  });

  return NextResponse.json(notification, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.notification.updateMany({
    where: { userId: session.userId, isRead: false },
    data: { isRead: true },
  });

  return NextResponse.json({ ok: true });
}