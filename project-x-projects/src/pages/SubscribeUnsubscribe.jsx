import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";

export default function SubscribeUnsubscribe() {
  const [sp] = useSearchParams();
  const token = sp.get("token");

  const [state, setState] = useState({ loading: true, ok: false, msg: "" });

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!token) {
        setState({ loading: false, ok: false, msg: "Missing token. Please use the link from your email." });
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/api/subscribers/unsubscribe`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const json = await res.json();
        if (cancelled) return;

        setState({
          loading: false,
          ok: !!json.ok,
          msg: json.message || (json.ok ? "You have been unsubscribed." : "Invalid link."),
        });
      } catch {
        if (cancelled) return;
        setState({ loading: false, ok: false, msg: "Couldn’t unsubscribe right now. Please try again later." });
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <main style={{ background: "var(--bg1)", minHeight: "70vh", padding: "44px 0" }}>
      <div className="container">
        <section className="heroCard" style={{ maxWidth: 880, margin: "0 auto" }}>
          <div className="heroLeft" style={{ width: "100%" }}>
            <div className="kicker">Newsletter</div>

            <h1 className="h1" style={{ marginTop: 8 }}>
              {state.loading ? "Processing…" : state.ok ? "Unsubscribed" : "Couldn’t unsubscribe"}
            </h1>

            <p className="lead" style={{ marginTop: 10 }}>
              {state.msg}
            </p>

            <div className="heroActions" style={{ marginTop: 18 }}>
              <Link className="btn btnPrimary" to="/">
                Go back home
              </Link>
              <Link className="btn btnGhost" to="/contact">
                Contact us
              </Link>
            </div>

            {state.ok && (
              <p className="adminHint" style={{ marginTop: 12 }}>
                Changed your mind? You can subscribe again anytime from the website.
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
