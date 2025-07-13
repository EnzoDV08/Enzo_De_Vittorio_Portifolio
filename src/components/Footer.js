import React, { useState } from "react";
import "../styles/Footer.css";
import { FaEnvelope } from "react-icons/fa";
import { FaReact, FaNodeJs, FaHtml5, FaCss3Alt, FaJsSquare, FaPython, FaDatabase } from "react-icons/fa";
import { SiFirebase, SiMongodb, SiPostgresql, SiDocker } from "react-icons/si";
import Lottie from "lottie-react";
import gmailAnimation from "../assets/animations/gmail.json"; // adjust path if needed

const techLogos = [
  { icon: <FaReact />, className: "tech-logo react" },
  { icon: <FaNodeJs />, className: "tech-logo node" },
  { icon: <FaHtml5 />, className: "tech-logo html" },
  { icon: <FaCss3Alt />, className: "tech-logo css" },
  { icon: <FaJsSquare />, className: "tech-logo js" },
  { icon: <FaPython />, className: "tech-logo python" },
  { icon: <SiFirebase />, className: "tech-logo firebase" },
  { icon: <SiMongodb />, className: "tech-logo mongodb" },
  { icon: <SiPostgresql />, className: "tech-logo postgresql" },
  { icon: <SiDocker />, className: "tech-logo docker" },
  { icon: <FaDatabase />, className: "tech-logo database" }
];

const Footer = () => {
  const [buttonText, setButtonText] = useState("Contact Me");
  const [showAnimation, setShowAnimation] = useState(false);

  const handleContactClick = (e) => {
    e.preventDefault();

    // Typewriter effect text
    setButtonText("Opening Gmail... ✉️");

    // Play whoosh sound
    const audio = new Audio("/sounds/whoosh.mp3");
    audio.play();

    // Show Gmail animation overlay
    setShowAnimation(true);

    // After animation, redirect to Gmail compose
    setTimeout(() => {
      window.open(
        "https://mail.google.com/mail/?view=cm&to=enzo.devittorio5@example.com&su=Let's%20Work%20Together&body=Hi%20Enzo,%0D%0A%0D%0AI'm%20interested%20in%20working%20together...",
        "_blank"
      );
      // Reset
      setButtonText("Contact Me");
      setShowAnimation(false);
    }, 2500); // Adjust to your animation length
  };

  return (
    <footer className="footer">
      {/* Floating Tech Logos */}
      {techLogos.map((logo, index) => (
        <span key={index} className={logo.className}>
          {logo.icon}
        </span>
      ))}

      {/* Gmail Animation Overlay */}
      {showAnimation && (
        <div className="gmail-overlay">
          <Lottie animationData={gmailAnimation} loop={false} />
        </div>
      )}

      {/* Main Footer Content */}
      <div className="footer-content">
        <h2 className="footer-heading">🚀 Let's Work Together</h2>
        <a href="mailto:enzo.devittorio5@gmail.com" className="contact-btn3" onClick={handleContactClick}>
          {buttonText} <FaEnvelope />
        </a>
      </div>
    </footer>
  );
};

export default Footer;

