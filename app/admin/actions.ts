"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { decideSubmission } from "@/lib/db";
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
    // La fiche approuvée doit apparaître dans l'annuaire sans attendre.
    revalidatePath("/");
  }
  redirect("/admin");
}
