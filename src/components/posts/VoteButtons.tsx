"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function AbstimmungsSchaltflächen({ postId, initialScore, initialUserVote, currentUserId }: {
  postId: string;
  initialScore: number;
  initialUserVote: number;
  currentUserId?: string;
}) {
  const { t } = useLanguage();
  const [punktzahl, setPunktzahl] = useState(initialScore);
  const [stimme, setStimme] = useState(initialUserVote);
  const [laedt, setLaedt] = useState(false);

  async function abstimmen(wert: 1 | -1) {
    if (!currentUserId || laedt) return;
    setLaedt(true);
    const neu = stimme === wert ? 0 : wert;
    setPunktzahl((p) => p + (neu - stimme));
    setStimme(neu);
    try {
      await fetch(`/api/posts/${postId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: neu === 0 ? wert : neu }),
      });
    } catch {
      setPunktzahl(initialScore);
      setStimme(initialUserVote);
    } finally {
      setLaedt(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: ".5rem", flexShrink: 0 }}>

      {/* Daumen hoch */}
      <button
        onClick={() => abstimmen(1)}
        disabled={!currentUserId}
        title={t("post", "likeTitle")}
        style={{
          background: stimme === 1 ? "rgba(79,70,229,.25)" : "rgba(255,255,255,.05)",
          border: `1px solid ${stimme === 1 ? "rgba(129,140,248,.5)" : "var(--card-border)"}`,
          borderRadius: ".625rem",
          padding: ".5rem .625rem",
          cursor: currentUserId ? "pointer" : "default",
          transition: "all .18s",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: stimme === 1 ? "#818cf8" : "rgba(156,163,175,.5)",
          transform: stimme === 1 ? "scale(1.12)" : "scale(1)",
        }}
        onMouseEnter={(e) => {
          if (currentUserId && stimme !== 1) {
            e.currentTarget.style.background = "rgba(79,70,229,.12)";
            e.currentTarget.style.borderColor = "rgba(129,140,248,.3)";
            e.currentTarget.style.color = "#818cf8";
          }
        }}
        onMouseLeave={(e) => {
          if (stimme !== 1) {
            e.currentTarget.style.background = "rgba(255,255,255,.05)";
            e.currentTarget.style.borderColor = "var(--card-border)";
            e.currentTarget.style.color = "rgba(156,163,175,.5)";
          }
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill={stimme === 1 ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14z" />
          <path d="M7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3" />
        </svg>
      </button>

      {/* Punktzahl */}
      <span style={{
        fontSize: "1rem",
        fontWeight: 700,
        color: punktzahl > 0 ? "#818cf8" : punktzahl < 0 ? "#f87171" : "var(--text-muted)",
        minWidth: "2rem",
        textAlign: "center",
        transition: "color .2s",
      }}>
        {punktzahl > 0 ? `+${punktzahl}` : punktzahl}
      </span>

      {/* Daumen runter */}
      <button
        onClick={() => abstimmen(-1)}
        disabled={!currentUserId}
        title={t("post", "dislikeTitle")}
        style={{
          background: stimme === -1 ? "rgba(248,113,113,.2)" : "rgba(255,255,255,.05)",
          border: `1px solid ${stimme === -1 ? "rgba(248,113,113,.5)" : "var(--card-border)"}`,
          borderRadius: ".625rem",
          padding: ".5rem .625rem",
          cursor: currentUserId ? "pointer" : "default",
          transition: "all .18s",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: stimme === -1 ? "#f87171" : "rgba(156,163,175,.5)",
          transform: stimme === -1 ? "scale(1.12)" : "scale(1)",
        }}
        onMouseEnter={(e) => {
          if (currentUserId && stimme !== -1) {
            e.currentTarget.style.background = "rgba(248,113,113,.1)";
            e.currentTarget.style.borderColor = "rgba(248,113,113,.3)";
            e.currentTarget.style.color = "#f87171";
          }
        }}
        onMouseLeave={(e) => {
          if (stimme !== -1) {
            e.currentTarget.style.background = "rgba(255,255,255,.05)";
            e.currentTarget.style.borderColor = "var(--card-border)";
            e.currentTarget.style.color = "rgba(156,163,175,.5)";
          }
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill={stimme === -1 ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 15v4a3 3 0 003 3l4-9V2H5.72a2 2 0 00-2 1.7l-1.38 9a2 2 0 002 2.3H10z" />
          <path d="M17 2h2.67A2.31 2.31 0 0122 4v7a2.31 2.31 0 01-2.33 2H17" />
        </svg>
      </button>

    </div>
  );
}