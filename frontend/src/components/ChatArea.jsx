import React, { useRef, useEffect } from 'react';
import { Pill, Activity, Loader2, Sparkles, HelpCircle, ShieldCheck } from 'lucide-react';
import MessageItem from './MessageItem';
import ChatInput from './ChatInput';
import './ChatArea.css';

const SAMPLE_QUESTIONS = [
  {
    title: 'Crohn’s Disease Dosage',
    desc: 'What is the recommended dosage for Crohn’s disease?',
    question: 'What is the recommended dosage for Crohn’s disease?',
  },
  {
    title: 'Humira Side Effects',
    desc: 'What are the most common adverse reactions reported for Humira?',
    question: 'What are the common side effects and adverse reactions of Humira?',
  },
  {
    title: 'Rinvoq Administration',
    desc: 'How should Rinvoq be stored and administered to patients?',
    question: 'How should Rinvoq be stored, handled, and administered?',
  },
  {
    title: 'Skyrizi Warnings',
    desc: 'What are the warnings and precautions before taking Skyrizi?',
    question: 'What are the key warnings, precautions, and contraindications for Skyrizi?',
  },
];

export default function ChatArea({
  activeSession,
  messages,
  isLoading,
  onSendMessage,
  settings,
  onUpdateSettings,
  onOpenCitations,
}) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <main className="chat-area">
      {/* Header */}
      <header className="chat-header">
        <div className="chat-header-title">
          <h2>{activeSession?.title || 'Medical Q&A Assistant'}</h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="active-doc-badge">
            <ShieldCheck size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px', color: 'var(--accent-green)' }} />
            Verified Medical Documents
          </span>
        </div>
      </header>

      {/* Messages / Canvas */}
      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="welcome-screen animate-fade-in">
            <div className="welcome-icon-box">
              <Pill size={28} />
            </div>
            <h2>How can I help with your medicine questions?</h2>
            <p>
              Ask any question about indications, dosages, side effects, or precautions. Answers are retrieved directly from official prescribing information documents with exact page citations.
            </p>

            <div className="starter-grid">
              {SAMPLE_QUESTIONS.map((item, idx) => (
                <button
                  key={idx}
                  className="starter-card"
                  onClick={() => onSendMessage(item.question)}
                >
                  <h4>
                    <Sparkles size={14} />
                    <span>{item.title}</span>
                  </h4>
                  <p>{item.desc}</p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="messages-inner">
            {messages.map((msg, index) => (
              <MessageItem
                key={msg.id || index}
                message={msg}
                onOpenCitations={onOpenCitations}
              />
            ))}

            {isLoading && (
              <div className="loading-row animate-fade-in">
                <div className="message-avatar assistant">
                  <Activity size={18} strokeWidth={2.5} />
                </div>
                <div className="loading-indicator-box">
                  <Loader2 size={16} className="animate-pulse" color="var(--primary)" />
                  <span>Searching medical literature and composing answer...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Section */}
      <ChatInput
        onSendMessage={onSendMessage}
        isLoading={isLoading}
        settings={settings}
        onUpdateSettings={onUpdateSettings}
      />
    </main>
  );
}
