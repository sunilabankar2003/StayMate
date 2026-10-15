import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, Users, Building, ShieldCheck } from 'lucide-react';

const Register = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') === 'owner' ? 'owner' : 'student';

  const [role, setRole] = useState(initialRole);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [occupation, setOccupation] = useState('');
  const [gender, setGender] = useState('male');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      setError('Please provide all required fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const res = await register({
        name,
        email,
        password,
        role,
        phone,
        occupation: occupation || (role === 'student' ? 'Student' : 'Property Host'),
        gender,
      });

      if (res.success) {
        if (role === 'owner') {
          navigate('/owner/dashboard');
        } else {
          navigate('/student/dashboard');
        }
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '3.5rem 1rem', display: 'flex', justifyContent: 'center' }}>
      <div className="card" style={{ maxWidth: '520px', width: '100%', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Create Your Account</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Join StayMate to explore accommodations or manage properties
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.75rem',
            marginBottom: '1.75rem',
          }}
        >
          <button
            type="button"
            onClick={() => setRole('student')}
            style={{
              padding: '0.85rem',
              borderRadius: 'var(--radius-md)',
              border: role === 'student' ? '2px solid var(--primary)' : '1px solid var(--border-color)',
              backgroundColor: role === 'student' ? 'var(--primary-light)' : 'var(--bg-surface)',
              color: role === 'student' ? 'var(--primary)' : 'var(--text-muted)',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              transition: 'var(--transition)',
            }}
          >
            <Users size={18} />
            <span>Student / Seeker</span>
          </button>

          <button
            type="button"
            onClick={() => setRole('owner')}
            style={{
              padding: '0.85rem',
              borderRadius: 'var(--radius-md)',
              border: role === 'owner' ? '2px solid var(--primary)' : '1px solid var(--border-color)',
              backgroundColor: role === 'owner' ? 'var(--primary-light)' : 'var(--bg-surface)',
              color: role === 'owner' ? 'var(--primary)' : 'var(--text-muted)',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              transition: 'var(--transition)',
            }}
          >
            <Building size={18} />
            <span>Property Owner</span>
          </button>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              placeholder="e.g. Aarav Patel"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              required
            />
          </div>

          <div className="grid-2" style={{ gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Password *</label>
              <input
                type="password"
                placeholder="Min 6 chars"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password *</label>
              <input
                type="password"
                placeholder="Re-enter"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="form-control"
                required
              />
            </div>
          </div>

          <div className="grid-2" style={{ gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                placeholder="+91 98765 43210"
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
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              {role === 'student' ? 'Occupation / College' : 'Business / Organization Name'}
            </label>
            <input
              type="text"
              placeholder={role === 'student' ? 'e.g. MCA Student at PES University' : 'e.g. Sharma PG Accommodations'}
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
              className="form-control"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.75rem', padding: '0.75rem' }}
          >
            {loading ? 'Creating Account...' : `Register as ${role === 'student' ? 'Student' : 'Property Owner'}`}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ fontWeight: 600 }}>
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
