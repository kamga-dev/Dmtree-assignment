import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import AbstimmungsSchaltflächen from "@/components/posts/VoteButtons";
import KommentarBereich from "@/components/posts/CommentSection";
import BeitragsDetailKopf from "@/components/posts/PostDetailHeader";

type Parameter = Promise<{ id: string }>;

export default async function BeitragsSeite({ params }: { params: Parameter }) {
  const session = await getSession();
  const { id } = await params;

  const beitrag = await prisma.post.findUnique({
    where: { id },
    include: {
      author: { select: { id: true, name: true } },
      comments: {
        include: { author: { select: { id: true, name: true } } },
        orderBy: { createdAt: "asc" },
      },
      votes: session ? { where: { userId: session.userId } } : false,
      _count: { select: { votes: true, comments: true } },
    },
  });

  if (!beitrag) notFound();

  const punktzahlAggreg = await prisma.vote.aggregate({
    where: { postId: id },
    _sum: { value: true },
  });

  const benutzerStimme = session
    ? (beitrag.votes as { value: number }[]).find(() => true)?.value ?? 0
    : 0;

  return (
    <div>
      <div className="glass-card" style={{ padding: "1.5rem" }}>
        <div style={{ display: "flex", gap: "1.25rem" }}>
          <AbstimmungsSchaltflächen
            postId={beitrag.id}
            initialScore={punktzahlAggreg._sum.value ?? 0}
            initialUserVote={benutzerStimme}
            currentUserId={session?.userId}
          />

          <div style={{ flex: 1, minWidth: 0 }}>
            <BeitragsDetailKopf
              category={beitrag.category}
              isPinned={beitrag.isPinned}
              title={beitrag.title}
              content={beitrag.content}
              authorName={beitrag.author.name}
              createdAt={beitrag.createdAt}
            />
          </div>
        </div>
      </div>

      <div style={{ marginTop: "1.5rem" }}>
        <KommentarBereich
          postId={beitrag.id}
          initialComments={beitrag.comments.map((k) => ({ id: k.id, content: k.content, createdAt: k.createdAt, author: k.author }))}
          currentUser={session ? { id: session.userId, name: session.name } : null}
        />
      </div>
    </div>
  );
}