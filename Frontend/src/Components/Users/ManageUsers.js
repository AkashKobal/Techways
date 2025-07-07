import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import 'jspdf-autotable';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import SideBar from "../SideBar";
import Header from "../Header";
import "../../assets/css/manageUsers.css"
import CreateUserModal from "./CreateUserModal";
import UpdateUserModal from "./UpdateUserModal";
import DeleteUserDialog from "./DeleteUserDialog";

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [creating, setCreating] = useState(false);

    const [input, setInput] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [noResults, setNoResults] = useState(false);
    const [searchFocused, setSearchFocused] = useState(false);
    const [showSearchResults, setShowSearchResults] = useState(false)

    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const handleDeleteClick = (user) => {
        setSelectedUser(user);
        setShowDeleteDialog(true);
    };

    const confirmDelete = (userId) => {
        handleDelete(userId); // your existing delete logic
        setShowDeleteDialog(false);
    };

    const cancelDelete = () => {
        setShowDeleteDialog(false);
        setSelectedUser(null);
    };


    const handleChange = async (value) => {
        setInput(value);
        if (value.length >= 1) {
            setShowSearchResults(true);

            const token = localStorage.getItem("token");

            try {
                const response = await axios.get(
                    `http://localhost:8080/users/search?keyword=${value}`,
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


    const [newUser, setNewUser] = useState({
        name: "",
        email: "",
        password: "",
        role: "USER",
    });

    const handleNewUserChange = (e) => {
        setNewUser({ ...newUser, [e.target.name]: e.target.value });
    };

    const createUser = async (e) => {
        e.preventDefault();
        setCreating(true);
        try {
            const { name, email, password, role } = newUser;
            const response = await axios.post("http://localhost:8080/auth/register", {
                name,
                email,
                password,
                role,
            });

            const { statusCode, message } = response.data;

            if (statusCode === 201 || statusCode === 200) {
                toast.success("User created successfully");
                setShowCreateModal(false);
                setNewUser({ name: "", email: "", password: "", role: "USER" });
                getAllUsers();
            } else {
                toast.error(message || "Failed to create user");
            }
        } catch (err) {
            if (err.response?.data?.message) {
                toast.error(err.response.data.message);
            } else {
                toast.error("Unexpected error occurred");
            }
        } finally {
            setCreating(false);
        }
    };

    const getAllUsers = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://localhost:8080/admin/get-all-users", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.data?.usersList) {
                setUsers(response.data.usersList);
            } else {
                toast.error("No users found");
            }
        } catch (error) {
            console.error("Fetch failed:", error);
            toast.error("Failed to fetch users");
        }
    };

    const handleDelete = async (userId) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.delete(`http://localhost:8080/admin/delete/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.data.statusCode === 204) {
                toast.success("User deleted successfully");
                getAllUsers();
            } else {
                toast.error("Failed to delete user");
            }
        } catch (error) {
            console.error("Delete error:", error);
            toast.error("Delete failed");
        }
    };

    const handleEditClick = (user) => {
        setEditingUser({ ...user });
        setShowModal(true);
    };

    const handleUpdateUser = async () => {
        try {
            const token = localStorage.getItem("token");
            const { authorities, accountNonExpired, accountNonLocked, credentialsNonExpired, username, ...safeUser } = editingUser;

            const response = await axios.put(
                `http://localhost:8080/admin/update/${editingUser.id}`,
                safeUser,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.statusCode === 200) {
                toast.success("User updated successfully");
                setShowModal(false);
                getAllUsers();
            } else {
                toast.error("Failed to update user");
            }
        } catch (error) {
            console.error("Update error:", error);
            toast.error("Update failed");
        }
    };
    // reload the page to reflect changes
    const handleReload = () => {
        window.location.reload();
    };

    useEffect(() => {
        getAllUsers();
    }, []);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 10;
    // const currentUsers = users.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);
    
    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page);
    };
    
    const [filterRole, setFilterRole] = useState("ALL");
    const [filterVerified, setFilterVerified] = useState("ALL");
    const [filterActive, setFilterActive] = useState("ALL");
    const [sortByNameAsc, setSortByNameAsc] = useState(true);
    
    const filteredUsers = users
    .filter((user) => {
        if (filterRole !== "ALL" && user.role !== filterRole) return false;
        if (filterVerified !== "ALL" && user.verified !== (filterVerified === "VERIFIED")) return false;
        if (filterActive !== "ALL" && user.active !== (filterActive === "ACTIVE")) return false;
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
        const filteredSortedUsers = filteredUsers; // or whatever you display in the table

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
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                        className="manage-user-filter-select"
                    >
                        <option value="ALL">All Roles</option>
                        <option value="ADMIN">Admin</option>
                        <option value="USER">User</option>
                        <option value="STUDENT">Student</option>
                        <option value="FACULTY">Faculty</option>
                    </select>
                    <select
                        value={filterVerified}
                        onChange={(e) => setFilterVerified(e.target.value)}
                        className="manage-user-filter-select"
                    >
                        <option value="ALL">All Verified</option>
                        <option value="VERIFIED">Verified</option>
                        <option value="UNVERIFIED">Unverified</option>
                    </select>
                    <select
                        value={filterActive}
                        onChange={(e) => setFilterActive(e.target.value)}
                        className="manage-user-filter-select"
                    >
                        <option value="ALL">All Status</option>
                        <option value="ACTIVE">Active</option>
                        <option value="BLOCKED">Blocked</option>
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
                            placeholder="Search user by name or email"
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
                                                {result.name} ({result.email})
                                            </span>
                                        </li>
                                    ))
                                ) : (
                                    noResults && <li className="no-result-item">No user with that name or email</li>
                                )}
                            </ul>
                        )}
                    </div>


                    <button className="manage-user-create-btn" onClick={() => setShowCreateModal(true)}>
                        Create User
                    </button>
                    {showCreateModal && (
                        <CreateUserModal
                            newUser={newUser}
                            handleChange={handleNewUserChange}
                            createUser={createUser}
                            creating={creating}
                            onClose={() => setShowCreateModal(false)}
                        />
                    )}


                    <button className="manage-user-export-btn" onClick={exportToExcel}>
                        Export to Excel
                    </button>
                </div>

                <div className="user-list">
                    <table className="manage-user-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Verified</th>
                                <th>Active</th>
                                <th>Created</th>
                                <th>Updated</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentUsers.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.role}</td>
                                    <td>{user.verified ? 'Yes' : 'No'}</td>
                                    <td>{user.active ? 'Active' : 'Blocked'}</td>
                                    <td>{new Date(user.createdAt).toLocaleString()}</td>
                                    <td>{new Date(user.updatedAt).toLocaleString()}</td>
                                    <td className="manage-user-action">
                                        <button
                                            title="Edit"
                                            className="edit-btn "
                                            onClick={() => handleEditClick(user)}
                                        >
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M15.2995 4.42255L6.34327 13.4872C6.11694 13.7162 6.00377 13.8308 5.9332 13.9717C5.86262 14.1127 5.83924 14.271 5.79248 14.5875L5.55022 16.2271C5.36753 17.4635 5.27619 18.0817 5.64364 18.435C6.01109 18.7883 6.63525 18.6823 7.88356 18.4704L9.53897 18.1894C9.85851 18.1352 10.0183 18.1081 10.1593 18.0349C10.3004 17.9617 10.4136 17.8471 10.6399 17.618L19.5962 8.55344C20.2588 7.88278 20.5901 7.54745 20.5848 7.13611C20.5796 6.72476 20.2397 6.39805 19.5601 5.74462L18.147 4.38599C17.4673 3.73256 17.1275 3.40584 16.7105 3.4112C16.2935 3.41655 15.9622 3.75188 15.2995 4.42255Z" stroke="black" stroke-width="null" class="my-path"></path>
                                                <path d="M18 10L14 6" stroke="black" stroke-width="null" class="my-path"></path>
                                            </svg>
                                        </button>
                                        {showModal && (
                                            <UpdateUserModal
                                                editingUser={editingUser}
                                                setEditingUser={setEditingUser}
                                                handleUpdateUser={handleUpdateUser}
                                                onClose={() => setShowModal(false)}
                                                creating={creating}
                                            />
                                        )}

                                        <span className="text-gray-500 mx-2">/</span>
                                        <button
                                            title="Delete"
                                            className="delete-btn"
                                            onClick={() => handleDeleteClick(user)} // <-- pass full user object
                                        >

                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M3 6.60001H21M4.8 6.60001H19.2V15C19.2 17.8284 19.2 19.2426 18.3213 20.1213C17.4426 21 16.0284 21 13.2 21H10.8C7.97157 21 6.55736 21 5.67868 20.1213C4.8 19.2426 4.8 17.8284 4.8 15V6.60001Z" stroke="black" stroke-width="null" stroke-linecap="round" class="my-path"></path>
                                                <path d="M7.49994 6.59994V4.99994C7.49994 3.89537 8.39537 2.99994 9.49994 2.99994H14.4999C15.6045 2.99994 16.4999 3.89537 16.4999 4.99994V6.59994M16.4999 6.59994H2.99994M16.4999 6.59994H21" stroke="black" stroke-width="null" stroke-linecap="round" class="my-path"></path>
                                                <path d="M10.2 11.1L10.2 16.5" stroke="black" stroke-width="null" stroke-linecap="round" class="my-path"></path>
                                                <path d="M13.8 11.1L13.8 16.5" stroke="black" stroke-width="null" stroke-linecap="round" class="my-path"></path>
                                            </svg>
                                        </button>
                                        {showDeleteDialog && (
                                            <DeleteUserDialog
                                                user={selectedUser}
                                                onConfirm={confirmDelete}
                                                onCancel={cancelDelete}
                                            />
                                        )}

                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
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

            </div>
        </>
    );
};

export default ManageUsers;
