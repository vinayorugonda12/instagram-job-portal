import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

function MyApplications() {
  const { user, profile, logout } = useAuth();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      fetchApplications();
    } else {
      setLoading(false);
    }
  }, [user]);

  async function fetchApplications() {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("applications")
      .select(`
        id,
        applied_at,
        job_id,
        jobs (
          id,
          title,
          company,
          location,
          job_type,
          salary,
          description,
          status
        )
      `)
      .eq("user_id", user.id)
      .order("applied_at", { ascending: false });

    console.log("Applications:", data);
    console.log("Applications error:", error);

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setApplications(data || []);
    setLoading(false);
  }

  async function handleLogout() {
    await logout();
  }

  // =========================
  // NOT LOGGED IN
  // =========================

  if (!user) {
    return (
      <div className="jobs-page">
        <div className="jobs-container">

          <div className="jobs-nav">
            <div className="nav-brand">
              <Link to="/jobs">Job Portal</Link>
            </div>

            <div className="nav-actions">
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
            </div>
          </div>

          <div className="no-jobs">
            <h2>Please Login</h2>

            <p>
              You need to login to view your applications.
            </p>

            <br />

            <Link
              to="/login"
              className="view-job-button"
            >
              Login
            </Link>
          </div>

        </div>
      </div>
    );
  }

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="jobs-page">
        <div className="jobs-container">

          <div className="jobs-nav">
            <div className="nav-brand">
              <Link to="/jobs">Job Portal</Link>
            </div>
          </div>

          <div className="jobs-header">
            <h1>My Applications</h1>
            <p>Loading your applications...</p>
          </div>

        </div>
      </div>
    );
  }

  // =========================
  // MAIN PAGE
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

            <span className="welcome-text">
              Welcome,{" "}
              {profile?.full_name || user.email}
            </span>

            <Link
              to="/jobs"
              className="login-button"
            >
              Browse Jobs
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

          </div>

        </div>

        {/* =========================
            HEADER
        ========================= */}

        <div className="jobs-header">
          <h1>My Applications</h1>

          <p>
            Track the jobs you have applied for.
          </p>
        </div>

        {/* =========================
            ERROR
        ========================= */}

        {error && (
          <div className="error-message">

            <h3>
              Unable to load applications
            </h3>

            <p>
              {error}
            </p>

            <button onClick={fetchApplications}>
              Try Again
            </button>

          </div>
        )}

        {/* =========================
            NO APPLICATIONS
        ========================= */}

        {!error && applications.length === 0 && (
          <div className="no-jobs">

            <h2>
              No applications yet
            </h2>

            <p>
              You haven't applied for any jobs yet.
            </p>

            <br />

            <Link
              to="/jobs"
              className="view-job-button"
            >
              Browse Jobs
            </Link>

          </div>
        )}

        {/* =========================
            APPLICATION LIST
        ========================= */}

        {!error && applications.length > 0 && (
          <div className="applications-list">

            {applications.map((application) => {

              const job = application.jobs;

              return (
                <div
                  className="application-card"
                  key={application.id}
                >

                  <div className="application-info">

                    <span className="job-type">
                      {job?.job_type || "Job"}
                    </span>

                    <h2>
                      {job?.title ||
                        "Job no longer available"}
                    </h2>

                    <h3>
                      {job?.company ||
                        "Company not available"}
                    </h3>

                    {job?.location && (
                      <p>
                        📍 {job.location}
                      </p>
                    )}

                    {job?.salary && (
                      <p>
                        💰 {job.salary}
                      </p>
                    )}

                    <p>
                      Applied on:{" "}
                      {new Date(
                        application.applied_at
                      ).toLocaleDateString()}
                    </p>

                    <span className="application-status">
                      Applied
                    </span>

                  </div>

                  <div>

                    {job && (
                      <Link
                        to={`/jobs/${job.id}`}
                        className="view-job-button"
                      >
                        View Job
                      </Link>
                    )}

                  </div>

                </div>
              );
            })}

          </div>
        )}

      </div>
    </div>
  );
}

export default MyApplications;