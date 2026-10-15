import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { messService } from '../services/messService';
import MapView from '../components/MapView';
import {
  MapPin,
  Phone,
  Clock,
  Utensils,
  CheckCircle,
  Calendar,
  ChevronLeft,
} from 'lucide-react';

const MessDetails = () => {
  const { id } = useParams();
  const [mess, setMess] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMess = async () => {
      try {
        setLoading(true);
        const res = await messService.getMessServiceById(id);
        if (res.success && res.data) {
          setMess(res.data);
        }
      } catch (err) {
        console.error('Failed to load mess details:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMess();
  }, [id]);

  if (loading) {
    return (
      <div style={{ padding: '5rem 0', textAlign: 'center' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  if (!mess) {
    return (
      <div className="container" style={{ padding: '5rem 0', textAlign: 'center' }}>
        <h2>Mess Service Not Found</h2>
        <Link to="/mess" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Back to Mess Listings
        </Link>
      </div>
    );
  }

  const isVeg = mess.foodType === 'Veg';
  const menuDays = [
    { day: 'Monday', menu: mess.menu?.monday },
    { day: 'Tuesday', menu: mess.menu?.tuesday },
    { day: 'Wednesday', menu: mess.menu?.wednesday },
    { day: 'Thursday', menu: mess.menu?.thursday },
    { day: 'Friday', menu: mess.menu?.friday },
    { day: 'Saturday', menu: mess.menu?.saturday },
    { day: 'Sunday', menu: mess.menu?.sunday },
  ];

  return (
    <div style={{ padding: '2.5rem 0 5rem' }}>
      <div className="container">
        <Link to="/mess" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
          <ChevronLeft size={16} /> Back to all mess services
        </Link>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <span
                className="badge"
                style={{
                  backgroundColor: isVeg ? '#ecfdf5' : '#fef2f2',
                  color: isVeg ? '#059669' : '#dc2626',
                  border: `1px solid ${isVeg ? '#a7f3d0' : '#fecaca'}`,
                }}
              >
                {mess.foodType}
              </span>
              {mess.isVerified && (
                <span className="badge badge-success">
                  <CheckCircle size={12} /> Verified Service
                </span>
              )}
            </div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>{mess.name}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              <MapPin size={16} color="var(--primary)" />
              <span>{mess.address}, {mess.locality}, {mess.city}</span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="card" style={{ padding: '1.25rem 1.75rem', textAlign: 'right' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Monthly Subscription</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)' }}>
              ₹{mess.monthlyPrice?.toLocaleString()}
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}> / month</span>
            </div>
            {mess.dailyPrice ? (
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Daily Thali: ₹{mess.dailyPrice}
              </div>
            ) : null}
          </div>
        </div>

        {/* Content Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2.5rem', alignItems: 'start' }}>
          <div>
            {/* Description */}
            <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.75rem' }}>About the Mess</h3>
              <p style={{ color: 'var(--text-main)', lineHeight: 1.7 }}>{mess.description}</p>
            </div>

            {/* Weekly 7-Day Menu */}
            <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calendar size={18} color="var(--primary)" /> 7-Day Weekly Menu
              </h3>

              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th style={{ width: '130px' }}>Day</th>
                      <th>Scheduled Thali & Special Items</th>
                    </tr>
                  </thead>
                  <tbody>
                    {menuDays.map((m, idx) => (
                      <tr key={idx}>
                        <td style={{ fontWeight: 700, color: 'var(--primary)' }}>{m.day}</td>
                        <td>{m.menu || 'Fresh homestyle thali: Roti, Dal, Sabzi, Rice & Salad'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Location Map */}
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem' }}>Location & Directions</h3>
              <MapView
                lat={mess.coordinates?.lat || 12.9716}
                lng={mess.coordinates?.lng || 77.5946}
                title={mess.name}
                address={`${mess.address}, ${mess.locality}, ${mess.city}`}
                height="300px"
              />
            </div>
          </div>

          {/* Right Sidebar: Timings & Contact */}
          <div>
            <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Meal Timings</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Breakfast</div>
                  <div style={{ fontWeight: 600 }}>{mess.mealTimings?.breakfast || '7:30 AM - 9:30 AM'}</div>
                </div>
                <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Lunch</div>
                  <div style={{ fontWeight: 600 }}>{mess.mealTimings?.lunch || '12:30 PM - 3:00 PM'}</div>
                </div>
                <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Dinner</div>
                  <div style={{ fontWeight: 600 }}>{mess.mealTimings?.dinner || '7:30 PM - 10:00 PM'}</div>
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Contact Mess Service</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                Call directly to inquire about monthly subscriptions, trial meals, or doorstep tiffin delivery.
              </p>
              <a
                href={`tel:${mess.contactNumber}`}
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <Phone size={16} />
                <span>Call {mess.contactNumber}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessDetails;
