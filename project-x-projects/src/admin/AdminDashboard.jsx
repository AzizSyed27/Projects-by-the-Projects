import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/admin.css";

import { AdminProjectsApi } from "../admin/adminApi";
import { clearAdminToken } from "../admin/adminAuth";

export default function AdminDashboard() {
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
      const data = await AdminProjectsApi.list();
      setRows(data || []);
    } catch (e) {
      if (e?.message === "UNAUTHORIZED") nav("/admin/login", { replace: true });
      else setErr(e?.message || "Failed to load projects");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();

    return rows.filter((p) => {
      const okStatus = status === "ALL" ? true : p.status === status;
      if (!okStatus) return false;
      if (!needle) return true;

      const hay =
        `${p.projectTitle || ""} ${p.slug || ""} ${p.projectTags || ""} ${p.projectShortDesc || ""}`.toLowerCase();
      return hay.includes(needle);
    });
  }, [rows, q, status]);

  function logout() {
    clearAdminToken();
    nav("/admin/login", { replace: true });
  }

  return (
    <main className="adminPage">
      <div className="container">
        <div className="adminShell">
          <div className="adminTop">
            <div>
              <div className="adminKicker">Admin Dashboard</div>
              <h1 className="adminTitle">Projects</h1>
            </div>

            <div className="adminRow">
              <Link className="btn btnPrimary" to="/admin/projects/new">
                + New project
              </Link>
              <Link className="btn" to="/admin/events">
                Events
              </Link>
              <Link className="btn" to="/admin/donations">
                Donations
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
                placeholder="Search by title, slug, tags…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                style={{ maxWidth: 420 }}
              />

              <select className="adminSelect" value={status} onChange={(e) => setStatus(e.target.value)} style={{ maxWidth: 220 }}>
                <option value="ALL">All</option>
                <option value="DRAFT">Draft</option>
                <option value="ACTIVE">Active</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>

            {loading && <div className="adminHint">Loading…</div>}
            {err && <div className="adminError">{err}</div>}

            {!loading && (
              <table className="adminTable" aria-label="Projects table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Title</th>
                    <th>Slug</th>
                    <th>Status</th>
                    <th>Tags (CSV)</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => (
                    <tr key={p.projectId}>
                      <td>
                        {p.cardImageUrl ? (
                          <img className="adminThumb" src={p.cardImageUrl} alt="" />
                        ) : (
                          <div className="adminThumb" aria-hidden="true" />
                        )}
                      </td>
                      <td>{p.projectTitle}</td>
                      <td>{p.slug}</td>
                      <td>
                        <span className={`adminBadge ${p.status}`}>{p.status}</span>
                      </td>
                      <td style={{ maxWidth: 320 }}>{p.projectTags || ""}</td>
                      <td>
                        <div className="adminRow">
                          <Link className="btn" to={`/admin/projects/${p.projectId}/edit`}>
                            Edit
                          </Link>
                          <Link className="btn" to={`/projects/${p.slug}`} target="_blank" rel="noreferrer">
                            View
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {!filtered.length && (
                    <tr>
                      <td colSpan={6}>
                        <div className="adminHint" style={{ padding: 12 }}>
                          No projects match your search/filter.
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}

            <p className="adminHint" style={{ marginTop: 12 }}>
              <b>"Drafts"</b> do not appear in the public project list, either change their status to <b>"Active"</b> or <b>"Completed"</b> for them to appear.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
