import React from "react";
import "./HomeScreen.css";
import LanguageSelector from "./LanguageSelector";

const HomeScreen = ({ language, onLanguageChange, onGoToMenu }) => {
  const content = {
    uk: {
      greeting: "Вітаємо в ресторані Тамада",
      description: "Відчуйте справжню атмосферу Грузії та смак автентичних страв в серці міста. Наші кухарі готують за традиційними рецептами поколінь, використовуючи якісні інгредієнти та свіжі продукти.",
      menuButton: "Переглянути меню",
      atmosphere: "Теплота грузинської гостинності",
      quality: "Якість та автентичність"
    },
    en: {
      greeting: "Welcome to Tamada Restaurant",
      description: "Experience the authentic atmosphere of Georgia and taste traditional dishes in the heart of the city. Our chefs cook according to age-old recipes using quality ingredients and fresh products.",
      menuButton: "View Menu",
      atmosphere: "Warmth of Georgian hospitality",
      quality: "Quality and authenticity"
    }
  };

  const currentContent = content[language] || content.uk;

  return (
    <div className="home-screen">
      <div className="home-content">
        <h1>Вітаємо в ресторані</h1>
        <h2>Тамада</h2>
        <div className="decorative-line"></div>
        
        <p>{currentContent.description}</p>

        <div className="language-selector">
          <LanguageSelector 
            language={language} 
            onLanguageChange={onLanguageChange} 
          />
        </div>
        
        <button className="menu-button" onClick={onGoToMenu}>
          {currentContent.menuButton}
        </button>
      </div>
    </div>
  );
};

export default HomeScreen;
