import React, { useEffect, useRef } from "react";
import "./Navigation.css";

const Navigation = ({
  sections,
  activeSection,
  onSectionChange,
  language,
  onLanguageChange,
}) => {
  const navScrollRef = useRef(null);

  useEffect(() => {
    if (navScrollRef.current) {
      const activeButton = navScrollRef.current.querySelector('.nav-item.active');
      if (activeButton) {
        const container = navScrollRef.current;
        const buttonRect = activeButton.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        
        // Check if button is visible in container
        if (buttonRect.left < containerRect.left || buttonRect.right > containerRect.right) {
          // Scroll to center the active button
          const scrollLeft = activeButton.offsetLeft - (container.offsetWidth / 2) + (activeButton.offsetWidth / 2);
          container.scrollTo({
            left: Math.max(0, scrollLeft),
            behavior: 'smooth'
          });
        }
      }
    }
  }, [activeSection]);

  return (
    <nav className="nav">
      <div className="nav-scroll" ref={navScrollRef}>
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
    </nav>
  );
};

export default Navigation;
