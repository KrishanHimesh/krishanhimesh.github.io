import React from 'react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <p className="footer-copy">
          <span className="footer-mono">© 2025</span> Krishan Himesh Abeyrathne
        </p>
        <div className="footer-links">
          <a href="https://github.com/KrishanHimesh" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="https://www.linkedin.com/in/krishan-himesh-abeyrathne" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href="mailto:krishanhimesh@gmail.com">Email</a>
        </div>
      </div>
    </footer>
  );
}
