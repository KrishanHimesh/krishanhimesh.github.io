import React from 'react';
import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal';
import './Apps.css';

export default function Apps() {
  return (
    <div className="apps-page page">
      <div className="container">
        <Reveal><p className="section-label">// apps</p></Reveal>
        <Reveal delay={1}><h1 className="section-title">My Applications</h1></Reveal>
        <Reveal delay={2} as="p" className="apps-intro">
          Alongside my cybersecurity work, I build practical software tools.
          These apps are hosted right here on this portfolio.
        </Reveal>

        {/* BOOKSHELF APP — LIVE */}
        <Reveal as="div" delay={3} className="app-feature-card">
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
              <h2 className="app-feature-title">TechnoPOS — POS & Inventory system</h2>
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
                  🚀 Launch TechnoPOS
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
        </Reveal>

        {/* BUSINESS APPS — BUILT FOR TECHNOVIA */}
        <Reveal as="div" className="ext-apps-section">
          <p className="section-label" style={{ marginTop: 0 }}>// business apps</p>
          <h2 className="section-title" style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)' }}>
            Built for Technovia
          </h2>
          <p className="apps-intro" style={{ marginBottom: 40 }}>
            Software I've built and shipped for my business, Technovia — live and in daily use.
          </p>

          <div className="ext-apps-grid">
            {[
              {
                name: 'TechnoPOS',
                color: '#a78bfa',
                tagline: 'Retail & business management platform',
                features: [
                  'Manage inventory and stock levels',
                  'Track sales, orders, and transactions',
                  'Access real-time business reports',
                  'Manage customers and supplier records',
                ],
              },
              {
                name: 'ChairTime',
                color: '#38bdf8',
                tagline: 'Smart booking & appointment management',
                features: [
                  'Online appointment booking 24/7',
                  'Manage staff schedules & availability',
                  'Automatic booking confirmations & reminders',
                  'Reduce no-shows with easy rescheduling',
                ],
              },
              {
                name: 'InvoiceGen',
                color: '#34d399',
                tagline: 'Fast, professional invoicing',
                features: [
                  'Create and send professional invoices',
                  'Download PDF invoices instantly',
                  'Save client details for faster invoicing',
                  'Track invoice status and records',
                ],
              },
              {
                name: 'WFHly',
                color: '#a78bfa',
                tagline: 'Work-from-home tracking & expenses',
                features: [
                  'Log work-from-home hours automatically',
                  'Track home-office expenses & claims',
                  'Visual breakdown of time & spend',
                  'Exportable summaries for tax time',
                ],
              },
            ].map(({ name, color, tagline, features }, i) => (
              <Reveal as="div" delay={Math.min(i + 1, 4)} className="ext-app-card" key={name}>
                <h3 className="ext-app-title" style={{ color }}>{name}</h3>
                <p className="ext-app-tagline">{tagline}</p>
                <ul className="ext-app-features">
                  {features.map(f => (
                    <li key={f}>
                      <span className="ext-app-dot" style={{ background: color }} />
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="https://technovia.com.au/apps"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ext-app-btn"
                  style={{ background: color }}
                >
                  Open {name} →
                </a>
              </Reveal>
            ))}
          </div>
        </Reveal>
      </div>
    </div>
  );
}
