# RX RAG Starter (FastAPI + FAISS)

### What you get
- Ingest PDFs → clean text → chunk → embed (Sentence-Transformers) → FAISS index
- `/ask` endpoint: retrieval-augmented answer with **PDF page citations**
- `/ingest` endpoint: ingest PDFs from `data/pdfs`
- Works with **OpenAI** (if `OPENAI_API_KEY` is set) or **Ollama** (if `OLLAMA_MODEL` is set)

### Quickstart

#### 1) Backend API
```powershell
# In cts-main directory:
.\run.ps1
# Server runs on http://127.0.0.1:8000 (Swagger docs: http://127.0.0.1:8000/docs)
```

#### 2) Frontend UI
```powershell
# In cts-main directory:
.\run_frontend.ps1
# Web app runs on http://localhost:5173
```

### Notes
- No LLM training is required for RAG. You can add more PDFs anytime and re-run ingest.
- If you don’t set `OPENAI_API_KEY`, the server will try to use **Ollama** at `http://localhost:11434` with `OLLAMA_MODEL`.
