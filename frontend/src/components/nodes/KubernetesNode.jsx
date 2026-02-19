import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { getIcon } from '../../utils/icons';
import { NODE_CATEGORIES } from '../../utils/nodeTypes';

function KubernetesNode({ data, selected }) {
  const props = data.custom_properties || {};
  const color = data.color || NODE_CATEGORIES.kubernetes.color;
  return (
    <div
      className={`diagram-node kubernetes-node ${selected ? 'selected' : ''}`}
      style={{ borderColor: color }}
    >
      <Handle type="target" position={Position.Top} />
      <div className="node-header" style={{ backgroundColor: color }}>
        <span className="node-icon">{getIcon(data._icon || 'deployment')}</span>
        <span className="node-label">{data.label}</span>
      </div>
      <div className="node-body">
        {props.kind && <div className="node-prop">{props.kind}</div>}
        {props.namespace && <div className="node-prop">ns: {props.namespace}</div>}
        {props.replicas && <div className="node-prop">Replicas: {props.replicas}</div>}
        {props.image && <div className="node-prop">{props.image}</div>}
        {props.helm_chart && <div className="node-prop">Chart: {props.helm_chart}</div>}
      </div>
      <Handle type="source" position={Position.Bottom} />
      <Handle type="source" position={Position.Right} id="right" />
      <Handle type="target" position={Position.Left} id="left" />
    </div>
  );
}

export default memo(KubernetesNode);
