import React from "react";

const AdminBar = ({ onLogout, onSave, language, onLanguageChange }) => {
  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 200,
        background: "#fff3e0",
        borderBottom: "1px solid #ffd6a6",
        padding: "12px 16px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "12px",
      }}
    >
      <div style={{ 
        color: "#b26a00", 
        fontWeight: 600,
        fontSize: "14px",
        flex: "1 1 auto",
        minWidth: "120px"
      }}>
        Режим редагування
      </div>
      <div style={{
        display: "flex",
        gap: "12px",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "flex-end"
      }}>
        <div style={{
          display: "flex",
          gap: "8px",
          alignItems: "center"
        }}>
          <span style={{ 
            color: "#b26a00", 
            fontSize: "13px",
            marginRight: "4px",
            whiteSpace: "nowrap"
          }}>
            Мова меню:
          </span>
          <div style={{
            display: "flex",
            gap: "6px"
          }}>
            <button
              onClick={() => onLanguageChange("uk")}
              style={{
                background: language === "uk" ? "#ff9800" : "#fff",
                color: language === "uk" ? "#fff" : "#b26a00",
                border: "1px solid #ff9800",
                borderRadius: "6px",
                padding: "6px 14px",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: language === "uk" ? 600 : 400,
                transition: "all 0.2s ease",
                whiteSpace: "nowrap"
              }}
              onMouseOver={(e) => {
                if (language !== "uk") {
                  e.target.style.background = "#fff3e0";
                }
              }}
              onMouseOut={(e) => {
                if (language !== "uk") {
                  e.target.style.background = "#fff";
                }
              }}
            >
              УК
            </button>
            <button
              onClick={() => onLanguageChange("en")}
              style={{
                background: language === "en" ? "#ff9800" : "#fff",
                color: language === "en" ? "#fff" : "#b26a00",
                border: "1px solid #ff9800",
                borderRadius: "6px",
                padding: "6px 14px",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: language === "en" ? 600 : 400,
                transition: "all 0.2s ease",
                whiteSpace: "nowrap"
              }}
              onMouseOver={(e) => {
                if (language !== "en") {
                  e.target.style.background = "#fff3e0";
                }
              }}
              onMouseOut={(e) => {
                if (language !== "en") {
                  e.target.style.background = "#fff";
                }
              }}
            >
              EN
            </button>
          </div>
        </div>
        <button 
          className="lang-btn" 
          onClick={onSave} 
          style={{ 
            fontSize: "14px",
            padding: "8px 16px",
            minWidth: "80px",
            background: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: 500
          }}
        >
          Зберегти
        </button>
        <button 
          className="lang-btn" 
          onClick={onLogout}
          style={{ 
            fontSize: "14px",
            padding: "8px 16px",
            minWidth: "80px",
            background: "#f44336",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: 500
          }}
        >
          Вийти
        </button>
      </div>
    </div>
  );
};

export default AdminBar;
