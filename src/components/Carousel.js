import React from "react";
import { motion } from "framer-motion";
import "../styles/Carousel.css";
import { FaReact, FaHtml5, FaCss3Alt, FaJs, FaPhp, FaFigma } from "react-icons/fa";
import { SiTypescript, SiDotnet, SiMongodb, SiPostgresql, SiFirebase } from "react-icons/si";

const technologies = [
  { icon: <FaHtml5 />, name: "HTML5", color: "#E34F26" },
  { icon: <FaCss3Alt />, name: "CSS3", color: "#1572B6" },
  { icon: <FaJs />, name: "JavaScript", color: "#F7DF1E" },
  { icon: <SiTypescript />, name: "TypeScript", color: "#3178C6" },
  { icon: <FaReact />, name: "React", color: "#61DAFB" },
  { icon: <SiDotnet />, name: ".NET", color: "#512BD4" },
  { icon: <SiMongodb />, name: "MongoDB", color: "#47A248" },
  { icon: <SiPostgresql />, name: "PostgreSQL", color: "#336791" },
  { icon: <FaPhp />, name: "PHP", color: "#777BB4" },
  { icon: <SiFirebase />, name: "Firebase", color: "#FFCA28" },
  { icon: <FaFigma />, name: "Figma", color: "#F24E1E" },
  { icon: <FaHtml5 />, name: "HTML5", color: "#E34F26" },
  { icon: <FaCss3Alt />, name: "CSS3", color: "#1572B6" },
  { icon: <FaJs />, name: "JavaScript", color: "#F7DF1E" },
  { icon: <SiTypescript />, name: "TypeScript", color: "#3178C6" },
  { icon: <FaReact />, name: "React", color: "#61DAFB" },
  { icon: <SiDotnet />, name: ".NET", color: "#512BD4" },
  { icon: <SiMongodb />, name: "MongoDB", color: "#47A248" },
  { icon: <SiPostgresql />, name: "PostgreSQL", color: "#336791" },
  { icon: <FaPhp />, name: "PHP", color: "#777BB4" },
  { icon: <SiFirebase />, name: "Firebase", color: "#FFCA28" },
  { icon: <FaFigma />, name: "Figma", color: "#F24E1E" },
  { icon: <FaHtml5 />, name: "HTML5", color: "#E34F26" },
  { icon: <FaCss3Alt />, name: "CSS3", color: "#1572B6" },
  { icon: <FaJs />, name: "JavaScript", color: "#F7DF1E" },
  { icon: <SiTypescript />, name: "TypeScript", color: "#3178C6" },
  { icon: <FaReact />, name: "React", color: "#61DAFB" },
  { icon: <SiDotnet />, name: ".NET", color: "#512BD4" },
  { icon: <SiMongodb />, name: "MongoDB", color: "#47A248" },
  { icon: <SiPostgresql />, name: "PostgreSQL", color: "#336791" },
  { icon: <FaPhp />, name: "PHP", color: "#777BB4" },
  { icon: <SiFirebase />, name: "Firebase", color: "#FFCA28" },
  { icon: <FaFigma />, name: "Figma", color: "#F24E1E" },
  { icon: <FaHtml5 />, name: "HTML5", color: "#E34F26" },
  { icon: <FaCss3Alt />, name: "CSS3", color: "#1572B6" },
  { icon: <FaJs />, name: "JavaScript", color: "#F7DF1E" },
  { icon: <SiTypescript />, name: "TypeScript", color: "#3178C6" },
  { icon: <FaReact />, name: "React", color: "#61DAFB" },
  { icon: <SiDotnet />, name: ".NET", color: "#512BD4" },
  { icon: <SiMongodb />, name: "MongoDB", color: "#47A248" },
  { icon: <SiPostgresql />, name: "PostgreSQL", color: "#336791" },
  { icon: <FaPhp />, name: "PHP", color: "#777BB4" },
  { icon: <SiFirebase />, name: "Firebase", color: "#FFCA28" },
  { icon: <FaFigma />, name: "Figma", color: "#F24E1E" },
];

const loopedTechnologies = [...technologies, ...technologies];

const Carousel = () => {
  return (
    <div className="carousel-wrapper">
      {/* ✅ Title Added */}
      <h2 className="carousel-title">💡 My Technical Expertise<span className="title-line"></span></h2>

      <div className="carousel-container">
        <motion.div
          className="carousel"
          initial={{ x: "0%" }}
          animate={{ x: "-50%" }}
          transition={{
            repeat: Infinity,
            duration: 100, // Slower scrolling
            ease: "linear"
          }}
        >
          {loopedTechnologies.map((tech, index) => (
            <div key={index} className="tech-item" style={{ color: tech.color }}>
              {tech.icon}
              <span>{tech.name}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Carousel;
