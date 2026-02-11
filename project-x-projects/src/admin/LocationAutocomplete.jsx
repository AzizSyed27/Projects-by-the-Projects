import { useEffect, useRef, useState } from "react";

export default function LocationAutocomplete({ value, onChange, placeholder }) {
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [active, setActive] = useState(-1);

  const serviceRef = useRef(null);
  const blurTimerRef = useRef(null);

  // Wait until the Google Places library is available
  useEffect(() => {
    const t = setInterval(() => {
      const ok = !!window.google?.maps?.places?.AutocompleteService;
      if (ok) {
        clearInterval(t);
        serviceRef.current = new window.google.maps.places.AutocompleteService();
        setReady(true);
      }
    }, 150);

    return () => clearInterval(t);
  }, []);

  // Fetch predictions (addresses + regions), then merge
  useEffect(() => {
    if (!ready) return;

    const q = (value || "").trim();
    if (q.length < 2) {
      setItems([]);
      setOpen(false);
      setActive(-1);
      return;
    }

    let cancelled = false;
    const svc = serviceRef.current;

    const run = (req) =>
      new Promise((resolve) => {
        svc.getPlacePredictions(req, (preds, status) => {
          if (status !== window.google.maps.places.PlacesServiceStatus.OK || !preds) {
            resolve([]);
            return;
          }
          resolve(preds);
        });
      });

    const reqBase = {
      input: q,
      componentRestrictions: { country: "ca" }, // Canada only
    };

    const doSearch = async () => {
      // 1) geocode = street addresses
      // 2) (regions) = cities/areas like "Scarborough"
      const [addr, regions] = await Promise.all([
        run({ ...reqBase, types: ["geocode"] }),
        run({ ...reqBase, types: ["(regions)"] }),
      ]);

      const merged = [];
      const seen = new Set();

      for (const p of [...addr, ...regions]) {
        if (seen.has(p.place_id)) continue;
        seen.add(p.place_id);
        merged.push(p);
        if (merged.length >= 7) break;
      }

      if (!cancelled) {
        setItems(merged);
        setOpen(merged.length > 0);
        setActive(-1);
      }
    };

    const id = setTimeout(doSearch, 200); // debounce
    return () => {
      cancelled = true;
      clearTimeout(id);
    };
  }, [value, ready]);

  function clearBlurTimer() {
    if (blurTimerRef.current) clearTimeout(blurTimerRef.current);
    blurTimerRef.current = null;
  }

  function stripCountry(s) {
        return (s || "").replace(/,\s*Canada\s*$/i, "");
        }

  function select(pred) {
    const cleaned = stripCountry(pred.description);
    onChange?.(cleaned);
    setOpen(false);
    setItems([]);
    setActive(-1);
  }

  function onKeyDown(e) {
    if (!open && e.key === "ArrowDown" && items.length) {
      setOpen(true);
      return;
    }
    if (!open) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, items.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      if (active >= 0 && items[active]) {
        e.preventDefault();
        select(items[active]);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div
      className="autoWrap"
      onFocus={clearBlurTimer}
      onBlur={() => {
        // delay so clicks on items still work
        blurTimerRef.current = setTimeout(() => setOpen(false), 120);
      }}
    >
      <input
        className="adminInput"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        onFocus={() => items.length && setOpen(true)}
        onKeyDown={onKeyDown}
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={open}
        aria-controls="location-suggest"
      />

      {open && items.length > 0 && (
        <ul className="autoList" id="location-suggest" role="listbox">
          {items.map((p, idx) => (
            <li
              key={p.place_id}
              role="option"
              aria-selected={idx === active}
              className={`autoItem ${idx === active ? "isActive" : ""}`}
              onMouseDown={(e) => e.preventDefault()} // keep input focused
              onMouseEnter={() => setActive(idx)}
              onClick={() => select(p)}
            >
              {p.description}
            </li>
          ))}
        </ul>
      )}

      {!ready && (
        <div className="adminHint" style={{ marginTop: 6 }}>
          Loading address suggestions…
        </div>
      )}
    </div>
  );
}
