import { useCallback, useMemo, useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import "../styles/donate.css";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
const API_BASE = import.meta.env.VITE_API_URL;

function dollarsToCents(val) {
    const n = Number(val);
    if (!Number.isFinite(n)) return null;
    return Math.round(n * 100);
}

function formatCad(amountStr) {
    const n = Number(amountStr);
    if (!Number.isFinite(n)) return "";
    try {
        return new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(n);
    } catch {
        return `$${n.toFixed(2)} CAD`;
    }
}

function calcStripeFeeCAD(amountDollars, rate = 0.029, fixed = 0.30) {
    const amt = Number(amountDollars);
    if (!Number.isFinite(amt) || amt <= 0) return { fee: 0, net: 0 };

    const fee = amt * rate + fixed;
    const net = Math.max(0, amt - fee);
    return { fee, net };
}

export default function StripeDonateEmbed({ projectId = null }) {
  
    const presets = [25, 50, 100, 250];

    const [amount, setAmount] = useState("");
    const [donationReq, setDonationReq] = useState(null); // { amountCents, currency, projectId }
    const [error, setError] = useState("");
    const [complete, setComplete] = useState(false);
    const [loading, setLoading] = useState(false);

    const fetchClientSecret = useCallback(async () => {
        setLoading(true);
        try {
        const res = await fetch(`${API_BASE}/api/donations/checkout-session`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(donationReq),
        });

        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.message || "Could not start checkout. Please try again.");
        return data.clientSecret;
        } finally {
        setLoading(false);
        }
    }, [donationReq]);

    const options = useMemo(() => {
        if (!donationReq) return null;
        return { fetchClientSecret, onComplete: () => setComplete(true) };
    }, [donationReq, fetchClientSecret]);

    function setPreset(v) {
        setError("");
        setAmount(String(v));
    }

    function start(e) {
        e.preventDefault();
        setError("");

        const cents = dollarsToCents(amount);
        if (!cents || cents < 100) {
        setError("Minimum donation is $1.00 CAD.");
        return;
        }

        setDonationReq({
        amountCents: cents,
        currency: "cad",
        projectId: selectedProjectId ?? projectId ?? null,
        });
    }

    function reset() {
        setComplete(false);
        setDonationReq(null);
        setError("");
    }

    const pretty = formatCad(amount);
    
    const showCheckout = !!donationReq && !complete;

    //Calculate fees for display purposes 
    const { fee, net } = calcStripeFeeCAD(amount);
    const feePretty = formatCad(fee.toFixed(2));
    const netPretty = formatCad(net.toFixed(2));

    const [projects, setProjects] = useState([]);
    const [projectsLoading, setProjectsLoading] = useState(false);
    const [selectedProjectId, setSelectedProjectId] = useState(null);
    const [selectedProjectTitle, setSelectedProjectTitle] = useState(null);

    useEffect(() => {
    let cancelled = false;

    async function loadProjects() {
        setProjectsLoading(true);
        try {
        const res = await fetch(`${API_BASE}/api/projects/active-options`);
        const data = await res.json().catch(() => []);
        if (!cancelled) setProjects(Array.isArray(data) ? data : []);
        } catch {
        if (!cancelled) setProjects([]);
        } finally {
        if (!cancelled) setProjectsLoading(false);
        }
    }

    loadProjects();
    return () => { cancelled = true; };
    }, []);

    const heading = selectedProjectTitle
        ? `DONATE TO ${selectedProjectTitle.toUpperCase()}`
        : "DONATE TO PROJECTS X PROJECTS";

  return (
    <section className="donateStripeSection" aria-label="Donate by card">
        <div className="container">
            <header className="donateStripeHead">
                <div className="donateStripeEyebrow">Card</div>
                <h2 className="donateDirectTitle">{heading}</h2>
                <p className="donateStripeSub">
                    Secure Stripe checkout. Your payment details go to Stripe, not our servers.
                </p>
            </header>

            <article className={`donateStripeCard ${showCheckout ? "isCheckout" : "isIntro"}`}>
                {/* LEFT: amount + reassurance */}
                <div className="donateStripeLeft">
                    

                    {!donationReq && !complete && (
                        <>
                            <div className="donateStripePanelTitle">Choose an amount</div>
                            <div className="donateStripePresets" role="group" aria-label="Suggested donation amounts">
                            {presets.map((p) => {
                                const active = String(p) === String(amount);
                                return (
                                <button
                                    key={p}
                                    type="button"
                                    className={`donateStripeChip ${active ? "isActive" : ""}`}
                                    onClick={() => setPreset(p)}
                                >
                                    ${p}
                                </button>
                                );
                            })}
                            </div>

                            <form className="donateStripeForm" onSubmit={start}>
                                <label className="donateStripeLabel" htmlFor="donationAmount">
                                    Custom amount (CAD)
                                </label>

                                <div className="donateStripeInputRow">
                                    <span className="donateStripeCurrency" aria-hidden="true">
                                    $
                                    </span>
                                    <input
                                    id="donationAmount"
                                    className="donateStripeInput"
                                    type="number"
                                    min="1"
                                    step="0.01"
                                    inputMode="decimal"
                                    placeholder="25.00"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    required
                                    />
                                    <span className="donateStripeCode" aria-hidden="true">
                                    CAD
                                    </span>
                                </div>

                                {/* Choose a Specific project*/}
                                <label className="donateStripeLabel" htmlFor="donateProject">
                                    Choose a project (optional)
                                </label>

                                <select
                                    id="donateProject"
                                    className="donateStripeSelect"
                                    value={selectedProjectId ?? ""}
                                    onChange={(e) => {
                                    const v = e.target.value;
                                    if (!v) {
                                        setSelectedProjectId(null);
                                        setSelectedProjectTitle(null);
                                        return;
                                    }
                                    const id = Number(v);
                                    setSelectedProjectId(id);
                                    const found = projects.find((p) => Number(p.id) === id);
                                    setSelectedProjectTitle(found?.title || "Selected project");
                                    }}
                                    disabled={projectsLoading}
                                >
                                    <option value="">General donation (where needed most)</option>
                                    {projects.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.title}
                                    </option>
                                    ))}
                                </select>



                                <div className="donateStripeHint">
                                    {pretty && selectedProjectTitle ? (
                                    <>
                                        You’re about to donate <strong>{pretty}</strong> to <strong>{selectedProjectTitle}</strong>.
                                    </>
                                    ) : pretty ? (
                                    <>
                                        You’re about to donate <strong>{pretty}</strong>.
                                    </>
                                    ) : (
                                    <>
                                        Enter an amount to see the estimated processing fee.
                                    </>
                                    )}
                                </div>

                                <div className="donateStripeDisclaimer" role="note" aria-label="Stripe processing fee notice">
                                    <div className="donateStripeDisclaimerTitle">Processing fee notice</div>
                                    <p className="donateStripeDisclaimerText">
                                        Stripe charges <strong>2.9%</strong> + <strong>$0.30 CAD</strong> per transaction.
                                        The estimate below shows the fee and the amount we receive.
                                    </p>

                                    <div className="donateStripeCalc">
                                        <div className="donateStripeCalcRow">
                                        <span className="donateStripeCalcLabel">Donation </span>
                                        <span className="donateStripeCalcValue">{pretty || "—"}</span>
                                        </div>

                                        <div className="donateStripeCalcRow">
                                        <span className="donateStripeCalcLabel">Stripe fee (est.)</span>
                                        <span className="donateStripeCalcValue isFee">{pretty ? feePretty : "—"}</span>
                                        </div>

                                        <div className="donateStripeCalcDivider" />

                                        <div className="donateStripeCalcRow isNet">
                                        <span className="donateStripeCalcLabel">We receive (est.)</span>
                                        <span className="donateStripeCalcValue">{pretty ? netPretty : "—"}</span>
                                        </div>

                                        <div className="donateStripeCalcFinePrint">
                                        Estimates only. If you're not comfortable with the amount taken, please consider E-Transfer instead.
                                        </div>
                                    </div>
                                    </div>

                                <button className="donateStripeBtn" type="submit">
                                    Continue to secure checkout
                                </button>

                                {error && (
                                    <div className="donateStripeMsg" role="alert">
                                    {error}
                                    </div>
                                )}
                            </form>
                        </>
                        )}

                        {donationReq && !complete && (
                            <div className="donateStripeMeta">
                                <div className="donateStripeMetaRow">
                                <span className="donateStripeMetaLabel">Amount</span>
                                <span className="donateStripeMetaValue">
                                    {formatCad((donationReq.amountCents / 100).toFixed(2))}
                                </span>
                                </div>

                                <button className="donateStripeLinkBtn" type="button" onClick={reset}>
                                Change amount
                                </button>

                                <div className="donateStripeFinePrint">
                                Having trouble? Try switching browsers or disabling ad/script blockers for checkout.
                                </div>
                            </div>
                            )}

                            {complete && (
                            <div className="donateStripeComplete" role="status">
                                <h3 className="donateStripeCompleteTitle">Thank you for your generosity!</h3>
                                <p className="donateStripeCompleteTitle">Your donation is being processed.</p>
                                <p className="donateStripeCompleteTitle">You'll receive a confirmation email when it is paid.</p>
                                <button className="donateStripeBtn" type="button" onClick={reset}>
                                Make another donation
                                </button>
                            </div>
                        )}

                </div>

                {/* RIGHT: embedded checkout */}
            
                {showCheckout && (
                    <div className="donateStripeRight" aria-label="Secure payment">
                        <div className="donateStripeFrame">
                            {loading && <div className="donateStripeLoading">Loading secure checkout…</div>}

                            <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
                                <EmbeddedCheckout />
                            </EmbeddedCheckoutProvider>
                        </div>
                    </div>
                )}
            
            </article>
        </div>
    </section>
  );
}
