import React, { useState } from "react";
import { Link } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase/firebase";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setMessage("");
      setError("");
      setLoading(true);
      await sendPasswordResetEmail(auth, email);
      setMessage("Check your inbox for further instructions");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2 className="text-center mb-4">Password Reset</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button disabled={loading} className="btn btn-primary w-100" type="submit">
          Reset Password
        </button>
      </form>
      <div className="text-center mt-3">
        <Link to="/login">Login</Link>
      </div>
      <div className="text-center mt-2">
        Need an account? <Link to="/signup">Sign Up</Link>
      </div>
    </div>
  );
};

export default ForgotPassword;