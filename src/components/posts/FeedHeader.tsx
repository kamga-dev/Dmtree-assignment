"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function FeedKopfzeile({ count, searchQuery }: { count: number; searchQuery?: string }) {
  const { t } = useLanguage();
  const anzeigeText = searchQuery
    ? `${count} ${count === 1 ? t("feed", "post") : t("feed", "posts")} — "${searchQuery}"`
    : count === 1 ? `1 ${t("feed", "post")}` : `${count} ${t("feed", "posts")}`;

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
      <div>
        <h1 style={{ margin: "0 0 .2rem", fontSize: "1.125rem", fontWeight: 700, color: "var(--text-main)" }}>{t("feed", "title")}</h1>
        <p style={{ margin: 0, fontSize: ".8125rem", color: "var(--text-muted)" }}>{anzeigeText}</p>
      </div>
      <Link href="/posts/new" className="btn-primary-dark" style={{ width: "auto", textDecoration: "none", fontSize: ".875rem", padding: ".55rem 1rem" }}>
        <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        {t("nav", "newPost")}
      </Link>
    </div>
  );
}