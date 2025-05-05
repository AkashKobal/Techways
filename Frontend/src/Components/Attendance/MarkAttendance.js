import React, { useState } from 'react'
import SideBar from '../SideBar'
import Header from '../Header'
import Footer from '../Footer'
import '../../assets/css/markAttendance.css'
import Select from 'react-select'

const MarkAttendance = () => {
    const [branchOptionsPicked, setBranchOptionsPicked] = useState("");
    const [sectionOptionsPicked, setSectionOptionsPicked] = useState("");
    const [subjectOptionsPicked, setSubjectOptionsPicked] = useState("");
    const branchOptions = [
        { value: 'CSE', label: 'CSE' },
        { value: 'IT', label: 'IT' },
        { value: 'ECE', label: 'ECE' },
        { value: 'MECH', label: 'MECH' },
        { value: 'CIVIL', label: 'CIVIL' },
        { value: 'EEE', label: 'EEE' }
    ];

    const sectionOptions = [
        { value: '8CSE01', label: '8CSE01' },
        { value: '8CSE02', label: '8CSE02' },
        { value: '8CSE03', label: '8CSE03' },
        { value: '8CSE04', label: '8CSE04' }
    ]

    const subjectOptions = [
        { value: 'DSA', label: 'DSA' },
        { value: 'DBMS', label: 'DBMS' },
        { value: 'OS', label: 'OS' },
        { value: 'CN', label: 'CN' },
        { value: 'SE', label: 'SE' }
    ]

    const customStyles = {
        control: (provided) => ({
            ...provided,
            border: '1px solid #ccc',
            borderRadius: '4px',
            boxShadow: 'none',
            '&:hover': {
                borderColor: '#888',
            },
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? '#007bff' : 'white',
            color: state.isSelected ? 'white' : 'black',
            '&:hover': {
                backgroundColor: state.isSelected ? '#007bff' : '#f5f5f5',
            },
        }),
    }
    return (
        <>
            <SideBar />
            <Header />
            <div className="mark-attendance-container">
                <h1>MarkAttendance</h1>
                <div className="select-container">
                    <Select options={branchOptions} styles={customStyles} onChange={(option) => setBranchOptionsPicked(option)} />
                    <Select options={sectionOptions} styles={customStyles} onChange={(option) => setSectionOptionsPicked(option)} />
                    <Select options={subjectOptions} styles={customStyles} onChange={(option) => setSubjectOptionsPicked(option)} />
                    <button >Search</button>
                </div>
                <p className='selected-labels'>Mark Attendance for Branch: {branchOptionsPicked?.label} | Section: {sectionOptionsPicked?.label} | Subject: {subjectOptionsPicked?.label}  <button>Save</button></p>
                <div className="attendance-container">
                    <div className="card">
                        <div className="container">
                            <div className="right">
                                <div className="text-wrap">
                                    <p className="text-content">
                                        <a className="text-link" href="/">Akash Kobal</a>
                                    </p>
                                    <p className="time">20211CSD0116</p>
                                </div>
                                <div className="button-wrap">
                                    <button className="primary-cta">View Profile</button>
                                    <button className="secondary-cta">Mark as present</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card">
                        <div className="container">
                            <div className="right">
                                <div className="text-wrap">
                                    <p className="text-content">
                                        <a className="text-link" href="#">Akash Kobal</a>
                                    </p>
                                    <p className="time">20211CSD0116</p>
                                </div>
                                <div className="button-wrap">
                                    <button className="primary-cta">View Profile</button>
                                    <button className="secondary-cta">Mark as present</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card">
                        <div className="container">
                            <div className="right">
                                <div className="text-wrap">
                                    <p className="text-content">
                                        <a className="text-link" href="#">Akash Kobal</a>
                                    </p>
                                    <p className="time">20211CSD0116</p>
                                </div>
                                <div className="button-wrap">
                                    <button className="primary-cta">View Profile</button>
                                    <button className="secondary-cta">Mark as present</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card">
                        <div className="container">
                            <div className="right">
                                <div className="text-wrap">
                                    <p className="text-content">
                                        <a className="text-link" href="#">Akash Kobal</a>
                                    </p>
                                    <p className="time">20211CSD0116</p>
                                </div>
                                <div className="button-wrap">
                                    <button className="primary-cta">View Profile</button>
                                    <button className="secondary-cta">Mark as present</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card">
                        <div className="container">
                            <div className="right">
                                <div className="text-wrap">
                                    <p className="text-content">
                                        <a className="text-link" href="#">Jane Doe</a> invited you to edit the
                                        <a className="text-link" href="#">Web Design</a> file.
                                    </p>
                                    <p className="time">2 hours ago</p>
                                </div>
                                <div className="button-wrap">
                                    <button className="primary-cta">View Profile</button>
                                    <button className="secondary-cta">Mark as present</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card">
                        <div className="container">
                            <div className="right">
                                <div className="text-wrap">
                                    <p className="text-content">
                                        <a className="text-link" href="#">Jane Doe</a> invited you to edit the
                                        <a className="text-link" href="#">Web Design</a> file.
                                    </p>
                                    <p className="time">2 hours ago</p>
                                </div>
                                <div className="button-wrap">
                                    <button className="primary-cta">View Profile</button>
                                    <button className="secondary-cta">Mark as present</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card">
                        <div className="container">
                            <div className="right">
                                <div className="text-wrap">
                                    <p className="text-content">
                                        <a className="text-link" href="#">Jane Doe</a> invited you to edit the
                                        <a className="text-link" href="#">Web Design</a> file.
                                    </p>
                                    <p className="time">2 hours ago</p>
                                </div>
                                <div className="button-wrap">
                                    <button className="primary-cta">View Profile</button>
                                    <button className="secondary-cta">Mark as present</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card">
                        <div className="container">
                            <div className="right">
                                <div className="text-wrap">
                                    <p className="text-content">
                                        <a className="text-link" href="#">Jane Doe</a> invited you to edit the
                                        <a className="text-link" href="#">Web Design</a> file.
                                    </p>
                                    <p className="time">2 hours ago</p>
                                </div>
                                <div className="button-wrap">
                                    <button className="primary-cta">View Profile</button>
                                    <button className="secondary-cta">Mark as present</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default MarkAttendance