import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";
import { FaEnvelope, FaPhoneAlt, FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";

function Navbar() {
  const [showOverlay, setShowOverlay] = useState(false);

  const handleClick = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  };

  const toggleOverlay = () => {
    setShowOverlay(!showOverlay);
  };

  return (
    <>
      <nav className="navbar">
        <div className="logo">MyPortfolio</div>
        <ul className="nav-links">
          <li><Link to="/" onClick={handleClick}>Home</Link></li>
          <li><Link to="/about" onClick={handleClick}>About Me</Link></li>
          <li><Link to="/projects" onClick={handleClick}>Projects</Link></li>
        </ul>
        <button className="contact-btn1" onClick={toggleOverlay}>Contact Me</button>
      </nav>

      {/* === Contact Overlay === */}
      {showOverlay && (
        <div className="contact-overlay">
          <div className="contact-card">
            <button className="close-btn" onClick={toggleOverlay}>×</button>
            <h2>Contact Me</h2>
            <p><FaEnvelope className="icon" /> enzodevittorio@email.com</p>
            <p><FaPhoneAlt className="icon" /> +27 61 234 5678</p>
            <div className="social-icons">
              <a href="https://www.facebook.com/enzo.devittorio" target="_blank" rel="noopener noreferrer"><FaFacebookF /></a>
              <a href="https://www.instagram.com/enzo_devittorio/" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
              <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer"><FaLinkedinIn /></a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;

