import { clearAdminToken, getAdminToken } from "./adminAuth";

const API_BASE = import.meta.env.VITE_API_URL;

async function parseJsonSafe(res) {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return text || null;
  }
}

export async function adminFetch(path, options = {}) {
  const token = getAdminToken();

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status === 401) {
    clearAdminToken();
    throw new Error("UNAUTHORIZED");
  }

  if (!res.ok) {
    const body = await parseJsonSafe(res);
    const msg = typeof body === "string" ? body : body?.error || body?.message || `${res.status}`;
    throw new Error(msg);
  }

  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) return res.json();
  return null;
}

export async function loginAdmin(username, password) {
  const res = await fetch(`${API_BASE}/api/admin/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    const body = await parseJsonSafe(res);
    const msg = typeof body === "string" ? body : body?.error || body?.message || "Login failed";
    throw new Error(msg);
  }

  return res.json(); // { token, tokenType, expiresMinutes }
}

// Projects
export const AdminProjectsApi = {
  list: () => adminFetch("/api/admin/projects"),
  create: (payload) =>
    adminFetch("/api/admin/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
  update: (id, payload) =>
    adminFetch(`/api/admin/projects/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
  setStatus: (id, status) =>
    adminFetch(`/api/admin/projects/${id}/status?status=${encodeURIComponent(status)}`, {
      method: "PATCH",
    }),
};

// R2 Presign
export async function presignUpload({ projectSlug, purpose, originalFileName, contentType }) {
  return adminFetch("/api/admin/uploads/presign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ projectSlug, purpose, originalFileName, contentType }),
  });
}

// Project Images (gallery)
export const AdminImagesApi = {
  list: (projectId) => adminFetch(`/api/admin/projects/${projectId}/images`),
  add: (projectId, payload) =>
    adminFetch(`/api/admin/projects/${projectId}/images`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
  patch: (projectId, imageId, payload) =>
    adminFetch(`/api/admin/projects/${projectId}/images/${imageId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
  remove: (projectId, imageId) =>
    adminFetch(`/api/admin/projects/${projectId}/images/${imageId}`, {
      method: "DELETE",
    }),
  reorder: (projectId, orderedIds) =>
    adminFetch(`/api/admin/projects/${projectId}/images/reorder`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderedIds }),
    }),
};


// Events
export const AdminEventsApi = {
  list: () => adminFetch("/api/admin/events"),
  create: (payload) =>
    adminFetch("/api/admin/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
  update: (id, payload) =>
    adminFetch(`/api/admin/events/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
  setStatus: (id, status) =>
    adminFetch(`/api/admin/events/${id}/status?status=${encodeURIComponent(status)}`, {
      method: "PATCH",
    }),
  remove: (id) =>
    adminFetch(`/api/admin/events/${id}`, {
      method: "DELETE",
    }),
};