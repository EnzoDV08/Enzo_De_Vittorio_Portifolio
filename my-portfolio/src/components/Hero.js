import React from "react";
import "../styles/Hero.css";   
import profileImage from "../assets/profile.jpg"; // Replace with your image path

function Hero() {
  return (
    <header className="hero">
      <div className="hero-content">
        <h1>
          CODING WITH <span>🔥 PASSION</span>, <br />
          CREATING WITH PURPOSE
        </h1>
        <p>
          Hello and welcome to my web developer portfolio! I’m thrilled to
          showcase my passion for crafting captivating and functional websites.
        </p>
        <div className="buttons">
          <button className="talk-btn">Let's Talk</button>
          <button className="cv-btn">Download CV</button>
        </div>
      </div>
      <div className="hero-image">
        <img src={profileImage} alt="Profile" />
      </div>
    </header>
  );
}

export default Hero;
