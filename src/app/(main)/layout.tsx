import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Seitenleiste from "@/components/layout/Sidebar";
import { prisma } from "@/lib/prisma";

export default async function HauptLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");

  const kanaele = await prisma.channel.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", position: "relative", zIndex: 1 }}>
      <Seitenleiste session={session} channels={kanaele} />
      <main className="main-content" style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", width: "100%", padding: "1.5rem 1.25rem", flex: 1 }}>
          {children}
        </div>
      </main>
    </div>
  );
}