# Multi-stage Dockerfile for Unified Full-Stack MedGuide

# Stage 1: Build React Frontend
FROM node:22-alpine AS frontend-builder
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Python FastAPI Backend + Built Frontend
FROM python:3.12-slim
WORKDIR /app

# Install build dependencies for FAISS / C++ libraries
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code, data, and compiled frontend assets
COPY backend/ ./backend/
COPY data/ ./data/
COPY --from=frontend-builder /frontend/dist ./frontend/dist

ENV PORT=8000
EXPOSE 8000

CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
