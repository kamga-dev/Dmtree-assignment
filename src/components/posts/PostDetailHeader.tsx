"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { formatiereDatumI18n } from "@/lib/i18n";
import { getInitialen } from "@/lib/utils";

type PostDetailHeaderProps = {
  postId: string;
  category: string;
  isPinned: boolean;
  title: string;
  content: string;
  authorName: string;
  authorId: string;
  currentUserId?: string;
  isAdmin: boolean;
  createdAt: Date;
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

export default function BeitragsDetailKopf({
  postId,
  category,
  isPinned,
  title,
  content,
  authorName,
  authorId,
  currentUserId,
  isAdmin,
  createdAt,
}: PostDetailHeaderProps) {
  const { t, sprache } = useLanguage();
  const router = useRouter();
  const [loescht, setLoescht] = useState(false);

  const kannLoeschen = currentUserId === authorId || isAdmin;

  async function handleLoeschen() {
    if (!confirm(t("post", "confirmDelete"))) return;
    setLoescht(true);
    try {
      await fetch(`/api/posts/${postId}`, { method: "DELETE" });
      router.push("/");
      router.refresh();
    } catch {
      setLoescht(false);
    }
  }

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
        <Link
          href="/"
          style={{ display: "inline-flex", alignItems: "center", gap: ".375rem", fontSize: ".875rem", color: "var(--text-muted)", textDecoration: "none", transition: "color .15s" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-main)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {t("post", "backToFeed")}
        </Link>

        {kannLoeschen && (
          <button
            onClick={handleLoeschen}
            disabled={loescht}
            className="btn-ghost-dark"
            style={{ fontSize: ".8125rem", padding: ".375rem .75rem", color: "#f87171", borderColor: "rgba(248,113,113,.3)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(248,113,113,.1)";
              e.currentTarget.style.borderColor = "rgba(248,113,113,.5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.borderColor = "rgba(248,113,113,.3)";
            }}
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            {loescht ? "…" : t("post", "delete")}
          </button>
        )}
      </div>

      <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap", marginBottom: ".75rem" }}>
        {isPinned && <span className="badge-dark badge-pinned">📌 {t("post", "pinned")}</span>}
        <KategorieBadge cat={category} />
      </div>

      <h1 style={{ margin: "0 0 1rem", fontSize: "1.375rem", fontWeight: 700, color: "var(--text-main)", lineHeight: 1.35 }}>
        {title}
      </h1>

      <p style={{ margin: "0 0 1.25rem", color: "var(--text-muted)", lineHeight: 1.7, whiteSpace: "pre-wrap", fontSize: ".9375rem" }}>
        {content}
      </p>

      <div style={{ display: "flex", alignItems: "center", gap: ".75rem", paddingTop: "1rem", borderTop: "1px solid var(--card-border)" }}>
        <div className="avatar avatar-md">{getInitialen(authorName)}</div>
        <div>
          <p style={{ margin: 0, fontSize: ".875rem", fontWeight: 600, color: "var(--text-main)" }}>{authorName}</p>
          <p style={{ margin: 0, fontSize: ".75rem", color: "var(--text-muted)" }}>{formatiereDatumI18n(createdAt, sprache)}</p>
        </div>
      </div>
    </>
  );
}