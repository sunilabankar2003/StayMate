import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { propertyService } from '../services/propertyService';
import { Building, Plus, Upload, MapPin, CheckCircle } from 'lucide-react';

const AMENITIES_LIST = [
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
  'Study Desk',
  'Gym',
];

const AddProperty = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [propertyType, setPropertyType] = useState('PG');
  const [monthlyRent, setMonthlyRent] = useState('');
  const [securityDeposit, setSecurityDeposit] = useState('');
  const [address, setAddress] = useState('');
  const [locality, setLocality] = useState('');
  const [city, setCity] = useState('Bangalore');
  const [state, setState] = useState('Karnataka');
  const [pincode, setPincode] = useState('');
  const [lat, setLat] = useState('12.9352');
  const [lng, setLng] = useState('77.6245');
  const [availableRooms, setAvailableRooms] = useState('1');
  const [totalRooms, setTotalRooms] = useState('5');
  const [occupancyType, setOccupancyType] = useState('Single');
  const [genderPreference, setGenderPreference] = useState('Any');
  const [amenities, setAmenities] = useState(['WiFi', 'RO Water', 'Power Backup']);
  const [foodAvailability, setFoodAvailability] = useState(false);
  const [foodType, setFoodType] = useState('None');
  const [mealsIncluded, setMealsIncluded] = useState([]);
  const [files, setFiles] = useState([]);
  const [imageUrl, setImageUrl] = useState('');
  const [imagesList, setImagesList] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const toggleAmenity = (item) => {
    setAmenities((prev) =>
      prev.includes(item) ? prev.filter((a) => a !== item) : [...prev, item]
    );
  };

  const toggleMeal = (meal) => {
    setMealsIncluded((prev) =>
      prev.includes(meal) ? prev.filter((m) => m !== meal) : [...prev, meal]
    );
  };

  const handleAddImageUrl = () => {
    if (imageUrl.trim()) {
      setImagesList((prev) => [...prev, imageUrl.trim()]);
      setImageUrl('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !monthlyRent || !address || !locality || !city) {
      setError('Please fill in all required property details');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('propertyType', propertyType);
      formData.append('monthlyRent', monthlyRent);
      formData.append('securityDeposit', securityDeposit || '0');
      formData.append('address', address);
      formData.append('locality', locality);
      formData.append('city', city);
      formData.append('state', state);
      formData.append('pincode', pincode);
      formData.append('coordinates', JSON.stringify({ lat: Number(lat), lng: Number(lng) }));
      formData.append('availableRooms', availableRooms);
      formData.append('totalRooms', totalRooms);
      formData.append('occupancyType', occupancyType);
      formData.append('genderPreference', genderPreference);
      formData.append('amenities', JSON.stringify(amenities));
      formData.append('foodAvailability', foodAvailability);
      formData.append('foodType', foodAvailability ? foodType : 'None');
      formData.append('mealsIncluded', JSON.stringify(mealsIncluded));

      if (imagesList.length > 0) {
        imagesList.forEach((url) => formData.append('images', url));
      }

      if (files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          formData.append('images', files[i]);
        }
      }

      const res = await propertyService.createProperty(formData);
      if (res.success) {
        alert(res.message);
        navigate('/owner/properties');
      }
    } catch (err) {
      setError(err.message || 'Failed to submit property');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem 0 4rem' }}>
      <div className="container" style={{ maxWidth: '850px' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>List a New Accommodation</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Provide accurate details to help students and working professionals discover your property.
          </p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit} className="card" style={{ padding: '2rem' }}>
          {/* Section 1: Basic Info */}
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--primary)' }}>
            1. Basic Property Details
          </h3>

          <div className="form-group">
            <label className="form-label">Property Title *</label>
            <input
              type="text"
              placeholder="e.g. Royal Orchid Luxury PG for Men with Food & WiFi"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description *</label>
            <textarea
              placeholder="Describe available room amenities, nearby colleges/bus stops, cleanliness rules, security..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-textarea"
              rows={4}
              required
            ></textarea>
          </div>

          <div className="grid-3" style={{ gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Property Type *</label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="form-select"
              >
                <option value="PG">Paying Guest (PG)</option>
                <option value="Flat">Rental Flat</option>
                <option value="Hostel">Student Hostel</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Monthly Rent (₹) *</label>
              <input
                type="number"
                placeholder="e.g. 8500"
                value={monthlyRent}
                onChange={(e) => setMonthlyRent(e.target.value)}
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Security Deposit (₹)</label>
              <input
                type="number"
                placeholder="e.g. 15000"
                value={securityDeposit}
                onChange={(e) => setSecurityDeposit(e.target.value)}
                className="form-control"
              />
            </div>
          </div>

          {/* Section 2: Address & Location */}
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '2rem 0 1.25rem', color: 'var(--primary)' }}>
            2. Address & Geolocation
          </h3>

          <div className="form-group">
            <label className="form-label">Full Street Address *</label>
            <input
              type="text"
              placeholder="e.g. 12th Cross, 5th Block, near Jyoti Nivas College"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="form-control"
              required
            />
          </div>

          <div className="grid-3" style={{ gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Locality / Area *</label>
              <input
                type="text"
                placeholder="e.g. Koramangala"
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">City *</label>
              <input
                type="text"
                placeholder="e.g. Bangalore"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Pincode</label>
              <input
                type="text"
                placeholder="e.g. 560095"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className="form-control"
              />
            </div>
          </div>

          <div className="grid-2" style={{ gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Latitude (for Maps)</label>
              <input
                type="text"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Longitude (for Maps)</label>
              <input
                type="text"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
                className="form-control"
              />
            </div>
          </div>

          {/* Section 3: Room Occupancy & Criteria */}
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '2rem 0 1.25rem', color: 'var(--primary)' }}>
            3. Occupancy & Tenant Criteria
          </h3>

          <div className="grid-4" style={{ gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Occupancy</label>
              <select
                value={occupancyType}
                onChange={(e) => setOccupancyType(e.target.value)}
                className="form-select"
              >
                <option value="Single">Single Room</option>
                <option value="Double">Double Sharing</option>
                <option value="Triple">Triple Sharing</option>
                <option value="Any">Any Occupancy</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Gender Preference</label>
              <select
                value={genderPreference}
                onChange={(e) => setGenderPreference(e.target.value)}
                className="form-select"
              >
                <option value="Any">Any (Co-living)</option>
                <option value="Male">Male / Boys Only</option>
                <option value="Female">Female / Girls Only</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Available Rooms</label>
              <input
                type="number"
                min="0"
                value={availableRooms}
                onChange={(e) => setAvailableRooms(e.target.value)}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Total Rooms</label>
              <input
                type="number"
                min="1"
                value={totalRooms}
                onChange={(e) => setTotalRooms(e.target.value)}
                className="form-control"
              />
            </div>
          </div>

          {/* Amenities Checkboxes */}
          <div className="form-group" style={{ marginTop: '1rem' }}>
            <label className="form-label">Available Amenities</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.6rem' }}>
              {AMENITIES_LIST.map((amenity) => (
                <label
                  key={amenity}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  <input
                    type="checkbox"
                    checked={amenities.includes(amenity)}
                    onChange={() => toggleAmenity(amenity)}
                  />
                  <span>{amenity}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Section 4: Food Facility */}
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '2rem 0 1.25rem', color: 'var(--primary)' }}>
            4. Food & Dining Facilities
          </h3>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <input
              type="checkbox"
              id="foodCheck"
              checked={foodAvailability}
              onChange={(e) => setFoodAvailability(e.target.checked)}
              style={{ width: '18px', height: '18px' }}
            />
            <label htmlFor="foodCheck" style={{ fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer' }}>
              Food / Meals facility is provided in this property
            </label>
          </div>

          {foodAvailability && (
            <div className="grid-2" style={{ gap: '1rem', backgroundColor: 'var(--bg-subtle)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
              <div className="form-group">
                <label className="form-label">Dietary Type</label>
                <select
                  value={foodType}
                  onChange={(e) => setFoodType(e.target.value)}
                  className="form-select"
                >
                  <option value="Veg">Vegetarian Only</option>
                  <option value="Non-Veg">Non-Vegetarian</option>
                  <option value="Both">Both Veg & Non-Veg</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Meals Included</label>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.4rem' }}>
                  {['Breakfast', 'Lunch', 'Dinner'].map((meal) => (
                    <label key={meal} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={mealsIncluded.includes(meal)}
                        onChange={() => toggleMeal(meal)}
                      />
                      <span>{meal}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Section 5: Property Images */}
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '2rem 0 1.25rem', color: 'var(--primary)' }}>
            5. Property Images
          </h3>

          <div className="form-group">
            <label className="form-label">Upload Image Files (Up to 8 images)</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setFiles(e.target.files)}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Or Add Online Image URL</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="url"
                placeholder="https://images.unsplash.com/photo-..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="form-control"
              />
              <button type="button" onClick={handleAddImageUrl} className="btn btn-outline btn-sm">
                Add URL
              </button>
            </div>
          </div>

          {imagesList.length > 0 && (
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
              {imagesList.map((url, i) => (
                <div key={i} style={{ position: 'relative', width: '70px', height: '50px' }}>
                  <img src={url} alt="Added" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }} />
                </div>
              ))}
            </div>
          )}

          <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <button
              type="button"
              onClick={() => navigate('/owner/properties')}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
            >
              <CheckCircle size={18} />
              <span>{loading ? 'Submitting...' : 'Submit Listing for Verification'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProperty;
