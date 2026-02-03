import { useState } from "react";
import { Link } from "react-router-dom";

export default function HomeFAQ(){

    // first one open 
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
                "a well, a mosque, relief aid. We don’t guess. We ask, we verify, we act.",
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

    return(
        <main>

            {/* QUESTIONS / FAQ */}
            <section className="faqSection" aria-label="Questions" id="faq">
                
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
                            <div className={`faqItem ${isOpen ? "isOpen" : ""}`} key={item.q} role="listitem">
                                
                                <button
                                className="faqQ"
                                type="button"
                                aria-expanded={isOpen}
                                onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                                >
                                    <span className="faqQText">{item.q}</span>
                                    <span className="faqIcon" aria-hidden="true">{isOpen ? "–" : "+"}</span>
                                </button>
                                
                                <div className="faqAnswerWrap" >

                                    <div className="faqA">
                                        {item.a}
                                    </div>
                                </div>

                            </div>
                            );
                        })}
                    </div>

                    <div className="faqMore">
                        <h3 className="faqMoreTitle">MORE QUESTIONS?</h3>
                        <p className="faqMoreSub">Reach out. We’re here to answer.</p>
                        <Link className="btn faqContactBtn" to="/contact">Contact</Link>
                    </div>

                </div>

            </section>
            
        </main>
    );
}