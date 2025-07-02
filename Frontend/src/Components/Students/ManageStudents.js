import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import 'jspdf-autotable';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import SideBar from "../SideBar";
import Header from "../Header";
import CreateStudentModal from "./CreateStudentModal";
import UpdateStudentModal from "./UpdateStudentModal";
import DeleteStudentDialog from "./DeleteStudentDialog";
import "../../assets/css/manageUsers.css";

const ManageStudents = () => {
    const [students, setStudents] = useState([]);
    const [editingStudent, setEditingStudent] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [creating, setCreating] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [input, setInput] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [noResults, setNoResults] = useState(false);
    const [searchFocused, setSearchFocused] = useState(false);
    const [showSearchResults, setShowSearchResults] = useState(false)

    const getAllStudents = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://localhost:8080/student/get-all", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.data?.studentList) {
                setStudents(response.data.studentList);
            } else {
                toast.error("No students found");
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch students");
        }
    };

    useEffect(() => {
        getAllStudents();
    }, []);

    const [newStudent, setNewStudent] = useState({
        name: "",
        email: "",
        password: "",
        rollNumber: "",
        department: "",
        program: "",
        batch: "",
        gender: "",
    });

    const handleNewStudentChange = (e) => {
        setNewStudent({ ...newStudent, [e.target.name]: e.target.value });
    };

    const handleCreateStudent = async (e) => {
        e.preventDefault();
        setCreating(true);
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post("http://localhost:8080/student/register", newStudent, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.data.statusCode === 201 || response.data.statusCode === 200) {
                toast.success("Student created successfully");
                setShowCreateModal(false);
                getAllStudents();
            } else {
                toast.error(response.data.message || "Failed to create student");
            }
        } catch (error) {
            toast.error("Error creating student");
        } finally {
            setCreating(false);
        }
    };

    const handleEditClick = (student) => {
        setEditingStudent({ ...student });
        setShowEditModal(true);
    };

    const handleUpdateStudent = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.put(`http://localhost:8080/student/update/${editingStudent.id}`, editingStudent, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.data.statusCode === 200) {
                toast.success("Student updated successfully");
                setShowEditModal(false);
                getAllStudents();
            } else {
                toast.error("Failed to update student");
            }
        } catch (error) {
            toast.error("Error updating student");
        }
    };

    const handleDeleteClick = (student) => {
        setSelectedStudent(student);
        setShowDeleteDialog(true);
    };

    const confirmDelete = async (studentId) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.delete(`http://localhost:8080/student/delete/${studentId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.data.statusCode === 204 || response.status === 204) {
                toast.success("Student deleted successfully");
                getAllStudents();
            } else {
                toast.error("Failed to delete student");
            }
        } catch (error) {
            toast.error("Error deleting student");
        } finally {
            setShowDeleteDialog(false);
            setSelectedStudent(null);
        }
    };


    const handleChange = async (value) => {
        setInput(value);
        if (value.length >= 1) {
            setShowSearchResults(true);

            const token = localStorage.getItem("token");

            try {
                const response = await axios.get(
                    `http://localhost:8080/student/search?keyword=${value}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setSearchResults(response.data);
                setNoResults(response.data.length === 0);
                console.log(response.data);
            } catch (error) {
                console.error("Error searching:", error);
            }
        } else {
            setShowSearchResults(false);
            setSearchResults([]);
            setNoResults(false);
        }
    };

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 10;
    // const totalPages = Math.ceil(students.length / usersPerPage);
    // const currentUsers = users.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page);
    };

    const [filterDepartment, setFilterDepartment] = useState("ALL");
    const [filterProgram, setFilterProgram] = useState("ALL");
    const [filterGender, setFilterGender] = useState("ALL");

    const [sortByNameAsc, setSortByNameAsc] = useState(true);

    const filteredUsers = students
        .filter((student) => {
            if (filterDepartment !== "ALL" && student.department !== filterDepartment) return false;
            if (filterProgram !== "ALL" && student.program !== filterProgram) return false;
            if (filterGender !== "ALL" && student.gender !== filterGender) return false;
            return true;
        })
        .sort((a, b) => {
            const nameA = a.name.toLowerCase();
            const nameB = b.name.toLowerCase();
            if (nameA < nameB) return sortByNameAsc ? -1 : 1;
            if (nameA > nameB) return sortByNameAsc ? 1 : -1;
            return 0;
        });

    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);


    const currentUsers = filteredUsers.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);



    const exportToExcel = () => {
        const filteredSortedUsers = currentUsers; // or whatever you display in the table

        const worksheetData = filteredSortedUsers.map(user => ({
            ID: user.id,
            Name: user.name,
            Email: user.email,
            Role: user.role,
            Verified: user.verified ? "Yes" : "No",
            Active: user.active ? "Active" : "Blocked",
        }));

        const worksheet = XLSX.utils.json_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(data, "users_report.xlsx");
    };


    return (
        <>
            <SideBar />
            <Header />
            <ToastContainer />
            <div className="manage-user-container">
                <div className="manage-user-header">
                    <h1 className="manage-user-title">Manage Users</h1>
                </div>

                <div className="manage-user-filters">
                    <select
                        value={filterDepartment}
                        onChange={(e) => setFilterDepartment(e.target.value)}
                        className="manage-user-filter-select"
                        id="departmentFilter"
                    >
                        <option value="ALL">All Departments</option>
                        <option value="Computer Science and Engineering">Computer Science and Engineering</option>
                        <option value="Information Technology">Information Technology</option>
                        <option value="Electrical and Electronics Engineering">Electrical and Electronics Engineering</option>
                        <option value="Electronics and Communication Engineering">Electronics and Communication Engineering</option>
                        <option value="Mechanical Engineering">Mechanical Engineering</option>
                        <option value="Civil Engineering">Civil Engineering</option>
                        <option value="Chemical Engineering">Chemical Engineering</option>
                        <option value="Biotechnology">Biotechnology</option>
                        <option value="Other">Other</option>
                        <option value="">Blank</option>
                    </select>
                    <select
                        value={filterProgram}
                        onChange={(e) => setFilterProgram(e.target.value)}
                        className="manage-user-filter-select"
                    >
                        <option value="ALL">All Programs</option>
                        <option value="B.Tech">B.Tech</option>
                        <option value="M.Tech">M.Tech</option>
                        <option value="BBA">BBA</option>
                        <option value="MBA">MBA</option>
                        <option value="BCA">BCA</option>
                        <option value="MCA">MCA</option>
                        <option value="Other">Other</option>
                    </select>
                    <select
                        value={filterGender}
                        onChange={(e) => setFilterGender(e.target.value)}
                        className="manage-user-filter-select"
                    >
                        <option value="ALL">All Genders</option>
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                        <option value="Other">Other</option>
                    </select>

                    <button
                        onClick={() => setSortByNameAsc(!sortByNameAsc)}
                        className="manage-user-sort-btn"
                    >
                        Sort Name: {sortByNameAsc ? "A → Z" : "Z → A"}
                    </button>
                    <div className="search-container">
                        <input
                            type="text"
                            name="search"
                            id="search"
                            placeholder="Search user by name, email or rollnumber"
                            value={input}
                            onChange={(e) => handleChange(e.target.value)}
                            onFocus={() => setSearchFocused(true)}
                            onBlur={() => setTimeout(() => setSearchFocused(false), 150)} // delay to allow click
                            className="manage-user-search-input"
                        />
                        {showSearchResults && (
                            <ul className="search-results-dropdown">
                                {searchResults.length > 0 ? (
                                    searchResults.map((result) => (
                                        <li
                                            key={result.id}
                                            className="search-result-item"
                                            onClick={() => handleEditClick(result)}
                                        >
                                            <span className="text-indigo-700 hover:underline">
                                                {result.name} | {result.email} | {result.rollNumber}
                                            </span>
                                        </li>
                                    ))
                                ) : (
                                    noResults && <li className="no-result-item">No user with that name or email</li>
                                )}
                            </ul>
                        )}
                    </div>
                    <button className="manage-user-export-btn" onClick={exportToExcel}>
                        Export to Excel
                    </button>

                    <table className="manage-user-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Roll</th>
                                <th>Department</th>
                                <th>Program</th>
                                <th>Batch</th>
                                <th>Gender</th>
                                <th>Active</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentUsers.map((student) => (
                                <tr key={student.id}>
                                    <td>{student.id}</td>
                                    <td>{student.name}</td>
                                    <td>{student.email}</td>
                                    <td>{student.rollNumber}</td>
                                    <td>{student.department}</td>
                                    <td>{student.program}</td>
                                    <td>{student.batch}</td>
                                    <td>{student.gender}</td>
                                    <td>{student.active ? "Yes" : "No"}</td>
                                    <td>
                                        <button className="edit-btn" title="edit" onClick={() => handleEditClick(student)}>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M15.2995 4.42255L6.34327 13.4872C6.11694 13.7162 6.00377 13.8308 5.9332 13.9717C5.86262 14.1127 5.83924 14.271 5.79248 14.5875L5.55022 16.2271C5.36753 17.4635 5.27619 18.0817 5.64364 18.435C6.01109 18.7883 6.63525 18.6823 7.88356 18.4704L9.53897 18.1894C9.85851 18.1352 10.0183 18.1081 10.1593 18.0349C10.3004 17.9617 10.4136 17.8471 10.6399 17.618L19.5962 8.55344C20.2588 7.88278 20.5901 7.54745 20.5848 7.13611C20.5796 6.72476 20.2397 6.39805 19.5601 5.74462L18.147 4.38599C17.4673 3.73256 17.1275 3.40584 16.7105 3.4112C16.2935 3.41655 15.9622 3.75188 15.2995 4.42255Z" stroke="black" stroke-width="null" class="my-path"></path>
                                                <path d="M18 10L14 6" stroke="black" stroke-width="null" class="my-path"></path>
                                            </svg></button>

                                        <span className="text-gray-500 mx-2">/</span>

                                        <button className="delete-btn" title="delete" onClick={() => handleDeleteClick(student)}>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M3 6.60001H21M4.8 6.60001H19.2V15C19.2 17.8284 19.2 19.2426 18.3213 20.1213C17.4426 21 16.0284 21 13.2 21H10.8C7.97157 21 6.55736 21 5.67868 20.1213C4.8 19.2426 4.8 17.8284 4.8 15V6.60001Z" stroke="black" stroke-width="null" stroke-linecap="round" class="my-path"></path>
                                                <path d="M7.49994 6.59994V4.99994C7.49994 3.89537 8.39537 2.99994 9.49994 2.99994H14.4999C15.6045 2.99994 16.4999 3.89537 16.4999 4.99994V6.59994M16.4999 6.59994H2.99994M16.4999 6.59994H21" stroke="black" stroke-width="null" stroke-linecap="round" class="my-path"></path>
                                                <path d="M10.2 11.1L10.2 16.5" stroke="black" stroke-width="null" stroke-linecap="round" class="my-path"></path>
                                                <path d="M13.8 11.1L13.8 16.5" stroke="black" stroke-width="null" stroke-linecap="round" class="my-path"></path>
                                            </svg></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>


                    {showCreateModal && (
                        <CreateStudentModal
                            student={newStudent}
                            handleChange={handleNewStudentChange}
                            handleCreate={handleCreateStudent}
                            creating={creating}
                            onClose={() => setShowCreateModal(false)}
                        />
                    )}

                    {showEditModal && (
                        <UpdateStudentModal
                            editingStudent={editingStudent}
                            setEditingStudent={setEditingStudent}
                            handleUpdateStudent={handleUpdateStudent}
                            onClose={() => setShowEditModal(false)}
                            creating={creating}
                        />
                    )}

                    {showDeleteDialog && (
                        <DeleteStudentDialog
                            student={selectedStudent}
                            onConfirm={confirmDelete}
                            onCancel={() => setShowDeleteDialog(false)}
                        />
                    )}

                </div>
                <div className="pagination-container">
                    <button
                        className="pagination-btn"
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>

                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index + 1}
                            className={`pagination-btn ${currentPage === index + 1 ? 'active' : ''}`}
                            onClick={() => goToPage(index + 1)}
                        >
                            {index + 1}
                        </button>
                    ))}

                    <button
                        className="pagination-btn"
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
            </div>
        </>
    );
};

export default ManageStudents;