import React from 'react';
import { Link } from 'react-router-dom';
import './Apps.css';

export default function Apps() {
  return (
    <div className="apps-page page">
      <div className="container">
        <p className="section-label">// apps</p>
        <h1 className="section-title">My Applications</h1>
        <p className="apps-intro">
          Alongside my cybersecurity work, I build practical software tools.
          These apps are hosted right here on this portfolio.
        </p>

        {/* BOOKSHELF APP — LIVE */}
        <div className="app-feature-card">
          <div className="app-status-badge live">
            <span className="status-dot live-dot" />
            Live — Ready to Use
          </div>

          <div className="app-feature-inner">
            <div className="app-icon-wrap">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <rect x="6" y="8" width="10" height="32" rx="2" fill="#38bdf8" opacity="0.9"/>
                <rect x="19" y="12" width="10" height="28" rx="2" fill="#818cf8" opacity="0.9"/>
                <rect x="32" y="6" width="10" height="36" rx="2" fill="#34d399" opacity="0.9"/>
                <line x1="6" y1="40" x2="42" y2="40" stroke="#e8edf5" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="app-feature-text">
              <h2 className="app-feature-title">BookShelf — POS & Inventory system</h2>
              <p className="app-feature-subtitle">Point of Sale · Stock Management · Sales Reports</p>
              <p className="app-feature-desc">
                A full-featured inventory and point-of-sale system built for my small bookshop.
                Manage your entire catalogue, process sales, monitor stock levels, and track revenue
                — all running locally in your browser with no backend required.
              </p>

              <div className="feature-list">
                {[
                  { icon: '🛒', label: 'Point of Sale with cart & receipt printing' },
                  { icon: '📦', label: 'Inventory management — add, edit, delete books' },
                  { icon: '📊', label: 'Dashboard with live revenue & stock stats' },
                  { icon: '⚠️', label: 'Low stock & out-of-stock alerts' },
                  { icon: '💳', label: 'Cash, Card & EFTPOS payment methods' },
                  { icon: '💾', label: 'Data persists in browser (localStorage)' },
                ].map(({ icon, label }) => (
                  <div key={label} className="feature-item">
                    <span className="feature-icon">{icon}</span>
                    <span>{label}</span>
                  </div>
                ))}
              </div>

              <div className="app-tech-stack">
                <p className="stack-label">Built With</p>
                <div className="stack-tags">
                  {['React', 'localStorage', 'No Backend', 'Works Offline'].map(t => (
                    <span key={t} className="tag">{t}</span>
                  ))}
                </div>
              </div>

              <div className="app-cta">
                <Link to="/apps/bookshelf" className="btn btn-primary">
                  🚀 Launch BookShelf
                </Link>
                <a
                  href="https://github.com/KrishanHimesh/krishanhimesh.github.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline"
                >
                  GitHub ↗
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* PLACEHOLDER SLOTS */}
        <div className="more-apps">
          <p className="section-label" style={{ marginTop: 0 }}>// more to come</p>
          <div className="placeholder-grid">
            {['App Slot #2', 'App Slot #3'].map((label) => (
              <div key={label} className="placeholder-card">
                <div className="placeholder-icon">+</div>
                <p className="placeholder-label">{label}</p>
                <p className="placeholder-hint">Future app — stay tuned</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
