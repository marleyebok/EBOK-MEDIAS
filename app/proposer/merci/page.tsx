import Link from "next/link";

export default function MerciPage() {
  return (
    <main className="wrap form-wrap">
      <section className="hero">
        <span className="eyebrow">Fiche envoyée</span>
        <h1>
          Merci ! <span className="hl">🏀</span>
        </h1>
        <p className="lede">
          Votre fiche est bien reçue. Un administrateur la relit avant
          publication — elle apparaîtra dans l&apos;annuaire une fois validée.
        </p>
        <p style={{ marginTop: 24 }}>
          <Link className="submit-btn" href="/">
            Retour à l&apos;annuaire
          </Link>
        </p>
      </section>
    </main>
  );
}
