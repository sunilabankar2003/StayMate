import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { propertyService } from '../services/propertyService';
import { Building, PlusCircle, Eye, Edit2, Trash2, Filter } from 'lucide-react';

const MyProperties = () => {
  const [properties, setProperties] = useState([]);
  const [filterStatus, setFilterStatus] = useState('All');
  const [loading, setLoading] = useState(true);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const res = await propertyService.getMyProperties();
      if (res.success) {
        setProperties(res.data || []);
      }
    } catch (err) {
      console.error('Fetch owner properties error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleToggle = async (id) => {
    try {
      await propertyService.toggleAvailability(id);
      fetchProperties();
    } catch (err) {
      alert(err.message || 'Action failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this property? All associated reviews and favorites will be permanently removed.')) return;
    try {
      await propertyService.deleteProperty(id);
      fetchProperties();
    } catch (err) {
      alert(err.message || 'Failed to delete property');
    }
  };

  const filtered = properties.filter((p) => {
    if (filterStatus === 'All') return true;
    return p.verificationStatus === filterStatus;
  });

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1>Manage Accommodations</h1>
          <p>Review the approval status, availability, and details of all your listings.</p>
        </div>
        <Link to="/owner/properties/new" className="btn btn-primary">
          <PlusCircle size={18} />
          <span>Add Property</span>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {['All', 'approved', 'pending', 'rejected'].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`btn btn-sm ${filterStatus === st ? 'btn-primary' : 'btn-outline'}`}
            style={{ textTransform: 'capitalize' }}
          >
            {st} ({properties.filter((p) => st === 'All' || p.verificationStatus === st).length})
          </button>
        ))}
      </div>

      {/* Properties Table */}
      <div className="card" style={{ padding: '1.5rem' }}>
        {loading ? (
          <div className="spinner"></div>
        ) : filtered.length > 0 ? (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Title & Location</th>
                  <th>Type</th>
                  <th>Rent & Deposit</th>
                  <th>Verification Status</th>
                  <th>Booking Availability</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((prop) => (
                  <tr key={prop._id}>
                    <td>
                      <div style={{ fontWeight: 700 }}>{prop.title}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {prop.address}, {prop.locality}, {prop.city}
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-primary">{prop.propertyType}</span>
                    </td>
                    <td>
                      <div><strong>₹{prop.monthlyRent?.toLocaleString()}</strong>/mo</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Deposit: ₹{prop.securityDeposit?.toLocaleString()}
                      </div>
                    </td>
                    <td>
                      {prop.verificationStatus === 'approved' ? (
                        <span className="badge badge-success">Approved</span>
                      ) : prop.verificationStatus === 'rejected' ? (
                        <div>
                          <span className="badge badge-danger">Rejected</span>
                          {prop.rejectionReason && (
                            <div style={{ fontSize: '0.75rem', color: 'var(--danger)', marginTop: '2px' }}>
                              {prop.rejectionReason}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="badge badge-warning">Pending Review</span>
                      )}
                    </td>
                    <td>
                      <button
                        onClick={() => handleToggle(prop._id)}
                        className={`btn btn-sm ${prop.isAvailable ? 'btn-success' : 'btn-outline'}`}
                        style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
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
                          title="Edit Listing"
                        >
                          <Edit2 size={14} />
                        </Link>
                        <button
                          onClick={() => handleDelete(prop._id)}
                          className="btn btn-outline btn-sm"
                          style={{ color: 'var(--danger)' }}
                          title="Delete Listing"
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
            <h3>No properties found for this filter</h3>
            <p>Try switching to another tab or add a new property listing.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProperties;
