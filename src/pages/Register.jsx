import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(e) {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          full_name: fullName.trim(),
        },
      },
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage(
        "Registration successful. Please check your email to verify your account."
      );
    }

    setLoading(false);
  }

  return (
    <div className="auth-page">
      <div className="auth-container">

        <h1>Create Account</h1>

        <p>
          Create your account to discover the latest job opportunities.
        </p>

        <form onSubmit={handleRegister} className="auth-form">

          <label>
            Full Name

            <input
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </label>

          <label>
            Email

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label>
            Password

            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </label>

          <button type="submit" disabled={loading}>
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        {message && (
          <p className="auth-link">
            {message}
          </p>
        )}

        <div className="auth-link">
          Already have an account?{" "}
          <Link to="/login">
            Login
          </Link>
        </div>

        <div className="auth-link">
          <Link to="/jobs">
            ← Browse Jobs
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Register;