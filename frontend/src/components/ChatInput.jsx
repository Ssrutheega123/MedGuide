import React, { useState, useRef, useEffect } from 'react';
import { Send, SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react';
import './ChatInput.css';

export default function ChatInput({ onSendMessage, isLoading, settings, onUpdateSettings }) {
  const [input, setInput] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [input]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input.trim());
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="chat-input-wrapper">
      <div className="chat-input-box">
        <div className="input-main-row">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything about the medicines (e.g. dosage, side effects, precautions)..."
            className="chat-textarea"
            disabled={isLoading}
          />
          <button
            className="send-button"
            onClick={handleSubmit}
            disabled={!input.trim() || isLoading}
            title="Send question"
          >
            <Send size={15} />
          </button>
        </div>

        <div className="input-bottom-row">
          <button
            className="settings-toggle-btn"
            onClick={() => setShowSettings(!showSettings)}
          >
            <SlidersHorizontal size={13} />
            <span>Search & Model Settings</span>
            {showSettings ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>

          <span style={{ fontSize: '11px', color: 'var(--text-subtle)' }}>
            Press Enter ↵ to send
          </span>
        </div>

        {showSettings && (
          <div className="settings-panel animate-fade-in">
            <div className="setting-item">
              <label>Model:</label>
              <select
                className="setting-select"
                value={settings.model || 'openai/gpt-oss-120b'}
                onChange={(e) => onUpdateSettings({ ...settings, model: e.target.value })}
              >
                <option value="openai/gpt-oss-120b">GPT-OSS 120B (High Quality)</option>
                <option value="openai/gpt-oss-20b">GPT-OSS 20B (Fast)</option>
                <option value="qwen/qwen3.8-27b">Qwen 3.8 27B</option>
              </select>
            </div>

            <div className="setting-item">
              <label>Passages to Search (Top-K):</label>
              <select
                className="setting-select"
                value={settings.topK || 4}
                onChange={(e) => onUpdateSettings({ ...settings, topK: Number(e.target.value) })}
              >
                <option value={2}>2 Passages</option>
                <option value={4}>4 Passages (Recommended)</option>
                <option value={6}>6 Passages</option>
                <option value={8}>8 Passages</option>
              </select>
            </div>
          </div>
        )}
      </div>

      <p className="disclaimer-text">
        MedGuide provides answers based on the uploaded drug documentation. Always consult a licensed healthcare provider for medical advice.
      </p>
    </div>
  );
}
