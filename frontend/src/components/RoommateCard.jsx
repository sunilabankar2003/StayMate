import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Check, Send, Sparkles, MessageSquare } from 'lucide-react';
import { roommateService } from '../services/roommateService';
import { chatService } from '../services/chatService';
import '../styles/cards.css';

const RoommateCard = ({ roommate, onConnectionChange }) => {
  const [connectionStatus, setConnectionStatus] = useState(roommate.connection?.status || null);
  const [isSending, setIsSending] = useState(false);
  const navigate = useNavigate();

  const handleConnect = async () => {
    try {
      setIsSending(true);
      const res = await roommateService.sendConnectionRequest(roommate._id);
      setConnectionStatus('pending');
      if (onConnectionChange) onConnectionChange(roommate._id, 'pending');
    } catch (err) {
      alert(err.message || 'Failed to send request');
    } finally {
      setIsSending(false);
    }
  };

  const handleOpenChat = async () => {
    try {
      const res = await chatService.getOrCreateConversation(roommate._id);
      if (res.data) {
        navigate(`/chat?conversationId=${res.data._id}`);
      }
    } catch (err) {
      navigate('/chat');
    }
  };

  const compatibility = roommate.compatibility || 70;
  const highlights = roommate.breakdown?.matchedHighlights || [];

  return (
    <div className="card roommate-card">
      <div className="roommate-header">
        <div className="roommate-avatar">
          {roommate.name ? roommate.name.charAt(0).toUpperCase() : 'R'}
        </div>
        <div className="roommate-info">
          <h3>{roommate.name}</h3>
          <p>{roommate.occupation || 'Student'}</p>
          {roommate.collegeOrCompany && (
            <p style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
              {roommate.collegeOrCompany}
            </p>
          )}
        </div>
      </div>

      {/* Compatibility Box */}
      <div className="compatibility-box">
        <div className="compatibility-label">
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Sparkles size={14} /> Match Score
          </span>
          <span>{compatibility}% Compatible</span>
        </div>
        <div className="compatibility-bar-bg">
          <div
            className="compatibility-bar-fill"
            style={{ width: `${compatibility}%` }}
          ></div>
        </div>
      </div>

      <div style={{ marginBottom: '1rem', fontSize: '0.85rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
          <MapPin size={14} color="var(--primary)" />
          <span>{roommate.preferredCity || 'Flexible'}, {roommate.preferredLocality || 'Any locality'}</span>
        </div>
        <div style={{ color: 'var(--text-muted)' }}>
          Budget: <strong>₹{roommate.budgetMin?.toLocaleString()} - ₹{roommate.budgetMax?.toLocaleString()}</strong> / mo
        </div>
      </div>

      {/* Highlights */}
      <div className="match-highlights">
        {highlights.slice(0, 3).map((h, idx) => (
          <div key={idx} className="highlight-chip">
            <Check size={14} color="#10b981" />
            <span>{h}</span>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '0.75rem', marginTop: 'auto' }}>
        <Link to={`/roommates/${roommate._id}`} className="btn btn-outline btn-sm" style={{ flex: 1 }}>
          View Profile
        </Link>

        {connectionStatus === 'accepted' ? (
          <button onClick={handleOpenChat} className="btn btn-primary btn-sm" style={{ flex: 1 }}>
            <MessageSquare size={14} /> Chat
          </button>
        ) : connectionStatus === 'pending' ? (
          <button disabled className="btn btn-outline btn-sm" style={{ flex: 1, color: 'var(--text-muted)' }}>
            Pending
          </button>
        ) : (
          <button
            onClick={handleConnect}
            disabled={isSending}
            className="btn btn-primary btn-sm"
            style={{ flex: 1 }}
          >
            <Send size={14} /> {isSending ? 'Sending...' : 'Connect'}
          </button>
        )}
      </div>
    </div>
  );
};

export default RoommateCard;
