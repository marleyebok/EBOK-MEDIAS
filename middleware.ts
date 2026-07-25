import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

/**
 * Middleware Clerk (identité unique de la galaxie EBOK).
 *
 * Zones protégées : `/admin` (administration) et `/proposer` (le formulaire
 * est réservé aux membres connectés — voir README). `/proposer/merci` reste
 * public (page de confirmation, pas de données sensibles).
 *
 * Robustesse : sans CLERK_SECRET_KEY (impossible de vérifier une session), le
 * middleware devient un simple passe-plat : l'annuaire public reste servi,
 * seules les zones protégées sont indisponibles tant que la clé secrète n'est
 * pas configurée — jamais de site cassé en son absence.
 */
const PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "pk_live_Y2xlcmsuZWJvay5mciQ";

const isProtectedRoute = createRouteMatcher(["/admin(.*)", "/proposer"]);

export default process.env.CLERK_SECRET_KEY
  ? clerkMiddleware(
      async (auth, request) => {
        if (isProtectedRoute(request)) {
          await auth.protect();
        }
      },
      { publishableKey: PUBLISHABLE_KEY }
    )
  : () => NextResponse.next();

export const config = {
  matcher: [
    // Toutes les routes sauf les fichiers statiques et les internes Next.
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Toujours pour les routes API.
    "/(api|trpc)(.*)",
  ],
};
