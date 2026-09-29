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

    const { error } = await supabase
      .from("jobs")
      .insert([
        {
          title: form.title,
          company: form.company,
          location: form.location,
          job_type: form.job_type,
          salary: form.salary,
          description: form.description,
          requirements: form.requirements,
          application_url: form.application_url,
          status: "active",
        },
      ]);

    if (error) {
      console.error(error);
      setMessage(error.message);
    } else {
      setMessage("Job posted successfully!");

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
    }

    setLoading(false);
  }

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "40px auto",
        padding: "20px",
      }}
    >
      <h1>Add New Job</h1>

      <form onSubmit={handleSubmit}>

        <input
          name="title"
          placeholder="Job Title"
          value={form.title}
          onChange={handleChange}
          required
        />

        <br />
        <br />

        <input
          name="company"
          placeholder="Company"
          value={form.company}
          onChange={handleChange}
          required
        />

        <br />
        <br />

        <input
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
        />

        <br />
        <br />

        <input
          name="job_type"
          placeholder="Job Type - Full Time / Internship"
          value={form.job_type}
          onChange={handleChange}
        />

        <br />
        <br />

        <input
          name="salary"
          placeholder="Salary / Package"
          value={form.salary}
          onChange={handleChange}
        />

        <br />
        <br />

        <textarea
          name="description"
          placeholder="Job Description"
          value={form.description}
          onChange={handleChange}
          rows="6"
        />

        <br />
        <br />

        <textarea
          name="requirements"
          placeholder="Requirements"
          value={form.requirements}
          onChange={handleChange}
          rows="6"
        />

        <br />
        <br />

        <input
          name="application_url"
          type="url"
          placeholder="Application URL"
          value={form.application_url}
          onChange={handleChange}
          required
        />

        <br />
        <br />

        <button type="submit" disabled={loading}>
          {loading ? "Posting..." : "Post Job"}
        </button>
      </form>

      {message && (
        <p style={{ marginTop: "20px" }}>
          {message}
        </p>
      )}
    </div>
  );
}

export default AddJob;