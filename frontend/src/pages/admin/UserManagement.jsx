import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { Users, Search, ShieldAlert, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [role, setRole] = useState('All');
  const [status, setStatus] = useState('All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = { page, limit: 10 };
      if (keyword.trim()) params.keyword = keyword.trim();
      if (role !== 'All') params.role = role;
      if (status !== 'All') params.status = status;

      const res = await adminService.getAllUsers(params);
      if (res.success) {
        setUsers(res.data || []);
        setTotalPages(res.totalPages || 1);
        setTotalCount(res.total || 0);
      }
    } catch (err) {
      console.error('Fetch users error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, role, status]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const handleToggleSuspend = async (user) => {
    const actionText = user.isSuspended ? 'reactivate' : 'suspend';
    if (!window.confirm(`Are you sure you want to ${actionText} the account for ${user.name}?`)) {
      return;
    }

    try {
      await adminService.toggleUserSuspension(user._id);
      fetchUsers();
    } catch (err) {
      alert(err.message || 'Action failed');
    }
  };

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1>User & Host Management</h1>
          <p>Review, search, and manage registered student and property owner accounts ({totalCount} total).</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div className="search-box" style={{ flex: 1 }}>
            <Search size={16} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Search user by name, email, or phone..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>

          <div style={{ minWidth: '150px' }}>
            <select
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                setPage(1);
              }}
              className="form-select"
            >
              <option value="All">All Roles</option>
              <option value="student">Student</option>
              <option value="owner">Property Owner</option>
              <option value="admin">Administrator</option>
            </select>
          </div>

          <div style={{ minWidth: '150px' }}>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="form-select"
            >
              <option value="All">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="suspended">Suspended Only</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary btn-sm">
            Search
          </button>
        </form>
      </div>

      {/* Users Table */}
      <div className="card" style={{ padding: '1.5rem' }}>
        {loading ? (
          <div className="spinner"></div>
        ) : users.length > 0 ? (
          <>
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Role</th>
                    <th>Contact</th>
                    <th>Account Status</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id}>
                      <td>
                        <div style={{ fontWeight: 700 }}>{u.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{u.email}</div>
                      </td>
                      <td>
                        <span className={`badge ${u.role === 'admin' ? 'badge-primary' : u.role === 'owner' ? 'badge-warning' : 'badge-info'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td>
                        <div>{u.phone || 'No phone'}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {u.preferredCity || u.occupation || '-'}
                        </div>
                      </td>
                      <td>
                        {u.isSuspended ? (
                          <span className="badge badge-danger">Suspended</span>
                        ) : (
                          <span className="badge badge-success">Active</span>
                        )}
                      </td>
                      <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        {u.role !== 'admin' && (
                          <button
                            onClick={() => handleToggleSuspend(u)}
                            className={`btn btn-sm ${u.isSuspended ? 'btn-success' : 'btn-outline'}`}
                            style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
                          >
                            {u.isSuspended ? 'Reactivate' : 'Suspend'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button
                  className="btn btn-outline btn-sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  <ChevronLeft size={16} /> Prev
                </button>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Page {page} of {totalPages}
                </span>
                <button
                  className="btn btn-outline btn-sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="empty-state">
            <Users className="empty-state-icon" />
            <h3>No users found</h3>
            <p>No user accounts matched your query.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
