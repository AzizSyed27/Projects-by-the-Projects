const API_BASE = import.meta.env.VITE_API_URL;

export async function subscribeEmail(email) {
  const res = await fetch(`${API_BASE}/api/subscribers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  // backend returns { ok: true, message: "..." }
  let data = null;
  try {
    data = await res.json();
  } catch {
    // ignore
  }

  if (!res.ok) {
    const msg = data?.message || data?.error || "Subscription failed. Please try again.";
    throw new Error(msg);
  }

  return data || { ok: true, message: "Check your email to confirm your subscription." };
}
