import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Edit3,
  MapPin,
  GraduationCap,
  Wallet,
  BedDouble,
  Utensils,
  Cigarette,
  Wine,
  Moon,
  BookOpen,
  BriefcaseBusiness,
  Trash2,
  Search,
  User,
} from "lucide-react";

function MyRoommateProfile() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const fetchProfile = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/roommates/me",
        {
          withCredentials: true,
        },
      );

      setProfile(response.data.roommate);
    } catch (error) {
      console.error(error);

      if (error.response?.status === 404) {
        setError("You have not created a roommate profile yet.");
      } else {
        setError(
          error.response?.data?.message || "Failed to load roommate profile",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your roommate profile?",
    );

    if (!confirmed) return;

    try {
      setDeleting(true);

      await axios.delete("http://localhost:5000/api/roommates/me", {
        withCredentials: true,
      });

      navigate("/roommates/create");
    } catch (error) {
      alert(
        error.response?.data?.message || "Failed to delete roommate profile",
      );
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="roommate-profile-page">
        <div className="roommate-profile-loading">
          Loading your roommate profile...
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="roommate-profile-page">
        <div className="roommate-profile-empty">
          <div className="roommate-empty-icon">
            <User size={30} />
          </div>

          <h2>No roommate profile yet</h2>

          <p>
            Create your roommate profile so other students can discover and
            connect with you.
          </p>

          <Link
            to="/roommates/create"
            className="roommate-create-profile-button"
          >
            Create Roommate Profile
          </Link>
        </div>
      </div>
    );
  }

  const profilePhoto = profile.profilePhoto;

  const initials =
    profile.name
      ?.split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  return (
    <div className="roommate-profile-page">
      {/* Top bar */}
      <header className="roommate-profile-topbar">
        <Link to="/roommates" className="roommate-profile-back">
          <ArrowLeft size={19} />
          Roommate Finder
        </Link>

        <h1>My Roommate Profile</h1>

        <button
          className="roommate-profile-edit-button"
          onClick={() => navigate("/roommates/edit")}
        >
          <Edit3 size={16} />
          Edit Profile
        </button>
      </header>

      <main className="roommate-profile-main">
        {/* Profile Hero */}
        <section className="roommate-profile-hero">
          <div className="roommate-profile-avatar">
            {profilePhoto ? (
              <img src={profilePhoto} alt={profile.name} />
            ) : (
              initials
            )}
          </div>

          <div className="roommate-profile-hero-content">
            <div className="roommate-profile-name-row">
              <h2>{profile.name}</h2>

              <span className="roommate-profile-status">Profile Active</span>
            </div>

            <p className="roommate-profile-basic">
              {profile.age} years old ·{" "}
              {profile.gender?.charAt(0).toUpperCase() +
                profile.gender?.slice(1)}
            </p>

            <div className="roommate-profile-location">
              <MapPin size={15} />
              {profile.preferredArea}, {profile.city}
            </div>
          </div>
        </section>

        {/* Main grid */}
        <section className="roommate-profile-grid">
          {/* About */}
          <div className="roommate-profile-card roommate-about-card">
            <div className="roommate-profile-card-heading">
              <div>
                <h3>About Me</h3>
                <p>A little about you</p>
              </div>

              <User size={19} />
            </div>

            <p className="roommate-about-text">
              {profile.about || "No description added yet."}
            </p>
          </div>

          {/* Academic / work */}
          <div className="roommate-profile-card">
            <div className="roommate-profile-card-heading">
              <div>
                <h3>Education & Work</h3>
                <p>Your academic and professional details</p>
              </div>

              <GraduationCap size={19} />
            </div>

            <div className="roommate-detail-list">
              <div className="roommate-detail-row">
                <div className="roommate-detail-icon">
                  <GraduationCap size={17} />
                </div>

                <div>
                  <span>College</span>
                  <strong>{profile.college || "Not provided"}</strong>
                </div>
              </div>

              <div className="roommate-detail-row">
                <div className="roommate-detail-icon">
                  <BriefcaseBusiness size={17} />
                </div>

                <div>
                  <span>Occupation</span>
                  <strong>{profile.occupation || "Student"}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Budget */}
          <div className="roommate-profile-card">
            <div className="roommate-profile-card-heading">
              <div>
                <h3>Budget & Room</h3>
                <p>What you're looking for</p>
              </div>

              <Wallet size={19} />
            </div>

            <div className="roommate-detail-list">
              <div className="roommate-detail-row">
                <div className="roommate-detail-icon">
                  <Wallet size={17} />
                </div>

                <div>
                  <span>Monthly Budget</span>
                  <strong>
                    ₹{profile.budgetMin?.toLocaleString()} - ₹
                    {profile.budgetMax?.toLocaleString()}
                  </strong>
                </div>
              </div>

              <div className="roommate-detail-row">
                <div className="roommate-detail-icon">
                  <BedDouble size={17} />
                </div>

                <div>
                  <span>Room Preference</span>
                  <strong>{profile.roomPreference || "Any"}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Food */}
          <div className="roommate-profile-card">
            <div className="roommate-profile-card-heading">
              <div>
                <h3>Lifestyle Preferences</h3>
                <p>Preferences that help find a match</p>
              </div>

              <Utensils size={19} />
            </div>

            <div className="roommate-preference-grid">
              <div className="roommate-preference">
                <Utensils size={16} />
                <span>Food</span>
                <strong>{profile.foodPreference}</strong>
              </div>

              <div className="roommate-preference">
                <Cigarette size={16} />
                <span>Smoking</span>
                <strong>{profile.smokingPreference}</strong>
              </div>

              <div className="roommate-preference">
                <Wine size={16} />
                <span>Drinking</span>
                <strong>{profile.drinkingPreference}</strong>
              </div>

              <div className="roommate-preference">
                <Moon size={16} />
                <span>Sleep</span>
                <strong>{profile.sleepSchedule}</strong>
              </div>

              <div className="roommate-preference">
                <BookOpen size={16} />
                <span>Study</span>
                <strong>{profile.studySchedule}</strong>
              </div>
            </div>
          </div>
        </section>

        {/* Actions */}
        <section className="roommate-profile-actions">
          <button
            className="roommate-action-primary"
            onClick={() => navigate("/roommates")}
          >
            <Search size={17} />
            Find Compatible Roommates
          </button>

          <button
            className="roommate-action-edit"
            onClick={() => navigate("/roommates/edit")}
          >
            <Edit3 size={17} />
            Edit Profile
          </button>

          <button
            className="roommate-action-delete"
            onClick={handleDelete}
            disabled={deleting}
          >
            <Trash2 size={17} />
            {deleting ? "Deleting..." : "Delete Profile"}
          </button>
        </section>
      </main>
    </div>
  );
}

export default MyRoommateProfile;
