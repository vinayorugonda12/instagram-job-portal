import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";

function Applications() {
  const { user, profile, logout } = useAuth();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user && profile?.role === "admin") {
      fetchApplications();
    }
  }, [user, profile]);

  async function fetchApplications() {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("applications")
      .select(`
        id,
        applied_at,
        job_id,
        user_id,
        jobs (
          id,
          title,
          company,
          location,
          job_type
        ),
        profiles:user_id (
          full_name,
          email
        )
      `)
      .order("applied_at", { ascending: false });

    console.log("Admin applications:", data);
    console.log("Applications error:", error);

    if (error) {
      console.error(error);
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

  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-container">
          <h1>Applications</h1>
          <p>Loading applications...</p>
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
            <h1>Applications</h1>
            <p>
              View applications submitted by users.
            </p>
          </div>

          <div className="admin-header-actions">

            <Link
              to="/admin/dashboard"
              className="admin-secondary-button"
            >
              Dashboard
            </Link>

            <Link
              to="/admin/jobs"
              className="admin-secondary-button"
            >
              Manage Jobs
            </Link>

            <Link
              to="/admin/analytics"
              className="admin-secondary-button"
            >
              Analytics
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
            SUMMARY
        ========================= */}

        {!error && (
          <div className="admin-summary-card">

            <div>
              <span>Total Applications</span>
              <strong>
                {applications.length}
              </strong>
            </div>

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
              Applications submitted by users
              will appear here.
            </p>

          </div>
        )}

        {/* =========================
            APPLICATION TABLE
        ========================= */}

        {!error && applications.length > 0 && (
          <div className="applications-table-container">

            <table className="applications-table">

              <thead>
                <tr>
                  <th>Applicant</th>
                  <th>Email</th>
                  <th>Job</th>
                  <th>Company</th>
                  <th>Location</th>
                  <th>Applied Date</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>

                {applications.map((application) => {

                  const applicant =
                    application.profiles;

                  const job =
                    application.jobs;

                  return (
                    <tr key={application.id}>

                      <td>
                        {applicant?.full_name ||
                          "Name not available"}
                      </td>

                      <td>
                        {applicant?.email ||
                          "Email not available"}
                      </td>

                      <td>
                        {job?.title ||
                          "Job unavailable"}
                      </td>

                      <td>
                        {job?.company ||
                          "N/A"}
                      </td>

                      <td>
                        {job?.location ||
                          "N/A"}
                      </td>

                      <td>
                        {new Date(
                          application.applied_at
                        ).toLocaleDateString()}
                      </td>

                      <td>
                        <span className="application-status">
                          Applied
                        </span>
                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

          </div>
        )}

      </div>
    </div>
  );
}

export default Applications;