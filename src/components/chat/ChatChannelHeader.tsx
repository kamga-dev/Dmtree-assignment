"use client";

import { useLanguage } from "@/context/LanguageContext";
import { translateKanalName } from "@/lib/i18n";

export default function ChatKanalHeader({ name, description }: { name: string; description: string | null }) {
  const { sprache } = useLanguage();

  return (
    <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
      <span style={{ color: "var(--primary-light)", fontWeight: 700, fontSize: "1.125rem" }}>#</span>
      <div>
        <h2 style={{ margin: 0, fontWeight: 700, fontSize: ".9375rem", color: "var(--text-main)" }}>
          {translateKanalName(name, sprache)}
        </h2>
        {description && (
          <p style={{ margin: 0, fontSize: ".75rem", color: "var(--text-muted)" }}>{description}</p>
        )}
      </div>
    </div>
  );
}