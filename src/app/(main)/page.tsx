import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import BeitragsListe from "@/components/posts/PostList";
import KategorieFilter from "@/components/posts/CategoryFilter";
import FeedKopfzeile from "@/components/posts/FeedHeader";

type SuchParameter = Promise<{ category?: string; sort?: string }>;

export default async function StartSeite({ searchParams }: { searchParams: SuchParameter }) {
  const session = await getSession();
  const { category, sort = "hot" } = await searchParams;

  const beitraege = await prisma.post.findMany({
    where: category ? { category } : {},
    include: {
      author: { select: { id: true, name: true } },
      _count: { select: { comments: true, votes: true } },
      votes: session ? { where: { userId: session.userId } } : false,
    },
    orderBy: sort === "neu" ? { createdAt: "desc" } : sort === "top" ? { votes: { _count: "desc" } } : [{ isPinned: "desc" }, { createdAt: "desc" }],
  });

  const mitPunktzahl = beitraege.map((b) => ({
    ...b,
    punktzahl: b.votes.reduce((acc: number, v: { value: number }) => acc + v.value, 0),
    benutzerStimme: session ? (b.votes.find((v: { userId: string }) => v.userId === session.userId)?.value ?? 0) : 0,
  }));

  const sortiert = (sort === "hot" || !sort)
    ? [...mitPunktzahl].sort((a, b) => { if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1; return b.punktzahl - a.punktzahl; })
    : mitPunktzahl;

  return (
    <div>
      <FeedKopfzeile count={beitraege.length} />
      <KategorieFilter currentCategory={category} currentSort={sort} />
      <BeitragsListe posts={sortiert} currentUserId={session?.userId} />
    </div>
  );
}