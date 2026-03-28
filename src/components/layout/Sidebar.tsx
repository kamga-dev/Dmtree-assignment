"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getInitialen } from "@/lib/utils";
import { JWTPayload } from "@/lib/auth";
import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { translateKanalName } from "@/lib/i18n";
import SprachUmschalter from "./LanguageSwitcher";
import BenachrichtigungsGlocke from "./NotificationBell";

type Kanal = { id: string; name: string };

function SunIcon() {
  return (
    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="5" strokeWidth={2} strokeLinecap="round" />
      <path strokeLinecap="round" strokeWidth={2} d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  );
}

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
    </svg>
  );
}

export default function Seitenleiste({ session, channels }: { session: JWTPayload; channels: Kanal[] }) {
  const pathname = usePathname();
  const router = useRouter();
  const { t, sprache } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [meldetAb, setMeldetAb] = useState(false);
  const [offen, setOffen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  async function handleAbmelden() {
    setMeldetAb(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  const isActive = (href: string) => pathname === href;
  const isChatActive = (id: string) => pathname === `/chat/${id}`;
  const c = collapsed;

  const inhalt = (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>

      {/* Logo + Collapse toggle */}
      <div style={{
        padding: c ? ".875rem .5rem" : "1.125rem 1rem",
        borderBottom: "1px solid var(--card-border)",
        display: "flex",
        alignItems: "center",
        justifyContent: c ? "center" : "space-between",
        gap: ".5rem",
        transition: "padding .22s",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: ".75rem", minWidth: 0 }}>
          <div className="logo-icon-sm" style={{ flexShrink: 0 }}>
            <span style={{ color: "#fff", fontWeight: 700, fontSize: ".875rem" }}>D</span>
          </div>
          {!c && (
            <div style={{ overflow: "hidden" }}>
              <p style={{ margin: 0, fontWeight: 700, fontSize: ".875rem", color: "var(--text-main)", whiteSpace: "nowrap" }}>DMTree</p>
              <p style={{ margin: 0, fontSize: ".6875rem", color: "var(--text-muted)", whiteSpace: "nowrap" }}>Community</p>
            </div>
          )}
        </div>
        <button
          onClick={() => setCollapsed((v) => !v)}
          className="btn-icon-dark collapse-toggle"
          title={c ? t("nav", "expandSidebar") : t("nav", "collapseSidebar")}
          style={{ flexShrink: 0 }}
        >
          <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d={c ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"} />
          </svg>
        </button>
      </div>

      {/* Main navigation */}
      <nav style={{ padding: ".75rem .5rem", display: "flex", flexDirection: "column", gap: ".125rem" }}>
        <Link href="/" onClick={() => setOffen(false)}
          className={`nav-link-dark${isActive("/") ? " active" : ""}`}
          title={c ? t("nav", "posts") : undefined}>
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
          {!c && <span>{t("nav", "posts")}</span>}
        </Link>
        <Link href="/posts/new" onClick={() => setOffen(false)}
          className={`nav-link-dark${isActive("/posts/new") ? " active" : ""}`}
          title={c ? t("nav", "newPost") : undefined}>
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {!c && <span>{t("nav", "newPost")}</span>}
        </Link>
        <Link href="/profile" onClick={() => setOffen(false)}
          className={`nav-link-dark${isActive("/profile") ? " active" : ""}`}
          title={c ? t("nav", "profile") : undefined}>
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          {!c && <span>{t("nav", "profile")}</span>}
        </Link>

      </nav>

      {/* Channels */}
      <div style={{ padding: "0 .5rem" }}>
        {!c && <p className="nav-section-label">{t("nav", "channels")}</p>}
        {c && <div style={{ height: ".25rem" }} />}
        <div style={{ display: "flex", flexDirection: "column", gap: ".125rem" }}>
          {channels.map((kanal) => (
            <Link key={kanal.id} href={`/chat/${kanal.id}`} onClick={() => setOffen(false)}
              className={`nav-link-dark${isChatActive(kanal.id) ? " active" : ""}`}
              title={c ? translateKanalName(kanal.name, sprache) : undefined}>
              <span style={{ color: "var(--text-muted)", fontWeight: 700, fontSize: ".875rem", flexShrink: 0 }}>#</span>
              {!c && <span>{translateKanalName(kanal.name, sprache)}</span>}
            </Link>
          ))}
        </div>
      </div>

      {/* Admin */}
      {session.role === "ADMIN" && (
        <div style={{ padding: "0 .5rem" }}>
          {!c && <p className="nav-section-label">{t("nav", "admin")}</p>}
          {c && <div style={{ height: ".25rem" }} />}
          <Link href="/admin" onClick={() => setOffen(false)}
            className={`nav-link-dark${isActive("/admin") ? " active" : ""}`}
            title={c ? t("nav", "adminPanel") : undefined}>
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {!c && <span>{t("nav", "adminPanel")}</span>}
          </Link>
        </div>
      )}

      <div style={{ flex: 1 }} />

      {/* Theme toggle */}
      <div style={{ padding: ".5rem .5rem 0", display: "flex", justifyContent: c ? "center" : "stretch" }}>
        <button
          onClick={toggleTheme}
          className="btn-icon-dark"
          title={theme === "dark" ? "Light mode" : "Dark mode"}
          style={{
            width: c ? 40 : "100%",
            height: 36,
            padding: c ? undefined : "0 .75rem",
            borderRadius: ".5rem",
            gap: ".5rem",
            border: "1px solid var(--card-border)",
            justifyContent: c ? "center" : "flex-start",
            fontSize: ".75rem",
          }}
        >
          {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          {!c && <span style={{ color: "var(--text-muted)" }}>{theme === "dark" ? "Light mode" : "Dark mode"}</span>}
        </button>
      </div>

      {/* Language switcher */}
      {!c && (
        <div style={{ padding: ".5rem 1rem .75rem", borderTop: "1px solid var(--card-border)", marginTop: ".5rem" }}>
          <SprachUmschalter />
        </div>
      )}
      {c && <div style={{ height: ".5rem" }} />}

      {/* User section */}
      <div style={{ padding: c ? ".75rem .5rem" : ".875rem 1rem", borderTop: "1px solid var(--card-border)" }}>
        {c ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: ".5rem" }}>
            <div className="avatar avatar-md">{getInitialen(session.name)}</div>
            <div className="sidebar-notif-bell">
              <BenachrichtigungsGlocke />
            </div>
            <button onClick={handleAbmelden} disabled={meldetAb} className="btn-icon-dark" title={t("nav", "signOut")}>
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: ".625rem" }}>
            <div className="avatar avatar-md">{getInitialen(session.name)}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: ".8125rem", fontWeight: 600, color: "var(--text-main)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {session.name}
              </p>
              <p style={{ margin: 0, fontSize: ".6875rem", color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {session.email}
              </p>
            </div>
            <div className="sidebar-notif-bell">
              <BenachrichtigungsGlocke />
            </div>
            <button onClick={handleAbmelden} disabled={meldetAb} className="btn-icon-dark" title={t("nav", "signOut")}>
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="mobile-topbar">
        <button onClick={() => setOffen(!offen)} className="btn-icon-dark" style={{ width: 38, height: 38 }}>
          <HamburgerIcon open={offen} />
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
          <div className="logo-icon-sm">
            <span style={{ color: "#fff", fontWeight: 700, fontSize: ".875rem" }}>D</span>
          </div>
          <span style={{ fontWeight: 700, fontSize: ".875rem", color: "var(--text-main)" }}>DMTree</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: ".125rem" }}>
          <button onClick={toggleTheme} className="btn-icon-dark" title={theme === "dark" ? "Light mode" : "Dark mode"}>
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>
          <BenachrichtigungsGlocke />
        </div>
      </div>

      {/* Mobile overlay */}
      {offen && (
        <div
          onClick={() => setOffen(false)}
          style={{ position: "fixed", inset: 0, zIndex: 30, background: "rgba(0,0,0,.5)", backdropFilter: "blur(2px)" }}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar${offen ? " open" : ""}${collapsed ? " collapsed" : ""}`}>
        {inhalt}
      </aside>
    </>
  );
}