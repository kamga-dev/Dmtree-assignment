"use client";

import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

export default function Seitennavigation({ currentPage, totalPages, category, sort, q }: {
  currentPage: number;
  totalPages: number;
  category?: string;
  sort?: string;
  q?: string;
}) {
  const router = useRouter();
  const { t } = useLanguage();

  function buildUrl(page: number) {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (sort && sort !== "hot") params.set("sort", sort);
    if (q) params.set("q", q);
    if (page > 1) params.set("page", String(page));
    const qs = params.toString();
    return qs ? `/?${qs}` : "/";
  }

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: ".75rem", marginTop: "1.25rem" }}>
      <button
        onClick={() => router.push(buildUrl(currentPage - 1))}
        disabled={currentPage <= 1}
        className="btn-ghost-dark"
        style={{ fontSize: ".8125rem", padding: ".375rem .875rem", opacity: currentPage <= 1 ? 0.4 : 1 }}
      >
        ← {t("feed", "prevPage")}
      </button>

      <span style={{ fontSize: ".8125rem", color: "var(--text-muted)" }}>
        {currentPage} {t("feed", "pageOf")} {totalPages}
      </span>

      <button
        onClick={() => router.push(buildUrl(currentPage + 1))}
        disabled={currentPage >= totalPages}
        className="btn-ghost-dark"
        style={{ fontSize: ".8125rem", padding: ".375rem .875rem", opacity: currentPage >= totalPages ? 0.4 : 1 }}
      >
        {t("feed", "nextPage")} →
      </button>
    </div>
  );
}