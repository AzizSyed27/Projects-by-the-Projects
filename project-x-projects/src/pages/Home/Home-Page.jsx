import { useRef, useState } from "react";
import { Link } from "react-router-dom";

/* HERO IMAGES */
import heroImg from "../../assets/hero/hero-image.jpg";


/* IMPACT IMAGES */
import bbqImg from "../../assets/impact/bbq-img-e.jpg";
import madrassaImg from "../../assets/impact/madrassas-image.jpg";
import masjidImg from "../../assets/impact/masjid-image.jpg";
import waterwellImg from "../../assets/impact/waterwell-icon.png";
import careImg from "../../assets/impact/carepackage-icon.png";
import giftImg from "../../assets/impact/gift-icon.png";

/* ORIGINS IMAGES */
import communityImg from "../../assets/origins/community-img.jpg";

/* RESULTS IMAGES */
import resultsMasjidImg from "../../assets/results/masjid-uthman-img.jpg";
import resultsWaterImg from "../../assets/results/water-pump-img.jpg";
import resultsReliefImg from "../../assets/results/aid-img.jpg";

/* PARTNERS IMAGES */
import arsalanLogo from "../../assets/partners/arsalaan-logo.png";
import dehamLogo from "../../assets/partners/deham-logo.png";
import mtjfLogo from "../../assets/partners/mtjf-logo.png";
import muslimhandsLogo from "../../assets/partners/muslinhands-logo.png";
import mergedPartners from "../../assets/partners/merged-partners.jpg";

/* NUMBERS IMAGES */
import impactImg from "../../assets/numbers/impact-img.jpg";

/* GALLERY IMAGES */
import recent1 from "../../assets/recent/recent-1.png";
import recent2 from "../../assets/recent/recent-2.png";
import recent3 from "../../assets/recent/recent-3.png";
import recent4 from "../../assets/recent/recent-4.jpg";
import recent5 from "../../assets/recent/recent-5.png";
import recent6 from "../../assets/recent/recent-6.jpg";
import recent7 from "../../assets/recent/recent-7.jpg";
import recent8 from "../../assets/recent/recent-8.jpg";
import recent9 from "../../assets/recent/recent-9.jpg";
import recent10 from "../../assets/recent/recent-10.jpg";
import recent11 from "../../assets/recent/recent-11.jpg";
import recent12 from "../../assets/recent/recent-12.jpg";
import recent13 from "../../assets/recent/recent-13.jpg";
import recent14 from "../../assets/recent/recent-14.jpg";

