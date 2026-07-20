import type { Metadata } from "next";
import { CATEGORIES } from "@/data/medias";
import { hasDb, listSubmissions, type Submission } from "@/lib/db";
import { adminConfigured, isAdmin } from "@/lib/admin-session";
import { decide, login, logout } from "./actions";

export const metadata: Metadata = {
  title: "Administration — EBOK Médias",
  robots: { index: false, follow: false },
};

function SubmissionCard({ sub }: { sub: Submission }) {
  const category = CATEGORIES[sub.category];
  return (
    <article className="card admin-card">
      <div className="card-top">
        <span className="badge">
          <span className="dot" style={{ background: category?.color ?? "#999" }} />
          {category?.label ?? sub.category}
        </span>
        <span className="badge">{new Date(sub.created_at).toLocaleDateString("fr-FR")}</span>
      </div>
      <h3>{sub.name}</h3>
      <p>{sub.description}</p>
      <div className="links">
        {Object.entries(sub.links).map(([kind, url]) => (
          <a key={kind} className="link-btn" href={url} target="_blank" rel="noopener noreferrer">
            {kind}
          </a>
        ))}
      </div>
      {sub.contact_email && <p className="form-note">Contact : {sub.contact_email}</p>}
      <div className="admin-actions">
        <form action={decide}>
          <input type="hidden" name="id" value={sub.id} />
          <input type="hidden" name="decision" value="approved" />
          <button className="submit-btn" type="submit">
            ✓ Publier
          </button>
        </form>
        <form action={decide}>
          <input type="hidden" name="id" value={sub.id} />
          <input type="hidden" name="decision" value="rejected" />
          <button className="reject-btn" type="submit">
            ✗ Refuser
          </button>
        </form>
      </div>
    </article>
  );
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ erreur?: string }>;
}) {
  const { erreur } = await searchParams;
  const authed = await isAdmin();

  let pending: Submission[] = [];
  let approved: Submission[] = [];
  let dbError = false;
  if (authed && hasDb()) {
    try {
      [pending, approved] = await Promise.all([
        listSubmissions("pending"),
        listSubmissions("approved"),
      ]);
    } catch {
      dbError = true;
    }
  }

  return (
    <main className="wrap form-wrap">
      <section className="hero hero-compact">
        <span className="eyebrow">EBOK Médias</span>
        <h1>
          Administration <span className="hl">de l&apos;annuaire</span>
        </h1>
      </section>

      {!adminConfigured() ? (
        <p className="form-error">
          L&apos;administration n&apos;est pas encore activée : ajoutez la variable
          d&apos;environnement <code>ADMIN_PASSWORD</code> (voir README).
        </p>
      ) : !authed ? (
        <form className="proposal-form login-form" action={login}>
          {erreur === "mdp" && <p className="form-error">Mot de passe incorrect.</p>}
          <label>
            Mot de passe administrateur
            <input name="password" type="password" required autoFocus />
          </label>
          <button className="submit-btn" type="submit">
            Se connecter
          </button>
        </form>
      ) : (
        <>
          <div className="admin-bar">
            <p>
              <strong>{pending.length}</strong> fiche{pending.length > 1 ? "s" : ""} en
              attente · <strong>{approved.length}</strong> publiée
              {approved.length > 1 ? "s" : ""}
            </p>
            <form action={logout}>
              <button className="reject-btn" type="submit">
                Se déconnecter
              </button>
            </form>
          </div>

          {!hasDb() && (
            <p className="form-error">
              Base de données non configurée (<code>DATABASE_URL</code> manquante).
            </p>
          )}
          {dbError && (
            <p className="form-error">
              Base de données injoignable — vérifiez <code>DATABASE_URL</code> et
              réessayez.
            </p>
          )}

          <h2 className="admin-h2">En attente de validation</h2>
          {pending.length === 0 ? (
            <p className="form-note">Aucune fiche en attente. 🏖️</p>
          ) : (
            <div className="grid">
              {pending.map((sub) => (
                <SubmissionCard key={sub.id} sub={sub} />
              ))}
            </div>
          )}

          <h2 className="admin-h2">Dernières fiches publiées</h2>
          {approved.length === 0 ? (
            <p className="form-note">Aucune fiche publiée via le formulaire pour l&apos;instant.</p>
          ) : (
            <div className="grid">
              {approved.slice(0, 12).map((sub) => (
                <article key={sub.id} className="card">
                  <h3>{sub.name}</h3>
                  <p>{sub.description}</p>
                </article>
              ))}
            </div>
          )}
        </>
      )}
    </main>
  );
}
