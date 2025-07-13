import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Footer from "./components/Footer";
import Breadcrumb from "./components/Breadcrumb";
import Home from "./pages/Home";
import About from "./pages/About";
import Projects from "./pages/Projects";
import "./styles/global.css";

function App() {
  const location = useLocation();

  return (
    <>
  
     

      <Navbar />

      {location.pathname !== "/" && <Breadcrumb />}
      {location.pathname !== "/projects" && location.pathname !== "/about" && <Hero />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<Projects />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
