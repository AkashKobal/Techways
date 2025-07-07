import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

// Auth and Common Pages
import Login from './Components/Auth/Login';
import Home from './Pages/Home';
import NotFound from './Pages/NotFound';
import ProfilePage from './Components/ProfilePage';

// Student Components
import ViewAllStudents from './Components/Students/ViewAllStudents';
import ManageStudents from './Components/Students/ManageStudents';

// Course Components
import AddCourse from './Components/Courses/AddCourse';
import ViewAllCourse from './Components/Courses/ViewAllCourse';
import ManageCourse from './Components/Courses/ManageCourse';
import UpdateCourse from './Components/Courses/UpdateCourse';

// Route Protection
import PrivateRoute from './Components/Auth/PrivateRoute';
import Register from './Components/Auth/Register';
import Dashboard from './Components/Users/Dashboard';
import ManageUsers from './Components/Users/ManageUsers';
import ForgotPassword from './Components/Auth/ForgotPassword';
import VerifyEmail from './Components/Auth/VerifyEmail';
import ChangePassword from './Components/Auth/ChangePassword';
import ConsolidatedReport from './Components/Courses/ConsolidatedReport';

function App() {
  const getRole = () => localStorage.getItem('role');

  return (
    <BrowserRouter>
      <Routes>
        {/* test routes  */}
        {/* <Route path="/test" element={<TestDashboard/>} /> */}

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/manage-users" element={<ManageUsers />} />


        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />
        <Route path="/auth/change-password" element={<ChangePassword />} />
        <Route path="/auth/verify-email" element={<VerifyEmail />} />

        {/* Protected Common Routes */}
        <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />



        <Route path="/student/viewAllStudents" element={
          <PrivateRoute>
            {getRole() === "ADMIN" || getRole() === "FACULTY" ? <ViewAllStudents /> : <Navigate to="/profile" replace />}
          </PrivateRoute>
        } />
        <Route path="/student/manageStudents" element={
          <PrivateRoute>
            {getRole() === "ADMIN" || getRole() === "FACULTY" ? <ManageStudents /> : <Navigate to="/profile" replace />}
          </PrivateRoute>
        } />



        {/* Course Management */}
        <Route path="/course/addCourse" element={
          <PrivateRoute>
            {getRole() === "ADMIN" || getRole() === "FACULTY" ? <AddCourse /> : <Navigate to="/profile" replace />}
          </PrivateRoute>
        } />
        <Route path="/course/viewAllCourse" element={
          <PrivateRoute>
            {getRole() === "ADMIN" || getRole() === "FACULTY" ? <ViewAllCourse /> : <Navigate to="/profile" replace />}
          </PrivateRoute>
        } />
        <Route path="/course/manageCourse" element={
          <PrivateRoute>
            {getRole() === "ADMIN" || getRole() === "FACULTY" ? <ManageCourse /> : <Navigate to="/profile" replace />}
          </PrivateRoute>
        } />
        <Route path="/course/updateCourse/:id" element={
          <PrivateRoute>
            {getRole() === "ADMIN" || getRole() === "FACULTY" ? <UpdateCourse /> : <Navigate to="/profile" replace />}
          </PrivateRoute>
        } />
        <Route path="/course/report" element={
          <PrivateRoute>
            {getRole() === "ADMIN" || getRole() === "FACULTY" ? <ConsolidatedReport /> : <Navigate to="/profile" replace />}
          </PrivateRoute>
        } />


        {/* Fallback Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
