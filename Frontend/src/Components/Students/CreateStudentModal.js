import React from "react";
import "../../assets/css/createModel.css";

const CreateStudentModal = ({ student, handleChange, handleCreate, creating, onClose }) => {
    return (
        <div className="modal-overlay">
            <div className="modal-box">
                <h2 className="modal-title">Create New Student</h2>
                <form className="modal-form" onSubmit={handleCreate}>
                    <input type="text" name="name" value={student.name} onChange={handleChange} placeholder="Full Name" required />
                    <input type="email" name="email" value={student.email} onChange={handleChange} placeholder="Email" required />
                    <input type="text" name="rollNumber" value={student.rollNumber} onChange={handleChange} placeholder="Roll Number" required />
                    <select name="department" value={student.department} onChange={handleChange} required>
                        <option value="">Select Department</option>
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

                    <select name="program" value={student.program} onChange={handleChange} required>
                        <option value="">Select Program</option>
                        <option value="B.Tech">B.Tech</option>
                        <option value="M.Tech">M.Tech</option>
                        <option value="BBA">BBA</option>
                        <option value="MBA">MBA</option>
                        <option value="BCA">BCA</option>
                        <option value="MCA">MCA</option>
                        <option value="OTHER">Other</option>
                    </select>

                    <input type="text" name="batch" value={student.batch} onChange={handleChange} placeholder="Batch" required />
                    <select name="gender" value={student.gender} onChange={handleChange}>
                        <option value="">Select Gender</option>
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                        <option value="OTHER">Other</option>
                    </select>
                    <input type="password" name="password" value={student.password} onChange={handleChange} placeholder="Password" required />
                    <div className="modal-buttons">
                        <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn-submit" disabled={creating}>
                            {creating ? "Creating..." : "Create"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateStudentModal;
