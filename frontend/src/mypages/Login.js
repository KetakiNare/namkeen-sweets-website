import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Login.css";

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = () => {

  axios.post(
    "http://localhost:5000/login",
    form
  )

  .then((res) => {

  localStorage.setItem(
    "userId",
    res.data.id
  );


  localStorage.setItem(
    "role",
    res.data.role
  );


  localStorage.setItem(
    "name",
    res.data.name
  );


  localStorage.setItem(
    "email",
    res.data.email
  );



  if (
    res.data.role === "admin"
  ) {

    navigate(
      "/ProductList"
    );

  }

  else {

    navigate(
      "/homepage"
    );

  }

})
  .catch(() => {

    alert(
      "Invalid email or password"
    );

  });

}; // ✅ IMPORTANT FIX

  return (
    <div className="auth-container">

      {/* LEFT IMAGE */}
      <div className="auth-left">
        <img src="/login.png" alt="login" />
      </div>

      {/* RIGHT FORM */}
      <div className="auth-right">
        <h2>Login</h2>
        <p className="subtitle">Please log in to continue.</p>

        <input
          type="email"
          name="email"
          placeholder="Email Id"
          onChange={handleChange}
        />

        <div className="password-field">
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
          />
          <span>👁</span>
        </div>

        <button onClick={handleLogin}>
          Login
        </button>

        <p className="bottom-text">
          Don’t have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>

    </div>
  );
};

export default Login;