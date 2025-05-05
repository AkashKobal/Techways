import React, { useState, useEffect } from 'react';
import SideBar from '../SideBar';
import Header from '../Header';
import Footer from '../Footer';
import '../../assets/css/viewAllFaculty.css';
import axios from 'axios';

const ViewAllFaculty = () => {
    const [faculty, setFaculty] = useState([]);

    const viewAllFaculty = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://localhost:8080/faculty/viewAllFaculties", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(response.data);
            setFaculty(response.data.facultyList);
        } catch (error) {
            console.error("Error fetching faculty:", error);
        }
    };

    useEffect(() => {
        viewAllFaculty();
    }, []);

    return (
        <>
            <SideBar />
            <Header />
            <div className="view-all-faculty">
                <h1>View All Faculty</h1>
                <div className="notifications-cards">
                    {faculty.map((faculty) => (
                        <div className="notification" key={faculty.facultyId}>
                            <div className="notiglow"></div>
                            <div className="notiborderglow"></div>
                            <div className="notititle">{faculty.facultyName}</div>
                            <div className="notibody">Designation: {faculty.facultyDesignation}</div>
                            <div className="notibody">Department: {faculty.facultyDepartment}</div>
                            <div className="notibody">Email: {faculty.facultyEmail}</div>
                            <div className="notibody">Phone No: {faculty.facultyPhone}</div>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ViewAllFaculty;
