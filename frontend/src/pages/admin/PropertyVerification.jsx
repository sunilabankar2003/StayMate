import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import Modal from '../../components/Modal';
import { Shield, CheckCircle, XCircle, Eye, Building, Filter } from 'lucide-react';

const PropertyVerification = () => {
  const [properties, setProperties] = useState([]);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [loading, setLoading] = useState(true);

  // Rejection Modal
  const [rejectingProperty, setRejectingProperty] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('Listing does not satisfy address verification standards.');
  const [submittingAction, setSubmittingAction] = useState(false);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const res = await adminService.getAllPropertiesAdmin({ status: statusFilter, limit: 20 });
      if (res.success) {
        setProperties(res.data || []);
      }
    } catch (err) {
      console.error('Fetch properties admin error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [statusFilter]);

  const handleApprove = async (id) => {
    if (!window.confirm('Approve and publish this property listing?')) return;
    try {
      await adminService.verifyProperty(id, 'approved');
      fetchProperties();
    } catch (err) {
      alert(err.message || 'Action failed');
    }
  };

  const handleRejectSubmit = async (e) => {
    e.preventDefault();
    if (!rejectingProperty) return;
    try {
      setSubmittingAction(true);
      await adminService.verifyProperty(rejectingProperty._id, 'rejected', rejectionReason);
      setRejectingProperty(null);
      fetchProperties();
    } catch (err) {
      alert(err.message || 'Action failed');
    } finally {
      setSubmittingAction(false);
    }
  };

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1>Property Verification & Moderation</h1>
          <p>Review new accommodation listings submitted by hosts to maintain platform trust.</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {['pending', 'approved', 'rejected', 'All'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`btn btn-sm ${statusFilter === st ? 'btn-primary' : 'btn-outline'}`}
            style={{ textTransform: 'capitalize' }}
          >
            {st === 'pending' ? 'Pending Review Queue' : st}
          </button>
        ))}
      </div>

      {/* Properties Table */}
      <div className="card" style={{ padding: '1.5rem' }}>
        {loading ? (
          <div className="spinner"></div>
        ) : properties.length > 0 ? (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Property Listing</th>
                  <th>Host Info</th>
                  <th>Type & Rent</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {properties.map((prop) => (
                  <tr key={prop._id}>
                    <td>
                      <div style={{ fontWeight: 700 }}>{prop.title}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {prop.address}, {prop.locality}, {prop.city}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                        Submitted {new Date(prop.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{prop.owner?.name || 'Owner'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {prop.owner?.email} • {prop.owner?.phone}
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
                        <span className="badge badge-danger">Rejected</span>
                      ) : (
                        <span className="badge badge-warning">Pending Review</span>
                      )}
                    </td>
                    <td>
                      <div className="table-actions">
                        <Link
                          to={`/properties/${prop._id}`}
                          className="btn btn-outline btn-sm"
                          title="Inspect Listing"
                        >
                          <Eye size={14} /> View
                        </Link>

                        {prop.verificationStatus !== 'approved' && (
                          <button
                            onClick={() => handleApprove(prop._id)}
                            className="btn btn-success btn-sm"
                            title="Approve Listing"
                          >
                            <CheckCircle size={14} /> Approve
                          </button>
                        )}

                        {prop.verificationStatus !== 'rejected' && (
                          <button
                            onClick={() => setRejectingProperty(prop)}
                            className="btn btn-outline btn-sm"
                            style={{ color: 'var(--danger)' }}
                            title="Reject Listing"
                          >
                            <XCircle size={14} /> Reject
                          </button>
                        )}
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
            <h3>No properties found in this queue</h3>
            <p>All property submissions have been reviewed.</p>
          </div>
        )}
      </div>

      {/* Rejection Modal */}
      <Modal
        isOpen={!!rejectingProperty}
        onClose={() => setRejectingProperty(null)}
        title="Reject Property Listing"
        footer={
          <>
            <button className="btn btn-outline" onClick={() => setRejectingProperty(null)}>
              Cancel
            </button>
            <button
              className="btn btn-danger"
              disabled={submittingAction}
              onClick={handleRejectSubmit}
            >
              {submittingAction ? 'Rejecting...' : 'Confirm Rejection'}
            </button>
          </>
        }
      >
        <form onSubmit={handleRejectSubmit}>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Please state the reason for rejecting <strong>"{rejectingProperty?.title}"</strong>. The host will see this reason in their dashboard.
          </p>

          <div className="form-group">
            <label className="form-label">Rejection Reason</label>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="form-textarea"
              rows={3}
              required
            ></textarea>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PropertyVerification;
