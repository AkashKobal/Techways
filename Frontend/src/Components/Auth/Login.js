import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from 'jwt-decode';
import "../../assets/css/authentication.css";


const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");



    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });

        setError(""); // Clear error on input
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { email, password } = formData;

        try {
            const response = await axios.post("http://localhost:8080/auth/login", { email, password });
            const { token, statusCode, message } = response.data;

            switch (statusCode) {
                case 200:
                    localStorage.setItem("token", token);
                    const decoded = jwtDecode(token);
                    if (decoded?.roles) {
                        localStorage.setItem("role", decoded.roles[0].authority);
                    }
                    setSuccess("Login successful! Redirecting to profile...");
                    setTimeout(() => navigate("/profile"), 2000);
                    break;

                case 401:
                    setError("Invalid email or password.");
                    break;

                case 403:
                    setError("Account not verified.");
                    break;

                case 404:
                    setError("User not found.");
                    break;

                case 500:
                    setError("Server error. Please try again later.");
                    break;

                default:
                    setError(message || "Something went wrong.");
            }
        } catch (error) {
            if (error.response && error.response.data?.message) {
                setError(error.response.data.message);
            } else {
                setError("An unexpected error occurred. Please try again.");
            }
        }
    };


    return (
        <section className="login-section">
            <div className="login-container">
                <h2 className="login-title">Login</h2>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="success-message">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="email" className="form-label">Email address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="form-input"
                        />
                    </div>

                    <div className="form-utility">
                        <label className="remember-me">
                            <input type="checkbox" />
                            Remember me
                        </label>
                        <Link to="/auth/forgot-password" className="forgot-link">Forgot password?</Link>
                    </div>

                    <button type="submit" className="login-button">Login</button>
                </form>

                <p className="register-link">
                    Don’t have an account? <Link to="/auth/register">Register here</Link>
                </p>
            </div>
        </section>

    );
};

export default Login;
