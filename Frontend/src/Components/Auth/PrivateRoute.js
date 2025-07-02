import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({ children, role }) => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');
    const location = useLocation();

    if (!token) {
        return <Navigate to="/auth/login" replace state={{ from: location }} />;
    }

    if (role && userRole !== role) {
        return <Navigate to="/auth/login" replace />;
    }

    return children;
};

export default PrivateRoute;
