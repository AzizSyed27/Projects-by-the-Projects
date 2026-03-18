/* HERO IMAGES */
import heroImg from "../../../assets/hero/hero-image.jpg";

import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import ProjectProgress from "../../../components/ProjectProgress";

const API_BASE = import.meta.env.VITE_API_URL;

export default function HomeHero() {

    const [currentNow, setCurrentNow] = useState([]);
    const [loadingProjects, setLoadingProjects] = useState(true);
 
    useEffect(() => {
        const ac = new AbortController();
 
        (async () => {
            try {
                setLoadingProjects(true);
 
                const activeRes = await fetch(`${API_BASE}/api/projects?status=ACTIVE`, {
                    signal: ac.signal,
                });
                if (!activeRes.ok) throw new Error(`ACTIVE: ${activeRes.status}`);
                const active = await activeRes.json();
 
                const fundingRes = await fetch(`${API_BASE}/api/projects/funding`, {
                    signal: ac.signal,
                });
                if (!fundingRes.ok) throw new Error(`FUNDING: ${fundingRes.status}`);
                const fundingList = await fundingRes.json();
 
                const fundingMap = new Map(
                    (fundingList || []).map((f) => [f.projectId, f])
                );
 
                const projects = (active || []).map((p) => {
                    const f = fundingMap.get(p.projectId);
                    return {
                        projectId: p.projectId,
                        slug: p.slug,
                        title: p.projectTitle,
                        raisedCents: f?.raisedCents ?? 0,
                        goalCents: f?.goalCents ?? null,
                        isCompleted: false,
                    };
                });
 
                setCurrentNow(projects);
            } catch (e) {
                if (e?.name !== "AbortError") {
                    console.error("Failed to load projects:", e);
                }
            } finally {
                setLoadingProjects(false);
            }
        })();
 
        return () => ac.abort();
    }, []);
    
     

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
                                    Learn more<span aria-hidden="true">›</span>
                                </Link>
                            </div>

                            
                        </div>

                        <div className="heroRight">
                            <img src={heroImg} alt="Volunteers working together on a community project" />
                        </div>

                    </section>

                </div>

               {/* CURRENT PROJECTS PROGRESS */}
               
               {currentNow.length > 0 && (
                    <div className="container">
                        
                        <div className="liveProgressSection">
                            
                            <Link
                                to={`/projects#projects-work`}
                                className="projectViewLink"
                                aria-label={`View Live Projects`}
                            >
                                <span className="liveDot" aria-hidden="true" />
                                Live Projects <span aria-hidden="true">›</span>
                            </Link>

                            {loadingProjects && (
                                <p className="currentNowLoading">Loading projects…</p>
                            )}
        
                            {!loadingProjects && currentNow.length > 0 && (
                                <div className="currentNowGridHome">
                                    {currentNow.map((p) => (
                                        <article className="" key={p.projectId}>
                                            <h3 className="currentNowCardTitle">{p.title}</h3>
        
                                                <ProjectProgress
                                                    raisedCents={p.raisedCents}
                                                    goalCents={p.goalCents}
                                                    isDull={p.isCompleted}
                                                />
        
                                                
                                        </article>
                                    ))}
                                </div>
                            )}

                        </div>

                        
                    </div>
                )}

            </section>

        </main>
    );

}