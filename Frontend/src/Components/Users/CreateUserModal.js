import React from "react";
import "../../assets/css/createModel.css";

const CreateUserModal = ({
    newUser,
    handleChange,
    createUser,
    creating,
    onClose,
}) => {
    return (
        <div className="modal-overlay">
            <div className="modal-box">
                <h2 className="modal-title">Create New User</h2>
                <form className="modal-form" onSubmit={createUser}>
                    <input
                        type="text"
                        name="name"
                        value={newUser.name}
                        onChange={handleChange}
                        placeholder="Full Name"
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        value={newUser.email}
                        onChange={handleChange}
                        placeholder="Email"
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        value={newUser.password}
                        onChange={handleChange}
                        placeholder="Password"
                        required
                    />
                    <select
                        name="role"
                        value={newUser.role}
                        onChange={handleChange}
                        required
                    >
                        <option value="USER">USER</option>
                        <option value="ADMIN">ADMIN</option>
                        <option value="STUDENT">STUDENT</option>
                        <option value="FACULTY">FACULTY</option>
                    </select>
                    <div className="modal-buttons">
                        <button type="button" className="btn-cancel" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-submit" disabled={creating}>
                            {creating ? "Creating..." : "Create"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateUserModal;
