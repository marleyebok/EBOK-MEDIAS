import { neon } from "@neondatabase/serverless";
import type { CategoryKey, MediaLinks } from "@/data/medias";

/**
 * Accès à la base Neon de la galaxie (schéma `medias`).
 *
 * Tant que DATABASE_URL n'est pas configurée (projet Neon « ebok » pas encore
 * créé), toutes les fonctions se dégradent proprement : le site reste 100 %
 * statique et le formulaire affiche le repli e-mail.
 */

export function hasDb(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

function sql() {
  return neon(process.env.DATABASE_URL!);
}

export interface Submission {
  id: number;
  name: string;
  category: CategoryKey;
  description: string;
  contact_email: string | null;
  links: MediaLinks;
  image_url: string | null;
  status: "pending" | "approved" | "rejected";
  created_at: string;
}

let schemaReady = false;

/** Crée le schéma/la table au premier appel (idempotent). */
async function ensureSchema(): Promise<void> {
  if (schemaReady) return;
  const q = sql();
  await q`CREATE SCHEMA IF NOT EXISTS medias`;
  await q`
    CREATE TABLE IF NOT EXISTS medias.submissions (
      id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT NOT NULL,
      contact_email TEXT,
      links JSONB NOT NULL DEFAULT '{}',
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      decided_at TIMESTAMPTZ
    )`;
  await q`ALTER TABLE medias.submissions ADD COLUMN IF NOT EXISTS image_url TEXT`;
  schemaReady = true;
}

export async function insertSubmission(input: {
  name: string;
  category: CategoryKey;
  description: string;
  contactEmail: string | null;
  links: MediaLinks;
  imageUrl: string | null;
}): Promise<void> {
  await ensureSchema();
  await sql()`
    INSERT INTO medias.submissions (name, category, description, contact_email, links, image_url)
    VALUES (${input.name}, ${input.category}, ${input.description},
            ${input.contactEmail}, ${JSON.stringify(input.links)}::jsonb, ${input.imageUrl})`;
}

export async function updateSubmission(
  id: number,
  fields: {
    name: string;
    category: CategoryKey;
    description: string;
    links: MediaLinks;
    imageUrl: string | null;
  }
): Promise<void> {
  await ensureSchema();
  await sql()`
    UPDATE medias.submissions
    SET name = ${fields.name}, category = ${fields.category},
        description = ${fields.description},
        links = ${JSON.stringify(fields.links)}::jsonb,
        image_url = ${fields.imageUrl}
    WHERE id = ${id}`;
}

export async function listSubmissions(
  status: Submission["status"]
): Promise<Submission[]> {
  await ensureSchema();
  const rows = await sql()`
    SELECT id, name, category, description, contact_email, links, image_url,
           status, created_at::text AS created_at
    FROM medias.submissions
    WHERE status = ${status}
    ORDER BY created_at DESC
    LIMIT 200`;
  return rows as unknown as Submission[];
}

export async function decideSubmission(
  id: number,
  status: "approved" | "rejected"
): Promise<void> {
  await ensureSchema();
  await sql()`
    UPDATE medias.submissions
    SET status = ${status}, decided_at = now()
    WHERE id = ${id}`;
}

/** Fiches approuvées, prêtes à fusionner avec l'annuaire statique. */
export async function approvedSubmissions(): Promise<Submission[]> {
  if (!hasDb()) return [];
  try {
    return await listSubmissions("approved");
  } catch {
    // Base injoignable : l'annuaire statique doit continuer de s'afficher.
    return [];
  }
}
