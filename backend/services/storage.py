import json
import os
from pathlib import Path
from datetime import datetime

from backend.models import Diagram, DiagramMeta

DATA_DIR = Path(os.environ.get("DATA_DIR", "./data/diagrams"))


class DiagramStorage:
    def __init__(self, data_dir: Path = DATA_DIR):
        self.data_dir = data_dir
        self.data_dir.mkdir(parents=True, exist_ok=True)
        self.index_path = self.data_dir / "_index.json"
        if not self.index_path.exists():
            self._write_index([])

    def list_diagrams(self) -> list[DiagramMeta]:
        return [DiagramMeta(**d) for d in self._read_index()]

    def get_diagram(self, diagram_id: str) -> Diagram:
        path = self.data_dir / f"{diagram_id}.json"
        if not path.exists():
            raise FileNotFoundError(f"Diagram {diagram_id} not found")
        return Diagram(**json.loads(path.read_text()))

    def save_diagram(self, diagram: Diagram) -> None:
        diagram.updated_at = datetime.utcnow()
        path = self.data_dir / f"{diagram.id}.json"
        path.write_text(diagram.model_dump_json(indent=2))
        self._update_index(diagram)

    def delete_diagram(self, diagram_id: str) -> None:
        path = self.data_dir / f"{diagram_id}.json"
        path.unlink(missing_ok=True)
        self._remove_from_index(diagram_id)

    def _read_index(self) -> list[dict]:
        if not self.index_path.exists():
            return []
        return json.loads(self.index_path.read_text())

    def _write_index(self, entries: list[dict]) -> None:
        self.index_path.write_text(json.dumps(entries, indent=2, default=str))

    def _update_index(self, diagram: Diagram) -> None:
        entries = self._read_index()
        meta = DiagramMeta(
            id=diagram.id,
            name=diagram.name,
            description=diagram.description,
            created_at=diagram.created_at,
            updated_at=diagram.updated_at,
            tags=diagram.tags,
            node_count=len(diagram.nodes),
            edge_count=len(diagram.edges),
        )
        meta_dict = json.loads(meta.model_dump_json())
        entries = [e for e in entries if e["id"] != diagram.id]
        entries.append(meta_dict)
        self._write_index(entries)

    def _remove_from_index(self, diagram_id: str) -> None:
        entries = self._read_index()
        entries = [e for e in entries if e["id"] != diagram_id]
        self._write_index(entries)
