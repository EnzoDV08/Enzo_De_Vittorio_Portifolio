import React from "react";
import "../styles/global.css";

const Footer = () => {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} Enzo de Vittorio | UX & Software Development</p>
    </footer>
  );
};

export default Footer;
