import React, { useEffect, useState } from 'react';
import SideBar from '../SideBar';
import Header from '../Header';
import '../../assets/css/dashboard.css';
import {
    PieChart, Pie, Tooltip, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Legend
} from 'recharts';
import axios from 'axios';

const COLORS = ['#6366f1', '#34d399', '#f87171', '#facc15', '#60a5fa'];

const ConsolidatedReport = () => {
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get("http://localhost:8080/course/all", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCourses(res.data?.courseList || []);
        } catch (err) {
            console.error("Error fetching courses:", err);
        }
    };

    const totalCourses = courses.length;

    const creditsByCourse = courses.map(course => ({
        name: course.courseName + ' (' + course.courseCode + ')',
        credits: course.courseCredits
    }));

    const durationData = courses.map(course => ({
        name: course.courseName,
        duration: parseInt(course.courseDuration)
    }));

    return (
        <>
            <SideBar />
            <Header />
            <div className="dashboard-container">
                <h2 className="h3 fw-bold mb-4 text-start">Course Report</h2>

                <div className="cards-wrapper">
                    <div className="card">
                        <p className='card-label'>Total Courses</p>
                        <p className='card-value'>{totalCourses}</p>
                    </div>
                </div>

                <div className="chats-tables-wrapper">
                    <div className="col-lg-6">
                        <div className="card shadow animated-card">
                            <div className="card-body">
                                <h5 className="card-title mb-2">Course Credit Distribution</h5>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={creditsByCourse}
                                            dataKey="credits"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={100}
                                            label
                                        >
                                            {creditsByCourse.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-6">
                        <div className="card shadow animated-card">
                            <div className="card-body">
                                <h5 className="card-title mb-2">Course Duration (Hours)</h5>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={durationData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                        <XAxis dataKey="name" stroke="#555" interval={0} angle={-30} textAnchor="end" height={100} />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="duration" fill="#6366f1" radius={[5, 5, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ConsolidatedReport;
