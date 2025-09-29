import React, { useState, useEffect } from "react";
import "./App.css";
import Header from "./components/Header";
import Navigation from "./components/Navigation";
import MenuSection from "./components/MenuSection";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import AdminAuth from "./components/admin/AdminAuth";
import AdminBar from "./components/admin/AdminBar";

function App() {
  const [activeSection, setActiveSection] = useState("side_dishes");
  const [language, setLanguage] = useState("uk");
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const loadMenu = async () => {
      try {
        const res = await fetch("/api/load-menu");
        const json = await res.json();
        
        if (!json.success) {
          throw new Error(json.error || 'Failed to load menu');
        }
        
        let menuData = json.menu || {};
        // Додаткова перевірка, щоб виправити можливу помилку вкладеності
        if (menuData.menu) {
          menuData = menuData.menu;
        }
        
        setMenu(menuData);
        const keys = Object.keys(menuData);
        if (keys.length) setActiveSection(keys[0]);
      } catch (e) {
        console.error('Error loading menu:', e);
        setError("Не вдалося завантажити меню: " + e.message);
      } finally {
        setLoading(false);
      }
    };
    loadMenu();
  }, []);

  const handleMenuChange = (updatedMenu) => {
    setMenu(updatedMenu);
  };

  const handleMenuSave = async () => {
    try {
      // Перевіряємо, чи не обгорнуте меню в зайвий об'єкт "menu"
      const dataToSend = menu.menu ? menu.menu : menu;
      const response = await fetch('/api/save-menu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Network response was not ok');
      }
      
      alert('Меню успішно збережено!');
    } catch (error) {
      console.error('Error saving menu:', error);
      alert('Помилка при збереженні меню: ' + error.message);
    }
  };

  const sections = menu
    ? Object.entries(menu).map(([key, value]) => ({
        key,
        title: value?.title?.[language] || value?.title || key,
      }))
    : [];

  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
  };

  useEffect(() => {
    const token = localStorage.getItem("tm_admin_token");
    setIsAdmin(Boolean(token));
  }, []);

  const handleAdminLogin = (token) => {
    localStorage.setItem("tm_admin_token", token);
    setIsAdmin(true);
    navigate("/admin");
  };

  const handleAdminLogout = () => {
    localStorage.removeItem("tm_admin_token");
    setIsAdmin(false);
    navigate("/");
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll(".section");
      let currentSection = "";
      let minDistance = Infinity;

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const distance = Math.abs(rect.top - 120);

        if (rect.top <= 120 && rect.bottom >= 120) {
          currentSection = section.id;
        } else if (distance < minDistance && rect.top <= 120) {
          minDistance = distance;
          currentSection = section.id;
        }
      });

      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    let scrollTimeout;
    const throttledScroll = () => {
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      scrollTimeout = setTimeout(handleScroll, 10);
    };

    window.addEventListener("scroll", throttledScroll);
    return () => {
      window.removeEventListener("scroll", throttledScroll);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, []);

  return (
    <div className="App">
      <Header />
      <Routes>
        <Route
          path="/"
          element={
            <>
              {!loading && !error && (
                <Navigation
                  sections={sections}
                  activeSection={activeSection}
                  onSectionChange={handleSectionChange}
                  language={language}
                  onLanguageChange={handleLanguageChange}
                />
              )}
              <div className="container">
                {loading && <div>Завантаження...</div>}
                {error && <div>{error}</div>}
                {!loading &&
                  !error &&
                  sections.map(({ key }) => (
                    <MenuSection
                      key={key}
                      sectionKey={key}
                      section={menu[key]}
                      language={language}
                      editable={false}
                    />
                  ))}
              </div>
            </>
          }
        />
        <Route
          path="/admin"
          element={
            isAdmin ? (
              <>
                {!loading && !error && (
                  <Navigation
                    sections={sections}
                    activeSection={activeSection}
                    onSectionChange={handleSectionChange}
                    language={language}
                    onLanguageChange={handleLanguageChange}
                  />
                )}
                <AdminBar onLogout={handleAdminLogout} onSave={handleMenuSave} />
                <div className="container">
                  {loading && <div>Завантаження...</div>}
                  {error && <div>{error}</div>}
                  {!loading &&
                    !error &&
                    sections.map(({ key }) => (
                      <MenuSection
                        key={key}
                        sectionKey={key}
                        section={menu[key]}
                        language={language}
                        editable={true}
                        menu={menu}
                        onMenuChange={handleMenuChange}
                      />
                    ))}
                </div>
              </>
            ) : (
              <AdminAuth onSuccess={handleAdminLogin} />
            )
          }
        />
      </Routes>
    </div>
  );
}

export default App;
