import React from "react";

const FloatingLanguageButton = ({ language, onLanguageChange }) => {
  const toggleLanguage = () => {
    onLanguageChange(language === "uk" ? "en" : "uk");
  };

  return (
    <button
      onClick={toggleLanguage}
      style={{
        position: "fixed",
        bottom: "20px",
        left: "20px",
        zIndex: 1000,
        background: "#2a2a2a",
        color: "#e0e0e0",
        border: "1px solid #444",
        borderRadius: "8px",
        padding: "12px 20px",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: 500,
        transition: "all 0.2s ease",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        minWidth: "60px",
      }}
      onMouseOver={(e) => {
        e.target.style.background = "#3a3a3a";
        e.target.style.borderColor = "#555";
        e.target.style.transform = "translateY(-2px)";
        e.target.style.boxShadow = "0 6px 16px rgba(0, 0, 0, 0.4)";
      }}
      onMouseOut={(e) => {
        e.target.style.background = "#2a2a2a";
        e.target.style.borderColor = "#444";
        e.target.style.transform = "translateY(0)";
        e.target.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.3)";
      }}
    >
      {language === "uk" ? "EN" : "УК"}
    </button>
  );
};

export default FloatingLanguageButton;

