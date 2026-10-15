import React, { useState, useEffect } from 'react';
import { reportService } from '../services/reportService';
import { Flag, ShieldCheck, Clock } from 'lucide-react';

const MyReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const res = await reportService.getMyReports();
        if (res.success) {
          setReports(res.data || []);
        }
      } catch (err) {
        console.error('Fetch reports error:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const getStatusBadge = (status) => {
    if (status === 'resolved') return <span className="badge badge-success">Resolved</span>;
    if (status === 'dismissed') return <span className="badge badge-gray">Dismissed</span>;
    if (status === 'reviewed') return <span className="badge badge-info">Under Review</span>;
    return <span className="badge badge-warning">Pending Moderation</span>;
  };

  return (
    <div style={{ padding: '2.5rem 0 5rem' }}>
      <div className="container" style={{ maxWidth: '850px' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>My Filed Reports</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Track the status of reports you submitted to platform administrators.
          </p>
        </div>

        {loading ? (
          <div className="spinner"></div>
        ) : reports.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {reports.map((report) => (
              <div key={report._id} className="card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                      <span className="badge badge-primary">{report.reportedItemType} Report</span>
                      {getStatusBadge(report.status)}
                    </div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                      Reason: {report.reason}
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Filed on {new Date(report.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {report.details && (
                  <p style={{ color: 'var(--text-main)', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                    Details provided: "{report.details}"
                  </p>
                )}

                {report.resolutionNotes && (
                  <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}>
                    <strong>Admin Resolution Note:</strong> {report.resolutionNotes}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <ShieldCheck className="empty-state-icon" />
            <h3>No reports filed</h3>
            <p>You have not submitted any content moderation or safety reports.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyReports;
