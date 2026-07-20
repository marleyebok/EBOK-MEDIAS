"use server";

import { redirect } from "next/navigation";
import { CATEGORIES, type CategoryKey, type MediaLinks } from "@/data/medias";
import { hasDb, insertSubmission } from "@/lib/db";

const LINK_KEYS = ["site", "instagram", "x", "youtube", "tiktok", "twitch"] as const;

function cleanUrl(raw: FormDataEntryValue | null): string | undefined {
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

export async function submitProposal(formData: FormData): Promise<void> {
  // Champ-piège anti-spam : rempli uniquement par les robots.
  if (String(formData.get("website") ?? "").trim() !== "") redirect("/proposer/merci");

  if (!hasDb()) redirect("/proposer?erreur=indisponible");

  const name = String(formData.get("name") ?? "").trim().slice(0, 80);
  const category = String(formData.get("category") ?? "") as CategoryKey;
  const description = String(formData.get("description") ?? "").trim().slice(0, 400);
  const contactEmail =
    String(formData.get("email") ?? "").trim().slice(0, 120) || null;

  if (!name || !description || !(category in CATEGORIES)) {
    redirect("/proposer?erreur=champs");
  }

  const links: MediaLinks = {};
  for (const key of LINK_KEYS) {
    const url = cleanUrl(formData.get(key));
    if (url) links[key] = url;
  }
  if (Object.keys(links).length === 0) redirect("/proposer?erreur=liens");

  await insertSubmission({ name, category, description, contactEmail, links });
  redirect("/proposer/merci");
}
