import React, { useState, useRef } from 'react';
import { X, UploadCloud, File, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { uploadPdf } from '../api/client';
import './UploadModal.css';

export default function UploadModal({ onClose, onUploadSuccess }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.name.toLowerCase().endsWith('.pdf')) {
        setSelectedFile(file);
        setStatusMessage(null);
      } else {
        setStatusMessage({ type: 'error', text: 'Please choose a PDF file.' });
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.name.toLowerCase().endsWith('.pdf')) {
        setSelectedFile(file);
        setStatusMessage(null);
      } else {
        setStatusMessage({ type: 'error', text: 'Please choose a PDF file.' });
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setStatusMessage(null);

    try {
      const res = await uploadPdf(selectedFile);
      setStatusMessage({
        type: 'success',
        text: `Success! "${selectedFile.name}" has been uploaded and added to the medical library.`,
      });
      setSelectedFile(null);
      if (onUploadSuccess) onUploadSuccess(res);
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text: err.message || 'Could not upload PDF. Please check server connection.',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card animate-fade-in" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            <UploadCloud size={20} color="var(--primary)" />
            <span>Add Medicine PDF</span>
          </h3>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Upload package inserts, FDA drug labels, or medical literature. The system will automatically index it so you can ask questions right away.
          </p>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="application/pdf"
            style={{ display: 'none' }}
          />

          <div
            className={`upload-zone ${isDragging ? 'dragging' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="upload-icon-wrap">
              <UploadCloud size={24} />
            </div>
            <h4>Click or drag PDF here</h4>
            <p>Supports .pdf files up to 25MB</p>
          </div>

          {selectedFile && (
            <div className="selected-file-info">
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <File size={16} color="var(--primary)" />
                {selectedFile.name}
              </span>
              <button
                style={{ color: 'var(--text-subtle)', padding: '2px' }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedFile(null);
                }}
              >
                <X size={14} />
              </button>
            </div>
          )}

          {statusMessage && (
            <div className={`status-box ${statusMessage.type} animate-fade-in`}>
              {statusMessage.type === 'success' ? (
                <CheckCircle2 size={16} />
              ) : (
                <AlertCircle size={16} />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose} disabled={isUploading}>
            Close
          </button>
          <button
            className="btn-primary"
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 size={15} className="animate-pulse" />
                <span>Indexing PDF...</span>
              </>
            ) : (
              <span>Upload and Index</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
