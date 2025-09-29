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
        padding: "8px 16px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div style={{ color: "#b26a00", fontWeight: 600 }}>Режим редагування</div>
      <div>
        <button className="lang-btn" onClick={onSave} style={{ marginRight: '10px' }}>
          Зберегти
        </button>
        <button className="lang-btn" onClick={onLogout}>
          Вийти
        </button>
      </div>
    </div>
  );
};

export default AdminBar;
