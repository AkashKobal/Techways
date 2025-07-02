import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const ChangePassword = () => {
    const [step, setStep] = useState(1); // 1 = OTP, 2 = Reset Password
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            setError("Unauthorized. Please log in.");
            setTimeout(() => navigate("/auth/login"), 2000);
            return;
        }

        try {
            const decoded = jwtDecode(token);
            const extractedEmail = decoded.sub || decoded.email;

            if (!extractedEmail) throw new Error("Email not found in token.");

            setEmail(extractedEmail);

            // Send OTP to user's email
            axios
                .post("http://localhost:8080/auth/email/reset-password/send-otp", { email: extractedEmail })
                .then(() => {
                    setMessage("OTP sent to your email.");
                    setStep(1);
                })
                .catch((err) => {
                    console.error(err);
                    setError("Failed to send OTP.");
                });
        } catch (err) {
            console.error("Token decode failed", err);
            setError("Session expired. Please login again.");
            setTimeout(() => navigate("/auth/login"), 2000);
        }
    }, []);

    const handleOtpSubmit = (e) => {
        e.preventDefault();
        if (otp.trim().length !== 6) {
            setError("Enter a valid 6-digit OTP.");
            return;
        }
        setError("");
        setMessage("OTP verified. Please enter your new password.");
        setStep(2);
    };

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        try {
            const payload = { email, otp, newPassword };
            const response = await axios.post("http://localhost:8080/auth/email/reset-password/verify-otp", payload);
            const { statusCode } = response.data;

            if (statusCode === 200) {
                setMessage("Password changed successfully. Redirecting to login...");
                setTimeout(() => handleLogout(), 2000);
            } else {
                setError(response.data.message || "Failed to reset password.");
            }
        } catch (err) {
            console.error(err);
            setError("Error occurred during password reset.");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        window.location.href = "/auth/login";
    };

    return (
        <section className="otp-section">
            <div className="otp-container">
                <h2 className="otp-title">
                    {step === 1 ? "Verify OTP" : "Change Password"}
                </h2>

                {message && <div className="success-message">{message}</div>}
                {error && <div className="error-message">{error}</div>}

                {step === 1 && (
                    <form onSubmit={handleOtpSubmit} className="otp-form">
                        <div className="form-group">
                            <label htmlFor="otp" className="form-label">Enter OTP sent to your email</label>
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
                        <button type="submit" className="form-button">Verify OTP</button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handlePasswordReset} className="otp-form">
                        <div className="form-group">
                            <label htmlFor="newPassword" className="form-label">New Password</label>
                            <input
                                type="password"
                                id="newPassword"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                className="form-input"
                            />
                        </div>
                        <button type="submit" className="form-button green">Change Password</button>
                    </form>
                )}
            </div>
        </section>
    );
};

export default ChangePassword;
