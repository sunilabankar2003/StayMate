import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Building,
  Users,
  Utensils,
  Bookmark,
  MessageSquare,
  Star,
  Flag,
  User,
  PlusCircle,
  Shield,
  BarChart3,
} from 'lucide-react';
import '../styles/dashboard.css';

const DashboardLayout = () => {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />

      <div className="dashboard-layout">
        {/* Sidebar */}
        <aside className="dashboard-sidebar">
          <div className="sidebar-title">
            {user.role === 'admin' ? 'Administration' : user.role === 'owner' ? 'Owner Portal' : 'Student Hub'}
          </div>

          {/* Student Links */}
          {user.role === 'student' && (
            <>
              <NavLink to="/student/dashboard" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </NavLink>
              <NavLink to="/roommates" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                <Users size={18} />
                <span>Find Roommates</span>
              </NavLink>
              <NavLink to="/favorites" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                <Bookmark size={18} />
                <span>Saved Properties</span>
              </NavLink>
              <NavLink to="/my-reviews" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                <Star size={18} />
                <span>My Reviews</span>
              </NavLink>
              <NavLink to="/my-reports" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                <Flag size={18} />
                <span>My Reports</span>
              </NavLink>
              <NavLink to="/chat" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                <MessageSquare size={18} />
                <span>Messages</span>
              </NavLink>
              <NavLink to="/profile" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                <User size={18} />
                <span>Profile & Preferences</span>
              </NavLink>
            </>
          )}

          {/* Owner Links */}
          {user.role === 'owner' && (
            <>
              <NavLink to="/owner/dashboard" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </NavLink>
              <NavLink to="/owner/properties/new" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                <PlusCircle size={18} />
                <span>Add Property</span>
              </NavLink>
              <NavLink to="/owner/properties" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                <Building size={18} />
                <span>My Properties</span>
              </NavLink>
              <NavLink to="/chat" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                <MessageSquare size={18} />
                <span>Inquiries & Chat</span>
              </NavLink>
              <NavLink to="/profile" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                <User size={18} />
                <span>Owner Profile</span>
              </NavLink>
            </>
          )}

          {/* Admin Links */}
          {user.role === 'admin' && (
            <>
              <NavLink to="/admin" end className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                <LayoutDashboard size={18} />
                <span>Overview & Analytics</span>
              </NavLink>
              <NavLink to="/admin/properties" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                <Shield size={18} />
                <span>Verify Properties</span>
              </NavLink>
              <NavLink to="/admin/users" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                <Users size={18} />
                <span>Manage Users</span>
              </NavLink>
              <NavLink to="/admin/mess" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                <Utensils size={18} />
                <span>Mess Management</span>
              </NavLink>
              <NavLink to="/admin/reviews" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                <Star size={18} />
                <span>Review Moderation</span>
              </NavLink>
              <NavLink to="/admin/reports" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                <Flag size={18} />
                <span>User Reports</span>
              </NavLink>
            </>
          )}
        </aside>

        {/* Main Content Area */}
        <main className="dashboard-main">
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default DashboardLayout;
