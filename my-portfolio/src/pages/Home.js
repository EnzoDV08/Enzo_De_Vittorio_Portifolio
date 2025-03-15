import React from "react";
import { motion } from "framer-motion";
import "../styles/global.css";

const Home = () => {
  return (
    <div className="home">
      <motion.div 
        className="hero"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1>
          Hi, I'm <span>Enzo de Vittorio</span> 👋
        </h1>
        <h2>UX & Software Development Enthusiast</h2>
        <p>Designing seamless experiences and building efficient software solutions.</p>
        <motion.button 
          className="cta-button"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          View My Work
        </motion.button>
      </motion.div>
      <motion.img 
        src="/assets/profile.png" 
        alt="Profile" 
        className="profile-img"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2 }}
      />
    </div>
  );
};

export default Home;
