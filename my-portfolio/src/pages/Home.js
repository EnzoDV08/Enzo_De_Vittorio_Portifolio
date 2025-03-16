import React from "react";
import { motion, useInView} from "framer-motion";
import "../styles/Home.css";
import Carousel from "../components/Carousel";
import {
  FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn, FaGithub
} from "react-icons/fa";
import { LiaLaptopCodeSolid } from "react-icons/lia";  
import { BiDevices } from "react-icons/bi";  
import { MdDesignServices } from "react-icons/md"; 
import { IoCheckmarkSharp } from "react-icons/io5";  
import mockup1 from "../assets/mockup1.png"; 
import mockup2 from "../assets/Mockup2.jpg"; 
import mockup3 from "../assets/Mockup3.avif"; 
import mockup4 from "../assets/Mockup3.webp"; 
import { Link } from "react-router-dom";


// ✅ Animation Fix (No More Framer Motion Errors)
const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease: "easeOut" } },
  hover: { scale: 1.05, transition: { duration: 0.4 } }
};

const projects = [
  {
    title: "E-Commerce Website",
    description: "Developed a fully functional e-commerce platform using React and Node.js, complete with user authentication.",
    techStack: ["React", "Node.js"],
    image: mockup1, 
    github: "https://github.com/yourusername/ecommerce-project"
  },
  {
    title: "Portfolio Website",
    description: "Designed and built a sleek personal portfolio showcasing skills, projects, and achievements.",
    techStack: ["UX/UI Design", "React", "Node.js"],
    image: mockup2, // Add image path if available
    github: "https://github.com/yourusername/portfolio-project"
  },
  {
    title: "Jewelry Website",
    description: "I created a dynamic Jewelry Website using React for the frontend and Node.js for the backend.",
    techStack: ["Prototypes", "React", "Node.js"],
    image: mockup3, // Add image path if available
    github: "https://github.com/yourusername/jewelry-website"
  },
  {
    title: "Restaurant Website",
    description: "Crafted a responsive website for a local restaurant, emphasizing user-friendly navigation.",
    techStack: ["React", "Node.js"],
    image: mockup4, // Add image path if available
    github: "https://github.com/yourusername/restaurant-website"
  },
];

