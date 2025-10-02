import React from "react";
import "./Header.css";

const Header = ({ isVisible }) => {
  return (
    <div className={`header ${!isVisible ? 'header-hidden' : ''}`}>
      <img
        src="/header.png"
        alt="ТАМАДА Грузинський ресторан"
        className="header-logo"
      />
    </div>
  );
};

export default Header;
