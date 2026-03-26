import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ChatFenster from "@/components/chat/ChatWindow";
import ChatKanalHeader from "@/components/chat/ChatChannelHeader";

type Parameter = Promise<{ channelId: string }>;

export default async function KanalSeite({ params }: { params: Parameter }) {
  const session = await getSession();
  const { channelId } = await params;

  const kanal = await prisma.channel.findUnique({ where: { id: channelId } });
  if (!kanal) notFound();

  const nachrichten = await prisma.message.findMany({
    where: { channelId },
    include: { author: { select: { id: true, name: true } } },
    orderBy: { createdAt: "asc" },
    take: 100,
  });

  return (
    <div style={{ height: "calc(100vh - 3rem)", margin: "-1.5rem -1.25rem", display: "flex", flexDirection: "column" }}>
      {/* Kanal-Header */}
      <div style={{ padding: ".875rem 1.25rem", borderBottom: "1px solid var(--card-border)", background: "rgba(15,12,41,.5)", backdropFilter: "blur(10px)", flexShrink: 0 }}>
        <ChatKanalHeader name={kanal.name} description={kanal.description} />
      </div>

      <ChatFenster
        channelId={kanal.id}
        initialMessages={nachrichten.map((n) => ({ id: n.id, content: n.content, createdAt: n.createdAt, author: n.author }))}
        currentUser={session ? { id: session.userId, name: session.name } : null}
      />
    </div>
  );
}