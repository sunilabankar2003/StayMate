import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { favoriteService } from '../services/favoriteService';
import PropertyCard from '../components/PropertyCard';
import { Bookmark, Building } from 'lucide-react';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const res = await favoriteService.getFavorites();
      if (res.success) {
        setFavorites(res.data || []);
      }
    } catch (err) {
      console.error('Fetch favorites error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  return (
    <div style={{ padding: '2.5rem 0 5rem' }}>
      <div className="container">
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Saved Accommodations</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Review and compare the PGs, hostels, and flats you bookmarked.
          </p>
        </div>

        {loading ? (
          <div className="spinner"></div>
        ) : favorites.length > 0 ? (
          <div className="grid-3">
            {favorites.map((property) => (
              <PropertyCard
                key={property._id}
                property={property}
                isInitiallyFavorited={true}
                onFavoriteToggle={fetchFavorites}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <Bookmark className="empty-state-icon" />
            <h3>No saved properties</h3>
            <p>You haven't bookmarked any accommodations yet. Browse our verified listings to save your favorites.</p>
            <Link to="/properties" className="btn btn-primary btn-sm">
              Discover Places
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
