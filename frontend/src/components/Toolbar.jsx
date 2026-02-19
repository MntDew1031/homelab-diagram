import React, { useState, useEffect } from 'react';

export default function Toolbar({
  currentDiagram,
  onNew,
  onOpen,
  onSave,
  onExport,
  onTemplate,
  diagrams,
  templates,
  dirty,
}) {
  const [showOpen, setShowOpen] = useState(false);
  const [showTemplate, setShowTemplate] = useState(false);

  return (
    <div className="toolbar">
      <div className="toolbar-left">
        <button className="toolbar-btn" onClick={onNew} title="New diagram">
          New
        </button>

        <div className="toolbar-dropdown-wrap">
          <button className="toolbar-btn" onClick={() => setShowOpen(!showOpen)}>
            Open
          </button>
          {showOpen && (
            <div className="toolbar-dropdown" onMouseLeave={() => setShowOpen(false)}>
              {diagrams.length === 0 ? (
                <div className="toolbar-dropdown-item disabled">No diagrams</div>
              ) : (
                diagrams.map((d) => (
                  <div
                    key={d.id}
                    className="toolbar-dropdown-item"
                    onClick={() => {
                      onOpen(d.id);
                      setShowOpen(false);
                    }}
                  >
                    {d.name}
                    <span className="toolbar-dropdown-meta">
                      {d.node_count} nodes
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <button className="toolbar-btn" onClick={onSave} title="Save diagram">
          Save{dirty ? ' *' : ''}
        </button>

        <button className="toolbar-btn" onClick={onExport} title="Export as JSON">
          Export
        </button>

        <div className="toolbar-dropdown-wrap">
          <button className="toolbar-btn" onClick={() => setShowTemplate(!showTemplate)}>
            Templates
          </button>
          {showTemplate && (
            <div className="toolbar-dropdown" onMouseLeave={() => setShowTemplate(false)}>
              {templates.map((t) => (
                <div
                  key={t.id}
                  className="toolbar-dropdown-item"
                  onClick={() => {
                    onTemplate(t.id);
                    setShowTemplate(false);
                  }}
                >
                  {t.name}
                  <span className="toolbar-dropdown-meta">{t.description}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="toolbar-center">
        {currentDiagram ? (
          <span className="toolbar-title">{currentDiagram.name}</span>
        ) : (
          <span className="toolbar-title muted">No diagram open</span>
        )}
      </div>

      <div className="toolbar-right">
        <span className="toolbar-brand">Homelab Diagram</span>
      </div>
    </div>
  );
}
