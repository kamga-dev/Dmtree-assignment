"use client";

import { createContext, useContext, useState } from "react";
import { Sprache, t as tFn, UebersetzungsSchluessel } from "@/lib/i18n";

type LangCtx = {
  sprache: Sprache;
  setSprache: (s: Sprache) => void;
  t: (bereich: UebersetzungsSchluessel, schluessel: string) => string;
};

const LanguageContext = createContext<LangCtx>({
  sprache: "de",
  setSprache: () => {},
  t: (_, k) => k,
});

export function LanguageProvider({
  children,
  initialSprache = "de",
}: {
  children: React.ReactNode;
  initialSprache?: Sprache;
}) {
  const [sprache, setSpracheState] = useState<Sprache>(initialSprache);

  function setSprache(s: Sprache) {
    setSpracheState(s);
    document.cookie = `dmtree-lang=${s}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
  }

  return (
    <LanguageContext.Provider
      value={{
        sprache,
        setSprache,
        t: (b, k) => tFn(b, k, sprache),
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}