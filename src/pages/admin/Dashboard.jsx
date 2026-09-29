import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";

function Dashboard() {
  const { user, profile, logout } = useAuth();

  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    totalUsers: 0,
  });

  const [recentJobs, setRecentJobs] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user && profile?.role === "admin") {
      loadDashboard();
    }
  }, [user, profile]);

  async function loadDashboard() {
    setLoading(true);
    setError("");

    try {
      // =========================
      // TOTAL JOBS
      // =========================

      const { count: totalJobs, error: jobsError } =
        await supabase
          .from("jobs")
          .select("*", {
            count: "exact",
            head: true,
          });

      if (jobsError) {
        throw jobsError;
      }

      // =========================
      // ACTIVE JOBS
      // =========================

      const { count: activeJobs, error: activeJobsError } =
        await supabase
          .from("jobs")
          .select("*", {
            count: "exact",
            head: true,
          })
          .eq("status", "active");

      if (activeJobsError) {
        throw activeJobsError;
      }

      // =========================
      // TOTAL APPLICATIONS
      // =========================

      const {
        count: totalApplications,
        error: applicationsError,
      } = await supabase
        .from("applications")
        .select("*", {
          count: "exact",
          head: true,
        });

      if (applicationsError) {
        throw applicationsError;
      }

      // =========================
      // TOTAL USERS
      // =========================

      const { count: totalUsers, error: usersError } =
        await supabase
          .from("profiles")
          .select("*", {
            count: "exact",
            head: true,
          })
          .eq("role", "user");

      if (usersError) {
        throw usersError;
      }

      // =========================
      // RECENT JOBS
      // =========================

      const { data: jobs, error: recentJobsError } =
        await supabase
          .from("jobs")
          .select(
            "id, title, company, location, job_type, status, created_at"
          )
          .order("created_at", {
            ascending: false,
          })
          .limit(5);

      if (recentJobsError) {
        throw recentJobsError;
      }

      // =========================
      // RECENT APPLICATIONS
      // =========================

      const {
        data: applications,
        error: recentApplicationsError,
      } = await supabase
        .from("applications")
        .select(`
          id,
          applied_at,
          job_id,
          jobs (
            id,
            title,
            company
          ),
          profiles:user_id (
            full_name,
            email
          )
        `)
        .order("applied_at", {
          ascending: false,
        })
        .limit(5);

      if (recentApplicationsError) {
        throw recentApplicationsError;
      }

      // =========================
      // UPDATE STATE
      // =========================

      setStats({
        totalJobs: totalJobs || 0,
        activeJobs: activeJobs || 0,
        totalApplications: totalApplications || 0,
        totalUsers: totalUsers || 0,
      });

      setRecentJobs(jobs || []);
      setRecentApplications(applications || []);
    } catch (error) {
      console.error(
        "Dashboard loading error:",
        error
      );

      setError(
        error.message ||
          "Unable to load dashboard data."
      );
    }

    setLoading(false);
  }

  async function handleLogout() {
    await logout();
  }

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-container">

          <div className="admin-loading">
            <h2>Loading Dashboard...</h2>
            <p>Please wait.</p>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-container">

        {/* =========================
            HEADER
        ========================= */}

        <div className="admin-header">

          <div>
            <h1>
              Admin Dashboard
            </h1>

            <p>
              Welcome,{" "}
              {profile?.full_name || user?.email}
            </p>
          </div>

          <div className="admin-header-actions">

            <Link
              to="/jobs"
              className="admin-secondary-button"
            >
              View Website
            </Link>

            <button
              className="logout-button"
              onClick={handleLogout}
            >
              Logout
            </button>

          </div>

        </div>

        {/* =========================
            ERROR
        ========================= */}

        {error && (
          <div className="error-message">

            <h3>
              Dashboard Error
            </h3>

            <p>
              {error}
            </p>

            <button onClick={loadDashboard}>
              Try Again
            </button>

          </div>
        )}

        {/* =========================
            STAT CARDS
        ========================= */}

        {!error && (
          <div className="dashboard-stats">

            <div className="dashboard-stat-card">
              <span>Total Jobs</span>

              <strong>
                {stats.totalJobs}
              </strong>

              <small>
                All posted jobs
              </small>
            </div>

            <div className="dashboard-stat-card">
              <span>Active Jobs</span>

              <strong>
                {stats.activeJobs}
              </strong>

              <small>
                Currently visible
              </small>
            </div>

            <div className="dashboard-stat-card">
              <span>Applications</span>

              <strong>
                {stats.totalApplications}
              </strong>

              <small>
                Total applications
              </small>
            </div>

            <div className="dashboard-stat-card">
              <span>Users</span>

              <strong>
                {stats.totalUsers}
              </strong>

              <small>
                Registered users
              </small>
            </div>

          </div>
        )}

        {/* =========================
            QUICK ACTIONS
        ========================= */}

        <div className="dashboard-section">

          <div className="dashboard-section-header">

            <div>
              <h2>
                Quick Actions
              </h2>

              <p>
                Manage your job portal.
              </p>
            </div>

          </div>

          <div className="dashboard-actions">

            <Link
              to="/admin/jobs/new"
              className="dashboard-action-card"
            >
              <span className="dashboard-action-icon">
                +
              </span>

              <div>
                <h3>
                  Add New Job
                </h3>

                <p>
                  Post a new job opportunity.
                </p>
              </div>
            </Link>

            <Link
              to="/admin/jobs"
              className="dashboard-action-card"
            >
              <span className="dashboard-action-icon">
                J
              </span>

              <div>
                <h3>
                  Manage Jobs
                </h3>

                <p>
                  Edit, close or delete jobs.
                </p>
              </div>
            </Link>

            <Link
              to="/admin/applications"
              className="dashboard-action-card"
            >
              <span className="dashboard-action-icon">
                A
              </span>

              <div>
                <h3>
                  Applications
                </h3>

                <p>
                  View submitted applications.
                </p>
              </div>
            </Link>

            <Link
              to="/admin/analytics"
              className="dashboard-action-card"
            >
              <span className="dashboard-action-icon">
                ↗
              </span>

              <div>
                <h3>
                  Analytics
                </h3>

                <p>
                  View portal performance.
                </p>
              </div>
            </Link>

          </div>

        </div>

        {/* =========================
            RECENT JOBS
        ========================= */}

        <div className="dashboard-section">

          <div className="dashboard-section-header">

            <div>
              <h2>
                Recent Jobs
              </h2>

              <p>
                Latest jobs added to the portal.
              </p>
            </div>

            <Link
              to="/admin/jobs"
              className="dashboard-view-all"
            >
              View All
            </Link>

          </div>

          {recentJobs.length === 0 ? (
            <div className="dashboard-empty">
              <p>
                No jobs have been posted yet.
              </p>

              <Link
                to="/admin/jobs/new"
                className="view-job-button"
              >
                Add First Job
              </Link>
            </div>
          ) : (
            <div className="recent-items">

              {recentJobs.map((job) => (
                <div
                  className="recent-job-item"
                  key={job.id}
                >

                  <div>

                    <h3>
                      {job.title}
                    </h3>

                    <p>
                      {job.company}
                    </p>

                    <small>
                      📍{" "}
                      {job.location ||
                        "Location not specified"}
                    </small>

                  </div>

                  <div className="recent-job-right">

                    <span
                      className={
                        job.status === "active"
                          ? "job-status-active"
                          : "job-status-closed"
                      }
                    >
                      {job.status}
                    </span>

                    <Link
                      to={`/admin/jobs/edit/${job.id}`}
                      className="dashboard-edit-link"
                    >
                      Edit
                    </Link>

                  </div>

                </div>
              ))}

            </div>
          )}

        </div>

        {/* =========================
            RECENT APPLICATIONS
        ========================= */}

        <div className="dashboard-section">

          <div className="dashboard-section-header">

            <div>
              <h2>
                Recent Applications
              </h2>

              <p>
                Latest applications received.
              </p>
            </div>

            <Link
              to="/admin/applications"
              className="dashboard-view-all"
            >
              View All
            </Link>

          </div>

          {recentApplications.length === 0 ? (
            <div className="dashboard-empty">

              <p>
                No applications have been received yet.
              </p>

            </div>
          ) : (
            <div className="recent-items">

              {recentApplications.map(
                (application) => {

                  const applicant =
                    application.profiles;

                  const job =
                    application.jobs;

                  return (
                    <div
                      className="recent-application-item"
                      key={application.id}
                    >

                      <div>

                        <h3>
                          {applicant?.full_name ||
                            "User"}
                        </h3>

                        <p>
                          {applicant?.email ||
                            "Email unavailable"}
                        </p>

                      </div>

                      <div>

                        <strong>
                          {job?.title ||
                            "Job unavailable"}
                        </strong>

                        <p>
                          {job?.company ||
                            ""}
                        </p>

                      </div>

                      <small>
                        {new Date(
                          application.applied_at
                        ).toLocaleDateString()}
                      </small>

                    </div>
                  );
                }
              )}

            </div>
          )}

        </div>

      </div>
    </div>
  );
}

export default Dashboard;