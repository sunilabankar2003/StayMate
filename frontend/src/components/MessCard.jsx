import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Clock, Utensils, CheckCircle } from 'lucide-react';
import '../styles/cards.css';

const MessCard = ({ mess }) => {
  const firstImage =
    mess.images && mess.images.length > 0
      ? mess.images[0]
      : 'https://images.unsplash.com/photo-1613292443284-8d10ef9383fe?auto=format&fit=crop&w=800&q=80';

  const isVeg = mess.foodType === 'Veg';

  return (
    <div className="card mess-card">
      <div className="property-image-wrapper">
        <img src={firstImage} alt={mess.name} className="property-img" loading="lazy" />
        <span
          className="badge property-badge-type"
          style={{
            backgroundColor: isVeg ? '#ecfdf5' : '#fef2f2',
            color: isVeg ? '#059669' : '#dc2626',
            border: `1px solid ${isVeg ? '#a7f3d0' : '#fecaca'}`,
          }}
        >
          {mess.foodType}
        </span>
        {mess.isVerified && (
          <span className="badge badge-success property-badge-verified">
            <CheckCircle size={12} /> Verified Mess
          </span>
        )}
      </div>

      <div className="property-content">
        <h3 className="property-title">{mess.name}</h3>

        <div className="property-location">
          <MapPin size={14} color="var(--primary)" />
          <span>{mess.locality}, {mess.city}</span>
        </div>

        <div className="mess-timing-box">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)' }}>
            <Clock size={13} />
            <span>Lunch: {mess.mealTimings?.lunch || '12:30 PM - 3:00 PM'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)' }}>
            <Utensils size={13} />
            <span>Meals: {mess.mealTypes?.join(', ') || 'Lunch, Dinner'}</span>
          </div>
        </div>

        <div className="property-footer" style={{ marginTop: 'auto' }}>
          <div className="property-price">
            <span className="price-val">₹{mess.monthlyPrice?.toLocaleString()}</span>
            <span className="price-sub">/ month {mess.dailyPrice ? `(₹${mess.dailyPrice}/day)` : ''}</span>
          </div>

          <Link to={`/mess/${mess._id}`} className="btn btn-outline btn-sm">
            Details & Menu
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MessCard;
