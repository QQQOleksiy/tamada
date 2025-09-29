import React from "react";
import "./Navigation.css";

const Navigation = ({
  sections,
  activeSection,
  onSectionChange,
  language,
  onLanguageChange,
}) => {
  return (
    <nav className="nav">
      <div className="nav-scroll">
        {sections.map((s) => (
          <button
            key={s.key}
            className={`nav-item ${activeSection === s.key ? "active" : ""}`}
            onClick={() => onSectionChange(s.key)}
          >
            {s.title}
          </button>
        ))}
      </div>
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
    </nav>
  );
};

export default Navigation;
