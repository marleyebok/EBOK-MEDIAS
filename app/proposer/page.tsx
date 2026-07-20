import type { Metadata } from "next";
import { CATEGORIES, CONTACT_EMAIL, type CategoryKey } from "@/data/medias";
import { hasDb } from "@/lib/db";
import { submitProposal } from "./actions";

export const metadata: Metadata = {
  title: "Proposer un média — EBOK Médias",
  description:
    "Proposez votre fiche à l'annuaire EBOK Médias : presse, podcast, joueur, coach, club ou créateur de contenu basket.",
};

const ERRORS: Record<string, string> = {
  champs: "Le nom, la catégorie et la description sont obligatoires.",
  liens: "Indiquez au moins un lien (site ou réseau social).",
  indisponible:
    "Le formulaire n'est pas encore activé — utilisez le bouton e-mail ci-dessous.",
};

export default async function ProposerPage({
  searchParams,
}: {
  searchParams: Promise<{ erreur?: string }>;
}) {
  const { erreur } = await searchParams;
  const formEnabled = hasDb();

  return (
    <>
      <header className="site-header">
        <div className="wrap">
          <a className="brand" href="/">
            <span className="brand-name">
              EBOK <em>MÉDIAS</em>
            </span>
            <span className="brand-tag">l&apos;annuaire du basket francophone</span>
          </a>
        </div>
      </header>

      <main className="wrap form-wrap">
        <section className="hero hero-compact">
          <span className="eyebrow">Rejoindre l&apos;annuaire</span>
          <h1>
            Proposer <span className="hl">un média</span>
          </h1>
          <p className="lede">
            Journaliste, podcasteur, joueur, coach, club ou créateur : remplissez
            cette fiche. Un administrateur la relit avant publication — comptez
            quelques jours.
          </p>
        </section>

        {erreur && ERRORS[erreur] && <p className="form-error">{ERRORS[erreur]}</p>}

        {formEnabled ? (
          <form className="proposal-form" action={submitProposal}>
            <label>
              Nom du média ou du compte *
              <input name="name" type="text" required maxLength={80} placeholder="Ex. : Podcast Contre-Attaque" />
            </label>

            <label>
              Catégorie *
              <select name="category" required defaultValue="">
                <option value="" disabled>
                  Choisir…
                </option>
                {(Object.keys(CATEGORIES) as CategoryKey[]).map((key) => (
                  <option key={key} value={key}>
                    {CATEGORIES[key].label}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Présentation en une ou deux phrases *
              <textarea
                name="description"
                required
                maxLength={400}
                rows={3}
                placeholder="Qui êtes-vous, que publiez-vous, pour qui ?"
              />
            </label>

            <fieldset>
              <legend>Vos liens (au moins un) *</legend>
              <label>
                Site web
                <input name="site" type="text" placeholder="https://…" />
              </label>
              <label>
                Instagram
                <input name="instagram" type="text" placeholder="https://instagram.com/…" />
              </label>
              <label>
                X (Twitter)
                <input name="x" type="text" placeholder="https://x.com/…" />
              </label>
              <label>
                YouTube
                <input name="youtube" type="text" placeholder="https://youtube.com/…" />
              </label>
              <label>
                TikTok
                <input name="tiktok" type="text" placeholder="https://tiktok.com/@…" />
              </label>
              <label>
                Twitch
                <input name="twitch" type="text" placeholder="https://twitch.tv/…" />
              </label>
            </fieldset>

            <label>
              Votre e-mail (pour vous répondre, jamais publié)
              <input name="email" type="email" maxLength={120} placeholder="vous@exemple.fr" />
            </label>

            {/* Champ-piège anti-spam, invisible pour les humains. */}
            <input
              className="trap"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />

            <button className="submit-btn" type="submit">
              Envoyer ma fiche
            </button>
            <p className="form-note">
              * champs obligatoires. Les fiches sont validées manuellement avant
              publication.
            </p>
          </form>
        ) : (
          <div className="form-fallback">
            <p>
              Le formulaire en ligne arrive très bientôt. En attendant, envoyez
              votre fiche par e-mail : nom, catégorie, présentation et liens.
            </p>
            <a
              className="submit-btn"
              href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
                "EBOK Médias — proposer une fiche"
              )}`}
            >
              Proposer par e-mail
            </a>
          </div>
        )}
      </main>

      <footer className="site-footer">
        <div className="wrap">
          EBOK Médias — un outil de la galaxie{" "}
          <a href="https://ebok-basketball.vercel.app">EBOK Basketball</a> · © 2026
        </div>
      </footer>
    </>
  );
}
