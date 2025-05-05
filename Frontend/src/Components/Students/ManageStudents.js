import React, { useEffect, useState } from 'react';
import SideBar from '../SideBar';
import Header from '../Header';
import Footer from '../Footer';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ManageStudents = () => {
    const [students, setStudents] = useState([]);
    const navigate = useNavigate();

    const getAllStudents = async () => {
        try {
            const response = await axios.get("http://localhost:8080/students/viewAllStudents");
            setStudents(response.data.studentsList);
        } catch (error) {
            console.error("Failed to fetch students:", error);
        }
    };

    useEffect(() => {
        getAllStudents();
    }, []);

    const handleEdit = (id) => {
        navigate(`/student/updateStudent/${id}`); // ✅ Fixed route
    };

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:8080/students/deleteStudent/${id}`);
            if (response.data.statusCode === 200) {
                toast.success(response.data.message);
                getAllStudents();
            }
        } catch (error) {
            console.error("Failed to delete student:", error);
            toast.error("Failed to delete student");
        }
    };

    return (
        <>
        <SideBar />
        <Header />
        <ToastContainer />
    
        <table className="table-primary">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Student Phone</th>
                    <th>Gender</th>
                    <th>Roll Number</th>
                    <th>Department</th>
                    <th>Program</th>
                    <th>Batch</th>
                    <th>Role</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {students.map((student) => (
                    <tr key={student.id}>
                        <td>{student.id}</td>
                        <td>{student.name}</td>
                        <td>{student.email}</td>
                        <td>{student.phone}</td>
                        <td>{student.gender}</td>
                        <td>{student.rollNumber}</td>
                        <td>{student.department}</td>
                        <td>{student.program}</td>
                        <td>{student.batch}</td>
                        <td>{student.role}</td>
                        <td>
                            <button className="btn btn-outline-warning" onClick={() => handleEdit(student.id)}>Edit</button>&nbsp;
                            <button className="btn btn-outline-danger" onClick={() => handleDelete(student.id)}>Delete</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        
        <Footer />
    </>
    
    );
};

export default ManageStudents;
