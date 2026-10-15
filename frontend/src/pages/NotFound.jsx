import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';

const NotFound = () => {
  return (
    <div style={{ padding: '6rem 1rem', textAlign: 'center' }}>
      <div className="container" style={{ maxWidth: '500px' }}>
        <AlertTriangle size={64} color="var(--primary)" style={{ margin: '0 auto 1.5rem' }} />
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.75rem' }}>404</h1>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1rem' }}>Page Not Found</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
          The page you are looking for does not exist or has been moved.
        </p>
        <Link to="/" className="btn btn-primary">
          <Home size={18} />
          <span>Return Home</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
