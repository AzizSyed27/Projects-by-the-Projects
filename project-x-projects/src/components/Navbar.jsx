import React, { useEffect, useId, useRef, useState } from "react";
import { Link } from "react-router-dom";
import pxpLogo from "../assets/pxp-logo.png";
import newLogo from "../assets/pxp-mini-logo.png";

const EXPLORE_ITEMS = [
  { label: "Home", to: "/" },
  { label: "About Us", to: "/about" },
  { label: "Projects", to: "/projects" },
  { label: "Get Involved", to: "/get-involved" },
  { label: "Contact Us", to: "/contact" },
];

export default function Navbar() {
  const [exploreOpen, setExploreOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  const panelId = useId();
  const wrapRef = useRef(null);

  // Sticky + “hover state when scrolled”
  useEffect(() => {
    const onScroll = () => setIsSticky(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close on outside click + ESC
  useEffect(() => {
    const onDown = (e) => {
      if (!exploreOpen) return;
      if (e.key === "Escape") setExploreOpen(false);
    };

    const onClick = (e) => {
      if (!exploreOpen) return;
      const el = wrapRef.current;
      if (el && !el.contains(e.target)) setExploreOpen(false);
    };

    document.addEventListener("keydown", onDown);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onDown);
      document.removeEventListener("mousedown", onClick);
    };
  }, [exploreOpen]);

  const solid = isSticky || exploreOpen; // “hover” look when scrolled OR explore is open

  useEffect(() => {
    if (exploreOpen) {
      document.body.classList.add("navNoScroll");
    } else {
      document.body.classList.remove("navNoScroll");
    }
    return () => document.body.classList.remove("navNoScroll");
  }, [exploreOpen]);

  return (
    <header ref={wrapRef} className={`navWrap ${solid ? "isSolid" : ""}`}>
      <div className="container navRow">
        {/* LEFT: Explore */}
        <div className="navLeft">
          <button
            className={`navExploreBtn ${exploreOpen ? "isOpen" : ""}`}
            type="button"
            aria-haspopup="dialog"
            aria-expanded={exploreOpen}
            aria-controls={panelId}
            onClick={() => setExploreOpen((v) => !v)}
          >
            Explore {/*<span className="navCaret" aria-hidden="true">▾</span>*/}
          </button>
        </div>

        {/* CENTER: Brand (logo animation on hover/solid) */}
        <Link to="/" className="brand brandCentered" aria-label="Project X Projects Home">
          <span className="logoSwap" aria-hidden="true">
            {/* Old logo split */}
            <span className="logoOld logoOldLeft">
              <img src={pxpLogo} alt="" />
            </span>
            <span className="logoOld logoOldRight">
              <img src={pxpLogo} alt="" />
            </span>

            {/* New logo emerges from center */}
            <span className="logoNew">
              <img src={newLogo} alt="" />
            </span>
          </span>

          {/* Accessible alt for screen readers */}
          <span className="srOnly">Project X Projects</span>
        </Link>

        {/* RIGHT: Actions */}
        <div className="navActions">
          <Link className="btn navBtn" to="/donate">Donate</Link>
        </div>
      </div>

      {/* EXPLORE DRAWER */}
      <div
        id={panelId}
        className={`exploreOverlay ${exploreOpen ? "isOpen" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Explore menu"
      >
        <div className="explorePanel">
          <div className="exploreLeft">

            <nav className="exploreList" aria-label="Explore">
              {EXPLORE_ITEMS.map((item) => (
                <Link
                  key={item.to}
                  className="exploreItem"
                  to={item.to}
                  onClick={() => setExploreOpen(false)}
                >
                  <span>{item.label}</span>
                  <span className="exploreChevron" aria-hidden="true">›</span>
                </Link>
              ))}
            </nav>

            <div className="exploreMobileActions">
              <Link className="btn btnPrimary exploreDonateBtn" to="/donate" onClick={() => setExploreOpen(false)}>
                Donate
              </Link>
            </div>

            <a className="exploreMemberLink" href="#" onClick={(e) => e.preventDefault()}>
              Admin Site <span aria-hidden="true">↗</span>
            </a>
          </div>

          <div className="exploreRight" aria-hidden="true">
            <button
              className="exploreClose exploreCloseRight"
              type="button"
              onClick={() => setExploreOpen(false)}
              aria-label="Close explore menu"
              >
              ×
            </button>

            <div className="exploreHero">
              <div className="exploreHeroText">CHANGE STARTS HERE</div>
              <Link className="exploreCta" to="/donate" onClick={() => setExploreOpen(false)}>
                DONATE
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
