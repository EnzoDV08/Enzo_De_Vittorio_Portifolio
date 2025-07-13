import React from "react";
import "../styles/Footer.css";
import { FaEnvelope } from "react-icons/fa";
import { FaReact, FaNodeJs, FaHtml5, FaCss3Alt, FaJsSquare, FaPython, FaDatabase } from "react-icons/fa";
import { SiFirebase, SiMongodb, SiPostgresql, SiDocker } from "react-icons/si";

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
  return (
    <footer className="footer">
      {/* Floating Tech Logos */}
      {techLogos.map((logo, index) => (
        <span key={index} className={logo.className}>
          {logo.icon}
        </span>
      ))}

      {/* Main Footer Content */}
      <div className="footer-content">
        <h2 className="footer-heading">🚀 Let's Work Together</h2>
        <a href="mailto:your.email@example.com" className="contact-btn3">
          Contact Me <FaEnvelope />
        </a>
      </div>
    </footer>
  );
};

export default Footer;

