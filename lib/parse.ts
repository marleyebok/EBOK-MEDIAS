import type { MediaLinks } from "@/data/medias";

/** Champs de liens acceptés par les formulaires (proposition et admin). */
export const LINK_KEYS = ["site", "instagram", "x", "youtube", "tiktok", "twitch"] as const;

/** Normalise une URL saisie (ajoute https://, rejette tout le reste). */
export function cleanUrl(raw: FormDataEntryValue | null): string | undefined {
  const v = String(raw ?? "").trim();
  if (!v) return undefined;
  const url = /^https?:\/\//i.test(v) ? v : `https://${v}`;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return undefined;
    return parsed.toString().slice(0, 300);
  } catch {
    return undefined;
  }
}

/** Extrait et nettoie les liens d'un FormData. */
export function parseLinks(formData: FormData): MediaLinks {
  const links: MediaLinks = {};
  for (const key of LINK_KEYS) {
    const url = cleanUrl(formData.get(key));
    if (url) links[key] = url;
  }
  return links;
}
