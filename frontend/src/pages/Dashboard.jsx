import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import {
  Home,
  Building2,
  Plus,
  MessageCircle,
  User,
  Bell,
  MapPin,
  ArrowRight,
  ClipboardList,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";

function Dashboard() {
  
  const [user, setUser] = useState(null);
  const [properties, setProperties] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      // Get logged-in user
      const userResponse = await axios.get(
        "http://localhost:5000/api/auth/me",
        {
          withCredentials: true,
        },
      );

      setUser(userResponse.data.user);

      // Get only this owner's properties
      const propertiesResponse = await axios.get(
        "http://localhost:5000/api/properties/my",
        {
          withCredentials: true,
        },
      );

      setProperties(propertiesResponse.data.properties || []);
    } catch (error) {
      console.error("Dashboard error:", error);

      setError(error.response?.data?.message || "Failed to load dashboard.");
    } finally {
      setLoading(false);
    }
  };

  const totalProperties = properties.length;

  const verifiedProperties = properties.filter(
    (property) =>
      property.isVerified === true ||
      property.verificationStatus === "approved",
  ).length;

  const pendingProperties = properties.filter(
    (property) => property.verificationStatus === "pending",
  ).length;

  const rejectedProperties = properties.filter(
    (property) => property.verificationStatus === "rejected",
  ).length;

  const getInitial = () => {
    if (!user?.name) return "U";

    return user.name.charAt(0).toUpperCase();
  };

  if (loading) {
    return (
      <div className="owner-dashboard">
        <div className="owner-dashboard-loading">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="owner-dashboard">
      {/* Navbar */}
      <header className="owner-navbar">
        <div className="owner-navbar-inner">
          <Link to="/dashboard" className="owner-logo">
            <Home size={22} />
            StayMate
          </Link>

          <nav className="owner-nav-links">
            <Link to="/dashboard" className="active">
              Dashboard
            </Link>

            <Link to="/properties">Properties</Link>

            <Link to="/profile">Profile</Link>
          </nav>

          <div className="owner-nav-actions">
            <button className="owner-icon-btn" type="button">
              <Bell size={19} />
            </button>

            <Link to="/profile" className="owner-avatar">
              {user?.profilePhoto ? (
                <img src={user.profilePhoto} alt={user.name} />
              ) : (
                getInitial()
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="owner-dashboard-container">
        {/* Welcome */}
        <section className="owner-welcome">
          <div>
            <span className="owner-welcome-label">OWNER DASHBOARD</span>

            <h1>Welcome, {user?.name || "Owner"}.</h1>

            <p>
              Manage your properties and accommodation listings from one place.
            </p>
          </div>

          <Link to="/create-property" className="owner-add-property-btn">
            <Plus size={18} />
            Add Property
          </Link>
        </section>

        {/* Error */}
        {error && <div className="owner-dashboard-error">{error}</div>}

        {/* Stats */}
        <section className="owner-stats-grid">
          {/* Total */}
          <div className="owner-stat-card">
            <div className="owner-stat-icon blue">
              <Building2 size={21} />
            </div>

            <div>
              <span>Total Properties</span>
              <strong>{totalProperties}</strong>
            </div>
          </div>

          {/* Verified */}
          <div className="owner-stat-card">
            <div className="owner-stat-icon green">
              <CheckCircle size={21} />
            </div>

            <div>
              <span>Verified Properties</span>
              <strong>{verifiedProperties}</strong>
            </div>
          </div>

          {/* Pending */}
          <div className="owner-stat-card">
            <div className="owner-stat-icon orange">
              <Clock size={21} />
            </div>

            <div>
              <span>Pending Approval</span>
              <strong>{pendingProperties}</strong>
            </div>
          </div>

          {/* Rejected */}
          <div className="owner-stat-card">
            <div className="owner-stat-icon red">
              <XCircle size={21} />
            </div>

            <div>
              <span>Rejected</span>
              <strong>{rejectedProperties}</strong>
            </div>
          </div>
        </section>

        {/* Main Grid */}
        <div className="owner-dashboard-grid">
          {/* My Properties */}
          <section className="owner-properties-card">
            <div className="owner-section-header">
              <div>
                <h2>My Properties</h2>

                <p>Properties created by your account.</p>
              </div>

              <Link to="/properties">
                View All
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* No Properties */}
            {properties.length === 0 ? (
              <div className="owner-empty-properties">
                <div className="owner-empty-icon">
                  <Building2 size={28} />
                </div>

                <h3>No properties yet</h3>

                <p>You haven't created any property listings.</p>

                <Link to="/create-property" className="owner-empty-btn">
                  <Plus size={17} />
                  Add Your First Property
                </Link>
              </div>
            ) : (
              <div className="owner-property-list">
                {properties.map((property) => (
                  <div className="owner-property-item" key={property._id}>
                    <div className="owner-property-image">
                      {property.images && property.images.length > 0 ? (
                        <img src={property.images[0]} alt={property.title} />
                      ) : (
                        <Building2 size={28} />
                      )}
                    </div>

                    <div className="owner-property-info">
                      <div className="owner-property-title-row">
                        <h3>{property.title}</h3>

                        {property.verificationStatus === "approved" ||
                        property.isVerified ? (
                          <span className="verified-badge">
                            <CheckCircle size={13} />
                            Verified
                          </span>
                        ) : property.verificationStatus === "rejected" ? (
                          <span className="rejected-badge">
                            <XCircle size={13} />
                            Rejected
                          </span>
                        ) : (
                          <span className="pending-badge">
                            <Clock size={13} />
                            Pending
                          </span>
                        )}
                      </div>

                      <div className="owner-property-location">
                        <MapPin size={14} />

                        {property.location?.area
                          ? `${property.location.area}, `
                          : ""}

                        {property.location?.city || "Location not specified"}
                      </div>

                      <div className="owner-property-meta">
                        <strong>₹{property.rent}</strong>

                        <span>{property.type}</span>

                        {property.roomType && <span>{property.roomType}</span>}
                      </div>
                    </div>

                    <Link
                      to={`/properties/${property._id}`}
                      className="owner-view-btn"
                    >
                      View
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Quick Actions */}
          <aside className="owner-quick-card">
            <h2>Quick Actions</h2>

            <p>Common actions for your account.</p>

            <Link to="/create-property" className="owner-quick-action">
              <div className="quick-action-icon blue">
                <Plus size={19} />
              </div>

              <div>
                <strong>Add Property</strong>
                <span>Create a new listing</span>
              </div>

              <ArrowRight size={16} />
            </Link>

            <Link to="/properties" className="owner-quick-action">
              <div className="quick-action-icon green">
                <Building2 size={19} />
              </div>

              <div>
                <strong>My Properties</strong>
                <span>View your listings</span>
              </div>

              <ArrowRight size={16} />
            </Link>

            <Link to="/profile" className="owner-quick-action">
              <div className="quick-action-icon purple">
                <User size={19} />
              </div>

              <div>
                <strong>My Profile</strong>
                <span>Update account information</span>
              </div>

              <ArrowRight size={16} />
            </Link>

            <Link to="/messages" className="owner-quick-action">
              <div className="quick-action-icon orange">
                <MessageCircle size={19} />
              </div>

              <div>
                <strong>Messages</strong>
                <span>Talk with users</span>
              </div>

              <ArrowRight size={16} />
            </Link>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
