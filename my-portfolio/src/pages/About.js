import React from "react";
import { motion } from "framer-motion";
import "../styles/About.css";

const About = () => {
  return (
    <motion.div 
      className="about"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      <h1>About Me</h1>
      <p>
        Hi, I'm Enzo de Vittorio! A passionate UX/UI designer and software developer, 
        dedicated to crafting seamless digital experiences and innovative solutions.
      </p>
    </motion.div>
  );
};

export default About;
