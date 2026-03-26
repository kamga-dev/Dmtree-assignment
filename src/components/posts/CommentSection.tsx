"use client";

import { useState } from "react";
import { formatiereDatumI18n } from "@/lib/i18n";
import { getInitialen } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

type Kommentar = {
  id: string;
  content: string;
  createdAt: Date;
  author: { id: string; name: string };
};

export default function KommentarBereich({ postId, initialComments, currentUser }: {
  postId: string;
  initialComments: Kommentar[];
  currentUser: { id: string; name: string } | null;
}) {
  const { t, sprache } = useLanguage();
  const [kommentare, setKommentare] = useState(initialComments);
  const [inhalt, setInhalt] = useState("");
  const [laedt, setLaedt] = useState(false);
  const [fehler, setFehler] = useState("");

  async function handleAbsenden(e: React.FormEvent) {
    e.preventDefault();
    if (!inhalt.trim() || !currentUser) return;
    setLaedt(true);
    setFehler("");
    try {
      const antwort = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: inhalt.trim() }),
      });
      if (!antwort.ok) { setFehler(t("comments", "submitting")); return; }
      const neu = await antwort.json();
      setKommentare((prev) => [...prev, { ...neu, createdAt: new Date(neu.createdAt), author: currentUser }]);
      setInhalt("");
    } catch {
      setFehler(t("auth", "errGeneric"));
    } finally {
      setLaedt(false);
    }
  }

  const kommentarZahl = kommentare.length === 1
    ? `1 ${t("post", "comment")}`
    : `${kommentare.length} ${t("post", "comments")}`;

  return (
    <div id="kommentare">
      <h2 style={{ fontSize: ".9375rem", fontWeight: 600, color: "var(--text-main)", marginBottom: "1rem" }}>
        {kommentarZahl}
      </h2>

      {/* Formular */}
      {currentUser ? (
        <div className="glass-card" style={{ padding: "1rem", marginBottom: "1rem" }}>
          <div style={{ display: "flex", gap: ".75rem" }}>
            <div className="avatar avatar-md">{getInitialen(currentUser.name)}</div>
            <form onSubmit={handleAbsenden} style={{ flex: 1 }}>
              <textarea
                value={inhalt}
                onChange={(e) => setInhalt(e.target.value)}
                placeholder={t("comments", "placeholder")}
                className="input-dark"
                rows={3}
                style={{ resize: "none" }}
              />
              {fehler && <p style={{ fontSize: ".75rem", color: "#f87171", marginTop: ".25rem" }}>{fehler}</p>}
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: ".5rem" }}>
                <button type="submit" className="btn-primary-dark" disabled={laedt || !inhalt.trim()} style={{ width: "auto" }}>
                  {laedt ? t("comments", "submitting") : t("comments", "submit")}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="glass-card" style={{ padding: "1rem", marginBottom: "1rem", textAlign: "center", fontSize: ".875rem", color: "var(--text-muted)" }}>
          <a href="/login" style={{ color: "var(--primary-light)", textDecoration: "none" }}>{t("comments", "signInTo")}</a>{" "}
          {t("comments", "toComment")}
        </div>
      )}

      {/* Liste */}
      <div style={{ display: "flex", flexDirection: "column", gap: ".625rem" }}>
        {kommentare.length === 0 && (
          <p style={{ textAlign: "center", fontSize: ".875rem", color: "rgba(156,163,175,.5)", padding: "2rem 0" }}>
            {t("comments", "empty")}
          </p>
        )}
        {kommentare.map((k) => (
          <div key={k.id} className="glass-card" style={{ padding: ".875rem 1rem" }}>
            <div style={{ display: "flex", gap: ".75rem" }}>
              <div className="avatar avatar-sm" style={{ marginTop: ".125rem" }}>{getInitialen(k.author.name)}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: ".625rem", marginBottom: ".375rem" }}>
                  <span style={{ fontSize: ".8125rem", fontWeight: 600, color: "var(--text-main)" }}>{k.author.name}</span>
                  <span style={{ fontSize: ".6875rem", color: "rgba(156,163,175,.5)" }}>{formatiereDatumI18n(k.createdAt, sprache)}</span>
                </div>
                <p style={{ margin: 0, fontSize: ".875rem", color: "var(--text-muted)", whiteSpace: "pre-wrap", lineHeight: 1.6 }}>{k.content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}