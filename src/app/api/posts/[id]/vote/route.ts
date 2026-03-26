import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Params) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id: postId } = await params;
  const { value } = await req.json();

  if (value === 0) {
    // Remove vote
    await prisma.vote.deleteMany({
      where: { userId: session.userId, postId },
    });
    return NextResponse.json({ ok: true });
  }

  if (value !== 1 && value !== -1) {
    return NextResponse.json({ error: "Invalid vote value" }, { status: 400 });
  }

  const post = await prisma.post.findUnique({ where: { id: postId }, select: { authorId: true, title: true } });
  if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });

  const existingVote = await prisma.vote.findUnique({
    where: { userId_postId: { userId: session.userId, postId } },
  });

  await prisma.vote.upsert({
    where: { userId_postId: { userId: session.userId, postId } },
    update: { value },
    create: { userId: session.userId, postId, value },
  });

  // Notifier seulement pour un nouveau upvote (pas une mise à jour, pas un downvote)
  if (!existingVote && value === 1 && post.authorId !== session.userId) {
    await prisma.notification.create({
      data: {
        userId: post.authorId,
        type: "upvote_post",
        message: `${session.name} a aimé ton post : "${post.title}"`,
        actorName: session.name,
        relatedId: postId,
      },
    });
  }

  return NextResponse.json({ ok: true });
}