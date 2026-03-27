"use client";

import { useRouter, usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { useState } from "react";

export default function KategorieFilter({ currentCategory, currentSort, currentSearch }: {
  currentCategory?: string;
  currentSort?: string;
  currentSearch?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useLanguage();
  const [suche, setSuche] = useState(currentSearch ?? "");

  const KATEGORIEN = [
    { wert: "",        label: t("cat", "all")     },
    { wert: "NEWS",    label: t("cat", "news")    },
    { wert: "IDEAS",   label: t("cat", "ideas")   },
    { wert: "GENERAL", label: t("cat", "general") },
  ];

  const SORTIERUNGEN = [
    { wert: "hot", label: t("sort", "hot") },
    { wert: "neu", label: t("sort", "new") },
    { wert: "top", label: t("sort", "top") },
  ];

  function buildParams(kategorie?: string, sortierung?: string, q?: string) {
    const params = new URLSearchParams();
    if (kategorie) params.set("category", kategorie);
    if (sortierung && sortierung !== "hot") params.set("sort", sortierung);
    if (q?.trim()) params.set("q", q.trim());
    return params.toString();
  }

  function navigiere(kategorie?: string, sortierung?: string) {
    const qs = buildParams(kategorie, sortierung, suche);
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  function handleSuche(e: React.FormEvent) {
    e.preventDefault();
    const qs = buildParams(currentCategory, currentSort, suche);
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  function handleClear() {
    setSuche("");
    const qs = buildParams(currentCategory, currentSort, "");
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: ".625rem", marginBottom: "1rem" }}>
      {/* Search bar */}
      <form onSubmit={handleSuche} style={{ position: "relative" }}>
        <span style={{ position: "absolute", left: ".75rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }}>
          <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
          </svg>
        </span>
        <input
          type="text"
          value={suche}
          onChange={(e) => setSuche(e.target.value)}
          placeholder={t("feed", "search")}
          className="input-dark"
          style={{ paddingLeft: "2.25rem", paddingRight: suche ? "2.25rem" : ".75rem" }}
        />
        {suche && (
          <button type="button" onClick={handleClear} style={{ position: "absolute", right: ".625rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 2, display: "flex" }}>
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </form>

      {/* Category + Sort */}
      <div style={{ display: "flex", alignItems: "center", gap: ".75rem", flexWrap: "wrap" }}>
        <div className="tab-bar">
          {KATEGORIEN.map((kat) => (
            <button
              key={kat.wert}
              onClick={() => navigiere(kat.wert || undefined, currentSort)}
              className={`tab-btn${(currentCategory ?? "") === kat.wert ? " active" : ""}`}
            >
              {kat.label}
            </button>
          ))}
        </div>
        <div style={{ flex: 1 }} />
        <div className="tab-bar">
          {SORTIERUNGEN.map((s) => (
            <button
              key={s.wert}
              onClick={() => navigiere(currentCategory, s.wert)}
              className={`tab-btn${(currentSort ?? "hot") === s.wert ? " active" : ""}`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}