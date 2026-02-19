from fastapi import APIRouter
from fastapi.responses import JSONResponse

from backend.models import Diagram, DiagramNode, DiagramEdge, Position, NodeData
from backend.services.storage import DiagramStorage
import json

router = APIRouter()
storage = DiagramStorage()

TEMPLATES = {
    "k3s-homelab": {
        "name": "K3s Homelab",
        "description": "A starter template with k3s cluster nodes, AI stack, and monitoring",
        "tags": ["k3s", "homelab"],
    },
    "blank": {
        "name": "Blank Diagram",
        "description": "Empty diagram to start from scratch",
        "tags": [],
    },
}


def build_k3s_homelab_template() -> Diagram:
    nodes = [
        DiagramNode(
            id="hw-node1",
            type="hardware",
            subtype="server",
            position=Position(x=100, y=80),
            data=NodeData(
                label="k3s-node-1",
                description="K3s worker node",
                custom_properties={
                    "hostname": "k3s-node-1",
                    "role": "k3s-worker",
                    "os": "Debian 12",
                },
            ),
        ),
        DiagramNode(
            id="hw-node2",
            type="hardware",
            subtype="server",
            position=Position(x=350, y=80),
            data=NodeData(
                label="k3s-node-2",
                description="K3s worker node",
                custom_properties={
                    "hostname": "k3s-node-2",
                    "role": "k3s-worker",
                    "os": "Debian 12",
                },
            ),
        ),
        DiagramNode(
            id="hw-node3",
            type="hardware",
            subtype="server",
            position=Position(x=600, y=80),
            data=NodeData(
                label="k3s-node-3",
                description="K3s worker node (GPU)",
                custom_properties={
                    "hostname": "k3s-node-3",
                    "role": "k3s-worker",
                    "gpu": "Intel iGPU",
                    "os": "Debian 12",
                },
            ),
        ),
        DiagramNode(
            id="hw-truenas",
            type="hardware",
            subtype="nas",
            position=Position(x=850, y=80),
            data=NodeData(
                label="TrueNAS",
                description="TrueNAS storage server",
                custom_properties={
                    "hostname": "truenas",
                    "role": "NAS / Apps",
                },
            ),
        ),
        DiagramNode(
            id="net-lan",
            type="network",
            subtype="subnet",
            position=Position(x=350, y=0),
            data=NodeData(
                label="LAN",
                description="Home network",
                custom_properties={
                    "subnet": "10.0.0.0/24",
                },
            ),
        ),
        DiagramNode(
            id="k8s-ns-ai",
            type="kubernetes",
            subtype="namespace",
            position=Position(x=50, y=300),
            width=500,
            height=200,
            data=NodeData(
                label="ai-stack",
                description="AI workloads namespace",
                custom_properties={"namespace": "ai-stack"},
            ),
        ),
        DiagramNode(
            id="k8s-ollama",
            type="kubernetes",
            subtype="statefulset",
            position=Position(x=80, y=360),
            parent_id="k8s-ns-ai",
            data=NodeData(
                label="Ollama",
                description="LLM inference server",
                custom_properties={
                    "kind": "StatefulSet",
                    "replicas": 3,
                    "image": "ollama/ollama:latest",
                    "ports": ["11434"],
                },
            ),
        ),
        DiagramNode(
            id="k8s-openwebui",
            type="kubernetes",
            subtype="helmrelease",
            position=Position(x=330, y=360),
            parent_id="k8s-ns-ai",
            data=NodeData(
                label="Open WebUI",
                description="Web interface for Ollama",
                custom_properties={
                    "kind": "HelmRelease",
                    "helm_chart": "open-webui",
                    "ports": ["30080"],
                },
            ),
        ),
        DiagramNode(
            id="k8s-ns-monitoring",
            type="kubernetes",
            subtype="namespace",
            position=Position(x=600, y=300),
            width=350,
            height=200,
            data=NodeData(
                label="monitoring",
                description="Monitoring namespace",
                custom_properties={"namespace": "monitoring"},
            ),
        ),
        DiagramNode(
            id="k8s-prometheus",
            type="kubernetes",
            subtype="helmrelease",
            position=Position(x=630, y=360),
            parent_id="k8s-ns-monitoring",
            data=NodeData(
                label="kube-prometheus-stack",
                description="Prometheus + Grafana",
                custom_properties={
                    "kind": "HelmRelease",
                    "helm_chart": "kube-prometheus-stack",
                    "grafana_port": 30090,
                },
            ),
        ),
    ]

    edges = [
        DiagramEdge(
            id="e-webui-ollama",
            source="k8s-openwebui",
            target="k8s-ollama",
            label="HTTP :11434",
        ),
        DiagramEdge(
            id="e-ollama-gpu",
            source="k8s-ollama",
            target="hw-node3",
            label="GPU scheduling",
            animated=True,
        ),
        DiagramEdge(
            id="e-lan-node1",
            source="net-lan",
            target="hw-node1",
            edge_type="network",
        ),
        DiagramEdge(
            id="e-lan-node2",
            source="net-lan",
            target="hw-node2",
            edge_type="network",
        ),
        DiagramEdge(
            id="e-lan-node3",
            source="net-lan",
            target="hw-node3",
            edge_type="network",
        ),
        DiagramEdge(
            id="e-lan-truenas",
            source="net-lan",
            target="hw-truenas",
            edge_type="network",
        ),
    ]

    return Diagram(
        name="K3s Homelab",
        description="K3s cluster with AI stack and monitoring",
        nodes=nodes,
        edges=edges,
        tags=["k3s", "homelab"],
        viewport={"x": 0, "y": 0, "zoom": 0.85},
    )


@router.get("/templates")
async def list_templates():
    return [
        {"id": key, **value}
        for key, value in TEMPLATES.items()
    ]


@router.post("/diagrams/from-template/{template_id}")
async def create_from_template(template_id: str):
    if template_id not in TEMPLATES:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Template not found")

    if template_id == "k3s-homelab":
        diagram = build_k3s_homelab_template()
    else:
        diagram = Diagram(
            name=TEMPLATES[template_id]["name"],
            description=TEMPLATES[template_id]["description"],
            tags=TEMPLATES[template_id]["tags"],
        )

    storage.save_diagram(diagram)
    return JSONResponse(content=json.loads(diagram.model_dump_json()))
