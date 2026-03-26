"use client";

import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { SPRACHEN, Sprache } from "@/lib/i18n";

export default function SprachUmschalter() {
  const { sprache, setSprache } = useLanguage();
  const [offen, setOffen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const aktuell = SPRACHEN.find((s) => s.code === sprache) ?? SPRACHEN[0];

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOffen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOffen((v) => !v)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: ".375rem",
          width: "100%",
          padding: ".5rem .75rem",
          background: offen ? "rgba(129,140,248,.1)" : "rgba(255,255,255,.04)",
          border: `1px solid ${offen ? "rgba(129,140,248,.3)" : "var(--card-border)"}`,
          borderRadius: ".5rem",
          cursor: "pointer",
          transition: "all .15s",
          color: "var(--text-muted)",
          fontSize: ".75rem",
          fontWeight: 500,
        }}
        onMouseEnter={(e) => {
          if (!offen) {
            e.currentTarget.style.background = "rgba(255,255,255,.07)";
            e.currentTarget.style.borderColor = "rgba(255,255,255,.15)";
          }
        }}
        onMouseLeave={(e) => {
          if (!offen) {
            e.currentTarget.style.background = "rgba(255,255,255,.04)";
            e.currentTarget.style.borderColor = "var(--card-border)";
          }
        }}
      >
        <span style={{ fontSize: ".875rem" }}>{aktuell.flag}</span>
        <span style={{ flex: 1, textAlign: "left" }}>{aktuell.label}</span>
        <svg
          width="12"
          height="12"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          style={{ transform: offen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform .15s" }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {offen && (
        <div
          style={{
            position: "absolute",
            bottom: "calc(100% + .375rem)",
            left: 0,
            right: 0,
            background: "rgba(20,17,51,.95)",
            border: "1px solid var(--card-border)",
            borderRadius: ".625rem",
            backdropFilter: "blur(16px)",
            overflow: "hidden",
            zIndex: 100,
            boxShadow: "0 8px 32px rgba(0,0,0,.5)",
          }}
        >
          {SPRACHEN.map((s) => {
            const aktiv = s.code === sprache;
            return (
              <button
                key={s.code}
                onClick={() => {
                  setSprache(s.code as Sprache);
                  setOffen(false);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: ".5rem",
                  width: "100%",
                  padding: ".5rem .75rem",
                  background: aktiv ? "rgba(129,140,248,.12)" : "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: aktiv ? "var(--primary-light)" : "var(--text-muted)",
                  fontSize: ".8125rem",
                  textAlign: "left",
                  transition: "background .1s",
                }}
                onMouseEnter={(e) => {
                  if (!aktiv) e.currentTarget.style.background = "rgba(255,255,255,.06)";
                }}
                onMouseLeave={(e) => {
                  if (!aktiv) e.currentTarget.style.background = "transparent";
                }}
              >
                <span style={{ fontSize: ".875rem" }}>{s.flag}</span>
                <span>{s.label}</span>
                {aktiv && (
                  <svg width="12" height="12" fill="currentColor" viewBox="0 0 20 20" style={{ marginLeft: "auto" }}>
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}