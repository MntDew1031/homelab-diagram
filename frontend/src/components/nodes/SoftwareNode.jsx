import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { getIcon } from '../../utils/icons';

function SoftwareNode({ data, selected }) {
  const props = data.custom_properties || {};
  return (
    <div
      className={`diagram-node software-node ${selected ? 'selected' : ''}`}
      style={{ borderColor: '#f97316' }}
    >
      <Handle type="target" position={Position.Top} />
      <div className="node-header" style={{ backgroundColor: '#f97316' }}>
        <span className="node-icon">{getIcon(data._icon || 'app')}</span>
        <span className="node-label">{data.label}</span>
      </div>
      <div className="node-body">
        {props.version && <div className="node-prop">v{props.version}</div>}
        {props.port && <div className="node-prop">Port: {props.port}</div>}
        {props.url && <div className="node-prop">{props.url}</div>}
        {props.image && <div className="node-prop">{props.image}</div>}
      </div>
      <Handle type="source" position={Position.Bottom} />
      <Handle type="source" position={Position.Right} id="right" />
      <Handle type="target" position={Position.Left} id="left" />
    </div>
  );
}

export default memo(SoftwareNode);
