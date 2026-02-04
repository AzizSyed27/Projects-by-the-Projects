import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import "../styles/projects.css";
import water1 from "../assets/recent/recent-1.png";
import water2 from "../assets/recent/recent-10.jpg";
import water3 from "../assets/recent/recent-12.jpg";

import waterChangesEverything from "../assets/projects/water-changes-everything.jpg"

import forTheUmmah from "../assets/projects/for-the-ummah.jpg"

import wellsOfAccess from "../assets/projects/wells-of-access.jpg"
import foundationsOfFaith from "../assets/projects/foundation-of-faith.jpg"
import waterPumpsOfRelief from "../assets/projects/water-pumps-of-relief.jpg"
import streamsOfMercy from "../assets/projects/steams-of-mercy.jpg"
import wellsOfPurity from "../assets/projects/wells-of-purity.jpg"
import pillarsOfFaith from "../assets/projects/pillars-of-faith.jpg"

import celebration from "../assets/projects/celebration.mp4"

import muslimhandsLogo from "../assets/partners/muslinhands-logo.png";
import mjtfLogo from "../assets/partners/mtjf-logo.png";
import dehamLogo from "../assets/partners/deham-logo.png";
import arsalanLogo from "../assets/partners/arsalaan-logo.png";

export default function Projects() {
  const cards = [
    {
      kicker: "Clean Water Access",
      title: "WELLS AND HAND PUMPS",
      desc: "Delivering reliable clean water so families can thrive without the daily struggle",
      links: [
        { label: "Explore", to: "#" },
      ],
      img: water1,
    },
    {
      kicker: "Faith & Community",
      title: "MOSQUES AND COMMUNITY SPACES",
      desc: "Building welcoming spaces for worship, learning, and gathering at the heart of communities.",
      links: [
        
        { label: "Relief when it matters most", to: "#" },
      ],
      img: water2,
    },
    {
      kicker: "Emergency Relief & Care",
      title: "SUPPORT WHERE IT'S NEEDED MOST",
      desc: "Providing ongoing support for orphans and widowed families with dignity and consistency.",
      links: [
        { label: "Sponsorships, gifts, and practical help for those alone", to: "#" },
      ],
      img: water3,
    },
  ];

  const currentNow = [
    
    {
      title: "WATER PUMPS OF RELIEF",
      desc: "Four deep hand pumps installed to deliver sustainable, safe water in Pakistan.",
      tags: ["Water", "Pakistan", "Hand Pumps", "Relief", "Clean Water"],
      img: waterPumpsOfRelief, //pakistanPumpsImg
      to: "#",
    },
    {
      title: "STREAMS OF MERCY",
      desc: "Twenty-two water pumps bringing clean water to villages across Pakistan in need.",
      tags: ["Water", "Pakistan", "Pumps", "Sustainable", "Relief"],
      img: streamsOfMercy, //pakistanStreamsImg
      to: "#",
    },
    {
      title: "THE WELLS OF PURITY",
      desc: "Four pumps and a wudu facility providing water for daily and religious use in Bihar.",
      tags: ["Water", "India", "Bihar", "Wudu", "Sadaqah"],
      img: wellsOfPurity, //biharImg
      to: "#",
    },
    {
      title: "PILLARS OF FAITH",
      desc: "A mosque and water well completed to serve worship and clean water in Malawi.",
      tags: ["Faith", "Water", "Malawi", "Mosque", "Ramadan"],
      img: pillarsOfFaith, //malawiPillarsImg
      to: "#",
    },
  ];

  const completedProjects = [
    {
      title: "WATER CHANGES EVERYTHING",
      desc: "A community well bringing safe drinking water to 1,000+ residents in Zanzibar.",
      tags: ["Water", "Zanzibar", "Tanzania", "Community", "Clean Water"],
      img: waterChangesEverything , //zanzibarImg
      to: "#",
    },
    {
      title: "FOR THE UMMAH",
      desc: "A water well providing clean, reliable water for families and schools in Uganda.",
      tags: ["Water", "Uganda", "Wakiso", "Ummah", "Clean Water"],
      img: forTheUmmah, //ugandaImg
      to: "#",
    },
    {
      title: "WELLS OF ACCESS",
      desc: "A well restoring clean water access for 8 families in rural Niger communities.",
      tags: ["Water", "Niger", "Dosso", "Access", "Clean Water"],
      img: wellsOfAccess, //nigerImg
      to: "#",
    },
    {
      title: "FOUNDATIONS OF FAITH",
      desc: "A mosque and water well built to support worship and daily clean water in Malawi.",
      tags: ["Faith", "Water", "Malawi", "Mosque", "Community"],
      img: foundationsOfFaith, //malawiFoundationsImg
      to: "#",
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
      href: "https://mjtf.org", // change if needed
      logo: mjtfLogo,
      aria: "MJTF website",
    },
    {
      name: "Deham",
      href: "https://deham.org", // change if needed
      logo: dehamLogo,
      aria: "Deham website",
    },
    {
      name: "Arsalan Helpline",
      href: "https://arsalanhelpline.org", // change if needed
      logo: arsalanLogo,
      aria: "Arsalan Helpline website",
    },
    // more to add later
  ];

  function getColsForViewport() {
    if (typeof window === "undefined") return 3;
    const w = window.innerWidth;

    // CSS breakpoints:
    // < 620px => 1 col
    // < 980px => 2 cols
    // otherwise => 3 cols
    if (w < 620) return 1;
    if (w < 980) return 2;
    return 3;
  }

  const [showAllCurrent, setShowAllCurrent] = useState(false);
  const [showAllCompleted, setShowAllCompleted] = useState(false);

  const [cols, setCols] = useState(getColsForViewport());

  useEffect(() => {
    const onResize = () => setCols(getColsForViewport());
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
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
        // Autoplay can be blocked unless muted or user-initiated (this is user-initiated, so usually ok)
        console.error(e);
      }
    } else {
      v.pause();
      setIsPlaying(false);
    }
  };

  return (
    <main className="projectsPage">
      {/* PAGE HEADER */}
      <section className="projectsTop" aria-label="Projects header">

        <div className="container">
          <h1 className="projectsTitle">OUR PROJECTS</h1>
          <p className="projectsSub">
            Projects <span className="xproj"> X</span> Projects acts locally and builds globally. See the work P<span className="xproj">X</span>P is doing right now.
          </p>
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

                  <h3 className="projectTitle">
                    {c.title.split("\n").map((line, i) => (
                      <span key={i}>
                        {line}
                        <br />
                      </span>
                    ))}
                  </h3>

                  <div className="projectDesc">{c.desc}</div>

                  
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* WORK HAPPENING NOW */}
      <section className="currentNowSection" aria-label="Work happening now" id="current-now">
        <div className="container">
          <div className="currentNowHead">
            <div className="currentNowEyebrow">Current</div>
            <h2 className="currentNowTitle">WORK HAPPENING NOW</h2>
            <p className="currentNowSub">
              Each project addresses a real need in communities near and far.
            </p>
          </div>

          <div className="currentNowGrid">
            {visibleCurrentNow.map((p) => (
              <article className="currentNowCard" key={p.title}>
                <div className="currentNowMedia">
                 
                    <img src={p.img} alt="" />
                 
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

                    if (!next) {
                      requestAnimationFrame(() => {
                        document
                          .getElementById("current-now")
                          ?.scrollIntoView({ behavior: "smooth", block: "start" });
                      });
                    }

                    return next;
                  });
                }}
              >
                {showAllCurrent ? "Show less" : "View all"}
              </button>
            </div>
          )}
        </div>

      </section>



      {/* COMPLETED WORK */}
      <section className="completedSection" id="completed-projects" aria-label="Completed projects">

        <div className="container">

          <div className="completedHead">

            <div className="projectsEyebrow">Completed</div>
            <h2 className="completedTitle">COMPLETED PROJECTS</h2>
            <p className="completedSub">
              Completed work with real outcomes delivered to communities around the world.
            </p>
            
          </div>

          <div className="completedGrid">
            {visibleCompleted.map((p) => (
              <article className="completedCard" key={p.title}>
                <div className="completedMedia">
                 
                    <img src={p.img} alt="" loading="lazy" />
                 
                </div>

                <div className="completedBody">
                  <h3 className="completedCardTitle">{p.title}</h3>
                  <p className="completedDesc">{p.desc}</p>

                  <div className="completedTags">
                    {p.tags.map((t) => (
                      <span className="completedTag" key={t}>
                        {t}
                      </span>
                    ))}
                  </div>

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

                    if (!next) {
                      requestAnimationFrame(() => {
                        document
                          .getElementById("completed-projects")
                          ?.scrollIntoView({ behavior: "smooth", block: "start" });
                      });
                    }

                    return next;
                  });
                }}
              >
                {showAllCompleted ? "Show less" : "View all"}
              </button>
            </div>
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

              {/* Big play overlay when NOT playing */}
              {!isPlaying && (
                <div className="projectImpactOverlay">
                  <button
                    className="projectImpactPlay"
                    type="button"
                    onClick={togglePlay}
                    aria-label="Play impact video"
                  >
                    <span className="projectImpactPlayIcon" aria-hidden="true">▶</span>
                  </button>
                </div>
              )}

              {/* Small pause button when playing */}
              {isPlaying && (
                <button
                  className="projectImpactPause"
                  type="button"
                  onClick={togglePlay}
                  aria-label="Pause impact video"
                >
                  <span className="projectImpactPauseIcon" aria-hidden="true">❚❚</span>
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
              <h2 className="trustedPartnersTitle">
                WE WORK WITH TRUSTED PARTNERS ON <br /> THE GROUND
              </h2>

              <p className="trustedPartnersSub">
                Local contacts in each region ensure our projects meet real community needs.
              </p>

              <div className="trustedPartnersActions">
                
                <a className="trustedLink" href="#connect">
                  Connect <span aria-hidden="true">›</span>
                </a>
              </div>
            </div>

            <div className="trustedPartnersRight" aria-label="Partner logos">
              <div className="trustedGrid">
                {partnerTiles.map((p, idx) => (
                  <div className="trustedCell" key={`${p.name}-${idx}`}>
                    <a
                      href={p.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={p.aria}
                      className="partnerLink"
                    >
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

                    <Link className="btn btnPrimary" to="/get-involved">Get involved</Link>

                    <Link to="/contact" className="btn btnGhost">
                    Contact
                    </Link>

                </div>

            </div>

        </div>

    </section>


    </main>
  );
}
