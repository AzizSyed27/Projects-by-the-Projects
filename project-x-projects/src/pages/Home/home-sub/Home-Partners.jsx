/* PARTNERS IMAGES */
import arsalanLogo from '../../../assets/partners/arsalaan-logo.png';
import dehamLogo from '../../../assets/partners/deham-logo.png';
import mtjfLogo from '../../../assets/partners/mtjf-logo.png';
import muslimhandsLogo from '../../../assets/partners/muslinhands-logo.png';
import mergedPartners from '../../../assets/partners/merged-partners.jpg';

import "../../../styles/global.css";

export default function HomePartners(){
    
    return(
        <main>
            {/* PARTNERS */}
            <section className="partnersSection" aria-label="Partners" id="partners">

                <div className="container">

                    <div className="partnersCard">

                        <div className="partnersRight">

                            <img src={mergedPartners} alt="Partner Proof" />

                        </div>

                        <div className="partnersLeft">

                            <span className="partnersKicker">PARTNERS</span>

                            <h2 className="partnersH1">WORKING WITH THOSE WHO SHARE THE MISSION</h2>

                            <p className="partnersLead">
                                Real impact is never done alone. Projects <span className="xproj"> X</span> Projects works 
                                alongside trusted partners who 
                                believe in transparency, accountability, and long-term commitment. These organizations 
                                and individuals understand that meaningful change takes time, presence, and 
                                responsibility. Need is need. Suffering is suffering. P<span className="xproj">X</span>P simply acts on that.
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
        </main>
    );
}