import React from 'react';
import { ShieldCheck, CheckCircle2, Code2, Database, Globe, MessageSquare } from 'lucide-react';

const About = () => {
  return (
    <div style={{ padding: '3.5rem 0 5rem' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span className="badge badge-primary" style={{ marginBottom: '0.75rem' }}>
            MCA Mini Project Synopsis
          </span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>
            About StayMate
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.6 }}>
            A comprehensive, centralized MERN stack web platform solving accommodation, roommate compatibility,
            and daily dining challenges for college students and young professionals.
          </p>
        </div>

        {/* Problem Statement Card */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--primary)' }}>
            1. Problem Statement
          </h2>
          <p style={{ color: 'var(--text-main)', lineHeight: 1.7, marginBottom: '1rem' }}>
            Students and working professionals relocating to educational and IT hubs face fragmented listing websites,
            unverified brokers, inflated security deposits, lack of reliable food services, and high conflict risk with
            incompatible flatmates. Traditional platforms lack integrated roommate lifestyle matching, daily mess menus,
            and real-time verified communication channels.
          </p>
        </div>

        {/* Project Objectives */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--primary)' }}>
            2. Project Objectives
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <CheckCircle2 size={20} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>Provide verified, filterable listings of PGs, Hostels, and Rental Flats with Google Maps location discovery.</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <CheckCircle2 size={20} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>Implement a transparent, normalized roommate compatibility scoring engine based on lifestyle, food habits, budget, and study routines.</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <CheckCircle2 size={20} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>Offer a dedicated mess and tiffin discovery module with weekly meal menus, timings, and subscription rates.</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <CheckCircle2 size={20} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>Facilitate real-time authenticated messaging between seekers, potential roommates, and property owners using Socket.IO.</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <CheckCircle2 size={20} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>Deliver a multi-role administrative console with property verification, user suspension, review moderation, and platform analytics.</span>
            </div>
          </div>
        </div>

        {/* Mandatory Tech Stack Architecture */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--primary)' }}>
            3. Technical Architecture & Technology Stack
          </h2>
          <div className="grid-2">
            <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontWeight: 700 }}>
                <Globe size={18} color="var(--primary)" /> Frontend Tier
              </div>
              <ul style={{ listStylePosition: 'inside', fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
                <li>React.js (Vite build system)</li>
                <li>Plain CSS & CSS Modules (Strictly No Tailwind)</li>
                <li>React Router v6 for navigation</li>
                <li>Axios with HTTP-only cookie credentials</li>
                <li>Lucide React icons</li>
              </ul>
            </div>

            <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontWeight: 700 }}>
                <Code2 size={18} color="var(--secondary)" /> Backend Tier
              </div>
              <ul style={{ listStylePosition: 'inside', fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
                <li>Node.js & Express.js RESTful APIs</li>
                <li>JWT authentication & HTTP-only cookies</li>
                <li>bcryptjs for password encryption</li>
                <li>Multer for secure image uploads</li>
                <li>Express Rate Limiter for DDoS protection</li>
              </ul>
            </div>

            <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontWeight: 700 }}>
                <Database size={18} color="#10b981" /> Database Tier
              </div>
              <ul style={{ listStylePosition: 'inside', fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
                <li>MongoDB NoSQL database</li>
                <li>Mongoose ODM with 9 relational models</li>
                <li>Compound indexes for high-speed queries</li>
                <li>Aggregation pipelines for ratings & analytics</li>
              </ul>
            </div>

            <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontWeight: 700 }}>
                <MessageSquare size={18} color="#f59e0b" /> Real-time & Geolocation
              </div>
              <ul style={{ listStylePosition: 'inside', fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
                <li>Socket.IO authenticated bi-directional events</li>
                <li>Private user rooms & conversation channels</li>
                <li>Google Maps API with OpenStreetMap fallback</li>
                <li>External directions deep-linking</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
