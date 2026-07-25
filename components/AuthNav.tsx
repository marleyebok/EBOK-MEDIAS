"use client";

import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";

/**
 * Barre d'authentification de l'en-tête (compte unique de la galaxie EBOK).
 * Déconnecté : « Se connecter » / « Créer un compte » (modales Clerk).
 * Connecté : lien vers le formulaire, et — pour l'admin — accès direct à
 * /admin. La liste admin côté client est publique (l'e-mail propriétaire) ;
 * l'autorisation réelle reste vérifiée côté serveur (lib/admin.ts).
 *
 * Utilise `useUser()` plutôt que `<SignedIn>`/`<SignedOut>` : ces composants
 * ont été retirés de @clerk/nextjs v7 (remplacés par `<Show>`) — le hook,
 * lui, est stable sur toutes les versions.
 */
const ADMIN_EMAILS = ["marley.ebok@gmail.com"];

// Après inscription (jamais connexion) : questionnaire de bienvenue centralisé
// sur ebok.fr (une seule fois par compte), qui revient ensuite ici.
const ONBOARDING_RETURN_TO = "https://medias.ebok.fr/proposer";
const SIGNUP_REDIRECT = `https://ebok.fr/onboarding?return_to=${encodeURIComponent(ONBOARDING_RETURN_TO)}`;

export default function AuthNav() {
  const { isLoaded, isSignedIn, user } = useUser();

  // Évite un flash « déconnecté » le temps que Clerk charge la session.
  if (!isLoaded) return <nav className="auth-nav" />;

  if (!isSignedIn) {
    return (
      <nav className="auth-nav">
        <SignInButton mode="modal">
          <button className="auth-link" type="button">
            Se connecter
          </button>
        </SignInButton>
        <SignUpButton mode="modal" forceRedirectUrl={SIGNUP_REDIRECT}>
          <button className="auth-cta" type="button">
            Créer un compte
          </button>
        </SignUpButton>
      </nav>
    );
  }

  const email = user?.primaryEmailAddress?.emailAddress?.toLowerCase();
  const isAdmin = Boolean(email && ADMIN_EMAILS.includes(email));

  return (
    <nav className="auth-nav">
      {isAdmin && (
        <Link className="auth-link auth-admin" href="/admin">
          👑 Admin
        </Link>
      )}
      <Link className="auth-link" href="/proposer">
        Proposer un média
      </Link>
      <UserButton />
    </nav>
  );
}
