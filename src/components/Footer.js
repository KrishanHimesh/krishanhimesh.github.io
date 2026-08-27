import React from 'react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-cta container">
        <p className="footer-cta-label">// let's talk</p>
        <a href="mailto:krishanhimesh@gmail.com" className="footer-cta-email">
          krishanhimesh@gmail.com
        </a>
      </div>

      <div className="footer-inner">
        <p className="footer-copy">
          <span className="footer-mono">© 2026</span> Krishan Himesh Abeyrathne
        </p>
        <div className="footer-links">
          <a href="https://github.com/KrishanHimesh" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="https://www.linkedin.com/in/krishan-himesh-723a42a7" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href="mailto:krishanhimesh@gmail.com">Email</a>
        </div>
      </div>
    </footer>
  );
}
