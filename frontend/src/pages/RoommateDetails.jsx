import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { roommateService } from '../services/roommateService';
import { chatService } from '../services/chatService';
import {
  Users,
  MapPin,
  Sparkles,
  CheckCircle,
  MessageSquare,
  Send,
  ChevronLeft,
  Calendar,
  DollarSign,
  Coffee,
  Moon,
  Smile,
} from 'lucide-react';

const RoommateDetails = () => {
  const { id } = useParams();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [connectionMessage, setConnectionMessage] = useState('Hi, I saw your profile and our preferences match! Would love to team up.');
  const [isSending, setIsSending] = useState(false);
  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await roommateService.getRoommateProfile(id);
      if (res.success && res.data) {
        setCandidate(res.data);
      }
    } catch (err) {
      console.error('Failed to load roommate profile:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const handleSendConnect = async (e) => {
    e.preventDefault();
    try {
      setIsSending(true);
      await roommateService.sendConnectionRequest(id, connectionMessage);
      fetchProfile();
    } catch (err) {
      alert(err.message || 'Failed to send connection request');
    } finally {
      setIsSending(false);
    }
  };

  const handleOpenChat = async () => {
    try {
      const res = await chatService.getOrCreateConversation(candidate._id);
      if (res.data) {
        navigate(`/chat?conversationId=${res.data._id}`);
      }
    } catch (err) {
      navigate('/chat');
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '5rem 0', textAlign: 'center' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="container" style={{ padding: '5rem 0', textAlign: 'center' }}>
        <h2>Roommate Profile Not Found</h2>
        <Link to="/roommates" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Back to Roommates
        </Link>
      </div>
    );
  }

  const breakdown = candidate.breakdown || {};
  const connection = candidate.connection;

  return (
    <div style={{ padding: '2.5rem 0 5rem' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        <Link to="/roommates" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
          <ChevronLeft size={16} /> Back to all roommate matches
        </Link>

        {/* Profile Header Card */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {candidate.name?.charAt(0) || 'R'}
            </div>

            <div style={{ flex: 1, minWidth: '220px' }}>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{candidate.name}</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                {candidate.occupation || 'Student'} • {candidate.collegeOrCompany || 'College / University'}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-subtle)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                <MapPin size={14} color="var(--primary)" />
                <span>Prefers: {candidate.preferredLocality || 'Any locality'}, {candidate.preferredCity || 'Flexible City'}</span>
              </div>
            </div>

            {/* Overall Score Badge */}
            <div
              style={{
                backgroundColor: 'var(--success-light)',
                border: '1px solid #a7f3d0',
                padding: '1rem 1.5rem',
                borderRadius: 'var(--radius-lg)',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '0.8rem', color: '#065f46', fontWeight: 700, textTransform: 'uppercase' }}>
                Match Score
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#059669' }}>
                {candidate.compatibility}%
              </div>
            </div>
          </div>
        </div>

        {/* Compatibility Breakdown Card */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={18} color="var(--primary)" /> Compatibility Score Breakdown
          </h2>

          <div className="grid-2" style={{ gap: '1.25rem', marginBottom: '1.5rem' }}>
            <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontWeight: 700 }}>
                <span>Location Match</span>
                <span style={{ color: 'var(--primary)' }}>{breakdown.locationScore || 0} / 25 pts</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Based on target city and preferred neighborhood overlap
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontWeight: 700 }}>
                <span>Budget Overlap</span>
                <span style={{ color: 'var(--primary)' }}>{breakdown.budgetScore || 0} / 25 pts</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Comparing minimum and maximum monthly rent affordability ranges
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontWeight: 700 }}>
                <span>Accommodation & Gender</span>
                <span style={{ color: 'var(--primary)' }}>{breakdown.preferenceScore || 0} / 20 pts</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Flat vs PG preference and mutual gender alignment
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontWeight: 700 }}>
                <span>Lifestyle Compatibility</span>
                <span style={{ color: 'var(--primary)' }}>{breakdown.lifestyleScore || 0} / 30 pts</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Habits, cleanliness standard, food diet, and sleep routines
              </div>
            </div>
          </div>

          {/* Highlights */}
          {breakdown.matchedHighlights?.length > 0 && (
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-main)' }}>
                Key Compatibility Highlights
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {breakdown.matchedHighlights.map((hl, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                    <CheckCircle size={16} color="#10b981" />
                    <span>{hl}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bio & Lifestyle Preferences Card */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem' }}>
            About & Lifestyle Habits
          </h2>

          {candidate.bio && (
            <p style={{ lineHeight: 1.7, color: 'var(--text-main)', marginBottom: '1.5rem' }}>
              {candidate.bio}
            </p>
          )}

          <div className="grid-3" style={{ gap: '1rem' }}>
            <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '0.85rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Cleanliness</div>
              <div style={{ fontWeight: 700 }}>{candidate.roommatePreferences?.cleanliness?.replace('_', ' ') || 'Moderate'}</div>
            </div>
            <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '0.85rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Food Habit</div>
              <div style={{ fontWeight: 700 }}>{candidate.roommatePreferences?.foodHabit || 'Any'}</div>
            </div>
            <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '0.85rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Smoking Habit</div>
              <div style={{ fontWeight: 700 }}>{candidate.roommatePreferences?.smoking?.replace('_', ' ') || 'Non Smoker'}</div>
            </div>
            <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '0.85rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Sleep Schedule</div>
              <div style={{ fontWeight: 700 }}>{candidate.roommatePreferences?.sleepSchedule?.replace('_', ' ') || 'Flexible'}</div>
            </div>
            <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '0.85rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Budget Range</div>
              <div style={{ fontWeight: 700 }}>₹{candidate.budgetMin?.toLocaleString()} - ₹{candidate.budgetMax?.toLocaleString()}</div>
            </div>
            <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '0.85rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Accommodation</div>
              <div style={{ fontWeight: 700 }}>{candidate.preferredAccommodationType || 'Any'}</div>
            </div>
          </div>
        </div>

        {/* Connect Action Box */}
        <div className="card" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.75rem' }}>
            Connect with {candidate.name}
          </h2>

          {connection ? (
            <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
              <p style={{ fontWeight: 600, marginBottom: '0.75rem' }}>
                Connection Status: <span className="badge badge-primary">{connection.status}</span>
              </p>
              {connection.status === 'accepted' ? (
                <button onClick={handleOpenChat} className="btn btn-primary">
                  <MessageSquare size={16} /> Open Chat
                </button>
              ) : (
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Your request is awaiting response from {candidate.name}.
                </p>
              )}
            </div>
          ) : (
            <form onSubmit={handleSendConnect}>
              <div className="form-group">
                <label className="form-label">Personalized Introduction Message</label>
                <textarea
                  value={connectionMessage}
                  onChange={(e) => setConnectionMessage(e.target.value)}
                  className="form-textarea"
                  rows={3}
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSending}
                className="btn btn-primary"
              >
                <Send size={16} />
                <span>{isSending ? 'Sending...' : `Send Connection Request`}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoommateDetails;
