import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import "react-toastify/dist/ReactToastify.css";
import SideBar from "../SideBar";
import Header from "../Header";
import "../../assets/css/viewAllStudents.css";


const ViewStudents = () => {
    const [students, setStudents] = useState([]);
    const [search, setSearch] = useState("");
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [filterDepartment, setFilterDepartment] = useState("ALL");
    const [filterProgram, setFilterProgram] = useState("ALL");
    const [filterGender, setFilterGender] = useState("ALL");
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showDialog, setShowDialog] = useState(false);
    const [input, setInput] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [noResults, setNoResults] = useState(false);
    const [searchFocused, setSearchFocused] = useState(false);
    const [showSearchResults, setShowSearchResults] = useState(false)

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


    const getAllStudents = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://localhost:8080/student/get-all", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setStudents(response.data.studentList || []);
        } catch (error) {
            toast.error("Failed to fetch students");
        }
    };

    useEffect(() => {
        getAllStudents();
    }, []);

    useEffect(() => {
        let filtered = students.filter((s) => {
            return (
                (filterDepartment === "ALL" || s.department === filterDepartment) &&
                (filterProgram === "ALL" || s.program === filterProgram) &&
                (filterGender === "ALL" || s.gender === filterGender) &&
                (s.name.toLowerCase().includes(search.toLowerCase()) ||
                    s.rollNumber.toLowerCase().includes(search.toLowerCase()))
            );
        });
        setFilteredStudents(filtered);
    }, [students, search, filterDepartment, filterProgram, filterGender]);

    const handleViewProfile = async (id) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`http://localhost:8080/student/get/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setSelectedStudent(response.data.student);
            setShowDialog(true);
        } catch (error) {
            toast.error("Failed to fetch student details");
        }
    };

    const exportToExcel = () => {
        const worksheetData = filteredStudents.map((user) => ({
            Name: user.name,
            RollNumber: user.rollNumber,
            Email: user.email,
            Department: user.department,
            Program: user.program,
            Batch: user.batch,
            Gender: user.gender,
        }));

        const worksheet = XLSX.utils.json_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(data, "students_report.xlsx");
    };


    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 25;
    // const totalPages = Math.ceil(students.length / usersPerPage);
    // const currentUsers = users.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page);
    };



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


    return (
        <>
            <SideBar />
            <Header />
            <ToastContainer />
            <div className="view-students-container">
                <div className="filters">
                    <select value={filterDepartment} onChange={(e) => setFilterDepartment(e.target.value)}>
                        <option value="ALL">All Departments</option>
                        <option value="Computer Science and Engineering">Computer Science and Engineering</option>
                        <option value="Information Technology">Information Technology</option>
                        <option value="Electrical and Electronics Engineering">Electrical and Electronics Engineering</option>
                        <option value="Electronics and Communication Engineering">Electronics and Communication Engineering</option>
                        <option value="Mechanical Engineering">Mechanical Engineering</option>
                        <option value="Civil Engineering">Civil Engineering</option>
                        <option value="Chemical Engineering">Chemical Engineering</option>
                        <option value="Biotechnology">Biotechnology</option>
                        <option value="OTHER">Other</option>
                    </select>

                    <select value={filterProgram} onChange={(e) => setFilterProgram(e.target.value)}>
                        <option value="ALL">All Programs</option>
                        <option value="B.Tech">B.Tech</option>
                        <option value="M.Tech">M.Tech</option>
                        <option value="BBA">BBA</option>
                        <option value="MBA">MBA</option>
                        <option value="BCA">BCA</option>
                        <option value="MCA">MCA</option>
                        <option value="Other">Other</option>
                    </select>

                    <select value={filterGender} onChange={(e) => setFilterGender(e.target.value)}>
                        <option value="ALL">All Genders</option>
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                        <option value="OTHER">Other</option>
                    </select>

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
                                            onClick={() => handleViewProfile(result.id)}
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

                    <button className="export-btn" onClick={exportToExcel}>
                        Export to Excel
                    </button>
                </div>

                <div className="student-card-list">
                    {currentUsers.map((student) => (
                        <div className="student-card" key={student.id}>
                            <h3>{student.name}</h3>
                            <p>Roll: {student.rollNumber}</p>
                            <button onClick={() => handleViewProfile(student.id)}>View Profile</button>
                        </div>
                    ))}
                </div>


                {showDialog && selectedStudent && (
                    <div className="dialog-overlay" onClick={() => setShowDialog(false)}>
                        <div className="student-dialog" onClick={(e) => e.stopPropagation()}>
                            <h2>{selectedStudent.name}'s Profile</h2>
                            <p><strong>Email:</strong> {selectedStudent.email}</p>
                            <p><strong>Roll Number:</strong> {selectedStudent.rollNumber}</p>
                            <p><strong>Department:</strong> {selectedStudent.department}</p>
                            <p><strong>Program:</strong> {selectedStudent.program}</p>
                            <p><strong>Batch:</strong> {selectedStudent.batch}</p>
                            <p><strong>Gender:</strong> {selectedStudent.gender}</p>
                            <p><strong>Status:</strong> {selectedStudent.active ? "Active" : "Inactive"}</p>
                            <button onClick={() => setShowDialog(false)}>Close</button>
                        </div>
                    </div>
                )}
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

export default ViewStudents;
