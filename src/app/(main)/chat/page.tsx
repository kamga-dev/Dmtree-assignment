import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { t, Sprache } from "@/lib/i18n";

export default async function ChatSeite() {
  const ersterKanal = await prisma.channel.findFirst({ orderBy: { name: "asc" } });
  if (ersterKanal) redirect(`/chat/${ersterKanal.id}`);

  const cookieStore = await cookies();
  const lang = cookieStore.get("dmtree-lang")?.value;
  const sprache = (["de", "en", "fr", "es"].includes(lang ?? "") ? lang : "de") as Sprache;

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "16rem" }}>
      <p style={{ color: "rgba(156,163,175,.4)", fontSize: ".875rem" }}>
        {t("chat", "noChannels", sprache)}
      </p>
    </div>
  );
}