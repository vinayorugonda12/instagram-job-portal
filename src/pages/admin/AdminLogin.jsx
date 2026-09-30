import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";

function AdminLogin() {
  const navigate = useNavigate();
  const { adminLogin } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      // =========================
      // SUPABASE LOGIN
      // =========================

      const { data, error: loginError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (loginError) {
        throw new Error("Invalid email or password.");
      }

      if (!data?.user) {
        throw new Error("Unable to authenticate admin.");
      }

      // =========================
      // CHECK ADMIN ROLE
      // =========================

      const {
        data: isAdmin,
        error: adminError,
      } = await supabase.rpc("is_admin");

      if (adminError) {
        console.error(
          "Admin verification error:",
          adminError
        );

        await supabase.auth.signOut();

        throw new Error(
          "Unable to verify admin access. Please try again."
        );
      }

      if (!isAdmin) {
        await supabase.auth.signOut();

        throw new Error(
          "This account does not have admin access."
        );
      }

      // =========================
      // ADMIN LOGIN SUCCESS
      // =========================

      adminLogin();

      navigate("/admin/dashboard", {
        replace: true,
      });
    } catch (error) {
      console.error("Admin login error:", error);

      setError(
        error.message ||
          "Unable to login. Please try again."
      );

      setPassword("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-login-page">

      {/* =========================
          LOGIN CARD
      ========================= */}

      <div className="admin-login-card">

        {/* BRAND */}
        <div className="admin-login-brand">
          <span className="admin-brand-job">
            Job Portal
          </span>

          <span className="admin-brand-dot">
            •
          </span>

          <span className="admin-brand-java">
            JavaDebugged
          </span>
        </div>

        {/* HEADER */}
        <div className="admin-login-header">

          <div className="admin-login-icon">
            ⚙️
          </div>

          <h1>
            Admin Access
          </h1>

          <p>
            Sign in to manage your job portal
          </p>

        </div>

        {/* SECURITY INFO */}
        <div className="admin-login-info">

          <span className="admin-login-info-icon">
            🔐
          </span>

          <div>
            <strong>
              Secure Admin Area
            </strong>

            <p>
              Only authorized administrators
              can access this panel.
            </p>
          </div>

        </div>

        {/* ERROR */}
        {error && (
          <div className="admin-login-error">

            <span>
              ⚠️
            </span>

            <p>
              {error}
            </p>

          </div>
        )}

        {/* LOGIN FORM */}
        <form
          className="admin-login-form"
          onSubmit={handleSubmit}
        >

          {/* EMAIL */}
          <div className="admin-form-group">

            <label htmlFor="admin-email">
              Admin Email
            </label>

            <div className="admin-input-wrapper">

              <span className="admin-input-icon">
                ✉️
              </span>

              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="Enter admin email"
                autoComplete="username"
                required
              />

            </div>

          </div>

          {/* PASSWORD */}
          <div className="admin-form-group">

            <label htmlFor="admin-password">
              Admin Password
            </label>

            <div className="admin-password-wrapper">

              <span className="admin-input-icon">
                🔒
              </span>

              <input
                id="admin-password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="Enter admin password"
                autoComplete="current-password"
                required
              />

              <button
                type="button"
                className="admin-password-toggle"
                onClick={() =>
                  setShowPassword(
                    (previous) => !previous
                  )
                }
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showPassword
                  ? "Hide"
                  : "Show"}
              </button>

            </div>

          </div>

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            className="admin-login-submit"
            disabled={loading}
          >

            {loading ? (
              <>
                <span className="admin-login-spinner"></span>
                Signing In...
              </>
            ) : (
              <>
                Sign In to Admin Panel
                <span>→</span>
              </>
            )}

          </button>

        </form>

        {/* BACK TO WEBSITE */}
        <button
          type="button"
          className="admin-back-button"
          onClick={() => navigate("/jobs")}
        >
          ← Back to Jobs
        </button>

        {/* FOOTER */}
        <div className="admin-login-footer">
          <span>🔒</span>
          <span>
            Protected administrator access
          </span>
        </div>

      </div>

    </div>
  );
}

export default AdminLogin;