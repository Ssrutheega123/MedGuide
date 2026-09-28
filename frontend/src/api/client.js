/**
 * API client to connect the frontend with the FastAPI backend.
 */

export async function checkHealth() {
  try {
    const res = await fetch('/health');
    if (!res.ok) throw new Error('Health check failed');
    return await res.json();
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

export async function getSessions() {
  const res = await fetch('/sessions');
  if (!res.ok) throw new Error('Failed to load chat sessions');
  return await res.json();
}

export async function getSession(sessionId) {
  const res = await fetch(`/sessions/${sessionId}`);
  if (!res.ok) throw new Error('Failed to load session details');
  return await res.json();
}

export async function createSession(title = 'New conversation') {
  const res = await fetch('/sessions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });
  if (!res.ok) throw new Error('Failed to create session');
  return await res.json();
}

export async function renameSession(sessionId, title) {
  const res = await fetch(`/sessions/${sessionId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });
  if (!res.ok) throw new Error('Failed to rename session');
  return await res.json();
}

export async function deleteSession(sessionId) {
  const res = await fetch(`/sessions/${sessionId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete session');
  return await res.json();
}

export async function askQuestion({ question, sessionId, topK = 4, provider = 'auto', model = null }) {
  const res = await fetch('/ask', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      question,
      session_id: sessionId || null,
      top_k: topK,
      provider,
      model,
    }),
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.detail || 'Failed to get answer from assistant');
  }
  return await res.json();
}

export async function uploadPdf(file) {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch('/upload', {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.detail || 'PDF upload failed');
  }
  return await res.json();
}

export async function ingestPdfs() {
  const res = await fetch('/ingest', { method: 'POST' });
  if (!res.ok) throw new Error('Ingestion failed');
  return await res.json();
}
