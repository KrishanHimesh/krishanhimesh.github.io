import React from 'react';
import './Apps.css';

export default function Apps() {
  return (
    <div className="apps-page page">
      <div className="container">
        <p className="section-label">// apps</p>
        <h1 className="section-title">My Applications</h1>
        <p className="apps-intro">
          Alongside my cybersecurity work, I build practical software tools.
          These apps will be hosted right here on this portfolio.
        </p>

        {/* BOOKSHELF APP */}
        <div className="app-feature-card">
          <div className="app-status-badge">
            <span className="status-dot building" />
            In Development
          </div>

          <div className="app-feature-inner">
            <div className="app-icon-wrap">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <rect x="6" y="8" width="10" height="32" rx="2" fill="#00d4ff" opacity="0.9"/>
                <rect x="19" y="12" width="10" height="28" rx="2" fill="#7b61ff" opacity="0.9"/>
                <rect x="32" y="6" width="10" height="36" rx="2" fill="#00ff9d" opacity="0.9"/>
                <line x1="6" y1="40" x2="42" y2="40" stroke="#e8edf5" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="app-feature-text">
              <h2 className="app-feature-title">BookShelf — Inventory Manager</h2>
              <p className="app-feature-subtitle">For small bookshop owners</p>
              <p className="app-feature-desc">
                A full-stack inventory management system designed specifically for my small bookshop business.
                Manage your entire catalogue, track sales, monitor low stock, and generate business reports —
                all from a clean, fast web interface accessible from any device.
              </p>

              <div className="feature-list">
                {[
                  { icon: '📚', label: 'Book catalogue with search & filter' },
                  { icon: '📦', label: 'Stock level tracking & low-stock alerts' },
                  { icon: '💰', label: 'Sales recording & revenue tracking' },
                  { icon: '📊', label: 'Reports & business analytics dashboard' },
                  { icon: '📷', label: 'Barcode scanning for quick entry' },
                  { icon: '🔒', label: 'Secure login with role-based access' },
                ].map(({ icon, label }) => (
                  <div key={label} className="feature-item">
                    <span className="feature-icon">{icon}</span>
                    <span>{label}</span>
                  </div>
                ))}
              </div>

              <div className="app-tech-stack">
                <p className="stack-label">Tech Stack</p>
                <div className="stack-tags">
                  {['React', 'Node.js', 'PostgreSQL', 'REST API', 'JWT Auth'].map(t => (
                    <span key={t} className="tag">{t}</span>
                  ))}
                </div>
              </div>

              <div className="app-cta">
                <button className="btn btn-primary" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                  Coming Soon
                </button>
                <p className="app-eta">Expected launch: 2025</p>
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
