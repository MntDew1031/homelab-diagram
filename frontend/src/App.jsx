import React, { useState, useCallback, useEffect } from 'react';
import { ReactFlowProvider, useNodesState, useEdgesState } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import DiagramCanvas from './components/DiagramCanvas';
import NodePalette from './components/NodePalette';
import PropertiesPanel from './components/PropertiesPanel';
import Toolbar from './components/Toolbar';
import { useDiagramApi } from './hooks/useDiagramApi';
import './styles/diagram.css';

function AppInner() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [currentDiagram, setCurrentDiagram] = useState(null);
  const [diagramList, setDiagramList] = useState([]);
  const [templateList, setTemplateList] = useState([]);
  const [dirty, setDirty] = useState(false);

  const api = useDiagramApi();

  const refreshDiagramList = useCallback(async () => {
    try {
      const list = await api.listDiagrams();
      setDiagramList(list);
    } catch (e) {
      console.error('Failed to load diagrams:', e);
    }
  }, [api]);

  const refreshTemplateList = useCallback(async () => {
    try {
      const list = await api.listTemplates();
      setTemplateList(list);
    } catch (e) {
      console.error('Failed to load templates:', e);
    }
  }, []);

  useEffect(() => {
    refreshDiagramList();
    refreshTemplateList();
  }, []);

  const diagramToFlow = useCallback((diagram) => {
    const flowNodes = diagram.nodes.map((n) => ({
      id: n.id,
      type: n.type,
      position: n.position,
      data: {
        label: n.data.label,
        description: n.data.description,
        custom_properties: n.data.custom_properties || {},
        _nodeType: n.type,
        _nodeSubtype: n.subtype,
        _icon: n.subtype,
      },
      ...(n.width ? { width: n.width } : {}),
      ...(n.height ? { height: n.height } : {}),
      ...(n.parent_id ? { parentId: n.parent_id } : {}),
      ...(n.style ? { style: n.style } : {}),
    }));

    const flowEdges = diagram.edges.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      ...(e.source_handle ? { sourceHandle: e.source_handle } : {}),
      ...(e.target_handle ? { targetHandle: e.target_handle } : {}),
      ...(e.label ? { label: e.label } : {}),
      ...(e.animated ? { animated: e.animated } : {}),
      ...(e.style ? { style: e.style } : {}),
    }));

    return { flowNodes, flowEdges };
  }, []);

  const flowToDiagram = useCallback(() => {
    if (!currentDiagram) return null;

    const diagramNodes = nodes.map((n) => ({
      id: n.id,
      type: n.type,
      subtype: n.data._nodeSubtype || n.type,
      position: { x: n.position.x, y: n.position.y },
      data: {
        label: n.data.label,
        description: n.data.description || '',
        custom_properties: n.data.custom_properties || {},
      },
      ...(n.width ? { width: n.width } : {}),
      ...(n.height ? { height: n.height } : {}),
      ...(n.parentId ? { parent_id: n.parentId } : {}),
      ...(n.style ? { style: n.style } : {}),
    }));

    const diagramEdges = edges.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      ...(e.sourceHandle ? { source_handle: e.sourceHandle } : {}),
      ...(e.targetHandle ? { target_handle: e.targetHandle } : {}),
      ...(e.label ? { label: e.label } : {}),
      ...(e.animated ? { animated: e.animated } : {}),
      ...(e.style ? { style: e.style } : {}),
    }));

    return {
      ...currentDiagram,
      nodes: diagramNodes,
      edges: diagramEdges,
    };
  }, [currentDiagram, nodes, edges]);

  const handleNew = useCallback(async () => {
    const name = prompt('Diagram name:', 'New Diagram');
    if (!name) return;
    try {
      const meta = await api.createDiagram({ name, description: '', tags: [] });
      const diagram = await api.getDiagram(meta.id);
      setCurrentDiagram(diagram);
      setNodes([]);
      setEdges([]);
      setDirty(false);
      setSelectedNode(null);
      refreshDiagramList();
    } catch (e) {
      alert('Failed to create diagram: ' + e.message);
    }
  }, [api, setNodes, setEdges, refreshDiagramList]);

  const handleOpen = useCallback(
    async (id) => {
      try {
        const diagram = await api.getDiagram(id);
        setCurrentDiagram(diagram);
        const { flowNodes, flowEdges } = diagramToFlow(diagram);
        setNodes(flowNodes);
        setEdges(flowEdges);
        setDirty(false);
        setSelectedNode(null);
      } catch (e) {
        alert('Failed to open diagram: ' + e.message);
      }
    },
    [api, diagramToFlow, setNodes, setEdges]
  );

  const handleSave = useCallback(async () => {
    const data = flowToDiagram();
    if (!data) {
      alert('No diagram open');
      return;
    }
    try {
      await api.saveDiagram(data.id, data);
      setDirty(false);
      refreshDiagramList();
    } catch (e) {
      alert('Failed to save: ' + e.message);
    }
  }, [api, flowToDiagram, refreshDiagramList]);

  const handleExport = useCallback(() => {
    const data = flowToDiagram();
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.name.replace(/\s+/g, '-').toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [flowToDiagram]);

  const handleTemplate = useCallback(
    async (templateId) => {
      try {
        const diagram = await api.createFromTemplate(templateId);
        setCurrentDiagram(diagram);
        const { flowNodes, flowEdges } = diagramToFlow(diagram);
        setNodes(flowNodes);
        setEdges(flowEdges);
        setDirty(false);
        setSelectedNode(null);
        refreshDiagramList();
      } catch (e) {
        alert('Failed to create from template: ' + e.message);
      }
    },
    [api, diagramToFlow, setNodes, setEdges, refreshDiagramList]
  );

  const handleNodeSelect = useCallback((node) => {
    setSelectedNode(node);
  }, []);

  const handleNodeUpdate = useCallback(
    (nodeId, updatedData) => {
      setNodes((nds) =>
        nds.map((n) => {
          if (n.id !== nodeId) return n;
          return {
            ...n,
            data: {
              ...n.data,
              label: updatedData.label,
              description: updatedData.description,
              custom_properties: updatedData.custom_properties,
            },
          };
        })
      );
      setDirty(true);
    },
    [setNodes]
  );

  const handleNodeDelete = useCallback(
    (nodeId) => {
      setNodes((nds) => nds.filter((n) => n.id !== nodeId));
      setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
      setSelectedNode(null);
      setDirty(true);
    },
    [setNodes, setEdges]
  );

  const handleDirty = useCallback(() => setDirty(true), []);

  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleSave]);

  return (
    <div className="app-container">
      <Toolbar
        currentDiagram={currentDiagram}
        onNew={handleNew}
        onOpen={handleOpen}
        onSave={handleSave}
        onExport={handleExport}
        onTemplate={handleTemplate}
        diagrams={diagramList}
        templates={templateList}
        dirty={dirty}
      />
      <div className="app-body">
        <NodePalette />
        <DiagramCanvas
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          setNodes={setNodes}
          setEdges={setEdges}
          onNodeSelect={handleNodeSelect}
          onDirty={handleDirty}
        />
        <PropertiesPanel selectedNode={selectedNode} onNodeUpdate={handleNodeUpdate} onNodeDelete={handleNodeDelete} />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ReactFlowProvider>
      <AppInner />
    </ReactFlowProvider>
  );
}
