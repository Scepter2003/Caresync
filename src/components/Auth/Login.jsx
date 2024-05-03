import React, { useRef, useState } from "react";
import { useAuth } from "../Contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

const Login = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        emailRef.current.value,
        passwordRef.current.value
      );
      const user = userCredential.user;
      if (new RegExp(/@admin\.caresync\.com$/).test(user.email)) {
        // If the user is an admin, redirect to the admin page
        navigate("/admi");
      }
      else if (new RegExp(/@admin.com$/).test(user.email)){
        navigate("/admi1");
      }
      else if(new RegExp(/@news\.caresync\.com$/).test(user.email)){
        navigate("/addnewss")
      }
      else if (new RegExp(/@doc\.caresync\.com$/).test(user.email)) {
        // If the user's email ends with "@doc.caresync.com", redirect to the doctors page
        navigate("/doctpage");
      } else if (new RegExp(/@pharma\.caresync\.com$/).test(user.email)) {
        // If the user's email ends with "@doc.caresync.com", redirect to the doctors page
        navigate("/pharhome");
      }else {
        // If the user is not an admin, redirect to the home page
        navigate("/");
      }
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  }

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: " center",
        justifyContent: "center",
        flexDirection: "column",
        backgroundImage: `url(/hosp.png)`,
      }}
    >
      <div
        style={{
          margin: "10%",
          width: "30%",
          height: "50%",
          padding: "2%,",
          backgroundColor: "rgba(112, 166, 189, 0.5)",
          backdropFilter: "blur(2px)",
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          WebkitAlignItems: "center",
          borderRadius: "7%",
          gap: "8%",
        }}
      >
        <h2>Log In</h2>
        {error && <p>{error}</p>}
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            alignItems: " center",
            justifyContent: "center",
            flexDirection: "column",
            gap: "20%",
          }}
        >
          <div className="form-group">
            <input
              type="email"
              ref={emailRef}
              required
              placeholder="Email/Login-Id"
              style={{ height: "100%" }}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              ref={passwordRef}
              required
              placeholder="Enter Password"
              style={{ height: "100%" }}
            />
          </div>
          <button
            disabled={loading}
            className="btn btn-primary w-100"
            type="submit"
            style={{
              padding: "0.5rem 1rem",
              fontSize: "1rem",
              borderRadius: "0.25rem",
              border: "none",
              backgroundColor: "#4CAF50",
              color: "white",
              cursor: "pointer",
            }}
          >
            Log In
          </button>
        </form>
        <div>
          <Link to="/forgot-password">Forgot Password?</Link>
        </div>
        <div className="text-center mt-2">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
