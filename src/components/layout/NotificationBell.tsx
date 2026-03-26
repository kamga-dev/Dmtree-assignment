"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { formatiereDatumI18n } from "@/lib/i18n";

type Notif = {
  id: string;
  type: string;
  message: string;
  actorName: string;
  relatedId: string;
  isRead: boolean;
  createdAt: string;
};

export default function BenachrichtigungsGlocke() {
  const { t, sprache } = useLanguage();
  const router = useRouter();
  const [notifs, setNotifs] = useState<Notif[]>([]);
  const [offen, setOffen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const ungelesen = notifs.filter((n) => !n.isRead).length;

  async function laden() {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) setNotifs(await res.json());
    } catch { /* ignorieren */ }
  }

  useEffect(() => {
    laden();
    const iv = setInterval(laden, 15000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOffen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function alleAlsGelesenMarkieren() {
    await fetch("/api/notifications", { method: "PATCH" });
    setNotifs((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }

  async function oeffneNotif(notif: Notif) {
    setOffen(false);
    if (!notif.isRead) {
      await fetch(`/api/notifications/${notif.id}/read`, { method: "PATCH" });
      setNotifs((prev) => prev.map((n) => n.id === notif.id ? { ...n, isRead: true } : n));
    }
    router.push(`/posts/${notif.relatedId}`);
  }

  function buildMessage(n: Notif): string {
    if (n.type === "comment") return `${n.actorName} ${t("notif", "commented")}`;
    if (n.type === "upvote_post") return `${n.actorName} ${t("notif", "upvoted")}`;
    return n.message;
  }

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOffen((v) => !v)}
        className="btn-icon-dark"
        title={t("notif", "title")}
        style={{ position: "relative" }}
      >
        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {ungelesen > 0 && (
          <span style={{
            position: "absolute", top: 1, right: 1,
            background: "#f87171", color: "#fff",
            borderRadius: "999px", fontSize: ".6rem", fontWeight: 700,
            minWidth: 14, height: 14, display: "flex", alignItems: "center", justifyContent: "center",
            padding: "0 3px", lineHeight: 1,
          }}>
            {ungelesen > 9 ? "9+" : ungelesen}
          </span>
        )}
      </button>

      {offen && (
        <div style={{
          position: "fixed",
          bottom: "4.5rem",
          left: "1rem",
          width: 280,
          background: "rgba(20,17,51,.97)",
          border: "1px solid var(--card-border)",
          borderRadius: ".75rem",
          backdropFilter: "blur(16px)",
          boxShadow: "0 8px 32px rgba(0,0,0,.6)",
          zIndex: 200,
          overflow: "hidden",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: ".75rem 1rem", borderBottom: "1px solid var(--card-border)" }}>
            <span style={{ fontSize: ".8125rem", fontWeight: 600, color: "var(--text-main)" }}>
              {t("notif", "title")}
              {ungelesen > 0 && (
                <span style={{ marginLeft: ".375rem", background: "#f87171", color: "#fff", borderRadius: "999px", fontSize: ".6rem", fontWeight: 700, padding: "1px 5px" }}>
                  {ungelesen}
                </span>
              )}
            </span>
            {ungelesen > 0 && (
              <button
                onClick={alleAlsGelesenMarkieren}
                style={{ fontSize: ".6875rem", color: "var(--primary-light)", background: "none", border: "none", cursor: "pointer", padding: 0 }}
              >
                {t("notif", "markRead")}
              </button>
            )}
          </div>

          <div style={{ maxHeight: 320, overflowY: "auto" }}>
            {notifs.length === 0 ? (
              <p style={{ textAlign: "center", fontSize: ".8125rem", color: "rgba(156,163,175,.5)", padding: "1.5rem 1rem", margin: 0 }}>
                {t("notif", "empty")}
              </p>
            ) : (
              notifs.map((n) => (
                <button
                  key={n.id}
                  onClick={() => oeffneNotif(n)}
                  style={{
                    display: "flex", alignItems: "flex-start", gap: ".5rem",
                    width: "100%", textAlign: "left",
                    padding: ".75rem 1rem",
                    background: n.isRead ? "transparent" : "rgba(129,140,248,.07)",
                    borderBottom: "1px solid var(--card-border)",
                    border: "none", cursor: "pointer",
                    transition: "background .15s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,.05)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = n.isRead ? "transparent" : "rgba(129,140,248,.07)"; }}
                >
                  {!n.isRead && (
                    <span style={{ marginTop: ".35rem", flexShrink: 0, width: 6, height: 6, borderRadius: "50%", background: "var(--primary-light)", display: "block" }} />
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: "0 0 .2rem", fontSize: ".8125rem", color: "var(--text-main)", lineHeight: 1.4 }}>
                      {buildMessage(n)}
                    </p>
                    <p style={{ margin: ".2rem 0 0", fontSize: ".6875rem", color: "rgba(156,163,175,.35)" }}>
                      {formatiereDatumI18n(n.createdAt, sprache)}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}