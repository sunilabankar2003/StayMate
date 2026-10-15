import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  ArrowLeft,
  Save,
  User,
  GraduationCap,
  MapPin,
  Wallet,
  BedDouble,
  Utensils,
  Cigarette,
  Wine,
  Moon,
  BookOpen,
  BriefcaseBusiness,
} from 'lucide-react';

function EditRoommate() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'male',
    college: '',
    city: '',
    preferredArea: '',
    budgetMin: '',
    budgetMax: '',
    roomPreference: 'Shared',
    foodPreference: 'Any',
    smokingPreference: 'No',
    drinkingPreference: 'No',
    sleepSchedule: 'Flexible',
    studySchedule: 'Flexible',
    occupation: 'Student',
    about: '',
    profilePhoto: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          'http://localhost:5000/api/roommates/me',
          {
            withCredentials: true,
          }
        );

        const profile = response.data.roommate;

        setFormData({
          name: profile.name || '',
          age: profile.age || '',
          gender: profile.gender || 'male',
          college: profile.college || '',
          city: profile.city || '',
          preferredArea: profile.preferredArea || '',
          budgetMin: profile.budgetMin || '',
          budgetMax: profile.budgetMax || '',
          roomPreference: profile.roomPreference || 'Shared',
          foodPreference: profile.foodPreference || 'Any',
          smokingPreference: profile.smokingPreference || 'No',
          drinkingPreference: profile.drinkingPreference || 'No',
          sleepSchedule: profile.sleepSchedule || 'Flexible',
          studySchedule: profile.studySchedule || 'Flexible',
          occupation: profile.occupation || 'Student',
          about: profile.about || '',
          profilePhoto: profile.profilePhoto || '',
        });
      } catch (error) {
        console.error(error);

        setError(
          error.response?.data?.message ||
            'Failed to load roommate profile'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');

    if (
      Number(formData.budgetMin) >
      Number(formData.budgetMax)
    ) {
      setError(
        'Minimum budget cannot be greater than maximum budget.'
      );
      return;
    }

    try {
      setSaving(true);

      await axios.put(
        'http://localhost:5000/api/roommates/me',
        {
          ...formData,
          age: Number(formData.age),
          budgetMin: Number(formData.budgetMin),
          budgetMax: Number(formData.budgetMax),
        },
        {
          withCredentials: true,
        }
      );

      navigate('/roommates/my-profile');
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          'Failed to update roommate profile'
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="roommate-edit-page">
        <div className="roommate-edit-loading">
          Loading profile...
        </div>
      </div>
    );
  }

  return (
    <div className="roommate-edit-page">

      {/* Header */}
      <header className="roommate-edit-header">

        <Link
          to="/roommates/my-profile"
          className="roommate-edit-back"
        >
          <ArrowLeft size={19} />
          My Roommate Profile
        </Link>

        <h1>Edit Roommate Profile</h1>

        <div></div>

      </header>

      <main className="roommate-edit-main">

        <div className="roommate-edit-intro">
          <div>
            <p>ROOMMATE PROFILE</p>
            <h2>Update your preferences</h2>
            <span>
              Keep your information updated so we can find
              better roommate matches for you.
            </span>
          </div>
        </div>

        {error && (
          <div className="roommate-edit-error">
            {error}
          </div>
        )}

        <form
          className="roommate-edit-form"
          onSubmit={handleSubmit}
        >

          {/* Personal Information */}
          <section className="roommate-edit-card">

            <div className="roommate-edit-card-heading">
              <div className="roommate-edit-heading-icon">
                <User size={18} />
              </div>

              <div>
                <h3>Personal Information</h3>
                <p>Tell others a little about yourself.</p>
              </div>
            </div>

            <div className="roommate-form-grid">

              <div className="roommate-form-field">
                <label>Full Name</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  required
                />
              </div>

              <div className="roommate-form-field">
                <label>Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  min="16"
                  max="100"
                  placeholder="Age"
                  required
                />
              </div>

              <div className="roommate-form-field">
                <label>Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="roommate-form-field">
                <label>Occupation</label>
                <div className="input-with-icon">
                  <BriefcaseBusiness size={16} />
                  <input
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleChange}
                    placeholder="Student"
                  />
                </div>
              </div>

            </div>
          </section>

          {/* Education & Location */}
          <section className="roommate-edit-card">

            <div className="roommate-edit-card-heading">
              <div className="roommate-edit-heading-icon">
                <MapPin size={18} />
              </div>

              <div>
                <h3>Education & Location</h3>
                <p>Where you study and where you want to stay.</p>
              </div>
            </div>

            <div className="roommate-form-grid">

              <div className="roommate-form-field roommate-form-full">
                <label>College / Institution</label>
                <div className="input-with-icon">
                  <GraduationCap size={16} />
                  <input
                    name="college"
                    value={formData.college}
                    onChange={handleChange}
                    placeholder="Your college"
                    required
                  />
                </div>
              </div>

              <div className="roommate-form-field">
                <label>City</label>
                <input
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Pune"
                  required
                />
              </div>

              <div className="roommate-form-field">
                <label>Preferred Area</label>
                <input
                  name="preferredArea"
                  value={formData.preferredArea}
                  onChange={handleChange}
                  placeholder="Akurdi"
                  required
                />
              </div>

            </div>
          </section>

          {/* Budget & Room */}
          <section className="roommate-edit-card">

            <div className="roommate-edit-card-heading">
              <div className="roommate-edit-heading-icon">
                <Wallet size={18} />
              </div>

              <div>
                <h3>Budget & Room</h3>
                <p>Set your ideal accommodation requirements.</p>
              </div>
            </div>

            <div className="roommate-form-grid">

              <div className="roommate-form-field">
                <label>Minimum Budget</label>

                <div className="input-with-icon">
                  <Wallet size={16} />

                  <input
                    type="number"
                    name="budgetMin"
                    value={formData.budgetMin}
                    onChange={handleChange}
                    placeholder="3000"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="roommate-form-field">
                <label>Maximum Budget</label>

                <div className="input-with-icon">
                  <Wallet size={16} />

                  <input
                    type="number"
                    name="budgetMax"
                    value={formData.budgetMax}
                    onChange={handleChange}
                    placeholder="5000"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="roommate-form-field roommate-form-full">
                <label>Room Preference</label>

                <div className="select-with-icon">
                  <BedDouble size={16} />

                  <select
                    name="roomPreference"
                    value={formData.roomPreference}
                    onChange={handleChange}
                  >
                    <option value="Single">Single</option>
                    <option value="Shared">Shared</option>
                    <option value="Any">Any</option>
                  </select>
                </div>
              </div>

            </div>
          </section>

          {/* Lifestyle */}
          <section className="roommate-edit-card">

            <div className="roommate-edit-card-heading">
              <div className="roommate-edit-heading-icon">
                <Moon size={18} />
              </div>

              <div>
                <h3>Lifestyle Preferences</h3>
                <p>
                  These preferences help calculate compatibility.
                </p>
              </div>
            </div>

            <div className="roommate-form-grid">

              <div className="roommate-form-field">
                <label>Food Preference</label>

                <div className="select-with-icon">
                  <Utensils size={16} />

                  <select
                    name="foodPreference"
                    value={formData.foodPreference}
                    onChange={handleChange}
                  >
                    <option value="Veg">Veg</option>
                    <option value="Non-Veg">Non-Veg</option>
                    <option value="Any">Any</option>
                  </select>
                </div>
              </div>

              <div className="roommate-form-field">
                <label>Smoking</label>

                <div className="select-with-icon">
                  <Cigarette size={16} />

                  <select
                    name="smokingPreference"
                    value={formData.smokingPreference}
                    onChange={handleChange}
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                    <option value="Occasionally">
                      Occasionally
                    </option>
                  </select>
                </div>
              </div>

              <div className="roommate-form-field">
                <label>Drinking</label>

                <div className="select-with-icon">
                  <Wine size={16} />

                  <select
                    name="drinkingPreference"
                    value={formData.drinkingPreference}
                    onChange={handleChange}
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                    <option value="Occasionally">
                      Occasionally
                    </option>
                  </select>
                </div>
              </div>

              <div className="roommate-form-field">
                <label>Sleep Schedule</label>

                <div className="select-with-icon">
                  <Moon size={16} />

                  <select
                    name="sleepSchedule"
                    value={formData.sleepSchedule}
                    onChange={handleChange}
                  >
                    <option value="Early Bird">
                      Early Bird
                    </option>
                    <option value="Night Owl">
                      Night Owl
                    </option>
                    <option value="Flexible">
                      Flexible
                    </option>
                  </select>
                </div>
              </div>

              <div className="roommate-form-field">
                <label>Study Schedule</label>

                <div className="select-with-icon">
                  <BookOpen size={16} />

                  <select
                    name="studySchedule"
                    value={formData.studySchedule}
                    onChange={handleChange}
                  >
                    <option value="Morning">Morning</option>
                    <option value="Late Night">
                      Late Night
                    </option>
                    <option value="Flexible">
                      Flexible
                    </option>
                  </select>
                </div>
              </div>

            </div>
          </section>

          {/* About */}
          <section className="roommate-edit-card">

            <div className="roommate-edit-card-heading">
              <div className="roommate-edit-heading-icon">
                <BookOpen size={18} />
              </div>

              <div>
                <h3>About You</h3>
                <p>Help potential roommates know you better.</p>
              </div>
            </div>

            <div className="roommate-form-field">
              <textarea
                name="about"
                value={formData.about}
                onChange={handleChange}
                placeholder="Tell potential roommates about yourself..."
                rows="5"
                maxLength="500"
              />

              <small>
                {formData.about.length}/500
              </small>
            </div>
          </section>

          {/* Actions */}
          <div className="roommate-edit-actions">

            <button
              type="button"
              className="roommate-edit-cancel"
              onClick={() =>
                navigate('/roommates/my-profile')
              }
            >
              Cancel
            </button>

            <button
              type="submit"
              className="roommate-edit-save"
              disabled={saving}
            >
              <Save size={17} />

              {saving
                ? 'Saving changes...'
                : 'Save Changes'}
            </button>

          </div>

        </form>
      </main>
    </div>
  );
}

export default EditRoommate;