import "../styles/get-involved.css";
import { useState } from 'react';
import { Link } from "react-router-dom";
import path1 from "../assets/gi/path-1.png"
import path2 from "../assets/gi/path-2.jpg"
import path3 from "../assets/gi/path-3.jpg"

import serve1 from "../assets/gi/serve-1.jpg"
import serve2 from "../assets/gi/serve-2.jpg"
import serve3 from "../assets/gi/serve-3.jpg"

import chooseImg from "../assets/gi/gi-merge.jpg"

export default function GetInvolved() {
    const ways = [
        {
        kicker: "Give",
        title: "BECOME A DONOR",
        desc: "Support wells, masjids, or relief",
        cta: "Donate",
        to: "/donate",
        img: path1,
        },
        {
        kicker: "Serve",
        title: "VOLUNTEER YOUR TIME",
        desc: "Help at events and outreach",
        cta: "Join",
        to: "/contact",
        img: path2,
        },
        {
        kicker: "Build",
        title: "JOIN COMMUNITY EVENTS",
        desc: "Organize BBQs and toy drives",
        cta: "Attend",
        to: "/contact",
        img: path3,
        },
    ];

    const [activeServe, setActiveServe] = useState("local");

    const serve = {
        local: {
        tab: "Local work",
        tag: "Scarborough",
        title: "HELP ORGANIZE COMMUNITY EVENTS",
        body: (
            <>
            Join us at the annual masjid BBQ, Eid toy drive, or local fundraisers. No
            experience needed, just show up ready to help.
            </>
        ),
        ctas: [
            { label: "Learn", to: "/about" },
            { label: "Sign", to: "/contact" },
        ],
        img: serve1,
        alt: "Volunteers organizing a community event",
        },
        events: {
        tab: "Event help",
        tag: "Event crew",
        title: "SUPPORT FUNDRAISERS AND COMMUNITY DRIVES",
        body: (
            <>
            Help with setup, welcoming guests, donations tables, and logistics so
            events run smoothly and feel inviting for everyone.
            </>
        ),
        ctas: [
            { label: "Learn", to: "/about" },
            { label: "Sign", to: "/contact" },
        ],
        img: serve2,
        alt: "Volunteer help at an event",
        },
        outreach: {
        tab: "Outreach",
        tag: "Outreach",
        title: "CONNECT, COORDINATE, AND SUPPORT ON THE GROUND",
        body: (
            <>
            Assist with outreach efforts, coordinating updates, connecting with
            local partners, and helping deliver support where it’s needed most.
            </>
        ),
        ctas: [
            { label: "Learn", to: "/about" },
            { label: "Sign", to: "/contact" },
        ],
        img: serve3,
        alt: "Volunteer outreach coordination",
        },
    };

    const current = serve[activeServe];

    const [email, setEmail] = useState("");
    const [loopStatus, setLoopStatus] = useState("idle"); // idle | success | error

    function onLoopSubmit(e) {
    e.preventDefault();

    const trimmed = email.trim();
    if (!trimmed) {
        setLoopStatus("error");
        return;
    }

    // Front-end only placeholder:
    // Later you can connect this to Mailchimp/Brevo/ConvertKit/etc.
    setLoopStatus("success");
    setEmail("");
    }

  return (
    <main className="giPage">
      
      {/* HERO */}
        <section className="giHero" aria-label="Join us now">
            <div className="container giHeroInner">
                <h1 className="giHeroTitle">JOIN US NOW</h1>
                <p className="giHeroSub">
                    There are many ways to help. Donate, volunteer, partner with us, or join our community
                    events.
                </p>
            </div>
        </section>

        {/* WAYS */}
        <section className="giWays" aria-label="Three paths forward">
            
            <div className="container">
                
                <header className="giWaysHead">
                    <div className="giEyebrow">Paths</div>
                    <h2 className="giWaysTitle">THREE WAYS FORWARD</h2>
                    <p className="giWaysSub">Pick your role and make it count</p>
                </header>

                <div className="giCards">
                    {ways.map((w) => (
                        <article className="giCard" key={w.title}>
                            
                            <div className="giCardTop">
                                <div className="giCardKicker">{w.kicker}</div>
                                <h3 className="giCardTitle">{w.title}</h3>
                                <p className="giCardDesc">{w.desc}</p>

                                <a className="giCardLink" href={w.to} aria-label={`${w.cta}: ${w.title}`}>
                                    {w.cta} <span aria-hidden="true">›</span>
                                </a>
                            </div>

                            <div className="giCardMedia">
                               
                                <img src={w.img} alt="" loading="lazy" />

                            </div>

                        </article>
                    ))}
                </div>
            </div>
        </section>

        {/* DONOR (BECOME A DONOR) */}
        <section className="giDonor" aria-label="Become a donor">
            <div className="container">
                <header className="giDonorHead">
                    {/* reuse your existing eyebrow style */}
                    <div className="giEyebrow">Impact</div>
                    <h2 className="giDonorTitle">BECOME A DONOR</h2>
                    <p className="giDonorSub">Your money reaches real people</p>
                </header>

                <div className="giDonorCard">
                    {/* Left content */}
                    <div className="giDonorLeft">
                    <div className="giDonorKicker">Choose</div>
                    <h3 className="giDonorHeading">SUPPORT WHAT MOVES YOU</h3>

                    <p className="giDonorDesc">
                        Pick a project. Wells bring clean water. Mosques create worship spaces. Madrassas build
                        education. Relief reaches urgent needs. Oorphan sponsorships change lives. Give where
                        needed most and let us direct it.
                    </p>

                    
                    </div>

                    {/* Right media */}
                    <div className="giDonorMedia" aria-label="Donor impact media">
                        <img src={chooseImg} alt="" />

                    </div>

                </div>

            </div>
            
        </section>

        {/* SERVE / VOLUNTEER YOUR TIME (tabs + split card like Home Results) */}
        <section className="giServeSection" aria-label="Volunteer your time">
           
            <div className="container">

                <header className="resultsHeader">

                    <div className="resultsEyebrow">Serve</div>

                    <h2 className="resultsTitle">VOLUNTEER YOUR TIME</h2>

                    <p className="resultsSub">
                    We need hands on the ground at events in Scarborough, on relief efforts, and at
                    community projects. Whether you can help organize a BBQ, pack relief boxes, or
                    coordinate outreach, there’s work that fits your schedule.
                    </p>


                    {/* Tabs (same pattern as Home Results) */}
                    <nav className="resultsTabs" aria-label="Volunteer categories">
                    <button
                        className={`resultsTab ${activeServe === "local" ? "isActive" : ""}`}
                        type="button"
                        onClick={() => setActiveServe("local")}
                        aria-pressed={activeServe === "local"}
                    >
                        Local work
                    </button>

                    <button
                        className={`resultsTab ${activeServe === "events" ? "isActive" : ""}`}
                        type="button"
                        onClick={() => setActiveServe("events")}
                        aria-pressed={activeServe === "events"}
                    >
                        Event help
                    </button>

                    <button
                        className={`resultsTab ${activeServe === "outreach" ? "isActive" : ""}`}
                        type="button"
                        onClick={() => setActiveServe("outreach")}
                        aria-pressed={activeServe === "outreach"}
                    >
                        Outreach
                    </button>

                    </nav>

                </header>

                {/* Dynamic split card */}
                <section className="resultsCard giServeCard" aria-label="Featured volunteer option">
                    
                    <div className="resultsMedia">
                        {current.img ? (
                            <img src={current.img} alt={current.alt} />
                        ) : (
                            <div className="giServeMediaPlaceholder" aria-hidden="true" />
                        )}
                    </div>
                    
                    <div className="resultsContent">
                        <div className="resultsTag">{current.tag}</div>
                        <h3 className="resultsCardTitle">{current.title}</h3>
                        <p className="resultsCardBody">{current.body}</p>
                    </div>

                </section>
            </div>
        </section>

        {/* STAY IN THE LOOP */}
        <section className="giLoop" aria-label="Stay in the loop" id="subscribe">
            <div className="container">
                <div className="giLoopInner">
                    <h2 className="giLoopTitle">
                        <span>STAY</span>
                        <br />
                        <span>IN THE LOOP</span>
                    </h2>

                    <p className="giLoopSub">
                        Get updates on new projects, volunteer calls, and impact stories from the field.
                    </p>

                    <form className="giLoopForm" onSubmit={onLoopSubmit}>
                        <label className="srOnly" htmlFor="loopEmail">
                        Email address
                        </label>

                        <input
                            id="loopEmail"
                            className="giLoopInput"
                            type="email"
                            inputMode="email"
                            autoComplete="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                if (loopStatus !== "idle") setLoopStatus("idle");
                            }}
                            aria-invalid={loopStatus === "error"}
                        />

                        <button className="giLoopBtn" type="submit">
                            Subscribe
                        </button>

                    </form>

                    {loopStatus === "error" && (
                        <div className="giLoopMsg" role="alert">
                        Please enter your email.
                        </div>
                    )}

                    {loopStatus === "success" && (
                        <div className="giLoopMsg" role="status">
                        You&apos;re subscribed — thank you!
                        </div>
                    )}

                    
                </div>

            </div>
            
        </section>


        <section className="giCta" aria-label="Join us">

            <div className="container">

                <div className="giCtaBox">

                    <h2 className="giCtaTitle">MAKE YOUR MOVE TODAY</h2>

                    <p className="giCtaSub">
                        Pick what matters to you. Give money, give time, or give your effort yo build something with us
                    </p>

                    <div className="giCtaActions">

                        <Link className="btn btnPrimary" to="/donate">Donate</Link>

                        <Link to="/contact" className="btn btnGhost">
                        Volunteer
                        </Link>

                    </div>

                </div>

            </div>

        </section>

        

    </main>
  );
}
