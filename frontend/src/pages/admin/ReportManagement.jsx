import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import Modal from '../../components/Modal';
import { Flag, CheckCircle, XCircle } from 'lucide-react';

const ReportManagement = () => {
  const [reports, setReports] = useState([]);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [loading, setLoading] = useState(true);

  // Resolution modal
  const [resolvingReport, setResolvingReport] = useState(null);
  const [resolutionStatus, setResolutionStatus] = useState('resolved');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await adminService.getAllReports({ status: statusFilter, limit: 50 });
      if (res.success) {
        setReports(res.data || []);
      }
    } catch (err) {
      console.error('Fetch reports admin error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [statusFilter]);

  const openResolveModal = (report, defaultStatus) => {
    setResolvingReport(report);
    setResolutionStatus(defaultStatus);
    setResolutionNotes(
      defaultStatus === 'resolved'
        ? 'Investigated and appropriate corrective moderation action taken.'
        : 'Reviewed. Listing/content determined to be compliant.'
    );
  };

  const handleResolveSubmit = async (e) => {
    e.preventDefault();
    if (!resolvingReport) return;
    try {
      setSubmitting(true);
      await adminService.resolveReport(resolvingReport._id, resolutionStatus, resolutionNotes);
      setResolvingReport(null);
      fetchReports();
    } catch (err) {
      alert(err.message || 'Action failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1>Content Moderation Reports</h1>
          <p>Investigate and resolve user-submitted reports regarding suspicious listings or policy violations.</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {['pending', 'resolved', 'dismissed', 'All'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`btn btn-sm ${statusFilter === st ? 'btn-primary' : 'btn-outline'}`}
            style={{ textTransform: 'capitalize' }}
          >
            {st === 'pending' ? 'Pending Queue' : st}
          </button>
        ))}
      </div>

      <div className="card" style={{ padding: '1.5rem' }}>
        {loading ? (
          <div className="spinner"></div>
        ) : reports.length > 0 ? (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Type & Reason</th>
                  <th>Details</th>
                  <th>Reporter</th>
                  <th>Status</th>
                  <th>Filed Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((rep) => (
                  <tr key={rep._id}>
                    <td>
                      <span className="badge badge-primary">{rep.reportedItemType}</span>
                      <div style={{ fontWeight: 700, marginTop: '4px' }}>{rep.reason}</div>
                    </td>
                    <td style={{ maxWidth: '280px' }}>
                      <div style={{ fontSize: '0.85rem' }}>{rep.details || 'No additional notes'}</div>
                      {rep.resolutionNotes && (
                        <div style={{ fontSize: '0.75rem', color: '#059669', marginTop: '4px' }}>
                          Resolved note: {rep.resolutionNotes}
                        </div>
                      )}
                    </td>
                    <td>
                      <div>{rep.reporter?.name || 'User'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{rep.reporter?.email}</div>
                    </td>
                    <td>
                      <span className={`badge ${rep.status === 'resolved' ? 'badge-success' : rep.status === 'dismissed' ? 'badge-gray' : 'badge-warning'}`}>
                        {rep.status}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {new Date(rep.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      {rep.status === 'pending' ? (
                        <div className="table-actions">
                          <button
                            onClick={() => openResolveModal(rep, 'resolved')}
                            className="btn btn-success btn-sm"
                            title="Mark Resolved"
                          >
                            <CheckCircle size={14} /> Resolve
                          </button>
                          <button
                            onClick={() => openResolveModal(rep, 'dismissed')}
                            className="btn btn-outline btn-sm"
                            title="Dismiss Report"
                          >
                            <XCircle size={14} /> Dismiss
                          </button>
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          Completed by {rep.resolvedBy?.name || 'Admin'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <Flag className="empty-state-icon" />
            <h3>No reports in this status queue</h3>
            <p>All user reports have been moderated.</p>
          </div>
        )}
      </div>

      {/* Resolve Modal */}
      <Modal
        isOpen={!!resolvingReport}
        onClose={() => setResolvingReport(null)}
        title={`${resolutionStatus === 'resolved' ? 'Resolve' : 'Dismiss'} Moderation Report`}
        footer={
          <>
            <button className="btn btn-outline" onClick={() => setResolvingReport(null)}>
              Cancel
            </button>
            <button className="btn btn-primary" disabled={submitting} onClick={handleResolveSubmit}>
              {submitting ? 'Saving...' : 'Confirm Action'}
            </button>
          </>
        }
      >
        <form onSubmit={handleResolveSubmit}>
          <div className="form-group">
            <label className="form-label">Resolution Status</label>
            <select
              value={resolutionStatus}
              onChange={(e) => setResolutionStatus(e.target.value)}
              className="form-select"
            >
              <option value="resolved">Mark Resolved (Action Taken)</option>
              <option value="dismissed">Dismiss Report (No Violation)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Administrative Resolution Notes</label>
            <textarea
              value={resolutionNotes}
              onChange={(e) => setResolutionNotes(e.target.value)}
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

export default ReportManagement;
