import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import axios from "axios";
import showErrorToast from "../utils/toastError";
import { api } from "../constants/api";

function LoginPage({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [msgError, setMgsError] = useState("");

  const validate = () => {
    let valid = true;
    const newErrors = { email: "", password: "" };

    if (!email) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
      valid = false;
    }

    if (!password) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleRequest = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await api.post("auth/login", {
        email,
        password,
      });

      setUser(response.data);
      localStorage.setItem("user", JSON.stringify(response.data));
    } catch (error) {
  
      showErrorToast("Login failed. Please check your credentials." +
          error.response.data.message);
    }
  };

  return (
    <div className="container-fluid p-3 my-5">
      <div className="row align-items-center">
        <div className="col-md-6 mb-4">
          <img
            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
            className="img-fluid"
            alt="Sample"
          />
        </div>

        <div className="col-md-6">
          <form onSubmit={handleRequest}>
            <div className="form-floating mb-4">
              <input
                type="email"
                className={`form-control ${errors.email && "is-invalid"}`}
                id="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label htmlFor="email">Email address</label>
              {errors.email && (
                <div className="invalid-feedback">{errors.email}</div>
              )}
            </div>

            <div className="form-floating mb-4">
              <input
                type="password"
                className={`form-control ${errors.password && "is-invalid"}`}
                id="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label htmlFor="password">Password</label>
              {errors.password && (
                <div className="invalid-feedback">{errors.password}</div>
              )}
            </div>

            <div className="d-flex justify-content-between mb-4">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="remember"
                />
                <label className="form-check-label" htmlFor="remember">
                  Remember me
                </label>
              </div>
              <Link to="/forgot-password">Forgot password?</Link>
            </div>

            <div className="text-center text-md-start mt-4 pt-2">
              <button
                type="submit"
                className="btn btn-primary px-5"
                disabled={!email || !password}
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
