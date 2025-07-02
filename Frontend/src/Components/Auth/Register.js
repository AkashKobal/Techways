import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "../../assets/css/authentication.css";

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "USER"
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, email, password, role } = formData;
        try {
            const response = await axios.post("http://localhost:8080/auth/register", {
                name, email, password, role
            });

            const { statusCode, message } = response.data;

            switch (statusCode) {
                case 201:
                    setSuccess("Successfully registered! Redirecting to login...");
                    setTimeout(() => navigate("/auth/login"), 2000);
                    break;

                case 409:
                    setError("Email already registered.");
                    break;

                case 400:
                    setError("Invalid input. Please check all fields.");
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


    const handleGoogleOAuth = () => {
        // Redirect to your Google OAuth route (e.g., Firebase/Auth0/backend)
        window.location.href = "/auth/google";
    };

    const handleMicrosoftOAuth = () => {
        // Redirect to your Microsoft OAuth route
        window.location.href = "/auth/microsoft";
    };

    return (
        <section className="register-section">
            <div className="register-container">
                <h2 className="register-title">Create an Account</h2>

                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}

                <form onSubmit={handleSubmit} className="register-form">
                    <div className="form-group">
                        <label htmlFor="name" className="form-label">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email" className="form-label">Email</label>
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

                    <button type="submit" className="register-button">Register</button>
                </form>

                <div className="separator">or</div>

                <div className="oauth-buttons">
                    <button onClick={handleGoogleOAuth} className="oauth-btn">
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" />
                        <span>Continue with Google</span>
                    </button>

                    <button onClick={handleMicrosoftOAuth} className="oauth-btn">
                        <img src="https://img.icons8.com/?size=100&id=22989&format=png&color=000000" alt="Microsoft" />
                        <span>Continue with Microsoft</span>
                    </button>
                </div>

                <p className="redirect-link">
                    Already have an account?{" "}
                    <Link to="/auth/login">Login</Link>
                </p>
            </div>
        </section>

    );
};

export default Register;
