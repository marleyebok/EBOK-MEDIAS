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
- Bouton « Proposer un média » par e-mail, en attendant le formulaire
  connecté au compte unique.

### Lancer en local

```bash
npm install
npm run dev
```
