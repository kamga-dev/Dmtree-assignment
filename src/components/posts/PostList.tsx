"use client";

import BeitragKarte from "./PostCard";
import { useLanguage } from "@/context/LanguageContext";

type Beitrag = {
  id: string;
  title: string;
  content: string;
  category: string;
  isPinned: boolean;
  punktzahl: number;
  benutzerStimme: number;
  createdAt: Date;
  author: { id: string; name: string };
  _count: { comments: number; votes: number };
};

export default function BeitragsListe({
  posts,
  currentUserId,
}: {
  posts: Beitrag[];
  currentUserId?: string;
}) {
  const { t } = useLanguage();

  if (posts.length === 0) {
    return (
      <div className="glass-card" style={{ padding: "3rem 1rem", textAlign: "center" }}>
        <p style={{ color: "rgba(156,163,175,.5)", fontSize: ".875rem", margin: 0 }}>
          {t("feed", "noPosts")}
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>
      {posts.map((beitrag, i) => (
        <BeitragKarte
          key={beitrag.id}
          post={beitrag}
          currentUserId={currentUserId}
          animIndex={i}
        />
      ))}
    </div>
  );
}