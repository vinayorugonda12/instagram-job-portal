import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

function Jobs() {
  const { user, profile, logout } = useAuth();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [jobTypeFilter, setJobTypeFilter] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  // Coming Soon popup
  const [showComingSoon, setShowComingSoon] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  async function fetchJobs() {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: false });

    console.log("Jobs:", data);
    console.log("Jobs error:", error);

    if (error) {
      console.error("Job fetch error:", error);
      setError("Unable to load jobs. Please try again.");
      setLoading(false);
      return;
    }

    setJobs(data || []);
    setLoading(false);
  }

  async function handleLogout() {
    await logout();
  }

  // Get unique locations
  const locations = useMemo(() => {
    return [
      ...new Set(
        jobs
          .map((job) => job.location)
          .filter(
            (location) =>
              location && location.trim() !== ""
          )
      ),
    ].sort();
  }, [jobs]);

  // Get unique job types
  const jobTypes = useMemo(() => {
    return [
      ...new Set(
        jobs
          .map((job) => job.job_type)
          .filter(
            (jobType) =>
              jobType && jobType.trim() !== ""
          )
      ),
    ].sort();
  }, [jobs]);

  // Search + filter + sort
  const filteredJobs = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    const result = jobs.filter((job) => {
      const matchesSearch =
        !searchText ||
        job.title?.toLowerCase().includes(searchText) ||
        job.company?.toLowerCase().includes(searchText) ||
        job.description?.toLowerCase().includes(searchText) ||
        job.requirements?.toLowerCase().includes(searchText);

      const matchesLocation =
        !locationFilter ||
        job.location === locationFilter;

      const matchesJobType =
        !jobTypeFilter ||
        job.job_type === jobTypeFilter;

      return (
        matchesSearch &&
        matchesLocation &&
        matchesJobType
      );
    });

    // Sorting
    result.sort((a, b) => {
      if (sortBy === "newest") {
        return (
          new Date(b.created_at) -
          new Date(a.created_at)
        );
      }

      if (sortBy === "oldest") {
        return (
          new Date(a.created_at) -
          new Date(b.created_at)
        );
      }

      if (sortBy === "title-asc") {
        return (a.title || "").localeCompare(
          b.title || ""
        );
      }

      if (sortBy === "title-desc") {
        return (b.title || "").localeCompare(
          a.title || ""
        );
      }

      return 0;
    });

    return result;
  }, [
    jobs,
    search,
    locationFilter,
    jobTypeFilter,
    sortBy,
  ]);

  function clearFilters() {
    setSearch("");
    setLocationFilter("");
    setJobTypeFilter("");
    setSortBy("newest");
  }

  const hasFilters =
    search ||
    locationFilter ||
    jobTypeFilter ||
    sortBy !== "newest";

  return (
    <div className="jobs-page">
      <div className="jobs-container">

        {/* =========================
            NAVIGATION
        ========================= */}

        <div className="jobs-nav">

          <div className="nav-brand">
            <Link to="/jobs">
              <span className="brand-title">
                Job Portal
              </span>

              <span className="brand-separator">
                •
              </span>

              <span className="brand-company">
                JavaDebugged
              </span>
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
                  onClick={() =>
                    setShowComingSoon(true)
                  }
                  className="login-button"
                >
                  Login
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setShowComingSoon(true)
                  }
                  className="register-button"
                >
                  Register
                </button>
              </>
            )}

          </div>

        </div>

        {/* =========================
            HEADER
        ========================= */}

        <div className="jobs-header">
          <h1>Latest Jobs</h1>

          <p>
            Find the latest job opportunities and
            start your career.
          </p>
        </div>

        {/* =========================
            SEARCH AND FILTERS
        ========================= */}

        {!loading &&
          !error &&
          jobs.length > 0 && (
            <div className="jobs-filters">

              {/* Search */}
              <div className="search-box">

                <span className="search-icon">
                  🔍
                </span>

                <input
                  type="text"
                  placeholder="Search jobs, companies, skills..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                />

              </div>

              {/* Location */}
              <select
                value={locationFilter}
                onChange={(e) =>
                  setLocationFilter(e.target.value)
                }
              >
                <option value="">
                  All Locations
                </option>

                {locations.map((location) => (
                  <option
                    key={location}
                    value={location}
                  >
                    {location}
                  </option>
                ))}
              </select>

              {/* Job Type */}
              <select
                value={jobTypeFilter}
                onChange={(e) =>
                  setJobTypeFilter(e.target.value)
                }
              >
                <option value="">
                  All Job Types
                </option>

                {jobTypes.map((jobType) => (
                  <option
                    key={jobType}
                    value={jobType}
                  >
                    {jobType}
                  </option>
                ))}
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value)
                }
              >
                <option value="newest">
                  Newest First
                </option>

                <option value="oldest">
                  Oldest First
                </option>

                <option value="title-asc">
                  Title A–Z
                </option>

                <option value="title-desc">
                  Title Z–A
                </option>
              </select>

              {/* Clear Filters */}
              {hasFilters && (
                <button
                  className="clear-filters-button"
                  onClick={clearFilters}
                >
                  Clear Filters
                </button>
              )}

            </div>
          )}

        {/* =========================
            RESULT COUNT
        ========================= */}

        {!loading &&
          !error &&
          jobs.length > 0 && (
            <div className="jobs-result-info">
              <p>
                Showing{" "}
                <strong>
                  {filteredJobs.length}
                </strong>{" "}
                {filteredJobs.length === 1
                  ? "job"
                  : "jobs"}
              </p>
            </div>
          )}

        {/* =========================
            LOADING
        ========================= */}

        {loading && (
          <div className="no-jobs">
            <h2>Loading jobs...</h2>

            <p>
              Please wait while we load the
              latest opportunities.
            </p>
          </div>
        )}

        {/* =========================
            ERROR
        ========================= */}

        {!loading && error && (
          <div className="error-message">

            <h2>Something went wrong</h2>

            <p>{error}</p>

            <br />

            <button
              onClick={fetchJobs}
              className="view-job-button"
            >
              Try Again
            </button>

          </div>
        )}

        {/* =========================
            NO JOBS
        ========================= */}

        {!loading &&
          !error &&
          jobs.length === 0 && (
            <div className="no-jobs">

              <h2>No jobs available</h2>

              <p>
                There are currently no active jobs.
                Please check again later.
              </p>

            </div>
          )}

        {/* =========================
            NO MATCHING JOBS
        ========================= */}

        {!loading &&
          !error &&
          jobs.length > 0 &&
          filteredJobs.length === 0 && (
            <div className="no-jobs">

              <h2>No matching jobs</h2>

              <p>
                Try changing your search or filters.
              </p>

              <br />

              <button
                onClick={clearFilters}
                className="view-job-button"
              >
                Clear Filters
              </button>

            </div>
          )}

        {/* =========================
            JOBS LIST
        ========================= */}

        {!loading &&
          !error &&
          filteredJobs.length > 0 && (
            <div className="jobs-grid">

              {filteredJobs.map((job) => (
                <div
                  className="job-card"
                  key={job.id}
                >

                  {/* Job Type */}
                  {job.job_type && (
                    <span className="job-type">
                      {job.job_type}
                    </span>
                  )}

                  {/* Job Title */}
                  <h2>{job.title}</h2>

                  {/* Company */}
                  <h3>{job.company}</h3>

                  {/* Location */}
                  <div className="job-meta">

                    {job.location && (
                      <p>
                        📍 {job.location}
                      </p>
                    )}

                    {job.salary && (
                      <p>
                        💰 {job.salary}
                      </p>
                    )}

                  </div>

                  {/* Description */}
                  <p className="job-description">

                    {job.description
                      ? job.description.length > 180
                        ? `${job.description.substring(
                            0,
                            180
                          )}...`
                        : job.description
                      : "No description available."}

                  </p>

                  {/* Date */}
                  <p className="job-date">

                    Posted on{" "}

                    {job.created_at
                      ? new Date(
                          job.created_at
                        ).toLocaleDateString()
                      : "N/A"}

                  </p>

                  {/* View Job */}
                  <Link
                    to={`/jobs/${job.id}`}
                    className="view-job-button"
                  >
                    View Job
                  </Link>

                </div>
              ))}

            </div>
          )}

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
              onClick={() =>
                setShowComingSoon(false)
              }
            >
              ×
            </button>

            <div className="coming-soon-icon">
              🚀
            </div>

            <h2>Coming Soon</h2>

            <p>
              Login and registration will be
              available soon. For now, you can
              browse jobs and apply directly.
            </p>

            <button
              type="button"
              className="coming-soon-button"
              onClick={() =>
                setShowComingSoon(false)
              }
            >
              Continue Browsing Jobs
            </button>

          </div>

        </div>
      )}

    </div>
  );
}

export default Jobs;