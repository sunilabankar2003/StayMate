import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import StarRating from '../../components/StarRating';
import { Star, Trash2 } from 'lucide-react';

const ReviewModeration = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await adminService.getAllReviewsAdmin({ limit: 50 });
      if (res.success) {
        setReviews(res.data || []);
      }
    } catch (err) {
      console.error('Fetch reviews admin error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this review permanently from the platform?')) return;
    try {
      await adminService.deleteReviewAdmin(id);
      fetchReviews();
    } catch (err) {
      alert(err.message || 'Action failed');
    }
  };

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1>Review Moderation</h1>
          <p>Monitor user reviews across properties to prevent spam, abusive language, or fraudulent feedback.</p>
        </div>
      </div>

      <div className="card" style={{ padding: '1.5rem' }}>
        {loading ? (
          <div className="spinner"></div>
        ) : reviews.length > 0 ? (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Property</th>
                  <th>Reviewer</th>
                  <th>Rating</th>
                  <th>Review Content</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((rev) => (
                  <tr key={rev._id}>
                    <td>
                      <div style={{ fontWeight: 700 }}>{rev.property?.title || 'Unknown Property'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {rev.property?.locality}, {rev.property?.city}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{rev.user?.name || 'User'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{rev.user?.email}</div>
                    </td>
                    <td>
                      <StarRating rating={rev.rating} readOnly={true} size={14} />
                    </td>
                    <td style={{ maxWidth: '300px' }}>
                      <div style={{ fontSize: '0.9rem', lineHeight: 1.4 }}>"{rev.comment}"</div>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <button
                        onClick={() => handleDelete(rev._id)}
                        className="btn btn-outline btn-sm"
                        style={{ color: 'var(--danger)' }}
                        title="Delete Review"
                      >
                        <Trash2 size={14} /> Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <Star className="empty-state-icon" />
            <h3>No reviews to moderate</h3>
            <p>All reviews are clean and compliant.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewModeration;
