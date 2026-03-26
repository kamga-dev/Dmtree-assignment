"use client";

import { useRouter, usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

export default function KategorieFilter({ currentCategory, currentSort }: { currentCategory?: string; currentSort?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useLanguage();

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

  function navigiere(kategorie?: string, sortierung?: string) {
    const params = new URLSearchParams();
    if (kategorie) params.set("category", kategorie);
    if (sortierung && sortierung !== "hot") params.set("sort", sortierung);
    const q = params.toString();
    router.push(q ? `${pathname}?${q}` : pathname);
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: ".75rem", flexWrap: "wrap", marginBottom: "1rem" }}>
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
  );
}