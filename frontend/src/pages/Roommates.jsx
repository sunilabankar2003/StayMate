import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  MapPin,
  IndianRupee,
  GraduationCap,
  Users,
} from "lucide-react";

function Roommates() {
  const [roommates, setRoommates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    city: "",
    preferredArea: "",
    gender: "",
    minBudget: "",
    maxBudget: "",
  });

  const fetchRoommates = async () => {
    try {
      setLoading(true);
      setError("");

      const params = Object.fromEntries(
        Object.entries(filters).filter(([, value]) => value !== ""),
      );

      const response = await axios.get("http://localhost:5000/api/roommates", {
        params,
        withCredentials: true,
      });

      setRoommates(response.data.roommates || []);
    } catch (error) {
      console.error("Fetch roommates error:", error);
      setError(error.response?.data?.message || "Failed to load roommates.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoommates();
  }, []);

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchRoommates();
  };

  return (
    <div className="roommates-page">
      <div className="roommates-hero">
        <div>
          <span className="section-label">ROOMMATE FINDER</span>

          <h1>Find a roommate who fits your lifestyle.</h1>

          <p>
            Find students and working professionals looking for roommates in
            your preferred area and budget.
          </p>
        </div>
      </div>

      <div className="roommates-container">
        <div className="roommate-actions">
          <Link
            to="/roommates/my-profile"
            className="roommate-my-profile-button"
          >
            My Profile
          </Link>
          <button type="button" onClick={() => navigate("/roommates/edit")}>
            Edit My Roommate Profile
          </button>

          {/* <button type="button" onClick={() => navigate("/roommates/create")}>
            Create New Profile
          </button> */}
        </div>
        <form className="roommate-search" onSubmit={handleSearch}>
          <div className="roommate-input">
            <MapPin size={18} />
            <input
              type="text"
              name="city"
              placeholder="City"
              value={filters.city}
              onChange={handleChange}
            />
          </div>

          <div className="roommate-input">
            <Search size={18} />
            <input
              type="text"
              name="preferredArea"
              placeholder="Preferred area"
              value={filters.preferredArea}
              onChange={handleChange}
            />
          </div>

          <div className="roommate-input">
            <IndianRupee size={18} />
            <input
              type="number"
              name="minBudget"
              placeholder="Min budget"
              value={filters.minBudget}
              onChange={handleChange}
            />
          </div>

          <div className="roommate-input">
            <IndianRupee size={18} />
            <input
              type="number"
              name="maxBudget"
              placeholder="Max budget"
              value={filters.maxBudget}
              onChange={handleChange}
            />
          </div>

          <select name="gender" value={filters.gender} onChange={handleChange}>
            <option value="">Any gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>

          <button type="submit">
            <Search size={18} />
            Search
          </button>
        </form>

        {loading && (
          <div className="roommates-message">Loading roommates...</div>
        )}

        {error && <div className="roommates-message error">{error}</div>}

        {!loading && !error && roommates.length === 0 && (
          <div className="roommates-message">No roommate profiles found.</div>
        )}

        {!loading && roommates.length > 0 && (
          <div className="roommates-grid">
            {roommates.map((roommate) => (
              <div className="roommate-card" key={roommate._id}>
                <div className="roommate-card-top">
                  <div className="roommate-avatar">
                    {roommate.name?.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <h3>{roommate.name}</h3>

                    <span>{roommate.age} years old</span>
                  </div>
                </div>

                <div className="roommate-info">
                  <p>
                    <GraduationCap size={17} />
                    {roommate.college}
                  </p>

                  <p>
                    <MapPin size={17} />
                    {roommate.city} · {roommate.preferredArea}
                  </p>

                  <p>
                    <IndianRupee size={17} />₹{roommate.budgetMin} - ₹
                    {roommate.budgetMax}/month
                  </p>

                  <p>
                    <Users size={17} />
                    {roommate.roomPreference}
                  </p>
                </div>

                {roommate.compatibilityScore !== null &&
                  roommate.compatibilityScore !== undefined && (
                    <div className="compatibility-score">
                      <strong>{roommate.compatibilityScore}%</strong>
                      <span>Compatibility</span>
                    </div>
                  )}

                {roommate.about && (
                  <p className="roommate-about">{roommate.about}</p>
                )}

                <Link
                  to={`/roommates/${roommate._id}`}
                  className="roommate-view-button"
                >
                  View Profile
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Roommates;
