import { motion } from "framer-motion";
import "../styles/About.css";
import profile from "../assets/profile.jpg";
import mockup1 from "../assets/MockUp1.png";
import mockup2 from "../assets/MockUp2.png";
import mockup3 from "../assets/MockUp3.png";
import mockup4 from "../assets/MockUp4.png";
import mockup5 from "../assets/MockUp5.png";
import mockup6 from "../assets/MockUp6.png";
import { FaGithub } from "react-icons/fa";
import React, { useEffect } from "react";
import { HiCheckBadge } from "react-icons/hi2"; 



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
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn, 
  FaPhoneAlt, 
  FaEnvelope,
} from "react-icons/fa";

import {
  SiTypescript,
  SiFirebase,
  SiDotnet,
  SiMongodb,
  SiElectron,
  SiVite,
  SiXampp,
  SiFlutter,
} from "react-icons/si";







const projects = [
  {
    title: "RentalFinder",
    description: "Car rental web app.",
    image: mockup1,
    github: "https://github.com/EnzoDV08/DV_200_Group2_Final?tab=readme-ov-file",
  },
  {
    title: "SuperStore",
    description: "E-commerce with Firebase.",
    image: mockup2,
    github: "https://github.com/EnzoDV08/SuperStore_DV200_Term_4.git",
  },
  {
    title: "Code Kids Academy",
    description: "Kids coding website.",
    image: mockup3,
    github: "https://github.com/EnzoDV08/CodeKidsAcademy_DV_200_Theory.git",
  },
  {
    title: "Real Estate Website",
    description: "Property listing system.",
    image: mockup4,
    github: "https://github.com/EnzoDV08/Enzo_De_Vittorio_231244_Term3-Final-Project.git",
  },
  {
    title: "Sportify",
    description: "Event & achievement app.",
    image: mockup5,
    github: "https://github.com/EnzoDV08/Sportify.git",
  },
  {
    title: "Escape Today",
    description: "Business promo platform.",
    image: mockup6,
    github: "https://github.com/EnzoDV5/Escape_Today.git",
  },
];


const About = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

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
  <div className="contact-item">
    <FaEnvelope className="contact-icon" />
    <a href="mailto:enzodevittorio@email.com">enzo.devittorio@email.com</a>
  </div>
  <div className="contact-item">
    <FaPhoneAlt className="contact-icon" />
    <a href="tel:+27612345678">+27 73 662 4471</a>
  </div>
  <div className="social-icons">
    <a href="https://www.facebook.com/enzo.devittorio" target="_blank" rel="noreferrer" className="social-link">
      <FaFacebookF />
    </a>
    <a href="https://www.instagram.com/enzo_devittorio/" target="_blank" rel="noreferrer" className="social-link">
      <FaInstagram />
    </a>
    <a href="https://www.linkedin.com" target="_blank" rel="noreferrer" className="social-link">
      <FaLinkedinIn />
    </a>
  </div>
</div>

  </div>
</div>

<div className="cv-fancy-container">
  {/* === Work Experience === */}
  <section className="cv-fancy-section">
    <h2 className="cv-fancy-heading">Work Experience</h2>

    <div className="cv-card">
      <div className="cv-job-title">Brand Promoter</div>
      <div className="cv-job-org">Various Campaigns</div>
      <p className="cv-job-desc">
        Represented major brands and engaged with the public during live events. Gained valuable communication and marketing skills.
      </p>
      <div className="cv-job-date">2020 – 2024</div>
    </div>

    <div className="cv-card">
      <div className="cv-job-title">Technician</div>
      <div className="cv-job-org">Vodacom Irene Mall</div>
      <p className="cv-job-desc">
        Diagnosed and resolved technical issues for mobile devices and network systems. Provided support with a customer-first focus.
      </p>
      <div className="cv-job-date">Nov 2023 – Jan 2024</div>
    </div>

    <div className="cv-card">
      <div className="cv-job-title">Freelance Web & App Developer</div>
      <div className="cv-job-org">Self-Employed</div>
      <p className="cv-job-desc">
        Built full-stack solutions using React, .NET, Firebase and PostgreSQL. Designed user-friendly interfaces in Figma and managed secure backend logic.
      </p>
      <div className="cv-job-date">2024 – Present</div>
    </div>
  </section>

  {/* === Interests === */}
  <section className="cv-fancy-section">
    <h2 className="cv-fancy-heading">Interests</h2>
    <div className="cv-tag-group">
      <span className="cv-tag">🤼 Wrestling</span>
      <span className="cv-tag">🏉 Rugby</span>
      <span className="cv-tag">🧗 Wall Climbing</span>
      <span className="cv-tag">🎮 Gaming</span>
      <span className="cv-tag">🎧 Music</span>
    </div>
  </section>

  {/* === Achievements === */}
  <section className="cv-fancy-section">
    <h2 className="cv-fancy-heading">Achievements</h2>
    <div className="cv-achievements-list">
      <div className="cv-achievement">
        <span>🏆</span> Hackathon Winner 2024
      </div>
      <div className="cv-achievement">
        <span>🥈</span> Top 10 Industrial Design Chandelier – 2023
      </div>
    </div>
  </section>
