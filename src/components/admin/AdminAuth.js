import React, { useState } from "react";

const AdminAuth = ({ onSuccess }) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const expected = process.env.REACT_APP_ADMIN_CODE || "1234";
    if (code === expected) {
      onSuccess("ok");
    } else {
      setError("Невірний код");
    }
  };

  return (
    <div className="container" style={{ maxWidth: 480 }}>
      <h2 className="section-title">Адмін</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Введіть код"
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 8,
            border: "1px solid #ddd",
            marginBottom: 12,
          }}
        />
        {error && (
          <div className="item-note" style={{ marginBottom: 12 }}>
            {error}
          </div>
        )}
        <button className="expand-button" type="submit">
          Увійти
        </button>
      </form>
    </div>
  );
};

export default AdminAuth;
