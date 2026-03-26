"use client";

import Link from "next/link";
import { useState } from "react";
import { getInitialen } from "@/lib/utils";
import { formatiereDatumI18n } from "@/lib/i18n";
import { useLanguage } from "@/context/LanguageContext";

type Beitrag = {
  id: string;
  title: string;
  content: string;
  category: string;
  isPinned: boolean;
  punktzahl: number;
  benutzerStimme: number;
  createdAt: Date;
  author: { id: string; name: string };
  _count: { comments: number; votes: number };
};

function KategorieBadge({ cat }: { cat: string }) {
  const { t } = useLanguage();
  const map: Record<string, { cls: string; key: string }> = {
    NEWS:    { cls: "badge-news",    key: "newsBadge"    },
    IDEAS:   { cls: "badge-ideas",   key: "ideaBadge"    },
    GENERAL: { cls: "badge-general", key: "generalBadge" },
  };
  const { cls, key } = map[cat] ?? map.GENERAL;
  return <span className={`badge-dark ${cls}`}>{t("cat", key)}</span>;
}

function ThumbBtn({ auf, aktiv, onClick, disabled, title }: {
  auf: boolean;
  aktiv: boolean;
  onClick: () => void;
  disabled: boolean;
  title: string;
}) {
  const activeColor  = auf ? "#818cf8" : "#f87171";
  const activeBg     = auf ? "rgba(79,70,229,.25)"   : "rgba(248,113,113,.2)";
  const activeBorder = auf ? "rgba(129,140,248,.5)"  : "rgba(248,113,113,.5)";
  const hoverBg      = auf ? "rgba(79,70,229,.12)"   : "rgba(248,113,113,.1)";
  const hoverBorder  = auf ? "rgba(129,140,248,.3)"  : "rgba(248,113,113,.3)";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      style={{
        background: aktiv ? activeBg : "rgba(255,255,255,.04)",
        border: `1px solid ${aktiv ? activeBorder : "var(--card-border)"}`,
        borderRadius: ".5rem",
        padding: ".3rem .375rem",
        cursor: disabled ? "default" : "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: aktiv ? activeColor : "rgba(156,163,175,.4)",
        transform: aktiv ? "scale(1.12)" : "scale(1)",
        transition: "all .18s",
      }}
      onMouseEnter={(e) => {
        if (!disabled && !aktiv) {
          e.currentTarget.style.background = hoverBg;
          e.currentTarget.style.borderColor = hoverBorder;
          e.currentTarget.style.color = activeColor;
        }
      }}
      onMouseLeave={(e) => {
        if (!aktiv) {
          e.currentTarget.style.background = "rgba(255,255,255,.04)";
          e.currentTarget.style.borderColor = "var(--card-border)";
          e.currentTarget.style.color = "rgba(156,163,175,.4)";
        }
      }}
    >
      {auf ? (
        <svg width="17" height="17" viewBox="0 0 24 24" fill={aktiv ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14z" />
          <path d="M7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3" />
        </svg>
      ) : (
        <svg width="17" height="17" viewBox="0 0 24 24" fill={aktiv ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 15v4a3 3 0 003 3l4-9V2H5.72a2 2 0 00-2 1.7l-1.38 9a2 2 0 002 2.3H10z" />
          <path d="M17 2h2.67A2.31 2.31 0 0122 4v7a2.31 2.31 0 01-2.33 2H17" />
        </svg>
      )}
    </button>
  );
}

export default function BeitragKarte({ post, currentUserId }: { post: Beitrag; currentUserId?: string }) {
  const { t, sprache } = useLanguage();
  const [punktzahl, setPunktzahl] = useState(post.punktzahl);
  const [benutzerStimme, setBenutzerStimme] = useState(post.benutzerStimme);
  const [laedt, setLaedt] = useState(false);

  async function abstimmen(wert: 1 | -1) {
    if (!currentUserId || laedt) return;
    setLaedt(true);
    const neueStimme = benutzerStimme === wert ? 0 : wert;
    setPunktzahl((p) => p + (neueStimme - benutzerStimme));
    setBenutzerStimme(neueStimme);
    try {
      await fetch(`/api/posts/${post.id}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: neueStimme === 0 ? wert : neueStimme }),
      });
    } catch {
      setPunktzahl(post.punktzahl);
      setBenutzerStimme(post.benutzerStimme);
    } finally {
      setLaedt(false);
    }
  }

  const kommentarText = post._count.comments === 1
    ? `1 ${t("post", "comment")}`
    : `${post._count.comments} ${t("post", "comments")}`;

  return (
    <div
      className="glass-card"
      style={{ padding: "1rem 1.25rem", display: "flex", gap: "1rem", transition: "box-shadow .2s" }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,.5), 0 1px 0 rgba(255,255,255,.08) inset")}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "")}
    >
      {/* Vote-Spalte */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: ".3rem", flexShrink: 0, paddingTop: ".125rem" }}>
        <ThumbBtn auf aktiv={benutzerStimme === 1}  onClick={() => abstimmen(1)}  disabled={!currentUserId} title={t("post", "likeTitle")} />
        <span style={{
          fontSize: ".8125rem", fontWeight: 700, textAlign: "center", minWidth: "1.75rem",
          color: punktzahl > 0 ? "#818cf8" : punktzahl < 0 ? "#f87171" : "rgba(156,163,175,.5)",
          transition: "color .2s",
        }}>
          {punktzahl > 0 ? `+${punktzahl}` : punktzahl}
        </span>
        <ThumbBtn auf={false} aktiv={benutzerStimme === -1} onClick={() => abstimmen(-1)} disabled={!currentUserId} title={t("post", "dislikeTitle")} />
      </div>

      {/* Inhalt */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: ".5rem", flexWrap: "wrap", marginBottom: ".5rem" }}>
          {post.isPinned && <span className="badge-dark badge-pinned">📌 {t("post", "pinned")}</span>}
          <KategorieBadge cat={post.category} />
        </div>

        <Link href={`/posts/${post.id}`} style={{ textDecoration: "none" }}>
          <h2
            style={{ margin: "0 0 .375rem", fontSize: "1rem", fontWeight: 600, color: "var(--text-main)", lineHeight: 1.4, transition: "color .15s" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#818cf8")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-main)")}
          >
            {post.title}
          </h2>
        </Link>

        <p style={{ margin: "0 0 .75rem", fontSize: ".8125rem", color: "var(--text-muted)", lineHeight: 1.5, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
          {post.content}
        </p>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: ".4rem" }}>
            <div className="avatar avatar-sm">{getInitialen(post.author.name)}</div>
            <span style={{ fontSize: ".75rem", color: "var(--text-muted)" }}>{post.author.name}</span>
          </div>
          <span style={{ fontSize: ".75rem", color: "rgba(156,163,175,.5)" }}>{formatiereDatumI18n(post.createdAt, sprache)}</span>
          <Link
            href={`/posts/${post.id}#kommentare`}
            style={{ display: "flex", alignItems: "center", gap: ".3rem", fontSize: ".75rem", color: "rgba(156,163,175,.5)", textDecoration: "none", transition: "color .15s" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(156,163,175,.5)")}
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            {kommentarText}
          </Link>
        </div>
      </div>
    </div>
  );
}