import React, { useState, useEffect } from 'react';
import { roommateService } from '../services/roommateService';
import RoommateCard from '../components/RoommateCard';
import { Users, Filter, RotateCcw, Sparkles } from 'lucide-react';

const FindRoommates = () => {
  const [roommates, setRoommates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [city, setCity] = useState('');
  const [maxBudget, setMaxBudget] = useState('');
  const [genderPreference, setGenderPreference] = useState('any');
  const [cleanliness, setCleanliness] = useState('');
  const [foodHabit, setFoodHabit] = useState('');
  const [smoking, setSmoking] = useState('');

  const fetchRoommates = async () => {
    try {
      setLoading(true);
      const params = {};
      if (city.trim()) params.city = city.trim();
      if (maxBudget) params.maxBudget = maxBudget;
      if (genderPreference !== 'any') params.genderPreference = genderPreference;
      if (cleanliness) params.cleanliness = cleanliness;
      if (foodHabit) params.foodHabit = foodHabit;
      if (smoking) params.smoking = smoking;

      const res = await roommateService.getRoommates(params);
      if (res.success) {
        setRoommates(res.data || []);
      }
    } catch (err) {
      console.error('Fetch roommates error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoommates();
  }, [genderPreference, cleanliness, foodHabit, smoking]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchRoommates();
  };

  const handleReset = () => {
    setCity('');
    setMaxBudget('');
    setGenderPreference('any');
    setCleanliness('');
    setFoodHabit('');
    setSmoking('');
    roommateService.getRoommates().then((res) => {
      if (res.success) setRoommates(res.data || []);
    });
  };

  return (
    <div style={{ padding: '2.5rem 0 5rem' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 2.5rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              padding: '0.35rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.85rem',
              fontWeight: 700,
              marginBottom: '0.75rem',
            }}
          >
            <Sparkles size={16} /> Compatibility Algorithm
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.75rem' }}>
            Find Compatible Roommates
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Match scores are transparently calculated based on overlapping budget ranges, preferred city/locality,
            sleep schedules, food habits, and cleanliness routines.
          </p>
        </div>

        {/* Filter Bar */}
        <form
          onSubmit={handleSearch}
          className="card"
          style={{
            padding: '1.25rem',
            marginBottom: '2.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ flex: 1, minWidth: '160px' }}>
            <label className="form-label" style={{ fontSize: '0.8rem' }}>City</label>
            <input
              type="text"
              placeholder="e.g. Bangalore, Pune"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="form-control"
            />
          </div>

          <div style={{ minWidth: '140px' }}>
            <label className="form-label" style={{ fontSize: '0.8rem' }}>Max Budget (₹)</label>
            <input
              type="number"
              placeholder="e.g. 12000"
              value={maxBudget}
              onChange={(e) => setMaxBudget(e.target.value)}
              className="form-control"
            />
          </div>

          <div style={{ minWidth: '140px' }}>
            <label className="form-label" style={{ fontSize: '0.8rem' }}>Gender</label>
            <select
              value={genderPreference}
              onChange={(e) => setGenderPreference(e.target.value)}
              className="form-select"
            >
              <option value="any">Any Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div style={{ minWidth: '150px' }}>
            <label className="form-label" style={{ fontSize: '0.8rem' }}>Cleanliness</label>
            <select
              value={cleanliness}
              onChange={(e) => setCleanliness(e.target.value)}
              className="form-select"
            >
              <option value="">Any Routine</option>
              <option value="very_clean">Very Clean</option>
              <option value="moderate">Moderate</option>
              <option value="relaxed">Relaxed</option>
            </select>
          </div>

          <div style={{ minWidth: '150px' }}>
            <label className="form-label" style={{ fontSize: '0.8rem' }}>Food Habit</label>
            <select
              value={foodHabit}
              onChange={(e) => setFoodHabit(e.target.value)}
              className="form-select"
            >
              <option value="">Any Diet</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="non_vegetarian">Non-Vegetarian</option>
              <option value="eggetarian">Eggetarian</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignSelf: 'flex-end' }}>
            <button type="submit" className="btn btn-primary" style={{ padding: '0.65rem 1rem' }}>
              Filter
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="btn btn-outline"
              style={{ padding: '0.65rem 0.85rem' }}
              title="Reset Filters"
            >
              <RotateCcw size={16} />
            </button>
          </div>
        </form>

        {/* Roommates Grid */}
        {loading ? (
          <div className="spinner"></div>
        ) : roommates.length > 0 ? (
          <div className="grid-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
            {roommates.map((roommate) => (
              <RoommateCard
                key={roommate._id}
                roommate={roommate}
                onConnectionChange={fetchRoommates}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <Users className="empty-state-icon" />
            <h3>No roommate profiles matched</h3>
            <p>Try resetting filters to view all eligible seekers.</p>
            <button onClick={handleReset} className="btn btn-primary btn-sm">
              Show All Roommate Profiles
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FindRoommates;
