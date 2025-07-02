import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../assets/css/authentication.css";


const ForgotPassword = () => {
    const [step, setStep] = useState(1); // 1 = Email, 2 = OTP, 3 = Reset Password
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:8080/auth/email/reset-password/send-otp", { email });
            const { statusCode, message } = response.data;

            switch (statusCode) {
                case 200:
                    setMessage("OTP has been sent to your email.");
                    setStep(2);
                    break;
                case 403:
                    setError("User not verified.");
                    break;
                case 404:
                    setError("User not found.");
                    break;
                case 500:
                    setError("Server error. Please try again later.");
                    break;
                default:
                    setError(message || "Unexpected error occurred.");
            }
        } catch (err) {
            setError("Network or server error. Try again.");
        }
    };

    const handleOtpSubmit = (e) => {
        e.preventDefault();
        if (otp.length !== 6) {
            setError("OTP must be 6 digits.");
            return;
        }
        setMessage("OTP verified. Please enter your new password.");
        setStep(3);
        setError("");
    };

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        try {
            const payload = { email, otp, newPassword };
            const response = await axios.post("http://localhost:8080/auth/email/reset-password/verify-otp", payload);
            const { statusCode, message } = response.data;

            switch (statusCode) {
                case 200:
                    setMessage("Password reset successful. Redirecting to login...");
                    setTimeout(() => handleLogout(), 2000);
                    break;
                case 400:
                    setError("Invalid OTP.");
                    break;
                case 403:
                    setError("User not verified.");
                    break;
                case 404:
                    setError("User not found.");
                    break;
                case 500:
                    setError("Server error. Please try again later.");
                    break;
                default:
                    setError(message || "Unexpected error occurred.");
            }
        } catch (err) {
            setError("Network or server error. Try again.");
        }
    };


    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('role')
        window.location.href = '/auth/login';
    };


    return (
        <section className="reset-section">
            <div className="reset-container">
                <h2 className="reset-title">
                    {step === 1 ? "Forgot Password" : step === 2 ? "Verify OTP" : "Reset Password"}
                </h2>

                {message && <div className="success-message">{message}</div>}
                {error && <div className="error-message">{error}</div>}

                {step === 1 && (
                    <form onSubmit={handleEmailSubmit} className="reset-form">
                        <div className="form-group">
                            <label htmlFor="email" className="form-label">Enter Registered Email</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="form-input"
                            />
                        </div>
                        <button type="submit" className="form-button">Send OTP</button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleOtpSubmit} className="reset-form">
                        <div className="form-group">
                            <label htmlFor="otp" className="form-label">Enter OTP sent to {email}</label>
                            <input
                                type="text"
                                id="otp"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                maxLength="6"
                                required
                                className="form-input"
                            />
                        </div>
                        <button type="submit" className="form-button green">Verify OTP</button>
                    </form>
                )}

                {step === 3 && (
                    <form onSubmit={handlePasswordReset} className="reset-form">
                        <div className="form-group">
                            <label htmlFor="newPassword" className="form-label">Enter New Password</label>
                            <input
                                type="password"
                                id="newPassword"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                className="form-input"
                            />
                        </div>
                        <button type="submit" className="form-button">Reset Password</button>
                    </form>
                )}

                <p className="redirect-link">
                    Remember your password? <Link to="/auth/login">Go back to login</Link>
                </p>
            </div>
        </section>

    );
};

export default ForgotPassword;
