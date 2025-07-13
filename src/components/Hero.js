import React, { useState } from "react";
import "../styles/Hero.css";
import profileImage from "../assets/Profile.png";
import { FaHandPaper, FaArrowRight } from "react-icons/fa";
import Lottie from "lottie-react";
import gmailAnimation from "../assets/animations/gmail.json"; // Make sure this file exists

function Hero() {
  const [buttonText, setButtonText] = useState("Let's Talk");
  const [showAnimation, setShowAnimation] = useState(false);

  const handleContactClick = (e) => {
    e.preventDefault();
    setButtonText("Opening Gmail... ✉️");

    const audio = new Audio("/sounds/whoosh.mp3"); // Make sure this file exists
    audio.play();

    setShowAnimation(true);

    setTimeout(() => {
      window.open(
        "https://mail.google.com/mail/?view=cm&to=enzo.devittorio5@gmail.com&su=Let's%20Work%20Together&body=Hi%20Enzo,%0D%0A%0D%0AI'm%20interested%20in%20working%20together...",
        "_blank"
      );
      setButtonText("Let's Talk");
      setShowAnimation(false);
    }, 2500);
  };

  return (
    <header className="hero">
      <div className="hero-content">
        <h1>
          CODING WITH <span><br />🔥 CREATIVITY</span>, DESIGNING <br />WITH PURPOSE
        </h1>
        <p>
          Hi and welcome to my portfolio! I’m excited to share my skills in building modern, powerful, and user-focused websites and apps.
        </p>

        <div className="buttons">
          {/* LET'S TALK BUTTON */}
          <a href="mailto:enzo.devittorio5@gmail.com" className="talk-btn" onClick={handleContactClick}>
            {buttonText} <FaHandPaper className="wave-icon" />
          </a>

          {/* DOWNLOAD CV BUTTON */}
          <a href="/Enzo-De-Vittorio-CV.pdf" download className="cv-btn">
            <div className="circle-container">
              <div className="arrow-circle">
                <FaArrowRight className="arrow" />
              </div>
              <div className="empty-circle"></div>
            </div>
            Download CV
          </a>
        </div>
      </div>

      <div className="hero-visual">
        <div className="purple-box"></div>
        <img src={profileImage} alt="Profile" className="profile-img1" />
      </div>

      {/* Gmail animation overlay */}
      {showAnimation && (
        <div className="gmail-overlay">
          <Lottie animationData={gmailAnimation} loop={false} />
        </div>
      )}
    </header>
  );
}

export default Hero;

