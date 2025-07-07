import React, { useEffect, useState } from 'react';
import Header from '../Header';
import SideBar from '../SideBar';
import Footer from '../Footer';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import '../../assets/css/manageCourse.css';

const ManageCourse = () => {
    const [courses, setCourses] = useState([]);
    const navigate = useNavigate();

    const fetchCourses = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8080/course/all', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setCourses(response.data.courseList || []);
        } catch (error) {
            toast.error("Failed to fetch courses");
        }
    };

    const deleteCourse = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:8080/course/delete/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            toast.success("Course deleted successfully");
            fetchCourses();
        } catch (error) {
            toast.error("Failed to delete course");
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    return (
        <>
            <SideBar />
            <Header />
            <ToastContainer />
            <div className="manage-course-container">
                <h2>Manage Courses</h2>
                <table className="course-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Code</th>
                            <th>Description</th>
                            <th>Duration</th>
                            <th>Credits</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.map(course => (
                            <tr key={course.courseId}>
                                <td>{course.courseName}</td>
                                <td>{course.courseCode}</td>
                                <td>{course.courseDescription}</td>
                                <td>{course.courseDuration} hrs</td>
                                <td>{course.courseCredits}</td>
                                <td>
                                    <div className="button-wrap">
                                        <button
                                            className="primary-cta"
                                            onClick={() => navigate(`/course/updateCourse/${course.courseId}`)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="secondary-cta"
                                            onClick={() => deleteCourse(course.courseId)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>
            <Footer />
        </>
    );
};

export default ManageCourse;
