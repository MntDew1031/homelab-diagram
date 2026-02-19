import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { getIcon } from '../../utils/icons';

function KubernetesNode({ data, selected }) {
  const props = data.custom_properties || {};
  return (
    <div
      className={`diagram-node kubernetes-node ${selected ? 'selected' : ''}`}
      style={{ borderColor: '#a855f7' }}
    >
      <Handle type="target" position={Position.Top} />
      <div className="node-header" style={{ backgroundColor: '#a855f7' }}>
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
