"use server";

import { redirect } from "next/navigation";
import { CATEGORIES, type CategoryKey } from "@/data/medias";
import { hasDb, insertSubmission } from "@/lib/db";
import { parseLinks } from "@/lib/parse";
import { uploadImage } from "@/lib/images";

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

  const links = parseLinks(formData);
  if (Object.keys(links).length === 0) redirect("/proposer?erreur=liens");

  // Logo/photo optionnel : ignoré si trop lourd, non-image ou stockage absent.
  const image = formData.get("image");
  const imageUrl = await uploadImage(image instanceof File ? image : null);

  await insertSubmission({ name, category, description, contactEmail, links, imageUrl });
  redirect("/proposer/merci");
}
