import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { trackEvent } from "../lib/analytics";
import { useAuth } from "../context/AuthContext";

function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { user, profile, logout } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [applying, setApplying] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);

  // =========================
  // FETCH JOB
  // =========================

  useEffect(() => {
    fetchJob();
  }, [id]);

  async function fetchJob() {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .eq("id", id)
      .eq("status", "active")
      .single();

    console.log("Job details:", data);
    console.log("Job details error:", error);

    if (error) {
      console.error("Job fetch error:", error);
      setError("Job not found or no longer available.");
      setLoading(false);
      return;
    }

    setJob(data);

    // =========================
    // TRACK JOB VIEW
    // =========================

    await trackEvent({
      eventType: "JOB_VIEW",
      jobId: data.id,
      userId: user?.id || null,
    });

    setLoading(false);
  }

  // =========================
  // LOGOUT
  // =========================

  async function handleLogout() {
    await logout();
  }

  // =========================
  // APPLY FOR JOB
  // =========================

  async function handleApply() {
    if (!job) {
      return;
    }

    if (!job.application_url) {
      alert("This job does not have an external application link.");
      return;
    }

    setApplying(true);

    try {
      // Track apply click.
      // userId is optional, so anonymous visitors can also be tracked.
      await trackEvent({
        eventType: "APPLY_CLICK",
        jobId: job.id,
        userId: user?.id || null,
      });

      // Open the company's application page.
      window.open(
        job.application_url,
        "_blank",
        "noopener,noreferrer"
      );
    } catch (error) {
      console.error("Apply error:", error);

      alert(
        "Unable to open the application link. Please try again."
      );
    } finally {
      setApplying(false);
    }
  }

  // =========================
  // LOADING SCREEN
  // =========================

  if (loading) {
    return (
      <div className="jobs-page">
        <div className="jobs-container">

          <div className="jobs-nav">

            <div className="nav-brand">
              <Link to="/jobs">
                Job Portal
              </Link>
            </div>

          </div>

          <div className="jobs-header">
            <h1>Job Details</h1>
            <p>Loading job details...</p>
          </div>

        </div>
      </div>
    );
  }

  // =========================
  // ERROR / JOB NOT FOUND
  // =========================

  if (error || !job) {
    return (
      <div className="jobs-page">
        <div className="jobs-container">

          {/* NAVIGATION */}

          <div className="jobs-nav">

            <div className="nav-brand">
              <Link to="/jobs">
                Job Portal
              </Link>
            </div>

            <div className="nav-actions">

              {user ? (
                <>
                  <span className="welcome-text">
                    Welcome,{" "}
                    {profile?.full_name || user.email}
                  </span>

                  <Link
                    to="/my-applications"
                    className="login-button"
                  >
                    My Applications
                  </Link>

                  {profile?.role === "admin" && (
                    <Link
                      to="/admin/dashboard"
                      className="admin-button"
                    >
                      Admin Dashboard
                    </Link>
                  )}

                  <button
                    className="logout-button"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className="login-button"
                    onClick={() => setShowComingSoon(true)}
                  >
                    Login
                  </button>

                  <button
                    type="button"
                    className="register-button"
                    onClick={() => setShowComingSoon(true)}
                  >
                    Register
                  </button>
                </>
              )}

            </div>

          </div>

          {/* ERROR */}

          <div className="error-message">

            <h2>
              Job Not Found
            </h2>

            <p>
              {error ||
                "This job is no longer available."}
            </p>

            <br />

            <Link
              to="/jobs"
              className="view-job-button"
            >
              Back to Jobs
            </Link>

          </div>

          {/* COMING SOON MODAL */}

          {showComingSoon && (
            <div className="coming-soon-overlay">
              <div className="coming-soon-modal">

                <button
                  type="button"
                  className="coming-soon-close"
                  onClick={() => setShowComingSoon(false)}
                >
                  ×
                </button>

                <div className="coming-soon-icon">
                  🚀
                </div>

                <h2>Coming Soon</h2>

                <p>
                  Login and registration will be available soon.
                  For now, you can browse jobs and apply directly.
                </p>

                <button
                  type="button"
                  className="coming-soon-button"
                  onClick={() => setShowComingSoon(false)}
                >
                  Continue Browsing Jobs
                </button>

              </div>
            </div>
          )}

        </div>
      </div>
    );
  }

  // =========================
  // MAIN JOB DETAILS PAGE
  // =========================

  return (
    <div className="jobs-page">

      <div className="jobs-container">

        {/* =========================
            NAVIGATION
        ========================= */}

        <div className="jobs-nav">

          <div className="nav-brand">
            <Link to="/jobs">
              Job Portal
            </Link>
          </div>

          <div className="nav-actions">

            {user ? (
              <>
                <span className="welcome-text">
                  Welcome,{" "}
                  {profile?.full_name || user.email}
                </span>

                <Link
                  to="/my-applications"
                  className="login-button"
                >
                  My Applications
                </Link>

                {profile?.role === "admin" && (
                  <Link
                    to="/admin/dashboard"
                    className="admin-button"
                  >
                    Admin Dashboard
                  </Link>
                )}

                <button
                  className="logout-button"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="login-button"
                  onClick={() => setShowComingSoon(true)}
                >
                  Login
                </button>

                <button
                  type="button"
                  className="register-button"
                  onClick={() => setShowComingSoon(true)}
                >
                  Register
                </button>
              </>
            )}

          </div>

        </div>

        {/* =========================
            BACK TO JOBS
        ========================= */}

        <div style={{ marginBottom: "20px" }}>

          <Link
            to="/jobs"
            className="back-link"
          >
            ← Back to Jobs
          </Link>

        </div>

        {/* =========================
            JOB DETAILS
        ========================= */}

        <div className="job-details-card">

          {/* JOB TYPE */}

          <span className="job-type">
            {job.job_type || "Job"}
          </span>

          {/* TITLE */}

          <h1>
            {job.title}
          </h1>

          {/* COMPANY */}

          <h2>
            {job.company}
          </h2>

          {/* LOCATION + SALARY */}

          <div className="job-details-meta">

            <p>
              📍{" "}
              {job.location ||
                "Location not specified"}
            </p>

            {job.salary && (
              <p>
                💰 {job.salary}
              </p>
            )}

          </div>

          {/* =========================
              JOB DESCRIPTION
          ========================= */}

          <div className="job-section">

            <h3>
              Job Description
            </h3>

            <p className="job-full-description">
              {job.description ||
                "No job description provided."}
            </p>

          </div>

          {/* =========================
              REQUIREMENTS
          ========================= */}

          <div className="job-section">

            <h3>
              Requirements
            </h3>

            <p className="job-full-description">
              {job.requirements ||
                "No specific requirements provided."}
            </p>

          </div>

          {/* =========================
              APPLICATION
          ========================= */}

          <div className="apply-section">

            <button
              className="apply-button"
              onClick={handleApply}
              disabled={applying}
            >
              {applying
                ? "Opening..."
                : "Apply Now"}
            </button>

            {user && (
              <Link
                to="/my-applications"
                className="view-applications-link"
              >
                View My Applications
              </Link>
            )}

          </div>

        </div>

        {/* =========================
            COMING SOON MODAL
        ========================= */}

        {showComingSoon && (
          <div className="coming-soon-overlay">

            <div className="coming-soon-modal">

              <button
                type="button"
                className="coming-soon-close"
                onClick={() => setShowComingSoon(false)}
              >
                ×
              </button>

              <div className="coming-soon-icon">
                🚀
              </div>

              <h2>Coming Soon</h2>

              <p>
                Login and registration will be available soon.
                For now, you can browse jobs and apply directly.
              </p>

              <button
                type="button"
                className="coming-soon-button"
                onClick={() => setShowComingSoon(false)}
              >
                Continue Browsing Jobs
              </button>

            </div>

          </div>
        )}

      </div>

    </div>
  );
}

export default JobDetails;