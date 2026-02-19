import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { getIcon } from '../../utils/icons';

function HardwareNode({ data, selected }) {
  const props = data.custom_properties || {};
  return (
    <div
      className={`diagram-node hardware-node ${selected ? 'selected' : ''}`}
      style={{ borderColor: '#3b82f6' }}
    >
      <Handle type="target" position={Position.Top} />
      <div className="node-header" style={{ backgroundColor: '#3b82f6' }}>
        <span className="node-icon">{getIcon(data._icon || 'server')}</span>
        <span className="node-label">{data.label}</span>
      </div>
      <div className="node-body">
        {props.hostname && <div className="node-prop">Host: {props.hostname}</div>}
        {props.ip_addresses && <div className="node-prop">IP: {String(props.ip_addresses)}</div>}
        {props.role && <div className="node-prop">Role: {props.role}</div>}
        {props.cpu && <div className="node-prop">CPU: {props.cpu}</div>}
        {props.ram && <div className="node-prop">RAM: {props.ram}</div>}
      </div>
      <Handle type="source" position={Position.Bottom} />
      <Handle type="source" position={Position.Right} id="right" />
      <Handle type="target" position={Position.Left} id="left" />
    </div>
  );
}

export default memo(HardwareNode);