</div>




      <div className="stats-projects-wrapper">
  <div className="stats-columns">
    <h2 className="section-title">Skills Overview</h2> 
   {/* Front-End and Back-End */}
<div className="stats-wrapper">
  <div className="column">
    <h3>🧠 Front-End Development</h3>
    <ul className="skill-list">
      <li><FaHtml5 className="icon" /> HTML <HiCheckBadge className="check-icon" /></li>
      <li><FaCss3Alt className="icon" /> CSS <HiCheckBadge className="check-icon" /></li>
      <li><FaJs className="icon" /> JavaScript <HiCheckBadge className="check-icon" /></li>
      <li><SiTypescript className="icon" /> TypeScript <HiCheckBadge className="check-icon" /></li>
      <li><FaReact className="icon" /> React <HiCheckBadge className="check-icon" /></li>
      <li><SiVite className="icon" /> Vite <HiCheckBadge className="check-icon" /></li>
      <li><FaBootstrap className="icon" /> Bootstrap <HiCheckBadge className="check-icon" /></li>
      <li className="learning">
      <SiFlutter className="icon" /> Flutter <span className="learning-badge">Learning</span>
      </li>
    </ul>
  </div>

  <div className="column">
    <h3>🖥️ Back-End Development</h3>
    <ul className="skill-list">
      <li><FaPhp className="icon" /> PHP <HiCheckBadge className="check-icon" /></li>
      <li><FaTerminal className="icon" /> C# <HiCheckBadge className="check-icon" /></li>
      <li><SiDotnet className="icon" /> .NET <HiCheckBadge className="check-icon" /></li>
      <li><SiFirebase className="icon" /> Firebase <HiCheckBadge className="check-icon" /></li>
      <li><FaNodeJs className="icon" /> Node.js <HiCheckBadge className="check-icon" /></li>
      <li><SiElectron className="icon" /> Electron <HiCheckBadge className="check-icon" /></li>
    </ul>
  </div>
</div>

<div className="stats-wrapper">
  <div className="column">
    <h3>🗄️ Database Systems</h3>
    <ul className="skill-list">
      <li><FaDatabase className="icon" /> SQL (MySQL, PostgreSQL, MSSQL) <HiCheckBadge className="check-icon" /></li>
      <li><SiMongodb className="icon" /> NoSQL (MongoDB, Firebase) <HiCheckBadge className="check-icon" /></li>
      <li><SiXampp className="icon" /> Tools (pgAdmin4, XAMPP) <HiCheckBadge className="check-icon" /></li>
    </ul>
  </div>

  <div className="column">
    <h3>🎨 Design & Multimedia Tools</h3>
    <ul className="skill-list">
      <li><FaFigma className="icon" /> Figma <HiCheckBadge className="check-icon" /></li>
      <li><span className="icon">🅿</span> Adobe Photoshop <HiCheckBadge className="check-icon" /></li>
      <li><span className="icon">🔧</span> SolidWorks <HiCheckBadge className="check-icon" /></li>
      <li><span className="icon">🎚️</span> Reaper <HiCheckBadge className="check-icon" /></li>
    </ul>
  </div>
</div>
  </div>
  <div className="vertical-line"></div> {/* <HiCheckBadge className="check-icon" /> Replace incorrect className */}
<div className="tech-floating-wrapper"></div>
<div className="mini-projects-column">
  <h2 className="section-title1">Quick View</h2>
  
  <div className="mini-carousel">
  <div className="carousel-track">
  {[...projects, ...projects].map((project, index) => (
    <div className="mini-project-card" key={index}>
      <div className="mini-thumbnail">
        <img src={project.image} alt={project.title} />
      </div>
      <h4>{project.title}</h4>
      <p>{project.description}</p>
<a
  href={project.github}
  target="_blank"
  rel="noopener noreferrer"
  className="github-link"
>
  <FaGithub /> View on GitHub
</a>


    </div>
  ))}
</div>
  </div>
</div>
</div>

      
    </motion.div>
  );
};

export default About;