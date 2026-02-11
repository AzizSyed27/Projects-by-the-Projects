import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/admin.css";

import { loginAdmin } from "../admin/adminApi";
import { setAdminToken } from "../admin/adminAuth";

export default function AdminLogin() {
  const nav = useNavigate();
  const loc = useLocation();
  const from = loc.state?.from || "/admin";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setBusy(true);

    try {
      const res = await loginAdmin(username.trim(), password);
      setAdminToken(res.token);
      nav(from, { replace: true });
    } catch (e2) {
      setErr(e2?.message || "Login failed");
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
              <h1 className="adminTitle">PXP Dashboard Login</h1>
            </div>
          </div>

          <div className="adminBody">
            <form onSubmit={onSubmit} className="adminGrid" style={{ gridTemplateColumns: "1fr" }}>
              <div className="adminField">
                <div className="adminLabel">Username</div>
                <input
                  className="adminInput"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  required
                />
              </div>

              <div className="adminField">
                <div className="adminLabel">Password</div>
                <input
                  className="adminInput"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  autoComplete="current-password"
                  required
                />
              </div>

              <div className="adminRow">
                <button className="btn btnPrimary" type="submit" disabled={busy}>
                  {busy ? "Signing in…" : "Sign in"}
                </button>
              </div>

              <div className="adminError">
                {err === "Forbidden" ? (
                  "Invalid Username or Password. Please try again."
                ) : (
                  err
                )}
                
              </div>
              


            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
