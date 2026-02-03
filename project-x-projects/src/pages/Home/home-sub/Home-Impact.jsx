 /* IMPACT IMAGES */ 
import bbqImg from '../../../assets/impact/bbq-img-e.jpg';
import madrassaImg from '../../../assets/impact/madrassas-image.jpg';
import masjidImg from '../../../assets/impact/masjid-image.jpg';
import waterwellImg from '../../../assets/impact/waterwell-icon.png';
import careImg from '../../../assets/impact/carepackage-icon.png';
import giftImg from '../../../assets/impact/gift-icon.png';

import { Link } from "react-router-dom";
 
 export default function HomeImpact() {

    return(
        <main>

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
                            <img src={waterwellImg} alt="" className="iconImg"/>
                        </div>

                        <h3 className="impactCardTitle">
                            CLEAN ACCESSIBLE WATER REACHES COMMUNITIES
                        </h3>

                        <p className="impactCardBody">
                            Hand-pump and electric wells across Malawi, Tanzania, Uganda, Niger,
                            Pakistan, India, and Nepal.
                        </p>

                        <Link className="impactLink" to="./projects">
                            Explore <span aria-hidden="true">›</span>
                        </Link>
                        </article>

                        <article className="impactCard impactCardTall">
                        <div className="impactTag">SPACES</div>
                        <h3 className="impactCardTitle">MOSQUES AND COMMUNITY SPACES</h3>

                        <p className="impactCardBody">
                            Building places of worship and gathering spaces where communities
                            strengthen their faith and bonds.
                        </p>

                        <Link className="impactLink" to="./projects">
                            Explore <span aria-hidden="true">›</span>
                        </Link>

                        <div className="impactMedia">
                            <img src={masjidImg} alt="A newly constructed mosque" className="impactMediaInner"/>
                        </div>
                        </article>
                    </div>

                    {/* COL 2 */}
                    <div className="impactCol">
                        <article className="impactCard impactCardTall">
                        <div className="impactTag">EDUCATION</div>
                        <h3 className="impactCardTitle">EDUCATION THROUGH SCHOOLS</h3>

                        <p className="impactCardBody">
                            Every child deserves the opportunity to learn, grow, and build a better
                            future, regardless of where they are born.
                        </p>

                        <Link className="impactLink" to="./projects">
                            Explore <span aria-hidden="true">›</span>
                        </Link>

                        <div className="impactMedia">
                            <img src={madrassaImg} alt="Children attending a madrassa class" className="impactMediaInner"/>
                        </div>
                        </article>

                        <article className="impactCard">
                            <div className="impactIcon" aria-hidden="true">
                                <img src={careImg} alt="" className="iconImg"/>
                            </div>
                            <h3 className="impactCardTitle">ESSENTIAL SUPPORT & LIVELIHOODS</h3>

                            <p className="impactCardBody">
                                Providing food, essential supplies, and equipment to help families and
                                small businesses become self-sufficient.
                            </p>

                            <Link className="impactLink" to="./projects">
                                Explore <span aria-hidden="true">›</span>
                            </Link>
                        </article>
                    </div>

                    {/* COL 3 */}
                    <div className="impactCol">
                        <article className="impactCard">
                            <div className="impactIcon" aria-hidden="true">
                                <img src={giftImg} alt="" className="iconImg"/>
                            </div>
                            <h3 className="impactCardTitle">ORPHANS AND WIDOWS SPONSERED</h3>

                            <p className="impactCardBody">
                                Sponsorships, Eid gifts, and practical assistance for families facing
                                loss and struggle.
                            </p>

                            <Link className="impactLink" to="./projects">
                                Explore <span aria-hidden="true">›</span>
                            </Link>
                        </article>

                        <article className="impactCard impactCardTall">
                            <div className="impactTag">Community</div>
                            <h3 className="impactCardTitle">SCARBOROUGH BRINGS IT TOGETHER</h3>

                            <p className="impactCardBody">
                                Local events, sports and educational initiatives that bring
                                people together and turn good intentions into action.
                            </p>

                            <Link className="impactLink" to="./about">
                                Explore <span aria-hidden="true">›</span>
                            </Link>

                            <div className="impactMedia">
                                <img src={bbqImg} alt="Community members gathered at a local event" className="impactMediaInner"/>
                            </div>
                        </article>
                    </div>
                    </div>
                </div>
            </section>


        </main>
    );
}