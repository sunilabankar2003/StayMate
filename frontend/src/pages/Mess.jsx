import React, { useState, useEffect } from 'react';
import { messService } from '../services/messService';
import MessCard from '../components/MessCard';
import { Utensils, Search, Filter, RotateCcw } from 'lucide-react';

const Mess = () => {
  const [messServices, setMessServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [city, setCity] = useState('');
  const [foodType, setFoodType] = useState('All');
  const [mealType, setMealType] = useState('All');
  const [maxPrice, setMaxPrice] = useState('');

  const fetchMess = async () => {
    try {
      setLoading(true);
      const params = {};
      if (city.trim()) params.city = city.trim();
      if (foodType !== 'All') params.foodType = foodType;
      if (mealType !== 'All') params.mealType = mealType;
      if (maxPrice) params.maxPrice = maxPrice;

      const res = await messService.getMessServices(params);
      if (res.success) {
        setMessServices(res.data || []);
      }
    } catch (err) {
      console.error('Fetch mess error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMess();
  }, [foodType, mealType]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchMess();
  };

  const handleReset = () => {
    setCity('');
    setFoodType('All');
    setMealType('All');
    setMaxPrice('');
    messService.getMessServices().then((res) => {
      if (res.success) setMessServices(res.data || []);
    });
  };

  return (
    <div style={{ padding: '2.5rem 0 5rem' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '2.5rem', textAlign: 'center', maxWidth: '700px', margin: '0 auto 2.5rem' }}>
          <span className="badge badge-warning" style={{ marginBottom: '0.5rem' }}>
            Student Food Discovery
          </span>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.75rem' }}>
            Find Mess & Daily Tiffin Services
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Wholesome, home-cooked daily meals and flexible monthly subscription plans near your accommodation.
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
          <div style={{ flex: 1, minWidth: '180px' }}>
            <label className="form-label" style={{ fontSize: '0.8rem' }}>City</label>
            <input
              type="text"
              placeholder="e.g. Bangalore, Pune"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="form-control"
            />
          </div>

          <div style={{ minWidth: '160px' }}>
            <label className="form-label" style={{ fontSize: '0.8rem' }}>Dietary Type</label>
            <select
              value={foodType}
              onChange={(e) => setFoodType(e.target.value)}
              className="form-select"
            >
              <option value="All">All Diets</option>
              <option value="Veg">Pure Vegetarian</option>
              <option value="Non-Veg">Non-Vegetarian</option>
              <option value="Both">Both Veg & Non-Veg</option>
            </select>
          </div>

          <div style={{ minWidth: '160px' }}>
            <label className="form-label" style={{ fontSize: '0.8rem' }}>Meals Included</label>
            <select
              value={mealType}
              onChange={(e) => setMealType(e.target.value)}
              className="form-select"
            >
              <option value="All">All Meals</option>
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch">Lunch</option>
              <option value="Dinner">Dinner</option>
            </select>
          </div>

          <div style={{ minWidth: '160px' }}>
            <label className="form-label" style={{ fontSize: '0.8rem' }}>Max Monthly (₹)</label>
            <input
              type="number"
              placeholder="Max Price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="form-control"
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignSelf: 'flex-end' }}>
            <button type="submit" className="btn btn-primary" style={{ padding: '0.65rem 1rem' }}>
              <Search size={16} /> Filter
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

        {/* Mess Cards Grid */}
        {loading ? (
          <div className="spinner"></div>
        ) : messServices.length > 0 ? (
          <div className="grid-3">
            {messServices.map((mess) => (
              <MessCard key={mess._id} mess={mess} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <Utensils className="empty-state-icon" />
            <h3>No mess services match your criteria</h3>
            <p>Try expanding your search or resetting your dietary filters.</p>
            <button onClick={handleReset} className="btn btn-primary btn-sm">
              Show All Mess Services
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Mess;
