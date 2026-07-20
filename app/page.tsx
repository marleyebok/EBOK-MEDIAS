import Directory from "@/components/Directory";
import { CONTACT_EMAIL, MEDIAS } from "@/data/medias";

const mailSubject = encodeURIComponent("EBOK Médias — proposer une fiche");
const mailBody = encodeURIComponent(
  "Bonjour,\n\nJe souhaite proposer une fiche pour l'annuaire EBOK Médias :\n\n— Nom du média / compte :\n— Catégorie (presse, podcast, joueur, coach, club, créateur) :\n— Présentation en une phrase :\n— Liens (site, Instagram, X, YouTube, TikTok, Twitch) :\n\nMerci !"
);

export default function Home() {
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

      <main className="wrap">
        <section className="hero">
          <span className="eyebrow">Galaxie EBOK · 1 compte, 10 outils</span>
          <h1>
            Celles et ceux qui font <span className="hl">vivre le basket</span>
          </h1>
          <p className="lede">
            Presse, podcasts, joueurs, coachs, clubs et créateurs de contenu :
            retrouvez tous leurs réseaux au même endroit — et donnez-leur de la
            visibilité.
          </p>
        </section>

        <Directory medias={MEDIAS} />

        <section className="propose" id="proposer">
          <h2>Vous êtes un média ?</h2>
          <p>
            Journaliste, podcasteur, joueur, coach, club ou créateur : proposez
            votre fiche et rejoignez l&apos;annuaire. C&apos;est gratuit — le but est de
            faire connaître tout ce que le basket francophone produit.
          </p>
          <a
            className="btn"
            href={`mailto:${CONTACT_EMAIL}?subject=${mailSubject}&body=${mailBody}`}
          >
            Proposer un média
          </a>
        </section>
      </main>

      <footer className="site-footer">
        <div className="wrap">
          EBOK Médias — un outil de la galaxie{" "}
          <a href="https://ebok-basketball.vercel.app">EBOK Basketball</a> · ©
          2026
        </div>
      </footer>
    </>
  );
}
