import type { Metadata } from "next";
import { CATEGORIES, type CategoryKey } from "@/data/medias";
import { hasDb, listSubmissions, type Submission } from "@/lib/db";
import { LINK_KEYS } from "@/lib/parse";
import { adminConfigured, isAdmin } from "@/lib/admin-session";
import { decide, edit, login, logout } from "./actions";

export const metadata: Metadata = {
  title: "Administration — EBOK Médias",
  robots: { index: false, follow: false },
};

const LINK_LABELS: Record<string, string> = {
  site: "Site web",
  instagram: "Instagram",
  x: "X (Twitter)",
  youtube: "YouTube",
  tiktok: "TikTok",
  twitch: "Twitch",
};

/** Formulaire de modification, replié sous chaque fiche. */
function EditForm({ sub }: { sub: Submission }) {
  return (
    <details className="edit-details">
      <summary>✎ Modifier la fiche</summary>
      <form className="proposal-form edit-form" action={edit}>
        <input type="hidden" name="id" value={sub.id} />
        <label>
          Nom
          <input name="name" type="text" required maxLength={80} defaultValue={sub.name} />
        </label>
        <label>
          Catégorie
          <select name="category" required defaultValue={sub.category}>
            {(Object.keys(CATEGORIES) as CategoryKey[]).map((key) => (
              <option key={key} value={key}>
                {CATEGORIES[key].label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Présentation
          <textarea name="description" required maxLength={400} rows={3} defaultValue={sub.description} />
        </label>
        {LINK_KEYS.map((key) => (
          <label key={key}>
            {LINK_LABELS[key]}
            <input name={key} type="text" defaultValue={sub.links[key] ?? ""} />
          </label>
        ))}
        <label>
          URL de l&apos;image (vider pour retirer)
          <input name="image_url" type="text" defaultValue={sub.image_url ?? ""} />
        </label>
        <button className="submit-btn" type="submit">
          Enregistrer les modifications
        </button>
      </form>
    </details>
  );
}

function SubmissionCard({ sub }: { sub: Submission }) {
  const category = CATEGORIES[sub.category];
  const isPending = sub.status === "pending";
  return (
    <article className="card admin-card">
      <div className="card-top">
        <span className="badge">
          <span className="dot" style={{ background: category?.color ?? "#999" }} />
          {category?.label ?? sub.category}
        </span>
        <span className="badge">{new Date(sub.created_at).toLocaleDateString("fr-FR")}</span>
      </div>
      <div className="card-id">
        {sub.image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="card-logo" src={sub.image_url} alt="" loading="lazy" />
        )}
        <h3>{sub.name}</h3>
      </div>
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
        {isPending ? (
          <>
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
          </>
        ) : (
          <form action={decide}>
            <input type="hidden" name="id" value={sub.id} />
            <input type="hidden" name="decision" value="rejected" />
            <button className="reject-btn" type="submit">
              Retirer de l&apos;annuaire
            </button>
          </form>
        )}
      </div>
      <EditForm sub={sub} />
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
    <main className="wrap form-wrap admin-wrap">
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
              {approved.length > 1 ? "s" : ""} via le formulaire
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

          <h2 className="admin-h2">Fiches publiées</h2>
          <p className="form-note">
            Les fiches « de fondation » (FFBB, LNB…) vivent dans{" "}
            <code>data/medias.ts</code> et se modifient dans le code.
          </p>
          {approved.length === 0 ? (
            <p className="form-note">Aucune fiche publiée via le formulaire pour l&apos;instant.</p>
          ) : (
            <div className="grid">
              {approved.map((sub) => (
                <SubmissionCard key={sub.id} sub={sub} />
              ))}
            </div>
          )}
        </>
      )}
    </main>
  );
}
