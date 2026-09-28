import React from 'react';
import { X, BookOpen, FileText } from 'lucide-react';
import './CitationModal.css';

export default function CitationModal({ citations, onClose }) {
  if (!citations || citations.length === 0) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card animate-fade-in" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            <BookOpen size={18} color="var(--primary)" />
            <span>Document Sources & Citations</span>
          </h3>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            This answer was generated using verified passages from the following medical documents:
          </p>

          {citations.map((c, i) => (
            <div key={i} className="citation-card">
              <div className="citation-header">
                <span className="citation-filename">
                  <FileText size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} />
                  {c.source}
                </span>
                <span className="citation-page">Page {c.page}</span>
              </div>
              {c.score !== undefined && (
                <div className="citation-score">
                  Relevance rank: #{c.rank || i + 1}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
