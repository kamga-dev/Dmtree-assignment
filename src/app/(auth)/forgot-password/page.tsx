"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

export default function ForgotPasswordPage() {
  const { t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [email, setEmail] = useState("");
  const [laedt, setLaedt] = useState(false);
  const [gesendet, setGesendet] = useState(false);

  async function handleAbsenden(e: React.FormEvent) {
    e.preventDefault();
    setLaedt(true);
    await new Promise((r) => setTimeout(r, 800));
    setGesendet(true);
    setLaedt(false);
  }

  return (
    <div style={{ position: "relative", zIndex: 1, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>

      {/* Theme toggle */}
      <div style={{ position: "fixed", top: "1rem", right: "1rem", zIndex: 50 }}>
        <button
          onClick={toggleTheme}
          className="btn-icon-dark"
          title={theme === "dark" ? "Light mode" : "Dark mode"}
          style={{ border: "1px solid var(--card-border)", background: "var(--card-bg)", backdropFilter: "blur(12px)", width: 36, height: 36 }}
        >
          {theme === "dark" ? (
            <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="5" strokeWidth={2} strokeLinecap="round" />
              <path strokeLinecap="round" strokeWidth={2} d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            </svg>
          ) : (
            <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>
      </div>

      <div style={{ width: "100%", maxWidth: 420 }} className="slide-up">

        {/* Logo + Titre */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div className="logo-icon" style={{ margin: "0 auto 1rem" }}>
            <span style={{ color: "#fff", fontSize: "1.5rem", fontWeight: 700 }}>D</span>
          </div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, margin: "0 0 .25rem", letterSpacing: "-.3px" }}>
            {t("auth", "forgotPassword")}
          </h1>
          <p style={{ fontSize: ".875rem", color: "var(--text-muted)", margin: 0 }}>
            {t("auth", "forgotPasswordDesc")}
          </p>
        </div>

        <div className="glass-card" style={{ padding: "2.25rem 2rem" }}>
          {gesendet ? (
            <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
              <div style={{
                width: 56, height: 56, borderRadius: "50%",
                background: "rgba(129,140,248,.15)", border: "1px solid rgba(129,140,248,.3)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="24" height="24" fill="none" stroke="var(--primary-light)" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <p style={{ margin: 0, fontSize: ".9375rem", fontWeight: 600, color: "var(--text-main)" }}>
                {t("auth", "checkYourEmail")}
              </p>
              <p style={{ margin: 0, fontSize: ".8125rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
                {t("auth", "resetLinkSent")} <strong style={{ color: "var(--text-main)" }}>{email}</strong>
              </p>
            </div>
          ) : (
            <form onSubmit={handleAbsenden} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoFocus
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary-dark" disabled={laedt} style={{ marginTop: ".25rem" }}>
                {laedt ? (
                  <>
                    <svg style={{ animation: "spin 1s linear infinite" }} width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    {t("auth", "sendingLink")}
                  </>
                ) : t("auth", "sendResetLink")}
              </button>
            </form>
          )}

          <hr className="divider" style={{ margin: "1.5rem 0" }} />

          <p style={{ textAlign: "center", fontSize: ".875rem", color: "var(--text-muted)", margin: 0 }}>
            <Link href="/login" style={{ color: "var(--primary-light)", fontWeight: 600, textDecoration: "none" }}>
              ← {t("auth", "backToLogin")}
            </Link>
          </p>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}