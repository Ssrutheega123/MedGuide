import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import UploadModal from './components/UploadModal';
import CitationModal from './components/CitationModal';
import {
  checkHealth,
  getSessions,
  getSession,
  createSession,
  renameSession,
  deleteSession,
  askQuestion,
} from './api/client';

export default function App() {
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [activeSession, setActiveSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isBackendHealthy, setIsBackendHealthy] = useState(false);

  // Settings for LLM & search
  const [settings, setSettings] = useState({
    model: 'openai/gpt-oss-120b',
    topK: 4,
  });

  // Modal States
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [activeCitationsModal, setActiveCitationsModal] = useState(null);

  // 1. Initial Health Check & Sessions Load
  useEffect(() => {
    const init = async () => {
      const health = await checkHealth();
      setIsBackendHealthy(health.ok === true);
      loadSessions();
    };
    init();

    const interval = setInterval(async () => {
      const health = await checkHealth();
      setIsBackendHealthy(health.ok === true);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  // 2. Fetch Sessions List
  const loadSessions = async () => {
    try {
      const data = await getSessions();
      setSessions(data);
    } catch (err) {
      console.error('Error fetching sessions:', err);
    }
  };

  // 3. Select a Session & Load its messages
  const handleSelectSession = async (sessionId) => {
    setActiveSessionId(sessionId);
    try {
      const sess = await getSession(sessionId);
      setActiveSession(sess);
      setMessages(sess.messages || []);
    } catch (err) {
      console.error('Error loading session:', err);
    }
  };

  // 4. Start New Chat
  const handleNewChat = () => {
    setActiveSessionId(null);
    setActiveSession(null);
    setMessages([]);
  };

  // 5. Send Question
  const handleSendMessage = async (questionText) => {
    if (!questionText.trim() || isLoading) return;

    // Optimistically add user message
    const userMsg = {
      role: 'user',
      content: questionText,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await askQuestion({
        question: questionText,
        sessionId: activeSessionId,
        topK: settings.topK,
        model: settings.model,
      });

      const assistantMsg = {
        role: 'assistant',
        content: response.answer,
        citations: response.citations || [],
        created_at: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMsg]);

      // If a new session was created implicitly on the backend
      if (response.session_id) {
        setActiveSessionId(response.session_id);
        loadSessions();
      }
    } catch (err) {
      const errorMsg = {
        role: 'assistant',
        content: `⚠️ **Error**: ${err.message || 'Something went wrong while contacting the medical assistant. Please ensure your backend is running.'}`,
        citations: [],
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // 6. Rename Session
  const handleRenameSession = async (sessionId, newTitle) => {
    try {
      await renameSession(sessionId, newTitle);
      await loadSessions();
      if (activeSessionId === sessionId) {
        setActiveSession((prev) => (prev ? { ...prev, title: newTitle } : null));
      }
    } catch (err) {
      console.error('Failed to rename session:', err);
    }
  };

  // 7. Delete Session
  const handleDeleteSession = async (sessionId) => {
    try {
      await deleteSession(sessionId);
      await loadSessions();
      if (activeSessionId === sessionId) {
        handleNewChat();
      }
    } catch (err) {
      console.error('Failed to delete session:', err);
    }
  };

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <Sidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={handleSelectSession}
        onNewChat={handleNewChat}
        onRenameSession={handleRenameSession}
        onDeleteSession={handleDeleteSession}
        onOpenUpload={() => setIsUploadOpen(true)}
        isBackendHealthy={isBackendHealthy}
      />

      {/* Main Chat Canvas */}
      <ChatArea
        activeSession={activeSession}
        messages={messages}
        isLoading={isLoading}
        onSendMessage={handleSendMessage}
        settings={settings}
        onUpdateSettings={setSettings}
        onOpenCitations={(citations) => setActiveCitationsModal(citations)}
      />

      {/* Upload PDF Modal */}
      {isUploadOpen && (
        <UploadModal
          onClose={() => setIsUploadOpen(false)}
          onUploadSuccess={() => {
            loadSessions();
          }}
        />
      )}

      {/* Citation Details Modal */}
      {activeCitationsModal && (
        <CitationModal
          citations={activeCitationsModal}
          onClose={() => setActiveCitationsModal(null)}
        />
      )}
    </div>
  );
}
