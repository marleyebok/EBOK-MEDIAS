# EBOK Médias 📣🏀

> **L'annuaire des médias du basket francophone.**

## Le futur contenu

EBOK Médias sera un répertoire qui **donne de la visibilité** à celles et ceux
qui font vivre le basket sur les réseaux : un annuaire clair, par catégories,
avec les liens vers tous leurs réseaux sociaux.

- **Presse & sites d'actu** : journaux, blogs, sites spécialisés.
- **Podcasts & émissions** : audio, YouTube, Twitch.
- **Joueurs & joueuses** : comptes à suivre, du départemental au pro.
- **Entraîneurs & formateurs** : contenus pédagogiques, analyses.
- **Clubs & institutions** : comptes officiels.
- **Créateurs de contenu** : highlights, mixtapes, photographes, vidéastes.

Chaque fiche : nom, catégorie, courte présentation, liens (Instagram, X,
YouTube, TikTok, Twitch, site web…), et mise en avant des pépites du moment.

## Fonctionnement

- Consultation **publique, sans compte** : l'annuaire doit se partager
  facilement.
- **Proposer une fiche** : formulaire ouvert aux membres connectés
  (compte unique EBOK — « 1 compte, 10 outils »), validation avant publication.
- Filtres par catégorie, niveau, région, réseau social.

## Stack (standard de la galaxie)

- **Next.js** (App Router) déployé sur **Vercel** — sous-domaine `medias.ebok.fr`
- **Clerk** (compte unique de la galaxie EBOK, instance `clerk.ebok.fr`) :
  identité pour proposer une fiche et pour l'administration (voir
  `docs/AUTH.md` du repo [EBOK-BASKETBALL](https://github.com/marleyebok/EBOK-BASKETBALL))
- **Neon Postgres**, schéma `medias`
- Barre commune `ebok-galaxy.js` en haut de page, comme sur toutes les apps

## Statut

🟠 **En développement** — la première version est en place :

- Next.js 16 (App Router), 100 % statique pour l'instant.
- Annuaire dans `data/medias.ts` (même philosophie que le site mère :
  les fiches sont des données, jamais du HTML en dur).
- Filtres par catégorie + recherche, fiches d'exemple marquées
  `example: true` à remplacer par de vraies fiches vérifiées.
- Barre galaxie commune (`public/ebok-galaxy.js`).
- **Formulaire « Proposer un média »** (`/proposer`) : réservé aux membres
  connectés (compte EBOK via Clerk) — nom, catégorie, présentation, liens,
  logo/photo (2 Mo max), e-mail de contact — avec champ-piège anti-spam.
- **Espace administrateur** (`/admin`) : réservé aux comptes EBOK dont
  l'e-mail figure dans l'allowlist admin (voir `lib/admin.ts`). Fiches en
  attente avec boutons Publier / Refuser, **modification** de toute fiche
  (nom, catégorie, texte, liens, image) et retrait d'une fiche déjà publiée.
  Les changements apparaissent dans l'annuaire au plus tard 5 minutes après.
- Stockage dans la base **Neon** de la galaxie (schéma `medias`, créé
  automatiquement au premier envoi). Sans base configurée, le site reste
  statique et le formulaire propose un repli par e-mail.

### Activer le formulaire et l'admin

Dans Vercel → projet EBOK-MEDIAS → Settings → Environment Variables :

| Variable | Valeur |
|---|---|
| `DATABASE_URL` | La « Connection string » du projet Neon « ebok » (console Neon → Connect) |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | `pk_live_…` — publique, même clé pour toute la galaxie |
| `CLERK_SECRET_KEY` | `sk_live_…` — clé serveur Clerk, la même que la galaxie |
| `ADMIN_EMAILS` | *(optionnel)* e-mails admin additionnels, séparés par des virgules |

Côté **Clerk** : ajouter `medias` aux *allowed subdomains* (comme `event`).
L'admin par défaut est `marley.ebok@gmail.com` (voir `lib/admin.ts`).

Puis redéployer.

### Activer l'upload d'images (optionnel)

Vercel → projet EBOK-MEDIAS → onglet **Storage** → **Create Database →
Blob** → connecter au projet. Vercel injecte tout seul la variable
`BLOB_READ_WRITE_TOKEN`. Sans Blob store, le formulaire fonctionne
quand même : l'image est simplement ignorée.

### Lancer en local

```bash
npm install
cp .env.example .env.local   # puis remplir les variables
npm run dev
```
