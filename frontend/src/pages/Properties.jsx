import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { propertyService } from '../services/propertyService';
import PropertyCard from '../components/PropertyCard';
import {
  Search,
  Filter,
  Building,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
} from 'lucide-react';

const AMENITY_OPTIONS = [
  'WiFi',
  'AC',
  'Geyser',
  'RO Water',
  'Power Backup',
  'Laundry',
  'Parking',
  'Security',
  'CCTV',
  'Attached Washroom',
  'Housekeeping',
  'Refrigerator',
  'TV',
];

const Properties = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters State
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [locality, setLocality] = useState(searchParams.get('locality') || '');
  const [propertyType, setPropertyType] = useState(searchParams.get('propertyType') || 'All');
  const [minRent, setMinRent] = useState(searchParams.get('minRent') || '');
  const [maxRent, setMaxRent] = useState(searchParams.get('maxRent') || '');
  const [genderPreference, setGenderPreference] = useState(searchParams.get('genderPreference') || 'All');
  const [occupancyType, setOccupancyType] = useState(searchParams.get('occupancyType') || 'All');
  const [foodAvailability, setFoodAvailability] = useState(searchParams.get('foodAvailability') || '');
  const [selectedAmenities, setSelectedAmenities] = useState(
    searchParams.get('amenities') ? searchParams.get('amenities').split(',') : []
  );
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const [page, setPage] = useState(parseInt(searchParams.get('page'), 10) || 1);

  // Data State
  const [properties, setProperties] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 9,
        sort,
      };

      if (keyword.trim()) params.keyword = keyword.trim();
      if (city.trim()) params.city = city.trim();
      if (locality.trim()) params.locality = locality.trim();
      if (propertyType !== 'All') params.propertyType = propertyType;
      if (minRent) params.minRent = minRent;
      if (maxRent) params.maxRent = maxRent;
      if (genderPreference !== 'All') params.genderPreference = genderPreference;
      if (occupancyType !== 'All') params.occupancyType = occupancyType;
      if (foodAvailability !== '') params.foodAvailability = foodAvailability;
      if (selectedAmenities.length > 0) params.amenities = selectedAmenities.join(',');

      const res = await propertyService.getProperties(params);
      if (res.success) {
        setProperties(res.data || []);
        setTotalPages(res.totalPages || 1);
        setTotalCount(res.total || 0);
      }
    } catch (err) {
      console.error('Fetch properties error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [page, sort, propertyType, genderPreference, occupancyType, foodAvailability]);

  const handleApplyFilters = (e) => {
    if (e) e.preventDefault();
    setPage(1);
    fetchProperties();
    setShowMobileFilters(false);
  };

  const handleResetFilters = () => {
    setKeyword('');
    setCity('');
    setLocality('');
    setPropertyType('All');
    setMinRent('');
    setMaxRent('');
    setGenderPreference('All');
    setOccupancyType('All');
    setFoodAvailability('');
    setSelectedAmenities([]);
    setSort('newest');
    setPage(1);
    setSearchParams({});
    setTimeout(() => {
      propertyService.getProperties({ page: 1, limit: 9 }).then((res) => {
        if (res.success) {
          setProperties(res.data || []);
          setTotalPages(res.totalPages || 1);
          setTotalCount(res.total || 0);
        }
      });
    }, 50);
  };

  const toggleAmenity = (amenity) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  return (
    <div style={{ padding: '2.5rem 0 5rem' }}>
      <div className="container">
        {/* Page Title & Mobile Filter Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Explore Accommodations</h1>
            <p style={{ color: 'var(--text-muted)' }}>
              Showing {totalCount} verified PGs, hostels, and rental flats
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Sort Select */}
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setPage(1);
              }}
              className="form-select"
              style={{ width: 'auto', padding: '0.5rem 1rem' }}
            >
              <option value="newest">Sort: Newest First</option>
              <option value="rent_asc">Rent: Low to High</option>
              <option value="rent_desc">Rent: High to Low</option>
              <option value="rating_desc">Highest Rated</option>
            </select>

            <button
              className="btn btn-outline"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              style={{ display: 'inline-flex' }}
            >
              <SlidersHorizontal size={16} />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Layout: Sidebar Filters + Main Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '2rem', alignItems: 'start' }}>
          {/* Filters Sidebar */}
          <aside
            className="card"
            style={{
              padding: '1.5rem',
              position: 'sticky',
              top: '90px',
              display: showMobileFilters ? 'block' : 'block',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Filter size={18} color="var(--primary)" /> Filter Places
              </h3>
              <button
                type="button"
                onClick={handleResetFilters}
                style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <RotateCcw size={12} /> Reset
              </button>
            </div>

            <form onSubmit={handleApplyFilters}>
              {/* Keyword */}
              <div className="form-group">
                <label className="form-label">Search Keyword</label>
                <input
                  type="text"
                  placeholder="e.g. WiFi, Koramangala..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="form-control"
                />
              </div>

              {/* City */}
              <div className="form-group">
                <label className="form-label">City</label>
                <input
                  type="text"
                  placeholder="e.g. Bangalore, Pune"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="form-control"
                />
              </div>

              {/* Property Type */}
              <div className="form-group">
                <label className="form-label">Property Type</label>
                <select
                  value={propertyType}
                  onChange={(e) => {
                    setPropertyType(e.target.value);
                    setPage(1);
                  }}
                  className="form-select"
                >
                  <option value="All">All Types</option>
                  <option value="PG">Paying Guest (PG)</option>
                  <option value="Flat">Rental Flat</option>
                  <option value="Hostel">Student Hostel</option>
                </select>
              </div>

              {/* Budget Range */}
              <div className="form-group">
                <label className="form-label">Monthly Rent (₹)</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="number"
                    placeholder="Min"
                    value={minRent}
                    onChange={(e) => setMinRent(e.target.value)}
                    className="form-control"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxRent}
                    onChange={(e) => setMaxRent(e.target.value)}
                    className="form-control"
                  />
                </div>
              </div>

              {/* Gender Preference */}
              <div className="form-group">
                <label className="form-label">Gender Preference</label>
                <select
                  value={genderPreference}
                  onChange={(e) => {
                    setGenderPreference(e.target.value);
                    setPage(1);
                  }}
                  className="form-select"
                >
                  <option value="All">Any Gender</option>
                  <option value="Male">Male / Boys</option>
                  <option value="Female">Female / Girls</option>
                </select>
              </div>

              {/* Occupancy Type */}
              <div className="form-group">
                <label className="form-label">Occupancy Type</label>
                <select
                  value={occupancyType}
                  onChange={(e) => {
                    setOccupancyType(e.target.value);
                    setPage(1);
                  }}
                  className="form-select"
                >
                  <option value="All">Any Occupancy</option>
                  <option value="Single">Single Room</option>
                  <option value="Double">Double Sharing</option>
                  <option value="Triple">Triple Sharing</option>
                </select>
              </div>

              {/* Food Availability */}
              <div className="form-group">
                <label className="form-label">Food Included</label>
                <select
                  value={foodAvailability}
                  onChange={(e) => {
                    setFoodAvailability(e.target.value);
                    setPage(1);
                  }}
                  className="form-select"
                >
                  <option value="">Any</option>
                  <option value="true">Yes, Food Included</option>
                  <option value="false">Self Cooking / Mess Separate</option>
                </select>
              </div>

              {/* Amenities Checkboxes */}
              <div className="form-group">
                <label className="form-label">Amenities</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: '160px', overflowY: 'auto' }}>
                  {AMENITY_OPTIONS.map((amenity) => (
                    <label
                      key={amenity}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedAmenities.includes(amenity)}
                        onChange={() => toggleAmenity(amenity)}
                      />
                      <span>{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                Apply Filters
              </button>
            </form>
          </aside>

          {/* Properties Grid Area */}
          <div>
            {loading ? (
              <div className="spinner"></div>
            ) : properties.length > 0 ? (
              <>
                <div className="grid-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))' }}>
                  {properties.map((property) => (
                    <PropertyCard key={property._id} property={property} />
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', marginTop: '3rem' }}>
                    <button
                      className="btn btn-outline btn-sm"
                      disabled={page <= 1}
                      onClick={() => {
                        setPage((p) => Math.max(1, p - 1));
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    >
                      <ChevronLeft size={16} /> Prev
                    </button>

                    <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                      Page <strong>{page}</strong> of <strong>{totalPages}</strong>
                    </span>

                    <button
                      className="btn btn-outline btn-sm"
                      disabled={page >= totalPages}
                      onClick={() => {
                        setPage((p) => Math.min(totalPages, p + 1));
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    >
                      Next <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="empty-state">
                <Building className="empty-state-icon" />
                <h3>No matching accommodations found</h3>
                <p>Try clearing some filters or searching for another city.</p>
                <button onClick={handleResetFilters} className="btn btn-primary btn-sm">
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Properties;
