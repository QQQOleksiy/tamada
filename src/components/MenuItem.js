import React from "react";

const MenuItem = ({
  item,
  index,
  isExpanded,
  onToggleDescription,
  language,
  editable = false,
  onChange,
  onDelete,
}) => {
  const isLongDescription = item.description && item.description.length > 100;

  const handleInputFocus = (e) => {
    // Якщо поле містить placeholder текст, очищаємо його при фокусі
    const placeholderTexts = {
      name: "Назва страви",
      description: "Опис страви...",
      price: "0",
      weight: "0",
      note: "Нотатки..."
    };
    
    const fieldType = e.target.className.split(' ')[0].replace('item-', '');
    const placeholder = placeholderTexts[fieldType];
    
    if (placeholder && e.target.value === placeholder) {
      e.target.value = "";
      onChange?.(fieldType, "");
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Конвертуємо файл в base64 для Cloudinary
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const response = await fetch('/api/upload-image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ image: event.target.result }),
        });

        if (!response.ok) {
          throw new Error('Image upload failed');
        }

        const data = await response.json();
        onChange?.('image', data.filePath);
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Помилка завантаження зображення: ' + error.message);
      }
    };
    
    reader.readAsDataURL(file);
  };

  return (
    <div className="menu-item">
      <div className="menu-content">
        <div className="item-header">
          {editable ? (
            <input
              className="item-name"
              value={item.name || ""}
              onChange={(e) => onChange?.("name", e.target.value)}
              onFocus={handleInputFocus}
              placeholder="Назва страви"
              style={{ 
                border: "1px solid #ddd", 
                borderRadius: 6, 
                padding: "8px 12px",
                color: "#333",
                backgroundColor: "#fff",
                fontSize: "16px",
                width: "100%",
                boxSizing: "border-box"
              }}
            />
          ) : (
            <div className="item-name">{item.name}</div>
          )}
          <div className="item-price-wrapper">
            {editable ? (
              <>
                <input
                  type="number"
                  className="item-price"
                  value={(item.price || "").replace(/₴/g, "")}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, "");
                    if (value === "") {
                      onChange?.("price", "");
                    } else {
                      onChange?.("price", parseInt(value, 10).toString() + "₴");
                    }
                  }}
                  onFocus={handleInputFocus}
                  placeholder="0"
                  style={{
                    border: "1px solid #ddd",
                    borderRadius: "6px 0 0 6px",
                    padding: "8px 12px",
                    width: '100px',
                    color: "#333",
                    backgroundColor: "#fff",
                    fontSize: "16px",
                    boxSizing: "border-box"
                  }}
                />
                <span className="static-symbol">₴</span>
              </>
            ) : (
              item.price && (
                <div className="item-price">
                  {item.price.includes('₴') ? item.price : item.price + '₴'}
                </div>
              )
            )}
          </div>
        </div>

        {editable ? (
          <textarea
            className="item-description"
            value={item.description || ""}
            onChange={(e) => onChange?.("description", e.target.value)}
            onFocus={handleInputFocus}
            placeholder="Опис страви..."
            rows={4}
            style={{ 
              border: "1px solid #ddd", 
              borderRadius: 6, 
              padding: "8px 12px",
              color: "#333",
              backgroundColor: "#fff",
              fontSize: "16px",
              width: "100%",
              boxSizing: "border-box",
              resize: "vertical",
              minHeight: "80px"
            }}
          />
        ) : (
          item.description && (
            <div
              className={`item-description ${
                isLongDescription && !isExpanded ? "collapsed" : ""
              }`}
            >
              {item.description}
            </div>
          )
        )}

        {isLongDescription && !editable && (
          <button className="expand-button" onClick={onToggleDescription}>
            {isExpanded ? "Показати менше" : "Показати більше"}
          </button>
        )}

        <div className="item-details">
          <div className="item-weight-wrapper">
            {editable ? (
              <>
                <input
                  type="number"
                  className="item-weight"
                  value={(item.weight || "").toString().replace(/[^0-9]/g, "")}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, "");
                    if (value === "") {
                      onChange?.("weight", "");
                    } else {
                      onChange?.(
                        "weight",
                        parseInt(value, 10).toString() + "г"
                      );
                    }
                  }}
                  onFocus={handleInputFocus}
                  placeholder="0"
                  style={{
                    border: "1px solid #ddd",
                    borderRadius: "6px 0 0 6px",
                    padding: "6px 8px",
                    width: '80px',
                    color: "#333",
                    backgroundColor: "#fff",
                    fontSize: "16px",
                    boxSizing: "border-box"
                  }}
                />
                <span className="static-symbol">г</span>
              </>
            ) : (
              item.weight && (
                <span className="item-weight">
                  {item.weight.includes('г') ? item.weight : item.weight + 'г'}
                </span>
              )
            )}
          </div>
          {editable ? (
            <input
              className="item-note"
              value={item.note || ""}
              onChange={(e) => onChange?.("note", e.target.value)}
              onFocus={handleInputFocus}
              placeholder="Нотатки..."
              style={{
                border: "1px solid #ffd6d6",
                borderRadius: 6,
                padding: "6px 8px",
                color: "#333",
                backgroundColor: "#fff",
                fontSize: "14px",
                width: "100%",
                boxSizing: "border-box",
                maxWidth: "200px"
              }}
            />
          ) : (
            item.note && <span className="item-note">{item.note}</span>
          )}
        </div>
      </div>

      <div className="menu-image">
        {editable ? (
          <label style={{ cursor: 'pointer' }}>
            <img src={item.image || "/image.png"} alt={item.name} />
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleImageUpload}
            />
          </label>
        ) : (
          <img src={item.image || "/image.png"} alt={item.name} />
        )}
        {editable && (
          <button
            onClick={onDelete}
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              background: '#ff4d4d',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '28px',
              height: '28px',
              cursor: 'pointer',
              fontSize: '18px',
              lineHeight: '28px',
              textAlign: 'center',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
              zIndex: 10,
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.background = '#e63939';
              e.target.style.transform = 'scale(1.1)';
            }}
            onMouseOut={(e) => {
              e.target.style.background = '#ff4d4d';
              e.target.style.transform = 'scale(1)';
            }}
          >
            &times;
          </button>
        )}
      </div>
    </div>
  );
};

export default MenuItem;
