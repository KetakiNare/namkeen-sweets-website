import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Signup.css";

const Signup = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    address: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });

  // 👁 toggle states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validatePassword = (password) => {
    // 🔐 strong password rule
    const regex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
    return regex.test(password);
  };

  const handleSignup = () => {
    const { name, address, email, phone, password, confirmPassword } = form;

    if (!name || !address || !email || !phone || !password || !confirmPassword) {
      alert("Please fill all fields");
      return;
    }

    if (!validatePassword(password)) {
      alert("Password must be at least 6 characters, include 1 uppercase & 1 number");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match ❌");
      return;
    }

    axios.post("http://localhost:5000/signup", {
      name,
      address,
      email,
      phone,
      password
    })
    .then(() => {
      alert("Signup successful 🎉");
      navigate("/login");
    })
    .catch(err => console.log(err));
  };

  return (
    <div className="auth-container">

      {/* LEFT */}
      <div className="auth-left">
       <img src={process.env.PUBLIC_URL + "/login.png"} alt="login" />
      </div>

      {/* RIGHT */}
      <div className="auth-right">
        <h2>Sign Up</h2>

        <input name="name" placeholder="Full Name" onChange={handleChange} />
        <textarea name="address" placeholder="Address" onChange={handleChange} />
        <input type="email" name="email" placeholder="Email ID" onChange={handleChange} />
        <input name="phone" placeholder="Contact Number" onChange={handleChange} />

        {/* Password */}
        <div className="password-field">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            onChange={handleChange}
          />
          <span onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? "🙈" : "👁"}
          </span>
        </div>

        {/* Confirm Password */}
        <div className="password-field">
          <input
            type={showConfirm ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm Password"
            onChange={handleChange}
          />
          <span onClick={() => setShowConfirm(!showConfirm)}>
            {showConfirm ? "🙈" : "👁"}
          </span>
        </div>

        <button onClick={handleSignup}>Sign Up</button>

        <p className="bottom-text">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>

    </div>
  );
};

export default Signup;