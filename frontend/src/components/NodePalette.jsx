import React, { useState } from 'react';
import { NODE_CATEGORIES } from '../utils/nodeTypes';
import { getIcon } from '../utils/icons';

export default function NodePalette() {
  const [collapsed, setCollapsed] = useState({});

  const toggleCategory = (key) => {
    setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const onDragStart = (event, type, subtype, subtypeInfo) => {
    const dragData = JSON.stringify({ type, subtype, icon: subtypeInfo.icon });
    event.dataTransfer.setData('application/reactflow', dragData);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="node-palette">
      <div className="palette-header">Components</div>
      {Object.entries(NODE_CATEGORIES).map(([catKey, category]) => (
        <div key={catKey} className="palette-category">
          <div
            className="palette-category-header"
            onClick={() => toggleCategory(catKey)}
            style={{ borderLeftColor: category.color }}
          >
            <span className="palette-chevron">{collapsed[catKey] ? '\u25B6' : '\u25BC'}</span>
            <span>{category.label}</span>
          </div>
          {!collapsed[catKey] && (
            <div className="palette-items">
              {Object.entries(category.subtypes).map(([subKey, subInfo]) => (
                <div
                  key={subKey}
                  className="palette-item"
                  draggable
                  onDragStart={(e) => onDragStart(e, catKey, subKey, subInfo)}
                  title={subInfo.label}
                >
                  <span className="palette-item-icon" style={{ color: category.color }}>
                    {getIcon(subInfo.icon)}
                  </span>
                  <span className="palette-item-label">{subInfo.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
