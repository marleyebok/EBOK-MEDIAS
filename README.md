# EBOK Médias 📣🏀

> **L'annuaire des médias du basket francophone.**
> Repo réservé — le développement n'a pas encore commencé.

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

## Fonctionnement prévu

- Consultation **publique, sans compte** : l'annuaire doit se partager
  facilement.
- **Proposer une fiche** : formulaire ouvert aux membres connectés
  (compte unique EBOK — « 1 compte, 10 outils »), validation avant publication.
- Filtres par catégorie, niveau, région, réseau social.

## Stack prévue (standard de la galaxie)

- **Next.js** (App Router) déployé sur **Vercel** — sous-domaine
  `medias.ebok-basketball.com`
- **Clerk** pour les propositions de fiches (voir `docs/AUTH.md` du repo
  [EBOK-BASKETBALL](https://github.com/marleyebok/EBOK-BASKETBALL))
- **Neon Postgres**, schéma `medias` + référence à la table partagée
  `shared.users`
- Barre commune `ebok-galaxy.js` en haut de page, comme sur toutes les apps

## Statut

🟠 **En développement** — la première version est en place :

- Next.js 16 (App Router), 100 % statique pour l'instant.
- Annuaire dans `data/medias.ts` (même philosophie que le site mère :
  les fiches sont des données, jamais du HTML en dur).
- Filtres par catégorie + recherche, fiches d'exemple marquées
  `example: true` à remplacer par de vraies fiches vérifiées.
- Barre galaxie commune (`public/ebok-galaxy.js`).
- **Formulaire « Proposer un média »** (`/proposer`) : nom, catégorie,
  présentation, liens, logo/photo (2 Mo max), e-mail de contact — avec
  champ-piège anti-spam.
- **Espace administrateur** (`/admin`) : fiches en attente avec boutons
  Publier / Refuser, **modification** de toute fiche (nom, catégorie,
  texte, liens, image) et retrait d'une fiche déjà publiée. Les
  changements apparaissent dans l'annuaire au plus tard 5 minutes après.
- Stockage dans la base **Neon** de la galaxie (schéma `medias`, créé
  automatiquement au premier envoi). Sans base configurée, le site reste
  statique et le formulaire propose un repli par e-mail.

### Activer le formulaire et l'admin (2 variables d'environnement)

Dans Vercel → projet EBOK-MEDIAS → Settings → Environment Variables :

| Variable | Valeur |
|---|---|
| `DATABASE_URL` | La « Connection string » du projet Neon « ebok » (console Neon → Connect) |
| `ADMIN_PASSWORD` | Le mot de passe de la page `/admin` (choisis-le long) |

Puis redéployer. Le mot de passe admin est provisoire : il sera remplacé
par le compte unique EBOK (Clerk) en Phase 3.

### Activer l'upload d'images (optionnel)

Vercel → projet EBOK-MEDIAS → onglet **Storage** → **Create Database →
Blob** → connecter au projet. Vercel injecte tout seul la variable
`BLOB_READ_WRITE_TOKEN`. Sans Blob store, le formulaire fonctionne
quand même : l'image est simplement ignorée.

### Lancer en local

```bash
npm install
cp .env.example .env.local   # puis remplir les 2 variables
npm run dev
```
