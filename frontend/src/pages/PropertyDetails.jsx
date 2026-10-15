import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { propertyService } from '../services/propertyService';
import { favoriteService } from '../services/favoriteService';
import { reviewService } from '../services/reviewService';
import { chatService } from '../services/chatService';
import { reportService } from '../services/reportService';
import { useAuth } from '../context/AuthContext';
import MapView from '../components/MapView';
import StarRating from '../components/StarRating';
import Modal from '../components/Modal';
import {
  MapPin,
  Users,
  CheckCircle,
  Heart,
  MessageSquare,
  Shield,
  Utensils,
  Star,
  Flag,
  Phone,
  User,
  Trash2,
  Share2,
} from 'lucide-react';

const PropertyDetails = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(true);

  // Review Form State
  const [ratingInput, setRatingInput] = useState(5);
  const [commentInput, setCommentInput] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState('');

  // Report Modal State
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('Misleading pricing or information');
  const [reportDetails, setReportDetails] = useState('');
  const [submittingReport, setSubmittingReport] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const res = await propertyService.getPropertyById(id);
        if (res.success && res.data) {
          setProperty(res.data);
        }

        if (isAuthenticated) {
          const favRes = await favoriteService.checkFavorite(id);
          setIsFavorited(favRes.isFavorite);
        }
      } catch (err) {
        console.error('Failed to load property details:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id, isAuthenticated]);

  const handleFavoriteToggle = async () => {
    if (!isAuthenticated) {
      alert('Please log in to save properties');
      return;
    }
    try {
      if (isFavorited) {
        await favoriteService.removeFavorite(id);
        setIsFavorited(false);
      } else {
        await favoriteService.addFavorite(id);
        setIsFavorited(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleChatWithOwner = async () => {
    if (!isAuthenticated) {
      alert('Please log in to chat with the property owner');
      navigate('/login');
      return;
    }

    try {
      const res = await chatService.getOrCreateConversation(property.owner._id, property._id);
      if (res.data) {
        navigate(`/chat?conversationId=${res.data._id}`);
      }
    } catch (err) {
      navigate('/chat');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Please log in to submit a review');
      return;
    }
    if (!commentInput.trim()) {
      setReviewError('Please write a review comment');
      return;
    }

    try {
      setSubmittingReview(true);
      setReviewError('');
      const res = await reviewService.createReview({
        propertyId: id,
        rating: ratingInput,
        comment: commentInput.trim(),
      });

      if (res.success) {
        // Refresh details
        const updatedRes = await propertyService.getPropertyById(id);
        setProperty(updatedRes.data);
        setCommentInput('');
      }
    } catch (err) {
      setReviewError(err.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete your review?')) return;
    try {
      await reviewService.deleteReview(reviewId);
      const updatedRes = await propertyService.getPropertyById(id);
      setProperty(updatedRes.data);
    } catch (err) {
      alert(err.message || 'Failed to delete review');
    }
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmittingReport(true);
      await reportService.createReport({
        reportedItemType: 'Property',
        reportedItemId: id,
        reason: reportReason,
        details: reportDetails,
      });
      setReportSuccess(true);
      setTimeout(() => {
        setReportSuccess(false);
        setReportModalOpen(false);
        setReportDetails('');
      }, 2000);
    } catch (err) {
      alert(err.message || 'Failed to submit report');
    } finally {
      setSubmittingReport(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '5rem 0', textAlign: 'center' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container" style={{ padding: '5rem 0', textAlign: 'center' }}>
        <h2>Property Not Found</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          The listing may have been unlisted or removed.
        </p>
        <Link to="/properties" className="btn btn-primary">
          Back to Accommodations
        </Link>
      </div>
    );
  }

  const images = property.images && property.images.length > 0 ? property.images : ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80'];
  const userHasReviewed = property.reviews?.some((r) => r.user?._id === user?._id);

  return (
    <div style={{ padding: '2.5rem 0 5rem' }}>
      <div className="container">
        {/* Header Breadcrumb & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <span className="badge badge-primary">{property.propertyType}</span>
              {property.verificationStatus === 'approved' && (
                <span className="badge badge-success">
                  <CheckCircle size={12} /> Verified Listing
                </span>
              )}
              {!property.isAvailable && (
                <span className="badge badge-danger">Occupied / Unavailable</span>
              )}
            </div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>{property.title}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              <MapPin size={16} color="var(--primary)" />
              <span>{property.address}, {property.locality}, {property.city} {property.pincode && `- ${property.pincode}`}</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={handleFavoriteToggle}
              className={`btn btn-outline ${isFavorited ? 'active' : ''}`}
              style={{ color: isFavorited ? '#ef4444' : 'inherit' }}
            >
              <Heart size={18} fill={isFavorited ? '#ef4444' : 'none'} />
              <span>{isFavorited ? 'Saved' : 'Save'}</span>
            </button>

            <button
              onClick={() => setReportModalOpen(true)}
              className="btn btn-outline"
              title="Report suspicious listing"
            >
              <Flag size={18} />
              <span>Report</span>
            </button>
          </div>
        </div>

        {/* Image Gallery */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div
            style={{
              height: '420px',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              backgroundColor: '#e2e8f0',
              marginBottom: '1rem',
            }}
          >
            <img
              src={images[selectedImage]}
              alt={property.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {images.length > 1 && (
            <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
              {images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Thumbnail ${idx}`}
                  onClick={() => setSelectedImage(idx)}
                  style={{
                    width: '90px',
                    height: '65px',
                    objectFit: 'cover',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    border: selectedImage === idx ? '3px solid var(--primary)' : '2px solid transparent',
                    opacity: selectedImage === idx ? 1 : 0.7,
                    transition: 'var(--transition)',
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Content Grid: Specs & Description vs Sticky Owner Card */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2.5rem', alignItems: 'start' }}>
          {/* Main Column */}
          <div>
            {/* Quick Specs Cards */}
            <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem' }}>Property Overview</h3>
              <div className="grid-3" style={{ gap: '1rem' }}>
                <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Occupancy</div>
                  <div style={{ fontWeight: 700 }}>{property.occupancyType}</div>
                </div>
                <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Gender Allowed</div>
                  <div style={{ fontWeight: 700 }}>{property.genderPreference}</div>
                </div>
                <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Available Rooms</div>
                  <div style={{ fontWeight: 700 }}>{property.availableRooms} of {property.totalRooms}</div>
                </div>
                <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Security Deposit</div>
                  <div style={{ fontWeight: 700 }}>₹{property.securityDeposit?.toLocaleString()}</div>
                </div>
                <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Food Facility</div>
                  <div style={{ fontWeight: 700 }}>{property.foodAvailability ? 'Available' : 'Not Included'}</div>
                </div>
                <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Verified Date</div>
                  <div style={{ fontWeight: 700 }}>{new Date(property.createdAt).toLocaleDateString()}</div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem' }}>Description</h3>
              <p style={{ lineHeight: 1.8, color: 'var(--text-main)', whiteSpace: 'pre-line' }}>
                {property.description}
              </p>
            </div>

            {/* Amenities */}
            <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem' }}>Amenities & Facilities</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                {property.amenities?.map((amenity, idx) => (
                  <span
                    key={idx}
                    className="badge badge-primary"
                    style={{ fontSize: '0.85rem', padding: '0.5rem 0.85rem', textTransform: 'none' }}
                  >
                    ✓ {amenity}
                  </span>
                ))}
              </div>
            </div>

            {/* Location Map View */}
            <div style={{ marginBottom: '2.5rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem' }}>Location on Map</h3>
              <MapView
                lat={property.coordinates?.lat || 12.9716}
                lng={property.coordinates?.lng || 77.5946}
                title={property.title}
                address={`${property.address}, ${property.locality}, ${property.city}`}
                height="320px"
              />
            </div>

            {/* Reviews Section */}
            <div className="card" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Student Ratings & Reviews</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    {property.reviewCount || 0} verified reviews ({property.averageRating || 0} / 5.0)
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Star size={24} fill="#f59e0b" color="#f59e0b" />
                  <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>{property.averageRating || 0}</span>
                </div>
              </div>

              {/* Review Form (if user is student and hasn't reviewed yet) */}
              {isAuthenticated && user?.role === 'student' && !userHasReviewed && (
                <form
                  onSubmit={handleReviewSubmit}
                  style={{
                    backgroundColor: 'var(--bg-subtle)',
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: '2rem',
                  }}
                >
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                    Leave Your Review
                  </h4>

                  {reviewError && <div className="alert alert-danger">{reviewError}</div>}

                  <div className="form-group">
                    <label className="form-label">Your Rating</label>
                    <StarRating
                      rating={ratingInput}
                      setRating={setRatingInput}
                      readOnly={false}
                      size={22}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Review Comment</label>
                    <textarea
                      placeholder="Share your stay experience, food quality, owner responsiveness, etc..."
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      className="form-textarea"
                      rows={3}
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="btn btn-primary btn-sm"
                  >
                    {submittingReview ? 'Submitting...' : 'Post Review'}
                  </button>
                </form>
              )}

              {/* Reviews List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {property.reviews && property.reviews.length > 0 ? (
                  property.reviews.map((rev) => (
                    <div
                      key={rev._id}
                      style={{
                        paddingBottom: '1.25rem',
                        borderBottom: '1px solid var(--border-color)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <div
                            style={{
                              width: '34px',
                              height: '34px',
                              borderRadius: '50%',
                              backgroundColor: 'var(--primary-light)',
                              color: 'var(--primary)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 700,
                              fontSize: '0.85rem',
                            }}
                          >
                            {rev.user?.name ? rev.user.name.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{rev.user?.name || 'Verified Resident'}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                              {rev.user?.occupation || 'Student'} • {new Date(rev.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <StarRating rating={rev.rating} readOnly={true} size={14} />
                          {user && (user._id === rev.user?._id || user.role === 'admin') && (
                            <button
                              onClick={() => handleDeleteReview(rev._id)}
                              style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '4px' }}
                              title="Delete Review"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                      <p style={{ color: 'var(--text-main)', fontSize: '0.9rem', lineHeight: 1.6, marginLeft: '42px' }}>
                        {rev.comment}
                      </p>
                    </div>
                  ))
                ) : (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '1rem 0' }}>
                    No reviews yet. Be the first to review this accommodation!
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Sticky Right Column: Price & Owner Card */}
          <div style={{ position: 'sticky', top: '90px' }}>
            <div className="card" style={{ padding: '1.75rem' }}>
              <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Monthly Rent</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>
                  ₹{property.monthlyRent?.toLocaleString()}
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}> / month</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  Security Deposit: ₹{property.securityDeposit?.toLocaleString()}
                </div>
              </div>

              {/* Owner Info */}
              <div style={{ marginBottom: '1.75rem' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                  Hosted by Property Owner
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '0.75rem' }}>
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--secondary-light)',
                      color: 'var(--secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '1.1rem',
                    }}
                  >
                    {property.owner?.name ? property.owner.name.charAt(0).toUpperCase() : 'O'}
                  </div>
                  <div>
                    <h4 style={{ fontWeight: 700 }}>{property.owner?.name || 'Property Host'}</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {property.owner?.occupation || 'Verified Host'}
                    </p>
                  </div>
                </div>

                {property.owner?.phone && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    <Phone size={14} />
                    <span>{property.owner.phone}</span>
                  </div>
                )}
              </div>

              {/* Chat action button */}
              <button
                onClick={handleChatWithOwner}
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.85rem' }}
              >
                <MessageSquare size={18} />
                <span>Chat with Owner</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      <Modal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        title="Report Suspicious Accommodation"
        footer={
          <>
            <button className="btn btn-outline" onClick={() => setReportModalOpen(false)}>
              Cancel
            </button>
            <button
              className="btn btn-danger"
              disabled={submittingReport}
              onClick={handleReportSubmit}
            >
              {submittingReport ? 'Submitting...' : 'Submit Report'}
            </button>
          </>
        }
      >
        {reportSuccess ? (
          <div className="alert alert-success">
            Thank you. Your report has been submitted to platform administrators for review.
          </div>
        ) : (
          <form onSubmit={handleReportSubmit}>
            <div className="form-group">
              <label className="form-label">Reason for Report</label>
              <select
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                className="form-select"
              >
                <option value="Misleading pricing or information">Misleading pricing or information</option>
                <option value="Inappropriate or fake photos">Inappropriate or fake photos</option>
                <option value="Host unresponsive or fraudulent">Host unresponsive or fraudulent</option>
                <option value="Property already rented / unavailable">Property already rented / unavailable</option>
                <option value="Safety or discrimination concerns">Safety or discrimination concerns</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Additional Details</label>
              <textarea
                placeholder="Please describe why this property listing should be moderated..."
                value={reportDetails}
                onChange={(e) => setReportDetails(e.target.value)}
                className="form-textarea"
                rows={4}
              ></textarea>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default PropertyDetails;
