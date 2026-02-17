import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL;

export default function DonateComplete() {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");

  const [status, setStatus] = useState("loading");

  useEffect(() => {
    if (!sessionId) {
      setStatus("missing");
      return;
    }

    fetch(`${API_BASE}/api/donations/session-status?sessionId=${encodeURIComponent(sessionId)}`)
      .then((r) => r.json())
      .then((d) => setStatus(d.status || "unknown"))
      .catch(() => setStatus("unknown"));
  }, [sessionId]);

  return (
    <main className="donatePage">
      <section className="donateHero">
        <div className="container donateHeroInner">
          <h1 className="donateHeroTitle">DONATION STATUS</h1>
          {status === "loading" && <p className="donateHeroSub">Checking your donation…</p>}
          {status === "missing" && <p className="donateHeroSub">Missing session_id.</p>}
          {status !== "loading" && status !== "missing" && (
            <p className="donateHeroSub">Status: <strong>{status}</strong></p>
          )}
          <Link className="donateFaqContactBtn" to="/donate">Back to Donate</Link>
        </div>
      </section>
    </main>
  );
}
