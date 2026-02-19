import json

from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse

from backend.models import Diagram, DiagramMeta, CreateDiagramRequest
from backend.services.storage import DiagramStorage

router = APIRouter()
storage = DiagramStorage()


@router.get("/diagrams", response_model=list[DiagramMeta])
async def list_diagrams():
    return storage.list_diagrams()


@router.post("/diagrams", response_model=DiagramMeta)
async def create_diagram(request: CreateDiagramRequest):
    diagram = Diagram(
        name=request.name,
        description=request.description,
        tags=request.tags,
    )
    storage.save_diagram(diagram)
    return DiagramMeta(
        id=diagram.id,
        name=diagram.name,
        description=diagram.description,
        created_at=diagram.created_at,
        updated_at=diagram.updated_at,
        tags=diagram.tags,
        node_count=0,
        edge_count=0,
    )


@router.get("/diagrams/{diagram_id}")
async def get_diagram(diagram_id: str):
    try:
        diagram = storage.get_diagram(diagram_id)
        return JSONResponse(content=json.loads(diagram.model_dump_json()))
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Diagram not found")


@router.put("/diagrams/{diagram_id}")
async def update_diagram(diagram_id: str, diagram: Diagram):
    diagram.id = diagram_id
    storage.save_diagram(diagram)
    return JSONResponse(content=json.loads(diagram.model_dump_json()))


@router.delete("/diagrams/{diagram_id}")
async def delete_diagram(diagram_id: str):
    try:
        storage.get_diagram(diagram_id)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Diagram not found")
    storage.delete_diagram(diagram_id)
    return {"status": "deleted"}
