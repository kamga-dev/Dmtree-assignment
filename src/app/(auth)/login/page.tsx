"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { SPRACHEN, Sprache } from "@/lib/i18n";

export default function AnmeldungsSeite() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/";
  const { t, sprache, setSprache } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const [formular, setFormular] = useState({ email: "", passwort: "" });
  const [langOffen, setLangOffen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const aktuelleSprache = SPRACHEN.find((s) => s.code === sprache) ?? SPRACHEN[0];

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOffen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);
  const [fehler, setFehler] = useState("");
  const [laedt, setLaedt] = useState(false);
  const [zeigPasswort, setZeigPasswort] = useState(false);
  const [fehlVersuche, setFehlVersuche] = useState(0);

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
      if (!antwort.ok) {
        const code = daten.error as string;
        setFehler(t("auth", code as Parameters<typeof t>[1]) ?? code);
        setFehlVersuche((v) => v + 1);
        return;
      }
      setFehlVersuche(0);
      router.push(redirect);
      router.refresh();
    } catch {
      setFehler(t("auth", "errGeneric"));
      setFehlVersuche((v) => v + 1);
    } finally {
      setLaedt(false);
    }
  }

  return (
    <div style={{ position: "relative", zIndex: 1, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>

      {/* Top-right controls: language + theme */}
      <div style={{ position: "fixed", top: "1rem", right: "1rem", display: "flex", alignItems: "center", gap: ".5rem", zIndex: 50 }}>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="btn-icon-dark"
          title={theme === "dark" ? t("nav", "lightMode") : t("nav", "darkMode")}
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

        {/* Language switcher */}
        <div ref={langRef} style={{ position: "relative" }}>
          <button
            onClick={() => setLangOffen((v) => !v)}
            style={{
              display: "flex", alignItems: "center", gap: ".375rem",
              padding: ".375rem .625rem", height: 36,
              background: "var(--card-bg)", backdropFilter: "blur(12px)",
              border: "1px solid var(--card-border)", borderRadius: ".5rem",
              cursor: "pointer", color: "var(--text-muted)", fontSize: ".75rem", fontWeight: 500,
            }}
          >
            <span style={{ fontSize: ".875rem" }}>{aktuelleSprache.flag}</span>
            <span>{aktuelleSprache.label}</span>
            <svg width="11" height="11" fill="none" stroke="currentColor" viewBox="0 0 24 24"
              style={{ transform: langOffen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform .15s" }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {langOffen && (
            <div className="dropdown-menu" style={{
              position: "absolute", top: "calc(100% + .375rem)", right: 0,
              minWidth: 130, borderRadius: ".625rem",
              backdropFilter: "blur(16px)", overflow: "hidden", zIndex: 100,
            }}>
              {SPRACHEN.map((s) => (
                <button
                  key={s.code}
                  onClick={() => { setSprache(s.code as Sprache); setLangOffen(false); }}
                  style={{
                    display: "flex", alignItems: "center", gap: ".5rem",
                    width: "100%", padding: ".5rem .75rem",
                    background: s.code === sprache ? "rgba(129,140,248,.12)" : "transparent",
                    border: "none", cursor: "pointer",
                    color: s.code === sprache ? "var(--primary-light)" : "var(--text-muted)",
                    fontSize: ".8125rem", textAlign: "left",
                  }}
                >
                  <span>{s.flag}</span>
                  <span>{s.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
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

            {fehlVersuche >= 2 && (
              <div style={{
                padding: ".75rem 1rem",
                background: "rgba(248,113,113,.08)",
                border: "1px solid rgba(248,113,113,.2)",
                borderRadius: ".625rem",
                display: "flex",
                flexDirection: "column",
                gap: ".375rem",
              }}>
                <p style={{ margin: 0, fontSize: ".75rem", fontWeight: 600, color: "rgba(248,113,113,.9)" }}>
                  {t("auth", "needHelp")}
                </p>
                <Link href="/forgot-password" style={{ fontSize: ".8125rem", color: "var(--primary-light)", textDecoration: "none", fontWeight: 500 }}>
                  {t("auth", "forgotPassword")}
                </Link>
                <Link href="/forgot-email" style={{ fontSize: ".8125rem", color: "var(--text-muted)", textDecoration: "none" }}>
                  {t("auth", "forgotEmail")}
                </Link>
              </div>
            )}

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
              <div className="input-group-dark" style={{ position: "relative" }}>
                {/* Lock icon on the left */}
                <span className="input-icon">
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                {/* Toggle between type="password" and type="text" */}
                <input
                  type={zeigPasswort ? "text" : "password"}
                  className="input-dark-inner"
                  placeholder="••••••••"
                  value={formular.passwort}
                  onChange={(e) => setFormular({ ...formular, passwort: e.target.value })}
                  style={{ paddingRight: "2.5rem" }}
                  required
                />
                {/* Eye icon toggle button on the right */}
                <button
                  type="button"
                  onClick={() => setZeigPasswort((v) => !v)}
                  style={{
                    position: "absolute", right: ".625rem", top: "50%",
                    transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer",
                    color: "var(--text-muted)", padding: "2px",
                    display: "flex", alignItems: "center",
                  }}
                  tabIndex={-1}
                  title={zeigPasswort ? t("auth", "hidePassword") : t("auth", "showPassword")}
                >
                  {zeigPasswort ? (
                    // Eye-off icon (password visible → click to hide)
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    // Eye icon (password hidden → click to show)
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
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