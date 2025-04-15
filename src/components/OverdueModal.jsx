import React from 'react';
import './OverdueModal.css';

export default function OverdueModal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {children}
        <button className="modal-close" onClick={onClose}>Got it</button>
      </div>
    </div>
  );
}
