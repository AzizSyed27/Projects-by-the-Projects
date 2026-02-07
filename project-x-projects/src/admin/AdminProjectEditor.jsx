import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "../styles/admin.css";

import { AdminImagesApi, AdminProjectsApi, presignUpload } from "../admin/adminApi";
import { clearAdminToken } from "../admin/adminAuth";

function slugify(input) {
  const s = (input || "").trim().toLowerCase();
  const dashed = s.replace(/\s+/g, "-");
  const cleaned = dashed.replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  return cleaned || "project";
}

async function putToPresignedUrl(uploadUrl, file) {
  const res = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });
  if (!res.ok) throw new Error(`Upload failed (${res.status})`);
}

export default function AdminProjectEditor({ mode }) {
  const nav = useNavigate();
  const { id } = useParams();
  const editing = mode === "edit";

  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  const [form, setForm] = useState({
    slug: "",
    projectTitle: "",
    heroBlurb: "",
    projectShortDesc: "",
    projectLongDesc: "",
    projectTags: "", // comma-separated
    cardImageUrl: "",
    mainImageUrl: "",
    displayOrder: 0,
    status: "DRAFT",
  });

  // Gallery
  const [images, setImages] = useState([]);
  const [imagesDirty, setImagesDirty] = useState(false);
  const [imgErr, setImgErr] = useState("");

  const effectiveSlug = useMemo(() => {
    return slugify(form.slug || form.projectTitle);
  }, [form.slug, form.projectTitle]);

  function logout() {
    clearAdminToken();
    nav("/admin/login", { replace: true });
  }

  async function loadProject() {
    setErr("");
    setOk("");
    try {
      const all = await AdminProjectsApi.list();
      const p = (all || []).find((x) => String(x.projectId) === String(id));
      if (!p) throw new Error("Project not found");

      setForm({
        slug: p.slug || "",
        projectTitle: p.projectTitle || "",
        heroBlurb: p.heroBlurb || "",
        projectShortDesc: p.projectShortDesc || "",
        projectLongDesc: p.projectLongDesc || "",
        projectTags: p.projectTags || "",
        cardImageUrl: p.cardImageUrl || "",
        mainImageUrl: p.mainImageUrl || "",
        displayOrder: p.displayOrder ?? 0,
        status: p.status || "DRAFT",
      });
    } catch (e) {
      if (e?.message === "UNAUTHORIZED") nav("/admin/login", { replace: true });
      else setErr(e?.message || "Failed to load project");
    }
  }

  async function loadImages() {
    if (!editing) return;
    setImgErr("");
    try {
      const list = await AdminImagesApi.list(id);
      // ensure ordered
      const ordered = [...(list || [])].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
      setImages(ordered);
      setImagesDirty(false);
    } catch (e) {
      if (e?.message === "UNAUTHORIZED") nav("/admin/login", { replace: true });
      else setImgErr(e?.message || "Failed to load gallery images");
    }
  }

  useEffect(() => {
    if (editing) {
      loadProject();
      loadImages();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editing, id]);

  function updateField(key, val) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  async function saveProject(e) {
    e.preventDefault();
    setErr("");
    setOk("");
    setBusy(true);

    try {
      const payload = {
        slug: form.slug || undefined,
        projectTitle: form.projectTitle,
        heroBlurb: form.heroBlurb || "",
        projectShortDesc: form.projectShortDesc || "",
        projectLongDesc: form.projectLongDesc || "",
        projectTags: form.projectTags || "", // comma-separated
        cardImageUrl: form.cardImageUrl || "",
        mainImageUrl: form.mainImageUrl || "",
        displayOrder: Number(form.displayOrder || 0),
        status: form.status,
      };

      if (editing) {
        await AdminProjectsApi.update(id, payload);
        setOk("Saved.");
        await loadProject();
      } else {
        const created = await AdminProjectsApi.create(payload);
        setOk("Created.");
        nav(`/admin/projects/${created.projectId}/edit`, { replace: true });
      }
    } catch (e2) {
      if (e2?.message === "UNAUTHORIZED") nav("/admin/login", { replace: true });
      else setErr(e2?.message || "Save failed");
    } finally {
      setBusy(false);
    }
  }

  async function uploadAndSet(purpose, setterKey, file) {
    setErr("");
    setOk("");
    setBusy(true);

    try {
      const presign = await presignUpload({
        projectSlug: effectiveSlug,
        purpose,
        originalFileName: file.name,
        contentType: file.type,
      });

      await putToPresignedUrl(presign.uploadUrl, file);

      updateField(setterKey, presign.publicUrl);
      setOk(`${purpose} image uploaded.`);
    } catch (e) {
      if (e?.message === "UNAUTHORIZED") nav("/admin/login", { replace: true });
      else setErr(e?.message || "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  async function addGalleryImage(file) {
    if (!editing) return;
    setImgErr("");
    setBusy(true);

    try {
      const presign = await presignUpload({
        projectSlug: effectiveSlug,
        purpose: "GALLERY",
        originalFileName: file.name,
        contentType: file.type,
      });

      await putToPresignedUrl(presign.uploadUrl, file);

      const created = await AdminImagesApi.add(id, {
        url: presign.publicUrl,
        alt: "",
        kind: "GALLERY",
      });

      const next = [...images, created].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
      setImages(next);
      setOk("Gallery image added.");
    } catch (e) {
      if (e?.message === "UNAUTHORIZED") nav("/admin/login", { replace: true });
      else setImgErr(e?.message || "Failed to add image");
    } finally {
      setBusy(false);
    }
  }

  function moveImage(idx, dir) {
    const j = idx + dir;
    if (j < 0 || j >= images.length) return;
    const copy = [...images];
    const tmp = copy[idx];
    copy[idx] = copy[j];
    copy[j] = tmp;
    setImages(copy);
    setImagesDirty(true);
  }

  async function saveOrder() {
    if (!editing) return;
    setImgErr("");
    setBusy(true);

    try {
      const orderedIds = images.map((i) => i.id);
      const updated = await AdminImagesApi.reorder(id, orderedIds);
      const next = [...(updated || [])].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
      setImages(next);
      setImagesDirty(false);
      setOk("Gallery order saved.");
    } catch (e) {
      if (e?.message === "UNAUTHORIZED") nav("/admin/login", { replace: true });
      else setImgErr(e?.message || "Failed to reorder images");
    } finally {
      setBusy(false);
    }
  }

  async function updateAlt(imageId, alt) {
    if (!editing) return;
    setImgErr("");
    try {
      await AdminImagesApi.patch(id, imageId, { alt });
      setImages((arr) => arr.map((x) => (x.id === imageId ? { ...x, alt } : x)));
    } catch (e) {
      if (e?.message === "UNAUTHORIZED") nav("/admin/login", { replace: true });
      else setImgErr(e?.message || "Failed to update alt text");
    }
  }

  async function deleteImage(imageId) {
    if (!editing) return;
    setImgErr("");
    setBusy(true);

    try {
      await AdminImagesApi.remove(id, imageId);
      setImages((arr) => arr.filter((x) => x.id !== imageId));
      setImagesDirty(true); // because server sort orders now might have gaps; we’ll saveOrder to normalize
      setOk("Image removed. Click “Save order” to normalize ordering.");
    } catch (e) {
      if (e?.message === "UNAUTHORIZED") nav("/admin/login", { replace: true });
      else setImgErr(e?.message || "Failed to delete image");
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
              <h1 className="adminTitle">{editing ? "Edit Project" : "Create Project"}</h1>
            </div>

            <div className="adminRow">
              <Link className="btn" to="/admin">
                ← Dashboard
              </Link>
              <button className="btn" type="button" onClick={logout}>
                Logout
              </button>
            </div>
          </div>

          <div className="adminBody">
            <form onSubmit={saveProject}>
              <div className="adminGrid">
                <div className="adminField">
                  <div className="adminLabel">Title</div>
                  <input
                    className="adminInput"
                    value={form.projectTitle}
                    onChange={(e) => updateField("projectTitle", e.target.value)}
                    required
                  />
                </div>

                <div className="adminField">
                  <div className="adminLabel">Slug</div>
                  <input
                    className="adminInput"
                    value={form.slug}
                    onChange={(e) => updateField("slug", e.target.value)}
                    placeholder={`Auto: ${effectiveSlug}`}
                    readOnly
                  />
                  <div className="adminHint">R2 URL: /projects/{effectiveSlug}</div>
                </div>

                <div className="adminField">
                  <div className="adminLabel">Status</div>
                  <select
                    className="adminSelect"
                    value={form.status}
                    onChange={(e) => updateField("status", e.target.value)}
                  >
                    <option value="DRAFT">DRAFT</option>
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="COMPLETED">COMPLETED</option>
                  </select>
                </div>

                <div className="adminField">
                  <div className="adminLabel">Display Order</div>
                  <input
                    className="adminInput"
                    type="number"
                    value={form.displayOrder}
                    onChange={(e) => updateField("displayOrder", e.target.value)}
                  />
                </div>

                <div className="adminField" style={{ gridColumn: "1 / -1" }}>
                  <div className="adminLabel">Hero Blurb</div>
                  <input
                    className="adminInput"
                    value={form.heroBlurb}
                    onChange={(e) => updateField("heroBlurb", e.target.value)}
                  />
                </div>

                <div className="adminField" style={{ gridColumn: "1 / -1" }}>
                  <div className="adminLabel">Short Description</div>
                  <textarea
                    className="adminTextarea"
                    value={form.projectShortDesc}
                    onChange={(e) => updateField("projectShortDesc", e.target.value)}
                  />
                </div>

                <div className="adminField" style={{ gridColumn: "1 / -1" }}>
                  <div className="adminLabel">Long Description</div>
                  <textarea
                    className="adminTextarea"
                    value={form.projectLongDesc}
                    onChange={(e) => updateField("projectLongDesc", e.target.value)}
                  />
                </div>

                <div className="adminField" style={{ gridColumn: "1 / -1" }}>
                  <div className="adminLabel">Tags (comma-separated)</div>
                  <input
                    className="adminInput"
                    value={form.projectTags}
                    onChange={(e) => updateField("projectTags", e.target.value)}
                    placeholder="Water, Malawi, Infrastructure"
                  />
                  <div className="adminHint">
                    Keep tags comma-separated. Your public frontend will split on commas.
                  </div>
                </div>

                <div className="adminField">
                  <div className="adminLabel">Card Image</div>
                  {form.cardImageUrl ? (
                    <img className="adminThumb" src={form.cardImageUrl} alt="" />
                  ) : (
                    <div className="adminThumb" aria-hidden="true" />
                  )}
                  <input
                    className="adminInput"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) uploadAndSet("CARD", "cardImageUrl", f);
                      e.target.value = "";
                    }}
                  />
                  <div className="adminHint">Uploads to R2 via presigned URL.</div>
                </div>

                <div className="adminField">
                  <div className="adminLabel">Main Image</div>
                  {form.mainImageUrl ? (
                    <img className="adminThumb" src={form.mainImageUrl} alt="" />
                  ) : (
                    <div className="adminThumb" aria-hidden="true" />
                  )}
                  <input
                    className="adminInput"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) uploadAndSet("MAIN", "mainImageUrl", f);
                      e.target.value = "";
                    }}
                  />
                  <div className="adminHint">Used on the per-project page header/media.</div>
                </div>
              </div>

              <div className="adminRow" style={{ marginTop: 14 }}>
                <button className="btn btnPrimary" type="submit" disabled={busy}>
                  {busy ? "Saving…" : editing ? "Save changes" : "Create project"}
                </button>

                {editing && (
                  <Link className="btn" to={`/projects/${effectiveSlug}`} target="_blank" rel="noreferrer">
                    Preview public page
                  </Link>
                )}
              </div>

              {err && <div className="adminError">{err}</div>}
              {ok && <div className="adminOk">{ok}</div>}
            </form>

            {/* Gallery */}
            <div className="adminGallery" aria-label="Project gallery">
              <div className="adminRow" style={{ justifyContent: "space-between" }}>
                <div>
                  <div className="adminKicker">Gallery</div>
                  <div className="adminHint">
                    Upload images to R2 and manage order. (This powers your per-project gallery.)
                  </div>
                </div>

                <div className="adminRow">
                  {editing ? (
                    <>
                      <label className="btn" style={{ cursor: "pointer" }}>
                        + Add image
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) addGalleryImage(f);
                            e.target.value = "";
                          }}
                        />
                      </label>

                      <button className="btn" type="button" onClick={saveOrder} disabled={!imagesDirty || busy}>
                        Save order
                      </button>

                      <button className="btn" type="button" onClick={loadImages} disabled={busy}>
                        Refresh
                      </button>
                    </>
                  ) : (
                    <div className="adminHint">Create the project first to enable gallery uploads.</div>
                  )}
                </div>
              </div>

              {imgErr && <div className="adminError">{imgErr}</div>}

              {editing && (
                <div className="adminGalleryGrid">
                  {images.map((img, idx) => (
                    <div className="adminGalleryCard" key={img.id}>
                      <div className="adminGalleryMedia">
                        <img src={img.url} alt={img.alt || ""} />
                      </div>

                      <div className="adminGalleryBody">
                        <div className="adminField">
                          <div className="adminLabel">Alt text</div>
                          <input
                            className="adminInput"
                            value={img.alt || ""}
                            onChange={(e) => updateAlt(img.id, e.target.value)}
                            placeholder="Optional description"
                          />
                        </div>

                        <div className="adminRow">
                          <button className="btn" type="button" onClick={() => moveImage(idx, -1)}>
                            ↑
                          </button>
                          <button className="btn" type="button" onClick={() => moveImage(idx, +1)}>
                            ↓
                          </button>
                          <button className="btn" type="button" onClick={() => deleteImage(img.id)} disabled={busy}>
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {!images.length && (
                    <div className="adminHint" style={{ gridColumn: "1 / -1" }}>
                      No gallery images yet.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
