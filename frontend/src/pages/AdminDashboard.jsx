import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../services/adminService';
import {
  Users,
  Building,
  Utensils,
  Flag,
  CheckCircle,
  Clock,
  XCircle,
  Star,
  Shield,
  ArrowRight,
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await adminService.getDashboardStats();
      if (res.success) {
        setStats(res.data);
      }
    } catch (err) {
      console.error('Admin stats error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1>Administrator Console</h1>
          <p>Comprehensive overview of platform analytics, user accounts, and moderation queues.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/admin/properties" className="btn btn-primary btn-sm">
            <Shield size={16} /> Verify Listings ({stats?.pendingProperties || 0})
          </Link>
          <Link to="/admin/reports" className="btn btn-outline btn-sm">
            <Flag size={16} /> Pending Reports ({stats?.pendingReports || 0})
          </Link>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">
            <Users size={24} />
          </div>
          <div className="stat-info">
            <h4>Total Registered Users</h4>
            <div className="stat-number">{stats?.totalUsers || 0}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {stats?.totalStudents || 0} Students • {stats?.totalOwners || 0} Hosts
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <Building size={24} />
          </div>
          <div className="stat-info">
            <h4>Total Accommodations</h4>
            <div className="stat-number">{stats?.totalProperties || 0}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {stats?.approvedProperties || 0} Approved • {stats?.pendingProperties || 0} Pending
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon amber">
            <Utensils size={24} />
          </div>
          <div className="stat-info">
            <h4>Mess & Tiffin Listings</h4>
            <div className="stat-number">{stats?.totalMessListings || 0}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Daily dining services
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon red">
            <Flag size={24} />
          </div>
          <div className="stat-info">
            <h4>Pending User Reports</h4>
            <div className="stat-number">{stats?.pendingReports || 0}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Awaiting moderation review
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Section: Recent Properties & Recent Reports */}
      <div className="grid-2" style={{ gap: '2rem', marginTop: '1rem' }}>
        {/* Recent Listings */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Recently Submitted Properties</h3>
            <Link to="/admin/properties" className="btn btn-outline btn-sm">
              View All
            </Link>
          </div>

          {stats?.recentProperties?.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {stats.recentProperties.map((prop) => (
                <div
                  key={prop._id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem',
                    backgroundColor: 'var(--bg-subtle)',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{prop.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Hosted by {prop.owner?.name || 'Owner'} • ₹{prop.monthlyRent?.toLocaleString()}/mo
                    </div>
                  </div>
                  <div>
                    {prop.verificationStatus === 'approved' ? (
                      <span className="badge badge-success">Approved</span>
                    ) : prop.verificationStatus === 'rejected' ? (
                      <span className="badge badge-danger">Rejected</span>
                    ) : (
                      <span className="badge badge-warning">Pending</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No recent properties.</p>
          )}
        </div>

        {/* Recent Reports */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Recent Moderation Reports</h3>
            <Link to="/admin/reports" className="btn btn-outline btn-sm">
              View All
            </Link>
          </div>

          {stats?.recentReports?.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {stats.recentReports.map((rep) => (
                <div
                  key={rep._id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem',
                    backgroundColor: 'var(--bg-subtle)',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                      {rep.reportedItemType}: {rep.reason}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Reported by {rep.reporter?.name || 'User'} • {new Date(rep.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <span className={`badge ${rep.status === 'resolved' ? 'badge-success' : 'badge-warning'}`}>
                      {rep.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No reports filed.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
