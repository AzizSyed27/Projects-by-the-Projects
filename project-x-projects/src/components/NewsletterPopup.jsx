import { useEffect, useRef, useState } from "react";
import { subscribeEmail } from "../api/subscribers";

const STORAGE_KEY = "pxp_newsletter_popup_daily_v1";

function todayKey() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`; // local time
}

function getDailyState() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
  } catch {
    return null;
  }
}

function setDailyState(state) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ day: todayKey(), state, at: Date.now() })
  );
}

export default function NewsletterPopup() {
    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState("idle"); // idle | loading | success | error
    const [msg, setMsg] = useState("");

    const inputRef = useRef(null);

  // Show only first time (or until dismissed/subscribed)
    useEffect(() => {
    const stored = getDailyState();

    // If we already dismissed/subscribed today, don't show again today
    if (stored?.day === todayKey() && (stored?.state === "dismissed" || stored?.state === "subscribed")) {
        return;
    }

    const t = setTimeout(() => setOpen(true), 1200);
    return () => clearTimeout(t);
    }, []);

    // Focus + scroll lock + ESC close
    useEffect(() => {
        if (!open) return;

        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const onKeyDown = (e) => {
        if (e.key === "Escape") {
            e.preventDefault();
            handleClose();
        }
        };

        window.addEventListener("keydown", onKeyDown);
        setTimeout(() => inputRef.current?.focus(), 0);

        return () => {
        document.body.style.overflow = prevOverflow;
        window.removeEventListener("keydown", onKeyDown);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    function handleClose() {
        setOpen(false);
        setDailyState("dismissed");
    }

    async function onSubmit(e) {
        e.preventDefault();
        setMsg("");

        const trimmed = email.trim();
        if (!trimmed) {
        setStatus("error");
        setMsg("Please enter your email.");
        return;
        }

        setStatus("loading");
        try {
        const res = await subscribeEmail(trimmed);
        setStatus("success");
        setMsg(res?.message || "Check your email to confirm your subscription!");
        setEmail("");
        setDailyState("subscribed");

        // auto-close after a moment
        setTimeout(() => setOpen(false), 1800);
        } catch (err) {
        setStatus("error");
        setMsg(err?.message || "Something went wrong — please try again later.");
        }
    }

    if (!open) return null;

    return (
        <div
        className="nlOverlay"
        role="dialog"
        aria-modal="true"
        aria-label="Newsletter signup"
        onMouseDown={(e) => {
            // click outside closes
            if (e.target === e.currentTarget) handleClose();
        }}
        >
        <div className="nlModal">
            <button className="nlClose" type="button" onClick={handleClose} aria-label="Close">
            ✕
            </button>

            <div className="nlKicker">Stay in the loop</div>
            <h2 className="nlTitle">Get updates on new projects and events</h2>
            <p className="nlSub">
            We’ll only email when there’s something worth sharing. You can unsubscribe anytime.
            </p>

            <form className="nlForm" onSubmit={onSubmit}>
            <label className="srOnly" htmlFor="nlEmail">
                Email address
            </label>
            <input
                ref={inputRef}
                id="nlEmail"
                className="nlInput"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                setEmail(e.target.value);
                if (status !== "idle") {
                    setStatus("idle");
                    setMsg("");
                }
                }}
                aria-invalid={status === "error"}
                required
            />

            <button className="btn btnPrimary nlBtn" type="submit" disabled={status === "loading"}>
                {status === "loading" ? "Subscribing…" : "Subscribe"}
            </button>
            </form>

            {msg && (
            <div className={`nlMsg ${status}`} role={status === "error" ? "alert" : "status"}>
                {msg}
            </div>
            )}

            <button className="nlNoThanks" type="button" onClick={handleClose}>
            No thanks
            </button>
        </div>
        </div>
    );
}
