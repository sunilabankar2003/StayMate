import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { propertyService } from '../services/propertyService';
import { useAuth } from '../context/AuthContext';
import {
  Building,
  CheckCircle,
  Clock,
  XCircle,
  MessageSquare,
  Star,
  PlusCircle,
  Eye,
  Edit2,
  Trash2,
} from 'lucide-react';

const OwnerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOwnerData = async () => {
    try {
      setLoading(true);
      const [statsRes, propsRes] = await Promise.all([
        propertyService.getOwnerStats(),
        propertyService.getMyProperties(),
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (propsRes.success) setProperties(propsRes.data || []);
    } catch (err) {
      console.error('Owner dashboard error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwnerData();
  }, []);

  const handleToggleAvailability = async (id) => {
    try {
      await propertyService.toggleAvailability(id);
      fetchOwnerData();
    } catch (err) {
      alert(err.message || 'Action failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this property? This cannot be undone.')) return;
    try {
      await propertyService.deleteProperty(id);
      fetchOwnerData();
    } catch (err) {
      alert(err.message || 'Failed to delete property');
    }
  };

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1>Owner Dashboard</h1>
          <p>Manage your accommodation listings, track tenant inquiries, and monitor reviews.</p>
        </div>
        <Link to="/owner/properties/new" className="btn btn-primary">
          <PlusCircle size={18} />
          <span>Add New Property</span>
        </Link>
      </div>

      {/* Metrics Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">
            <Building size={24} />
          </div>
          <div className="stat-info">
            <h4>Total Listings</h4>
            <div className="stat-number">{stats?.totalProperties || 0}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <CheckCircle size={24} />
          </div>
          <div className="stat-info">
            <h4>Approved & Live</h4>
            <div className="stat-number">{stats?.approvedProperties || 0}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon amber">
            <Clock size={24} />
          </div>
          <div className="stat-info">
            <h4>Pending Verification</h4>
            <div className="stat-number">{stats?.pendingProperties || 0}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">
            <MessageSquare size={24} />
          </div>
          <div className="stat-info">
            <h4>Tenant Inquiries</h4>
            <div className="stat-number">{stats?.totalInquiries || 0}</div>
          </div>
        </div>
      </div>

      {/* Properties Table */}
      <div className="card" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>My Properties</h3>
          <Link to="/owner/properties" className="btn btn-outline btn-sm">
            View All ({properties.length})
          </Link>
        </div>

        {loading ? (
          <div className="spinner"></div>
        ) : properties.length > 0 ? (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Property</th>
                  <th>Type & Rent</th>
                  <th>Verification</th>
                  <th>Availability</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {properties.slice(0, 5).map((prop) => (
                  <tr key={prop._id}>
                    <td>
                      <div style={{ fontWeight: 700 }}>{prop.title}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {prop.locality}, {prop.city}
                      </div>
                    </td>
                    <td>
                      <div><strong>₹{prop.monthlyRent?.toLocaleString()}</strong> / mo</div>
                      <span className="badge badge-primary">{prop.propertyType}</span>
                    </td>
                    <td>
                      {prop.verificationStatus === 'approved' ? (
                        <span className="badge badge-success">Approved</span>
                      ) : prop.verificationStatus === 'rejected' ? (
                        <span className="badge badge-danger" title={prop.rejectionReason}>Rejected</span>
                      ) : (
                        <span className="badge badge-warning">Pending Review</span>
                      )}
                    </td>
                    <td>
                      <button
                        onClick={() => handleToggleAvailability(prop._id)}
                        className={`btn btn-sm ${prop.isAvailable ? 'btn-success' : 'btn-outline'}`}
                        style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                      >
                        {prop.isAvailable ? 'Available' : 'Occupied'}
                      </button>
                    </td>
                    <td>
                      <div className="table-actions">
                        <Link
                          to={`/properties/${prop._id}`}
                          className="btn btn-outline btn-sm"
                          title="View Live Listing"
                        >
                          <Eye size={14} />
                        </Link>
                        <Link
                          to={`/owner/properties/${prop._id}/edit`}
                          className="btn btn-outline btn-sm"
                          title="Edit Property"
                        >
                          <Edit2 size={14} />
                        </Link>
                        <button
                          onClick={() => handleDelete(prop._id)}
                          className="btn btn-outline btn-sm"
                          style={{ color: 'var(--danger)' }}
                          title="Delete Property"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <Building className="empty-state-icon" />
            <h3>No property listings added yet</h3>
            <p>Start receiving inquiries from students and techies by creating your first listing.</p>
            <Link to="/owner/properties/new" className="btn btn-primary btn-sm">
              List Property Now
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboard;
