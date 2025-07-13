import React from "react";
import { motion } from "framer-motion";
import "../styles/Projects.css";
import mockup1 from "../assets/MockUp1.png";
import mockup2 from "../assets/MockUp2.png";
import mockup3 from "../assets/MockUp3.png";
import mockup4 from "../assets/MockUp4.png";
import mockup5 from "../assets/MockUp5.png";
import mockup6 from "../assets/MockUp6.png";
import mockup7 from "../assets/MockUp7.jpg";
import mockup8 from "../assets/MockUp8.jpg";
import mockup9 from "../assets/MockUp9.jpg";
import { FaGithub, FaLock } from "react-icons/fa";
import { FiFigma } from "react-icons/fi"; 

const projects = [
  {
    title: "RentalFinder",
    techStack: ["Figma", "React", "Node.js", "Bootstrap", "MongoDB", "HTML", "CSS", "JavaScript"],
    image: mockup1,
    github: "https://github.com/EnzoDV08/DV_200_Group2_Final?tab=readme-ov-file",
  },
  {
    title: "SuperStore",
    techStack: ["Figma", "React", "Node.js", "Bootstrap", "Firebase", "HTML", "CSS", "JavaScript"],
    image: mockup2,
    github: "https://github.com/EnzoDV08/SuperStore_DV200_Term_4.git",
  },
  {
    title: "Code Kids Academy",
    techStack: ["Figma", "HTML", "CSS"],
    image: mockup3,
    github: "https://github.com/EnzoDV08/CodeKidsAcademy_DV_200_Theory.git",
  },
  {
    title: "Real Estate Website",
    techStack: ["PHP", "MySQL", "HTML", "CSS", "JavaScript"],
    image: mockup4,
    github: "https://github.com/EnzoDV08/Enzo_De_Vittorio_231244_Term3-Final-Project.git",
  },
  {
    title: "Sportify",
    techStack: ["React", "TypeScript", "TailwindCSS", "DaisyUI ", "Vite", ".NET", "C#"],
    image: mockup5,
    github: "https://github.com/EnzoDV08/Sportify_Frontend.git",
  },
  {
    title: "Escape Today",
    techStack: ["Figma", "React", "Node.js", "Bootstrap", "Firebase", "HTML", "CSS", "JavaScript"],
    image: mockup6,
    github: "https://github.com/EnzoDV5/Escape_Today.git",
  },
    {
  title: "Agriflow",
  techStack: ["Figma", "UX", "UI", "Design System"],
  image: mockup7, 
  figma: "https://www.figma.com/proto/hoQrbZ5yb6tRzsD6lFOnHy/UX-Farming-App-design?page-id=332%3A2000&node-id=613-4523&viewport=-310%2C375%2C0.31&t=jZQLiLBpJqZGySS5-1&scaling=scale-down&content-scaling=fixed&starting-point-node-id=613%3A4523",
  },
      {
  title: "ClimberBuddy",
  techStack: ["Figma", "UX", "UI", "Design System"],
  image: mockup8, 
  figma: "https://www.figma.com/proto/pw91ZDWO3rbXrxpGDV5MCs/UX-200?page-id=0%3A1&node-id=397-956&starting-point-node-id=460%3A256&t=6Fo2YXQdx0XeRXUa-1",
  },
      {
  title: "Catch The Bokkie",
  techStack: ["Figma", "UX", "UI", "Design System"],
  image: mockup9, 
  figma: "https://www.figma.com/proto/p5pNm46OTExXAImvYJOITC/UX-Term-3-Final?page-id=0%3A1&node-id=783-2487&p=f&viewport=382%2C944%2C0.03&t=3Rt3lB1He5aVainy-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=692%3A193",
  },
  {
    title: "Coming Soon...",
    techStack: ["???", "In Progress"],
    image: "", // No image yet
    comingSoon: true,
  },


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
            className={`project-item1 ${project.comingSoon ? "coming-soon" : ""}`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.9, ease: "easeInOut", delay: index * 0.08 }}
            whileHover={{ scale: 1.04 }}
          >
            <div className="project-thumbnail1">
              {project.comingSoon ? (
                <div className="locked-thumbnail">
                  <FaLock size={40} />
                </div>
              ) : (
                <img src={project.image} alt={project.title} />
              )}
            </div>
            <h3>{project.title}</h3>
            <p>
              {project.comingSoon
                ? "Something exciting is on the way... Stay tuned!"
                : project.description}
            </p>
            <div className="tech-list1">
              {project.techStack.map((tech, i) => (
                <span key={i} className="tech-badge1">{tech}</span>
              ))}
            </div>
{!project.comingSoon && (
  <>
    {project.github ? (
      <a
        href={project.github}
        target="_blank"
        rel="noopener noreferrer"
        className="project-link1"
      >
        View Project <FaGithub />
      </a>
    ) : project.figma ? (
      <a
        href={project.figma}
        target="_blank"
        rel="noopener noreferrer"
        className="project-link1 figma-button"
      >
        View Prototype <FiFigma />
      </a>
    ) : null}
  </>
)}


          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Projects;

