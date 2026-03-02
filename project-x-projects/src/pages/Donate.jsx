import "../styles/donate.css";
import { useState } from "react";
import { Link } from "react-router-dom";

import transferIcon from "../assets/donate/transfer-icon.png"
import check from "../assets/donate/check-mark.svg"

import wave from "../assets/about/about-wave-icon.png"
import edu from "../assets/about/about-edu-icon.png"
import mosque from "../assets/about/about-mosque-icon.png"
import comm from "../assets/about/about-comm-icon.png"
import project from "../assets/about/about-project-icon.png"
import relief from "../assets/impact/carepackage-icon.png"

import StripeDonateEmbed from "../components/StripeDonateEmbed.jsx";

export default function Donate() {

    const bulletLeft = [
        "Water wells serve families",
        "Schools educate children",
        "Orphans and widows get support",
        "We’ll send you a receipt",
        "Clean records, honest work",
    ];

    const bulletRight = [
        "Mosques build community spaces",
        "Relief reaches those in crisis",
        "Let us decide wisely",
        "Email us after donating",
        "You’ll see the impact",
    ];

    
    const etransferEmail = "info@projectsxprojects.ca";

    const [copyStatus, setCopyStatus] = useState("idle"); // idle | copied | error

    async function copyEmail() {
    try {
        const text = etransferEmail;

        // Best option (works on HTTPS + localhost)
        if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        } else {
        // Fallback for non-HTTPS (older browsers)
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.setAttribute("readonly", "");
        ta.style.position = "absolute";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        }

        setCopyStatus("copied");
        window.clearTimeout(window.__copyTimer);
        window.__copyTimer = window.setTimeout(() => setCopyStatus("idle"), 1600);
    } catch (e) {
        setCopyStatus("error");
        window.clearTimeout(window.__copyTimer);
        window.__copyTimer = window.setTimeout(() => setCopyStatus("idle"), 2000);
    }
    }

    const [activeGift, setActiveGift] = useState("wells");

    const giftOptions = {
        wells: {
            label: "WATER WELLS",
            title: "WATER WELLS BRING LIFE TO DRY PLACES",
            desc: "Hand-pump and electric wells serve families for years. Maintenance included.",
            icon: wave,
            learnTo: "/projects",
            shareTo: "#",
        },
        mosques: {
            label: "MOSQUES",
            title: "MOSQUES STRENGTHEN COMMUNITY LIFE",
            desc: "Support spaces for prayer, learning, and gathering. Built for long-term use.",
            icon: mosque,
            learnTo: "/projects",
            shareTo: "#",
        },
        education: {
            label: "EDUCATION",
            title: "EDUCATION BUILDS FUTURES THAT LAST",
            desc: "Help build learning spaces and give students the tools to thrive.",
            icon: edu,
            learnTo: "/projects",
            shareTo: "#",
        },
        relief: {
            label: "RELIEF",
            title: "RELIEF REACHES FAMILIES WHEN IT MATTERS MOST",
            desc: "Emergency support for urgent needs: food, essentials, and rapid response.",
            icon: relief,
            learnTo: "/projects",
            shareTo: "#",
        },
        orphans: {
            label: "ORPHANS",
            title: "ORPHAN SUPPORT MEANS CONSISTENT CARE",
            desc: "Provide steady support that covers essentials, dignity, and stability.",
            icon: comm,
            learnTo: "/projects",
            shareTo: "#",
        },
        needed: {
            label: "MOST NEEDED",
            title: "GIVE WHERE IT’S NEEDED MOST",
            desc: "Let us direct your donation to the most urgent and impactful needs.",
            icon: project,
            learnTo: "/projects",
            shareTo: "#",
        },
    };

    const currentGift = giftOptions[activeGift];
    const giftKeys = Object.keys(giftOptions);

    // FAQ accordion (same pattern as Home-FAQ.jsx)
    const [openFaq, setOpenFaq] = useState(0);

    const faqs = [
        {
        q: "How do I donate?",
        a:
            `Send an e-transfer to ${etransferEmail}. ` +
            "In the message, write which project you want to support. " +
            "That’s it. A payment gateway is coming soon for more options.",
        },
        {
        q: "Do I get a receipt after donating?",
        a:
            "Check you email after you donate and we’ll send one your way. " +
            "We keep records clean and honest.",
        },
        {
        q: "Where does my money go?",
        a:
            "Straight to the project you choose. We work with trusted partners on the ground " +
            "in Malawi, Tanzania, Uganda, Niger, Pakistan, India, Nepal, and Canada. No middlemen.",
        },
        {
        q: "Will I get updates?",
        a:
            "Yes. We share photos, videos, and receipts as projects move forward. " +
            "You’ll see the work happen.",
        },
        {
        q: "Can I donate anonymously?",
        a:
            "Of course. Just send your e-transfer without identifying information if you prefer. " +
            "We honor that.",
        },
    ];

    //for donating tabs
    const [donateMethod, setDonateMethod] = useState("stripe");

    return (
        <main className="donatePage">
            {/* HEADER */}
            <section className="donateHero" aria-label="Support a project">
                <div className="container donateHeroInner">
                    <h1 className="donateHeroTitle">SUPPORT A PROJECT</h1>
                    <p className="donateHeroSub">
                        Every donation builds wells, mosques, schools, and brings relief to families in need
                    </p>
                </div>
            </section>

            {/* HOW TO DONATE */}
            <section className="donateHow" aria-label="How to donate">

                <div className="container">

                    <header className="donateHowHead">
                        <div className="donateEyebrow">Give</div>
                        <h2 className="donateHowTitle">HOW TO DONATE</h2>
                        <p className="donateHowSub">
                        Three simple steps to send your gift where it matters.
                        </p>
                    </header>

                    <div className="donateMethodTabs" role="tablist" aria-label="Donation method">
                        
                        <button
                            type="button"
                            className={`donateMethodTab ${donateMethod === "stripe" ? "isActive" : ""}`}
                            role="tab"
                            aria-selected={donateMethod === "stripe"}
                            onClick={() => setDonateMethod("stripe")}
                        >
                            Card / Apple Pay
                        </button>

                        <button
                            type="button"
                            className={`donateMethodTab ${donateMethod === "etransfer" ? "isActive" : ""}`}
                            role="tab"
                            aria-selected={donateMethod === "etransfer"}
                            onClick={() => setDonateMethod("etransfer")}
                        >
                            E-Transfer
                        </button>
                    </div>

                    {donateMethod === "stripe" ? (
                        <div className="donateMethodPanel" role="tabpanel" aria-label="Donate by card">
                            <StripeDonateEmbed />
                        </div>
                        ) : (
                        <div className="donateMethodPanel" role="tabpanel" aria-label="Donate by e-transfer">
                            
                            <article className="donateCard">
                                {/* Top bar */}
                                <div className="donateCardTop">
                                    <div className="donateCardTopLeft">
                                    <div className="donateIcon" aria-hidden="true">
                                        <img src={transferIcon} alt=""/>
                                    </div>

                                    <div className="donateCardTopText">
                                        <div className="donateMethod">SEND E-TRANSFER</div>
                                        <div className="donateTo">
                                        To <span className="donateEmail">{etransferEmail}</span>
                                        </div>
                                    </div>
                                    </div>

                                    <div className="donateAnyAmount">ANY AMOUNT</div>
                                </div>

                                <div className="donateDivider" />

                                {/* Middle content */}
                                <div className="donateBody">
                                    <div className="donateBodyKicker">Tell us your project</div>

                                    <div className="donateChecks">
                                        <ul className="donateList">
                                            {bulletLeft.map((t) => (
                                            <li key={t}>
                                                <span className="donateCheck" aria-hidden="true">
                                                <img src={check} alt=""/>
                                                </span>
                                                {t}
                                            </li>
                                            ))}
                                        </ul>

                                        <ul className="donateList">
                                            {bulletRight.map((t) => (
                                            <li key={t}>
                                                <span className="donateCheck" aria-hidden="true">
                                                <img src={check} alt=""/>
                                                </span>
                                                {t}
                                            </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {/* Bottom CTA */}
                                <div className="donateCardBottom">
                                    <button
                                    className="donateBtn"
                                    type="button"
                                    onClick={copyEmail}
                                    aria-label="Copy e-transfer email to clipboard"
                                >
                                    {copyStatus === "copied" ? "Copied!" : "Copy e-transfer email"}
                                    </button>

                                    <div className="donateNote" aria-live="polite">
                                        {copyStatus === "copied" && (
                                            <>Copied <strong>{etransferEmail}</strong> to clipboard.</>
                                        )}
                                        {copyStatus === "error" && (
                                            <>Couldn’t copy automatically — please copy manually: <strong>{etransferEmail}</strong></>
                                        )}
                                        {copyStatus === "idle" && (
                                            <>Tip: include your preferred project in the e-transfer note (or email us after).</>
                                        )}
                                    </div>

                                </div>

                            </article>
                            
                        </div>
                    )}

                    
                </div>
            </section>
            


            {/* DIRECT (CHOOSE WHERE YOUR GIFT GOES) */}
            <section className="donateDirect" aria-label="Choose where your gift goes">
                <div className="container">
                    <header className="donateDirectHead">
                        <div className="donateEyebrowDirect">Direct</div>
                        <h2 className="donateDirectTitle">CHOOSE WHERE YOUR GIFT GOES</h2>
                        <p className="donateDirectSub">
                            Pick a project that moves you. Every dollar reaches the ground and builds something real.
                        </p>
                    </header>

                    <div className="donateDirectCard">
                        {/* LEFT: dynamic content */}
                        <div className="donateDirectLeft">
                            <div className="donateDirectIcon" aria-hidden="true">
                                <img src={currentGift.icon} alt=""/>
                            </div>

                            <h3 className="donateDirectLeftTitle">{currentGift.title}</h3>
                            <p className="donateDirectLeftDesc">{currentGift.desc}</p>

                            <div className="donateDirectActions">
                            <a className="donateDirectBtn" href={currentGift.learnTo}>
                                Learn more <span aria-hidden="true"> ›</span>
                            </a>
                            
                            </div>
                        </div>

                        {/* RIGHT: category list */}
                        <aside className="donateDirectRight" aria-label="Donation categories">
                            {giftKeys.map((key) => {
                            const item = giftOptions[key];
                            const active = key === activeGift;

                            return (
                                <button
                                key={key}
                                type="button"
                                className={`donateDirectItem ${active ? "isActive" : ""}`}
                                onClick={() => setActiveGift(key)}
                                aria-pressed={active}
                                >
                                {item.label}
                                </button>
                            );
                            })}
                        </aside>
                    </div>
                </div>
            </section>

            {/* QUESTIONS / FAQ (same component logic + classnames as Home-FAQ.jsx) */}
            <section className="donateFaqSection" aria-label="Questions">
                <div className="container">
                    <header className="faqHeader">
                        <h2 className="faqTitle">QUESTIONS</h2>
                        <p className="faqSub">
                        We keep things simple and transparent. Here’s what you need to know.
                        </p>
                    </header>

                    <div className="faqList" role="list">
                        {faqs.map((item, idx) => {
                        const isOpen = openFaq === idx;
                        const panelId = `donate-faq-panel-${idx}`;

                        return (
                            <div
                            className={`donatefaqItem ${isOpen ? "isOpen" : ""}`}
                            key={item.q}
                            role="listitem"
                            >
                            <button
                                className="faqQ"
                                type="button"
                                aria-expanded={isOpen}
                                aria-controls={panelId}
                                onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                            >
                                <span className="faqQText">{item.q}</span>
                                <span className="faqIcon" aria-hidden="true">
                                {isOpen ? "–" : "+"}
                                </span>
                            </button>

                            <div className="faqAnswerWrap" id={panelId}>
                                <div className="faqA">{item.a}</div>
                            </div>
                            </div>
                        );
                        })}
                    </div>

                    <div className="faqMore">
                        <h3 className="faqMoreTitle">STILL HAVE QUESTIONS?</h3>
                        <p className="faqMoreSub">Reach out. We’re here to help.</p>
                        <Link className="donateFaqContactBtn" to="/contact">
                        Contact
                        </Link>
                    </div>
                </div>
            </section>

        </main>
    );
}
