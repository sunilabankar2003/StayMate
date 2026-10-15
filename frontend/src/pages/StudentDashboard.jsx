import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { favoriteService } from '../services/favoriteService';
import { roommateService } from '../services/roommateService';
import { reviewService } from '../services/reviewService';
import PropertyCard from '../components/PropertyCard';
import {
  Bookmark,
  Users,
  Star,
  MessageSquare,
  Building,
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight,
} from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [connections, setConnections] = useState({ received: [], sent: [] });
  const [reviewsCount, setReviewsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [favRes, connRes, revRes] = await Promise.all([
        favoriteService.getFavorites(),
        roommateService.getMyConnectionRequests(),
        reviewService.getMyReviews(),
      ]);

      if (favRes.success) setFavorites(favRes.data || []);
      if (connRes.success) setConnections(connRes.data || { received: [], sent: [] });
      if (revRes.success) setReviewsCount(revRes.count || 0);
    } catch (err) {
      console.error('Student dashboard error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRespond = async (connectionId, status) => {
    try {
      await roommateService.respondToConnectionRequest(connectionId, status);
      fetchDashboardData();
    } catch (err) {
      alert(err.message || 'Action failed');
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1>Hello, {user?.name}!</h1>
          <p>Welcome to your StayMate student dashboard and accommodation planner.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/properties" className="btn btn-primary btn-sm">
            <Building size={16} /> Search Properties
          </Link>
          <Link to="/roommates" className="btn btn-outline btn-sm">
            <Users size={16} /> Find Roommates
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">
            <Bookmark size={24} />
          </div>
          <div className="stat-info">
            <h4>Saved Properties</h4>
            <div className="stat-number">{favorites.length}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <Users size={24} />
          </div>
          <div className="stat-info">
            <h4>Roommate Requests</h4>
            <div className="stat-number">{connections.received.length + connections.sent.length}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon amber">
            <Star size={24} />
          </div>
          <div className="stat-info">
            <h4>Reviews Given</h4>
            <div className="stat-number">{reviewsCount}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">
            <MessageSquare size={24} />
          </div>
          <div className="stat-info">
            <h4>Active Inquiries</h4>
            <div className="stat-number">
              <Link to="/chat" style={{ fontSize: '1rem', color: 'var(--primary)', fontWeight: 600 }}>
                Open Inbox →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Connection Requests Manager */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '2.5rem' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem' }}>
          Roommate Connection Requests
        </h3>

        {connections.received.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {connections.received.map((req) => (
              <div
                key={req._id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem',
                  backgroundColor: 'var(--bg-subtle)',
                  borderRadius: 'var(--radius-md)',
                  flexWrap: 'wrap',
                  gap: '1rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--primary-light)',
                      color: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                    }}
                  >
                    {req.sender?.name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <h4 style={{ fontWeight: 700 }}>{req.sender?.name}</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {req.sender?.occupation || 'Student'} • {req.sender?.collegeOrCompany}
                    </p>
                    <p style={{ fontSize: '0.85rem', fontStyle: 'italic', marginTop: '0.2rem' }}>
                      "{req.message}"
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {req.status === 'pending' ? (
                    <>
                      <button
                        onClick={() => handleRespond(req._id, 'accepted')}
                        className="btn btn-success btn-sm"
                      >
                        <CheckCircle size={14} /> Accept & Chat
                      </button>
                      <button
                        onClick={() => handleRespond(req._id, 'rejected')}
                        className="btn btn-outline btn-sm"
                        style={{ color: 'var(--danger)' }}
                      >
                        <XCircle size={14} /> Decline
                      </button>
                    </>
                  ) : (
                    <span className={`badge ${req.status === 'accepted' ? 'badge-success' : 'badge-danger'}`}>
                      {req.status}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            No incoming roommate connection requests at this time.
          </p>
        )}
      </div>

      {/* Saved Properties Carousel */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Your Saved Properties</h3>
          {favorites.length > 0 && (
            <Link to="/favorites" className="btn btn-outline btn-sm">
              <span>View All</span>
              <ArrowRight size={14} />
            </Link>
          )}
        </div>

        {favorites.length > 0 ? (
          <div className="grid-3">
            {favorites.slice(0, 3).map((property) => (
              <PropertyCard
                key={property._id}
                property={property}
                isInitiallyFavorited={true}
                onFavoriteToggle={fetchDashboardData}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <Bookmark className="empty-state-icon" />
            <h3>No saved properties yet</h3>
            <p>Save PGs and flats you are interested in for quick review.</p>
            <Link to="/properties" className="btn btn-primary btn-sm">
              Discover Accommodations
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
