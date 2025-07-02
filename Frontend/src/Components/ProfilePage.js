import axios from 'axios';
import React, { useEffect, useState } from 'react';
import SideBar from './SideBar';
import Header from './Header';
import Footer from './Footer';
import "../../src/assets/css/profilepage.css";

const ProfilePage = () => {
  const [profileInfo, setProfileInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const role = localStorage.getItem('role');

  useEffect(() => {
    if (role === "STUDENT") {
      fetchStudentInfo();
    } else {
      fetchUserOrAdminInfo(); // for ADMIN or USER
    }
  }, []);

  const fetchStudentInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get("http://localhost:8080/student/get-my-info", {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setProfileInfo(response.data.student);
    } catch (error) {
      handleAuthError(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserOrAdminInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get("http://localhost:8080/auth/get-my-info", {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      console.log("User or Admin Info:", response.data);
      setProfileInfo(response.data.users);
    } catch (error) {
      handleAuthError(error);
    } finally {
      setLoading(false);
    }
  };


  const handleAuthError = (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      window.location.href = '/auth/login';
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!profileInfo) return null;

  return (
    <>
      <SideBar />
      <Header />
      <div className="profile-wrapper">
        <div className="profile-right">
          <div className="info-grid">
            <img src="https://bootdey.com/img/Content/avatar/avatar7.png" alt="Avatar" className="avatar" />
            <div><span>Full Name:</span> {profileInfo.name}</div>
            <div><span>Email:</span> {profileInfo.email}</div>
            <div><span>Role:</span> {role}</div>

            {role === "STUDENT" && (
              <>
                <div><span>Department:</span> {profileInfo.department}</div>
                <div><span>Roll Number:</span> {profileInfo.rollNumber}</div>
                <div><span>Phone:</span> {profileInfo.student_phone || "N/A"}</div>
                <div><span>Gender:</span> {profileInfo.gender}</div>
                <div><span>Program:</span> {profileInfo.program}</div>
                <div><span>Batch:</span> {profileInfo.batch}</div>
                <div><span>Father's Name:</span> {profileInfo.father_name || "N/A"}</div>
                <div><span>Mother's Name:</span> {profileInfo.mother_name || "N/A"}</div>
                <div><span>Parent Phone:</span> {profileInfo.parent_phone || "N/A"}</div>
                <div><span>Address:</span> {profileInfo.address || "N/A"}</div>
                <div><span>Religion:</span> {profileInfo.religion || "N/A"}</div>
                <div><span>Nationality:</span> {profileInfo.nationality || "N/A"}</div>
                <div><span>Account Status:</span> {profileInfo.active ? "Active" : "Inactive"}</div>
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProfilePage;
