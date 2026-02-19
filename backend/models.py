from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
import uuid


class Position(BaseModel):
    x: float
    y: float


class NodeData(BaseModel):
    label: str
    description: Optional[str] = ""
    custom_properties: dict = Field(default_factory=dict)


class DiagramNode(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    type: str  # "hardware", "network", "kubernetes", "software"
    subtype: str  # "server", "switch", "vlan", "pod", "container", etc.
    position: Position
    data: NodeData
    width: Optional[float] = None
    height: Optional[float] = None
    parent_id: Optional[str] = None
    style: Optional[dict] = None


class DiagramEdge(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    source: str
    target: str
    source_handle: Optional[str] = None
    target_handle: Optional[str] = None
    label: Optional[str] = None
    edge_type: Optional[str] = "default"
    style: Optional[dict] = None
    animated: bool = False


class Diagram(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: Optional[str] = ""
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    nodes: list[DiagramNode] = Field(default_factory=list)
    edges: list[DiagramEdge] = Field(default_factory=list)
    viewport: Optional[dict] = None
    tags: list[str] = Field(default_factory=list)


class DiagramMeta(BaseModel):
    id: str
    name: str
    description: Optional[str] = ""
    created_at: datetime
    updated_at: datetime
    tags: list[str] = Field(default_factory=list)
    node_count: int = 0
    edge_count: int = 0


class CreateDiagramRequest(BaseModel):
    name: str
    description: Optional[str] = ""
    tags: list[str] = Field(default_factory=list)
