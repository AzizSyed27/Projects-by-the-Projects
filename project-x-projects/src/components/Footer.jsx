import { Link } from "react-router-dom";
import instaLogo from "../assets/footer/instagram-logo-black-transparent.png"

const COLS = [
  {
    title: "Our work",
    links: [
      { label: "Projects", to: "/projects" },
      { label: "Get involved", to: "/get-involved" },
      { label: "About us", to: "/about" },
      { label: "Contact", to: "/contact" },
      
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Gallery", to: "/#gallery" },
      { label: "Results", to: "/#results" },
      { label: "Partners", to: "/#partners" },
      { label: "FAQ", to: "/#faq" },
    ],
  },
  {
    title: "Connect",
    links: [
      { label: "Donate now", to: "/donate" },
      { label: "Newsletter", to: "/get-involved/#subscribe" },
      { label: "Social media", to: "https://www.instagram.com/projectsxprojects/" },
      { label: "Support", to: "/contact" },
    ],
  },
];

// tiny inline icon helper (no extra libs)
function SocialIcon({ label, href, children }) {
  return (
    <a className="footerSocial" href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
      {children}
    </a>
  );
}

export default function Footer() {
  function onSubmit(e) {
    e.preventDefault();
    // MVP: wire this later to Mailchimp/Brevo/etc.
    alert("Thanks! Newsletter signup coming soon.");
  }

  return (
    <footer className="siteFooter" aria-label="Footer">
      <div className="container">
        <div className="footerTop">
          <div className="footerBrand">
            <div className="footerLogo" aria-label="Project X Projects">
                P <span className="xproj">X</span> P
            </div>
          </div>

          <div className="footerCols" aria-label="Footer navigation">
            {COLS.map((col) => (
              <div className="footerCol" key={col.title}>
                <div className="footerColTitle">{col.title}</div>
                <ul className="footerList">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link className="footerLink" to={l.to}>
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="footerNews">
            <div className="footerColTitle">Updates</div>
            <p className="footerNewsText">
              Stay informed with our latest news and project updates from Projects by the Projects.
            </p>

            <form className="footerForm" onSubmit={onSubmit}>
              <label className="srOnly" htmlFor="footerEmail">Email</label>
              <input
                id="footerEmail"
                className="footerInput"
                type="email"
                placeholder="Enter your email"
                required
              />
              <button className="footerSubmit" type="submit">Subscribe</button>
            </form>
            {/*}
            <p className="footerFine">
              By subscribing you agree to our <Link className="footerInlineLink" to="/privacy">Privacy Policy</Link> and
              consent to receive updates from Scarborough Community Relief Project.
            </p>
            */}
          </div>
        </div>

        <div className="footerBottom">
          <div className="footerLegal">
            <span>©2020 Project by the Projects. All rights reserved.</span>
            {/*}
            <div className="footerLegalLinks">
              <Link className="footerInlineLink" to="/privacy">Privacy policy</Link>
              <Link className="footerInlineLink" to="/terms">Terms of service</Link>
              <Link className="footerInlineLink" to="/cookies">Cookie settings</Link>
            </div>
            */}
          </div>

          <div className="footerSocials" aria-label="Social links">
            
            <SocialIcon label="Instagram" href="https://www.instagram.com/projectsxprojects/">
              <span aria-hidden="true">
                <img src={instaLogo} alt="Instagram Logo"></img>
              </span>
            </SocialIcon>
            
          </div>
        </div>
      </div>
    </footer>
  );
}
