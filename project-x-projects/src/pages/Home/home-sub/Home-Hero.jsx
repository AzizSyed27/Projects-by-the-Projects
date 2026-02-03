/* HERO IMAGES */
import heroImg from "../../../assets/hero/hero-image.jpg";

import { Link } from "react-router-dom";

export default function HomeHero() {

    return(
        <main>
            <section className="heroSection" aria-label="Hero">

                <div className="container">
                    <section className="heroCard" aria-label="Hero">
                    
                        <div className="heroLeft">
                            
                            <span className="kicker">Welcome to <span className="xproj"> PROJECTS</span> BY THE <span className="xproj">PROJECTS </span></span>

                            <h1 className="h1">
                            ACT LOCALLY, <br /> 
                            HELP GLOBALLY, <br />
                            KEEP IT REAL.
                            </h1>

                            <p className="lead">
                            Projects <span className="xproj"> X</span> Projects started in Scarborough with a simple belief: real change comes from
                            real people doing real work - wells, mosques, schools, relief packages,
                            and support for families in need. 
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
                            <img src={heroImg} alt="Volunteers working together on a community project" />
                        </div>

                    </section>

                </div>

            </section>

        </main>
    );

}