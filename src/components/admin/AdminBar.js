import React from "react";

const AdminBar = ({ onLogout, onSave }) => {
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
        gap: "8px",
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
        gap: "8px",
        flexWrap: "wrap",
        justifyContent: "flex-end"
      }}>
        <button 
          className="lang-btn" 
          onClick={onSave} 
          style={{ 
            fontSize: "14px",
            padding: "8px 16px",
            minWidth: "80px"
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
            minWidth: "80px"
          }}
        >
          Вийти
        </button>
      </div>
    </div>
  );
};

export default AdminBar;