export default function Home() {
  /* RESULTS state (from Home-Results.jsx) */
  const [activeResult, setActiveResult] = useState("water");

  const results = {
    water: {
      tab: "Water Wells",
      tag: "Water",
      title: "HAND-PUMP AND ELECTRIC WELLS ACROSS CONTINENTS",
      body: (
        <>
          Projects <span className="xproj">X</span> Projects has drilled in Malawi,
          Tanzania, Uganda, Niger, Pakistan, India, and Nepal. Clean water isn’t a
          luxury where we work—it’s survival. Every well means a family doesn’t walk
          miles for water.
        </>
      ),
      img: resultsWaterImg,
      alt: "Water well project",
    },
    masjids: {
      tab: "Mosques Built",
      tag: "Spaces",
      title: "MOSQUES THAT STAND, COMMUNITIES THAT GATHER",
      body: (
        <>
          Projects <span className="xproj">X</span> Projects helps build mosques and
          community spaces where people can pray, learn, and connect. These spaces
          strengthen local bonds and serve as anchors for long-term growth.
        </>
      ),
      img: resultsMasjidImg,
      alt: "A newly constructed mosque",
    },
    relief: {
      tab: "Relief Aid",
      tag: "Relief",
      title: "RELIEF DELIVERED WHEN IT MATTERS MOST",
      body: (
        <>
          When hardship hits, Projects <span className="xproj">X</span> Projects moves
          quickly with practical support: food, essentials, and urgent aid for families
          facing displacement and crisis.
        </>
      ),
      img: resultsReliefImg,
      alt: "Relief aid distribution",
    },
  };

  const current = results[activeResult];

  /* NUMBERS data (from Home-Numbers.jsx) */
  const stats = [
    {
      label: "WELLS BUILT",
      value: "40+",
      desc: "Hand-pump and electric wells across seven countries",
    },
    {
      label: "COMMUNITIES SERVED",
      value: "10",
      desc: "Countries where we work and build",
    },
    {
      label: "FAMILIES SUPPORTED",
      value: "1000+",
      desc: "Orphans, widows, and those facing hardship",
    },
  ];

  /* GALLERY carousel state (from Home-Gallery.jsx) */
  const recentRef = useRef(null);
  const [recentIndex, setRecentIndex] = useState(0);

  const recentItems = [
    { img: recent1, alt: "Recent project photo 1" },
    { img: recent2, alt: "Recent project photo 2" },
    { img: recent3, alt: "Recent project photo 3" },
    { img: recent4, alt: "Recent project photo 4" },
    { img: recent5, alt: "Recent project photo 5" },
    { img: recent6, alt: "Recent project photo 6" },
    { img: recent7, alt: "Recent project photo 7" },
    { img: recent8, alt: "Recent project photo 8" },
    { img: recent9, alt: "Recent project photo 9" },
    { img: recent10, alt: "Recent project photo 10" },
    { img: recent11, alt: "Recent project photo 11" },
    { img: recent12, alt: "Recent project photo 12" },
    { img: recent13, alt: "Recent project photo 13" },
    { img: recent14, alt: "Recent project photo 14" },
  ];

  function scrollRecentByCards(dir) {
    const el = recentRef.current;
    if (!el) return;

    const card = el.querySelector(".recentCard");
    const gap = 22;
    const cardW = card ? card.getBoundingClientRect().width : 320;
    const step = cardW + gap;

    el.scrollBy({ left: dir * step, behavior: "smooth" });
  }

  function onRecentScroll() {
    const el = recentRef.current;
    if (!el) return;

    const card = el.querySelector(".recentCard");
    const gap = 22;
    const cardW = card ? card.getBoundingClientRect().width : 320;
    const step = cardW + gap;

    const idx = Math.round(el.scrollLeft / step);
    setRecentIndex(Math.max(0, Math.min(idx, 13)));
  }

  /* FAQ state/data (from Home-FAQ.jsx) */
  const [openFaq, setOpenFaq] = useState(0);

  const faqs = [
    {
      q: "How can I donate?",
      a:
        "We are currently accepting donations in the form or e-transfers to info@projectxprojects.ca," +
        " where you can specify which project you’d like to support. More options coming soon!",
    },
    {
      q: "How do you choose projects?",
      a:
        "We listen to communities on the ground. Local partners tell us what’s needed: " +
        "a well, a masjid, relief aid. We don’t guess. We ask, we verify, we act.",
    },
    {
      q: "Where does my donation go?",
      a:
        "Every dollar goes to the project you choose. We share receipts, photos, and updates " +
        "so you see the work happen. Transparency isn’t optional for us, it’s how we earn trust.",
    },
    {
      q: "Can I sponsor an orphan?",
      a:
        "Yes. We match donors with families in Nepal and other regions. You’ll receive updates " +
        "on the child you support. It’s direct, it’s real, it’s ongoing.",
    },
    {
      q: "How do I get involved locally?",
      a:
        "Join us for the annual Scarborough BBQ, the Eid toy drive, or other community events. " +
        "We organize here, we build here, and we welcome hands and hearts.",
    },
    {
      q: "What about urgent relief?",
      a:
        "When urgent needs arise, we move fast. We coordinate with trusted partners and send help " +
        "where it’s needed most. You can donate to urgent relief anytime.",
    },
  ];

  return (
    <main>
      {/* HERO */}
      <section className="heroSection" aria-label="Hero">
        <div className="container">
          <section className="heroCard" aria-label="Hero">
            <div className="heroLeft">
              <span className="kicker">
                Welcome to <span className="xproj"> PROJECTS</span> BY THE{" "}
                <span className="xproj">PROJECTS </span>
              </span>

              <h1 className="h1">
                ACT LOCALLY, <br />
                HELP GLOBALLY, <br />
                KEEP IT REAL.
              </h1>

              <p className="lead">
                Projects <span className="xproj"> X</span> Projects started in Scarborough
                with a simple belief: real change comes from real people doing real work
                - wells, masjids, madrassas, relief packages, and support for families in
                need.
              </p>

              <div className="heroActions">
                <Link className="btn btnPrimary" to="/donate">
                  Donate
                </Link>
                <Link className="btn btnGhost" to="/projects">
                  Learn more
                </Link>
              </div>
            </div>

            <div className="heroRight">
              <img
                src={heroImg}
                alt="Volunteers working together on a community project"
              />
            </div>
          </section>
        </div>
      </section>

      {/* IMPACT */}
      <section className="impactSection" aria-label="Impact">
        <div className="container">
          <header className="impactHeader">
            <div className="impactEyebrow">Impact</div>
            <h2 className="impactTitle">WHAT'S BEING BUILT</h2>
            <p className="impactSub">Six pillars of service, rooted in faith and action.</p>
          </header>

          <div className="impactGrid">
            {/* COL 1 */}
            <div className="impactCol">
              <article className="impactCard">
                <div className="impactIcon" aria-hidden="true">
                  <img src={waterwellImg} alt="" className="iconImg" />
                </div>

                <h3 className="impactCardTitle">
                  CLEAN ACCESSIBLE WATER REACHES COMMUNITIES
                </h3>

                <p className="impactCardBody">
                  Hand-pump and electric wells across Malawi, Tanzania, Uganda, Niger,
                  Pakistan, India, and Nepal.
                </p>

                <button className="impactLink" type="button">
                  Explore <span aria-hidden="true">›</span>
                </button>
              </article>

              <article className="impactCard impactCardTall">
                <div className="impactTag">SPACES</div>
                <h3 className="impactCardTitle">MASJIDS AND COMMUNITY SPACES</h3>

                <p className="impactCardBody">
                  Building places of worship and gathering spaces where communities
                  strengthen their faith and bonds.
                </p>

                <button className="impactLink" type="button">
                  Explore <span aria-hidden="true">›</span>
                </button>

                <div className="impactMedia">
                  <img
                    src={masjidImg}
                    alt="A newly constructed masjid"
                    className="impactMediaInner"
                  />
                </div>
              </article>
            </div>

            {/* COL 2 */}
            <div className="impactCol">
              <article className="impactCard impactCardTall">
                <div className="impactTag">EDUCATION</div>
                <h3 className="impactCardTitle">EDUCATION THROUGH MADRASSAS</h3>

                <p className="impactCardBody">
                  Every child deserves the opportunity to learn, grow, and build a better
                  future, regardless of where they are born.
                </p>

                <button className="impactLink" type="button">
                  Explore <span aria-hidden="true">›</span>
                </button>

                <div className="impactMedia">
                  <img
                    src={madrassaImg}
                    alt="Children attending a madrassa class"
                    className="impactMediaInner"
                  />
                </div>
              </article>

              <article className="impactCard">
                <div className="impactIcon" aria-hidden="true">
                  <img src={careImg} alt="" className="iconImg" />
                </div>
                <h3 className="impactCardTitle">ESSENTIAL SUPPORT & LIVELIHOODS</h3>

                <p className="impactCardBody">
                  Providing food, essential supplies, and equipment to help families and
                  small businesses become self-sufficient.
                </p>

                <button className="impactLink" type="button">
                  Explore <span aria-hidden="true">›</span>
                </button>
              </article>
            </div>

            {/* COL 3 */}
            <div className="impactCol">
              <article className="impactCard">
                <div className="impactIcon" aria-hidden="true">
                  <img src={giftImg} alt="" className="iconImg" />
                </div>
                <h3 className="impactCardTitle">ORPHANS AND WIDOWS SPONSERED</h3>

                <p className="impactCardBody">
                  Sponsorships, Eid gifts, and practical assistance for families facing loss
                  and struggle.
                </p>

                <button className="impactLink" type="button">
                  Explore <span aria-hidden="true">›</span>
                </button>
              </article>

              <article className="impactCard impactCardTall">
                <div className="impactTag">Community</div>
                <h3 className="impactCardTitle">SCARBOROUGH BRINGS IT TOGETHER</h3>

                <p className="impactCardBody">
                  Local events, sports and educational initiatives that bring people together
                  and turn good intentions into action.
                </p>

                <button className="impactLink" type="button">
                  Explore <span aria-hidden="true">›</span>
                </button>

                <div className="impactMedia">
                  <img
                    src={bbqImg}
                    alt="Community members gathered at a local event"
                    className="impactMediaInner"
                  />
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      {/* ORIGINS */}
      <section className="originsSection" aria-label="Origins">
        <div className="container">
          <div className="originsCard">
            <div className="originsRight">
              <img src={communityImg} alt="Community gathering in Scarborough" />
            </div>

            <div className="originsLeft">
              <span className="originsKicker">Origins</span>
              <h2 className="originsH1">SCARBOROUGH ROOTS RUN DEEP</h2>

              <p className="originsLead">
                Projects <span className="xproj"> X</span> Projects started here, in this
                neighbourhood, with neighbors who believed actions matter more than talk.
                Every BBQ, every donation, every conversation - it all stays connected to
                where we come from. That's how it works: organize locally, listen closely,
                and send real help where it's needed.
              </p>

              <div className="originsActions">
                <button className="btn originsBtnGhost" type="button">
                  Learn More ›
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RESULTS */}
      <section className="resultsSection" aria-label="Results">
        <div className="container">
          <header className="resultsHeader">
            <div className="resultsEyebrow">Results</div>
            <h2 className="resultsTitle">WHAT TANGIBLE WORK LOOKS LIKE</h2>
            <p className="resultsSub">
              Enough talk about change. It's time to build. Wells that run, masjids that
              stand, schools that teach, families that eat. This is what Projects{" "}
              <span className="xproj"> X</span> Projects does.
            </p>

            <nav className="resultsTabs" aria-label="Results categories">
              <button
                className={`resultsTab ${activeResult === "water" ? "isActive" : ""}`}
                type="button"
                onClick={() => setActiveResult("water")}
              >
                Water Wells
              </button>

              <button
                className={`resultsTab ${activeResult === "masjids" ? "isActive" : ""}`}
                type="button"
                onClick={() => setActiveResult("masjids")}
              >
                Mosques Built
              </button>

              <button
                className={`resultsTab ${activeResult === "relief" ? "isActive" : ""}`}
                type="button"
                onClick={() => setActiveResult("relief")}
              >
                Relief Aid
              </button>
            </nav>
          </header>

          <section className="resultsCard" aria-label="Featured result">
            <div className="resultsMedia">
              <img src={current.img} alt={current.alt} />
            </div>

            <div className="resultsContent">
              <div className="resultsTag">{current.tag}</div>
              <h3 className="resultsCardTitle">{current.title}</h3>
              <p className="resultsCardBody">{current.body}</p>

              <div className="resultsCardActions">
                <button className="btn resultsBtnGhost" type="button">
                  Learn More ›
                </button>
              </div>
            </div>
          </section>
        </div>
      </section>

      {/* PARTNERS */}
      <section className="partnersSection" aria-label="Partners">
        <div className="container">
          <div className="partnersCard">
            <div className="partnersRight">
              <img src={mergedPartners} alt="Partner Proof" />
            </div>

            <div className="partnersLeft">
              <span className="partnersKicker">PARTNERS</span>
              <h2 className="partnersH1">WORKING WITH THOSE WHO SHARE THE MISSION</h2>

              <p className="partnersLead">
                Real impact is never done alone. Projects <span className="xproj"> X</span>{" "}
                Projects works alongside trusted partners who believe in transparency,
                accountability, and long-term commitment. These organizations and
                individuals understand that meaningful change takes time, presence, and
                responsibility. Need is need. Suffering is suffering. P
                <span className="xproj">X</span>P simply acts on that.
              </p>

              <div className="partnerLogos" aria-label="Partner logos">
                <a
                  href="https://muslimhands.ca/home"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Muslim Hands website"
                >
                  <img className="partnerLogo" src={muslimhandsLogo} alt="Muslim Hands" />
                </a>

                <a
                  href="https://mtjfoundation.ca/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="MTJF website"
                >
                  <img className="partnerLogo" src={mtjfLogo} alt="MTJF" />
                </a>

                <a
                  href="https://dehamci.com/foundation"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Deham website"
                >
                  <img className="partnerLogo" src={dehamLogo} alt="Deham" />
                </a>

                <a
                  href="https://www.facebook.com/ARSALAN.HELPLINE.WELFARE.TRUST/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Arsalan website"
                >
                  <img className="partnerLogo" src={arsalanLogo} alt="Arsalan" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NUMBERS THAT MATTER */}
      <section className="numbersSection" aria-label="Numbers that matter">
        <div className="container">
          <header className="numbersHeader">
            <div className="numbersEyebrow">Impact</div>
            <h2 className="numbersTitle">NUMBERS THAT MATTER</h2>
            <p className="numbersSub">Real work, real results, real people helped.</p>
          </header>

          <div className="numbersGrid">
            <div className="numbersStack">
              {stats.map((s) => (
                <article className="numbersCard" key={s.label}>
                  <div className="numbersLabel">{s.label}</div>
                  <div className="numbersValue">{s.value}</div>
                  <div className="numbersDivider" />
                  <p className="numbersDesc">{s.desc}</p>
                </article>
              ))}
            </div>

            <div className="numbersMedia" aria-label="Impact image">
              <img className="numbersMediaImg" src={impactImg} alt="Impact in the field" />
            </div>
          </div>
        </div>
      </section>

      {/* RECENT WORK */}
      <section className="recentSection" aria-label="Recent work">
        <div className="container">
          <header className="recentHeader">
            <h2 className="recentTitle">RECENT WORK</h2>
            <p className="recentSub">
              Photos and stories from the field show what we’ve built and who we’ve helped.
            </p>
          </header>

          <div className="recentRailWrap">
            <div className="recentRail" ref={recentRef} onScroll={onRecentScroll}>
              {recentItems.map((item, i) => (
                <div className="recentCard" key={item.alt + i}>
                  <img src={item.img} alt={item.alt} />
                </div>
              ))}
            </div>

            <div className="recentFooter">
              <div className="recentDots" aria-label="Carousel position">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((d) => (
                  <span
                    key={d}
                    className={`recentDot ${d === recentIndex ? "isActive" : ""}`}
                  />
                ))}
              </div>

              <div className="recentArrows">
                <button
                  className="recentArrow"
                  type="button"
                  aria-label="Previous"
                  onClick={() => scrollRecentByCards(-1)}
                >
                  ←
                </button>

                <button
                  className="recentArrow"
                  type="button"
                  aria-label="Next"
                  onClick={() => scrollRecentByCards(1)}
                >
                  →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUESTIONS / FAQ */}
      <section className="faqSection" aria-label="Questions">
        <div className="container">
          <header className="faqHeader">
            <h2 className="faqTitle">QUESTIONS</h2>
            <p className="faqSub">
              Everything you need to know about how we work and where your donation goes.
            </p>
          </header>

          <div className="faqList" role="list">
            {faqs.map((item, idx) => {
              const isOpen = openFaq === idx;

              return (
                <div
                  className={`faqItem ${isOpen ? "isOpen" : ""}`}
                  key={item.q}
                  role="listitem"
                >
                  <button
                    className="faqQ"
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                  >
                    <span className="faqQText">{item.q}</span>
                    <span className="faqIcon" aria-hidden="true">
                      {isOpen ? "–" : "+"}
                    </span>
                  </button>

                  <div className="faqAnswerWrap">
                    <div className="faqA">{item.a}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="faqMore">
            <h3 className="faqMoreTitle">MORE QUESTIONS?</h3>
            <p className="faqMoreSub">Reach out. We’re here to answer.</p>
            <button className="btn faqContactBtn" type="button">
              Contact
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
