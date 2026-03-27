"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { formatiereDatumI18n } from "@/lib/i18n";
import { getInitialen } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

type Nachricht = {
  id: string;
  content: string;
  createdAt: Date;
  author: { id: string; name: string };
};

export default function ChatFenster({ channelId, initialMessages, currentUser }: {
  channelId: string;
  initialMessages: Nachricht[];
  currentUser: { id: string; name: string } | null;
}) {
  const { t, sprache } = useLanguage();
  const [nachrichten, setNachrichten] = useState(initialMessages);

  // Derive online users: anyone who sent a message in the last 10 minutes
  const onlineNutzer = Array.from(
    new Map(
      nachrichten
        .filter((n) => Date.now() - new Date(n.createdAt).getTime() < 10 * 60 * 1000)
        .map((n) => [n.author.id, n.author.name])
    ).entries()
  ).map(([, name]) => name);
  const [eingabe, setEingabe] = useState("");
  const [laedt, setLaedt] = useState(false);
  const untenRef = useRef<HTMLDivElement>(null);
  const letzteId = useRef(initialMessages[initialMessages.length - 1]?.id ?? "");

  useEffect(() => {
    untenRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [nachrichten]);

  const abrufen = useCallback(async () => {
    try {
      const res = await fetch(`/api/channels/${channelId}/messages?after=${letzteId.current}`);
      if (!res.ok) return;
      const neu: Nachricht[] = await res.json();
      if (neu.length > 0) {
        setNachrichten((p) => [...p, ...neu.map((n) => ({ ...n, createdAt: new Date(n.createdAt) }))]);
        letzteId.current = neu[neu.length - 1].id;
      }
    } catch { /* ignorieren */ }
  }, [channelId]);

  useEffect(() => {
    const iv = setInterval(abrufen, 3000);
    return () => clearInterval(iv);
  }, [abrufen]);

  async function senden(e: React.FormEvent) {
    e.preventDefault();
    if (!eingabe.trim() || !currentUser || laedt) return;
    setLaedt(true);
    const inhalt = eingabe.trim();
    setEingabe("");
    const tempId = `temp-${Date.now()}`;
    setNachrichten((p) => [...p, { id: tempId, content: inhalt, createdAt: new Date(), author: currentUser }]);

    try {
      const res = await fetch(`/api/channels/${channelId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: inhalt }),
      });
      if (res.ok) {
        const gespeichert: Nachricht = await res.json();
        setNachrichten((p) => p.map((n) => n.id === tempId ? { ...gespeichert, createdAt: new Date(gespeichert.createdAt) } : n));
        letzteId.current = gespeichert.id;
      } else {
        setNachrichten((p) => p.filter((n) => n.id !== tempId));
        setEingabe(inhalt);
      }
    } catch {
      setNachrichten((p) => p.filter((n) => n.id !== tempId));
      setEingabe(inhalt);
    } finally {
      setLaedt(false);
    }
  }

  const gruppiert = nachrichten.reduce<{ n: Nachricht; kopf: boolean }[]>((acc, n, i) => {
    const prev = nachrichten[i - 1];
    const kopf = !prev || prev.author.id !== n.author.id ||
      new Date(n.createdAt).getTime() - new Date(prev.createdAt).getTime() > 5 * 60 * 1000;
    acc.push({ n, kopf });
    return acc;
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
      {/* Online indicator */}
      {onlineNutzer.length > 0 && (
        <div style={{ padding: ".375rem 1.25rem", borderBottom: "1px solid var(--card-border)", display: "flex", alignItems: "center", gap: ".5rem", flexShrink: 0 }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#4ade80", flexShrink: 0, display: "inline-block" }} />
          <span style={{ fontSize: ".6875rem", color: "var(--text-muted)" }}>
            {t("chat", "online")}: {onlineNutzer.join(", ")}
          </span>
        </div>
      )}
      {/* Nachrichten */}
      <div style={{ flex: 1, overflowY: "auto", padding: "1rem 1.25rem" }}>
        {nachrichten.length === 0 && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
            <p style={{ color: "rgba(156,163,175,.4)", fontSize: ".875rem" }}>{t("chat", "empty")}</p>
          </div>
        )}

        {gruppiert.map(({ n, kopf }) => (
          <div key={n.id} style={{ paddingTop: kopf ? ".875rem" : ".125rem" }}>
            {kopf && (
              <div style={{ display: "flex", alignItems: "center", gap: ".625rem", marginBottom: ".25rem" }}>
                <div className="avatar avatar-md">{getInitialen(n.author.name)}</div>
                <span style={{ fontWeight: 600, fontSize: ".875rem", color: "var(--text-main)" }}>{n.author.name}</span>
                <span style={{ fontSize: ".6875rem", color: "rgba(156,163,175,.4)" }}>{formatiereDatumI18n(n.createdAt, sprache)}</span>
              </div>
            )}
            <div style={{ paddingLeft: kopf ? 0 : "2.625rem" }}>
              <p style={{ margin: 0, fontSize: ".875rem", color: n.id.startsWith("temp-") ? "rgba(241,241,241,.4)" : "rgba(241,241,241,.85)", lineHeight: 1.6 }}>
                {n.content}
              </p>
            </div>
          </div>
        ))}
        <div ref={untenRef} />
      </div>

      {/* Eingabe */}
      <div style={{ padding: ".875rem 1.25rem", borderTop: "1px solid var(--card-border)", background: "rgba(15,12,41,.4)", backdropFilter: "blur(10px)", flexShrink: 0 }}>
        {currentUser ? (
          <form onSubmit={senden} style={{ display: "flex", gap: ".5rem" }}>
            <input
              type="text"
              className="input-dark"
              placeholder={t("chat", "placeholder")}
              value={eingabe}
              onChange={(e) => setEingabe(e.target.value)}
              disabled={laedt}
              autoComplete="off"
              style={{ flex: 1 }}
            />
            <button
              type="submit"
              className="btn-primary-dark"
              disabled={laedt || !eingabe.trim()}
              style={{ width: "auto", padding: ".65rem .875rem" }}
              title={t("chat", "placeholder")}
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
        ) : (
          <p style={{ textAlign: "center", fontSize: ".875rem", color: "var(--text-muted)", margin: 0 }}>
            <a href="/login" style={{ color: "var(--primary-light)", textDecoration: "none" }}>{t("chat", "signInTo")}</a>{" "}
            {t("chat", "toSend")}
          </p>
        )}
      </div>
    </div>
  );
}