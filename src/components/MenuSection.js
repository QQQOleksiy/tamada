import React, { useState } from "react";
import MenuItem from "./MenuItem";

const MenuSection = ({
  sectionKey,
  section,
  language,
  editable = false,
  menu,
  onMenuChange,
}) => {
  const [expandedDescriptions, setExpandedDescriptions] = useState({});

  const toggleDescription = (itemIndex) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [itemIndex]: !prev[itemIndex],
    }));
  };

  const getItemData = (item, language) => {
    if (language === "en" && item.en) {
      return item.en;
    }
    return item.uk || item.en || item;
  };

  const handleChangeItem = (idx, field, value) => {
    const updatedItems = [...section.items];
    const itemToUpdate = { ...updatedItems[idx] };

    const languageSpecificFields = ["name", "description"];

    if (languageSpecificFields.includes(field)) {
      // Оновлюємо поле для поточної мови
      const langKey = language === "en" ? "en" : "uk";
      if (!itemToUpdate[langKey]) {
        itemToUpdate[langKey] = {};
      }
      itemToUpdate[langKey][field] = value;
    } else {
      // Оновлюємо спільне поле (ціна, вага, зображення)
      itemToUpdate[field] = value;
      // Видаляємо це поле з мовних версій, якщо воно там було
      if (itemToUpdate.uk) delete itemToUpdate.uk[field];
      if (itemToUpdate.en) delete itemToUpdate.en[field];
    }

    updatedItems[idx] = itemToUpdate;

    const updatedMenu = {
      ...menu,
      [sectionKey]: {
        ...section,
        items: updatedItems,
      },
    };
    onMenuChange(updatedMenu);
  };

  const handleAddItem = () => {
    const newItem = {
      name: "",
      description: "",
      price: "",
      weight: "",
      uk: {
        name: "",
        description: "",
      },
      en: {
        name: "",
        description: "",
      },
    };

    const updatedItems = [...(section.items || []), newItem];

    const updatedMenu = {
      ...menu,
      [sectionKey]: {
        ...section,
        items: updatedItems,
      },
    };
    onMenuChange(updatedMenu);
  };

  const handleDeleteItem = (indexToDelete) => {
    const updatedItems = (section.items || []).filter(
      (_, index) => index !== indexToDelete
    );

    const updatedMenu = {
      ...menu,
      [sectionKey]: {
        ...section,
        items: updatedItems,
      },
    };
    onMenuChange(updatedMenu);
  };

  return (
    <div className="section" id={sectionKey}>
      <h2 className="section-title">
        {section?.title?.[language] || section?.title || sectionKey}
      </h2>

      {section?.note && (
        <p className="item-note">{section.note[language] || section.note}</p>
      )}

      {(section.items || []).map((item, index) => {
        const itemData = getItemData(item, language);
        const displayItem = { ...item, ...itemData };

        if (displayItem.name === undefined) return null;

        return (
          <MenuItem
            key={index}
            item={displayItem}
            index={index}
            isExpanded={expandedDescriptions[index]}
            onToggleDescription={() => toggleDescription(index)}
            language={language}
            editable={editable}
            onChange={(field, value) => handleChangeItem(index, field, value)}
            onDelete={() => handleDeleteItem(index)}
          />
        );
      })}

      {editable && (
        <button
          onClick={handleAddItem}
          style={{
            display: 'block',
            margin: '20px auto',
            padding: '12px 24px',
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '500',
            boxShadow: '0 2px 8px rgba(76, 175, 80, 0.3)',
            transition: 'all 0.2s ease',
            width: '100%',
            maxWidth: '300px'
          }}
          onMouseOver={(e) => {
            e.target.style.background = '#45a049';
            e.target.style.transform = 'translateY(-1px)';
          }}
          onMouseOut={(e) => {
            e.target.style.background = '#4CAF50';
            e.target.style.transform = 'translateY(0)';
          }}
        >
          + Додати страву
        </button>
      )}
    </div>
  );
};

export default MenuSection;
