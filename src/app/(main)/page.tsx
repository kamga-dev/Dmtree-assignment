import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import BeitragsListe from "@/components/posts/PostList";
import KategorieFilter from "@/components/posts/CategoryFilter";
import FeedKopfzeile from "@/components/posts/FeedHeader";
import Seitennavigation from "@/components/posts/Pagination";

const PRO_SEITE = 10;

type SuchParameter = Promise<{ category?: string; sort?: string; q?: string; page?: string }>;

export default async function StartSeite({ searchParams }: { searchParams: SuchParameter }) {
  const session = await getSession();
  const { category, sort = "hot", q, page } = await searchParams;
  const aktuelleSeite = Math.max(1, parseInt(page ?? "1", 10));

  const where = {
    ...(category ? { category } : {}),
    ...(q?.trim() ? {
      OR: [
        { title: { contains: q.trim() } },
        { content: { contains: q.trim() } },
      ],
    } : {}),
  };

  const [beitraege, gesamt] = await Promise.all([
    prisma.post.findMany({
      where,
      include: {
        author: { select: { id: true, name: true } },
        _count: { select: { comments: true, votes: true } },
        votes: session ? { where: { userId: session.userId } } : false,
      },
      orderBy: sort === "neu" ? { createdAt: "desc" } : sort === "top" ? { votes: { _count: "desc" } } : [{ isPinned: "desc" }, { createdAt: "desc" }],
      skip: (aktuelleSeite - 1) * PRO_SEITE,
      take: PRO_SEITE,
    }),
    prisma.post.count({ where }),
  ]);

  const mitPunktzahl = beitraege.map((b) => ({
    ...b,
    punktzahl: b.votes.reduce((acc: number, v: { value: number }) => acc + v.value, 0),
    benutzerStimme: session ? (b.votes.find((v: { userId: string }) => v.userId === session.userId)?.value ?? 0) : 0,
  }));

  const sortiert = (sort === "hot" || !sort)
    ? [...mitPunktzahl].sort((a, b) => { if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1; return b.punktzahl - a.punktzahl; })
    : mitPunktzahl;

  const gesamtSeiten = Math.ceil(gesamt / PRO_SEITE);

  return (
    <div>
      <FeedKopfzeile count={gesamt} searchQuery={q} />
      <KategorieFilter currentCategory={category} currentSort={sort} currentSearch={q} />
      <BeitragsListe posts={sortiert} currentUserId={session?.userId} searchQuery={q} />
      {gesamtSeiten > 1 && (
        <Seitennavigation
          currentPage={aktuelleSeite}
          totalPages={gesamtSeiten}
          category={category}
          sort={sort}
          q={q}
        />
      )}
    </div>
  );
}