import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import {
  Home,
  Building,
  Users,
  Utensils,
  MessageSquare,
  Bookmark,
  User as UserIcon,
  LogOut,
  Shield,
  Menu,
  X,
  PlusCircle,
  LayoutDashboard,
} from "lucide-react";
import "../styles/navbar.css";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { unreadCount } = useSocket();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
    navigate("/login");
  };

  const getDashboardPath = () => {
    if (!user) return "/login";
    if (user.role === "admin") return "/admin";
    if (user.role === "owner") return "/owner/dashboard";
    return "/student/dashboard";
  };

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        {/* Brand Logo */}
        <Link
          to="/"
          className="brand-logo"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div className="brand-icon">
            <Home size={20} />
          </div>
          <span>StayMate</span>
          <span className="brand-badge"></span>
        </Link>

        {/* Desktop Nav Links */}
        <ul className="nav-links">
          <li>
            <NavLink
              to="/properties"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              <Building size={18} />
              <span>Properties</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/roommates"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              <Users size={18} />
              <span>Roommates</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/mess"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              <Utensils size={18} />
              <span>Mess & Tiffin</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              <span>About</span>
            </NavLink>
          </li>
        </ul>

        {/* Action Controls */}
        <div className="nav-actions">
          {isAuthenticated && user ? (
            <>
              {/* Quick Chat Link */}
              <Link
                to="/chat"
                className="btn btn-outline btn-sm"
                title="Messages"
                style={{ position: "relative" }}
              >
                <MessageSquare size={18} />
                {unreadCount > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: "-4px",
                      right: "-4px",
                      background: "var(--danger)",
                      color: "white",
                      fontSize: "0.65rem",
                      width: "16px",
                      height: "16px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 800,
                    }}
                  >
                    {unreadCount}
                  </span>
                )}
              </Link>

              {/* Owner quick add button */}
              {user.role === "owner" && (
                <Link
                  to="/owner/properties/new"
                  className="btn btn-primary btn-sm"
                >
                  <PlusCircle size={16} />
                  <span>List Property</span>
                </Link>
              )}

              {/* User Dropdown */}
              <div className="user-menu-wrapper">
                <button
                  className="user-menu-btn"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  aria-label="User menu"
                >
                  <div className="user-avatar">
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <span className="user-name">{user.name.split(" ")[0]}</span>
                </button>

                {dropdownOpen && (
                  <div className="user-dropdown">
                    <div className="dropdown-header">
                      <div className="dropdown-role">{user.role}</div>
                      <div className="dropdown-email">{user.email}</div>
                    </div>

                    <Link
                      to={getDashboardPath()}
                      className="dropdown-item"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <LayoutDashboard size={16} />
                      <span>Dashboard</span>
                    </Link>

                    <Link
                      to="/profile"
                      className="dropdown-item"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <UserIcon size={16} />
                      <span>My Profile</span>
                    </Link>

                    {user.role === "student" && (
                      <Link
                        to="/favorites"
                        className="dropdown-item"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <Bookmark size={16} />
                        <span>Saved Properties</span>
                      </Link>
                    )}

                    {user.role === "admin" && (
                      <Link
                        to="/admin"
                        className="dropdown-item"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <Shield size={16} />
                        <span>Admin Console</span>
                      </Link>
                    )}

                    <button
                      className="dropdown-item danger"
                      onClick={handleLogout}
                    >
                      <LogOut size={16} />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline btn-sm">
                Log In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            className="mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer">
          <NavLink
            to="/properties"
            className="nav-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            <Building size={20} />
            <span>Search Properties</span>
          </NavLink>
          <NavLink
            to="/roommates"
            className="nav-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            <Users size={20} />
            <span>Find Roommates</span>
          </NavLink>
          <NavLink
            to="/mess"
            className="nav-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            <Utensils size={20} />
            <span>Mess & Tiffin Services</span>
          </NavLink>
          <NavLink
            to="/about"
            className="nav-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span>About StayMate</span>
          </NavLink>
          {isAuthenticated && (
            <NavLink
              to={getDashboardPath()}
              className="nav-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              <LayoutDashboard size={20} />
              <span>Go to Dashboard</span>
            </NavLink>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
