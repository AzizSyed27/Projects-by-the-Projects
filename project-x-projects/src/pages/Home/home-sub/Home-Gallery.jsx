import { useEffect, useMemo, useRef, useState } from "react";

/* GALLERY IMAGES */
import recent1 from "../../../assets/recent/recent-1.png";
import recent2 from "../../../assets/recent/recent-2.png";
import recent3 from "../../../assets/recent/recent-3.png";
import recent4 from "../../../assets/recent/recent-4.jpg";
import recent5 from "../../../assets/recent/recent-5.png";
import recent6 from "../../../assets/recent/recent-6.jpg";
import recent7 from "../../../assets/recent/recent-7.jpg";
import recent8 from "../../../assets/recent/recent-8.jpg";
import recent9 from "../../../assets/recent/recent-9.jpg";
import recent10 from "../../../assets/recent/recent-10.jpg";
import recent11 from "../../../assets/recent/recent-11.jpg";
import recent12 from "../../../assets/recent/recent-12.jpg";
import recent13 from "../../../assets/recent/recent-13.jpg";
import recent14 from "../../../assets/recent/recent-14.jpg";

export default function HomeGallery() {

    const recentRef = useRef(null);
    const [paused, setPaused] = useState(false);

    const recentItems = useMemo(
        () => [
        { img: recent1, alt: "Recent project photo 1" },
        { img: recent2, alt: "Recent project photo 2" },
        { img: recent3, alt: "Recent project photo 3" },
        { img: recent4, alt: "Recent project photo 4" },
        { img: recent5, alt: "Recent project photo 5" },
        { img: recent6, alt: "Recent project photo 6" },
        { img: recent7, alt: "Recent project photo 7" },
        { img: recent8, alt: "Recent project photo 8" },
        { img: recent9, alt: "Recent project photo 9" },
        { img: recent10, alt: "Recent project photo 10" },
        { img: recent11, alt: "Recent project photo 11" },
        { img: recent12, alt: "Recent project photo 12" },
        { img: recent13, alt: "Recent project photo 13" },
        { img: recent14, alt: "Recent project photo 14" },
        ],
        []
    );

    // Duplicate the list 
    const railItems = useMemo(() => [...recentItems, ...recentItems], [recentItems]);

    useEffect(() => {
        const el = recentRef.current;
        if (!el) return;

        // for reduced-motion users
        const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
        if (reduce) return;

        let raf = 0;
        let last = performance.now();

        // pixels per second
        const speed = 100;

        const tick = (now) => {
        const dt = (now - last) / 1000;
        last = now;

        if (!paused) {
            el.scrollLeft += speed * dt;

            // When we hit halfway (end of the first copy), jump back by half
            const half = el.scrollWidth / 2;
            if (el.scrollLeft >= half) el.scrollLeft -= half;
        }

        raf = requestAnimationFrame(tick);
        };

        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [paused]);

  return (
    <main>
      {/* RECENT WORK */}
      <section className="recentSection" aria-label="Recent work" id="gallery">
        <div className="container">
          <header className="recentHeader">
            <h2 className="recentTitle">RECENT WORK</h2>
            <p className="recentSub">
              Photos and stories from the field show what we’ve built and who we’ve helped.
            </p>
          </header>

          <div className="recentRailWrap">
            <div
              className="recentRail autoScroll"
              ref={recentRef}
              // pause if the user interacts (nice UX)
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
              onTouchStart={() => setPaused(true)}
              onTouchEnd={() => setPaused(false)}
              onFocus={() => setPaused(true)}
              onBlur={() => setPaused(false)}
            >
              {railItems.map((item, i) => {
                // second half are clones
                const isClone = i >= recentItems.length; 
                return (
                  <div className="recentCard" key={`${item.alt}-${i}`} aria-hidden={isClone}>
                    <img
                      src={item.img}
                      alt={isClone ? "" : item.alt}
                      loading="lazy"
                      draggable="false"
                    />
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
