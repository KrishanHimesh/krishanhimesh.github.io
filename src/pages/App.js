import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import NetworkBackground from './components/NetworkBackground';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Apps from './pages/Apps';
import Contact from './pages/Contact';
import BookShelf from './apps/BookShelf';
import './App.css';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function App() {
  return (
    <>
    <ScrollToTop />
    <Routes>
      {/* BookShelf runs fullscreen — no Navbar/Footer */}
      <Route path="/apps/bookshelf" element={<BookShelf />} />

      {/* All other pages use portfolio layout */}
      <Route path="/*" element={
        <div className="app">
          <NetworkBackground />
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/apps" element={<Apps />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </main>
          <Footer />
        </div>
      } />
    </Routes>
    </>
  );
}

export default App;
