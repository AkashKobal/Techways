import React, { useState } from 'react';
import '../../assets/css/updateModel.css';

const UpdateStudentModal = ({
    editingStudent,
    setEditingStudent,
    handleUpdateStudent,
    onClose,
    creating,
}) => {
    const [imageFile, setImageFile] = useState(null);


    const onSubmit = (e) => {
        e.preventDefault();
        handleUpdateStudent(imageFile);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <h2 className="modal-title">Update Student</h2>
                <form onSubmit={onSubmit}>

                    <input
                        type="text"
                        name="name"
                        value={editingStudent.name}
                        onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })}
                        placeholder="Full Name"
                        className="modal-input"
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        value={editingStudent.email}
                        onChange={(e) => setEditingStudent({ ...editingStudent, email: e.target.value })}
                        placeholder="Email"
                        className="modal-input"
                        required
                    />
                    <input
                        type="text"
                        name="rollNumber"
                        value={editingStudent.rollNumber}
                        onChange={(e) => setEditingStudent({ ...editingStudent, rollNumber: e.target.value })}
                        placeholder="Roll Number"
                        className="modal-input"
                        required
                    />

                    <select
                        name="department"
                        value={editingStudent.department}
                        onChange={(e) => setEditingStudent({ ...editingStudent, department: e.target.value })}
                        className="modal-input"
                        required
                    >
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

                    <select
                        name="program"
                        value={editingStudent.program}
                        onChange={(e) => setEditingStudent({ ...editingStudent, program: e.target.value })}
                        className="modal-input"
                        required
                    >
                        <option value="">Select Program</option>
                        <option value="B.Tech">B.Tech</option>
                        <option value="M.Tech">M.Tech</option>
                        <option value="BBA">BBA</option>
                        <option value="MBA">MBA</option>
                        <option value="BCA">BCA</option>
                        <option value="MCA">MCA</option>
                        <option value="OTHER">Other</option>
                    </select>

                    <input
                        type="text"
                        name="batch"
                        value={editingStudent.batch}
                        onChange={(e) => setEditingStudent({ ...editingStudent, batch: e.target.value })}
                        placeholder="Batch"
                        className="modal-input"
                        required
                    />

                    <select
                        name="gender"
                        value={editingStudent.gender}
                        onChange={(e) => setEditingStudent({ ...editingStudent, gender: e.target.value })}
                        className="modal-input"
                    >
                        <option value="">Select Gender</option>
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                        <option value="OTHER">Other</option>
                    </select>
                    <div className="custom-file-upload">
                        <label htmlFor="image-upload">Upload Image</label>
                        <input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImageFile(e.target.files[0])}
                        />
                    </div>

                    <div className="modal-buttons">
                        <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
                        <button type="submit" className="save-btn" disabled={creating}>
                            {creating ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateStudentModal;
