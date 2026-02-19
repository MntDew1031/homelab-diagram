import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { getIcon } from '../../utils/icons';

function NetworkNode({ data, selected }) {
  const props = data.custom_properties || {};
  return (
    <div
      className={`diagram-node network-node ${selected ? 'selected' : ''}`}
      style={{ borderColor: '#22c55e' }}
    >
      <Handle type="target" position={Position.Top} />
      <div className="node-header" style={{ backgroundColor: '#22c55e' }}>
        <span className="node-icon">{getIcon(data._icon || 'subnet')}</span>
        <span className="node-label">{data.label}</span>
      </div>
      <div className="node-body">
        {props.vlan_id && <div className="node-prop">VLAN: {props.vlan_id}</div>}
        {props.subnet && <div className="node-prop">Subnet: {props.subnet}</div>}
        {props.gateway && <div className="node-prop">GW: {props.gateway}</div>}
      </div>
      <Handle type="source" position={Position.Bottom} />
      <Handle type="source" position={Position.Right} id="right" />
      <Handle type="target" position={Position.Left} id="left" />
    </div>
  );
}

export default memo(NetworkNode);
