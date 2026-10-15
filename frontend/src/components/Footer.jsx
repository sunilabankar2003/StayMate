import React from "react";
import { Link } from "react-router-dom";
import { Home, ShieldCheck, Heart } from "lucide-react";
import "../styles/footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Info */}
          <div className="footer-brand">
            <h3>
              <Home size={22} color="#3b82f6" />
              <span>StayMate</span>
            </h3>
            <p>
              A centralized web platform for students and working professionals
              to find PGs, hostels, flats, compatible roommates, and hygienic
              mess services.
            </p>
            {/* <div className="footer-badge">
              <ShieldCheck size={14} style={{ display: 'inline', marginRight: '4px' }} />
              MCA Mini Project 2026 Submission
            </div> */}
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4>Accommodations</h4>
            <ul className="footer-links">
              <li>
                <Link to="/properties?propertyType=PG">Paying Guest (PG)</Link>
              </li>
              <li>
                <Link to="/properties?propertyType=Flat">Rental Flats</Link>
              </li>
              <li>
                <Link to="/properties?propertyType=Hostel">
                  Student Hostels
                </Link>
              </li>
              <li>
                <Link to="/properties">All Listings</Link>
              </li>
            </ul>
          </div>

          {/* Discovery Links */}
          <div className="footer-col">
            <h4>Discovery</h4>
            <ul className="footer-links">
              <li>
                <Link to="/roommates">Find Roommates</Link>
              </li>
              <li>
                <Link to="/mess">Mess & Tiffin Services</Link>
              </li>
              <li>
                <Link to="/about">About StayMate</Link>
              </li>
              <li>
                <Link to="/register">Create Free Account</Link>
              </li>
            </ul>
          </div>

          {/* For Property Owners */}
          <div className="footer-col">
            <h4>For Owners & Admins</h4>
            <ul className="footer-links">
              <li>
                <Link to="/register?role=owner">List Your Property</Link>
              </li>
              <li>
                <Link to="/owner/dashboard">Owner Dashboard</Link>
              </li>
              <li>
                <Link to="/login">Owner & Admin Sign In</Link>
              </li>
              <li>
                <Link to="/admin">Administrator Portal</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} StayMate. All rights
            reserved.
          </p>
          <p style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            Built with React, Express, MongoDB & Socket.IO{" "}
            <Heart size={14} color="#ef4444" fill="#ef4444" />
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
