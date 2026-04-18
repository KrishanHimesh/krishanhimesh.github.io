import React, { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import './Contact.css';

// ─── EmailJS Configuration ───────────────────────────────────────────────────
// Service ID is already set from your EmailJS Gmail connection.
// To get your Template ID and Public Key:
//   1. Template ID  → emailjs.com > Email Templates > Create Template > copy the Template ID
//   2. Public Key   → emailjs.com > Account > General > Public Key
const EMAILJS_SERVICE_ID  = 'service_1m0rsbz';         // ✅ your Gmail service
const EMAILJS_TEMPLATE_ID = 'template_ayyxvp9';         // ⬅ replace this
const EMAILJS_PUBLIC_KEY  = 'APi_ENA19Ymke5qUI';          // ⬅ replace this
// ─────────────────────────────────────────────────────────────────────────────

export default function Contact() {
  const formRef = useRef(null);
  const [form, setForm]     = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | success | error

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus('sending');
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name:  form.name,
          from_email: form.email,
          subject:    form.subject || 'Portfolio Contact',
          message:    form.message,
          to_email:   'krishanhimesh@gmail.com',
        },
        EMAILJS_PUBLIC_KEY
      );
      setStatus('success');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.error('EmailJS error:', err);
      setStatus('error');
    }
  };

  return (
    <div className="contact-page page">
      <div className="container">
        <p className="section-label">// get in touch</p>
        <h1 className="section-title">Contact Me</h1>
        <p className="contact-intro">
          Whether you have an opportunity, a collaboration idea, or just want to say hi —
          my inbox is always open.
        </p>

        <div className="contact-grid">
          {/* LEFT — Info */}
          <div className="contact-info">
            <div className="info-block">
              <p className="info-label">Email</p>
              <a href="mailto:krishanhimesh@gmail.com" className="info-value">
                krishanhimesh@gmail.com
              </a>
            </div>
            <div className="info-block">
              <p className="info-label">Location</p>
              <p className="info-value">Australia 🇦🇺</p>
            </div>
            <div className="info-block">
              <p className="info-label">Status</p>
              <p className="info-value status-open">
                <span className="status-dot-sm" /> Open to opportunities
              </p>
            </div>

            <div className="contact-socials">
              <a href="https://github.com/KrishanHimesh" target="_blank" rel="noopener noreferrer" className="social-card">
                <span className="social-card-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.11.82-.26.82-.58 0-.28-.01-1.02-.01-2-3.34.72-4.04-1.61-4.04-1.61-.54-1.38-1.33-1.75-1.33-1.75-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49 1 .1-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02 0 2.04.13 3 .4 2.28-1.55 3.29-1.23 3.29-1.23.64 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22 0 1.6-.01 2.9-.01 3.29 0 .32.21.7.82.58C20.57 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z"/>
                  </svg>
                </span>
                <div>
                  <p className="social-card-name">GitHub</p>
                  <p className="social-card-handle">@KrishanHimesh</p>
                </div>
                <span className="social-card-arrow">↗</span>
              </a>

              <a href="https://www.linkedin.com/in/krishan-himesh-abeyrathne" target="_blank" rel="noopener noreferrer" className="social-card">
                <span className="social-card-icon linkedin">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.26 2.37 4.26 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z"/>
                  </svg>
                </span>
                <div>
                  <p className="social-card-name">LinkedIn</p>
                  <p className="social-card-handle">Krishan Himesh Abeyrathne</p>
                </div>
                <span className="social-card-arrow">↗</span>
              </a>
            </div>
          </div>

          {/* RIGHT — Form */}
          <div className="contact-form-wrap">
            {status === 'success' ? (
              <div className="form-success">
                <div className="success-icon">✓</div>
                <h3>Message sent!</h3>
                <p>Thanks for reaching out. I'll get back to you as soon as possible.</p>
                <button className="btn btn-outline" onClick={() => setStatus('idle')}>
                  Send Another
                </button>
              </div>
            ) : (
              <form ref={formRef} className="contact-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Name</label>
                    <input
                      type="text" name="name" className="form-input"
                      placeholder="Your name" value={form.name}
                      onChange={handleChange} required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input
                      type="email" name="email" className="form-input"
                      placeholder="your@email.com" value={form.email}
                      onChange={handleChange} required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <input
                    type="text" name="subject" className="form-input"
                    placeholder="What's this about?" value={form.subject}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Message</label>
                  <textarea
                    name="message" className="form-input form-textarea"
                    placeholder="Your message..." rows={6}
                    value={form.message} onChange={handleChange} required
                  />
                </div>

                {status === 'error' && (
                  <div className="form-error-msg">
                    ⚠ Something went wrong. Please email me directly at{' '}
                    <a href="mailto:krishanhimesh@gmail.com">krishanhimesh@gmail.com</a>
                  </div>
                )}

                <button
                  type="submit"
                  className="btn btn-primary submit-btn"
                  disabled={status === 'sending'}
                >
                  {status === 'sending' ? 'Sending…' : 'Send Message →'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
