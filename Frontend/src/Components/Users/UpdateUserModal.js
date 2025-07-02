import React from 'react';
import '../../assets/css/updateModel.css';

const UpdateUserModal = ({
    editingUser,
    setEditingUser,
    handleUpdateUser,
    onClose,
    creating,
}) => {
    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <h2 className="modal-title">Update User</h2>
                <form onSubmit={(e) => { e.preventDefault(); handleUpdateUser(); }}>
                    <input
                        type="text"
                        name="name"
                        value={editingUser.name}
                        onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                        placeholder="Full Name"
                        required
                        className="modal-input"
                    />
                    <input
                        type="email"
                        name="email"
                        value={editingUser.email}
                        onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                        placeholder="Email"
                        required
                        className="modal-input"
                    />
                    <select
                        name="role"
                        value={editingUser.role}
                        onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                        className="modal-input"
                    >
                        <option value="USER">USER</option>
                        <option value="ADMIN">ADMIN</option>
                        <option value="STUDENT">STUDENT</option>
                        <option value="FACULTY">FACULTY</option>
                    </select>
                    <div className="modal-buttons">
                        <button type="button" className="cancel-btn" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="save-btn" disabled={creating}>
                            {creating ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateUserModal;
