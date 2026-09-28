import React, { useState } from 'react';
import { Plus, MessageSquare, Trash2, Edit2, Check, X, FileText, Activity } from 'lucide-react';
import './Sidebar.css';

export default function Sidebar({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewChat,
  onRenameSession,
  onDeleteSession,
  onOpenUpload,
  isBackendHealthy,
}) {
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  const handleStartRename = (session, e) => {
    e.stopPropagation();
    setEditingId(session.id);
    setEditTitle(session.title);
  };

  const handleSaveRename = async (sessionId, e) => {
    e.stopPropagation();
    if (editTitle.trim()) {
      await onRenameSession(sessionId, editTitle.trim());
    }
    setEditingId(null);
  };

  const handleCancelRename = (e) => {
    e.stopPropagation();
    setEditingId(null);
  };

  const handleDelete = (sessionId, e) => {
    e.stopPropagation();
    if (window.confirm('Delete this conversation?')) {
      onDeleteSession(sessionId);
    }
  };

  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div className="sidebar-header">
        <div className="logo-badge">
          <Activity size={20} strokeWidth={2.5} />
        </div>
        <div className="brand-text">
          <h1>MedGuide</h1>
          <p>Drug & Medicine Info</p>
        </div>
      </div>

      {/* New Conversation Button */}
      <div className="sidebar-actions">
        <button className="new-chat-btn" onClick={onNewChat}>
          <Plus size={16} strokeWidth={2.5} />
          <span>New Conversation</span>
        </button>
      </div>

      {/* Recent Chats Section */}
      <div className="sidebar-section-title">Conversations</div>
      <div className="session-list">
        {sessions.length === 0 ? (
          <div className="empty-sessions">No conversations yet.<br />Start by asking a question!</div>
        ) : (
          sessions.map((s) => {
            const isActive = s.id === activeSessionId;
            const isEditing = s.id === editingId;

            return (
              <div
                key={s.id}
                className={`session-item ${isActive ? 'active' : ''}`}
                onClick={() => onSelectSession(s.id)}
              >
                <div className="session-title-wrap">
                  <MessageSquare size={14} className="flex-shrink-0" />
                  {isEditing ? (
                    <input
                      type="text"
                      className="session-edit-input"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveRename(s.id, e);
                        if (e.key === 'Escape') handleCancelRename(e);
                      }}
                      autoFocus
                    />
                  ) : (
                    <span className="session-title">{s.title || 'Untitled chat'}</span>
                  )}
                </div>

                <div className="session-actions">
                  {isEditing ? (
                    <>
                      <button
                        className="action-icon-btn"
                        title="Save"
                        onClick={(e) => handleSaveRename(s.id, e)}
                      >
                        <Check size={13} />
                      </button>
                      <button
                        className="action-icon-btn"
                        title="Cancel"
                        onClick={handleCancelRename}
                      >
                        <X size={13} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="action-icon-btn"
                        title="Rename"
                        onClick={(e) => handleStartRename(s, e)}
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        className="action-icon-btn delete"
                        title="Delete"
                        onClick={(e) => handleDelete(s.id, e)}
                      >
                        <Trash2 size={13} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer & Document Manager */}
      <div className="sidebar-footer">
        <button className="doc-manager-btn" onClick={onOpenUpload}>
          <FileText size={15} />
          <span>Upload Medicine PDF</span>
        </button>

        <div className="status-indicator">
          <div className={`status-dot ${isBackendHealthy ? 'online' : 'offline'}`} />
          <span>{isBackendHealthy ? 'Backend Connected' : 'Connecting to Server...'}</span>
        </div>
      </div>
    </aside>
  );
}
