import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "../styles/project-detail.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";

function parseTags(csv) {
  return (csv || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

export default function ProjectDetail() {
  const { slug } = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const ac = new AbortController();

    (async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`${API_BASE}/api/projects/${slug}`, { signal: ac.signal });
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        const json = await res.json();

        setData(json);
      } catch (e) {
        if (e?.name !== "AbortError") setError(e?.message || "Failed to load project.");
      } finally {
        setLoading(false);
      }
    })();

    return () => ac.abort();
  }, [slug]);

  const tags = useMemo(() => parseTags(data?.projectTags), [data?.projectTags]);

  const mainImg =
    data?.mainImageUrl ||
    (data?.projectImages?.length ? data.projectImages[0].url : "");

  const gallery = useMemo(() => {
    const imgs = data?.projectImages || [];
    return [...imgs].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  }, [data?.projectImages]);

  return (
    <main className="ppPage">
      <section className="ppHero" aria-label="Project header">
        <div className="container">
          <div className="ppHeroTop">
            <Link className="ppBack" to="/projects">
              ‹ Back to projects
            </Link>
          </div>

          {loading && <div className="ppState">Loading project…</div>}
          {error && <div className="ppState ppError">Couldn’t load this project. ({error})</div>}

          {data && (
            <div className="ppHeroRow">
              <div className="ppHeroLeft">
                <h1 className="ppTitle">{data.projectTitle}</h1>

                {tags.length > 0 && (
                  <div className="ppTags" aria-label="Project tags">
                    {tags.map((t) => (
                      <span className="ppTag" key={t}>
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="ppHeroRight">
                <p className="ppBlurb">{data.heroBlurb || ""}</p>
                <span className={`ppStatus ${data.isCompleted ? "ppStatusDone" : ""}`}>
                  {data.isCompleted ? "Completed" : "Ongoing"}
                </span>
              </div>
            </div>
          )}
        </div>
      </section>

      {data && (
        <>
          {/* WHAT THIS MEANS */}
          <section className="ppBand" aria-label="What this means">
            <div className="container">
              <div className="ppBandRow">
                <div className="ppMainMedia">
                  {mainImg ? (
                    <img className="ppMainImg" src={mainImg} alt={data.projectTitle} loading="lazy" />
                  ) : (
                    <div className="ppMainPlaceholder" aria-hidden="true" />
                  )}
                </div>

                <div className="ppMeaning">
                  <div className="ppEyebrow">What this means</div>
                  <h2 className="ppH2">A REAL PROJECT, WITH REAL IMPACT</h2>
                  <p className="ppLong">{data.projectLongDesc || "More details will be posted soon."}</p>
                </div>
              </div>
            </div>
          </section>

          {/* GALLERY */}
          <section className="ppGallery" aria-label="Project gallery">
            <div className="container">
              <header className="ppGalleryHead">
                <div className="ppEyebrow">Gallery</div>
                <h2 className="ppH2">SEE THE WORK</h2>
                <p className="ppSub">Photos from the field — planning, progress, and results.</p>
              </header>

              <div className="ppGrid">
                {gallery.length ? (
                  gallery.map((img, idx) => (
                    <figure className="ppCell" key={`${img.url}-${idx}`}>
                      <img
                        src={img.url}
                        alt={img.alt || `${data.projectTitle} photo ${idx + 1}`}
                        loading="lazy"
                      />
                    </figure>
                  ))
                ) : (
                  <div className="ppEmpty">No gallery photos yet.</div>
                )}
              </div>
            </div>
          </section>
        </>
      )}
    </main>
  );
}
