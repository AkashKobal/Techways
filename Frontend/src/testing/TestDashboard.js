import React, { useEffect, useState } from 'react';
import SideBar from '../Components/SideBar'
import Header from '../Components/Header'
import "../../assets/css/dashboard.css";
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const TestDashboard = () => {
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

    const chartData = [
        { name: 'Admin', value: adminCount },
        { name: 'User', value: totalUsers - adminCount },
    ];

    const COLORS = ['#6366f1', '#34d399'];

    return (
        <>
            <SideBar />
            <Header />
            <div className="dashboard-container">
                <div className="heading">
                    <h2 className="h3 fw-bold mb-4 text-start">Test Dashboard</h2>
                </div>
                <div className="cards-wrapper">
                    <div className="card">
                        <p className='card-label'>Total Users</p>
                        <p className='card-value'>{totalUsers}</p>
                    </div>
                    <div className="card">
                        <p className='card-label'>Admins</p>
                        <p className='card-value'>{adminCount}</p>
                    </div>
                    <div className="card">
                        <p className='card-label'>Verified</p>
                        <p className='card-value'>{verifiedCount}</p>
                    </div>
                    <div className="card">
                        <p className='card-label'>Active</p>
                        <p className='card-value'>{activeCount}</p>
                    </div>

                    {/* Charts & Table */}
                    <div className="chats-tables-wrapper">
                        {/* Pie Chart */}
                        <div className="col-lg-6">
                            <div className="card shadow animated-card">
                                <div className="card-body">
                                    <h5 className="card-title mb-2">User Roles</h5>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                                                data={chartData}
                                                dataKey="value"
                                                nameKey="name"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={100}
                                                label
                                            >
                                                {chartData.map((entry, index) => (
                                                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                        {/* Table */}
                        <div className="recent-users">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">Recent Users</h5>
                                    <table className="table">
                                        <thead className="table-primary">
                                            <tr>
                                                <th>Name</th>
                                                <th>Email</th>
                                                <th>Role</th>
                                            </tr>
                                        </thead>
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
            </div>
        </>
    )
}

export default TestDashboard