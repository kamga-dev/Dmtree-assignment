"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { formatiereDatumI18n } from "@/lib/i18n";
import { getInitialen } from "@/lib/utils";

type PostDetailHeaderProps = {
  category: string;
  isPinned: boolean;
  title: string;
  content: string;
  authorName: string;
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

export default function BeitragsDetailKopf({ category, isPinned, title, content, authorName, createdAt }: PostDetailHeaderProps) {
  const { t, sprache } = useLanguage();

  return (
    <>
      <Link
        href="/"
        style={{ display: "inline-flex", alignItems: "center", gap: ".375rem", fontSize: ".875rem", color: "var(--text-muted)", textDecoration: "none", marginBottom: "1.25rem", transition: "color .15s" }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-main)")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
      >
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        {t("post", "backToFeed")}
      </Link>

      <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap", marginBottom: ".75rem" }}>
        {isPinned && <span className="badge-dark badge-pinned">📌 {t("post", "pinned")}</span>}
        <KategorieBadge cat={category} />
      </div>

      <h1 style={{ margin: "0 0 1rem", fontSize: "1.375rem", fontWeight: 700, color: "var(--text-main)", lineHeight: 1.35 }}>
        {title}
      </h1>

      <p style={{ margin: "0 0 1.25rem", color: "rgba(241,241,241,.8)", lineHeight: 1.7, whiteSpace: "pre-wrap", fontSize: ".9375rem" }}>
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