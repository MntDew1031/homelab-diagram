
<img width="1512" height="797" alt="Screenshot 2026-02-19 at 5 11 30 PM" src="https://github.com/user-attachments/assets/6a3a5015-d0cb-49eb-b766-cbb9b60a697b" />


# Homelab Diagram

A self-hosted, open-source web application for visually mapping out your entire homelab infrastructure. Whether you're running a single Raspberry Pi or a full rack of servers with Kubernetes, Homelab Diagram gives you a clean, interactive canvas to document it all.

![License](https://img.shields.io/badge/license-AGPL--3.0-blue)
![Docker](https://img.shields.io/docker/pulls/mntdew1031/homelab-diagram)

---

## What Is This?

If you've ever tried to explain your homelab setup to someone (or even to yourself six months later), you know how hard it is to keep track of what connects to what. Homelab Diagram solves that by giving you a drag-and-drop canvas where you can lay out every piece of your infrastructure — physical hardware, network topology, Kubernetes workloads, and software services — all in one place.

Everything runs in a single Docker container with no external database required. Your diagrams are saved as JSON files, making them easy to back up, version control, or migrate.

---

## Who Is This For?

- **Homelab enthusiasts** who want to document their setup visually
- **Sysadmins** managing a mix of physical and virtual infrastructure
- **Kubernetes users** who want to map out their cluster alongside the hardware it runs on
- **Anyone** who's ever drawn their network on a napkin and wished they had something better

---

## Features

### Node Categories
Build your diagram with four categories of components:

- **Hardware** — Servers, switches, routers, NAS devices, UPS, firewalls
- **Network** — VLANs, subnets, IP ranges
- **Kubernetes** — Namespaces, deployments, statefulsets, daemonsets, services, ingress, Helm releases, configmaps, secrets, PVCs
- **Software** — Containers, VMs, applications, databases

### Interactive Canvas
- **Drag and drop** components from the palette onto the canvas
- **Connect nodes** with edges to show relationships and data flow
- **Snap to grid** for clean, aligned layouts
- **Mini map** for navigating large diagrams
- **Zoom and pan** to focus on specific areas

### Customization
- **Custom node colors** — change any component to any color you want
- **Editable properties** — label, description, and type-specific fields (IP addresses, ports, replicas, etc.)
- **Custom properties** — add your own key-value metadata to any node

### Save and Export
- **Multiple diagrams** — create and switch between different diagrams
- **Auto-save** with `Ctrl+S` / `Cmd+S`
- **JSON export** — download your diagram as a portable JSON file
- **Persistent storage** — data survives container restarts via Docker volume

---

## Quick Start

### Docker Run

```bash
docker run -d \
  --name homelab-diagram \
  -p 6767:6767 \
  -v diagram-data:/data/diagrams \
  mntdew1031/homelab-diagram:latest
```

Open your browser to `http://localhost:6767`

### Docker Compose

```yaml
services:
  homelab-diagram:
    image: mntdew1031/homelab-diagram:latest
    pull_policy: always
    container_name: homelab-diagram
    ports:
      - "6767:6767"
    volumes:
      - diagram-data:/data/diagrams
    environment:
      - DATA_DIR=/data/diagrams
    restart: unless-stopped

volumes:
  diagram-data:
    driver: local
```

### TrueNAS SCALE

Paste the Docker Compose YAML above into the **Custom App** section. The app will be available on port `6767`.

---

## Use Cases

### Document Your Network
Map out your physical network — routers, switches, VLANs, subnets — and see how everything connects. Add IP addresses, VLAN IDs, and gateway info directly on each node.

### Map Your Kubernetes Cluster
Lay out your K8s workloads alongside the hardware they run on. Track deployments, services, ingress routes, Helm releases, and how they relate to each other.

### Plan Before You Build
Use Homelab Diagram to plan out new infrastructure before buying hardware or deploying services. Move things around, experiment with layouts, and export your plan.

### Share Your Setup
Export your diagram as JSON to share with others, back up to git, or reference later when troubleshooting at 2am.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, ReactFlow, Vite |
| Backend | Python, FastAPI, Uvicorn |
| Storage | JSON files (no database required) |
| Container | Docker (multi-stage build) |

---

## License

This project is licensed under the **GNU Affero General Public License v3.0 (AGPL-3.0)**.

You are free to use, modify, and distribute this software. If you run a modified version as a network service, you must make your source code available under the same license.

See [LICENSE](LICENSE) for full details.
