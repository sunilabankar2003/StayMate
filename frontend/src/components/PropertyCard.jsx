import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Users, Heart, Star, CheckCircle, Shield } from 'lucide-react';
import { favoriteService } from '../services/favoriteService';
import { useAuth } from '../context/AuthContext';
import '../styles/cards.css';

const PropertyCard = ({ property, isInitiallyFavorited = false, onFavoriteToggle }) => {
  const { isAuthenticated } = useAuth();
  const [isFavorited, setIsFavorited] = useState(isInitiallyFavorited);
  const [loadingFav, setLoadingFav] = useState(false);

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      alert('Please log in to save properties to your favorites!');
      return;
    }

    try {
      setLoadingFav(true);
      if (isFavorited) {
        await favoriteService.removeFavorite(property._id);
        setIsFavorited(false);
        if (onFavoriteToggle) onFavoriteToggle(property._id, false);
      } else {
        await favoriteService.addFavorite(property._id);
        setIsFavorited(true);
        if (onFavoriteToggle) onFavoriteToggle(property._id, true);
      }
    } catch (err) {
      console.error('Favorite error:', err.message);
    } finally {
      setLoadingFav(false);
    }
  };

  const firstImage =
    property.images && property.images.length > 0
      ? property.images[0]
      : 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="card property-card">
      <div className="property-image-wrapper">
        <img
          src={firstImage}
          alt={property.title}
          className="property-img"
          loading="lazy"
        />

        <span className="badge badge-primary property-badge-type">
          {property.propertyType}
        </span>

        {property.verificationStatus === 'approved' && (
          <span className="badge badge-success property-badge-verified">
            <CheckCircle size={12} /> Verified
          </span>
        )}

        <button
          className={`property-fav-btn ${isFavorited ? 'active' : ''}`}
          onClick={handleFavoriteClick}
          disabled={loadingFav}
          title={isFavorited ? 'Remove from favorites' : 'Save to favorites'}
        >
          <Heart size={18} fill={isFavorited ? '#ef4444' : 'none'} />
        </button>
      </div>

      <div className="property-content">
        <div className="property-header">
          <h3 className="property-title">{property.title}</h3>
        </div>

        <div className="property-location">
          <MapPin size={14} color="var(--primary)" />
          <span>{property.locality}, {property.city}</span>
        </div>

        <div className="property-specs">
          <div className="spec-item">
            <Users size={12} />
            <span>{property.occupancyType}</span>
          </div>
          <div className="spec-item">
            <span>Gender: <strong>{property.genderPreference}</strong></span>
          </div>
          {property.foodAvailability && (
            <div className="spec-item" style={{ color: '#059669' }}>
              <span>Food Incl.</span>
            </div>
          )}
        </div>

        <div className="property-footer">
          <div className="property-price">
            <span className="price-val">₹{property.monthlyRent?.toLocaleString('en-IN')}</span>
            <span className="price-sub">/ month</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {property.averageRating > 0 ? (
              <div className="rating-pill">
                <Star size={13} fill="#d97706" />
                <span>{property.averageRating}</span>
              </div>
            ) : null}

            <Link to={`/properties/${property._id}`} className="btn btn-outline btn-sm">
              View
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
