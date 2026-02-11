import { useEffect, useMemo, useState, useRef } from "react";
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

  ///////////////////////
  /// GALLERY LOGIC /////
  ///////////////////////

  const galleryRef = useRef(null);
  const [paused, setPaused] = useState(false);
  const resumeTimerRef = useRef(null);

  const galleryItems = useMemo(() => {
    return (gallery || []).map((img, idx) => ({
      img: img.url,
      alt: img.alt || `${data?.projectTitle || "Project"} photo ${idx + 1}`,
    }));
  }, [gallery, data?.projectTitle]);

  // Duplicate list for seamless loop
  const railItems = useMemo(
    () => [...galleryItems, ...galleryItems],
    [galleryItems]
  );

  useEffect(() => {
    const el = galleryRef.current;
    if (!el) return;

    // reduced-motion users
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (reduce) return;

    // if there are no items, do nothing
    if (!galleryItems.length) return;

    let raf = 0;
    let last = performance.now();

    // pixels per second , anything less than ~50 is probably too slowto move
    const speed = 100;

    const tick = (now) => {
      const dt = (now - last) / 1000;
      last = now;

      if (!paused) {
        el.scrollLeft += speed * dt;

        // jump back by half (end of first copy)
        const half = el.scrollWidth / 2;
        if (el.scrollLeft >= half) el.scrollLeft -= half;
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [paused, galleryItems.length]);

  const pauseTemporarily = () => {
    setPaused(true);

    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      setPaused(false);
    }, 900);
  };

  const resumeNow = () => {
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    setPaused(false);
  };

  useEffect(() => {
    const onUp = () => resumeNow();

    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    window.addEventListener("touchend", onUp, { passive: true });
    window.addEventListener("touchcancel", onUp, { passive: true });

    return () => {
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      window.removeEventListener("touchend", onUp);
      window.removeEventListener("touchcancel", onUp);
    };
  }, []);


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
                <p className="ppSub">Photos from the field. Planning, progress, and results.</p>
              </header>

              <div className="recentRailWrap">
                {galleryItems.length ? (
                  <div
                    className="recentRail autoScroll"
                    ref={galleryRef}
                    onMouseEnter={() => setPaused(true)}
                    onMouseLeave={() => setPaused(false)}
                    onPointerDown={(e) => {
                      e.currentTarget.setPointerCapture?.(e.pointerId);
                      pauseTemporarily();
                    }}
                    onPointerUp={resumeNow}
                    onPointerCancel={resumeNow}
                    onClick={resumeNow}
                  >
                    {railItems.map((item, i) => {
                      const isClone = i >= galleryItems.length;
                      return (
                        <div className="recentCard" key={`${item.alt}-${i}`} aria-hidden={isClone}>
                          <img
                            src={item.img}
                            alt={isClone ? "" : item.alt}
                            loading="lazy"
                            draggable="false"
                          />
                        </div>
                      );
                    })}
                  </div>
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
