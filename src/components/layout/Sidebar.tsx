"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getInitialen } from "@/lib/utils";
import { JWTPayload } from "@/lib/auth";
import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { translateKanalName } from "@/lib/i18n";
import SprachUmschalter from "./LanguageSwitcher";
import BenachrichtigungsGlocke from "./NotificationBell";

type Kanal = { id: string; name: string };

export default function Seitenleiste({ session, channels }: { session: JWTPayload; channels: Kanal[] }) {
  const pathname = usePathname();
  const router = useRouter();
  const { t, sprache } = useLanguage();
  const [meldetAb, setMeldetAb] = useState(false);
  const [offen, setOffen] = useState(false);

  async function handleAbmelden() {
    setMeldetAb(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  const isActive = (href: string) => pathname === href;
  const isChatActive = (id: string) => pathname === `/chat/${id}`;

  const inhalt = (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>

      {/* Logo */}
      <div style={{ padding: "1.25rem 1rem", borderBottom: "1px solid var(--card-border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: ".75rem" }}>
          <div className="logo-icon-sm">
            <span style={{ color: "#fff", fontWeight: 700, fontSize: ".875rem" }}>D</span>
          </div>
          <div>
            <p style={{ margin: 0, fontWeight: 700, fontSize: ".875rem", color: "var(--text-main)" }}>DMTree</p>
            <p style={{ margin: 0, fontSize: ".6875rem", color: "var(--text-muted)" }}>Community</p>
          </div>
        </div>
      </div>

      {/* Hauptnavigation */}
      <nav style={{ padding: ".75rem .5rem", display: "flex", flexDirection: "column", gap: ".125rem" }}>
        <Link href="/" onClick={() => setOffen(false)}
          className={`nav-link-dark${isActive("/") ? " active" : ""}`}>
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
          {t("nav", "posts")}
        </Link>
        <Link href="/posts/new" onClick={() => setOffen(false)}
          className={`nav-link-dark${isActive("/posts/new") ? " active" : ""}`}>
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {t("nav", "newPost")}
        </Link>
      </nav>

      {/* Kanäle */}
      <div style={{ padding: "0 .5rem" }}>
        <p className="nav-section-label">{t("nav", "channels")}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: ".125rem" }}>
          {channels.map((kanal) => (
            <Link key={kanal.id} href={`/chat/${kanal.id}`} onClick={() => setOffen(false)}
              className={`nav-link-dark${isChatActive(kanal.id) ? " active" : ""}`}>
              <span style={{ color: "var(--text-muted)", fontWeight: 600, fontSize: ".875rem" }}>#</span>
              {translateKanalName(kanal.name, sprache)}
            </Link>
          ))}
        </div>
      </div>

      {/* Admin */}
      {session.role === "ADMIN" && (
        <div style={{ padding: "0 .5rem" }}>
          <p className="nav-section-label">{t("nav", "admin")}</p>
          <Link href="/admin" onClick={() => setOffen(false)}
            className={`nav-link-dark${isActive("/admin") ? " active" : ""}`}>
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {t("nav", "adminPanel")}
          </Link>
        </div>
      )}

      <div style={{ flex: 1 }} />

      {/* Sprachumschalter */}
      <div style={{ padding: ".75rem 1rem", borderTop: "1px solid var(--card-border)" }}>
        <SprachUmschalter />
      </div>

      {/* Benutzer */}
      <div style={{ padding: ".875rem 1rem", borderTop: "1px solid var(--card-border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: ".625rem" }}>
          <div className="avatar avatar-md">
            {getInitialen(session.name)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: ".8125rem", fontWeight: 600, color: "var(--text-main)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {session.name}
            </p>
            <p style={{ margin: 0, fontSize: ".6875rem", color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {session.email}
            </p>
          </div>
          <BenachrichtigungsGlocke />
          <button onClick={handleAbmelden} disabled={meldetAb} className="btn-icon-dark" title={t("nav", "signOut")}>
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Hamburger */}
      <button
        onClick={() => setOffen(!offen)}
        className="btn-icon-dark"
        style={{ position: "fixed", top: 12, left: 12, zIndex: 50, display: "none", background: "rgba(15,12,41,.8)", border: "1px solid var(--card-border)", borderRadius: ".5rem", width: 38, height: 38 }}
        id="hamburger-btn"
      >
        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={offen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
        </svg>
      </button>

      {/* Overlay */}
      {offen && (
        <div
          onClick={() => setOffen(false)}
          style={{ position: "fixed", inset: 0, zIndex: 30, background: "rgba(0,0,0,.5)", backdropFilter: "blur(2px)" }}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar${offen ? " open" : ""}`}>
        {inhalt}
      </aside>

      <style>{`
        @media (max-width: 1024px) {
          #hamburger-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
}