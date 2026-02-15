export default function Contact() {
  return (
    <main>

      <section className="giHero" aria-label="Join us now">
            <div className="container giHeroInner">
                <h1 className="giHeroTitle">GET IN TOUCH</h1>
                <p className="giHeroSub">
                    Questions about our work or how to get involved? We’re listening.
                </p>
            </div>
        </section>
      <section className="contactSection" aria-label="Contact">
        <div className="container">
        



          {/* TOP ROW */}
          <div className="contactTop">
            <div className="contactLeft">
              <div className="contactKicker">Reach out</div>
              <h1 className="contactTitle">CALL OR E-MAIL</h1>
              <p className="contactLead">
                Whether you have questions about our projects,
                volunteering, or need assistance.
              </p>
            </div>

            <div className="contactRight" aria-label="Contact details">
              <div className="contactInfoItem">
                <span className="contactIcon" aria-hidden="true">
                  ✉
                </span>
                <div className="contactInfoText">
                  <div className="contactInfoLabel">EMAIL</div>
                  <a className="contactInfoValue" href="mailto:info@scarboroughrelief.ca">
                    info@projectsxprojects.ca 
                  </a>
                </div>
              </div>

              <div className="contactInfoItem">
                <span className="contactIcon" aria-hidden="true">
                  ☎
                </span>
                <div className="contactInfoText">
                  <div className="contactInfoLabel">PHONE</div>
                  <a className="contactInfoValue" href="tel:+16475693331">
                    +1 (647) 569-3331
                  </a>
                </div>
              </div>

              <div className="contactInfoItem">
                <span className="contactIcon" aria-hidden="true">
                  ⌂
                </span>
                <div className="contactInfoText">
                  <div className="contactInfoLabel">OFFICE</div>
                  <div className="contactInfoValue">
                    Scarborough, Toronto, Ontario, Canada
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* MAP */}
          <div className="contactMapWrap" aria-label="Map">
            {/* Option A: image placeholder (looks like screenshot) */}
            <div className="contactMap" aria-label="Map showing our location">
                <iframe
                    title="Scarborough Community Relief Location"
                    src="https://www.google.com/maps?q=Scarborough%2C%20Toronto%2C%20Ontario%2C%20Canada&output=embed"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
