import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaHome, FaChevronRight, FaFolderOpen } from "react-icons/fa";
import "../styles/Projects.css";
import mockup1 from "../assets/mockup1.png";
import mockup2 from "../assets/Mockup2.jpg";
import mockup3 from "../assets/Mockup3.avif";
import mockup4 from "../assets/Mockup3.webp";
import { FaGithub } from "react-icons/fa";

const projects = [
  { title: "E-Commerce Website", description: "React & Node.js project.", techStack: ["React", "Node.js"], image: mockup1, github: "#" },
  { title: "Portfolio Website", description: "Personal portfolio showcase.", techStack: ["UX/UI", "React"], image: mockup2, github: "#" },
  { title: "Jewelry Website", description: "Dynamic eCommerce site.", techStack: ["Prototypes", "React"], image: mockup3, github: "#" },
  { title: "Restaurant Website", description: "Local restaurant website.", techStack: ["React", "Node.js"], image: mockup4, github: "#" },
  { title: "AI Chatbot", description: "Built an AI chatbot using NLP.", techStack: ["Python", "TensorFlow"], image: mockup1, github: "#" },
  { title: "Fitness Tracker", description: "Mobile app for fitness tracking.", techStack: ["Flutter", "Firebase"], image: mockup2, github: "#" },
  { title: "Blog CMS", description: "Content management system for bloggers.", techStack: ["Next.js", "MongoDB"], image: mockup3, github: "#" },
  { title: "Weather App", description: "Real-time weather forecast.", techStack: ["React", "API"], image: mockup4, github: "#" },
  { title: "Finance Dashboard", description: "Data visualization dashboard.", techStack: ["Vue.js", "D3.js"], image: mockup1, github: "#" },
  { title: "Event Booking", description: "Ticket booking system.", techStack: ["React", "Firebase"], image: mockup2, github: "#" },
];

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease: "easeOut" } },
  hover: { scale: 1.05, transition: { duration: 0.4 } },
};

const Projects = () => {
  return (
    <motion.div 
      className="projects-page"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1 }}
    >
      {/* ✅ Enhanced Breadcrumb Navigation */}
      <motion.div 
        className="breadcrumb-container"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Link to="/" className="breadcrumb-link">
          <FaHome className="breadcrumb-icon" />
          Home
        </Link>
        <FaChevronRight className="breadcrumb-separator" />
        <span className="breadcrumb-active">
          <FaFolderOpen className="breadcrumb-icon" />
          Projects
        </span>
      </motion.div>

      <h1>My Projects</h1>
      <p>Here are some of my latest projects.</p>

      <div className="projects-wrapper">
        {projects.map((project, index) => (
          <motion.div key={index} className="project-item" variants={cardVariants} whileHover="hover">
            <div className="project-thumbnail">
              <img src={project.image} alt={project.title} />
            </div>
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <div className="tech-list">
              {project.techStack.map((tech, i) => (
                <span key={i} className="tech-badge">{tech}</span>
              ))}
            </div>
            <a href={project.github} target="_blank" rel="noopener noreferrer" className="project-link">
              View Project <FaGithub />
            </a>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Projects;
