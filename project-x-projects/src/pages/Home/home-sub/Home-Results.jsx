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
            stat: {
            label: "WELLS BUILT",
            value: "40+",
            desc: "Hand-pump and electric wells across seven countries",
            minis: [
                { k: "Countries", v: "7" },
                { k: "Regions", v: "Rural" },
                { k: "Type", v: "Pump + Electric" },
            ],
            },
        },

        mosques: {
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
            stat: {
            label: "COMMUNITIES SERVED",
            value: "10",
            desc: "Countries where we work and build",
            minis: [
                { k: "Countries", v: "3" },
                { k: "Regions", v: "Rural" },
                { k: "Buildings", v: "Mosques + Schools" },
            ],
            },
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
            stat: {
            label: "FAMILIES SUPPORTED",
            value: "1000+",
            desc: "Orphans, widows, and those facing hardship",
            minis: [
                { k: "Countries", v: "10" },
                { k: "Regions", v: "Rural" },
                { k: "Type", v: "Food + Essentials" },
            ],
            },
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

                    <section className="resultsCard resultsCardMerged" aria-label="Featured result">
                        {/* LEFT: image with overlay text */}
                        <div className="resultsMedia resultsMediaOverlay">
                            <img src={current.img} alt={current.alt} />

                            <div className="resultsOverlay">
                                <div className="resultsTag">{current.tag}</div>
                                <h3 className="resultsCardTitle">{current.title}</h3>
                                <p className="resultsCardBody">{current.body}</p>

                            </div>
                        </div>

                        {/* RIGHT: the single stat for this tab */}
                        <article className="resultsStat" aria-label={`Impact stat: ${current.stat.label}`}>
                            <div className="numbersLabel">{current.stat.label}</div>
                            <div className="numbersValue">{current.stat.value}</div>
                            <div className="numbersDivider" />
                            <p className="numbersDesc">{current.stat.desc}</p>

                            {current.stat.minis?.length ? (
                                <div className="resultsMiniGrid" aria-label="Additional metrics">
                                    {current.stat.minis.map((m) => (
                                    <div className="resultsMini" key={m.k}>
                                        <div className="resultsMiniK">{m.k}</div>
                                        <div className="resultsMiniV">{m.v}</div>
                                    </div>
                                    ))}
                                </div>
                            ) : null}
                        </article>
                        
                    </section>

                </div>

            </section>
        </main>
    );
}