import React from "react";
import "../../assets/css/deleteDialog.css";

const DeleteUserDialog = ({ user, onConfirm, onCancel }) => {
    return (
        <div className="dialog-overlay">
            <div className="dialog-box">
                <h3>Confirm Deletion</h3>
                <p>Are you sure you want to delete <strong>{user.name}</strong>?</p>
                <div className="dialog-actions">
                    <button className="confirm-btn" onClick={() => onConfirm(user.id)}>Delete</button>
                    <button className="cancel-btn" onClick={onCancel}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default DeleteUserDialog;
