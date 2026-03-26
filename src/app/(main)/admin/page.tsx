import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import VerwaltungsPanel from "@/components/admin/AdminPanel";

export default async function VerwaltungsSeite() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/");

  const [benutzer, beitraege, kanaele] = await Promise.all([
    prisma.user.findMany({ select: { id: true, name: true, email: true, role: true, createdAt: true }, orderBy: { createdAt: "desc" } }),
    prisma.post.findMany({ include: { author: { select: { name: true } }, _count: { select: { comments: true, votes: true } } }, orderBy: { createdAt: "desc" } }),
    prisma.channel.findMany({ include: { _count: { select: { messages: true } } }, orderBy: { name: "asc" } }),
  ]);

  const stats = [
    { labelKey: "users",    wert: benutzer.length },
    { labelKey: "posts",    wert: beitraege.length },
    { labelKey: "channels", wert: kanaele.length },
    { labelKey: "messages", wert: kanaele.reduce((a, k) => a + k._count.messages, 0) },
  ];

  return (
    <VerwaltungsPanel
      stats={stats}
      users={benutzer.map((b) => ({ ...b, createdAt: b.createdAt.toISOString() }))}
      posts={beitraege.map((b) => ({ id: b.id, title: b.title, category: b.category, isPinned: b.isPinned, authorName: b.author.name, commentsCount: b._count.comments, votesCount: b._count.votes, createdAt: b.createdAt.toISOString() }))}
      channels={kanaele.map((k) => ({ id: k.id, name: k.name, description: k.description, messagesCount: k._count.messages }))}
    />
  );
}