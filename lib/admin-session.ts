import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

/**
 * Session admin minimaliste, en attendant le compte unique (Clerk) :
 * un mot de passe partagé (env ADMIN_PASSWORD) échangé contre un cookie
 * signé HMAC. Suffisant pour un seul administrateur en phase de test.
 */

const COOKIE = "ebokm_admin";

function token(): string | null {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) return null;
  return createHmac("sha256", secret).update("ebok-medias-admin-v1").digest("hex");
}

export function adminConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD);
}

export function checkPassword(candidate: string): boolean {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) return false;
  const a = Buffer.from(candidate);
  const b = Buffer.from(secret);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function isAdmin(): Promise<boolean> {
  const expected = token();
  if (!expected) return false;
  const value = (await cookies()).get(COOKIE)?.value;
  return value === expected;
}

export async function startAdminSession(): Promise<void> {
  const value = token();
  if (!value) return;
  (await cookies()).set(COOKIE, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
}

export async function endAdminSession(): Promise<void> {
  (await cookies()).delete(COOKIE);
}
