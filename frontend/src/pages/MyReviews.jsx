import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { reviewService } from '../services/reviewService';
import StarRating from '../components/StarRating';
import Modal from '../components/Modal';
import { Star, Building, Trash2, Edit2 } from 'lucide-react';

const MyReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit State
  const [editingReview, setEditingReview] = useState(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState('');
  const [submittingEdit, setSubmittingEdit] = useState(false);

  const fetchMyReviews = async () => {
    try {
      setLoading(true);
      const res = await reviewService.getMyReviews();
      if (res.success) {
        setReviews(res.data || []);
      }
    } catch (err) {
      console.error('Fetch reviews error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyReviews();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      await reviewService.deleteReview(id);
      fetchMyReviews();
    } catch (err) {
      alert(err.message || 'Failed to delete review');
    }
  };

  const openEditModal = (rev) => {
    setEditingReview(rev);
    setEditRating(rev.rating);
    setEditComment(rev.comment);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmittingEdit(true);
      await reviewService.updateReview(editingReview._id, {
        rating: editRating,
        comment: editComment.trim(),
      });
      setEditingReview(null);
      fetchMyReviews();
    } catch (err) {
      alert(err.message || 'Failed to update review');
    } finally {
      setSubmittingEdit(false);
    }
  };

  return (
    <div style={{ padding: '2.5rem 0 5rem' }}>
      <div className="container" style={{ maxWidth: '850px' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>My Ratings & Reviews</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Manage the feedback and ratings you submitted for accommodations.
          </p>
        </div>

        {loading ? (
          <div className="spinner"></div>
        ) : reviews.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {reviews.map((rev) => (
              <div key={rev._id} className="card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>
                      <Link to={`/properties/${rev.property?._id}`}>
                        {rev.property?.title || 'Accommodation'}
                      </Link>
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {rev.property?.locality}, {rev.property?.city} • Reviewed on {new Date(rev.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <StarRating rating={rev.rating} readOnly={true} size={16} />
                    <button
                      onClick={() => openEditModal(rev)}
                      className="btn btn-outline btn-sm"
                      title="Edit review"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(rev._id)}
                      className="btn btn-outline btn-sm"
                      style={{ color: 'var(--danger)' }}
                      title="Delete review"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <p style={{ color: 'var(--text-main)', lineHeight: 1.6, fontSize: '0.95rem' }}>
                  "{rev.comment}"
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <Star className="empty-state-icon" />
            <h3>No reviews submitted yet</h3>
            <p>You haven't reviewed any accommodations yet. Reviews help other students make better choices!</p>
          </div>
        )}
      </div>

      {/* Edit Review Modal */}
      <Modal
        isOpen={!!editingReview}
        onClose={() => setEditingReview(null)}
        title="Edit Your Review"
        footer={
          <>
            <button className="btn btn-outline" onClick={() => setEditingReview(null)}>
              Cancel
            </button>
            <button
              className="btn btn-primary"
              disabled={submittingEdit}
              onClick={handleEditSubmit}
            >
              {submittingEdit ? 'Saving...' : 'Update Review'}
            </button>
          </>
        }
      >
        <form onSubmit={handleEditSubmit}>
          <div className="form-group">
            <label className="form-label">Rating</label>
            <StarRating rating={editRating} setRating={setEditRating} readOnly={false} size={24} />
          </div>

          <div className="form-group">
            <label className="form-label">Comment</label>
            <textarea
              value={editComment}
              onChange={(e) => setEditComment(e.target.value)}
              className="form-textarea"
              rows={4}
              required
            ></textarea>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MyReviews;
