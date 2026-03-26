"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function NeuerBeitragSeite() {
  const router = useRouter();
  const { t } = useLanguage();
  const [formular, setFormular] = useState({ title: "", content: "", category: "GENERAL" });
  const [fehler, setFehler] = useState("");
  const [laedt, setLaedt] = useState(false);

  const KATEGORIEN = [
    { wert: "NEWS",    label: t("cat", "newsBadge"),   beschreibung: t("newPost", "newsDesc"),    farbe: "rgba(59,130,246,.15)",   rand: "rgba(59,130,246,.4)",   text: "#93c5fd" },
    { wert: "IDEAS",   label: t("cat", "ideaBadge"),   beschreibung: t("newPost", "ideasDesc"),   farbe: "rgba(139,92,246,.15)",   rand: "rgba(139,92,246,.4)",   text: "#c4b5fd" },
    { wert: "GENERAL", label: t("cat", "generalBadge"),beschreibung: t("newPost", "generalDesc"), farbe: "rgba(255,255,255,.06)",  rand: "rgba(255,255,255,.15)", text: "var(--text-muted)" },
  ];

  async function handleAbsenden(e: React.FormEvent) {
    e.preventDefault();
    setFehler("");
    if (!formular.title.trim() || !formular.content.trim()) { setFehler(t("newPost", "errRequired")); return; }
    setLaedt(true);
    try {
      const antwort = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formular),
      });
      const daten = await antwort.json();
      if (!antwort.ok) { setFehler(daten.error ?? t("auth", "errGeneric")); return; }
      router.push(`/posts/${daten.id}`);
    } catch {
      setFehler(t("auth", "errGeneric"));
    } finally {
      setLaedt(false);
    }
  }

  return (
    <div style={{ maxWidth: 640, margin: "0 auto" }}>
      {/* Kopfzeile */}
      <div style={{ display: "flex", alignItems: "center", gap: ".75rem", marginBottom: "1.5rem" }}>
        <Link href="/" className="btn-icon-dark">
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 style={{ margin: 0, fontSize: "1.125rem", fontWeight: 700, color: "var(--text-main)" }}>
          {t("newPost", "title")}
        </h1>
      </div>

      <div className="glass-card" style={{ padding: "1.75rem" }}>
        <form onSubmit={handleAbsenden} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {fehler && <div className="alert-error">{fehler}</div>}

          {/* Kategorie */}
          <div>
            <label className="form-label-dark">{t("newPost", "category")}</label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: ".625rem" }}>
              {KATEGORIEN.map((kat) => {
                const aktiv = formular.category === kat.wert;
                return (
                  <button
                    key={kat.wert}
                    type="button"
                    onClick={() => setFormular({ ...formular, category: kat.wert })}
                    style={{
                      padding: ".75rem",
                      borderRadius: ".625rem",
                      border: `1px solid ${aktiv ? kat.rand : "var(--card-border)"}`,
                      background: aktiv ? kat.farbe : "rgba(255,255,255,.03)",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all .15s",
                    }}
                  >
                    <p style={{ margin: "0 0 .15rem", fontWeight: 600, fontSize: ".8125rem", color: aktiv ? kat.text : "var(--text-main)" }}>
                      {kat.label}
                    </p>
                    <p style={{ margin: 0, fontSize: ".6875rem", color: "var(--text-muted)" }}>{kat.beschreibung}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Titel */}
          <div>
            <label className="form-label-dark">{t("newPost", "postTitle")}</label>
            <input
              type="text"
              className="input-dark"
              placeholder={t("newPost", "titlePlaceholder")}
              value={formular.title}
              onChange={(e) => setFormular({ ...formular, title: e.target.value })}
              maxLength={200}
              required
              autoFocus
            />
            <p style={{ margin: ".25rem 0 0", fontSize: ".6875rem", color: "rgba(156,163,175,.4)", textAlign: "right" }}>
              {formular.title.length}/200
            </p>
          </div>

          {/* Inhalt */}
          <div>
            <label className="form-label-dark">{t("newPost", "content")}</label>
            <textarea
              className="input-dark"
              placeholder={t("newPost", "contentPlaceholder")}
              value={formular.content}
              onChange={(e) => setFormular({ ...formular, content: e.target.value })}
              rows={8}
              required
              style={{ resize: "none" }}
            />
          </div>

          <div style={{ display: "flex", gap: ".625rem", justifyContent: "flex-end" }}>
            <Link href="/" className="btn-ghost-dark" style={{ textDecoration: "none" }}>{t("newPost", "cancel")}</Link>
            <button type="submit" className="btn-primary-dark" disabled={laedt} style={{ width: "auto" }}>
              {laedt ? t("newPost", "publishing") : t("newPost", "publish")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}