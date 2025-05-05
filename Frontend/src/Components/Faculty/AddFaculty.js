import React, { useState } from 'react';
import SideBar from '../SideBar'
import Header from '../Header'
import Footer from '../Footer'
import { toast, ToastContainer } from 'react-toastify'
import axios from 'axios'

const AddFaculty = () => {
    const [facultyName, setFacultyName] = useState("");
    const [facultyEmail, setFacultyEmail] = useState("");
    const [facultyPassword, setFacultyPassword] = useState("");
    const [facultyPhone, setFacultyPhone] = useState("");
    const [facultyGender, setFacultyGender] = useState("");
    const [facultyDepartment, setFacultyDepartment] = useState("");
    const [facultyDesignation, setFacultyDesignation] = useState("");
    const [role, setRole] = useState("");

    const handelFacultySubmit = async (e) => {
        e.preventDefault();
        console.log(facultyName, facultyEmail, facultyPassword, facultyPhone, facultyGender, facultyDepartment, facultyDesignation, role);
        toast.success("Faculty Added Successfully");
        try {
            const response = await axios.post("http://localhost:8080/faculty/add", { facultyName, facultyEmail, facultyPassword, facultyPhone, facultyGender, facultyDepartment, facultyDesignation, role })
            console.log(response.data)
            console.log(response.data.statusCode);

            if (response.data.statusCode === 200) {
                toast.success(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }

    }

    return (
        <>
            <SideBar />
            <Header />
            <ToastContainer />
            <div className="add-faculty-container">
                <h2 className="form-title">Add Faculty</h2>
                <form className="student-form-grid" onSubmit={handelFacultySubmit}>
                    <div className="form-group">
                        <label>Name</label>
                        <input type="text" placeholder="Enter full name" required onChange={(e) => setFacultyName(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" placeholder="Enter email" required onChange={(e) => setFacultyEmail(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" placeholder="Enter password" required onChange={(e) => setFacultyPassword(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Phone</label>
                        <input type="tel" placeholder="Enter phone number" required onChange={(e) => setFacultyPhone(e.target.value)} />
                    </div>
                    <div className="form-group" onChange={(e) => setFacultyGender(e.target.value)}>
                        <label>Gender</label>
                        <select required>
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Department</label>
                        <input type="text" placeholder="Enter department" required onChange={(e) => setFacultyDepartment(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Designation</label>
                        <input type="text" placeholder="Enter program" required onChange={(e) => setFacultyDesignation(e.target.value)} />
                    </div>
                    <div className="form-group" onChange={(e) => setRole(e.target.value)}>
                        <label>Role</label>
                        <select required>
                            <option value="">Select Role</option>
                            <option value="admin">Admin</option>
                            <option value="faculty">Faculty</option>
                            <option value="student">Student</option>
                            <option value="mentor">Mentor</option>
                            <option value="parents">Parents</option>
                        </select>
                    </div>
                    <div className="form-group full-width">
                        <button type="submit" className="submit-btn">Submit</button>
                    </div>
                </form>
            </div>
            <Footer />
        </>)
}

export default AddFaculty