import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/admin.css";

import { AdminDonationsApi } from "../admin/adminApi";
import { clearAdminToken } from "../admin/adminAuth";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";

// pseudo-projectId for filtering general donations only
const GENERAL_ONLY = "GENERAL_ONLY"; 

function centsToCAD(c) {
  const n = Number(c || 0);
  return `$${(n / 100).toFixed(2)} CAD`;
}

function startOfDayLocal(yyyyMmDd) {
  if (!yyyyMmDd) return null;
  return new Date(`${yyyyMmDd}T00:00:00`);
}

function endOfDayLocal(yyyyMmDd) {
  if (!yyyyMmDd) return null;
  return new Date(`${yyyyMmDd}T23:59:59.999`);
}

export default function AdminDonations() {
  const nav = useNavigate();

  const [rows, setRows] = useState([]);

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // "Draft" filters = what user is editing in the UI right now
  const [draft, setDraft] = useState({
    status: "ALL",
    projectId: "",
    fromDate: "",
    toDate: "",
  });

  // "Applied" filters = what actually affects table + stats
  const [applied, setApplied] = useState({
    status: "ALL",
    projectId: "",
    fromDate: "",
    toDate: "",
  });

  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/api/projects/active-options`)
      .then((r) => r.json())
      .then((d) => setProjects(Array.isArray(d) ? d : []))
      .catch(() => setProjects([]));
  }, []);

  function logout() {
    clearAdminToken();
    nav("/admin/login", { replace: true });
  }

  async function load(current = applied) {
    setErr("");
    setLoading(true);

    try {
      const params = {
        status: current.status === "ALL" ? "" : current.status,
        projectId:
          current.projectId && current.projectId !== GENERAL_ONLY
            ? current.projectId
            : "",
      };

      const list = await AdminDonationsApi.list(params);
      setRows(Array.isArray(list) ? list : []);
    } catch (e) {
      if (e?.message === "UNAUTHORIZED") nav("/admin/login", { replace: true });
      else setErr(e?.message || "Failed to load donations");
    } finally {
      setLoading(false);
    }
  }

  // initial load + whenever applied filters change
  useEffect(() => {
    load(applied);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applied.status, applied.projectId, applied.fromDate, applied.toDate]);

  function applyFilters() {
    setApplied({ ...draft });
  }

  function clearFilters() {
    const reset = { status: "ALL", projectId: "", fromDate: "", toDate: "" };
    setDraft(reset);
    setApplied(reset);
  }

  const activeProjectTitle = useMemo(() => {
    if (!applied.projectId) return "All (includes General)";
    if (applied.projectId === GENERAL_ONLY) return "General only";

    const found = projects.find((p) => String(p.id) === String(applied.projectId));
    return found?.title || `Project #${applied.projectId}`;
  }, [applied.projectId, projects]);

  const filterSummary = useMemo(() => {
    const bits = [];
    bits.push(`Status: ${applied.status === "ALL" ? "All" : applied.status}`);
    bits.push(`Project: ${activeProjectTitle}`);
    if (applied.fromDate || applied.toDate) {
      bits.push(`Date: ${applied.fromDate || "…"} → ${applied.toDate || "…"}`);
    } else {
      bits.push("Date: All time");
    }
    return bits.join(" • ");
  }, [applied.status, activeProjectTitle, applied.fromDate, applied.toDate]);

  // Make date range affect the TABLE too (even if backend list doesn’t filter by date yet)
  const displayRows = useMemo(() => {
    const from = startOfDayLocal(applied.fromDate);
    const to = endOfDayLocal(applied.toDate);

    return (rows || []).filter((d) => {
      // General-only filter
      if (applied.projectId === GENERAL_ONLY && d.projectId != null) {
        return false;
      }

      const t = Date.parse(d.createdAt || "");
      if (!from && !to) return true;
      if (!Number.isFinite(t)) return true;

      if (from && t < from.getTime()) return false;
      if (to && t > to.getTime()) return false;

      return true;
    });
  }, [rows, applied.projectId, applied.fromDate, applied.toDate]);

  const stats = useMemo(() => {
    return displayRows.reduce(
      (acc, d) => {
        if (d.status === "PAID") {
          acc.totalPaidCents += Number(d.amountCents || 0);
          acc.countPaid += 1;
        }
        return acc;
      },
      { totalPaidCents: 0, countPaid: 0 }
    );
  }, [displayRows]);

  return (
    <main className="adminPage">
      <div className="container">
        <div className="adminShell">
          <div className="adminTop">
            <div>
              <div className="adminKicker">Admin Dashboard</div>
              <h1 className="adminTitle">Donations</h1>
              <div className="adminHint" style={{ marginTop: 6 }}>
                {filterSummary}
              </div>
            </div>

            <div className="adminRow">
              <Link className="btn" to="/admin">Projects</Link>
              <Link className="btn" to="/admin/events">Events</Link>
              <button className="btn" type="button" onClick={() => load(applied)}>Refresh</button>
              <button className="btn" type="button" onClick={logout}>Logout</button>
            </div>
          </div>

          <div className="adminBody">
            {/* Stats */}
            <div className="adminRow" style={{ marginBottom: 14, flexWrap: "wrap" }}>
              <div className="adminCardMini">
                <div className="adminMiniLabel">Total Paid</div>
                <div className="adminMiniValue">{centsToCAD(stats.totalPaidCents)}</div>
              </div>
              <div className="adminCardMini">
                <div className="adminMiniLabel">Paid Donations</div>
                <div className="adminMiniValue">{stats.countPaid || 0}</div>
              </div>
            </div>

            {/* Filters (clear + labeled + apply) */}
            <div className="adminCard" style={{ marginBottom: 14 }}>
              <div className="adminCardHead">
                <div>
                  <div className="adminMiniLabel">Filters</div>
                  <div className="adminHint" style={{ marginTop: 4 }}>
                    These filters apply to the table and the totals.
                  </div>
                </div>

                <div className="adminRow" style={{ gap: 8, flexWrap: "wrap" }}>
                  <button className="btn" type="button" onClick={applyFilters}>Apply</button>
                  <button className="btn" type="button" onClick={clearFilters}>Clear</button>
                </div>
              </div>

              <div className="adminFiltersGrid">
                <div className="adminField">
                  <label className="adminFieldLabel" htmlFor="donStatus">Status</label>
                  <select
                    id="donStatus"
                    className="adminSelect"
                    value={draft.status}
                    onChange={(e) => setDraft((p) => ({ ...p, status: e.target.value }))}
                  >
                    <option value="ALL">All</option>
                    <option value="PAID">PAID</option>
                    <option value="PENDING">PENDING</option>
                    <option value="FAILED">FAILED</option>
                    <option value="EXPIRED">EXPIRED</option>
                    <option value="CANCELED">CANCELED</option>
                    <option value="CREATED">CREATED</option>
                  </select>
                  <div className="adminFieldHint">Filter donations by payment outcome.</div>
                </div>

                <div className="adminField">
                  <label className="adminFieldLabel" htmlFor="donProject">Project</label>
                  <select
                    id="donProject"
                    className="adminSelect"
                    value={draft.projectId}
                    onChange={(e) => setDraft((p) => ({ ...p, projectId: e.target.value }))}
                  >
                    <option value="">All (includes General)</option>
                    <option value={GENERAL_ONLY}>General only</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                  <div className="adminFieldHint">
                    “All” includes general donations + project donations.
                  </div>
                </div>

                <div className="adminField">
                  <label className="adminFieldLabel" htmlFor="donFrom">From date</label>
                  <input
                    id="donFrom"
                    className="adminInput"
                    type="date"
                    value={draft.fromDate}
                    onChange={(e) => setDraft((p) => ({ ...p, fromDate: e.target.value }))}
                  />
                  <div className="adminFieldHint">Leave blank to include earlier donations.</div>
                </div>

                <div className="adminField">
                  <label className="adminFieldLabel" htmlFor="donTo">To date</label>
                  <input
                    id="donTo"
                    className="adminInput"
                    type="date"
                    value={draft.toDate}
                    onChange={(e) => setDraft((p) => ({ ...p, toDate: e.target.value }))}
                  />
                  <div className="adminFieldHint">Leave blank to include future donations.</div>
                </div>
              </div>
            </div>

            {loading && <div className="adminHint">Loading…</div>}
            {err && <div className="adminError">{err}</div>}

            {!loading && (
              <table className="adminTable" aria-label="Donations table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Project</th>
                    <th>Status</th>
                    <th>Donor Email</th>
                    <th>Stripe Session</th>
                  </tr>
                </thead>
                <tbody>
                  {displayRows.map((d) => (
                    <tr key={d.id}>
                      <td>{(d.createdAt || "").replace("T", " ").slice(0, 16)}</td>
                      <td>{centsToCAD(d.amountCents)}</td>
                      <td>{d.projectTitle || "General"}</td>
                      <td><span className={`adminBadge ${d.status}`}>{d.status}</span></td>
                      <td style={{ maxWidth: 260, wordBreak: "break-word" }}>{d.customerEmail || ""}</td>
                      <td style={{ maxWidth: 260, wordBreak: "break-word" }}>{d.stripeSessionId || ""}</td>
                    </tr>
                  ))}

                  {!displayRows.length && (
                    <tr>
                      <td colSpan={6}>
                        <div className="adminHint" style={{ padding: 12 }}>
                          No donations found for these filters.
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
