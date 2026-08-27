import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

const navItems = [
  { path: '/', label: 'Home', num: '01' },
  { path: '/projects', label: 'Projects', num: '02' },
  { path: '/apps', label: 'Apps', num: '03' },
  { path: '/contact', label: 'Contact', num: '04' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const close = () => setMenuOpen(false);

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-inner">
          <NavLink to="/" className="nav-logo" onClick={close}>
            <span className="logo-bracket">[</span>
            KH
            <span className="logo-bracket">]</span>
          </NavLink>

          <button
            className={`menu-toggle ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span className="menu-toggle-label">{menuOpen ? 'Close' : 'Menu'}</span>
            <span className="menu-toggle-icon"><span /><span /><span /></span>
          </button>
        </div>
      </nav>

      <div className={`nav-overlay ${menuOpen ? 'open' : ''}`}>
        <div className="nav-overlay-inner">
          <ul className="overlay-links">
            {navItems.map(({ path, label, num }, i) => (
              <li key={path} style={{ transitionDelay: menuOpen ? `${0.08 + i * 0.06}s` : '0s' }}>
                <NavLink
                  to={path}
                  end={path === '/'}
                  className={({ isActive }) => isActive ? 'overlay-link active' : 'overlay-link'}
                  onClick={close}
                >
                  <span className="overlay-link-num">{num}</span>
                  <span className="overlay-link-label">{label}</span>
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="overlay-footer">
            <a
              href="https://docs.google.com/gview?embedded=1&url=https://raw.githubusercontent.com/KrishanHimesh/krishanhimesh.github.io/main/files/KrishanHimeshAbeyrathne.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="overlay-resume"
              onClick={close}
            >
              Resume ↗
            </a>
            <div className="overlay-socials">
              <a href="https://github.com/KrishanHimesh" target="_blank" rel="noopener noreferrer">GitHub</a>
              <a href="https://www.linkedin.com/in/krishan-himesh-723a42a7" target="_blank" rel="noopener noreferrer">LinkedIn</a>
              <a href="mailto:krishanhimesh@gmail.com">Email</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
