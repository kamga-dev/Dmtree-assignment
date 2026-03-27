"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { formatiereDatumI18n } from "@/lib/i18n";
import { getInitialen } from "@/lib/utils";

type Post = {
  id: string;
  title: string;
  category: string;
  isPinned: boolean;
  createdAt: Date;
  punktzahl: number;
  _count: { comments: number; votes: number };
};

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
};

export default function ProfilInhalt({ user, posts }: { user: User; posts: Post[] }) {
  const { t, sprache } = useLanguage();

  const catBadge: Record<string, string> = {
    NEWS: "badge-news",
    IDEAS: "badge-ideas",
    GENERAL: "badge-general",
  };
  const catKey: Record<string, string> = {
    NEWS: "newsBadge",
    IDEAS: "ideaBadge",
    GENERAL: "generalBadge",
  };

  return (
    <div style={{ maxWidth: 680, margin: "0 auto" }}>
      {/* Profile card */}
      <div className="glass-card" style={{ padding: "2rem", marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
          <div className="avatar" style={{ width: 64, height: 64, fontSize: "1.5rem", fontWeight: 700, borderRadius: "50%", background: "linear-gradient(135deg,#818cf8,#6366f1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", flexShrink: 0 }}>
            {getInitialen(user.name)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{ margin: "0 0 .25rem", fontSize: "1.25rem", fontWeight: 700, color: "var(--text-main)" }}>{user.name}</h1>
            <p style={{ margin: "0 0 .5rem", fontSize: ".875rem", color: "var(--text-muted)" }}>{user.email}</p>
            <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}>
              <span className={`badge-dark ${user.role === "ADMIN" ? "badge-news" : "badge-general"}`}>
                {user.role === "ADMIN" ? t("admin", "administrator") : t("admin", "member")}
              </span>
              <span style={{ fontSize: ".75rem", color: "var(--text-muted)" }}>
                {t("profile", "member")} {formatiereDatumI18n(new Date(user.createdAt), sprache)}
              </span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: "1.5rem", marginTop: "1.5rem", paddingTop: "1.25rem", borderTop: "1px solid var(--card-border)" }}>
          <div style={{ textAlign: "center" }}>
            <p style={{ margin: 0, fontSize: "1.375rem", fontWeight: 700, color: "var(--primary-light)" }}>{posts.length}</p>
            <p style={{ margin: 0, fontSize: ".75rem", color: "var(--text-muted)" }}>{t("feed", posts.length === 1 ? "post" : "posts")}</p>
          </div>
          <div style={{ textAlign: "center" }}>
            <p style={{ margin: 0, fontSize: "1.375rem", fontWeight: 700, color: "var(--primary-light)" }}>
              {posts.reduce((a, b) => a + b.punktzahl, 0)}
            </p>
            <p style={{ margin: 0, fontSize: ".75rem", color: "var(--text-muted)" }}>{t("admin", "votes")}</p>
          </div>
          <div style={{ textAlign: "center" }}>
            <p style={{ margin: 0, fontSize: "1.375rem", fontWeight: 700, color: "var(--primary-light)" }}>
              {posts.reduce((a, b) => a + b._count.comments, 0)}
            </p>
            <p style={{ margin: 0, fontSize: ".75rem", color: "var(--text-muted)" }}>{t("post", "comments")}</p>
          </div>
        </div>
      </div>

      {/* Posts list */}
      <h2 style={{ fontSize: ".9375rem", fontWeight: 700, color: "var(--text-main)", marginBottom: ".875rem" }}>
        {t("profile", "myPosts")}
      </h2>

      {posts.length === 0 ? (
        <div className="glass-card" style={{ padding: "2.5rem", textAlign: "center" }}>
          <p style={{ margin: 0, color: "var(--text-muted)", fontSize: ".875rem" }}>{t("profile", "noPosts")}</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: ".625rem" }}>
          {posts.map((p) => (
            <Link key={p.id} href={`/posts/${p.id}`} style={{ textDecoration: "none" }}>
              <div className="glass-card" style={{ padding: ".875rem 1.125rem", transition: "transform .15s", cursor: "pointer" }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
              >
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: ".75rem" }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", gap: ".375rem", marginBottom: ".375rem" }}>
                      {p.isPinned && <span className="badge-dark badge-pinned" style={{ fontSize: ".6875rem" }}>📌</span>}
                      <span className={`badge-dark ${catBadge[p.category] ?? "badge-general"}`} style={{ fontSize: ".6875rem" }}>
                        {t("cat", catKey[p.category] as Parameters<typeof t>[1] ?? "generalBadge")}
                      </span>
                    </div>
                    <p style={{ margin: "0 0 .25rem", fontSize: ".9375rem", fontWeight: 600, color: "var(--text-main)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {p.title}
                    </p>
                    <p style={{ margin: 0, fontSize: ".75rem", color: "var(--text-muted)" }}>
                      {formatiereDatumI18n(new Date(p.createdAt), sprache)}
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: ".875rem", flexShrink: 0, fontSize: ".75rem", color: "var(--text-muted)" }}>
                    <span>▲ {p.punktzahl}</span>
                    <span>💬 {p._count.comments}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}