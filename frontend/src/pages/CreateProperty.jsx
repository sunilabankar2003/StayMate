import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Home,
  Building2,
  MapPin,
  IndianRupee,
  Users,
  BedDouble,
  Image,
  Plus,
  X,
  Save,
} from "lucide-react";

function CreateProperty() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    type: "PG",
    description: "",

    address: "",
    city: "",
    area: "",
    latitude: "",
    longitude: "",

    rent: "",
    securityDeposit: "",

    genderPreference: "Any",
    roomType: "Single",

    availableRooms: "",
    totalRooms: "",

    amenities: [],
    rules: [],
    images: [],

    isAvailable: true,
  });

  const [amenityInput, setAmenityInput] = useState("");
  const [ruleInput, setRuleInput] = useState("");
  const [imageInput, setImageInput] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const addAmenity = () => {
    const value = amenityInput.trim();

    if (!value) return;

    if (!formData.amenities.includes(value)) {
      setFormData((prev) => ({
        ...prev,
        amenities: [...prev.amenities, value],
      }));
    }

    setAmenityInput("");
  };

  const removeAmenity = (amenity) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.filter((item) => item !== amenity),
    }));
  };

  const addRule = () => {
    const value = ruleInput.trim();

    if (!value) return;

    if (!formData.rules.includes(value)) {
      setFormData((prev) => ({
        ...prev,
        rules: [...prev.rules, value],
      }));
    }

    setRuleInput("");
  };

  const removeRule = (rule) => {
    setFormData((prev) => ({
      ...prev,
      rules: prev.rules.filter((item) => item !== rule),
    }));
  };

  const addImage = () => {
    const value = imageInput.trim();

    if (!value) return;

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, value],
    }));

    setImageInput("");
  };

  const removeImage = (image) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((item) => item !== image),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      formData.availableRooms &&
      formData.totalRooms &&
      Number(formData.availableRooms) > Number(formData.totalRooms)
    ) {
      setError("Available rooms cannot be greater than total rooms.");
      return;
    }

    if (Number(formData.rent) <= 0) {
      setError("Please enter a valid monthly rent.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        title: formData.title,
        type: formData.type,
        description: formData.description,

        location: {
          address: formData.address,
          city: formData.city,
          area: formData.area,
          lat: formData.latitude ? Number(formData.latitude) : undefined,
          long: formData.longitude ? Number(formData.longitude) : undefined,
        },

        rent: Number(formData.rent),

        securityDeposit: formData.securityDeposit
          ? Number(formData.securityDeposit)
          : 0,

        genderPreference: formData.genderPreference,
        roomType: formData.roomType,

        availableRooms: formData.availableRooms
          ? Number(formData.availableRooms)
          : 0,

        totalRooms: formData.totalRooms ? Number(formData.totalRooms) : 0,

        amenities: formData.amenities,
        rules: formData.rules,
        images: formData.images,

        isAvailable: formData.isAvailable,
      };

      const response = await axios.post(
        "http://localhost:5000/api/properties",
        payload,
        {
          withCredentials: true,
        },
      );

      if (response.data.success) {
        setSuccess(
          "Property created successfully. It is now waiting for verification.",
        );

        setTimeout(() => {
          navigate("/dashboard");
        }, 1200);
      }
    } catch (err) {
      console.error("CREATE PROPERTY ERROR:", err.response?.data || err);

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to create property.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-property-page">
      {/* Header */}
      <header className="create-property-header">
        <div className="create-property-header-inner">
          <Link to="/dashboard" className="create-property-back">
            <ArrowLeft size={18} />
            Back to Dashboard
          </Link>

          <Link to="/dashboard" className="create-property-logo">
            <Home size={21} />
            StayMate
          </Link>
        </div>
      </header>

      <main className="create-property-container">
        {/* Intro */}
        <section className="create-property-intro">
          <div>
            <span className="create-property-label">PROPERTY LISTING</span>

            <h1>Add a new property</h1>

            <p>
              Provide accurate information about your accommodation so students
              can find it easily.
            </p>
          </div>
        </section>

        {error && <div className="create-property-error">{error}</div>}

        {success && <div className="create-property-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          {/* Basic Information */}
          <section className="create-property-card">
            <div className="create-property-section-title">
              <div className="section-title-icon">
                <Building2 size={19} />
              </div>

              <div>
                <h2>Basic Information</h2>
                <p>Tell students about your property.</p>
              </div>
            </div>

            <div className="property-form-grid">
              <div className="property-form-group property-full">
                <label>Property Title *</label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Sunrise PG for Students"
                  required
                />
              </div>

              <div className="property-form-group">
                <label>Property Type *</label>

                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                >
                  <option value="PG">PG</option>
                  <option value="Flat">Flat</option>
                  <option value="Hostel">Hostel</option>
                </select>
              </div>

              <div className="property-form-group">
                <label>Room Type</label>

                <select
                  name="roomType"
                  value={formData.roomType}
                  onChange={handleChange}
                >
                  <option value="Single">Single</option>
                  <option value="Double">Double</option>
                  <option value="Triple">Triple</option>
                  <option value="1BHK">1BHK</option>
                  <option value="2BHK">2BHK</option>
                  <option value="3BHK">3BHK</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="property-form-group property-full">
                <label>Description *</label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your property, facilities, nearby places, etc."
                  rows="5"
                  required
                />
              </div>
            </div>
          </section>

          {/* Location */}
          <section className="create-property-card">
            <div className="create-property-section-title">
              <div className="section-title-icon">
                <MapPin size={19} />
              </div>

              <div>
                <h2>Location</h2>
                <p>Help students understand where the property is.</p>
              </div>
            </div>

            <div className="property-form-grid">
              <div className="property-form-group property-full">
                <label>Address *</label>

                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="House / Building / Street"
                  required
                />
              </div>

              <div className="property-form-group">
                <label>Area *</label>

                <input
                  type="text"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  placeholder="e.g. Akurdi"
                  required
                />
              </div>

              <div className="property-form-group">
                <label>City *</label>

                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g. Pune"
                  required
                />
              </div>

              <div className="property-form-group">
                <label>Latitude</label>

                <input
                  type="number"
                  step="any"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  placeholder="Optional"
                />
              </div>

              <div className="property-form-group">
                <label>Longitude</label>

                <input
                  type="number"
                  step="any"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  placeholder="Optional"
                />
              </div>
            </div>
          </section>

          {/* Pricing */}
          <section className="create-property-card">
            <div className="create-property-section-title">
              <div className="section-title-icon">
                <IndianRupee size={19} />
              </div>

              <div>
                <h2>Pricing & Availability</h2>
                <p>Set the rent and available rooms.</p>
              </div>
            </div>

            <div className="property-form-grid">
              <div className="property-form-group">
                <label>Monthly Rent *</label>

                <div className="property-input-with-icon">
                  <IndianRupee size={17} />

                  <input
                    type="number"
                    name="rent"
                    value={formData.rent}
                    onChange={handleChange}
                    placeholder="6000"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="property-form-group">
                <label>Security Deposit</label>

                <div className="property-input-with-icon">
                  <IndianRupee size={17} />

                  <input
                    type="number"
                    name="securityDeposit"
                    value={formData.securityDeposit}
                    onChange={handleChange}
                    placeholder="10000"
                    min="0"
                  />
                </div>
              </div>

              <div className="property-form-group">
                <label>Total Rooms</label>

                <div className="property-input-with-icon">
                  <BedDouble size={17} />

                  <input
                    type="number"
                    name="totalRooms"
                    value={formData.totalRooms}
                    onChange={handleChange}
                    placeholder="10"
                    min="0"
                  />
                </div>
              </div>

              <div className="property-form-group">
                <label>Available Rooms</label>

                <div className="property-input-with-icon">
                  <BedDouble size={17} />

                  <input
                    type="number"
                    name="availableRooms"
                    value={formData.availableRooms}
                    onChange={handleChange}
                    placeholder="4"
                    min="0"
                  />
                </div>
              </div>

              <div className="property-form-group">
                <label>Gender Preference</label>

                <select
                  name="genderPreference"
                  value={formData.genderPreference}
                  onChange={handleChange}
                >
                  <option value="Any">Any</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div className="property-form-group property-availability">
                <label className="availability-checkbox">
                  <input
                    type="checkbox"
                    name="isAvailable"
                    checked={formData.isAvailable}
                    onChange={handleChange}
                  />

                  <span>Property is currently available</span>
                </label>
              </div>
            </div>
          </section>

          {/* Amenities */}
          <section className="create-property-card">
            <div className="create-property-section-title">
              <div className="section-title-icon">
                <Plus size={19} />
              </div>

              <div>
                <h2>Amenities</h2>
                <p>Add facilities available at your property.</p>
              </div>
            </div>

            <div className="property-add-row">
              <input
                type="text"
                value={amenityInput}
                onChange={(e) => setAmenityInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addAmenity();
                  }
                }}
                placeholder="e.g. WiFi, Parking, Washing Machine"
              />

              <button
                type="button"
                onClick={addAmenity}
                className="property-add-btn"
              >
                <Plus size={17} />
                Add
              </button>
            </div>

            <div className="property-tags">
              {formData.amenities.map((amenity) => (
                <span className="property-tag" key={amenity}>
                  {amenity}

                  <button type="button" onClick={() => removeAmenity(amenity)}>
                    <X size={13} />
                  </button>
                </span>
              ))}
            </div>
          </section>

          {/* Rules */}
          <section className="create-property-card">
            <div className="create-property-section-title">
              <div className="section-title-icon">
                <Users size={19} />
              </div>

              <div>
                <h2>Property Rules</h2>
                <p>Add important rules for residents.</p>
              </div>
            </div>

            <div className="property-add-row">
              <input
                type="text"
                value={ruleInput}
                onChange={(e) => setRuleInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addRule();
                  }
                }}
                placeholder="e.g. No smoking inside rooms"
              />

              <button
                type="button"
                onClick={addRule}
                className="property-add-btn"
              >
                <Plus size={17} />
                Add
              </button>
            </div>

            <div className="property-tags">
              {formData.rules.map((rule) => (
                <span className="property-tag rule-tag" key={rule}>
                  {rule}

                  <button type="button" onClick={() => removeRule(rule)}>
                    <X size={13} />
                  </button>
                </span>
              ))}
            </div>
          </section>

          {/* Images */}
          <section className="create-property-card">
            <div className="create-property-section-title">
              <div className="section-title-icon">
                <Image size={19} />
              </div>

              <div>
                <h2>Property Images</h2>
                <p>Add image URLs for your property.</p>
              </div>
            </div>

            <div className="property-add-row">
              <input
                type="url"
                value={imageInput}
                onChange={(e) => setImageInput(e.target.value)}
                placeholder="https://example.com/property-image.jpg"
              />

              <button
                type="button"
                onClick={addImage}
                className="property-add-btn"
              >
                <Plus size={17} />
                Add Image
              </button>
            </div>

            {formData.images.length > 0 && (
              <div className="property-image-list">
                {formData.images.map((image) => (
                  <div className="property-image-preview" key={image}>
                    <img src={image} alt="Property" />

                    <button type="button" onClick={() => removeImage(image)}>
                      <X size={15} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Actions */}
          <div className="create-property-actions">
            <Link to="/dashboard" className="cancel-property-btn">
              Cancel
            </Link>

            <button
              type="submit"
              className="save-property-btn"
              disabled={loading}
            >
              <Save size={18} />

              {loading ? "Creating Property..." : "Create Property"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default CreateProperty;
