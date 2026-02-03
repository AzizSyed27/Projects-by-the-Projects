import { useState } from 'react';
/* RESULTS IMAGES */
import resultsMasjidImg from '../../../assets/results/masjid-uthman-img.jpg';
import resultsWaterImg from '../../../assets/results/water-pump-img.jpg';
import resultsReliefImg from '../../../assets/results/aid-img.jpg';


export default function HomeResults(){

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
                    luxury where we work, it’s survival. Every well means a family doesn’t walk
                    miles for water.
                </>
            ),
            img: resultsWaterImg,
            alt: "Water well project",
        },
        mosques: {
            tab: "Mosques Built",
            tag: "Spaces",
            title: "MOSQUES THAT STAND, COMMUNITIES THAT GATHER",
            body:(
                <>
                    Projects <span className="xproj">X</span> Projects helps build mosques and community spaces where people can pray, learn, and connect. 
                    These spaces strengthen local bonds and serve as anchors for long-term growth.
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
                    When hardship hits, Projects <span className="xproj">X</span> Projects moves quickly with practical support: food, essentials, and urgent aid 
                    for families facing displacement and crisis.
                </>
            ),
            img: resultsReliefImg,
            alt: "Relief aid distribution",
        },
    };

    const current = results[activeResult];

    return(
        <main>
            {/* RESULTS / TANGIBLE WORK */}
            <section className="resultsSection" aria-label="Results" id="results">
                <div className="container">
                    <header className="resultsHeader">
                    <div className="resultsEyebrow">Results</div>
                    <h2 className="resultsTitle">WHAT TANGIBLE WORK LOOKS LIKE</h2>
                    <p className="resultsSub">
                        Enough talk about change. It's time to build. Wells that run, mosques that stand,
                        schools that teach, families that eat. This is what Projects <span className="xproj"> X</span> Projects does.
                    </p>

                    {/* Tabs */}
                    <nav className="resultsTabs" aria-label="Results categories">
                        <button
                        className={`resultsTab ${activeResult === "water" ? "isActive" : ""}`}
                        type="button"
                        onClick={() => setActiveResult("water")}
                        >
                        Water Wells
                        </button>

                        <button
                        className={`resultsTab ${activeResult === "mosques" ? "isActive" : ""}`}
                        type="button"
                        onClick={() => setActiveResult("mosques")}
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

                    {/* Dynamic card */}
                    <section className="resultsCard" aria-label="Featured result">
                        <div className="resultsMedia">
                            <img src={current.img} alt={current.alt} />
                        </div>

                        <div className="resultsContent">
                            <div className="resultsTag">{current.tag}</div>
                            <h3 className="resultsCardTitle">{current.title}</h3>
                            <p className="resultsCardBody">{current.body}</p>

                        </div>

                    </section>

                </div>

            </section>
        </main>
    );
}