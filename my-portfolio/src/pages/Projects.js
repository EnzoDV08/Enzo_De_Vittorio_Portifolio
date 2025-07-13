import React from "react";
import { motion } from "framer-motion";
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


const Projects = () => {
  return (
    <motion.div 
      className="projects-page"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1 }}
    >
      

      <div className="projects-heading">
  <h1>My Projects</h1>
  <p>A showcase of the work I've crafted — from web apps to full platforms.</p>
</div>

      <div className="projects-wrapper1">
      {projects.map((project, index) => (
 <motion.div
 key={index}
 className="project-item1"
 initial={{ opacity: 0, y: 30 }} // Less distance = smoother entrance
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true, amount: 0.2 }} // Triggers earlier (20% into view)
 transition={{ duration: 0.9, ease: "easeInOut", delay: index * 0.08 }} // Slower + staggered
 whileHover={{ scale: 1.04 }}
>
            <div className="project-thumbnail">
              <img src={project.image} alt={project.title} />
            </div>
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <div className="tech-list1">
              {project.techStack.map((tech, i) => (
                <span key={i} className="tech-badge1">{tech}</span>
              ))}
            </div>
            <a href={project.github} target="_blank" rel="noopener noreferrer" className="project-link1">
              View Project <FaGithub />
            </a>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Projects;
