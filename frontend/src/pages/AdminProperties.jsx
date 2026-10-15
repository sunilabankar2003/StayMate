import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  ShieldCheck,
  Bell,
  Home,
  Building2,
  MapPin,
  CheckCircle,
  Clock,
  XCircle,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

function AdminProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        "http://localhost:5000/api/admin/properties",
        {
          withCredentials: true,
        },
      );

      setProperties(response.data.properties || []);
    } catch (error) {
      console.error("Failed to fetch properties:", error);

      setError(error.response?.data?.message || "Failed to load properties.");
    } finally {
      setLoading(false);
    }
  };

  const getStatus = (property) => {
    if (property.isVerified || property.verificationStatus === "approved") {
      return "approved";
    }

    if (property.verificationStatus === "rejected") {
      return "rejected";
    }

    return "pending";
  };

  const statusLabel = {
    approved: "Approved",
    pending: "Pending",
    rejected: "Rejected",
  };

  return (
    <div className="admin-dashboard">
      {/* Navbar */}
      <header className="admin-navbar">
        <div className="admin-navbar-inner">
          <Link to="/admin-dashboard" className="admin-logo">
            <ShieldCheck size={22} />
            StayMate
          </Link>

          <nav className="admin-nav-links">
            <Link to="/admin-dashboard">Dashboard</Link>

            <Link to="/admin/properties" className="active">
              Properties
            </Link>

            <Link to="/profile">Profile</Link>
          </nav>

          <div className="admin-nav-actions">
            <button className="admin-icon-btn" type="button">
              <Bell size={19} />
            </button>

            <Link to="/profile" className="admin-avatar">
              A
            </Link>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="admin-dashboard-container">
        {/* Page Header */}
        <section className="admin-properties-header">
          <div>
            <Link to="/admin-dashboard" className="admin-back-link">
              <ArrowLeft size={15} />
              Back to Dashboard
            </Link>

            <div className="admin-page-title-row">
              <div>
                <span className="admin-welcome-label">PROPERTY MANAGEMENT</span>

                <h1>All Properties</h1>

                <p>Review and manage all property listings on StayMate.</p>
              </div>

              <div className="admin-property-count">
                <Building2 size={17} />
                {properties.length} Properties
              </div>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="admin-property-toolbar">
          <div className="admin-filter-tabs">
            <button className="active">All</button>

            <button>Pending</button>

            <button>Approved</button>

            <button>Rejected</button>
          </div>

          <div className="admin-property-search">
            <input type="text" placeholder="Search properties..." />
          </div>
        </section>

        {/* Error */}
        {error && <div className="admin-dashboard-error">{error}</div>}

        {/* Properties */}
        <section className="admin-all-properties-card">
          {loading ? (
            <div className="admin-properties-loading">
              Loading properties...
            </div>
          ) : properties.length === 0 ? (
            <div className="admin-empty-state">
              <div className="admin-empty-icon">
                <Building2 size={28} />
              </div>

              <h3>No properties found</h3>

              <p>There are currently no properties to display.</p>
            </div>
          ) : (
            <div className="admin-properties-list">
              {properties.map((property) => {
                const status = getStatus(property);

                return (
                  <div className="admin-property-row" key={property._id}>
                    {/* Image */}
                    <div className="admin-property-image">
                      {property.images?.length > 0 ? (
                        <img src={property.images[0]} alt={property.title} />
                      ) : (
                        <Building2 size={27} />
                      )}
                    </div>

                    {/* Details */}
                    <div className="admin-property-details">
                      <div className="admin-property-title">
                        <h3>{property.title}</h3>

                        <span className={`admin-status-badge ${status}`}>
                          {status === "approved" && <CheckCircle size={13} />}

                          {status === "pending" && <Clock size={13} />}

                          {status === "rejected" && <XCircle size={13} />}

                          {statusLabel[status]}
                        </span>
                      </div>

                      <div className="admin-property-location">
                        <MapPin size={14} />

                        {property.location?.area
                          ? `${property.location.area}, `
                          : ""}

                        {property.location?.city || "Location not specified"}
                      </div>

                      <div className="admin-property-meta">
                        <strong>₹{property.rent}</strong>

                        <span>{property.type}</span>

                        {property.roomType && <span>{property.roomType}</span>}
                      </div>
                    </div>

                    {/* Owner */}
                    <div className="admin-property-owner">
                      <span>OWNER</span>

                      <strong>{property.owner?.name || "Unknown"}</strong>

                      <small>{property.owner?.email || ""}</small>
                    </div>

                    {/* Action */}
                    <div className="admin-property-row-actions">
                      <Link
                        to={`/properties/${property._id}`}
                        className="admin-view-btn"
                      >
                        View
                        <ArrowRight size={15} />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default AdminProperties;
