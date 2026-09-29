import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      console.error("Login error:", error);

      if (error.message.toLowerCase().includes("invalid login")) {
        setError("Invalid email or password.");
      } else if (
        error.message.toLowerCase().includes("email not confirmed")
      ) {
        setError(
          "Your email is not confirmed. Please confirm your email first."
        );
      } else {
        setError(error.message);
      }

      setLoading(false);
      return;
    }

    console.log("Login successful:", data);

    navigate("/jobs");
  }

  return (
    <div className="login-page">

      {/* ==============================
          LEFT CAREER BANNER
      ============================== */}

      <div className="login-hero">

        <div className="login-hero-overlay">

          <Link to="/jobs" className="login-brand">
            Job Portal
          </Link>

          <div className="login-hero-content">

            <div className="hero-badge">
              🚀 Your career journey starts here
            </div>

            <h1>
              Find the right job.
              <br />
              Build your future.
            </h1>

            <p>
              Discover opportunities, apply to jobs and keep track
              of your applications — all in one place.
            </p>

            <div className="login-feature-list">

              <div className="login-feature">
                <div className="login-feature-icon">
                  🔎
                </div>

                <div>
                  <h3>Discover Opportunities</h3>
                  <p>
                    Find jobs based on your skills, location and
                    career goals.
                  </p>
                </div>
              </div>

              <div className="login-feature">
                <div className="login-feature-icon">
                  ⚡
                </div>

                <div>
                  <h3>Apply Faster</h3>
                  <p>
                    Explore job details and apply without wasting
                    time.
                  </p>
                </div>
              </div>

              <div className="login-feature">
                <div className="login-feature-icon">
                  📋
                </div>

                <div>
                  <h3>Track Applications</h3>
                  <p>
                    Keep your applied jobs organized in one place.
                  </p>
                </div>
              </div>

            </div>

          </div>

          <div className="login-hero-footer">
            <span>💼 Fresh opportunities</span>
            <span>•</span>
            <span>🎯 Career focused</span>
            <span>•</span>
            <span>📱 Instagram community</span>
          </div>

        </div>

      </div>


      {/* ==============================
          RIGHT LOGIN AREA
      ============================== */}

      <div className="login-area">

        <div className="login-card">

          <div className="login-mobile-brand">
            <Link to="/jobs">
              Job Portal
            </Link>
          </div>

          <div className="login-heading">

            <div className="login-icon">
              👋
            </div>

            <h2>Welcome back!</h2>

            <p>
              Login to continue your job search.
            </p>

          </div>


          {/* Useful banner */}

          <div className="login-info-banner">
            <div className="login-info-icon">
              🔔
            </div>

            <div>
              <strong>Stay updated</strong>

              <p>
                New job opportunities are added regularly.
              </p>
            </div>
          </div>


          {/* Error */}

          {error && (
            <div className="login-error">
              <span>⚠️</span>

              <p>{error}</p>
            </div>
          )}


          {/* Login Form */}

          <form
            className="login-form"
            onSubmit={handleLogin}
          >

            <div className="login-form-group">

              <label htmlFor="email">
                Email Address
              </label>

              <div className="login-input-wrapper">

                <span className="login-input-icon">
                  ✉️
                </span>

                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />

              </div>

            </div>


            <div className="login-form-group">

              <div className="login-password-label">

                <label htmlFor="password">
                  Password
                </label>

              </div>

              <div className="login-input-wrapper">

                <span className="login-input-icon">
                  🔒
                </span>

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                
                

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword((previous) => !previous)
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>

              </div>
               <div className="forgot-password-row">
    <Link to="/forgot-password">
      Forgot password?
    </Link>
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
                  Signing in...
                </>
              ) : (
                <>
                  Login to Job Portal
                  <span>→</span>
                </>
              )}
            </button>

          </form>


          {/* Register */}

          <div className="login-register">

            <span>
              Don't have an account?
            </span>

            <Link to="/register">
              Create an account
            </Link>

          </div>


          {/* Back */}

          <Link
            to="/jobs"
            className="back-to-jobs"
          >
            ← Browse jobs without logging in
          </Link>


          <div className="login-security">
            🔐 Your account credentials are securely handled by
            Supabase Authentication.
          </div>

          {/* social media links */}

          {/* Social Media */}

<div className="login-social-section">

  <p className="login-social-title">
    Follow us & stay updated
  </p>

  <div className="login-social-links">

    <a
      href="https://www.instagram.com/javadebugged/"
      target="_blank"
      rel="noopener noreferrer"
      className="social-link instagram-link"
    >
      <span className="social-icon">📸</span>

      <span>
        <strong>Instagram</strong>
        <small>@javadebugged</small>
      </span>

      <span className="social-arrow">↗</span>
    </a>


    <a
      href="https://www.instagram.com/javadebugged/"
      target="_blank"
      rel="noopener noreferrer"
      className="social-link channel-link"
    >
      <span className="social-icon">📢</span>

      <span>
        <strong>Instagram Channel</strong>
        <small>Join our job updates</small>
      </span>

      <span className="social-arrow">↗</span>
    </a>

  </div>

</div>

        </div>

      </div>

    </div>
  );
}

export default Login;