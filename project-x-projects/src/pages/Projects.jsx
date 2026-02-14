import { useEffect, useState, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import "../styles/projects.css";

import water1 from "../assets/recent/recent-1.png";
import water2 from "../assets/recent/recent-10.jpg";
import water3 from "../assets/recent/recent-12.jpg";

import celebration from "../assets/projects/celebration.mp4";

import muslimhandsLogo from "../assets/partners/muslinhands-logo.png";
import mjtfLogo from "../assets/partners/mtjf-logo.png";
import dehamLogo from "../assets/partners/deham-logo.png";
import arsalanLogo from "../assets/partners/arsalaan-logo.png";

import locationIcon from "../assets/projects/location-icon.png";

const API_BASE = import.meta.env.VITE_API_URL;

function parseTags(csv) {
  return (csv || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

function mapApiProjectToCard(p) {
  return {
    projectId: p.projectId,
    slug: p.slug,
    title: p.projectTitle,
    desc: p.projectShortDesc,
    tags: parseTags(p.projectTags),
    img: p.cardImageUrl, // will add r2 link after
  };
}

export default function Projects() {
  const cards = [
    {
      kicker: "Clean Water Access",
      title: "WELLS AND HAND PUMPS",
      desc: "Delivering reliable clean water so families can thrive without the daily struggle",
      img: water1,
    },
    {
      kicker: "Faith & Community",
      title: "MOSQUES AND COMMUNITY SPACES",
      desc: "Building welcoming spaces for worship, learning, and gathering at the heart of communities.",
      img: water2,
    },
    {
      kicker: "Emergency Relief & Care",
      title: "SUPPORT WHERE IT'S NEEDED MOST",
      desc: "Providing ongoing support for orphans and widowed families with dignity and consistency.",
      img: water3,
    },
  ];

  const projectImpactStats = [
    { value: "50+", label: "WELLS INSTALLED ACROSS REGIONS" },
    { value: "15+", label: "MOSQUES AND SCHOOLS BUILT" },
    { value: "1000+", label: "FAMILIES SUPPORTED AND SPONSORED" },
  ];

  const partnerTiles = [
    {
      name: "Muslim Hands",
      href: "https://muslimhands.ca/home",
      logo: muslimhandsLogo,
      aria: "Muslim Hands website",
    },
    {
      name: "MJTF",
      href: "https://mjtf.org",
      logo: mjtfLogo,
      aria: "MJTF website",
    },
    {
      name: "Deham",
      href: "https://deham.org",
      logo: dehamLogo,
      aria: "Deham website",
    },
    {
      name: "Arsalan Helpline",
      href: "https://arsalanhelpline.org",
      logo: arsalanLogo,
      aria: "Arsalan Helpline website",
    },
  ];

  function getColsForViewport() {
    if (typeof window === "undefined") return 3;
    const w = window.innerWidth;
    if (w < 620) return 1;
    if (w < 980) return 2;
    return 3;
  }

  //projects from backend
  const [currentNow, setCurrentNow] = useState([]);
  const [completedProjects, setCompletedProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [projectsError, setProjectsError] = useState("");

  // Existing UI states
  const [showAllCurrent, setShowAllCurrent] = useState(false);
  const [showAllCompleted, setShowAllCompleted] = useState(false);
  const [cols, setCols] = useState(getColsForViewport());

  const [workTab, setWorkTab] = useState("current"); // "current" | "completed"

  useEffect(() => {
    const onResize = () => setCols(getColsForViewport());
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Fetch ACTIVE + COMPLETED
  useEffect(() => {
    const ac = new AbortController();

    (async () => {
      try {
        setLoadingProjects(true);
        setProjectsError("");

        const [active, completed] = await Promise.all([
          fetch(`${API_BASE}/api/projects?status=ACTIVE`, { signal: ac.signal }).then((r) => {
            if (!r.ok) throw new Error(`ACTIVE: ${r.status}`);
            return r.json();
          }),
          fetch(`${API_BASE}/api/projects?status=COMPLETED`, { signal: ac.signal }).then((r) => {
            if (!r.ok) throw new Error(`COMPLETED: ${r.status}`);
            return r.json();
          }),
        ]);

        setCurrentNow(active.map(mapApiProjectToCard));
        setCompletedProjects(completed.map(mapApiProjectToCard));
      } catch (e) {
        if (e?.name !== "AbortError") {
          setProjectsError(e?.message || "Failed to load projects.");
        }
      } finally {
        setLoadingProjects(false);
      }
    })();

    return () => ac.abort();
  }, []);

  const visibleCurrentNow = showAllCurrent ? currentNow : currentNow.slice(0, cols);
  const canToggleCurrent = currentNow.length > cols;

  const visibleCompleted = showAllCompleted ? completedProjects : completedProjects.slice(0, cols);
  const canToggleCompleted = completedProjects.length > cols;
  

  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = async () => {
    const v = videoRef.current;
    if (!v) return;

    if (v.paused) {
      try {
        await v.play();
        setIsPlaying(true);
      } catch (e) {
        console.error(e);
      }
    } else {
      v.pause();
      setIsPlaying(false);
    }
  };



  function dateParts(iso) {
    // iso is "YYYY-MM-DD"
    const d = new Date(`${iso}T00:00:00`);
    const dow = d.toLocaleDateString(undefined, { weekday: "short" }); // Sat
    const day = d.getDate(); // 15
    const monthYear = d.toLocaleDateString(undefined, { month: "short", year: "numeric" }); // Mar 2025
    return { dow, day, monthYear };
  }

  // Events state
  const [eventView, setEventView] = useState("UPCOMING"); // UPCOMING | PASSED
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [eventsErr, setEventsErr] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setEventsErr("");
      setEventsLoading(true);

      try {
        const [up, past] = await Promise.all([
          fetch(`${API_BASE}/api/events`).then((r) => r.json()),
          fetch(`${API_BASE}/api/events?status=PASSED`).then((r) => r.json()),
        ]);

        if (cancelled) return;

        setUpcomingEvents(Array.isArray(up) ? up : []);
        setPastEvents(Array.isArray(past) ? past : []);
      } catch (e) {
        if (!cancelled) setEventsErr("Couldn’t load events right now.");
      } finally {
        if (!cancelled) setEventsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const eventsToShow = useMemo(() => {
    return eventView === "UPCOMING" ? upcomingEvents : pastEvents;
  }, [eventView, upcomingEvents, pastEvents]);

  //Show Poster
  const [activePoster, setActivePoster] = useState(null); // { src, alt } | null

  const openPoster = (src, alt = "Event poster") => {
    if (!src) return;
    setActivePoster({ src, alt });
  };

  const closePoster = () => setActivePoster(null);

  useEffect(() => {
    if (!activePoster) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") closePoster();
    };

    document.addEventListener("keydown", onKeyDown);
    // optional: prevent background scroll while open
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [activePoster]);

  //scroll helper
  const scrollToProjectsWork = () => {
    requestAnimationFrame(() => {
      const el = document.getElementById("projects-work");
      if (!el) return;
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };


  return (
    <main className="projectsPage">
      {/* PAGE HEADER */}
      <section className="projectsTop" aria-label="Projects header">
        <div className="container">
          <h1 className="projectsTitle">OUR PROJECTS & EVENTS</h1>
          <p className="projectsSub">
            Projects <span className="xproj"> X</span> Projects acts locally and builds globally. See the work
            P<span className="xproj">X</span>P is doing right now.
          </p>
          
          
          <div className="projectsJumpLinks" aria-label="Jump links">
            <Link className="projectsJumpLink" to="#projects-work">
              <span aria-hidden="true">↓</span> Jump to Projects 
            </Link>
            <Link className="projectsJumpLink" to="#events">
              Jump to Events <span aria-hidden="true">↓</span>
            </Link>
          </div>
        </div>
      </section>

      {/* CATEGORY BLOCK */}
      <section className="projectsBlock" aria-label="Water projects">
        <div className="container">
          <header className="projectsBlockHeader">
            <div className="projectsEyebrow">CATEGORIES</div>
            <h2 className="projectsBlockTitle">FROM CLEAN WATER, TO COMMUNITY SPACES, TO OVERALL SUPPORT</h2>
            <p className="projectsBlockSub">
              Need is need. Suffering is Suffering. P<span className="xproj">X</span>P simply acts on that
            </p>
          </header>

          <div className="projectsGrid">
            {cards.map((c) => (
              <article className="projectCard" key={c.title}>
                <div className="projectMedia">
                  <img src={c.img} alt="" />
                </div>

                <div className="projectOverlay">
                  <div className="projectKicker">{c.kicker}</div>
                  <h3 className="projectTitle">{c.title}</h3>
                  <div className="projectDesc">{c.desc}</div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CURRENT + COMPLETED (toggle in one section) */}
      <section
        className={`projectsWorkToggle ${workTab === "completed" ? "isCompleted" : "isCurrent"}`}
        aria-label="Projects (current and completed)"
        id="projects-work"
      >
        <div className="container">
          <div className="workToggleHead">
            <div className="workToggleEyebrow">
              {workTab === "current" ? "Current" : "Completed"}
            </div>

            <h2 className="workToggleTitle">
              {workTab === "current" ? "WORK HAPPENING NOW" : "COMPLETED PROJECTS"}
            </h2>

            <p className="workToggleSub">
              {workTab === "current"
                ? "Each project addresses a real need in communities near and far."
                : "Completed work with real outcomes delivered to communities around the world."}
            </p>

            {loadingProjects && <p className="projectsLoadNote">Loading projects…</p>}
            {projectsError && (
              <p className="projectsLoadNote projectsLoadError">Couldn’t load: {projectsError}</p>
            )}

            <div className="workToggleTabs" role="tablist" aria-label="Project status toggle">
              <button
                type="button"
                className={`workToggleBtn ${workTab === "current" ? "isActive" : ""}`}
                onClick={() => setWorkTab("current")}
                role="tab"
                aria-selected={workTab === "current"}
              >
                Current projects
              </button>

              <button
                type="button"
                className={`workToggleBtn ${workTab === "completed" ? "isActive" : ""}`}
                onClick={() => setWorkTab("completed")}
                role="tab"
                aria-selected={workTab === "completed"}
              >
                Completed projects
              </button>
            </div>
          </div>

          {workTab === "current" ? (
            <>
              <div className="currentNowGrid">
                {visibleCurrentNow.map((p) => (

                    <article className="currentNowCard">
                      <div className="currentNowMedia">
                        {p.img ? (
                          <img src={p.img} alt={p.title} loading="lazy" />
                        ) : (
                          <div className="currentNowPlaceholder" aria-hidden="true" />
                        )}
                      </div>

                      <div className="currentNowBody">
                        <h3 className="currentNowCardTitle">{p.title}</h3>
                        <p className="currentNowDesc">{p.desc}</p>

                        <div className="currentNowTags">
                          {p.tags.map((t) => (
                            <span className="currentNowTag" key={t}>
                              {t}
                            </span>
                          ))}
                        </div>

                        <Link
                          to={`/projects/${p.slug}`}
                          className="projectViewLink"
                          aria-label={`View project: ${p.title}`}
                        >
                          View Project <span aria-hidden="true">›</span>
                        </Link>

                      </div>
                    </article>

                ))}
              </div>

              {canToggleCurrent && (
                <div className="currentNowAllRow">
                  <button
                    className="btn currentNowAllBtn"
                    type="button"
                    onClick={() => {
                      setShowAllCurrent((s) => {
                        const next = !s;
                        if (s && !next) scrollToProjectsWork(); 
                        return next;
                      });
                    }}
                  >
                    {showAllCurrent ? "Show less" : "View all"}
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="currentNowGrid">
                {visibleCompleted.map((p) => (
                  
                    <article className="currentNowCard">
                      <div className="currentNowMedia">
                        {p.img ? (
                          <img src={p.img} alt={p.title} loading="lazy" />
                        ) : (
                          <div className="currentNowPlaceholder" aria-hidden="true" />
                        )}
                      </div>

                      <div className="currentNowBody">
                        <h3 className="currentNowCardTitle">{p.title}</h3>
                        <p className="currentNowDesc">{p.desc}</p>

                        <div className="currentNowTags">
                          {p.tags.map((t) => (
                            <span className="currentNowTag" key={t}>
                              {t}
                            </span>
                          ))}
                        </div>

                        <Link
                          to={`/projects/${p.slug}`}
                          className="projectViewLink"
                          aria-label={`View project: ${p.title}`}
                        >
                          View Project <span aria-hidden="true">›</span>
                        </Link>

                      </div>
                    </article>
                  
                ))}
              </div>

              {canToggleCompleted && (
                <div className="completedAllRow">
                  <button
                    className="btn completedAllBtn"
                    type="button"
                    onClick={() => {
                      setShowAllCompleted((s) => {
                        const next = !s;
                        if (s && !next) scrollToProjectsWork(); // Show less
                        return next;
                      });
                    }}
                  >
                    {showAllCompleted ? "Show less" : "View all"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* COMMUNITY EVENTS */}
      <section className="giEvents" aria-label="Community events" id="events">
        <div className="container">
          <header className="giEventsHead">
            <div className="giEventsEyebrow">Community</div>
            <h2 className="giEventsTitle">EVENTS</h2>
            <p className="giEventsSub">Join us for gatherings that matter</p>
          </header>

          <div className="workToggleHead">

            <div className="workToggleTabs" role="tablist" aria-label="Event status toggle">
              <button
                type="button"
                className={`eventToggleBtn ${eventView === "UPCOMING" ? "isActive" : ""}`}
                onClick={() => setEventView("UPCOMING")}
                role="tab"
                aria-selected={eventView === "UPCOMING"}
              >
                Ongoing Events
              </button>

              <button
                type="button"
                className={`eventToggleBtn ${eventView === "PASSED" ? "isActive" : ""}`}
                onClick={() => setEventView("PASSED")}
                role="tab"
                aria-selected={eventView === "PASSED"}
              >
                Past Events
              </button>
            </div>
           
          </div>


          {eventsLoading && <div className="evHint">Loading events…</div>}
          {eventsErr && <div className="evError">{eventsErr}</div>}

          {!eventsLoading && !eventsErr && (
            <>
              <div className="evGrid" aria-label="Events grid">
                {eventsToShow.map((ev) => {
                  const tags = parseTags(ev.tags);
                  const tag = tags[0] || "Community";

                  const isPast = ev.status === "PASSED";
                  const label = isPast ? "Past event" : "Upcoming event";

                  const { dow, day, monthYear } = dateParts(ev.eventDate);

                  return (
                    <article key={ev.id} className={`evCard ${isPast ? "isPast" : ""}`}>
                      <div className="evMedia" aria-label="Event image">
                        {ev.imageUrl ? (
                          <button
                            type="button"
                            className="evPosterBtn"
                            onClick={() => openPoster(ev.imageUrl, ev.title || "Event poster")}
                            aria-label={`Open poster for ${ev.title || "event"}`}
                          >
                            <img src={ev.imageUrl} alt={ev.title || "Event poster"} loading="lazy" />
                          </button>
                        ) : (
                          <div className="evMediaPlaceholder" aria-hidden="true">Image</div>
                        )}

                        <div className="evDate">
                          <div className="evDow">{dow}</div>
                          <div className="evDay">{day}</div>
                          <div className="evMY">{monthYear}</div>
                        </div>
                      </div>

                      <div className="evBody">
                          <div className="evTags">
                            {tags.map((t) => (
                              <span className="evTag" key={t}>
                                {t}
                              </span>
                            ))}
                        </div>

                        <h3 className="evTitle">{ev.title}</h3>

                        <div className="evLocation">
                          <img src={locationIcon} alt="Location icon" className="evLocationIcon" />
                            {ev.location || ""}
                        </div>

                        <p className="evDesc">{ev.shortDesc || ""}</p>

                        <div className="evAction" aria-label={label}>
                          {label} 
                        </div>
                      </div>
                    </article>
                  );
                })}

                {!eventsToShow.length && (
                  <div className="evEmpty">
                    {eventView === "UPCOMING"
                      ? "No upcoming events yet."
                      : "No past events yet."}
                  </div>
                )}
              </div>

            </>
          )}
        </div>
      </section>


      {/* IMPACT */}
      <section className="projectImpactSection" aria-label="Impact">
        <div className="container">
          <header className="projectImpactHead">
            <div className="projectsEyebrowImpact">Impact</div>
            <h2 className="projectImpactTitle">WHAT WE&apos;VE BUILT TOGETHER</h2>
            <p className="projectImpactSub">Real work. Real numbers. Real lives changed.</p>
          </header>

          <div className="projectImpactRow">
            <dl className="projectImpactStats">
              {projectImpactStats.map((s) => (
                <div className="projectImpactStat" key={s.label}>
                  <dt className="projectImpactValue">{s.value}</dt>
                  <dd className="projectImpactLabel">{s.label}</dd>
                </div>
              ))}
            </dl>

            <div className="projectImpactMedia" role="group" aria-label="Impact video">
              <video
                ref={videoRef}
                className="projectImpactVideo"
                playsInline
                preload="metadata"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
              >
                <source src={celebration} type="video/mp4" />
              </video>

              {!isPlaying && (
                <div className="projectImpactOverlay">
                  <button className="projectImpactPlay" type="button" onClick={togglePlay} aria-label="Play impact video">
                    <span className="projectImpactPlayIcon" aria-hidden="true">
                      ▶
                    </span>
                  </button>
                </div>
              )}

              {isPlaying && (
                <button className="projectImpactPause" type="button" onClick={togglePlay} aria-label="Pause impact video">
                  <span className="projectImpactPauseIcon" aria-hidden="true">
                    ❚❚
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* TRUSTED PARTNERS */}
      <section className="trustedPartnersSection" aria-label="Trusted partners">
        <div className="container">
          <div className="trustedPartnersRow">
            <div className="trustedPartnersLeft">
              <h2 className="trustedPartnersTitle">WE WORK WITH TRUSTED PARTNERS ON THE GROUND</h2>

              <p className="trustedPartnersSub">
                Local contacts in each region ensure our projects meet real community needs.
              </p>

              <div className="trustedPartnersActions">
                <Link className="trustedLink" to="/contact">
                  Connect <span aria-hidden="true">›</span>
                </Link>
              </div>
            </div>

            <div className="trustedPartnersRight" aria-label="Partner logos">
              <div className="trustedGrid">
                {partnerTiles.map((p, idx) => (
                  <div className="trustedCell" key={`${p.name}-${idx}`}>
                    <a href={p.href} target="_blank" rel="noopener noreferrer" aria-label={p.aria} className="partnerLink">
                      <img className="partnerLogo" src={p.logo} alt={p.name} loading="lazy" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="projectCta" aria-label="Join us">
        <div className="container">
          <div className="projectCtaBox">
            <h2 className="projectCtaTitle">READY TO HELP?</h2>

            <p className="projectCtaSub">
              Join us in making real change. Pick a project, give what you can, or volunteer your time.
            </p>

            <div className="projectCtaActions">
              <Link className="btn btnPrimary" to="/get-involved">
                Get involved
              </Link>

              <Link to="/contact" className="btn btnGhost">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </section>

      {activePoster && (
        <div
          className="posterModal"
          role="dialog"
          aria-modal="true"
          aria-label="Event poster"
          onMouseDown={(e) => {
            // click outside closes
            if (e.target === e.currentTarget) closePoster();
          }}
        >
          <button
            type="button"
            className="posterClose"
            onClick={closePoster}
            aria-label="Close poster"
          >
            ✕
          </button>

          <img className="posterImg" src={activePoster.src} alt={activePoster.alt} />
        </div>
      )}


    </main>
  );
}
