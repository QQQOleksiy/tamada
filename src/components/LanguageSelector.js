import React from "react";
import "./LanguageSelector.css";

const LanguageSelector = ({ language, onLanguageChange }) => {
  return (
    <div className="language-selector">
      <button
        className={`lang-btn ${language === "uk" ? "active" : ""}`}
        onClick={() => onLanguageChange("uk")}
      >
        УК
      </button>
      <button
        className={`lang-btn ${language === "en" ? "active" : ""}`}
        onClick={() => onLanguageChange("en")}
      >
        EN
      </button>
    </div>
  );
};

export default LanguageSelector;
