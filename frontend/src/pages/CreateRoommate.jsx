import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreateRoommate() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    college: "",
    city: "",
    preferredArea: "",
    budgetMin: "",
    budgetMax: "",
    roomPreference: "Shared",
    foodPreference: "Any",
    smokingPreference: "No",
    drinkingPreference: "No",
    sleepSchedule: "Flexible",
    studySchedule: "Flexible",
    occupation: "Student",
    about: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage("");

      await axios.post("http://localhost:5000/api/roommates/me", form, {
        withCredentials: true,
      });

      setMessage("Roommate profile created successfully!");

      setTimeout(() => {
        navigate("/roommates");
      }, 1000);
    } catch (error) {
      console.error("Create roommate error:", error);

      setMessage(
        error.response?.data?.message || "Failed to create roommate profile.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="roommate-form-page">
      <div className="roommate-form-container">
        <h1>Create Roommate Profile</h1>

        <p>
          Tell other students about yourself and what kind of roommate you are
          looking for.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Age</label>
              <input
                type="number"
                name="age"
                value={form.age}
                onChange={handleChange}
                min="16"
                max="100"
                required
              />
            </div>

            <div className="form-group">
              <label>Gender</label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                required
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>College</label>
              <input
                name="college"
                value={form.college}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>City</label>
              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Preferred Area</label>
              <input
                name="preferredArea"
                value={form.preferredArea}
                onChange={handleChange}
                placeholder="e.g. Akurdi"
                required
              />
            </div>

            <div className="form-group">
              <label>Minimum Budget</label>
              <input
                type="number"
                name="budgetMin"
                value={form.budgetMin}
                onChange={handleChange}
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label>Maximum Budget</label>
              <input
                type="number"
                name="budgetMax"
                value={form.budgetMax}
                onChange={handleChange}
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label>Room Preference</label>
              <select
                name="roomPreference"
                value={form.roomPreference}
                onChange={handleChange}
              >
                <option value="Single">Single</option>
                <option value="Shared">Shared</option>
                <option value="Any">Any</option>
              </select>
            </div>

            <div className="form-group">
              <label>Food Preference</label>
              <select
                name="foodPreference"
                value={form.foodPreference}
                onChange={handleChange}
              >
                <option value="Veg">Veg</option>
                <option value="Non-Veg">Non-Veg</option>
                <option value="Any">Any</option>
              </select>
            </div>

            <div className="form-group">
              <label>Smoking</label>
              <select
                name="smokingPreference"
                value={form.smokingPreference}
                onChange={handleChange}
              >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
                <option value="Occasionally">Occasionally</option>
              </select>
            </div>

            <div className="form-group">
              <label>Drinking</label>
              <select
                name="drinkingPreference"
                value={form.drinkingPreference}
                onChange={handleChange}
              >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
                <option value="Occasionally">Occasionally</option>
              </select>
            </div>

            <div className="form-group">
              <label>Sleep Schedule</label>
              <select
                name="sleepSchedule"
                value={form.sleepSchedule}
                onChange={handleChange}
              >
                <option value="Early Bird">Early Bird</option>
                <option value="Night Owl">Night Owl</option>
                <option value="Flexible">Flexible</option>
              </select>
            </div>

            <div className="form-group">
              <label>Study Schedule</label>
              <select
                name="studySchedule"
                value={form.studySchedule}
                onChange={handleChange}
              >
                <option value="Morning">Morning</option>
                <option value="Late Night">Late Night</option>
                <option value="Flexible">Flexible</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>About You</label>
            <textarea
              name="about"
              value={form.about}
              onChange={handleChange}
              rows="4"
              placeholder="Tell potential roommates about yourself..."
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Profile"}
          </button>

          {message && <p>{message}</p>}
        </form>
      </div>
    </div>
  );
}

export default CreateRoommate;
