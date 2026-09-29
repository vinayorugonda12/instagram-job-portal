import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

function Analytics() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [stats, setStats] = useState({
    visitors: 0,
    jobViews: 0,
    applyClicks: 0,
    registeredUsers: 0,
  });

  const [jobStats, setJobStats] = useState([]);

  useEffect(() => {
    loadAnalytics();
  }, []);

  async function loadAnalytics() {
    setLoading(true);
    setError("");

    try {
      // --------------------------------
      // 1. Check logged-in user
      // --------------------------------

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      console.log("Logged in user:", user);
      console.log("User error:", userError);

      if (userError) {
        throw new Error(
          "Unable to get logged-in user: " + userError.message
        );
      }

      if (!user) {
        throw new Error(
          "You are not logged in. Please login as admin first."
        );
      }

      // --------------------------------
      // 2. Get current user's profile
      // --------------------------------

      const {
        data: profile,
        error: profileError,
      } = await supabase
        .from("profiles")
        .select("id, email, role")
        .eq("id", user.id)
        .single();

      console.log("Admin profile:", profile);
      console.log("Profile error:", profileError);

      if (profileError) {
        throw new Error(
          "Could not load profile: " + profileError.message
        );
      }

      if (profile.role !== "admin") {
        throw new Error(
          `This account has role "${profile.role}", not "admin".`
        );
      }

      // --------------------------------
      // 3. Get analytics events
      // --------------------------------

      const {
        data: events,
        error: eventsError,
      } = await supabase
        .from("analytics_events")
        .select(
          "id, event_type, job_id, session_id, created_at"
        )
        .order("created_at", {
          ascending: false,
        });

      console.log("Analytics events:", events);
      console.log("Analytics error:", eventsError);

      if (eventsError) {
        throw new Error(
          "Could not load analytics: " +
            eventsError.message
        );
      }

      // --------------------------------
      // 4. Get registered users
      // --------------------------------

      const {
        count: userCount,
        error: usersError,
      } = await supabase
        .from("profiles")
        .select("id", {
          count: "exact",
          head: true,
        });

      console.log("User count:", userCount);
      console.log("Users error:", usersError);

      if (usersError) {
        throw new Error(
          "Could not count users: " +
            usersError.message
        );
      }

      // --------------------------------
      // 5. Calculate statistics
      // --------------------------------

      const uniqueSessions = new Set();

      let jobViews = 0;
      let applyClicks = 0;

      events.forEach((event) => {
        if (
          event.event_type === "PAGE_VIEW" &&
          event.session_id
        ) {
          uniqueSessions.add(event.session_id);
        }

        if (event.event_type === "JOB_VIEW") {
          jobViews++;
        }

        if (event.event_type === "APPLY_CLICK") {
          applyClicks++;
        }
      });

      setStats({
        visitors: uniqueSessions.size,
        jobViews,
        applyClicks,
        registeredUsers: userCount || 0,
      });

      // --------------------------------
      // 6. Get jobs
      // --------------------------------

      const {
        data: jobs,
        error: jobsError,
      } = await supabase
        .from("jobs")
        .select("id, title, company")
        .order("created_at", {
          ascending: false,
        });

      console.log("Jobs:", jobs);
      console.log("Jobs error:", jobsError);

      if (jobsError) {
        throw new Error(
          "Could not load jobs: " +
            jobsError.message
        );
      }

      // --------------------------------
      // 7. Calculate per-job analytics
      // --------------------------------

      const calculatedJobStats = jobs.map((job) => {
        const views = events.filter(
          (event) =>
            event.event_type === "JOB_VIEW" &&
            Number(event.job_id) === Number(job.id)
        ).length;

        const clicks = events.filter(
          (event) =>
            event.event_type === "APPLY_CLICK" &&
            Number(event.job_id) === Number(job.id)
        ).length;

        return {
          ...job,
          views,
          clicks,
        };
      });

      setJobStats(calculatedJobStats);

    } catch (err) {
      console.error("ANALYTICS FAILED:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div style={styles.page}>
        <h1>Analytics</h1>
        <p>Loading analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.page}>
        <h1>Analytics</h1>

        <div style={styles.error}>
          <h2>Analytics Error</h2>

          <p>{error}</p>

          <button
            onClick={loadAnalytics}
            style={styles.button}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>

      <div style={styles.header}>
        <div>
          <h1>Analytics</h1>
          <p>
            Monitor your website and job performance.
          </p>
        </div>

        <button
          onClick={loadAnalytics}
          style={styles.button}
        >
          Refresh
        </button>
      </div>

      <div style={styles.statsGrid}>

        <div style={styles.card}>
          <p>Visitors</p>
          <h2>{stats.visitors}</h2>
        </div>

        <div style={styles.card}>
          <p>Job Views</p>
          <h2>{stats.jobViews}</h2>
        </div>

        <div style={styles.card}>
          <p>Apply Clicks</p>
          <h2>{stats.applyClicks}</h2>
        </div>

        <div style={styles.card}>
          <p>Registered Users</p>
          <h2>{stats.registeredUsers}</h2>
        </div>

      </div>

      <div style={styles.section}>

        <h2>Job Performance</h2>

        {jobStats.length === 0 ? (
          <p>No jobs found.</p>
        ) : (
          <table style={styles.table}>

            <thead>
              <tr>
                <th style={styles.th}>Job</th>
                <th style={styles.th}>Company</th>
                <th style={styles.th}>Views</th>
                <th style={styles.th}>Apply Clicks</th>
              </tr>
            </thead>

            <tbody>

              {jobStats.map((job) => (
                <tr key={job.id}>

                  <td style={styles.td}>
                    {job.title}
                  </td>

                  <td style={styles.td}>
                    {job.company}
                  </td>

                  <td style={styles.td}>
                    {job.views}
                  </td>

                  <td style={styles.td}>
                    {job.clicks}
                  </td>

                </tr>
              ))}

            </tbody>

          </table>
        )}

      </div>

    </div>
  );
}

const styles = {
  page: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "40px 20px",
    fontFamily: "Arial, sans-serif",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    marginBottom: "40px",
  },

  card: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "25px",
  },

  section: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "25px",
  },

  button: {
    padding: "10px 18px",
    border: "none",
    borderRadius: "8px",
    background: "#111827",
    color: "white",
    cursor: "pointer",
  },

  error: {
    padding: "25px",
    background: "#fff1f2",
    border: "1px solid #fecdd3",
    borderRadius: "12px",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
  },

  th: {
    textAlign: "left",
    padding: "15px",
    borderBottom: "2px solid #e5e7eb",
  },

  td: {
    padding: "15px",
    borderBottom: "1px solid #e5e7eb",
  },
};

export default Analytics;