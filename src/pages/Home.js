import React from "react";
import { motion, useInView} from "framer-motion";
import "../styles/Home.css";
import Carousel from "../components/Carousel";
import {
  FaFacebookF, FaInstagram, FaLinkedinIn, FaGithub
} from "react-icons/fa";
import { LiaLaptopCodeSolid } from "react-icons/lia";  
import { BiDevices } from "react-icons/bi";  
import { MdDesignServices } from "react-icons/md"; 
import { IoCheckmarkSharp } from "react-icons/io5";  
import mockup1 from "../assets/MockUp1.png";
import mockup2 from "../assets/MockUp2.png"; 
import mockup3 from "../assets/MockUp3.png"; 
import mockup4 from "../assets/MockUp4.png"; 
import { Link } from "react-router-dom";

// ✅ Animation Fix (No More Framer Motion Errors)
const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease: "easeOut" } },
  hover: { scale: 1.05, transition: { duration: 0.4 } }
};

const projects = [
  {
    title: "RentalFinder",
    description: "RentalFinder is a car rental web app that integrates APIs and uses MongoDB for data storage, strengthening our backend development skills.",
    techStack: ["Figma", "React", "Node.js", "Bootstrap", "MongoDB", "HTML", "CSS", "JavaScript"],
    image: mockup1, 
    github: "https://github.com/EnzoDV08/DV_200_Group2_Final?tab=readme-ov-file"
  },
  {
    title: "SuperStore",
    description: "SuperStore is a React and Firebase e-commerce platform that connects buyers and sellers with secure payments and real-time order management.",
    techStack: ["Figma", "React", "Node.js", "Bootstrap", "Firebase", "HTML", "CSS", "JavaScript"],
    image: mockup2, // Add image path if available
    github: "https://github.com/EnzoDV08/SuperStore_DV200_Term_4.git"
  },
  {
    title: "Code Kids Academy",
    description: "This website showcases a coding school for kids aged 8–13, offering a 10-month curriculum in game development, web design, and more.",
    techStack: ["Figma", "HTML", "CSS"],
    image: mockup3, // Add image path if available
    github: "https://github.com/EnzoDV08/CodeKidsAcademy_DV_200_Theory.git"
  },
  {
    title: "Real Estate Website",
    description: "Welcome to the Real Estate Website, a platform for browsing, buying, selling, and managing property listings for both users and admins.",
    techStack: ["PHP", "MySQL", "HTML", "CSS", "JavaScript"],
    image: mockup4, // Add image path if available
    github: "https://github.com/EnzoDV08/Enzo_De_Vittorio_231244_Term3-Final-Project.git"
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
  <span className="intro-title">Hello! I'm <strong>Enzo De Vittorio</strong></span>
  <span className="divider">—</span>
  a passionate and dedicated developer with{" "}
  <span className="highlight">3 YEARS OF EXPERIENCE</span> building real-world projects.
  I love bringing creative ideas to life with clean code and great design.
</p>
<p>
  I have strong skills in <span className="highlight">FRONT-END</span> and{" "}
  <span className="highlight">BACK-END</span> development, with a focus on
  responsive layouts and user-friendly interfaces.
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
          <div className="social-icons1">
            <div className="social-line1"></div>
            <a href="https://www.facebook.com/enzo.devittorio" target="_blank" rel="noopener noreferrer" className="social-circle">
              <FaFacebookF />
            </a>
            <a href="https://www.instagram.com/enzo_devittorio/" target="_blank" rel="noopener noreferrer" className="social-circle">
              <FaInstagram />
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
              <li><IoCheckmarkSharp className="check-icon1" /> Front-End & Back-End Development</li>
              <li><IoCheckmarkSharp className="check-icon1" /> Database Management</li>
              <li><IoCheckmarkSharp className="check-icon1" /> API Development</li>
              <li><IoCheckmarkSharp className="check-icon1" /> Cloud & Deployment</li>
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
              <li><IoCheckmarkSharp className="check-icon1" /> Cross-Platform App Development</li>
              <li><IoCheckmarkSharp className="check-icon1" /> Android & iOS Apps</li>
              <li><IoCheckmarkSharp className="check-icon1" /> Desktop Software (Windows & Mac)</li>
              <li><IoCheckmarkSharp className="check-icon1" /> Performance Optimization</li>
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
              <li><IoCheckmarkSharp className="check-icon1" /> Wireframing & Prototyping</li>
              <li><IoCheckmarkSharp className="check-icon1" /> User Research & Experience</li>
              <li><IoCheckmarkSharp className="check-icon1" /> Figma & Adobe XD</li>
              <li><IoCheckmarkSharp className="check-icon1" /> Interactive UI Components</li>
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