const Home = () => {
  const introRef = React.useRef(null);
  const isIntroInView = useInView(introRef, { once: true, margin: "-100px" });

  const socialRef = React.useRef(null);
  const isSocialInView = useInView(socialRef, { once: true, margin: "-100px" });

  const skillsRef = React.useRef(null);
  const isSkillsInView = useInView(skillsRef, { once: true, margin: "-100px" });

  const projectsRef = React.useRef(null);
  const isProjectsInView = useInView(projectsRef, { once: true, margin: "-100px" });


  return (
    <div className="home">
      
      {/* ✅ Carousel Section */}
      <Carousel />

      {/* ✅ Introduction Section */}
      <motion.div
        ref={introRef}
        className="intro-section"
        initial={{ opacity: 0, y: 80 }}
        animate={isIntroInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
      >
        <p>
          <span className="wave">👋</span>
          <span className="intro-title">Hello! I'm <strong>Enzo de Vittorio</strong></span>
          <span className="divider">—</span>
          a creative and driven web developer with{" "}
          <span className="highlight">3 YEARS OF EXPERIENCE</span> in the field.
          I thrive on turning imaginative ideas into digital realities, constantly seeking
          innovative ways to blend design and technology.
        </p>
        <p>
          I possess a strong foundation in <span className="highlight">FRONT-END</span> and{" "}
          <span className="highlight">BACK-END</span> development, as well as a keen eye
          for responsive design and user-centered interfaces.
        </p>
      </motion.div>

      {/* ✅ Social Media Follow Section */}
      <motion.div
        ref={socialRef}
        className="social-section"
        initial={{ opacity: 0, y: 50 }}
        animate={isSocialInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
      >
        <div className="social-wrapper">
          <p className="social-title">Follow Me:</p>
          <div className="social-icons">
            <div className="social-line1"></div>
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="social-circle">
              <FaFacebookF />
            </a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="social-circle">
              <FaInstagram />
            </a>
            <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="social-circle">
              <FaTwitter />
            </a>
            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="social-circle">
              <FaLinkedinIn />
            </a>
          </div>
        </div>
        <motion.div
          className="social-line"
          initial={{ width: "0px" }}
          animate={{ width: "400px" }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
        ></motion.div>
      </motion.div>

      {/* ✅ Skills Section */}
      <motion.div
        ref={skillsRef}
        className="skills-section"
        initial="hidden"
        animate={isSkillsInView ? "visible" : "hidden"}
      >
        <h2 className="skills-title">🚀 My Expertise</h2>
        <div className="skills-grid">
          
          {/* ✅ Full Stack Development */}
          <motion.div
            className="skill-box highlighted"
            variants={cardVariants}
            whileHover="hover"
          >
            <LiaLaptopCodeSolid className="skill-icon" />
            <h3>Full-Stack Development</h3>
            <p>I build modern, scalable web applications.</p>
            <ul>
              <li><IoCheckmarkSharp className="check-icon" /> Front-End & Back-End Development</li>
              <li><IoCheckmarkSharp className="check-icon" /> Database Management</li>
              <li><IoCheckmarkSharp className="check-icon" /> API Development</li>
              <li><IoCheckmarkSharp className="check-icon" /> Cloud & Deployment</li>
            </ul>
          </motion.div>

          {/* ✅ Mobile & Desktop Apps */}
          <motion.div
            className="skill-box"
            variants={cardVariants}
            whileHover="hover"
          >
            <BiDevices className="skill-icon" />
            <h3>Mobile & Desktop Apps</h3>
            <p>I develop applications for both mobile and desktop environments.</p>
            <ul>
              <li><IoCheckmarkSharp className="check-icon" /> Cross-Platform App Development</li>
              <li><IoCheckmarkSharp className="check-icon" /> Android & iOS Apps</li>
              <li><IoCheckmarkSharp className="check-icon" /> Desktop Software (Windows & Mac)</li>
              <li><IoCheckmarkSharp className="check-icon" /> Performance Optimization</li>
            </ul>
          </motion.div>

          {/* ✅ UI/UX Design */}
          <motion.div
            className="skill-box"
            variants={cardVariants}
            whileHover="hover"
          >
            <MdDesignServices className="skill-icon" />
            <h3>UI/UX & Design</h3>
            <p>I create visually engaging and user-friendly interfaces.</p>
            <ul>
              <li><IoCheckmarkSharp className="check-icon" /> Wireframing & Prototyping</li>
              <li><IoCheckmarkSharp className="check-icon" /> User Research & Experience</li>
              <li><IoCheckmarkSharp className="check-icon" /> Figma & Adobe XD</li>
              <li><IoCheckmarkSharp className="check-icon" /> Interactive UI Components</li>
            </ul>
          </motion.div>

        </div>
      </motion.div>

{/* ✅ Projects Section (Updated) */}
<motion.div ref={projectsRef} className="projects-container" initial="hidden" animate={isProjectsInView ? "visible" : "hidden"}>
  <h2 className="projects-heading">🚀 Development Projects</h2>
  <div className="projects-wrapper">
    {projects.map((project, index) => (
      <motion.div key={index} className="project-item" variants={cardVariants} whileHover="hover">
        <div className="project-thumbnail">
          {project.image ? (
            <img src={project.image} alt={project.title} />
          ) : (
            <div className="image-placeholder">Image Unavailable</div>
          )}
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

  {/* ✅ New Animated View All Button */}
  <div className="view-all-container">
     <Link to="/projects" className="view-all-btn">
            <span className="view-text">View All Projects</span>
            <span className="arrow-box">
              <span className="arrow-icon">→</span>
            </span>
          </Link>
  </div>
</motion.div>





    </div>
  );
};

export default Home;
