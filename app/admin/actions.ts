"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { CATEGORIES, type CategoryKey } from "@/data/medias";
import { decideSubmission, updateSubmission } from "@/lib/db";
import { cleanUrl, parseLinks } from "@/lib/parse";
import {
  checkPassword,
  endAdminSession,
  isAdmin,
  startAdminSession,
} from "@/lib/admin-session";

export async function login(formData: FormData): Promise<void> {
  const password = String(formData.get("password") ?? "");
  if (!checkPassword(password)) redirect("/admin?erreur=mdp");
  await startAdminSession();
  redirect("/admin");
}

export async function logout(): Promise<void> {
  await endAdminSession();
  redirect("/admin");
}

export async function decide(formData: FormData): Promise<void> {
  if (!(await isAdmin())) redirect("/admin");
  const id = Number(formData.get("id"));
  const decision = String(formData.get("decision"));
  if (Number.isInteger(id) && (decision === "approved" || decision === "rejected")) {
    await decideSubmission(id, decision);
    // La décision doit se refléter dans l'annuaire sans attendre.
    revalidatePath("/");
  }
  redirect("/admin");
}

export async function edit(formData: FormData): Promise<void> {
  if (!(await isAdmin())) redirect("/admin");

  const id = Number(formData.get("id"));
  const name = String(formData.get("name") ?? "").trim().slice(0, 80);
  const category = String(formData.get("category") ?? "") as CategoryKey;
  const description = String(formData.get("description") ?? "").trim().slice(0, 400);
  const links = parseLinks(formData);
  const imageUrl = cleanUrl(formData.get("image_url")) ?? null;

  if (
    Number.isInteger(id) &&
    name &&
    description &&
    category in CATEGORIES &&
    Object.keys(links).length > 0
  ) {
    await updateSubmission(id, { name, category, description, links, imageUrl });
    revalidatePath("/");
  }
  redirect("/admin");
}
