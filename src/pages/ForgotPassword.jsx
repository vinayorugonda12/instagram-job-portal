import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleReset(e) {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(
      email.trim(),
      {
        redirectTo: `${window.location.origin}/reset-password`,
      }
    );

    if (error) {
      console.error("Password reset error:", error);
      setError(error.message);
      setLoading(false);
      return;
    }

    setMessage(
      "If an account exists with this email, a password reset link has been sent. Please check your inbox."
    );

    setLoading(false);
  }

  return (
    <div className="login-page">

      {/* Left Banner */}

      <div className="login-hero">

        <div className="login-hero-overlay">

          <Link to="/jobs" className="login-brand">
            Job Portal
          </Link>

          <div className="login-hero-content">

            <div className="hero-badge">
              🔐 Account Security
            </div>

            <h1>
              Get back to your
              <br />
              job search.
            </h1>

            <p>
              Don't worry if you forgot your password.
              We'll help you securely regain access to your
              account.
            </p>

            <div className="login-feature-list">

              <div className="login-feature">
                <div className="login-feature-icon">
                  🔐
                </div>

                <div>
                  <h3>Secure Password Reset</h3>
                  <p>
                    Reset your password through a secure
                    email link.
                  </p>
                </div>
              </div>

              <div className="login-feature">
                <div className="login-feature-icon">
                  📧
                </div>

                <div>
                  <h3>Check Your Email</h3>
                  <p>
                    We'll send instructions to your registered
                    email address.
                  </p>
                </div>
              </div>

              <div className="login-feature">
                <div className="login-feature-icon">
                  🚀
                </div>

                <div>
                  <h3>Continue Your Journey</h3>
                  <p>
                    Create a new password and continue
                    exploring jobs.
                  </p>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>


      {/* Reset Form */}

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

            <h2>Forgot Password?</h2>

            <p>
              Enter your registered email and we'll send
              you a password reset link.
            </p>

          </div>


          {/* Success Message */}

          {message && (
            <div className="login-success">
              <span>✅</span>

              <p>{message}</p>
            </div>
          )}


          {/* Error */}

          {error && (
            <div className="login-error">
              <span>⚠️</span>

              <p>{error}</p>
            </div>
          )}


          <form
            className="login-form"
            onSubmit={handleReset}
          >

            <div className="login-form-group">

              <label htmlFor="reset-email">
                Email Address
              </label>

              <div className="login-input-wrapper">

                <span className="login-input-icon">
                  ✉️
                </span>

                <input
                  id="reset-email"
                  type="email"
                  placeholder="Enter your registered email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />

              </div>

            </div>


            <button
              type="submit"
              className="login-submit-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="login-spinner"></span>
                  Sending...
                </>
              ) : (
                <>
                  Send Reset Link
                  <span>→</span>
                </>
              )}
            </button>

          </form>


          <div className="login-register">

            <span>Remember your password?</span>

            <Link to="/login">
              Back to Login
            </Link>

          </div>


          <Link
            to="/jobs"
            className="back-to-jobs"
          >
            ← Browse jobs without logging in
          </Link>


          <div className="login-security">
            🔐 Passwords are securely managed by
            Supabase Authentication.
          </div>

        </div>

      </div>

    </div>
  );
}

export default ForgotPassword;