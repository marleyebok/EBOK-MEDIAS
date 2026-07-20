"use client";

import { useMemo, useState } from "react";
import { CATEGORIES, type CategoryKey, type Media } from "@/data/medias";

const LINK_LABELS: Record<string, string> = {
  site: "Site",
  instagram: "Instagram",
  x: "X",
  youtube: "YouTube",
  tiktok: "TikTok",
  twitch: "Twitch",
};

export default function Directory({ medias }: { medias: Media[] }) {
  const [category, setCategory] = useState<CategoryKey | "all">("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return medias.filter((m) => {
      if (category !== "all" && m.category !== category) return false;
      if (q && !`${m.name} ${m.description}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [medias, category, query]);

  return (
    <section aria-label="Annuaire des médias">
      <div className="filters" role="group" aria-label="Filtrer par catégorie">
        <button
          className={`chip${category === "all" ? " active" : ""}`}
          onClick={() => setCategory("all")}
        >
          Tous
        </button>
        {(Object.keys(CATEGORIES) as CategoryKey[]).map((key) => (
          <button
            key={key}
            className={`chip${category === key ? " active" : ""}`}
            onClick={() => setCategory(key)}
          >
            {CATEGORIES[key].label}
          </button>
        ))}
      </div>

      <input
        className="search"
        type="search"
        placeholder="Rechercher un média, un nom…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Rechercher dans l'annuaire"
      />

      <p className="count">
        {filtered.length} fiche{filtered.length > 1 ? "s" : ""}
        {category !== "all" ? ` · ${CATEGORIES[category].plural}` : ""}
      </p>

      <div className="grid">
        {filtered.map((m) => (
          <article key={m.id} className={`card${m.example ? " example" : ""}`}>
            <div className="card-top">
              <span className="badge">
                <span
                  className="dot"
                  style={{ background: CATEGORIES[m.category].color }}
                />
                {CATEGORIES[m.category].label}
              </span>
              {m.example && <span className="example-tag">exemple</span>}
            </div>
            <h3>{m.name}</h3>
            <p>{m.description}</p>
            <div className="links">
              {Object.entries(m.links).map(([kind, url]) =>
                url ? (
                  <a
                    key={kind}
                    className="link-btn"
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {LINK_LABELS[kind] ?? kind}
                  </a>
                ) : null
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
