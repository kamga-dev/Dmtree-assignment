import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ProfilInhalt from "@/components/profile/ProfileContent";

export default async function ProfilSeite() {
  const session = await getSession();
  if (!session) redirect("/login");

  const benutzer = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  if (!benutzer) redirect("/login");

  const beitraege = await prisma.post.findMany({
    where: { authorId: session.userId },
    include: { _count: { select: { comments: true, votes: true } } },
    orderBy: { createdAt: "desc" },
  });

  const punktzahlen = await Promise.all(
    beitraege.map((b) =>
      prisma.vote.aggregate({ where: { postId: b.id }, _sum: { value: true } })
    )
  );

  const beitraegeWithScore = beitraege.map((b, i) => ({
    ...b,
    punktzahl: punktzahlen[i]._sum.value ?? 0,
  }));

  return (
    <ProfilInhalt
      user={benutzer}
      posts={beitraegeWithScore}
    />
  );
}