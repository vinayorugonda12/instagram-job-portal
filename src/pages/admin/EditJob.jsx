import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../lib/supabase";

function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    job_type: "",
    salary: "",
    description: "",
    requirements: "",
    application_url: "",
    status: "active",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadJob();
  }, [id]);

  async function loadJob() {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error(error);
      setError(error.message);
    } else {
      setForm({
        title: data.title || "",
        company: data.company || "",
        location: data.location || "",
        job_type: data.job_type || "",
        salary: data.salary || "",
        description: data.description || "",
        requirements: data.requirements || "",
        application_url: data.application_url || "",
        status: data.status || "active",
      });
    }

    setLoading(false);
  }

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setSaving(true);
    setError("");
    setMessage("");

    const { error } = await supabase
      .from("jobs")
      .update({
        title: form.title,
        company: form.company,
        location: form.location,
        job_type: form.job_type,
        salary: form.salary,
        description: form.description,
        requirements: form.requirements,
        application_url: form.application_url,
        status: form.status,
      })
      .eq("id", id);

    if (error) {
      console.error(error);
      setError(error.message);
    } else {
      setMessage("Job updated successfully.");

      setTimeout(() => {
        navigate("/admin/jobs");
      }, 800);
    }

    setSaving(false);
  }

  if (loading) {
    return (
      <div className="edit-job-page">
        <h1>Edit Job</h1>
        <p>Loading job...</p>
      </div>
    );
  }

  if (error && !form.title) {
    return (
      <div className="edit-job-page">
        <h1>Edit Job</h1>

        <div className="error-message">
          {error}
        </div>

        <Link to="/admin/jobs">
          ← Back to Manage Jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="edit-job-page">

      <div className="edit-job-header">
        <div>
          <Link to="/admin/jobs">
            ← Back to Manage Jobs
          </Link>

          <h1>Edit Job</h1>

          <p>
            Update the details of this job posting.
          </p>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {message && (
        <div className="success-message">
          {message}
        </div>
      )}

      <form
        className="job-form"
        onSubmit={handleSubmit}
      >

        <div className="form-group">
          <label>Job Title</label>

          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Java Developer"
            required
          />
        </div>

        <div className="form-group">
          <label>Company</label>

          <input
            name="company"
            value={form.company}
            onChange={handleChange}
            placeholder="Company name"
            required
          />
        </div>

        <div className="form-row">

          <div className="form-group">
            <label>Location</label>

            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Hyderabad"
            />
          </div>

          <div className="form-group">
            <label>Job Type</label>

            <input
              name="job_type"
              value={form.job_type}
              onChange={handleChange}
              placeholder="Full Time"
            />
          </div>

        </div>

        <div className="form-group">
          <label>Salary / Package</label>

          <input
            name="salary"
            value={form.salary}
            onChange={handleChange}
            placeholder="₹5 LPA - ₹8 LPA"
          />
        </div>

        <div className="form-group">
          <label>Job Description</label>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="8"
            placeholder="Describe the job..."
          />
        </div>

        <div className="form-group">
          <label>Requirements</label>

          <textarea
            name="requirements"
            value={form.requirements}
            onChange={handleChange}
            rows="8"
            placeholder="Java&#10;Spring Boot&#10;SQL&#10;Git"
          />
        </div>

        <div className="form-group">
          <label>Application URL</label>

          <input
            type="url"
            name="application_url"
            value={form.application_url}
            onChange={handleChange}
            placeholder="https://company.com/apply"
            required
          />
        </div>

        <div className="form-group">
          <label>Status</label>

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
          >
            <option value="active">
              Active
            </option>

            <option value="closed">
              Closed
            </option>
          </select>
        </div>

        <div className="form-actions">

          <button
            type="submit"
            disabled={saving}
            className="save-job-button"
          >
            {saving
              ? "Saving..."
              : "Update Job"}
          </button>

          <Link
            to="/admin/jobs"
            className="cancel-button"
          >
            Cancel
          </Link>

        </div>

      </form>

    </div>
  );
}

export default EditJob;