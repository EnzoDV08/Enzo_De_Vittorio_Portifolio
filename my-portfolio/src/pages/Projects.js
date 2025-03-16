import React from "react";
import { motion } from "framer-motion";
import "../styles/Projects.css";

const Projects = () => {
  return (
    <motion.div 
      className="projects"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1 }}
    >
      <h1>My Projects</h1>
      <p>Here are some of my latest projects.</p>
      <div className="project-grid">
        <div className="project-card">Project 1</div>
        <div className="project-card">Project 2</div>
        <div className="project-card">Project 3</div>
      </div>
    </motion.div>
  );
};

export default Projects;
