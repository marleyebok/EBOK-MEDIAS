import { put } from "@vercel/blob";

/**
 * Téléversement du logo/photo d'une fiche vers Vercel Blob.
 *
 * Nécessite un Blob store connecté au projet Vercel (onglet Storage) :
 * la variable BLOB_READ_WRITE_TOKEN est alors injectée automatiquement.
 * Sans token, l'image est simplement ignorée — le reste de la fiche passe.
 */

const MAX_BYTES = 2 * 1024 * 1024; // 2 Mo

export function uploadsEnabled(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

export async function uploadImage(file: File | null): Promise<string | null> {
  if (!file || file.size === 0) return null;
  if (!uploadsEnabled()) return null;
  if (file.size > MAX_BYTES) return null;
  if (!file.type.startsWith("image/")) return null;

  const extension = (file.name.split(".").pop() || "img").toLowerCase().slice(0, 5);
  const { url } = await put(`medias/logos/fiche.${extension}`, file, {
    access: "public",
    addRandomSuffix: true,
  });
  return url;
}
