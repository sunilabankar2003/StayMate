import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { User, Save, Lock, ShieldCheck, Sparkles } from 'lucide-react';

const Profile = () => {
  const { user, updateUser } = useAuth();

  // Profile Form State
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [occupation, setOccupation] = useState(user?.occupation || '');
  const [collegeOrCompany, setCollegeOrCompany] = useState(user?.collegeOrCompany || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [gender, setGender] = useState(user?.gender || '');
  const [budgetMin, setBudgetMin] = useState(user?.budgetMin || 3000);
  const [budgetMax, setBudgetMax] = useState(user?.budgetMax || 15000);
  const [preferredCity, setPreferredCity] = useState(user?.preferredCity || '');
  const [preferredLocality, setPreferredLocality] = useState(user?.preferredLocality || '');
  const [preferredAccommodationType, setPreferredAccommodationType] = useState(user?.preferredAccommodationType || 'Any');

  // Roommate Preferences
  const [cleanliness, setCleanliness] = useState(user?.roommatePreferences?.cleanliness || 'moderate');
  const [foodHabit, setFoodHabit] = useState(user?.roommatePreferences?.foodHabit || 'any');
  const [smoking, setSmoking] = useState(user?.roommatePreferences?.smoking || 'non_smoker');
  const [sleepSchedule, setSleepSchedule] = useState(user?.roommatePreferences?.sleepSchedule || 'flexible');
  const [studyWorkRoutine, setStudyWorkRoutine] = useState(user?.roommatePreferences?.studyWorkRoutine || 'moderate');
  const [preferredGender, setPreferredGender] = useState(user?.roommatePreferences?.preferredGender || 'any');

  // Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState({ text: '', type: '' });

  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState({ text: '', type: '' });

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      setOccupation(user.occupation || '');
      setCollegeOrCompany(user.collegeOrCompany || '');
      setBio(user.bio || '');
      setGender(user.gender || '');
      setBudgetMin(user.budgetMin || 3000);
      setBudgetMax(user.budgetMax || 15000);
      setPreferredCity(user.preferredCity || '');
      setPreferredLocality(user.preferredLocality || '');
      setPreferredAccommodationType(user.preferredAccommodationType || 'Any');

      if (user.roommatePreferences) {
        setCleanliness(user.roommatePreferences.cleanliness || 'moderate');
        setFoodHabit(user.roommatePreferences.foodHabit || 'any');
        setSmoking(user.roommatePreferences.smoking || 'non_smoker');
        setSleepSchedule(user.roommatePreferences.sleepSchedule || 'flexible');
        setStudyWorkRoutine(user.roommatePreferences.studyWorkRoutine || 'moderate');
        setPreferredGender(user.roommatePreferences.preferredGender || 'any');
      }
    }
  }, [user]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      setSavingProfile(true);
      setProfileMsg({ text: '', type: '' });

      const payload = {
        name,
        phone,
        occupation,
        collegeOrCompany,
        bio,
        gender,
        budgetMin: Number(budgetMin),
        budgetMax: Number(budgetMax),
        preferredCity,
        preferredLocality,
        preferredAccommodationType,
      };

      if (user.role === 'student') {
        payload.roommatePreferences = {
          cleanliness,
          foodHabit,
          smoking,
          sleepSchedule,
          studyWorkRoutine,
          preferredGender,
        };
      }

      const res = await authService.updateProfile(payload);
      if (res.success && res.data) {
        updateUser(res.data);
        setProfileMsg({ text: 'Profile updated successfully!', type: 'success' });
      }
    } catch (err) {
      setProfileMsg({ text: err.message || 'Failed to update profile', type: 'danger' });
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      setPasswordMsg({ text: 'Please fill in current and new password', type: 'danger' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMsg({ text: 'New passwords do not match', type: 'danger' });
      return;
    }

    try {
      setPasswordMsg({ text: '', type: '' });
      const res = await authService.updatePassword({ currentPassword, newPassword });
      if (res.success) {
        setPasswordMsg({ text: 'Password changed successfully!', type: 'success' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      setPasswordMsg({ text: err.message || 'Failed to change password', type: 'danger' });
    }
  };

  return (
    <div style={{ padding: '2.5rem 0 5rem' }}>
      <div className="container" style={{ maxWidth: '850px' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Profile & Preferences</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Manage your personal information, accommodation criteria, and roommate matching preferences.
          </p>
        </div>

        {/* Profile Info Form */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={20} color="var(--primary)" /> Basic Information
          </h2>

          {profileMsg.text && (
            <div className={`alert alert-${profileMsg.type}`}>{profileMsg.text}</div>
          )}

          <form onSubmit={handleProfileSubmit}>
            <div className="grid-2" style={{ gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address (Read-only)</label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="form-control"
                  style={{ backgroundColor: 'var(--bg-subtle)' }}
                />
              </div>
            </div>

            <div className="grid-2" style={{ gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="form-select"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid-2" style={{ gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Occupation / Role</label>
                <input
                  type="text"
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label className="form-label">College or Company Name</label>
                <input
                  type="text"
                  value={collegeOrCompany}
                  onChange={(e) => setCollegeOrCompany(e.target.value)}
                  className="form-control"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Bio / About Yourself</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="form-textarea"
                rows={3}
                placeholder="A brief intro about yourself..."
              ></textarea>
            </div>

            {/* Roommate Matching Preferences Section (Students only) */}
            {user?.role === 'student' && (
              <div style={{ marginTop: '2rem', paddingTop: '1.75rem', borderTop: '1px solid var(--border-color)' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--secondary)' }}>
                  <Sparkles size={18} /> Roommate Matching Preferences
                </h3>

                <div className="grid-2" style={{ gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Preferred City</label>
                    <input
                      type="text"
                      placeholder="e.g. Bangalore"
                      value={preferredCity}
                      onChange={(e) => setPreferredCity(e.target.value)}
                      className="form-control"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Preferred Locality / Area</label>
                    <input
                      type="text"
                      placeholder="e.g. Koramangala"
                      value={preferredLocality}
                      onChange={(e) => setPreferredLocality(e.target.value)}
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="grid-2" style={{ gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Monthly Budget Min (₹)</label>
                    <input
                      type="number"
                      value={budgetMin}
                      onChange={(e) => setBudgetMin(e.target.value)}
                      className="form-control"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Monthly Budget Max (₹)</label>
                    <input
                      type="number"
                      value={budgetMax}
                      onChange={(e) => setBudgetMax(e.target.value)}
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="grid-3" style={{ gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Cleanliness Routine</label>
                    <select
                      value={cleanliness}
                      onChange={(e) => setCleanliness(e.target.value)}
                      className="form-select"
                    >
                      <option value="very_clean">Very Clean / Meticulous</option>
                      <option value="moderate">Moderate</option>
                      <option value="relaxed">Relaxed</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Food Habit</label>
                    <select
                      value={foodHabit}
                      onChange={(e) => setFoodHabit(e.target.value)}
                      className="form-select"
                    >
                      <option value="any">Any Diet</option>
                      <option value="vegetarian">Pure Vegetarian</option>
                      <option value="non_vegetarian">Non-Vegetarian</option>
                      <option value="eggetarian">Eggetarian</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Smoking Habit</label>
                    <select
                      value={smoking}
                      onChange={(e) => setSmoking(e.target.value)}
                      className="form-select"
                    >
                      <option value="non_smoker">Non-Smoker</option>
                      <option value="occasional">Occasional</option>
                      <option value="smoker">Smoker</option>
                    </select>
                  </div>
                </div>

                <div className="grid-3" style={{ gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Sleep Schedule</label>
                    <select
                      value={sleepSchedule}
                      onChange={(e) => setSleepSchedule(e.target.value)}
                      className="form-select"
                    >
                      <option value="early_bird">Early Bird (Morning Person)</option>
                      <option value="night_owl">Night Owl (Late Sleeper)</option>
                      <option value="flexible">Flexible</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Study/Work Routine</label>
                    <select
                      value={studyWorkRoutine}
                      onChange={(e) => setStudyWorkRoutine(e.target.value)}
                      className="form-select"
                    >
                      <option value="quiet_studious">Quiet / Focused</option>
                      <option value="moderate">Moderate</option>
                      <option value="social">Social / Interactive</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Preferred Roommate Gender</label>
                    <select
                      value={preferredGender}
                      onChange={(e) => setPreferredGender(e.target.value)}
                      className="form-select"
                    >
                      <option value="any">Any Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={savingProfile}
              className="btn btn-primary"
              style={{ marginTop: '1rem' }}
            >
              <Save size={16} />
              <span>{savingProfile ? 'Saving...' : 'Save Profile Changes'}</span>
            </button>
          </form>
        </div>

        {/* Change Password Card */}
        <div className="card" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Lock size={20} color="var(--primary)" /> Change Security Password
          </h2>

          {passwordMsg.text && (
            <div className={`alert alert-${passwordMsg.type}`}>{passwordMsg.text}</div>
          )}

          <form onSubmit={handlePasswordSubmit}>
            <div className="form-group">
              <label className="form-label">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="form-control"
                required
              />
            </div>

            <div className="grid-2" style={{ gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">New Password</label>
                <input
                  type="password"
                  placeholder="Min 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="form-control"
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-outline" style={{ marginTop: '0.5rem' }}>
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
