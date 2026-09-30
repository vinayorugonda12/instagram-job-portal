import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";

function AddJob() {
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
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setMessageType("");

    try {
      const { error } = await supabase
        .from("jobs")
        .insert([
          {
            title: form.title.trim(),
            company: form.company.trim(),
            location: form.location.trim(),
            job_type: form.job_type.trim(),
            salary: form.salary.trim(),
            description: form.description.trim(),
            requirements: form.requirements.trim(),
            application_url: form.application_url.trim(),
            status: "active",
          },
        ]);

      if (error) {
        console.error("Job posting error:", error);

        setMessage(error.message);
        setMessageType("error");

        setLoading(false);
        return;
      }

      setMessage("Job posted successfully!");
      setMessageType("success");

      setForm({
        title: "",
        company: "",
        location: "",
        job_type: "",
        salary: "",
        description: "",
        requirements: "",
        application_url: "",
      });

      setTimeout(() => {
        navigate("/admin/jobs");
      }, 1000);
    } catch (error) {
      console.error("Unexpected job posting error:", error);

      setMessage(
        error.message ||
          "Unable to post the job. Please try again."
      );

      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-container">

        {/* =========================
            PAGE HEADER
        ========================= */}

        <div className="admin-header">
          <div>
            <h1>Add New Job</h1>

            <p>
              Create and publish a new opportunity
              on JavaDebugged Job Portal.
            </p>
          </div>

          <div className="admin-header-actions">
            <button
              type="button"
              className="admin-secondary-button"
              onClick={() => navigate("/admin/dashboard")}
            >
              Dashboard
            </button>

            <button
              type="button"
              className="admin-secondary-button"
              onClick={() => navigate("/admin/jobs")}
            >
              Manage Jobs
            </button>
          </div>
        </div>

        {/* =========================
            JOB FORM
        ========================= */}

        <form
          className="admin-form"
          onSubmit={handleSubmit}
        >

          {/* JOB TITLE */}

          <div className="admin-form-group">
            <label htmlFor="title">
              Job Title
            </label>

            <input
              id="title"
              name="title"
              type="text"
              placeholder="Example: Java Developer"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          {/* COMPANY */}

          <div className="admin-form-group">
            <label htmlFor="company">
              Company
            </label>

            <input
              id="company"
              name="company"
              type="text"
              placeholder="Example: Accenture"
              value={form.company}
              onChange={handleChange}
              required
            />
          </div>

          {/* LOCATION */}

          <div className="admin-form-group">
            <label htmlFor="location">
              Location
            </label>

            <input
              id="location"
              name="location"
              type="text"
              placeholder="Example: Hyderabad, Telangana"
              value={form.location}
              onChange={handleChange}
            />
          </div>

          {/* JOB TYPE */}

          <div className="admin-form-group">
            <label htmlFor="job_type">
              Job Type
            </label>

            <input
              id="job_type"
              name="job_type"
              type="text"
              placeholder="Example: Full Time / Internship / Contract"
              value={form.job_type}
              onChange={handleChange}
            />
          </div>

          {/* SALARY */}

          <div className="admin-form-group">
            <label htmlFor="salary">
              Salary / Package
            </label>

            <input
              id="salary"
              name="salary"
              type="text"
              placeholder="Example: 4.5 LPA"
              value={form.salary}
              onChange={handleChange}
            />
          </div>

          {/* DESCRIPTION */}

          <div className="admin-form-group">
            <label htmlFor="description">
              Job Description
            </label>

            <textarea
              id="description"
              name="description"
              placeholder="Enter the complete job description..."
              value={form.description}
              onChange={handleChange}
              rows={7}
            />
          </div>

          {/* REQUIREMENTS */}

          <div className="admin-form-group">
            <label htmlFor="requirements">
              Requirements
            </label>

            <textarea
              id="requirements"
              name="requirements"
              placeholder="Enter skills, qualifications and requirements..."
              value={form.requirements}
              onChange={handleChange}
              rows={7}
            />
          </div>

          {/* APPLICATION URL */}

          <div className="admin-form-group">
            <label htmlFor="application_url">
              Application URL
            </label>

            <input
              id="application_url"
              name="application_url"
              type="url"
              placeholder="https://example.com/apply"
              value={form.application_url}
              onChange={handleChange}
              required
            />

            <small className="admin-form-help">
              Applicants will be redirected to this
              link when they click Apply Now.
            </small>
          </div>

          {/* MESSAGE */}

          {message && (
            <div
              className={
                messageType === "success"
                  ? "admin-success-message"
                  : "admin-error-message"
              }
            >
              {message}
            </div>
          )}

          {/* ACTIONS */}

          <div className="admin-form-actions">

            <button
              type="submit"
              className="admin-submit-button"
              disabled={loading}
            >
              {loading
                ? "Posting Job..."
                : "Publish Job"}
            </button>

            <button
              type="button"
              className="admin-cancel-button"
              onClick={() =>
                navigate("/admin/jobs")
              }
              disabled={loading}
            >
              Cancel
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}

export default AddJob;