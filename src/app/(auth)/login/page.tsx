"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function AnmeldungsSeite() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/";
  const { t } = useLanguage();

  const [formular, setFormular] = useState({ email: "", passwort: "" });
  const [fehler, setFehler] = useState("");
  const [laedt, setLaedt] = useState(false);

  async function handleAbsenden(e: React.FormEvent) {
    e.preventDefault();
    setFehler("");
    setLaedt(true);
    try {
      const antwort = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formular.email, password: formular.passwort }),
      });
      const daten = await antwort.json();
      if (!antwort.ok) { setFehler(daten.error ?? t("auth", "signIn")); return; }
      router.push(redirect);
      router.refresh();
    } catch {
      setFehler(t("auth", "errGeneric"));
    } finally {
      setLaedt(false);
    }
  }

  return (
    <div style={{ position: "relative", zIndex: 1, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
      <div style={{ width: "100%", maxWidth: 420 }} className="slide-up">

        {/* Logo + Titel */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div className="logo-icon" style={{ margin: "0 auto 1rem" }}>
            <span style={{ color: "#fff", fontSize: "1.5rem", fontWeight: 700 }}>D</span>
          </div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, margin: "0 0 .25rem", letterSpacing: "-.3px" }}>
            DMTree Community
          </h1>
          <p style={{ fontSize: ".875rem", color: "var(--text-muted)", margin: 0 }}>
            {t("auth", "signInAccount")}
          </p>
        </div>

        {/* Karte */}
        <div className="glass-card" style={{ padding: "2.25rem 2rem" }}>
          <form onSubmit={handleAbsenden} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

            {fehler && <div className="alert-error">{fehler}</div>}

            {/* E-Mail */}
            <div>
              <label className="form-label-dark">{t("auth", "email")}</label>
              <div className="input-group-dark">
                <span className="input-icon">
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </span>
                <input
                  type="email"
                  className="input-dark-inner"
                  placeholder="du@beispiel.de"
                  value={formular.email}
                  onChange={(e) => setFormular({ ...formular, email: e.target.value })}
                  required
                  autoFocus
                />
              </div>
            </div>

            {/* Passwort */}
            <div>
              <label className="form-label-dark">{t("auth", "password")}</label>
              <div className="input-group-dark">
                <span className="input-icon">
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                <input
                  type="password"
                  className="input-dark-inner"
                  placeholder="••••••••"
                  value={formular.passwort}
                  onChange={(e) => setFormular({ ...formular, passwort: e.target.value })}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn-primary-dark" disabled={laedt} style={{ marginTop: ".25rem" }}>
              {laedt ? (
                <>
                  <svg style={{ animation: "spin 1s linear infinite" }} width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  {t("auth", "signingIn")}
                </>
              ) : t("auth", "signIn")}
            </button>
          </form>

          <hr className="divider" style={{ margin: "1.5rem 0" }} />

          <p style={{ textAlign: "center", fontSize: ".875rem", color: "var(--text-muted)", margin: "0 0 1.25rem" }}>
            {t("auth", "noAccount")}{" "}
            <Link href="/register" style={{ color: "var(--primary-light)", fontWeight: 600, textDecoration: "none" }}>
              {t("auth", "registerNow")}
            </Link>
          </p>

          {/* Demo-Hinweis */}
          <div style={{ background: "rgba(255,255,255,.04)", border: "1px solid var(--card-border)", borderRadius: ".625rem", padding: ".75rem 1rem" }}>
            <p style={{ fontSize: ".75rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: ".375rem" }}>
              {t("auth", "demoAccounts")}
            </p>
            <p style={{ fontSize: ".75rem", color: "rgba(156,163,175,.7)", margin: ".1rem 0" }}>admin@dmtree.io / admin123</p>
            <p style={{ fontSize: ".75rem", color: "rgba(156,163,175,.7)", margin: ".1rem 0" }}>alice@dmtree.io / demo123</p>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}