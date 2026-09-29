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
    // User is not logged in
    if (!user) {
      const shouldLogin = window.confirm(
        "Please login to apply for this job.\n\nWould you like to go to the login page?"
      );

      if (shouldLogin) {
        navigate("/login");
      }

      return;
    }

    if (!job) {
      return;
    }

    setApplying(true);

    try {
      // =========================
      // CHECK IF ALREADY APPLIED
      // =========================

      const {
        data: existingApplication,
        error: checkError,
      } = await supabase
        .from("applications")
        .select("id")
        .eq("user_id", user.id)
        .eq("job_id", job.id)
        .maybeSingle();

      if (checkError) {
        console.error(
          "Application check error:",
          checkError
        );

        alert(
          "Unable to check your application. Please try again."
        );

        setApplying(false);
        return;
      }

      // =========================
      // ALREADY APPLIED
      // =========================

      if (existingApplication) {
        await trackEvent({
          eventType: "APPLY_CLICK",
          jobId: job.id,
          userId: user.id,
        });

        alert(
          "You have already applied for this job."
        );

        if (job.application_url) {
          window.open(
            job.application_url,
            "_blank",
            "noopener,noreferrer"
          );
        }

        setApplying(false);
        return;
      }

      // =========================
      // SAVE APPLICATION
      // =========================

      const {
        error: applicationError,
      } = await supabase
        .from("applications")
        .insert({
          user_id: user.id,
          job_id: job.id,
        });

      if (applicationError) {
        console.error(
          "Application insert error:",
          applicationError
        );

        alert(
          "Unable to save your application. Please try again."
        );

        setApplying(false);
        return;
      }

      // =========================
      // TRACK APPLY CLICK
      // =========================

      await trackEvent({
        eventType: "APPLY_CLICK",
        jobId: job.id,
        userId: user.id,
      });

      // =========================
      // SUCCESS MESSAGE
      // =========================

      alert(
        "Your application has been recorded successfully!"
      );

      // =========================
      // OPEN COMPANY APPLICATION URL
      // =========================

      if (job.application_url) {
        window.open(
          job.application_url,
          "_blank",
          "noopener,noreferrer"
        );
      } else {
        alert(
          "This job does not have an external application link."
        );
      }

    } catch (error) {
      console.error(
        "Application exception:",
        error
      );

      alert(
        "Something went wrong while applying."
      );
    }

    setApplying(false);
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
                  <Link
                    to="/login"
                    className="login-button"
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    className="register-button"
                  >
                    Register
                  </Link>
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
                <Link
                  to="/login"
                  className="login-button"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="register-button"
                >
                  Register
                </Link>
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
                ? "Processing..."
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

      </div>

    </div>
  );
}

export default JobDetails;