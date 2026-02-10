import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/admin.css";

import { AdminEventsApi } from "./adminApi";
import { clearAdminToken } from "./adminAuth";

export default function AdminEvents() {
  const nav = useNavigate();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [q, setQ] = useState("");
  const [status, setStatus] = useState("ALL");

  async function load() {
    setErr("");
    setLoading(true);
    try {
      const data = await AdminEventsApi.list();
      // Sort by eventDate ascending by default
      const sorted = [...(data || [])].sort((a, b) => String(a.eventDate).localeCompare(String(b.eventDate)));
      setRows(sorted);
    } catch (e) {
      if (e?.message === "UNAUTHORIZED") nav("/admin/login", { replace: true });
      else setErr(e?.message || "Failed to load events");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function logout() {
    clearAdminToken();
    nav("/admin/login", { replace: true });
  }

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return rows.filter((ev) => {
      const okStatus = status === "ALL" ? true : ev.status === status;
      if (!okStatus) return false;
      if (!needle) return true;

      const hay = `${ev.title || ""} ${ev.location || ""} ${ev.tags || ""} ${ev.shortDesc || ""}`.toLowerCase();
      return hay.includes(needle);
    });
  }, [rows, q, status]);

  async function quickStatus(id, nextStatus) {
    setErr("");
    try {
      const updated = await AdminEventsApi.setStatus(id, nextStatus);
      setRows((arr) => arr.map((x) => (x.id === id ? updated : x)));
    } catch (e) {
      if (e?.message === "UNAUTHORIZED") nav("/admin/login", { replace: true });
      else setErr(e?.message || "Failed to update status");
    }
  }

  return (
    <main className="adminPage">
      <div className="container">
        <div className="adminShell">
          <div className="adminTop">
            <div>
              <div className="adminKicker">Admin Dashboard</div>
              <h1 className="adminTitle">Events</h1>
            </div>

            <div className="adminRow">
              <Link className="btn btnPrimary" to="/admin/events/new">
                + New event
              </Link>
              <Link className="btn" to="/admin">
                Projects
              </Link>
              <button className="btn" type="button" onClick={load}>
                Refresh
              </button>
              <button className="btn" type="button" onClick={logout}>
                Logout
              </button>
            </div>
          </div>

          <div className="adminBody">
            <div className="adminRow" style={{ marginBottom: 14 }}>
              <input
                className="adminInput"
                placeholder="Search title, location, tags…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                style={{ maxWidth: 420 }}
              />

              <select
                className="adminSelect"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                style={{ maxWidth: 260 }}
              >
                <option value="ALL">All</option>
                <option value="DRAFT">Draft</option>
                <option value="UPCOMING">Upcoming</option>
                <option value="PASSED">Passed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            {loading && <div className="adminHint">Loading…</div>}
            {err && <div className="adminError">{err}</div>}

            {!loading && (
              <table className="adminTable" aria-label="Events table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Title</th>
                    <th>Date</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Tags (CSV)</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((ev) => (
                    <tr key={ev.id}>
                      <td>
                        {ev.imageUrl ? (
                          <img className="adminThumb" src={ev.imageUrl} alt="" />
                        ) : (
                          <div className="adminThumb" aria-hidden="true" />
                        )}
                      </td>
                      <td style={{ maxWidth: 320 }}>{ev.title}</td>
                      <td>{ev.eventDate}</td>
                      <td style={{ maxWidth: 220 }}>{ev.location || ""}</td>
                      <td>
                        <span className={`adminBadge ${ev.status}`}>{ev.status}</span>
                      </td>
                      <td style={{ maxWidth: 260 }}>{ev.tags || ""}</td>
                      <td>
                        <div className="adminRow">
                          <Link className="btn" to={`/admin/events/${ev.id}/edit`}>
                            Edit
                          </Link>

                          {/* Quick status */}
                          {ev.status !== "UPCOMING" && (
                            <button className="btn" type="button" onClick={() => quickStatus(ev.id, "UPCOMING")}>
                              Set UPCOMING
                            </button>
                          )}
                          {ev.status !== "CANCELLED" && (
                            <button className="btn" type="button" onClick={() => quickStatus(ev.id, "CANCELLED")}>
                              Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}

                  {!filtered.length && (
                    <tr>
                      <td colSpan={7}>
                        <div className="adminHint" style={{ padding: 12 }}>
                          No events match your search/filter.
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}

            <p className="adminHint" style={{ marginTop: 12 }}>
              Tags must stay <b>comma-separated</b> (example: <b>Community, Scarborough, Food</b>).
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
