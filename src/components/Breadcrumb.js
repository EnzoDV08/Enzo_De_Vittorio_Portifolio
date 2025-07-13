import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaChevronRight, FaFolderOpen, FaEnvelope, FaUser } from "react-icons/fa";

const routeMap = {
  "/about": { label: "About", icon: <FaUser className="breadcrumb-icon" /> },
  "/projects": { label: "Projects", icon: <FaFolderOpen className="breadcrumb-icon" /> },
  "/contact": { label: "Contact", icon: <FaEnvelope className="breadcrumb-icon" /> },
};

const Breadcrumb = () => {
  const location = useLocation();
  const route = routeMap[location.pathname];

  if (!route) return null; // No breadcrumb on home

  return (
    <div className="breadcrumb-container">
      <Link to="/" className="breadcrumb-link">
        <FaHome className="breadcrumb-icon" /> Home
      </Link>
      <FaChevronRight className="breadcrumb-separator" />
      <span className="breadcrumb-active">
        {route.icon} {route.label}
      </span>
    </div>
  );
};

export default Breadcrumb;