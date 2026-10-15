import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { propertyService } from '../services/propertyService';
import { Building, Save, ArrowLeft } from 'lucide-react';

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

const EditProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [propertyType, setPropertyType] = useState('PG');
  const [monthlyRent, setMonthlyRent] = useState('');
  const [securityDeposit, setSecurityDeposit] = useState('');
  const [address, setAddress] = useState('');
  const [locality, setLocality] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [availableRooms, setAvailableRooms] = useState('1');
  const [totalRooms, setTotalRooms] = useState('5');
  const [occupancyType, setOccupancyType] = useState('Single');
  const [genderPreference, setGenderPreference] = useState('Any');
  const [amenities, setAmenities] = useState([]);
  const [foodAvailability, setFoodAvailability] = useState(false);
  const [foodType, setFoodType] = useState('None');
  const [isAvailable, setIsAvailable] = useState(true);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProp = async () => {
      try {
        setLoading(true);
        const res = await propertyService.getPropertyById(id);
        if (res.success && res.data) {
          const p = res.data;
          setTitle(p.title || '');
          setDescription(p.description || '');
          setPropertyType(p.propertyType || 'PG');
          setMonthlyRent(p.monthlyRent?.toString() || '');
          setSecurityDeposit(p.securityDeposit?.toString() || '');
          setAddress(p.address || '');
          setLocality(p.locality || '');
          setCity(p.city || '');
          setState(p.state || '');
          setPincode(p.pincode || '');
          setAvailableRooms(p.availableRooms?.toString() || '1');
          setTotalRooms(p.totalRooms?.toString() || '5');
          setOccupancyType(p.occupancyType || 'Single');
          setGenderPreference(p.genderPreference || 'Any');
          setAmenities(p.amenities || []);
          setFoodAvailability(p.foodAvailability || false);
          setFoodType(p.foodType || 'None');
          setIsAvailable(p.isAvailable ?? true);
        }
      } catch (err) {
        setError(err.message || 'Failed to load property');
      } finally {
        setLoading(false);
      }
    };

    fetchProp();
  }, [id]);

  const toggleAmenity = (item) => {
    setAmenities((prev) =>
      prev.includes(item) ? prev.filter((a) => a !== item) : [...prev, item]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
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
      formData.append('availableRooms', availableRooms);
      formData.append('totalRooms', totalRooms);
      formData.append('occupancyType', occupancyType);
      formData.append('genderPreference', genderPreference);
      formData.append('amenities', JSON.stringify(amenities));
      formData.append('foodAvailability', foodAvailability);
      formData.append('foodType', foodAvailability ? foodType : 'None');
      formData.append('isAvailable', isAvailable);

      const res = await propertyService.updateProperty(id, formData);
      if (res.success) {
        alert('Property updated successfully!');
        navigate('/owner/properties');
      }
    } catch (err) {
      setError(err.message || 'Failed to update property');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '5rem 0', textAlign: 'center' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem 0 4rem' }}>
      <div className="container" style={{ maxWidth: '850px' }}>
        <button
          onClick={() => navigate('/owner/properties')}
          className="btn btn-outline btn-sm"
          style={{ marginBottom: '1.5rem' }}
        >
          <ArrowLeft size={16} /> Back to My Properties
        </button>

        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1.5rem' }}>
          Edit Property Listing
        </h1>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit} className="card" style={{ padding: '2rem' }}>
          <div className="form-group">
            <label className="form-label">Property Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-textarea"
              rows={4}
              required
            ></textarea>
          </div>

          <div className="grid-3" style={{ gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Property Type</label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="form-select"
              >
                <option value="PG">PG</option>
                <option value="Flat">Flat</option>
                <option value="Hostel">Hostel</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Monthly Rent (₹)</label>
              <input
                type="number"
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
                value={securityDeposit}
                onChange={(e) => setSecurityDeposit(e.target.value)}
                className="form-control"
              />
            </div>
          </div>

          <div className="grid-3" style={{ gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Locality</label>
              <input
                type="text"
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                className="form-control"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="form-control"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Occupancy</label>
              <select
                value={occupancyType}
                onChange={(e) => setOccupancyType(e.target.value)}
                className="form-select"
              >
                <option value="Single">Single</option>
                <option value="Double">Double</option>
                <option value="Triple">Triple</option>
                <option value="Any">Any</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Amenities</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.5rem' }}>
              {AMENITIES_LIST.map((item) => (
                <label key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
                  <input
                    type="checkbox"
                    checked={amenities.includes(item)}
                    onChange={() => toggleAmenity(item)}
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '1.25rem 0' }}>
            <input
              type="checkbox"
              id="isAvailCheck"
              checked={isAvailable}
              onChange={(e) => setIsAvailable(e.target.checked)}
              style={{ width: '18px', height: '18px' }}
            />
            <label htmlFor="isAvailCheck" style={{ fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}>
              Mark this property as currently Available for booking
            </label>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1rem' }}
          >
            <Save size={16} />
            <span>{saving ? 'Saving Changes...' : 'Save Updated Property'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProperty;
