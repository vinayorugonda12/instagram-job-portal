import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";

function ManageJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadJobs();
  }, []);

  async function loadJobs() {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setError(error.message);
    } else {
      setJobs(data || []);
    }

    setLoading(false);
  }

  async function toggleJobStatus(job) {
    setMessage("");
    setError("");

    const newStatus =
      job.status === "active" ? "closed" : "active";

    const { error } = await supabase
      .from("jobs")
      .update({
        status: newStatus,
      })
      .eq("id", job.id);

    if (error) {
      console.error(error);
      setError(error.message);
      return;
    }

    setMessage(
      newStatus === "active"
        ? "Job reopened successfully."
        : "Job closed successfully."
    );

    loadJobs();
  }

  async function deleteJob(job) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${job.title}"?`
    );

    if (!confirmed) {
      return;
    }

    setMessage("");
    setError("");

    const { error } = await supabase
      .from("jobs")
      .delete()
      .eq("id", job.id);

    if (error) {
      console.error(error);
      setError(error.message);
      return;
    }

    setMessage("Job deleted successfully.");

    loadJobs();
  }

  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-container">
          <div className="admin-loading">
            <h2>Loading Jobs...</h2>
            <p>Please wait while the jobs are loaded.</p>
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
            <h1>Manage Jobs</h1>

            <p>
              Add, edit, close, reopen or delete your jobs.
            </p>
          </div>

          <div className="admin-header-actions">
            <Link
              to="/admin/jobs/new"
              className="admin-submit-button"
            >
              + Add New Job
            </Link>
          </div>
        </div>

        {/* =========================
            SUCCESS MESSAGE
        ========================= */}

        {message && (
          <div className="success-message">
            {message}
          </div>
        )}

        {/* =========================
            ERROR MESSAGE
        ========================= */}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* =========================
            EMPTY STATE
        ========================= */}

        {jobs.length === 0 ? (
          <div className="dashboard-section">
            <div className="dashboard-empty">
              <h2>No jobs found</h2>

              <p>
                Start by posting your first job.
              </p>

              <Link
                to="/admin/jobs/new"
                className="admin-submit-button"
              >
                + Add New Job
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* =========================
                JOB COUNT
            ========================= */}

            <div className="admin-summary-card">
              <span>Total Jobs</span>

              <strong>
                {jobs.length}
              </strong>
            </div>

            {/* =========================
                JOB LIST
            ========================= */}

            <div className="admin-job-list">

              {jobs.map((job) => (
                <div
                  className="admin-job-card"
                  key={job.id}
                >

                  {/* =========================
                      JOB INFORMATION
                  ========================= */}

                  <div className="admin-job-info">

                    <div className="job-title-row">

                      <h2>
                        {job.title}
                      </h2>

                      <span
                        className={
                          job.status === "active"
                            ? "job-status-active"
                            : "job-status-closed"
                        }
                      >
                        {job.status === "active"
                          ? "Active"
                          : "Closed"}
                      </span>

                    </div>

                    <p className="company">
                      {job.company}
                    </p>

                    <div className="admin-job-meta">

                      <p>
                        📍{" "}
                        {job.location ||
                          "Location not specified"}
                      </p>

                      <p>
                        💼{" "}
                        {job.job_type ||
                          "Job type not specified"}
                      </p>

                      {job.salary && (
                        <p>
                          💰 {job.salary}
                        </p>
                      )}

                    </div>

                    <p className="posted-date">
                      Posted:{" "}
                      {new Date(
                        job.created_at
                      ).toLocaleDateString()}
                    </p>

                  </div>

                  {/* =========================
                      ACTIONS
                  ========================= */}

                  <div className="admin-job-actions">

                    <Link
                      to={`/admin/jobs/edit/${job.id}`}
                      className="edit-button"
                    >
                      Edit
                    </Link>

                    <button
                      type="button"
                      onClick={() =>
                        toggleJobStatus(job)
                      }
                      className="status-button"
                    >
                      {job.status === "active"
                        ? "Close"
                        : "Reopen"}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        deleteJob(job)
                      }
                      className="delete-button"
                    >
                      Delete
                    </button>

                  </div>

                </div>
              ))}

            </div>
          </>
        )}

      </div>
    </div>
  );
}

export default ManageJobs;