import React from "react";
import { motion } from "framer-motion";
import "../styles/About.css";
import profile from "../assets/profile.jpg";
import mockup1 from "../assets/mockup1.png";
import mockup2 from "../assets/Mockup2.jpg";
import mockup3 from "../assets/Mockup3.avif";
import mockup4 from "../assets/Mockup3.webp";


import {
  FaReact,
  FaNodeJs,
  FaFigma,
  FaHtml5,
  FaCss3Alt,
  FaJs,
  FaPhp,
  FaDatabase,
  FaBootstrap,
  FaTerminal,
} from "react-icons/fa";

import {
  SiTypescript,
  SiFirebase,
  SiDotnet,
  SiMongodb,
  SiElectron,
  SiVite,
  SiXampp,
} from "react-icons/si";

const Skill = ({ Icon, name, level, subtitle }) => (
  <div className="stat-item">
    <div className="label-and-bar">
      <div className="label">
        <Icon className="icon" />
        <div className="text-group">
          <span className="skill-name">{name}</span>
          {subtitle && <span className="skill-sub">{subtitle}</span>}
        </div>
      </div>
      <div className="bar-container">
        <motion.div
          className="bar-fill"
          data-label={`${level}%`}
          initial={{ width: 0 }}
          animate={{ width: `${level}%` }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          style={{ "--fill-width": `${level}%` }}
        />
      </div>
    </div>
  </div>
);

const projects = [
  { title: "E-Commerce Website", description: "React & Node.js project.", image: mockup1 },
  { title: "Portfolio Website", description: "Personal portfolio showcase.", image: mockup2 },
  { title: "Jewelry Website", description: "Dynamic eCommerce site.", image: mockup3 },
  { title: "Restaurant Website", description: "Local restaurant website.", image: mockup4 }
];

const About = () => {
  return (
    <motion.div
      className="about-container"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
  <div className="about-hero-enhanced">
  <div className="about-left">
    <div className="purple-overlay" />
    <img src={profile} alt="Enzo De Vittorio" className="profile-img-enhanced" />
  </div>
  <div className="about-right">
    <h1 className="hero-name">Enzo De Vittorio</h1>
    <h2 className="hero-title">UI/UX Designer & Full-Stack Developer</h2>
    <p className="hero-summary">
      Passionate about crafting beautiful and functional digital experiences.
      With a strong background in both code and design, I love blending creativity
      with usability to create modern, user-friendly solutions.
    </p>
    <div className="contact-row">
      <p><strong>Email:</strong> enzodevittorio@email.com</p>
      <p><strong>Phone:</strong> +27 61 234 5678</p>
    </div>
  </div>
</div>



      <div className="stats-projects-wrapper">
  <div className="stats-columns">
   {/* Front-End and Back-End */}
   <div className="stats-wrapper">
        <div className="column">
          <h3>🧠 Front-End Development</h3>
          <Skill Icon={FaHtml5} name="HTML" level={70} />
          <Skill Icon={FaCss3Alt} name="CSS" level={75} />
          <Skill Icon={FaJs} name="JavaScript" level={40} />
          <Skill Icon={SiTypescript} name="TypeScript" level={30} />
          <Skill Icon={FaReact} name="React" level={80} />
          <Skill Icon={SiVite} name="Vite" level={70} />
          <Skill Icon={FaBootstrap} name="Bootstrap" level={75} />
        </div>
        <div className="column">
          <h3>🖥️ Back-End Development</h3>
          <Skill Icon={FaPhp} name="PHP" level={45} />
          <Skill Icon={FaTerminal} name="C#" level={40} />
          <Skill Icon={SiDotnet} name=".NET" level={45} />
          <Skill Icon={SiFirebase} name="Firebase" level={85} />
          <Skill Icon={FaNodeJs} name="Node.js" level={60} />
          <Skill Icon={SiElectron} name="Electron" level={35} />
        </div>
      </div>

      {/* Database and Tools */}
      <div className="stats-wrapper">
        <div className="column">
          <h3>🗄️ Database Systems</h3>
          <Skill Icon={FaDatabase} name="SQL" subtitle="MySQL, PostgreSQL, MSSQL" level={55} />
          <Skill Icon={SiMongodb} name="NoSQL" subtitle="MongoDB, Firebase" level={80} />
          <Skill Icon={SiXampp} name="Tools" subtitle="pgAdmin4, XAMPP" level={65} />
        </div>
        <div className="column">
          <h3>🎨 Design & Multimedia Tools</h3>
          <Skill Icon={FaFigma} name="Figma" level={85} />
          <Skill Icon={() => <span className="icon">🅿</span>} name="Adobe Photoshop" level={25} />
          <Skill Icon={() => <span className="icon">🔧</span>} name="SolidWorks" level={65} />
          <Skill Icon={() => <span className="icon">🎚️</span>} name="Reaper" level={50} />
        </div>
      </div>
  </div>

  <div className="mini-projects-column">
    {projects.map((project, index) => (
      <div className="mini-project-card" key={index}>
        <div className="mini-thumbnail">
          <img src={project.image} alt={project.title} />
        </div>
        <h4>{project.title}</h4>
        <p>{project.description}</p>
      </div>
    ))}
  </div>
</div>

      <div className="about-section"></div>
    </motion.div>
  );
};

export default About;