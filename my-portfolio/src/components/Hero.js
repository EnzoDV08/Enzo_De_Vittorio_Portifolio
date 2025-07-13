import React from "react";
import "../styles/Hero.css";
import profileImage from "../assets/Profile.png"; // Ensure path is correct
import { FaHandPaper, FaArrowRight } from "react-icons/fa"; // Icons

function Hero() {
  return (
    <header className="hero">
      <div className="hero-content">
        <h1>
          CODING WITH <span><br />🔥 PASSION</span>,
          CREATING <br />WITH PURPOSE
        </h1>
        <p>
          Hello and welcome to my web developer portfolio! I’m thrilled to
          showcase my passion for crafting captivating and functional websites.
        </p>
        <div className="buttons">
          {/* LET'S TALK BUTTON */}
          <button className="talk-btn">
            <FaHandPaper className="wave-icon" /> Let's Talk
          </button>

          {/* DOWNLOAD CV BUTTON */}
          <button className="cv-btn">
            <div className="circle-container">
              <div className="arrow-circle">
                <FaArrowRight className="arrow" />
              </div>
              <div className="empty-circle"></div>
            </div>
            Download CV
          </button>
        </div>
      </div>
      <div className="hero-visual">
        <div className="purple-box"></div>
        <img src={profileImage} alt="Profile" className="profile-img1" />
      </div>
    </header>
  );
}

export default Hero;

