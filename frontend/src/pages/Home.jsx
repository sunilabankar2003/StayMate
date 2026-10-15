import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { propertyService } from '../services/propertyService';
import { messService } from '../services/messService';
import PropertyCard from '../components/PropertyCard';
import MessCard from '../components/MessCard';
import {
  Search,
  Building,
  Users,
  Utensils,
  ShieldCheck,
  CheckCircle,
  ArrowRight,
  Sparkles,
  MapPin,
} from 'lucide-react';

const Home = () => {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [featuredMess, setFeaturedMess] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchCity, setSearchCity] = useState('');
  const [searchType, setSearchType] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const [propRes, messRes] = await Promise.all([
          propertyService.getProperties({ limit: 6, sort: 'rating_desc' }),
          messService.getMessServices({ limit: 3 }),
        ]);
        if (propRes.success) setFeaturedProperties(propRes.data || []);
        if (messRes.success) setFeaturedMess(messRes.data || []);
      } catch (err) {
        console.error('Home data load error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchCity.trim()) params.append('city', searchCity.trim());
    if (searchType !== 'All') params.append('propertyType', searchType);
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <div>
      {/* Hero Section */}
      <section
        style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #0d9488 100%)',
          color: 'white',
          padding: '5rem 0 6rem',
          position: 'relative',
        }}
      >
        <div className="container" style={{ textAlign: 'center', maxWidth: '850px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(8px)',
              padding: '0.4rem 1rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.85rem',
              fontWeight: 600,
              marginBottom: '1.5rem',
            }}
          >
            <Sparkles size={16} color="#fde047" />
            <span>Smart Accommodation & Roommate Finder for Students & Techies</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
              fontWeight: 800,
              lineHeight: 1.2,
              marginBottom: '1.25rem',
            }}
          >
            Find Your Ideal PG, Flat, Roommate & Mess Near College
          </h1>

          <p
            style={{
              fontSize: '1.15rem',
              opacity: 0.9,
              marginBottom: '2.5rem',
              lineHeight: 1.6,
            }}
          >
            StayMate connects students and working professionals with verified PGs, shared flats,
            lifestyle-compatible roommates, and hygienic home-style mess services.
          </p>

          {/* Search Box Form */}
          <form
            onSubmit={handleHeroSearch}
            style={{
              backgroundColor: 'white',
              borderRadius: 'var(--radius-lg)',
              padding: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ flex: 2, minWidth: '200px', display: 'flex', alignItems: 'center', gap: '8px', padding: '0 0.75rem' }}>
              <MapPin size={20} color="var(--primary)" />
              <input
                type="text"
                placeholder="Enter City or Area (e.g. Bangalore, Pune)..."
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                style={{
                  border: 'none',
                  outline: 'none',
                  width: '100%',
                  fontSize: '1rem',
                  color: 'var(--text-main)',
                }}
              />
            </div>

            <div style={{ flex: 1, minWidth: '150px', borderLeft: '1px solid var(--border-color)', paddingLeft: '0.75rem' }}>
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                style={{
                  border: 'none',
                  outline: 'none',
                  width: '100%',
                  fontSize: '0.95rem',
                  color: 'var(--text-main)',
                  background: 'none',
                  cursor: 'pointer',
                }}
              >
                <option value="All">All Types</option>
                <option value="PG">Paying Guest (PG)</option>
                <option value="Flat">Rental Flat</option>
                <option value="Hostel">Student Hostel</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary btn-lg" style={{ minWidth: '140px' }}>
              <Search size={18} />
              <span>Search</span>
            </button>
          </form>
        </div>
      </section>

      {/* Feature Value Props */}
      <section style={{ padding: '4rem 0', backgroundColor: 'var(--bg-surface)' }}>
        <div className="container">
          <div className="grid-4">
            <div className="card" style={{ padding: '1.75rem', textAlign: 'center' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                <Building size={28} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>Verified Listings</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Admin-verified PGs, hostels, and flats with transparent pricing, deposits, and real photos.
              </p>
            </div>

            <div className="card" style={{ padding: '1.75rem', textAlign: 'center' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'var(--success-light)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                <Users size={28} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>Roommate Match</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Smart compatibility algorithm matching sleep routine, cleanliness, food habits, and budget.
              </p>
            </div>

            <div className="card" style={{ padding: '1.75rem', textAlign: 'center' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                <Utensils size={28} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>Mess & Tiffin</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Discover hygienic student mess and daily tiffin services with full 7-day menus and meal timings.
              </p>
            </div>

            <div className="card" style={{ padding: '1.75rem', textAlign: 'center' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#f0fdfa', color: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                <ShieldCheck size={28} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>Real-Time Chat</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Direct, secure messaging with verified property owners and compatible roommates via Socket.IO.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>Top Accommodations</span>
              <h2 style={{ fontSize: '1.85rem', fontWeight: 800 }}>Featured PGs & Rental Flats</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Verified accommodations ready for immediate student move-in</p>
            </div>
            <Link to="/properties" className="btn btn-outline">
              <span>View All Properties</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div className="spinner"></div>
          ) : featuredProperties.length > 0 ? (
            <div className="grid-3">
              {featuredProperties.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <Building className="empty-state-icon" />
              <h3>No properties currently available</h3>
              <p>Check back shortly or adjust your location filter.</p>
            </div>
          )}
        </div>
      </section>

      {/* Mess & Tiffin Showcase */}
      <section style={{ padding: '4rem 0', backgroundColor: 'var(--bg-surface)' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="badge badge-warning" style={{ marginBottom: '0.5rem' }}>Healthy Dining</span>
              <h2 style={{ fontSize: '1.85rem', fontWeight: 800 }}>Nearby Mess & Tiffin Services</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Home-cooked, student-friendly food subscription plans</p>
            </div>
            <Link to="/mess" className="btn btn-outline">
              <span>Explore All Mess Services</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div className="spinner"></div>
          ) : featuredMess.length > 0 ? (
            <div className="grid-3">
              {featuredMess.map((mess) => (
                <MessCard key={mess._id} mess={mess} />
              ))}
            </div>
          ) : null}
        </div>
      </section>

      {/* Roommate Matching Banner */}
      <section style={{ padding: '5rem 0', background: 'linear-gradient(135deg, #eff6ff 0%, #f0fdfa 100%)' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '750px' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: 'var(--shadow-md)' }}>
            <Users size={30} />
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>Looking for a Compatible Roommate?</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '2rem' }}>
            Stop stressing over finding the right flatmate. Tell us your college, study habits, food preferences,
            and budget — our algorithm will match you with students on the same wavelength.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/roommates" className="btn btn-primary btn-lg">
              <span>Find Compatible Roommates</span>
              <ArrowRight size={18} />
            </Link>
            <Link to="/register" className="btn btn-outline btn-lg">
              Create Student Profile
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
