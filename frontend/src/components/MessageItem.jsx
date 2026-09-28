import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { User, Activity, Copy, Check, BookOpen } from 'lucide-react';
import './MessageItem.css';

export default function MessageItem({ message, onOpenCitations }) {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const citations = Array.isArray(message.citations) ? message.citations : [];

  return (
    <div className={`message-row ${isUser ? 'user' : 'assistant'} animate-fade-in`}>
      <div className={`message-avatar ${isUser ? 'user' : 'assistant'}`}>
        {isUser ? <User size={18} /> : <Activity size={18} strokeWidth={2.5} />}
      </div>

      <div className="message-content-wrap">
        <div className="message-header">
          <span className="message-author">{isUser ? 'You' : 'MedGuide Assistant'}</span>
          <button className="copy-btn" onClick={handleCopy} title="Copy text">
            {copied ? (
              <>
                <Check size={12} color="var(--accent-green)" />
                <span style={{ color: 'var(--accent-green)' }}>Copied</span>
              </>
            ) : (
              <>
                <Copy size={12} />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        <div className="message-body">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {message.content}
          </ReactMarkdown>
        </div>

        {!isUser && citations.length > 0 && (
          <div className="citations-badge-container">
            <span style={{ fontSize: '11px', color: 'var(--text-subtle)', fontWeight: 600, marginRight: '4px' }}>
              Sources:
            </span>
            {citations.map((c, idx) => (
              <button
                key={idx}
                className="citation-pill"
                onClick={() => onOpenCitations(citations)}
                title={`View details for ${c.source} page ${c.page}`}
              >
                <BookOpen size={11} />
                <span>{c.source.replace('.pdf', '')} (p. {c.page})</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
