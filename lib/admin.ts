import { currentUser } from "@clerk/nextjs/server";

/**
 * Autorisation admin — déléguée à CLERK (compte unique de la galaxie EBOK).
 * Remplace l'ancienne session maison (mot de passe partagé + cookie HMAC).
 *
 * Admin = e-mail de l'utilisateur Clerk connecté présent dans l'allowlist.
 * marley.ebok@gmail.com est admin d'office ; on peut en ajouter via l'env
 * ADMIN_EMAILS (séparés par des virgules). « Zéro miroir » : l'e-mail est lu
 * en direct depuis Clerk, jamais copié en base.
 */
const OWNER_EMAIL = "marley.ebok@gmail.com";

export const ADMIN_EMAILS = [
  OWNER_EMAIL,
  ...String(process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean),
];

function isAdminEmail(email: string | null | undefined): boolean {
  return !!email && ADMIN_EMAILS.includes(email.trim().toLowerCase());
}

/** L'utilisateur Clerk connecté est-il administrateur autorisé ? */
export async function isAdmin(): Promise<boolean> {
  try {
    const user = await currentUser();
    if (!user) return false;
    const primary =
      user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId) ??
      user.emailAddresses[0];
    return isAdminEmail(primary?.emailAddress);
  } catch {
    return false;
  }
}
