FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

FROM python:3.12-slim
WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ ./backend/
COPY --from=frontend-build /app/backend/static/ ./backend/static/

RUN mkdir -p /data/diagrams

ENV DATA_DIR=/data/diagrams
ENV HOST=0.0.0.0
ENV PORT=6767

EXPOSE 6767

CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "6767"]
