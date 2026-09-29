import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

function ResetPassword() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let mounted = true;

    async function checkRecoverySession() {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      console.log("Reset page session:", session);
      console.log("Reset page session error:", error);

      if (!mounted) return;

      if (error) {
        setError(
          "Unable to verify the password reset session."
        );
        setCheckingSession(false);
        return;
      }

      if (!session) {
        setError(
          "This password reset link is invalid or has expired. Please request a new reset link."
        );
        setCheckingSession(false);
        return;
      }

      setCheckingSession(false);
    }

    checkRecoverySession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log(
          "Password reset auth event:",
          event,
          session
        );

        if (event === "PASSWORD_RECOVERY") {
          setCheckingSession(false);
          setError("");
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function handleUpdatePassword(e) {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!password || !confirmPassword) {
      setError("Please fill in both password fields.");
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must be at least 6 characters long."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      console.error(
        "Password update error:",
        error
      );

      setError(error.message);
      setLoading(false);

      return;
    }

    setMessage(
      "Password updated successfully! Redirecting to login..."
    );

    setLoading(false);

    setTimeout(async () => {
      await supabase.auth.signOut();
      navigate("/login");
    }, 1800);
  }

  if (checkingSession) {
    return (
      <div className="login-page">

        <div className="login-area">

          <div className="login-card">

            <div className="login-mobile-brand">
              <Link to="/jobs">
                Job Portal
              </Link>
            </div>

            <div className="login-heading">

              <div className="login-icon">
                🔐
              </div>

              <h2>Verifying Reset Link</h2>

              <p>
                Please wait while we securely verify
                your password reset link.
              </p>

            </div>

            <div
              style={{
                textAlign: "center",
                padding: "25px 0",
              }}
            >
              <span className="login-spinner"></span>
            </div>

          </div>

        </div>

      </div>
    );
  }

  return (
    <div className="login-page">

      {/* LEFT BANNER */}

      <div className="login-hero">

        <div className="login-hero-overlay">

          <Link
            to="/jobs"
            className="login-brand"
          >
            Job Portal
          </Link>

          <div className="login-hero-content">

            <div className="hero-badge">
              🔐 Secure Account
            </div>

            <h1>
              Create a new
              <br />
              password.
            </h1>

            <p>
              Choose a strong password to keep your
              account and job applications secure.
            </p>

            <div className="login-feature-list">

              <div className="login-feature">

                <div className="login-feature-icon">
                  🔒
                </div>

                <div>
                  <h3>
                    Secure Password
                  </h3>

                  <p>
                    Your password is securely handled
                    by Supabase Authentication.
                  </p>
                </div>

              </div>

              <div className="login-feature">

                <div className="login-feature-icon">
                  💼
                </div>

                <div>
                  <h3>
                    Keep Your Applications
                  </h3>

                  <p>
                    Your job application history stays
                    connected to your account.
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>


      {/* RESET FORM */}

      <div className="login-area">

        <div className="login-card">

          <div className="login-mobile-brand">
            <Link to="/jobs">
              Job Portal
            </Link>
          </div>


          <div className="login-heading">

            <div className="login-icon">
              🔑
            </div>

            <h2>
              Create New Password
            </h2>

            <p>
              Enter your new password below.
            </p>

          </div>


          {/* SUCCESS */}

          {message && (
            <div className="login-success">

              <span>✅</span>

              <p>{message}</p>

            </div>
          )}


          {/* ERROR */}

          {error && (
            <div className="login-error">

              <span>⚠️</span>

              <p>{error}</p>

            </div>
          )}


          {!error && !message && (
            <form
              className="login-form"
              onSubmit={handleUpdatePassword}
            >

              {/* NEW PASSWORD */}

              <div className="login-form-group">

                <label htmlFor="new-password">
                  New Password
                </label>

                <div className="login-input-wrapper">

                  <span className="login-input-icon">
                    🔒
                  </span>

                  <input
                    id="new-password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    autoComplete="new-password"
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowPassword(
                        (previous) =>
                          !previous
                      )
                    }
                  >
                    {showPassword
                      ? "🙈"
                      : "👁️"}
                  </button>

                </div>

              </div>


              {/* CONFIRM PASSWORD */}

              <div className="login-form-group">

                <label htmlFor="confirm-password">
                  Confirm Password
                </label>

                <div className="login-input-wrapper">

                  <span className="login-input-icon">
                    🔒
                  </span>

                  <input
                    id="confirm-password"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(
                        e.target.value
                      )
                    }
                    autoComplete="new-password"
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowConfirmPassword(
                        (previous) =>
                          !previous
                      )
                    }
                  >
                    {showConfirmPassword
                      ? "🙈"
                      : "👁️"}
                  </button>

                </div>

              </div>


              {/* UPDATE BUTTON */}

              <button
                type="submit"
                className="login-submit-button"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="login-spinner"></span>
                    Updating...
                  </>
                ) : (
                  <>
                    Update Password
                    <span>→</span>
                  </>
                )}
              </button>

            </form>
          )}


          {/* INVALID LINK */}

          {error && (
            <Link
              to="/forgot-password"
              className="login-submit-button"
              style={{
                marginTop: "15px",
              }}
            >
              Request New Reset Link
            </Link>
          )}


          <Link
            to="/login"
            className="back-to-jobs"
          >
            ← Back to Login
          </Link>


          <div className="login-security">
            🔐 Your password is securely managed by
            Supabase Authentication.
          </div>

        </div>

      </div>

    </div>
  );
}

export default ResetPassword;