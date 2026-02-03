import { Link } from "react-router-dom";

import aboutImg from "../assets/about/about-hero.jpg"; 

import waterIcon from "../assets/about/about-water-icon.png";
import commIcon from "../assets/about/about-comm-icon.png"
import toolIcon from "../assets/about/about-tools-icon.png"
import waveIcon from "../assets/about/about-wave-icon.png"
import mosqueIcon from "../assets/about/about-mosque-icon.png"
import eduIcon from "../assets/about/about-edu-icon.png"
import mapIcon from "../assets/about/about-map-icon.png"
import paperIcon from "../assets/about/about-paper-icon.png"
import projectIcon from "../assets/about/about-project-icon.png"

import malawiImg from "../assets/about/about-malawi-img.jpg";
import ugandaImg from "../assets/about/about-uganda-img.jpg";

import "../styles/about.css";


export default function About() {

    const purposeCards = [
    {
      icon: waterIcon,
      title: "OUR MISSION",
      body: "Practical projects that bring water, learning, and dignity to communities that need it most.",
      cta: "Explore",
      wide: true,
    },
    {
      icon: commIcon,
      title: "COMMUNITIES EQUIPPED WITH OPPORTUNITY",
      body: "A movement rooted in Scarborough, reaching across borders through consistent service.",
      cta: "Explore",
    },
    {
      icon: toolIcon,
      title: "SERVICE, TRANSPARENCY, ACCOUNTABILITY",
      body: "We stand by what we do and answer for it. Updates, proof of work, and real outcomes.",
      cta: "Explore",
    },
  ];

  const buildCards = [
    {
      icon: waveIcon,
      title: "CLEAN WATER REACHES THOSE WHO NEED IT",
      body: "Hand-pump and electric wells across multiple regions. Built to last, maintained with care.",
    },
    {
      icon: mosqueIcon,
      title: "SPACES FOR WORSHIP AND COMMUNITY",
      body: "Building mosques and supporting infrastructure projects that bring people together.",
    },
    {
      icon: eduIcon,
      title: "EDUCATION AND SPIRITUAL GROWTH",
      body: "Constructing schools where learning takes root and families can thrive.",
    },
  ];

  const differenceCards = [
    {
        icon: mapIcon, 
        title: "BORN IN SCARBOROUGH",
        body: "We organize locally, send impact where it counts most.",
        cta: "Learn",
        wide: true,
    },
    {
        icon: projectIcon,
        title: "GROUND TRUTH GUIDES EVERY PROJECT",
        body: "Trusted local contacts shape what we build and where we build it.",
    },
    {
        icon: paperIcon,
        title: "WE SHOW WHAT WE’VE DONE",
        body: "Photos, receipts, and updates from the field, shared openly.",
    },
    ];

   
    

  return (
    <main className="aboutPage">
        {/* TOP HEADER */}
        <section className="aboutTop" aria-label="About header">
            <div className="container">
                <h1 className="aboutTitle">ABOUT US</h1>
                <p className="aboutSub">
                    Scarborough rooted. Globally active. Projects <span className="xproj"> X</span> Projects connects local
                    energy and global need through faith-driven service.
                </p>
            </div>
        </section>

        {/* Emergence */}
        <section className="aboutEmergence" aria-label="Emergence">
            
            <div className="container aboutEmergenceInner">

                <div className="aboutEyebrow">Emergence</div>

                <h2 className="aboutEmergenceTitle">
                    HOW IT BEGAN IN SCARBOROUGH AND SPREAD OUTWARD
                </h2>

                <p className="aboutEmergenceLead">
                    A few people in Scarborough saw what needed doing and started doing it. They
                    gathered neighbors around a grill, collected what was given, and sent it where
                    it mattered: wells and schools in Malawi, orphan sponsership in Nepal, relief where crisis struck.
                    No committees. No distance between intention and action.
                </p>
            </div>

        </section>

        {/* BIG MEDIA */}
        <section className="aboutMediaSection" aria-label="About media">
           
            <div className="container">

                <div className="aboutMedia">
                    <img src={aboutImg} alt="Project work in the field" />
                </div>

            </div>

        </section>


        {/* PURPOSE */}
        <section className="aboutPurpose" aria-label="Purpose">
            <div className="container">

                <header className="aboutSectionHeader">

                    <div className="aboutEyebrow">Purpose</div>

                    <h2 className="aboutSectionTitle">MISSION, VISION, VALUES</h2>

                    <p className="aboutSectionSub">Serve communities through faith-driven work.</p>

                </header>

                <div className="aboutPurposeGrid">

                    {purposeCards.map((c) => (
                        <article
                            key={c.title}
                            className={`aboutCard ${c.wide ? "aboutCardWide" : ""}`}
                        >
                            <img src={c.icon} className="aboutIcon" alt="icon"/>
                            <h3 className="aboutCardTitle">{c.title}</h3>
                            <p className="aboutCardBody">{c.body}</p>

                        </article>
                    ))}

                </div>

            </div>

        </section>

        {/* WORK */}
        <section className="aboutWork" aria-label="What we build">

            <div className="container">

                <header className="aboutSectionHeader aboutSectionHeaderTight">

                    <div className="aboutEyebrow">Work</div>

                    <h2 className="aboutSectionTitle">WHAT WE BUILD</h2>

                    <p className="aboutSectionSub">
                        Wells, mosques, schools, relief, and family support.
                    </p>
                
                </header>

            <div className="aboutWorkGrid">

                {buildCards.map((c) => (

                    <article key={c.title} className="aboutCard aboutCardSoft">
                        
                        <img src={c.icon}  className="aboutIcon"/>

                        <h3 className="aboutCardTitle">{c.title}</h3>

                        <p className="aboutCardBody">{c.body}</p>

                        

                    </article>

                ))}
            </div>

            </div>
      
        </section>

        {/* LOCATIONS */}
        <section className="aboutLocations" aria-label="Locations">

            <div className="container">
                
                <header className="aboutSectionHeader aboutSectionHeaderTight">
                    <div className="aboutEyebrow">Reach</div>
                    <h2 className="aboutSectionTitle">LOCATIONS</h2>
                    <p className="aboutSectionSub">Active across Africa, Asia, and Canada</p>
                </header>

                <div className="aboutLocationsGrid">
                    <article className="aboutLocCard">
                        <div className="aboutLocMedia">
                        <img src={malawiImg} alt="Project work in Malawi" />
                        </div>

                        <h3 className="aboutLocTitle">MALAWI</h3>
                        <p className="aboutLocDesc">Wells, mosques, and relief in Malawi</p>

                        <button className="aboutLocLink" type="button">
                        Learn more <span aria-hidden="true">›</span>
                        </button>
                    </article>

                    <article className="aboutLocCard">
                        <div className="aboutLocMedia">
                        <img src={ugandaImg} alt="Project work in Uganda" />
                        </div>

                        <h3 className="aboutLocTitle">UGANDA</h3>
                        <p className="aboutLocDesc">Orphan sponsorships and madrassa support</p>

                        <button className="aboutLocLink" type="button">
                        Learn more <span aria-hidden="true">›</span>
                        </button>
                    </article>
                </div>
            </div>
        </section>

        {/* DIFFERENCE */}
    <section className="aboutDifference" aria-label="Why we stand apart">

        <div className="container">

            <header className="aboutSectionHeader aboutSectionHeaderTight">

                <div className="aboutEyebrow">Difference</div>

                <h2 className="aboutSectionTitle">WHY WE STAND APART</h2>

                <p className="aboutSectionSub">Grassroots work, real partnerships, tangible results</p>

            </header>

            <div className="aboutDifferenceGrid">

                {differenceCards.map((c) => (
                    <article
                    key={c.title}
                    className={`aboutDiffCard ${c.wide ? "aboutDiffCardWide" : ""}`}
                    >

                    <img src={c.icon} className="aboutDiffIcon"/>

                    <h3 className="aboutDiffTitle">{c.title}</h3>
                    <p className="aboutDiffBody">{c.body}</p>

                    
                    </article>
                ))}
            </div>
        </div>
    </section>

    {/* CTA */}
    <section className="aboutCta" aria-label="Join us">

        <div className="container">

            <div className="aboutCtaBox">

                <h2 className="aboutCtaTitle">JOIN US IN PRACTICAL CHANGE</h2>

                <p className="aboutCtaSub">
                    Support a project, volunteer your time, or connect with our work
                </p>

                <div className="aboutCtaActions">

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
