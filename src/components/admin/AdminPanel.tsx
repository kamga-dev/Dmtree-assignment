"use client";

import { useState } from "react";
import { formatiereDatumI18n } from "@/lib/i18n";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

type Benutzer = { id: string; name: string; email: string; role: string; createdAt: string };
type Beitrag  = { id: string; title: string; category: string; isPinned: boolean; authorName: string; commentsCount: number; votesCount: number; createdAt: string };
type Kanal    = { id: string; name: string; description: string | null; messagesCount: number };
type Statistik = { labelKey: string; wert: number };

function KatBadge({ cat }: { cat: string }) {
  const { t } = useLanguage();
  const m: Record<string, string> = { NEWS: "badge-news", IDEAS: "badge-ideas", GENERAL: "badge-general" };
  const k: Record<string, string> = { NEWS: "newsBadge", IDEAS: "ideaBadge", GENERAL: "generalBadge" };
  return <span className={`badge-dark ${m[cat] ?? "badge-general"}`}>{t("cat", k[cat] ?? "generalBadge")}</span>;
}

export default function VerwaltungsPanel({ users, posts: p0, channels: c0, stats }: {
  users: Benutzer[]; posts: Beitrag[]; channels: Kanal[]; stats: Statistik[];
}) {
  const { t, sprache } = useLanguage();
  const [tab, setTab] = useState<"posts" | "users" | "channels">("posts");
  const [beitraege, setBeitraege] = useState(p0);
  const [kanaele, setKanaele] = useState(c0);
  const [neuerKanal, setNeuerKanal] = useState({ name: "", description: "" });
  const [kanalFehler, setKanalFehler] = useState("");
  const router = useRouter();

  const TABS: { key: "posts" | "users" | "channels"; label: string }[] = [
    { key: "posts",    label: t("admin", "posts")    },
    { key: "users",    label: t("admin", "users")    },
    { key: "channels", label: t("admin", "channels") },
  ];

  async function anpinnen(id: string, aktuell: boolean) {
    const res = await fetch(`/api/posts/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isPinned: !aktuell }) });
    if (res.ok) setBeitraege((p) => p.map((b) => b.id === id ? { ...b, isPinned: !aktuell } : b));
  }

  async function beitragLoeschen(id: string) {
    if (!confirm(t("admin", "confirmDelete"))) return;
    const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
    if (res.ok) setBeitraege((p) => p.filter((b) => b.id !== id));
  }

  async function kanalErstellen(e: React.FormEvent) {
    e.preventDefault();
    setKanalFehler("");
    const res = await fetch("/api/channels", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(neuerKanal) });
    const d = await res.json();
    if (!res.ok) { setKanalFehler(d.error ?? "Fehler"); return; }
    setKanaele((p) => [...p, { ...d, messagesCount: 0 }]);
    setNeuerKanal({ name: "", description: "" });
    router.refresh();
  }

  async function kanalLoeschen(id: string) {
    if (!confirm(t("admin", "confirmDelChan"))) return;
    const res = await fetch(`/api/channels/${id}`, { method: "DELETE" });
    if (res.ok) { setKanaele((p) => p.filter((k) => k.id !== id)); router.refresh(); }
  }

  async function rolleAendern(id: string, aktuelleRolle: string) {
    const neueRolle = aktuelleRolle === "ADMIN" ? "MEMBER" : "ADMIN";
    if (!confirm(t("admin", "confirmRole"))) return;
    await fetch(`/api/users/${id}/role`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ role: neueRolle }) });
    router.refresh();
  }

  const rowStyle: React.CSSProperties = {
    display: "flex", alignItems: "center", gap: ".75rem",
    padding: ".75rem .875rem",
    background: "rgba(255,255,255,.03)",
    border: "1px solid var(--card-border)",
    borderRadius: ".625rem",
    marginBottom: ".4rem",
  };

  const btnSmall = (label: string, onClick: () => void, danger = false): React.ReactNode => (
    <button onClick={onClick} style={{ fontSize: ".6875rem", padding: ".3rem .625rem", borderRadius: ".375rem", border: danger ? "1px solid rgba(248,113,113,.4)" : "1px solid var(--card-border)", background: danger ? "rgba(248,113,113,.1)" : "rgba(255,255,255,.05)", color: danger ? "#f87171" : "var(--text-muted)", cursor: "pointer", whiteSpace: "nowrap", transition: "all .15s" }}>
      {label}
    </button>
  );

  return (
    <div>
      {/* Kopfzeile */}
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ margin: "0 0 .25rem", fontSize: "1.125rem", fontWeight: 700, color: "var(--text-main)" }}>{t("admin", "title")}</h1>
        <p style={{ margin: 0, fontSize: ".875rem", color: "var(--text-muted)" }}>{t("admin", "subtitle")}</p>
      </div>

      {/* Statistiken */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: ".75rem", marginBottom: "1.5rem" }}>
        {stats.map((s) => (
          <div key={s.labelKey} className="glass-card" style={{ padding: "1rem 1.25rem" }}>
            <p style={{ margin: "0 0 .2rem", fontSize: "1.75rem", fontWeight: 700, color: "var(--primary-light)" }}>{s.wert}</p>
            <p style={{ margin: 0, fontSize: ".8125rem", color: "var(--text-muted)" }}>{t("admin", s.labelKey)}</p>
          </div>
        ))}
      </div>

      <div className="glass-card" style={{ overflow: "hidden" }}>
        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: "1px solid var(--card-border)", padding: "0 1rem" }}>
          {TABS.map((tb) => (
            <button key={tb.key} onClick={() => setTab(tb.key)} style={{ padding: ".875rem 1rem", fontSize: ".875rem", fontWeight: 500, border: "none", borderBottom: `2px solid ${tab === tb.key ? "var(--primary-light)" : "transparent"}`, background: "transparent", color: tab === tb.key ? "var(--primary-light)" : "var(--text-muted)", cursor: "pointer", transition: "color .15s" }}>
              {tb.label}
            </button>
          ))}
        </div>

        <div style={{ padding: "1rem" }}>

          {/* Beiträge */}
          {tab === "posts" && (
            <div>
              {beitraege.map((b) => (
                <div key={b.id} style={rowStyle}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", gap: ".375rem", flexWrap: "wrap", marginBottom: ".25rem", alignItems: "center" }}>
                      {b.isPinned && <span className="badge-dark badge-pinned">{t("post", "pinned")}</span>}
                      <KatBadge cat={b.category} />
                      <span style={{ fontSize: ".875rem", fontWeight: 500, color: "var(--text-main)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{b.title}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: ".6875rem", color: "rgba(156,163,175,.5)" }}>
                      {t("post", "by")} {b.authorName} · {formatiereDatumI18n(b.createdAt, sprache)} · {b.commentsCount} {t("post", "comments")} · {b.votesCount} {t("admin", "votes")}
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: ".375rem" }}>
                    {btnSmall(b.isPinned ? t("admin", "unpin") : t("admin", "pin"), () => anpinnen(b.id, b.isPinned))}
                    {btnSmall(t("admin", "delete"), () => beitragLoeschen(b.id), true)}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Benutzer */}
          {tab === "users" && (
            <div>
              {users.map((u) => (
                <div key={u.id} style={rowStyle}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", gap: ".375rem", alignItems: "center", marginBottom: ".2rem" }}>
                      <span style={{ fontSize: ".875rem", fontWeight: 600, color: "var(--text-main)" }}>{u.name}</span>
                      <span className={`badge-dark ${u.role === "ADMIN" ? "badge-admin" : "badge-member"}`}>
                        {u.role === "ADMIN" ? t("admin", "administrator") : t("admin", "member")}
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: ".6875rem", color: "rgba(156,163,175,.5)" }}>
                      {u.email} · {t("admin", "joined")} {formatiereDatumI18n(u.createdAt, sprache)}
                    </p>
                  </div>
                  {btnSmall(u.role === "ADMIN" ? t("admin", "removeAdmin") : t("admin", "makeAdmin"), () => rolleAendern(u.id, u.role))}
                </div>
              ))}
            </div>
          )}

          {/* Kanäle */}
          {tab === "channels" && (
            <div>
              <div style={{ background: "rgba(255,255,255,.03)", border: "1px solid var(--card-border)", borderRadius: ".75rem", padding: "1rem", marginBottom: "1rem" }}>
                <p style={{ margin: "0 0 .75rem", fontSize: ".8125rem", fontWeight: 600, color: "var(--text-muted)" }}>{t("admin", "newChannel")}</p>
                <form onSubmit={kanalErstellen} style={{ display: "flex", gap: ".5rem" }}>
                  <input type="text" className="input-dark" placeholder={t("admin", "channelName")} value={neuerKanal.name}
                    onChange={(e) => setNeuerKanal({ ...neuerKanal, name: e.target.value.toLowerCase().replace(/\s+/g, "-") })}
                    style={{ flex: 1 }} />
                  <input type="text" className="input-dark" placeholder={t("admin", "description")} value={neuerKanal.description}
                    onChange={(e) => setNeuerKanal({ ...neuerKanal, description: e.target.value })}
                    style={{ flex: 1 }} />
                  <button type="submit" className="btn-primary-dark" style={{ width: "auto", whiteSpace: "nowrap" }}>{t("admin", "create")}</button>
                </form>
                {kanalFehler && <p style={{ margin: ".375rem 0 0", fontSize: ".75rem", color: "#f87171" }}>{kanalFehler}</p>}
              </div>

              {kanaele.map((k) => (
                <div key={k.id} style={rowStyle}>
                  <span style={{ color: "var(--text-muted)", fontWeight: 700 }}>#</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: ".875rem", fontWeight: 500, color: "var(--text-main)" }}>{k.name}</p>
                    <p style={{ margin: 0, fontSize: ".6875rem", color: "rgba(156,163,175,.5)" }}>
                      {k.description ?? t("admin", "noDescription")} · {k.messagesCount} {t("admin", "messages")}
                    </p>
                  </div>
                  {btnSmall(t("admin", "delete"), () => kanalLoeschen(k.id), true)}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}