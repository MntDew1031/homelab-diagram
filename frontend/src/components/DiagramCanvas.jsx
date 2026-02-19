import React, { useCallback, useRef } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import HardwareNode from './nodes/HardwareNode';
import NetworkNode from './nodes/NetworkNode';
import KubernetesNode from './nodes/KubernetesNode';
import SoftwareNode from './nodes/SoftwareNode';
import { NODE_CATEGORIES } from '../utils/nodeTypes';

const nodeTypes = {
  hardware: HardwareNode,
  network: NetworkNode,
  kubernetes: KubernetesNode,
  software: SoftwareNode,
};

let nodeIdCounter = 0;
function getNextNodeId() {
  return `node_${Date.now()}_${nodeIdCounter++}`;
}

export default function DiagramCanvas({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  setNodes,
  setEdges,
  onNodeSelect,
  onDirty,
}) {
  const reactFlowWrapper = useRef(null);
  const { screenToFlowPosition } = useReactFlow();

  const onConnect = useCallback(
    (params) => {
      setEdges((eds) => addEdge({ ...params, animated: false }, eds));
      onDirty();
    },
    [setEdges, onDirty]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const dataStr = event.dataTransfer.getData('application/reactflow');
      if (!dataStr) return;

      const { type, subtype, icon } = JSON.parse(dataStr);
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const category = NODE_CATEGORIES[type];
      const subtypeInfo = category?.subtypes[subtype];

      const newNode = {
        id: getNextNodeId(),
        type,
        position,
        data: {
          label: subtypeInfo?.label || subtype,
          description: '',
          custom_properties: {},
          _nodeType: type,
          _nodeSubtype: subtype,
          _icon: icon,
        },
      };

      setNodes((nds) => nds.concat(newNode));
      onDirty();
    },
    [screenToFlowPosition, setNodes, onDirty]
  );

  const onSelectionChange = useCallback(
    ({ nodes: selectedNodes }) => {
      if (selectedNodes.length === 1) {
        onNodeSelect(selectedNodes[0]);
      } else {
        onNodeSelect(null);
      }
    },
    [onNodeSelect]
  );

  const handleNodesChange = useCallback(
    (changes) => {
      onNodesChange(changes);
      const hasMeaningfulChange = changes.some(
        (c) => c.type === 'position' || c.type === 'remove' || c.type === 'dimensions'
      );
      if (hasMeaningfulChange) onDirty();
    },
    [onNodesChange, onDirty]
  );

  const handleEdgesChange = useCallback(
    (changes) => {
      onEdgesChange(changes);
      const hasMeaningfulChange = changes.some((c) => c.type === 'remove');
      if (hasMeaningfulChange) onDirty();
    },
    [onEdgesChange, onDirty]
  );

  return (
    <div className="diagram-canvas" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onSelectionChange={onSelectionChange}
        nodeTypes={nodeTypes}
        fitView
        snapToGrid
        snapGrid={[15, 15]}
        deleteKeyCode={['Backspace', 'Delete']}
        multiSelectionKeyCode="Shift"
      >
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            const cat = NODE_CATEGORIES[node.type];
            return cat?.color || '#888';
          }}
          maskColor="rgba(0,0,0,0.1)"
        />
        <Background variant="dots" gap={15} size={1} color="#333" />
      </ReactFlow>
    </div>
  );
}
