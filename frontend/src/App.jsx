import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';

// Layouts
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Components
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Properties from './pages/Properties';
import PropertyDetails from './pages/PropertyDetails';
import Mess from './pages/Mess';
import MessDetails from './pages/MessDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

// Student Pages
import StudentDashboard from './pages/StudentDashboard';
import FindRoommates from './pages/FindRoommates';
import RoommateDetails from './pages/RoommateDetails';
import Favorites from './pages/Favorites';
import MyReviews from './pages/MyReviews';
import MyReports from './pages/MyReports';
import Chat from './pages/Chat';
import Profile from './pages/Profile';

// Owner Pages
import OwnerDashboard from './pages/OwnerDashboard';
import MyProperties from './pages/MyProperties';
import AddProperty from './pages/AddProperty';
import EditProperty from './pages/EditProperty';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import PropertyVerification from './pages/admin/PropertyVerification';
import MessManagement from './pages/admin/MessManagement';
import ReviewModeration from './pages/admin/ReviewModeration';
import ReportManagement from './pages/admin/ReportManagement';

// Global Styles
import './styles/global.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <Routes>
            {/* Public Layout */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="properties" element={<Properties />} />
              <Route path="properties/:id" element={<PropertyDetails />} />
              <Route path="mess" element={<Mess />} />
              <Route path="mess/:id" element={<MessDetails />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            {/* Student Protected Layout */}
            <Route
              element={
                <ProtectedRoute allowedRoles={['student', 'admin']}>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="student/dashboard" element={<StudentDashboard />} />
              <Route path="roommates" element={<FindRoommates />} />
              <Route path="roommates/:id" element={<RoommateDetails />} />
              <Route path="favorites" element={<Favorites />} />
              <Route path="my-reviews" element={<MyReviews />} />
              <Route path="my-reports" element={<MyReports />} />
              <Route path="profile" element={<Profile />} />
            </Route>

            {/* Shared chat for students, owners, and admins */}
            <Route
              path="chat"
              element={
                <ProtectedRoute allowedRoles={['student', 'owner', 'admin']}>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Chat />} />
            </Route>

            {/* Owner Protected Layout */}
            <Route
              path="owner"
              element={
                <ProtectedRoute allowedRoles={['owner', 'admin']}>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<OwnerDashboard />} />
              <Route path="properties" element={<MyProperties />} />
              <Route path="properties/new" element={<AddProperty />} />
              <Route path="properties/:id/edit" element={<EditProperty />} />
            </Route>

            {/* Admin Protected Layout */}
            <Route
              path="admin"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="properties" element={<PropertyVerification />} />
              <Route path="mess" element={<MessManagement />} />
              <Route path="reviews" element={<ReviewModeration />} />
              <Route path="reports" element={<ReportManagement />} />
            </Route>
          </Routes>
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
