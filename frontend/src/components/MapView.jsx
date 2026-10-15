import React from 'react';
import { MapPin, ExternalLink, Navigation } from 'lucide-react';

const MapView = ({
  lat = 12.9716,
  lng = 77.5946,
  title = 'Property Location',
  address = '',
  height = '350px',
}) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

  const bboxDelta = 0.008;
  const bbox = `${lng - bboxDelta},${lat - bboxDelta},${lng + bboxDelta},${lat + bboxDelta}`;
  const osmEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`;

  return (
    <div
      style={{
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        border: '1px solid var(--border-color)',
        backgroundColor: 'var(--bg-surface)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      {/* Map Header with Directions */}
      <div
        style={{
          padding: '0.85rem 1.25rem',
          backgroundColor: 'var(--bg-subtle)',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <MapPin size={18} color="var(--primary)" />
          <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>
            {address || title}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary btn-sm"
            style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
          >
            <Navigation size={13} />
            <span>Get Directions</span>
          </a>

          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline btn-sm"
            style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
          >
            <ExternalLink size={13} />
            <span>Open in Google Maps</span>
          </a>
        </div>
      </div>

      {/* Map Display Area */}
      <div style={{ position: 'relative', width: '100%', height }}>
        {apiKey ? (
          <iframe
            title={title}
            width="100%"
            height="100%"
            frameBorder="0"
            style={{ border: 0 }}
            src={`https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${lat},${lng}`}
            allowFullScreen
          ></iframe>
        ) : (
          <iframe
            title={title}
            width="100%"
            height="100%"
            frameBorder="0"
            scrolling="no"
            marginHeight="0"
            marginWidth="0"
            src={osmEmbedUrl}
            style={{ border: 0 }}
          ></iframe>
        )}
      </div>

      {/* Map Footer Information */}
      <div
        style={{
          padding: '0.6rem 1.25rem',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          backgroundColor: 'var(--bg-surface)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}
      >
        <span>
          Coordinates: {lat.toFixed(4)}, {lng.toFixed(4)}
        </span>
        {!apiKey && (
          <span style={{ color: 'var(--info)' }}>
            Viewing via OpenStreetMap Fallback (Google Maps API key not configured)
          </span>
        )}
      </div>
    </div>
  );
};

export default MapView;
