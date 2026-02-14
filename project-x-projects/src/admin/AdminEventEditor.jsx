import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "../styles/admin.css";

import { AdminEventsApi, presignUpload } from "./adminApi";
import { clearAdminToken } from "./adminAuth";

import LocationAutocomplete from "./LocationAutocomplete";

function slugify(input) {
  const s = (input || "").trim().toLowerCase();
  const dashed = s.replace(/\s+/g, "-");
  const cleaned = dashed.replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  return cleaned || "event";
}

async function putToPresignedUrl(uploadUrl, file) {
  const res = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });
  if (!res.ok) throw new Error(`Upload failed (${res.status})`);
}

export default function AdminEventEditor({ mode }) {
  const nav = useNavigate();
  const { id } = useParams();
  const editing = mode === "edit";

  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  const [form, setForm] = useState({
    title: "",
    shortDesc: "",
    location: "",
    eventDate: "", // yyyy-mm-dd
    imageUrl: "",
    tags: "", // comma-separated
    status: "DRAFT",
  });

  const eventSlug = useMemo(() => slugify(form.title), [form.title]);

  function logout() {
    clearAdminToken();
    nav("/admin/login", { replace: true });
  }

  function updateField(key, val) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  async function loadEvent() {
    setErr("");
    setOk("");
    try {
      const all = await AdminEventsApi.list();
      const ev = (all || []).find((x) => String(x.id) === String(id));
      if (!ev) throw new Error("Event not found");

      setForm({
        title: ev.title || "",
        shortDesc: ev.shortDesc || "",
        location: ev.location || "",
        eventDate: ev.eventDate || "",
        imageUrl: ev.imageUrl || "",
        tags: ev.tags || "",
        status: ev.status || "DRAFT",
      });
    } catch (e) {
      if (e?.message === "UNAUTHORIZED") nav("/admin/login", { replace: true });
      else setErr(e?.message || "Failed to load event");
    }
  }

  useEffect(() => {
    if (editing) loadEvent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editing, id]);

  async function uploadEventImage(file) {
    setErr("");
    setOk("");
    setBusy(true);

    try {
      // IMPORTANT:
      // Your backend presign request currently expects "projectSlug" and "purpose".
      // For events we reuse projectSlug as a folder-safe slug like "event-<slug>".
      const presign = await presignUpload({
        projectSlug: `event-${eventSlug}`,
        purpose: "EVENT", 
        originalFileName: file.name,
        contentType: file.type,
      });

      await putToPresignedUrl(presign.uploadUrl, file);
      updateField("imageUrl", presign.publicUrl);
      setOk("Event image uploaded.");
    } catch (e) {
      if (e?.message === "UNAUTHORIZED") nav("/admin/login", { replace: true });
      else setErr(e?.message || "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  async function saveEvent(e) {
    e.preventDefault();
    setErr("");
    setOk("");
    setBusy(true);

    try {
      const payload = {
        title: form.title,
        shortDesc: form.shortDesc || "",
        location: form.location || "",
        eventDate: form.eventDate, // "YYYY-MM-DD"
        imageUrl: form.imageUrl || "",
        tags: form.tags || "", // comma-separated
        status: form.status,
      };

      if (editing) {
        await AdminEventsApi.update(id, payload);
        setOk("Saved.");
        await loadEvent();
      } else {
        const created = await AdminEventsApi.create(payload);
        setOk("Created.");
        nav(`/admin/events/${created.id}/edit`, { replace: true });
      }
    } catch (e2) {
      if (e2?.message === "UNAUTHORIZED") nav("/admin/login", { replace: true });
      else setErr(e2?.message || "Save failed");
    } finally {
      setBusy(false);
    }
  }

  async function deleteEvent() {
    if (!editing) return;
    const yes = window.confirm("Delete this event? This cannot be undone.");
    if (!yes) return;

    setErr("");
    setOk("");
    setBusy(true);

    try {
      await AdminEventsApi.remove(id);
      nav("/admin/events", { replace: true });
    } catch (e) {
      if (e?.message === "UNAUTHORIZED") nav("/admin/login", { replace: true });
      else setErr(e?.message || "Delete failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="adminPage">
      <div className="container">
        <div className="adminShell">
          <div className="adminTop">
            <div>
              <div className="adminKicker">Admin</div>
              <h1 className="adminTitle">{editing ? "Edit Event" : "Create Event"}</h1>
            </div>

            <div className="adminRow">
              <Link className="btn" to="/admin/events">
                ← Events
              </Link>
              <Link className="btn" to="/admin">
                Projects
              </Link>
              <button className="btn" type="button" onClick={logout}>
                Logout
              </button>
            </div>
          </div>

          <div className="adminBody">
            <form onSubmit={saveEvent}>
              <div className="adminGrid">
                <div className="adminField">
                  <div className="adminLabel">Title</div>
                  <input
                    className="adminInput"
                    value={form.title}
                    onChange={(e) => updateField("title", e.target.value)}
                    required
                  />
                </div>

                <div className="adminField">
                  <div className="adminLabel">Status</div>
                  <select
                    className="adminSelect"
                    value={form.status}
                    onChange={(e) => updateField("status", e.target.value)}
                  >
                    <option value="DRAFT">DRAFT</option>
                    <option value="UPCOMING">UPCOMING</option>
                    <option value="PASSED">PASSED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                  <div className="adminHint">
                    Setting to <b>UPCOMING</b> triggers email notifications.
                  </div>
                </div>

                <div className="adminField">
                  <div className="adminLabel">Event Date</div>
                  <input
                    className="adminInput"
                    type="date"
                    value={form.eventDate}
                    onChange={(e) => updateField("eventDate", e.target.value)}
                    required
                  />
                </div>

                {/*
                <div className="adminField">
                  <div className="adminLabel">Location</div>
                  <input
                    className="adminInput"
                    value={form.location}
                    onChange={(e) => updateField("location", e.target.value)}
                    placeholder="Scarborough, ON"
                  />
                </div>
                */}

                <div className="adminField">
                  <div className="adminLabel">Location</div>
                  <LocationAutocomplete
                    value={form.location}
                    onChange={(val) => updateField("location", val)}
                    placeholder="Scarborough, ON"
                  />
                </div>



                <div className="adminField" style={{ gridColumn: "1 / -1" }}>
                  <div className="adminLabel">Short Description</div>
                  <textarea
                    className="adminInput"
                    value={form.shortDesc}
                    onChange={(e) => updateField("shortDesc", e.target.value)}
                    placeholder="A quick blurb for the event card…"
                  />
                  <div className="adminHint">
                    This short description appears on the event card on the public events page. Keep it brief and engaging. (1-2 sentences max is ideal.)
                  </div>
                </div>

                <div className="adminField" style={{ gridColumn: "1 / -1" }}>
                  <div className="adminLabel">Tags (comma-separated)</div>
                  <input
                    className="adminInput"
                    value={form.tags}
                    onChange={(e) => updateField("tags", e.target.value)}
                    placeholder="Community, Food, Scarborough"
                  />
                  <div className="adminHint">
                    Keep tags comma-separated, the projects page will seperate them into tags.
                  </div>
                </div>

                <div className="adminField" style={{ gridColumn: "1 / -1" }}>
                  <div className="adminLabel">Event Flyer Image (card)</div>

                  {form.imageUrl ? (
                    <img className="adminThumb" src={form.imageUrl} alt="" />
                  ) : (
                    <div className="adminThumb" aria-hidden="true" />
                  )}

                  <input
                    className="adminInput"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) uploadEventImage(f);
                      e.target.value = "";
                    }}
                  />

                  <div className="adminHint">
                    This image will be the thumbnail for the event card on the public events page. Best to use a Flyer of the event. Recommended size: 600x400px
                  </div>
                </div>
              </div>

              <div className="adminRow" style={{ marginTop: 14 }}>
                <button className="btn btnPrimary" type="submit" disabled={busy}>
                  {busy ? "Saving…" : editing ? "Save changes" : "Create event"}
                </button>

                {editing && (
                  <button className="btn" type="button" onClick={deleteEvent} disabled={busy}>
                    Delete
                  </button>
                )}
              </div>

              {err && <div className="adminError">{err}</div>}
              {ok && <div className="adminOk">{ok}</div>}
            </form>

          </div>
        </div>
      </div>
    </main>
  );
}
