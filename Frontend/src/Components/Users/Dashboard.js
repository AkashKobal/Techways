import React, { useEffect, useState } from 'react';
import SideBar from '../SideBar';
import Header from '../Header';
import "../../assets/css/dashboard.css";
import {
    PieChart, Pie, Tooltip, Cell, ResponsiveContainer, Legend,
    BarChart, Bar, XAxis, YAxis,
    LineChart, Line,
    AreaChart, Area,
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
    ComposedChart, CartesianGrid
} from 'recharts';
import axios from 'axios';


const Dashboard = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchAllUsers();
    }, []);

    const fetchAllUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get("http://localhost:8080/admin/get-all-users", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(res.data?.usersList || []);
        } catch (err) {
            console.error("Error fetching users:", err);
        }
    };

    const totalUsers = users.length;
    const adminCount = users.filter((u) => u.role === 'ADMIN').length;
    const verifiedCount = users.filter((u) => u.verified).length;
    const activeCount = users.filter((u) => u.active).length;
    const studentCount = users.filter((u) => u.role === 'STUDENT').length;
    const facultyCount = users.filter((u) => u.role === 'FACULTY').length;

    const chartData = [
        { name: 'Admin', value: adminCount },
        { name: 'Faculty', value: facultyCount },
        { name: 'Student', value: studentCount },
    ];

    const COLORS = ['#6366f1', '#34d399', '#fa8066'];

    const barChartData = [
        { name: "Total", value: totalUsers },
        { name: "Admins", value: adminCount },
        { name: "Faculty", value: facultyCount },
        { name: "Students", value: studentCount },
        { name: "Verified", value: verifiedCount },
        { name: "Active", value: activeCount },
    ];

    const groupedChartData = [
        {
            role: "Admins",
            Active: users.filter(u => u.role === "ADMIN" && u.active).length,
            Verified: users.filter(u => u.role === "ADMIN" && u.verified).length,
        },
        {
            role: "Faculty",
            Active: users.filter(u => u.role === "FACULTY" && u.active).length,
            Verified: users.filter(u => u.role === "FACULTY" && u.verified).length,
        },
        {
            role: "Students",
            Active: users.filter(u => u.role === "STUDENT" && u.active).length,
            Verified: users.filter(u => u.role === "STUDENT" && u.verified).length,
        }
    ];

    const stackedChartData = [
        {
            role: "Admins",
            Active: users.filter(u => u.role === "ADMIN" && u.active).length,
            Inactive: users.filter(u => u.role === "ADMIN" && !u.active).length
        },
        {
            role: "Faculty",
            Active: users.filter(u => u.role === "FACULTY" && u.active).length,
            Inactive: users.filter(u => u.role === "FACULTY" && !u.active).length
        },
        {
            role: "Students",
            Active: users.filter(u => u.role === "STUDENT" && u.active).length,
            Inactive: users.filter(u => u.role === "STUDENT" && !u.active).length
        }
    ];

    const lineChartData = [
        { month: 'Jan', users: 20 },
        { month: 'Feb', users: 35 },
        { month: 'Mar', users: 50 },
        { month: 'Apr', users: 65 },
        { month: 'May', users: 80 },
        { month: 'Jun', users: 95 },
    ];

    const areaChartData = [
        { label: 'Admins', Active: adminCount, Verified: users.filter(u => u.role === 'ADMIN' && u.verified).length },
        { label: 'Faculty', Active: facultyCount, Verified: users.filter(u => u.role === 'FACULTY' && u.verified).length },
        { label: 'Students', Active: studentCount, Verified: users.filter(u => u.role === 'STUDENT' && u.verified).length },
    ];

    const radarChartData = [
        { role: 'Admins', value: adminCount },
        { role: 'Faculty', value: facultyCount },
        { role: 'Students', value: studentCount },
    ];

    const composedChartData = [
        { role: 'Admin', active: adminCount, verified: verifiedCount },
        { role: 'Faculty', active: facultyCount, verified: users.filter(u => u.role === 'FACULTY' && u.verified).length },
        { role: 'Student', active: studentCount, verified: users.filter(u => u.role === 'STUDENT' && u.verified).length }
    ];


    return (
        <>
            <SideBar />
            <Header />
            <div className="dashboard-container">
                <div className="heading">
                    <h2 className="h3 fw-bold mb-4 text-start">Dashboard</h2>
                </div>
                <div className="cards-wrapper">
                    <div className="card"><p className='card-label'>Total Users</p><p className='card-value'>{totalUsers}</p></div>
                    <div className="card"><p className='card-label'>Admins</p><p className='card-value'>{adminCount}</p></div>
                    <div className="card"><p className='card-label'>Faculty</p><p className='card-value'>{facultyCount}</p></div>
                    <div className="card"><p className='card-label'>Students</p><p className='card-value'>{studentCount}</p></div>
                    <div className="card"><p className='card-label'>Verified Users</p><p className='card-value'>{verifiedCount}</p></div>
                    <div className="card"><p className='card-label'>Active Users</p><p className='card-value'>{activeCount}</p></div>
                    <div className="card"><p className='card-label'>Inactive Users</p><p className='card-value'>{totalUsers - activeCount}</p></div>
                    <div className="card"><p className='card-label'>Total Roles</p><p className='card-value'>{chartData.length}</p></div>
                </div>

                <div className="chats-tables-wrapper">
                    <div className="col-lg-6">
                        <div className="card shadow animated-card">
                            <div className="card-body">
                                <h5 className="card-title mb-2">User Roles</h5>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                            {chartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-6">
                        <div className="card shadow animated-card">
                            <div className="card-body">
                                <h5 className="card-title mb-2">User Statistics</h5>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                        <XAxis dataKey="name" stroke="#555" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="value" fill="#6366f1" radius={[5, 5, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="card shadow animated-card">
                            <div className="card-body">
                                <h5 className="card-title mb-2">Grouped Bar Chart</h5>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart
                                        data={groupedChartData}
                                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                    >
                                        <XAxis dataKey="role" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="Active" fill="#34d399" />
                                        <Bar dataKey="Verified" fill="#6366f1" />
                                    </BarChart>
                                </ResponsiveContainer>

                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="card shadow animated-card">
                            <div className="card-body">
                                <h5 className="card-title mb-2">User Growth</h5>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={lineChartData}>
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <Tooltip />
                                        <Line type="monotone" dataKey="users" stroke="#6366f1" strokeWidth={3} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="card shadow animated-card">
                            <div className="card-body">
                                <h5 className="card-title mb-2">Active vs Verified</h5>
                                <ResponsiveContainer width="100%" height={300}>
                                    <AreaChart data={areaChartData}>
                                        <XAxis dataKey="label" />
                                        <YAxis />
                                        <Tooltip />
                                        <Area type="monotone" dataKey="Active" stackId="1" stroke="#34d399" fill="#a7f3d0" />
                                        <Area type="monotone" dataKey="Verified" stackId="1" stroke="#6366f1" fill="#c7d2fe" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="card shadow animated-card">
                            <div className="card-body">
                                <h5 className="card-title mb-2">Role Distribution</h5>
                                <ResponsiveContainer width="100%" height={300}>
                                    <RadarChart outerRadius={90} data={radarChartData}>
                                        <PolarGrid />
                                        <PolarAngleAxis dataKey="role" />
                                        <PolarRadiusAxis />
                                        <Radar dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} />
                                        <Tooltip />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="card shadow animated-card">
                            <div className="card-body">
                                <h5 className="card-title mb-2">Composed User Chart</h5>
                                <ResponsiveContainer width="100%" height={300}>
                                    <ComposedChart data={composedChartData}>
                                        <XAxis dataKey="role" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <CartesianGrid stroke="#f5f5f5" />
                                        <Area type="monotone" dataKey="verified" fill="#c7d2fe" stroke="#6366f1" />
                                        <Bar dataKey="active" barSize={20} fill="#34d399" />
                                        <Line type="monotone" dataKey="verified" stroke="#6366f1" />
                                    </ComposedChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-6">
                        <div className="card shadow animated-card">
                            <div className="card-body">
                                <h5 className="card-title mb-2">Stacked Bar Chart: Roles vs Statuses</h5>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart
                                        data={stackedChartData}
                                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                    >
                                        <XAxis dataKey="role" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="Active" stackId="status" fill="#34d399" animationDuration={1000} />
                                        <Bar dataKey="Inactive" stackId="status" fill="#f87171" animationDuration={1000} />
                                    </BarChart>
                                </ResponsiveContainer>


                            </div>
                        </div>
                    </div>

                    <div className="recent-users">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Recent Users</h5>
                                <table className="table">
                                    <thead><tr><th>Name</th><th>Email</th><th>Role</th></tr></thead>
                                    <tbody>
                                        {users.slice(0, 5).map((user) => (
                                            <tr key={user.id}>
                                                <td>{user.name}</td>
                                                <td>{user.email}</td>
                                                <td>{user.role}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Dashboard;