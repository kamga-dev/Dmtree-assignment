"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function RegistrierungsSeite() {
  const router = useRouter();
  const { t } = useLanguage();
  const [formular, setFormular] = useState({ name: "", email: "", passwort: "", passwortBestaetigen: "" });
  const [fehler, setFehler] = useState("");
  const [laedt, setLaedt] = useState(false);

  async function handleAbsenden(e: React.FormEvent) {
    e.preventDefault();
    setFehler("");
    if (formular.passwort !== formular.passwortBestaetigen) { setFehler(t("auth", "errPasswordMatch")); return; }
    if (formular.passwort.length < 6) { setFehler(t("auth", "errPasswordShort")); return; }

    setLaedt(true);
    try {
      const antwort = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formular.name, email: formular.email, password: formular.passwort }),
      });
      const daten = await antwort.json();
      if (!antwort.ok) { setFehler(daten.error ?? t("auth", "register")); return; }
      router.push("/");
      router.refresh();
    } catch {
      setFehler(t("auth", "errGeneric"));
    } finally {
      setLaedt(false);
    }
  }

  const inputFeld = (label: string, typ: string, platzhalter: string, wert: string, onChange: (v: string) => void, icon: React.ReactNode) => (
    <div>
      <label className="form-label-dark">{label}</label>
      <div className="input-group-dark">
        <span className="input-icon">{icon}</span>
        <input type={typ} className="input-dark-inner" placeholder={platzhalter} value={wert} onChange={(e) => onChange(e.target.value)} required />
      </div>
    </div>
  );

  return (
    <div style={{ position: "relative", zIndex: 1, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
      <div style={{ width: "100%", maxWidth: 420 }} className="slide-up">

        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div className="logo-icon" style={{ margin: "0 auto 1rem" }}>
            <span style={{ color: "#fff", fontSize: "1.5rem", fontWeight: 700 }}>D</span>
          </div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, margin: "0 0 .25rem", letterSpacing: "-.3px" }}>
            DMTree Community
          </h1>
          <p style={{ fontSize: ".875rem", color: "var(--text-muted)", margin: 0 }}>{t("auth", "createAccount")}</p>
        </div>

        <div className="glass-card" style={{ padding: "2.25rem 2rem" }}>
          <form onSubmit={handleAbsenden} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {fehler && <div className="alert-error">{fehler}</div>}

            {inputFeld(t("auth", "fullName"), "text", t("auth", "yourName"), formular.name, (v) => setFormular({ ...formular, name: v }),
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            )}

            {inputFeld(t("auth", "email"), "email", "du@beispiel.de", formular.email, (v) => setFormular({ ...formular, email: v }),
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            )}

            {inputFeld(t("auth", "password"), "password", t("auth", "passwordMin"), formular.passwort, (v) => setFormular({ ...formular, passwort: v }),
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            )}

            {inputFeld(t("auth", "confirmPassword"), "password", "••••••••", formular.passwortBestaetigen, (v) => setFormular({ ...formular, passwortBestaetigen: v }),
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            )}

            <button type="submit" className="btn-primary-dark" disabled={laedt} style={{ marginTop: ".25rem" }}>
              {laedt ? t("auth", "creatingAccount") : t("auth", "createAccountBtn")}
            </button>
          </form>

          <hr className="divider" style={{ margin: "1.5rem 0" }} />

          <p style={{ textAlign: "center", fontSize: ".875rem", color: "var(--text-muted)", margin: 0 }}>
            {t("auth", "alreadyAccount")}{" "}
            <Link href="/login" style={{ color: "var(--primary-light)", fontWeight: 600, textDecoration: "none" }}>
              {t("auth", "signInNow")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}