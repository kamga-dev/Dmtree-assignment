import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatiereDatum(datum: Date | string): string {
  const d = new Date(datum);
  const jetzt = new Date();
  const diffMs = jetzt.getTime() - d.getTime();
  const diffSek = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSek / 60);
  const diffStd = Math.floor(diffMin / 60);
  const diffTage = Math.floor(diffStd / 24);

  if (diffSek < 60) return "gerade eben";
  if (diffMin < 60) return `vor ${diffMin} Min.`;
  if (diffStd < 24) return `vor ${diffStd} Std.`;
  if (diffTage < 7) return `vor ${diffTage} Tag${diffTage !== 1 ? "en" : ""}`;

  return d.toLocaleDateString("de-DE", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Rückwärtskompatibilität
export const formatDate = formatiereDatum;

export function getKategoriefarbe(kategorie: string) {
  switch (kategorie) {
    case "NEWS":
      return "bg-blue-100 text-blue-700";
    case "IDEAS":
      return "bg-purple-100 text-purple-700";
    case "GENERAL":
      return "bg-gray-100 text-gray-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

// Rückwärtskompatibilität
export const getCategoryColor = getKategoriefarbe;

export function getKategorieBezeichnung(kategorie: string) {
  switch (kategorie) {
    case "NEWS":
      return "Neuigkeit";
    case "IDEAS":
      return "Idee";
    case "GENERAL":
      return "Allgemein";
    default:
      return kategorie;
  }
}

// Rückwärtskompatibilität
export const getCategoryLabel = getKategorieBezeichnung;

export function getInitialen(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// Rückwärtskompatibilität
export const getInitials = getInitialen;