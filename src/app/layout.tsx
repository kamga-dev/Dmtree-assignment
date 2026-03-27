import type { Metadata } from "next";
import { cookies } from "next/headers";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider, Theme } from "@/context/ThemeContext";
import { Sprache } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "DMTree Community",
  description: "Die zentrale Plattform für Neuigkeiten, Ideen und Teamkommunikation",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();

  const lang = cookieStore.get("dmtree-lang")?.value;
  const initialSprache = (["de", "en", "fr", "es"].includes(lang ?? "") ? lang : "de") as Sprache;

  const themeVal = cookieStore.get("dmtree-theme")?.value;
  const initialTheme = (themeVal === "light" ? "light" : "dark") as Theme;

  return (
    <html lang={initialSprache} data-theme={initialTheme}>
      <body>
        <LanguageProvider initialSprache={initialSprache}>
          <ThemeProvider initialTheme={initialTheme}>
            {children}
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}