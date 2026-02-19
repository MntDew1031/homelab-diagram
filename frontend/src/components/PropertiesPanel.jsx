import React, { useState, useEffect, useCallback } from 'react';
import { NODE_CATEGORIES, PROPERTY_FIELDS } from '../utils/nodeTypes';

export default function PropertiesPanel({ selectedNode, onNodeUpdate, onNodeDelete }) {
  const [localData, setLocalData] = useState(null);

  useEffect(() => {
    if (selectedNode) {
      setLocalData({
        label: selectedNode.data.label || '',
        description: selectedNode.data.description || '',
        custom_properties: { ...(selectedNode.data.custom_properties || {}) },
      });
    } else {
      setLocalData(null);
    }
  }, [selectedNode?.id, selectedNode?.data]);

  const handleFieldChange = useCallback(
    (field, value) => {
      setLocalData((prev) => {
        const updated = { ...prev, [field]: value };
        onNodeUpdate(selectedNode.id, updated);
        return updated;
      });
    },
    [selectedNode?.id, onNodeUpdate]
  );

  const handlePropChange = useCallback(
    (key, value) => {
      setLocalData((prev) => {
        const updated = {
          ...prev,
          custom_properties: { ...prev.custom_properties, [key]: value },
        };
        onNodeUpdate(selectedNode.id, updated);
        return updated;
      });
    },
    [selectedNode?.id, onNodeUpdate]
  );

  const handleAddProperty = useCallback(() => {
    const key = prompt('Property name:');
    if (key && key.trim()) {
      handlePropChange(key.trim(), '');
    }
  }, [handlePropChange]);

  const handleRemoveProperty = useCallback(
    (key) => {
      setLocalData((prev) => {
        const newProps = { ...prev.custom_properties };
        delete newProps[key];
        const updated = { ...prev, custom_properties: newProps };
        onNodeUpdate(selectedNode.id, updated);
        return updated;
      });
    },
    [selectedNode?.id, onNodeUpdate]
  );

  if (!selectedNode || !localData) {
    return (
      <div className="properties-panel">
        <div className="panel-header">Properties</div>
        <div className="panel-empty">Select a node to edit properties</div>
      </div>
    );
  }

  const nodeType = selectedNode.data._nodeType;
  const nodeSubtype = selectedNode.data._nodeSubtype;
  const category = NODE_CATEGORIES[nodeType];
  const fields = PROPERTY_FIELDS[nodeType]?.[nodeSubtype] || [];

  return (
    <div className="properties-panel">
      <div className="panel-header">
        Properties
        {category && (
          <span className="panel-badge" style={{ backgroundColor: category.color }}>
            {category.subtypes[nodeSubtype]?.label || nodeSubtype}
          </span>
        )}
      </div>

      <div className="panel-section">
        <label className="panel-label">Label</label>
        <input
          className="panel-input"
          value={localData.label}
          onChange={(e) => handleFieldChange('label', e.target.value)}
        />
      </div>

      <div className="panel-section">
        <label className="panel-label">Description</label>
        <textarea
          className="panel-textarea"
          value={localData.description}
          onChange={(e) => handleFieldChange('description', e.target.value)}
          rows={2}
        />
      </div>

      {fields.length > 0 && (
        <div className="panel-section">
          <div className="panel-section-title">Type Properties</div>
          {fields.map((field) => (
            <div key={field} className="panel-field">
              <label className="panel-label">{field.replace(/_/g, ' ')}</label>
              <input
                className="panel-input"
                value={localData.custom_properties[field] ?? ''}
                onChange={(e) => handlePropChange(field, e.target.value)}
                placeholder={field}
              />
            </div>
          ))}
        </div>
      )}

      <div className="panel-section panel-delete-section">
        <button
          className="panel-delete-btn"
          onClick={() => onNodeDelete(selectedNode.id)}
        >
          Delete Node
        </button>
      </div>

      <div className="panel-section">
        <div className="panel-section-title">
          Custom Properties
          <button className="panel-add-btn" onClick={handleAddProperty} title="Add property">
            +
          </button>
        </div>
        {Object.entries(localData.custom_properties)
          .filter(([key]) => !fields.includes(key))
          .map(([key, value]) => (
            <div key={key} className="panel-field panel-field-custom">
              <label className="panel-label">{key}</label>
              <div className="panel-field-row">
                <input
                  className="panel-input"
                  value={String(value)}
                  onChange={(e) => handlePropChange(key, e.target.value)}
                />
                <button
                  className="panel-remove-btn"
                  onClick={() => handleRemoveProperty(key)}
                  title="Remove"
                >
                  x
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
