/**
 * Source de vérité de l'annuaire EBOK Médias.
 *
 * Pour AJOUTER / MODIFIER / RETIRER une fiche : édite uniquement ce fichier.
 * Même philosophie que `src/data/tools.ts` du site mère : les composants
 * lisent ces données, jamais de contenu en dur dans le HTML.
 *
 * ⚠️ Les fiches marquées `example: true` sont des EXEMPLES de démarrage
 * destinés à montrer le rendu : le responsable médias doit les remplacer
 * par de vraies fiches vérifiées (liens officiels contrôlés à la main).
 */

export type CategoryKey =
  | 'presse'
  | 'podcast'
  | 'joueur'
  | 'coach'
  | 'club'
  | 'createur';

export interface Category {
  /** Libellé affiché sur les filtres et les cartes. */
  label: string;
  /** Pluriel pour les compteurs. */
  plural: string;
  /** Couleur de la pastille de catégorie. */
  color: string;
}

export const CATEGORIES: Record<CategoryKey, Category> = {
  presse: { label: 'Presse & actu', plural: 'presse & actu', color: '#2E6FD6' },
  podcast: { label: 'Podcast & émission', plural: 'podcasts & émissions', color: '#8A4CE0' },
  joueur: { label: 'Joueur · Joueuse', plural: 'joueurs & joueuses', color: '#E23A3A' },
  coach: { label: 'Coach & formation', plural: 'coachs & formateurs', color: '#1FA98C' },
  club: { label: 'Club & institution', plural: 'clubs & institutions', color: '#E08A2B' },
  createur: { label: 'Créateur de contenu', plural: 'créateurs de contenu', color: '#C8317E' },
};

/** Réseaux affichables sur une fiche (l'ordre = l'ordre d'affichage). */
export interface MediaLinks {
  site?: string;
  instagram?: string;
  x?: string;
  youtube?: string;
  tiktok?: string;
  twitch?: string;
}

export interface Media {
  /** Slug stable. */
  id: string;
  /** Nom affiché. */
  name: string;
  category: CategoryKey;
  /** Une phrase de présentation. */
  description: string;
  /** Liens officiels — TOUJOURS vérifiés à la main avant publication. */
  links: MediaLinks;
  /** Fiche d'exemple à remplacer par le responsable médias. */
  example?: boolean;
}

export const MEDIAS: Media[] = [
  {
    id: 'ffbb',
    name: 'FFBB',
    category: 'club',
    description:
      'La Fédération Française de BasketBall : l’actualité officielle du basket français, des équipes de France aux clubs amateurs.',
    links: { site: 'https://www.ffbb.com' },
  },
  {
    id: 'lnb',
    name: 'LNB — Betclic Élite',
    category: 'club',
    description:
      'La Ligue Nationale de Basket : championnats professionnels français, résultats, highlights et billetterie.',
    links: { site: 'https://www.lnb.fr' },
  },
  {
    id: 'bebasket',
    name: 'BeBasket',
    category: 'presse',
    description:
      'Média en ligne consacré au basket français : actualité quotidienne, transferts et interviews, de la Betclic Élite à la Nationale.',
    links: { site: 'https://www.bebasket.fr' },
  },
  {
    id: 'basketeurope',
    name: 'Basket Europe',
    category: 'presse',
    description:
      'L’actualité du basket français et européen : championnats, coupes d’Europe et équipes nationales.',
    links: { site: 'https://www.basketeurope.com' },
  },
  {
    id: 'exemple-podcast',
    name: 'Ton podcast ici',
    category: 'podcast',
    description:
      'Fiche d’exemple : un podcast basket francophone — remplace-la par une vraie fiche (liens vérifiés) via « Proposer un média ».',
    links: { site: 'https://ebok-basketball.vercel.app' },
    example: true,
  },
  {
    id: 'exemple-joueur',
    name: 'Ton compte de joueur·se ici',
    category: 'joueur',
    description:
      'Fiche d’exemple : un joueur ou une joueuse qui partage son quotidien, du départemental au pro.',
    links: { site: 'https://ebok-basketball.vercel.app' },
    example: true,
  },
  {
    id: 'exemple-coach',
    name: 'Ton contenu de coach ici',
    category: 'coach',
    description:
      'Fiche d’exemple : un coach ou formateur qui publie exercices, analyses et pédagogie.',
    links: { site: 'https://ebok-basketball.vercel.app' },
    example: true,
  },
  {
    id: 'exemple-createur',
    name: 'Ta chaîne ici',
    category: 'createur',
    description:
      'Fiche d’exemple : highlights, mixtapes, photo ou vidéo — les créateurs qui font vibrer le basket francophone.',
    links: { site: 'https://ebok-basketball.vercel.app' },
    example: true,
  },
];

/**
 * Adresse de contact temporaire (repli e-mail du formulaire).
 * À remplacer par medias@ebok-basketball.com après la Phase 0.
 */
export const CONTACT_EMAIL = 'marley.ebok@gmail.com';
